# LXC

## 簡介

LXC (Linux Containers) runs multiple Linux systems virtually on a single Linux kernel. Provides userspace interface for kernel containment features with powerful API and simple tools for creating and managing system or application containers.

## 學習資源

### 文章

#### 1. What is LXC? - Linux Containers
> 原文：[https://linuxcontainers.org/lxc/introduction/](https://linuxcontainers.org/lxc/introduction/)

**什麼是 LXC**

LXC 是「Linux 核心容器化功能的使用者空間介面」，讓用戶通過 API 和簡單工具創建和管理系統或應用程式容器。

**定位**

LXC 容器介於 chroot 環境和完整虛擬機之間，無需獨立核心實例即可提供容器功能。

**使用的核心功能**

| 功能 | 說明 |
|------|------|
| **Kernel Namespaces** | ipc、uts、mount、pid、network、user 命名空間隔離 |
| **AppArmor / SELinux** | 安全配置文件 |
| **Seccomp** | 安全計算模式，限制系統呼叫 |
| **Chroots** | 使用 pivot_root 的根目錄切換 |
| **Kernel Capabilities** | 核心能力控制 |
| **CGroups** | 控制組，資源限制和隔離 |

**組成部分**
- 核心庫（liblxc）
- 語言綁定：Python、Lua、Go、Ruby、Haskell
- 標準控制工具
- 發行版模板

**優勢**：輕量級容器化，提供容器功能而無需傳統虛擬化的開銷，同時維護近乎標準的 Linux 環境。

### 影片

- [Getting Started with LXD Containerization](https://www.youtube.com/watch?v=aIwgPKkVj8s)
- [Getting Started with LXC containers](https://youtu.be/CWmkSj_B-wo)

### 其他資源

- [LXC Documentation](https://linuxcontainers.org/lxc/documentation/)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
