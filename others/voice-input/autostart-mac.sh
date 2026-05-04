#!/usr/bin/env bash
# Manage the macOS LaunchAgent that runs voice-input on login.
#
# Usage:
#   ./autostart-mac.sh install    # install + load
#   ./autostart-mac.sh uninstall  # unload + remove
#   ./autostart-mac.sh status     # show plist + launchctl state
#
# After install, grant Microphone + Accessibility permissions to the
# venv Python binary in System Settings → Privacy & Security.
# Logs: ~/Library/Logs/voice-input.log (stdout), .err (stderr)

set -e
cd "$(dirname "$0")"
HERE="$(pwd)"

LABEL="com.user.voice-input"
PLIST="$HOME/Library/LaunchAgents/${LABEL}.plist"
LOG_DIR="$HOME/Library/Logs"
PYTHON="${HERE}/venv/bin/python"
APP="${HERE}/app.py"

cmd="${1:-}"

case "$cmd" in
  install)
    if [ ! -x "$PYTHON" ]; then
      echo "venv not found at $PYTHON. Run ./setup-mac.sh first." >&2
      exit 1
    fi
    mkdir -p "$LOG_DIR" "$(dirname "$PLIST")"

    cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${PYTHON}</string>
    <string>${APP}</string>
  </array>
  <key>WorkingDirectory</key>
  <string>${HERE}</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <dict>
    <key>SuccessfulExit</key>
    <false/>
  </dict>
  <key>StandardOutPath</key>
  <string>${LOG_DIR}/voice-input.log</string>
  <key>StandardErrorPath</key>
  <string>${LOG_DIR}/voice-input.err</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PYTHONUNBUFFERED</key>
    <string>1</string>
  </dict>
</dict>
</plist>
EOF

    launchctl unload "$PLIST" >/dev/null 2>&1 || true
    launchctl load -w "$PLIST"
    echo "[done] installed: $PLIST"
    echo "[note] tail logs:    tail -f $LOG_DIR/voice-input.log $LOG_DIR/voice-input.err"
    echo "[note] uninstall:    ./autostart-mac.sh uninstall"
    echo
    echo "First-run permissions: open System Settings → Privacy & Security."
    echo "Grant Microphone + Accessibility to:"
    echo "  $PYTHON"
    ;;
  uninstall)
    if [ -f "$PLIST" ]; then
      launchctl unload "$PLIST" >/dev/null 2>&1 || true
      rm -f "$PLIST"
      echo "[done] removed $PLIST"
    else
      echo "[skip] no plist at $PLIST"
    fi
    ;;
  status)
    if [ -f "$PLIST" ]; then
      echo "[plist] $PLIST"
    else
      echo "[plist] (not installed)"
    fi
    echo "[launchctl]"
    launchctl list | grep -E "(PID|$LABEL)" || echo "  not loaded"
    ;;
  *)
    echo "Usage: $0 {install|uninstall|status}" >&2
    exit 1
    ;;
esac
