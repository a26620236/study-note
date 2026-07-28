# Kubernetes 基礎架構：從 Cluster 到 Container 與 VM

> 從 Kubernetes cluster 架構圖出發，往下拆解到 Compute Machine、Container Runtime，
> 再延伸到 Container vs VM、Hypervisor、kernel 共用等底層概念。
> 圖片來源：Kubernetes 官方文件與 Red Hat 架構圖。

## 目錄

- [Kubernetes Cluster 架構總覽](#kubernetes-cluster-架構總覽)
- [Compute Machine 內部堆疊](#compute-machine-內部堆疊)
- [部署方式的演進：Traditional → VM → Container](#部署方式的演進traditional--vm--container)
- [Hypervisor 是什麼](#hypervisor-是什麼)
- [Container 的核心：共用 Host Kernel](#container-的核心共用-host-kernel)
- [VM vs Container 總比較](#vm-vs-container-總比較)

---

## Kubernetes Cluster 架構總覽

![Kubernetes cluster 架構圖](images/k8s_cluster.png)

Kubernetes cluster 的本質是「**一群電腦組成的團隊**」，分成兩種角色：

- **Control Plane**：管理層的機器——只指揮、不跑你的應用程式
- **Compute Machines（Worker Nodes）**：幹活的機器——你的 app（container）全部跑在這裡

### 用工程公司比喻

| 圖中元件 | 比喻 | 實際工作 |
|---|---|---|
| Control Plane | 總部辦公室 | 接單、排班、記帳，自己不搬磚 |
| kube-apiserver | 總機／櫃台 | 所有指令（`kubectl`）都從這裡進來 |
| kube-scheduler | 派工主管 | 決定「這個工作交給哪台機器做」 |
| kube-controller-manager | 監工 | 盯著現場，人手不夠就補、做錯就修正 |
| etcd | 檔案室 | 記錄整個 cluster 的所有狀態 |
| **Compute Machine** | **一個工人** | **實際執行工作（跑 container）** |
| kubelet | 工人耳朵上的對講機 | 聽總部指令「跑這 3 個 pod」，並回報狀況 |
| kube-proxy | 工人之間的電話線 | 處理網路，讓流量能正確找到 pod |

**注意**：Compute Machine 不是電腦裡的某個零件，它就是**一整台電腦**（實體伺服器或 VM）。
圖中 compute machine 框的疊影表示這種機器有**很多台**。

### 圖中其他元件

- **Persistent storage**：container 是用完即丟的，資料要活得比 container 久就得放這裡
- **Container registry**：存放 container image 的倉庫（如 Docker Hub、GCP Artifact Registry）
- **Underlying infrastructure**：cluster 底下的機器可以是實體機、VM、私有雲、公有雲或混合雲——K8s 不在乎底層是什麼

### 部署一個服務的完整流程

1. 你把指令送到 Control Plane（`kubectl apply` → kube-apiserver）
2. kube-scheduler 挑一台有餘裕的 compute machine
3. 那台機器上的 kubelet 收到通知
4. kubelet 叫 container runtime 從 container registry 拉 image
5. 跑起來變成 Pod

**自癒能力的來源**：某台機器掛了 → kube-controller-manager 發現 pod 數量不對 → 叫 scheduler 找別台機器重跑一份。

### 層級關係

```
Cluster ⊃ Node（一台電腦）⊃ Pod ⊃ Container ⊃ 你的 app
```

Pod 是 K8s 調度的**最小單位**——一個小盒子，裡面裝一個（偶爾多個）container。K8s 從不直接管 container，它管的是 pod。

---

## Compute Machine 內部堆疊

每一台 compute machine 的內部長這樣：

```
一台 Compute Machine（= 一台電腦）
├── Hardware（或 VM 的虛擬硬體）
├── Operating System（Linux，有 kernel）
├── Container Runtime（如 containerd）
│   └── Pod → Containers        ← 你的 app 在這
├── kubelet      ← 額外裝的 K8s 代理人
└── kube-proxy   ← 額外裝的 K8s 網路元件
```

其中 **Container Runtime** 這一層，就是下一張圖的主角——要理解它，得先回頭看部署方式的演進。

---

## 部署方式的演進：Traditional → VM → Container

![Traditional vs Virtualized vs Container Deployment](images/container.png)

### Traditional Deployment（傳統部署）

App 直接跑在實體機的 OS 上。問題：多個 app 搶同一台機器的資源、互相干擾；一個 app 一台機器又太浪費。

### Virtualized Deployment（虛擬化部署）

在硬體之上用 **Hypervisor** 切出多台 VM，每台 VM 有自己**完整的 Guest OS**，app 之間強隔離。

### Container Deployment（容器化部署）

Container 之間共用**同一個 OS kernel**，每個 container 只打包 App + Bin/Library，由 **Container Runtime** 負責管理。

### Bin/Library 是什麼

**Bin**（binaries）和 **Library** 指的是 app 運行時依賴的環境：

- **Bin**：編譯好的執行檔與工具，例如 `bash`、`curl`、`node`，放在 `/bin`、`/usr/bin`
- **Library**：共享函式庫，例如 `glibc`（C 標準庫）、`libssl`，放在 `/lib`、`/usr/lib`

App 不是一個檔案就能跑起來的，它需要這一整組依賴。兩種部署方式的關鍵差異在於**這層依賴跟著誰**：

- **VM**：Bin/Library 裝在每台 VM 的 Guest OS 裡
- **Container**：每個 container 自己打包一份 Bin/Library（**這就是 Docker image 的內容物**），但共用底下同一個 kernel。所以同一台主機上，一個 container 用 Ubuntu 的函式庫、另一個用 Alpine 的，互不干擾

---

## Hypervisor 是什麼

Hypervisor（又叫 VMM，Virtual Machine Monitor）是**專門用來創造和管理 VM 的軟體**。它把一台實體機的硬體資源（CPU、記憶體、硬碟、網卡）切分、模擬成多套「虛擬硬體」，讓多個 OS 同時跑在同一台機器上，且彼此以為自己獨佔整台電腦。

主要負責三件事：

1. **資源分配**：每台 VM 分到幾顆 CPU、多少記憶體
2. **隔離**：VM 之間互不干擾——A 掛了不拖垮 B，A 讀不到 B 的記憶體
3. **指令攔截**：Guest OS 以為自己直接操作硬體，實際上敏感操作都被 hypervisor 攔截，安全地轉給真實硬體

### Type 1 vs Type 2

```
Type 1:  硬體 → Hypervisor → VM們             （資料中心、雲端）
Type 2:  硬體 → Host OS → Hypervisor → VM們   （個人開發測試）
```

| | Type 1（Bare-metal 裸機型） | Type 2（Hosted 寄居型） |
|---|---|---|
| 位置 | 直接裝在硬體上，自己就是最底層 | 像一般 app 裝在現有 OS 上 |
| 效能 | 好 | 多一層，較差 |
| 例子 | VMware ESXi、Hyper-V、KVM、Xen | VirtualBox、VMware Fusion、Parallels |
| 使用場景 | AWS EC2、GCP 等雲端底層 | 個人電腦開發測試 |

### 模糊地帶：現代 kernel 整合式虛擬化

Mac 上的 Docker Desktop 用 macOS 內建的 **Virtualization.framework** 先開一台 Linux VM，container 才跑在裡面。這算 Type 2 嗎？

- **通常歸類為 Type 2**：有 Host OS（macOS）在底下，VM 跑在它之上
- **但嚴格說是模糊地帶**：真正的虛擬化能力內建在 macOS kernel（XNU）裡，直接使用 CPU 的硬體虛擬化功能（Apple Silicon 的 EL2、Intel VT-x），不是老 Type 2 那種純軟體模擬

這跟 Linux 的 **KVM** 同一種模式——kernel module 載入後，整個 kernel 本身變成 hypervisor。有人稱之為 Type 1.5 或 hybrid：

- 像 Type 2：有完整的通用 OS 在跑
- 像 Type 1：虛擬化直接在 kernel／硬體層級執行，沒有多穿一層的效能損失

對照：Windows 的 Hyper-V 是真正的 Type 1，啟用後 **Windows 自己會被降格成一台 VM**（root partition）跑在 Hyper-V 之上，所以 WSL2 的 Linux 和 Windows 桌面其實是平級的兩台 VM。

> 面試場合答「Type 2」是安全的，但可以補充：現代 kernel 整合式虛擬化（KVM、Hypervisor.framework、Hyper-V）已讓這個 1970 年代的分類法不太夠用，實務上更重要的是虛擬化是否由硬體加速、kernel 直接支援。

---

## Container 的核心：共用 Host Kernel

> 「Container 不生成整個 OS kernel，透過直接調用 OS kernel」這句話的意思。

### 先懂 kernel 在幹嘛

Kernel 是 OS 最底層的程式，**唯一有權直接操作硬體的人**。App 做任何真正的事——開檔案、要記憶體、送封包——都必須透過 **system call** 拜託 kernel 代勞：

```
App：「我要開啟 /data/log.txt」
   ↓ system call: open()
kernel：操作磁碟驅動程式，把檔案內容讀給你
```

一個程式要能跑，背後一定要有一個 kernel 在服務它。問題只是：**這個 kernel 是誰的？**

### VM：自己生成一個 kernel

VM 開機時，Guest OS 在記憶體裡完整載入並啟動一個**屬於自己的 kernel**。System call 路徑很長：

```
App → Guest kernel → 虛擬硬體 → Hypervisor → Host 真實硬體
```

每台 VM 都要養一個 kernel：開機花時間、常駐吃幾百 MB 到數 GB 記憶體。

### Container：直接用宿主機的 kernel

Container 裡面**沒有 kernel**。裡面的 app 發出 system call 時，接電話的就是**宿主機本人的 kernel**：

```
App（在 container 裡）→ Host kernel → 硬體
```

路徑跟直接在宿主機跑一個普通程式**一模一樣**。Container 本質上只是宿主機上的一個**被隔離的 process**，靠 Linux kernel 兩個機制實現：

- **namespaces**：讓 process「看不到」別人——有自己的檔案系統視角、網路、process 列表
- **cgroups**：限制它能用多少 CPU、記憶體

所以：

- **不用開機**——container「啟動」只是 fork 一個 process，秒級甚至毫秒級
- **體積小**——image 只需要 App + Bin/Library，不用塞 kernel 和整套 OS
- **沒有效能損耗**——system call 走原生路徑，不穿越虛擬硬體層

### 親手驗證：container 沒有自己的 kernel

在 Linux 主機上跑一個 Ubuntu container，看它的 kernel 版本：

```bash
# 宿主機（假設是 Debian，kernel 6.1.0）
$ uname -r
6.1.0-18-amd64

$ docker run ubuntu uname -r
6.1.0-18-amd64        # ← 跟宿主機一模一樣！
```

明明是「Ubuntu」container，回報的卻是宿主機的 kernel。因為 Ubuntu image 只是一包 Ubuntu 風格的檔案（apt、glibc、目錄結構——也就是 Bin/Library），kernel 從頭到尾都是宿主機那一個。

### 天生限制

Container 必須跟宿主機用**同一種 kernel**：Linux container 只能跑在 Linux kernel 上。
這就是為什麼 Mac 跑 Docker 要先開一台 Linux VM 墊底。

---

## VM vs Container 總比較

核心差異一句話：**VM 虛擬化的是「硬體」，Container 虛擬化的是「作業系統」**。

| | Virtual Machine | Container |
|---|---|---|
| 隔離層 | Hypervisor 模擬虛擬硬體 | Container Runtime 利用 kernel 功能隔離 |
| 作業系統 | 每台 VM 有完整 Guest OS（含 kernel） | 所有 container 共用宿主機 kernel |
| 體積 | GB 等級 | MB 等級（只有 App + Bin/Library） |
| 啟動速度 | 分鐘等級（要開機） | 秒級（只是啟動一個 process） |
| 隔離強度 | 強（連 kernel 都獨立） | 較弱（kernel 被攻破影響全部 container） |
| 資源開銷 | 每台 VM 養一份 OS | 幾乎只有 app 本身 |
| 跨 OS | 可以（Linux 主機跑 Windows VM） | 不行（必須同種 kernel） |

**實務上兩者不互斥**：雲端環境通常是「VM 裡面跑 container」——用 VM 做租戶間的強隔離，用 container 做應用程式的打包與部署。Kubernetes 管理的就是 container 這一層。
