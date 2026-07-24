import subprocess
import argparse
from datetime import datetime


def run_git_command(cmd):
    """執行 git 指令並回傳輸出內容"""
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"Git command failed: {' '.join(cmd)}\n{result.stderr}")
    return result.stdout.strip()


def generate_diff_report(base_branch, feature_branch, output_file="code_review_summary.md"):
    # 確保抓到最新遠端分支
    print("Fetching remote branches...")
    run_git_command(["git", "fetch", "origin", base_branch, feature_branch])

    # 取得變動檔案列表（PR 視角，含重新命名/複製偵測）
    print("Generating diff file list...")
    diff_files_output = run_git_command([
        "git", "diff", "-M", "-C", "--name-status", f"origin/{base_branch}...origin/{feature_branch}"
    ])

    changed_files = []
    if diff_files_output:
        for line in diff_files_output.splitlines():
            parts = line.split("\t")
            status = parts[0]
            if status.startswith(("R", "C")) and len(parts) >= 3:
                old_path, new_path = parts[1], parts[2]
                display = f"{old_path} → {new_path}"
            elif len(parts) >= 2:
                display = parts[1]
            else:
                display = ""
            changed_files.append((status, display))

    # 取得完整 diff（PR 視角，含重新命名/複製偵測）
    print("Generating full diff...")
    # 取得 merge-base（建議用遠端追蹤分支，與前面的 fetch 邏輯一致）
    merge_base = run_git_command([
        "git", "merge-base", f"origin/{base_branch}", f"origin/{feature_branch}"
    ])

    # 以 merge-base 為起點產生 diff（雙點）
    full_diff_output = run_git_command([
        "git", "diff", f"{merge_base}..origin/{feature_branch}"
    ])

    # 組 Markdown 內容
    content = []
    content.append("# Code Review Report")
    content.append(f"- **Base Branch**: {base_branch}")
    content.append(f"- **Feature Branch**: {feature_branch}")
    content.append(f"- **Generated At**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    content.append("")

    content.append("## Changed Files")
    if changed_files:
        for status, filename in changed_files:
            content.append(f"- `{filename}` ({status})")
    else:
        content.append("No changes found.")
    content.append("")

    content.append("## Diff Details")
    if full_diff_output:
        content.append("```diff")
        content.append(full_diff_output)
        content.append("```")
    else:
        content.append("No diff content.")

    # 寫入檔案
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("\n".join(content))

    print(f"✅ Diff report generated: {output_file}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate a code review markdown report from git diff.")
    parser.add_argument("--base", required=True, help="Base branch (e.g., develop)")
    parser.add_argument("--feature", required=True, help="Feature branch (e.g., lt-1722)")
    parser.add_argument("--output", default="code_review_summary.md", help="Output markdown file")

    args = parser.parse_args()
    generate_diff_report(args.base, args.feature, args.output)
