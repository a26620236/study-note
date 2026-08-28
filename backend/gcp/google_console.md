# Google Cloud Console 分類導覽：一個 GKE 服務會用到的所有設定

> 情境：web 服務跑在 GKE 上，CI/CD 用 Cloud Build，image 放 Artifact Registry，資料庫用 Cloud SQL（PostgreSQL）。
> 本篇按 console 左側選單的分類，逐一說明每一頁「能看什麼、能設定什麼、在整體部署流程中扮演什麼角色」。
> K8s 基礎概念（cluster、Pod、control plane）見 [infrastructure](../k8s/infrastructure.md)；CI/CD 的通用骨架見 [k8s CI/CD pipeline](../k8s/k8s_CI_pipeline.md)。

## 全景圖：這些分類怎麼串成一條流程

```
git push ──► Cloud Build ──► Artifact Registry ──► GKE Workloads（rolling update）
（GitHub）   build & push       存放 image            ▲ pull image
                                                     │
使用者 ──► DNS ──► 固定 IP ＋ Load Balancer ──► Ingress ──► Service ──► Pod
```

- **設定與機密**：ConfigMaps / K8s Secrets（cluster 內）、Secret Manager（GCP 全域保險箱）
- **資料**：Cloud SQL（交易資料庫）、Cloud Storage（檔案）、BigQuery（分析）
- **觀測**：Logs Explorer——上面每個服務的 log 都匯流到這裡
- **權限**：IAM 與 Service Accounts——上面每個箭頭背後都是它在放行

## 目錄

- [Workloads](#workloads)
- [Services & Ingress](#services--ingress)
- [ConfigMaps 與 Secrets](#configmaps-與-secrets)
- [Cloud Build](#cloud-build)
- [Artifact Registry——Docker Image 倉庫](#artifact-registrydocker-image-倉庫)
- [Cloud SQL——PostgreSQL](#cloud-sqlpostgresql)
- [Secret Manager](#secret-manager)
- [網路：固定 IP 與 Load Balancer](#網路固定-ip-與-load-balancer)
- [Cloud Storage 與 BigQuery](#cloud-storage-與-bigquery)
- [Logs Explorer——集中日誌](#logs-explorer集中日誌)
- [IAM 與 Service Accounts](#iam-與-service-accounts)

---

## Workloads

位置：左側選單 **Kubernetes Engine → Workloads**。這一頁列出專案內「所有 cluster」正在跑的 workload（Deployment、StatefulSet、DaemonSet、Job、CronJob），是日常確認服務健不健康、部署有沒有成功最常打開的頁面。如果 cluster 是工廠，這頁就是產線監控室的儀表牆：每條產線開了幾台機器、有沒有停機，一眼看完。

### 這一頁能看到什麼

列表欄位包含 Name、Status（綠勾 OK / 紅色 error，如 `CrashLoopBackOff`、`ImagePullBackOff`）、Type、Pods（ready/total）、Namespace、Cluster。幾個特性：

- **跨 cluster 彙總**：不是單一 cluster 的視角，記得用上方 filter 過濾 cluster / namespace / type
- **預設隱藏系統 workload**（`kube-system` 那些），要看得自己調 filter
- **只顯示最上層資源**：列表裡看得到 Deployment，但看不到它底下的 ReplicaSet 和 Pod，要點進去才看得到

| Workload 類型 | 用途 | 在本情境的例子 |
| --- | --- | --- |
| Deployment | 無狀態服務，維持 N 份可互相取代的 Pod，支援 rolling update | web 前後端服務本體 |
| StatefulSet | 有狀態服務，Pod 有固定編號、各自綁 Persistent Volume | 自架 Redis/Kafka（DB 已交給 Cloud SQL，通常用不到） |
| DaemonSet | 每個 node 各跑一份 | log/monitoring agent（GKE 多半系統自帶） |
| Job | 跑完就結束的一次性任務 | DB schema migration |
| CronJob | 按 cron 排程反覆產生 Job | 每晚報表、清資料 |

### 點進單一 workload 的詳細頁

| 分頁 | 內容 |
| --- | --- |
| Overview | Pod 副本數與狀態、CPU / Memory / Disk 用量圖表、active revisions、container 與目前跑的 image 版本 |
| Details | labels / selectors、annotations、update strategy、autoscaler 設定、Pod spec |
| Observability | 完整 metrics dashboard（背後是 Cloud Monitoring） |
| Logs | container logs（背後是 Cloud Logging，可跳轉 Logs Explorer 下 query） |
| Events | K8s events，除錯第一站：`FailedScheduling`、`ImagePullBackOff` 都在這 |
| YAML | 目前 live 的完整 YAML，可直接線上編輯 |
| Revision history | 每次 rollout 的 revision 清單，對應 ReplicaSet 歷史 |

**部署失敗的除錯順序**通常是：Overview 看 Pod ready 數 → Events 看錯誤原因 → Logs 看 container 有沒有噴 error。

### 能做什麼操作（Actions 選單）

Deployment 詳細頁右上的 **Actions** 提供常用操作：

- **Scale**：手動調 replicas 數
- **Autoscale**：建立 HPA，設定 min/max replicas 與目標 CPU 使用率
- **Rolling update**：指定新的 image tag，觸發滾動更新
- **Expose**：快速建一個 Service 把服務對外（實務上 Service 通常也是 YAML 管理）
- 另外可在 YAML 分頁直接編輯 spec（改 env、requests/limits 都走這裡），或整個刪除 workload

Rollback 在 console 上主要靠 Revision history「查」，實際回滾常用 `kubectl rollout undo`，或用 Rolling update 指回舊的 image tag。

資源設定面：image 版本、resource requests/limits、環境變數（含 `configMapRef` / `secretRef` 來源）都能在 Details / YAML 分頁看到；console 沒有獨立的環境變數編輯器，要改就是改 YAML——而正規流程應該是改 repo 裡的 manifest。

> **Console 手改 = 製造 drift。** 在這頁 scale、改 YAML 之後，Git repo 裡的 manifest 和 cluster 實況就不一致了——下次 pipeline 更新 image、或有人把 repo 裡的 manifest `kubectl apply` 回來時，手改的內容就會被蓋掉。緊急止血可以，事後務必回頭改 repo。

> **HPA 依 CPU % 擴縮的分母是 resource requests**：沒設 requests 的 Deployment，HPA 算不出使用率，不會動作。另外 Autopilot cluster 沒寫 requests 會被自動補預設值，並以此計費。

> **`latest` tag 不會觸發 rolling update**：重 push 同名 tag 時 Pod spec 沒變，K8s 認為沒事發生。CI/CD 一律打不可變 tag（如 commit SHA）。

### 與 kubectl 的對照

Console 上的每個操作背後都對應 Kubernetes API，也就都有等價的 kubectl 指令：

| Console 操作 | 等同的 kubectl |
| --- | --- |
| Workloads 列表 | `kubectl get deployments -A`（以及 `get sts,ds,jobs,cronjobs`） |
| Actions → Scale | `kubectl scale deployment web-app --replicas=5` |
| Actions → Rolling update | `kubectl set image deployment/web-app web-app=asia-east1-docker.pkg.dev/PROJECT/my-repo/web-app:v2` |
| Revision history / 回滾 | `kubectl rollout history deployment/web-app` / `kubectl rollout undo deployment/web-app` |
| YAML 分頁編輯 | `kubectl edit deployment web-app` |
| Actions → Autoscale | `kubectl autoscale deployment web-app --min=2 --max=10 --cpu-percent=70` |

### 在整體部署流程中的角色

在「Cloud Build 建 image → push 到 Artifact Registry → 更新 Deployment 的 image tag」這條 pipeline 裡，Workloads 頁扮演的是**驗證與急救現場**：pipeline 跑完後，來這裡確認新 revision 的 Pod 全部 ready、Events 沒有 `ImagePullBackOff`、Logs 沒有開機就崩。日常「改」的動作留給 pipeline 和 repo，這頁主要負責「看」——加上出事時的手動 scale 與緊急回滾。

參考：[GKE in the Google Cloud console（官方文件）](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/dashboards)

---

## Services & Ingress

位置：左側選單 **Kubernetes Engine → Gateways, Services & Ingress**（在 GKE 區塊的 Networking 分類下，舊名 Services & Ingress，因為加入 Gateway API 而改名）。這一頁管理的是「流量怎麼進到你的 Pod」：Service 負責給一組 Pod 一個穩定入口，Ingress 負責把外部 HTTP(S) 流量依 host/path 分配到不同 Service。

### 在這一頁能看到什麼

頁面分成三個 tab：**Gateways**、**Services**、**Ingress**。

- **Services** tab：每個 Service 的名稱、類型（ClusterIP / NodePort / LoadBalancer）、Cluster IP、External endpoints（有對外 IP 的話會顯示，可直接點開）、對應的 Pod 數量
- **Ingress** tab：每個 Ingress 的對外 IP、綁定的 backend services、健康狀態（backend 是否通過 health check）
- **Gateways** tab：用 Gateway API 建立的資源（新專案 Google 建議直接用這個，見下方）

點進單一 Service / Ingress 還能看到 YAML、events、以及它背後自動建立的 GCP Load Balancer 連結。

### Service：給一組 Pod 一個穩定的入口

Pod 是「用完即丟」的——rolling update、node 重開、HPA 擴縮都會讓 Pod IP 改變。Service 就像公司的總機號碼：員工（Pod）會換人換分機，但對外號碼永遠不變，打進來的電話會自動轉給目前在線的人（透過 label selector 找到活著的 Pod）。

| 類型 | 可及範圍 | 典型用途 |
|---|---|---|
| **ClusterIP**（預設） | 只有 cluster 內部可以連 | 內部服務互打，例如 web 後端連 internal API |
| **NodePort** | 每台 node 的固定 port（30000–32767）對外開放 | 很少直接用，多半是 LoadBalancer / Ingress 的底層機制 |
| **LoadBalancer** | 公網（或內網）IP，cluster 外可直連 | 需要 L4 直接對外的服務，如 TCP/gRPC、非 HTTP 協定 |

在 GKE 上把 Service 設成 `type: LoadBalancer`，GKE 會**自動幫你建立一個 GCP passthrough Network Load Balancer（L4）**——你不用去 Network services 手動開，它就出現在那邊了。

> **常見坑**：每個 `type: LoadBalancer` 的 Service 都會生出一顆獨立的 LB（各自計費、各自一個 IP）。如果你有多個 HTTP 服務，不要每個都開 LoadBalancer，用一個 Ingress 統一收流量再分流，省錢也好管理。

### Ingress：L7 的 HTTP(S) 路由

Service 是 L4（只認 IP 和 port），Ingress 是 L7——它看得懂 HTTP，可以依 **host**（`api.example.com` vs `www.example.com`）或 **path**（`/api` vs `/`）把流量導到不同 Service。像百貨公司一樓的樓層導覽：一個大門進來，依你要去的櫃位（host/path）指到不同樓層（Service）。

在 GKE 建立 Ingress，GKE 會自動生成一顆 **GCP external Application Load Balancer（global）**——走 Google 邊緣網路的 GFE，天生就是全球 anycast 入口。

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
  annotations:
    kubernetes.io/ingress.global-static-ip-name: "web-ip"   # 綁預先保留的 global 固定 IP
    networking.gke.io/managed-certificates: "web-cert"      # 綁 Google-managed SSL 憑證
spec:
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-app-svc
                port:
                  number: 80
```

實務上正式環境的 Ingress 一定會加上例中那兩個 annotation：綁 **global 靜態 IP**（不綁的話用臨時 IP，重建就換號）與 **Google-managed SSL 憑證**（自動簽發、自動續期，不用自己顧 certbot）。固定 IP 的 global vs regional 之分、憑證簽發前要先設 DNS 的順序坑，統一整理在[網路：固定 IP 與 Load Balancer](#網路固定-ip-與-load-balancer)章。

### Gateway API：Ingress 的下一代

Console 選單改名成「Gateways, Services & Ingress」就是因為它。Gateway API 是 Kubernetes 官方的下一代流量入口標準（角色拆分更清楚：平台團隊管 Gateway、應用團隊管 HTTPRoute），GKE Ingress 目前處於維護模式、只修 bug 不加新功能，Google 建議新專案直接用 Gateway API。既有的 Ingress 不用急著搬，但新服務可以評估直接上 Gateway。

### 在整體部署流程中的角色

CI/CD 把新 image 部署成新的 Pod 之後，是 Service 讓流量無縫切到新 Pod（IP 換了但入口不變），是 Ingress 讓使用者從同一個網址一路打進來。而這裡建立的 Ingress / LoadBalancer Service，背後生成的 GCP Load Balancer 和 IP 都會出現在 **Network services** 那邊——LB 類型的完整比較與固定 IP 的管理，見「網路：固定 IP 與 Load Balancer」章節。

參考資料：[GKE Ingress for Application Load Balancers](https://cloud.google.com/kubernetes-engine/docs/concepts/ingress)、[Set up an external ALB with Ingress](https://cloud.google.com/kubernetes-engine/docs/tutorials/http-balancer)、[Deploying Gateways](https://docs.cloud.google.com/kubernetes-engine/docs/how-to/deploying-gateways)

---

## ConfigMaps 與 Secrets

位置在左側選單 **Kubernetes Engine → Secrets & ConfigMaps**（舊版 console 叫「Configuration」，[官方文件](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/dashboards)已改為現名）。這一頁集中列出 cluster 裡所有的 ConfigMap 與 Secret 物件，也就是「應用程式的設定值與敏感資料」——讓同一個 image 在不同環境跑出不同行為的關鍵。

### ConfigMap：把設定從 image 抽出來

ConfigMap 存放**非敏感**的 key-value 設定：API endpoint、feature flag、log level、整份 nginx.conf 之類的設定檔。核心理念是「build 一次、到處部署」：image 只包程式碼，設定留在 cluster 裡。同一個 `web-app:v1.2.3` image，dev cluster 掛 dev 的 ConfigMap、prod 掛 prod 的，不用為每個環境重 build image。

生活比喻：image 是同一台咖啡機，ConfigMap 是每家分店自己貼在機器上的「今日濃度設定」便利貼。

### Secret：base64 只是編碼，不是加密

K8s Secret 用來放 DB 密碼、API key、TLS 憑證。它跟 ConfigMap 結構幾乎一樣，只差在值以 base64 存放——**但 base64 是編碼（encoding）不是加密（encryption）**，任何能讀 Secret 物件的人一行指令就能還原：

```bash
kubectl get secret db-secret -o jsonpath='{.data.password}' | base64 -d
# super-secret-password
```

> **重點警告**：Secret 的「安全」完全依賴 RBAC 權限控管，而不是 base64。誰能 `get secret`，誰就等於看到明文。GKE 預設會在儲存層（etcd）加密，但這防的是 Google 機房層級的威脅，防不了拿到 cluster 讀取權限的人。

### 掛進 Pod 的兩種方式

| 方式 | 寫法 | 適合 | 更新行為 |
|---|---|---|---|
| **環境變數** | `env` / `envFrom` | 少量零散設定值 | Pod 啟動時讀一次，之後**永遠不更新** |
| **Volume mount** | `volumes` + `volumeMounts` | 整份設定檔（nginx.conf、.env） | kubelet 會延遲同步（約一分鐘內），但 app 要自己 reload |

```yaml
# 方式一：環境變數
containers:
  - name: web-app
    envFrom:
      - configMapRef:
          name: app-config        # 整包 ConfigMap 變成 env vars
    env:
      - name: DB_PASSWORD
        valueFrom:
          secretKeyRef:
            name: db-secret
            key: password
```

```yaml
# 方式二：volume mount（每個 key 變成一個檔案）
containers:
  - name: web-app
    volumeMounts:
      - name: config-vol
        mountPath: /etc/config
volumes:
  - name: config-vol
    configMap:
      name: app-config
```

### Console 這頁能看到 / 設定什麼

- **看到**：所有 ConfigMap 與 Secret 的清單（含 namespace、type、建立時間），也包含系統層級的資源如 service account token。點進去可看 ConfigMap 的 key-value 內容；**Secret 的值在 console 詳細頁預設不顯示**，只列出 key。
- **設定**：點進單一資源後可用 YAML 編輯器直接修改 key-value、加減 key，或刪除整個物件。也能從這頁確認某個 ConfigMap 有沒有真的部署上去（CI/CD 出問題時很好用）。
- 實務上這頁多半當**唯讀查詢工具**：正式修改應該走 Git 裡的 YAML + CI/CD，直接在 console 手改會讓 cluster 狀態跟 repo 不一致（configuration drift）。

### 常見坑：改了 ConfigMap，Pod 不會自動重啟

這是最常踩的坑。更新 ConfigMap 後：

- **env var 方式**：舊 Pod 完全吃不到新值，必須手動觸發 rolling restart：

```bash
kubectl rollout restart deployment web-app
```

- **volume mount 方式**：檔案內容會被 kubelet 更新，但有延遲（最長約一分鐘），且應用程式要有 watch/reload 機制才會真的生效。
- **例外**：volume mount 若用了 `subPath`，檔案**永遠不會**自動更新——這是官方文件明講的限制。

> 實務解法：把 ConfigMap 內容的 hash 放進 Deployment 的 pod annotation（Helm 常見寫法 `checksum/config`），設定一改 hash 就變，自動觸發 rollout。

### 與 Secret Manager 的分工

一句話：**K8s Secret 只適合 cluster 內、低敏感度的黏合設定；真正的機密（Cloud SQL 密碼、金流 API key）放 GCP 的 Secret Manager**——它有版本控制、單一 secret 粒度的 IAM 與存取稽核，且跨 cluster / 跨服務共用。兩者的完整比較表，以及怎麼把 Secret Manager 的內容掛進 Pod，見 [Secret Manager](#secret-manager) 章。

---

## Cloud Build

位置：Console 左側選單 **CI/CD 分類 → Cloud Build**（底下有 Dashboard、History、Triggers、Repositories、Settings 等頁面）。這是 GCP 的 managed CI/CD 服務——聽到 repo 有 code 變動，就自動執行你定義好的 build 步驟：build image → 推上 Artifact Registry → 部署到 GKE。

### 和 Jenkins 對照

概念上就是 GCP 版的 Jenkins / GitHub Actions（通用流程對照 [k8s CI/CD pipeline 筆記](../k8s/k8s_CI_pipeline.md)），但你完全不用養伺服器：

| 面向 | Jenkins | Cloud Build |
|---|---|---|
| 基礎設施 | 自己架 master + agent，要維護、更新 | Serverless，Google 幫你跑 |
| 計費 | 機器成本（24 小時開著） | 按 build 分鐘計費，每月 2,500 分鐘免費額度（e2-standard-2），超過約 $0.006/分鐘 |
| Pipeline 定義 | Jenkinsfile（Groovy） | `cloudbuild.yaml`（YAML） |
| 擴充方式 | 裝 plugin | 每個 step 直接指定一個 container image（builder） |
| 和 GCP 整合 | 要自己設 credentials | 內建 service account，用 IAM 授權 |

### cloudbuild.yaml：每個 step 是一個 container

核心概念：**一個 step = 跑一個 container**。`name` 指定用哪個 image（如 `gcr.io/cloud-builders/docker`），`args` 是要執行的指令。所有 step 共用 `/workspace` 目錄（你的 source code 就在裡面），所以前一步 build 出來的東西下一步拿得到。

```yaml
steps:
  # 1. Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'asia-east1-docker.pkg.dev/$PROJECT_ID/my-repo/web-app:$SHORT_SHA', '.']

  # 2. Push to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'asia-east1-docker.pkg.dev/$PROJECT_ID/my-repo/web-app:$SHORT_SHA']

  # 3. Deploy to GKE (update the Deployment's image)
  - name: 'gcr.io/cloud-builders/kubectl'
    args: ['set', 'image', 'deployment/web-app',
           'web-app=asia-east1-docker.pkg.dev/$PROJECT_ID/my-repo/web-app:$SHORT_SHA']
    env:
      - 'CLOUDSDK_COMPUTE_REGION=asia-east1'
      - 'CLOUDSDK_CONTAINER_CLUSTER=my-cluster'
```

不想等 git push，也可以從本機手動觸發（測 pipeline 很好用）：

```bash
gcloud builds submit --config cloudbuild.yaml .
```

> **常見坑**：step 之間只共享 `/workspace` 的「檔案」，**環境變數不會跨 step 傳遞**。另外 build 預設 timeout 為 60 分鐘（上限 24 小時），大型專案或會跑完整測試的 build 若可能超過，記得在 yaml 頂層加 `timeout: '5400s'` 之類的設定。

### Triggers：什麼事件會啟動 build

在 **Triggers** 頁面設定「監聽哪個 repo 的哪種事件」。連接 repo 在 **Repositories** 頁面完成，目前主流是 **2nd gen / Developer Connect** 連接方式（1st gen 還在但屬 legacy），支援 GitHub、GitHub Enterprise、GitLab、Bitbucket。

| Trigger 事件類型 | 觸發時機 | 典型用途 |
|---|---|---|
| Push to a branch | push 到指定 branch（支援 regex，如 `^main$`） | 部署到 production / staging |
| Push new tag | 打 tag（如 `v.*`） | 正式版 release |
| Pull request | 開 PR / PR 更新 | 跑 test、lint，過了才准 merge |
| Manual invocation | 手動按 Run | 臨時重跑、debug |
| Webhook / Pub/Sub | 外部系統呼叫 | 跨系統串接 |

**Substitution variables**：yaml 裡的變數。內建的有 `$PROJECT_ID`、`$COMMIT_SHA`、`$SHORT_SHA`、`$BRANCH_NAME`、`$TAG_NAME`；自訂變數**必須以底線開頭**（如 `_ENV=staging`），在 trigger 設定頁填值，同一份 yaml 就能給 staging / production 兩個 trigger 共用。

> **Cloud Source Repositories 已棄用**（2024 年起不開放新客戶），repo 就放 GitHub/GitLab 用連接的方式即可，不要再考慮把 code 搬進 GCP。

### Console 能看什麼、能設什麼

- **看**：Dashboard（各 trigger 最近的 build 狀態）、History（每次 build 的成功/失敗、耗時、**每個 step 各自的 log**——debug 失敗的 build 就是來這裡逐 step 看）、Triggers 列表、已連接的 Repositories。
- **設**：Trigger（repo、事件、branch regex、substitution variables、用哪個 service account）、build 用的 machine type（build 太慢可以加大）、Settings 裡開關 service account 對其他服務的存取權。

### 權限：Cloud Build 用誰的身分跑

Build 是以 trigger 上指定的 **service account** 身分執行的（新舊專案的預設 SA 不同，詳見 IAM 章）；正式環境建議替 pipeline 建一個專用 SA、在 trigger 上指定，權限給到最小。這條 pipeline 至少需要 `roles/artifactregistry.writer`（push image）與 `roles/container.developer`（部署 GKE）——完整的角色彙總見 [IAM 與 Service Accounts](#iam-與-service-accounts) 章。

> **最常見的第一次失敗**：build 到 push 或 deploy 那一步噴 `PERMISSION_DENIED`，九成是 service account 少了上面其中一個角色。去 IAM 頁面把角色補給 build 用的 service account 即可。

### 在整體部署流程中的角色

Cloud Build 是整條自動化流程的「發動機」，串起 repo、Artifact Registry 和 GKE：

```
git push (GitHub)
   → Cloud Build Trigger 被喚醒
   → 依 cloudbuild.yaml 逐 step 執行：
       docker build → docker push（進 Artifact Registry）
   → kubectl set image（GKE 滾動更新 Deployment）
   → GKE 從 Artifact Registry 拉新 image，換上新版
```

前面 Workloads 章看到的 Deployment 滾動更新，起點就是這裡的最後一個 step。

---

## Artifact Registry——Docker Image 倉庫

位置：Console 左側導覽選單 →「CI/CD」分類 →「Artifact Registry」（跟 Cloud Build 是鄰居，用頂端搜尋列直接打名字更快）。這是 GCP 的私有 artifact 倉庫服務——在整條部署流程裡，它就是 K8s 架構圖中「container registry」的那個角色：Cloud Build 把 build 好的 image push 進來，GKE 的 node 再從這裡 pull image 來跑 Pod。

### 前身 Container Registry（gcr.io）已正式關閉

> **重要**：舊服務 Container Registry（`gcr.io`）已於 **2025 年 3 月 18 日起正式關閉**，現在一律使用 Artifact Registry，image 路徑是 `*-docker.pkg.dev`。網路上教學若寫 `gcr.io/PROJECT/IMAGE`，就知道是過時資料，路徑要自己換成 Artifact Registry 格式。（Google 有提供讓 `gcr.io` 網域轉由 Artifact Registry 代管的過渡方案，但那是給老專案遷移用的，新專案別再碰。）
>
> 一個看似矛盾的例外：Google 官方提供的 builder / connector image（`gcr.io/cloud-builders/docker`、`gcr.io/cloud-sql-connectors/cloud-sql-proxy`⋯）仍以 `gcr.io` 網域發布——那是 Google 自家用 Artifact Registry 代管 gcr.io 網域的結果。關閉的是「你自己專案的 Container Registry」，官方 image 路徑照用沒問題，本筆記的範例也沿用官方路徑。

### 不只 Docker：支援的 format

一個 repository 只能放一種 format，建立時就要選定：

| Format | 放什麼 | 備註 |
|---|---|---|
| Docker | container image、Helm chart（OCI 格式） | 最常用，本章主角 |
| npm | JS/TS package | 公司要蓋私有 npm registry 就是用這個 |
| Maven | Java/Kotlin package | |
| Python | pip package | |
| Go | Go module | |
| Apt / Yum | Linux OS package | |
| Generic | 任意檔案（有版本化） | 簡化版的檔案倉庫 |

### 建立 Repository 時能設定什麼

| 設定項 | 選項 | 說明 |
|---|---|---|
| Format | Docker / npm / … | 建立後不能改 |
| Mode | Standard / Remote / Virtual | 見下表 |
| Region | 如 `asia-east1` | **選跟 GKE cluster 同一個 region：pull 快、又省跨區 egress 網路費** |
| Immutable tags | 開 / 關 | 開啟後同一個 tag 永遠指向同一個 digest，不能被覆蓋 |
| Cleanup policies | 規則清單 | 自動刪舊 image，見下方 |

| Mode | 用途 | 比喻 |
|---|---|---|
| Standard | 存放自己 push 的 artifact（最常用） | 自家倉庫 |
| Remote | 代理並快取外部來源（如 Docker Hub）的 pull-through cache | 代購 + 囤貨 |
| Virtual | 把多個 standard / remote repo 聚合成單一入口 | 總機窗口 |

> **Remote repo 實務上很好用**：Docker Hub 對匿名 pull 有 rate limit，CI 尖峰時常因此失敗；讓 Cloud Build / GKE 改透過 remote repo 抓 base image 就能避開。
>
> **Immutable tags 的坑**：開啟後，CI 若習慣每次都 push `:latest` 會直接被拒。這個選項適合搭配「每次 build 用唯一 tag（例如 commit SHA）」的流程，好處是杜絕 tag 被偷偷換掉的供應鏈風險。

### Image 路徑格式解析

```text
asia-east1-docker.pkg.dev/my-project/my-repo/web-app:v1.2.3
```

| 片段 | 意義 |
|---|---|
| `asia-east1-docker.pkg.dev` | hostname = `REGION` + format（docker）+ 固定網域 `pkg.dev`。npm repo 會是 `asia-east1-npm.pkg.dev` |
| `my-project` | GCP 的 PROJECT_ID |
| `my-repo` | Artifact Registry 裡建立的 repository 名稱（gcr.io 時代沒有這一層，是新舊路徑最大差異） |
| `web-app:v1.2.3` | image 名稱與 tag；也可寫 `web-app@sha256:...` 用 digest 鎖定精確版本 |

這一整串就是 K8s Deployment YAML 裡 `image:` 欄位要填的完整路徑。

### Console 頁面能看什麼

- Repository 列表：每個 repo 的 format、mode、region、佔用容量
- 點進 repo → image 列表 → 點進單一 image：所有 tags、每個版本的 digest（sha256）、大小、push 時間
- **漏洞掃描結果**：啟用 Artifact Analysis（Container Scanning API）後，每次 push 自動掃描 image 內的 OS / 套件漏洞，Console 直接列出 CVE 清單與嚴重度。**掃描是按 image 計費的，不是免費功能**

### 認證與權限

本機要 push / pull 前，先把 gcloud 註冊成 Docker 的 credential helper：

```bash
gcloud auth configure-docker asia-east1-docker.pkg.dev

docker push asia-east1-docker.pkg.dev/my-project/my-repo/web-app:v1.2.3
```

之後 docker 對這個 hostname 的操作都會自動帶上你的 GCP 憑證。**每個 region 的 hostname 要各自設定一次**。

GKE 那端：**若 node 用的是預設 service account、且專案的預設授權沒被動過**，同專案內通常已有讀取權限——Pod 直接 pull，不需要 imagePullSecrets。但新專案的預設權限已逐步收緊、或改用自訂 SA 時，就要明確把 `roles/artifactregistry.reader` 授給 node 的 service account；Cloud Build 要 push 同理，需要 `roles/artifactregistry.writer`（見 IAM 章彙總表）。跨專案 pull 則一律要手動授權。Pod 出現 `ImagePullBackOff` 時，權限是第一個要查的方向。

### Cleanup policies：自動刪舊 image 控制成本

CI/CD 每次 build 都 push 一個新 image，沒人刪就一直堆著，**儲存費照算**（免費額度只有 0.5 GB）。Cleanup policy 可以設定像：

- 刪除 untagged 且超過 30 天的版本（每次覆蓋 tag 都會留下一個 untagged 舊版，是最常見的垃圾來源）
- 保留最新 10 個版本，其餘刪除（keep 規則的優先權高於 delete 規則）

> 建議先用 **dry run** 模式跑一陣子，從 audit log 確認不會誤刪還需要的 image（例如 rollback 要用的舊版）再正式啟用。另外注意：開了 immutable tags 的 repo，有 tag 的版本不會被 cleanup 刪除。

---

## Cloud SQL——PostgreSQL

在 Console 左側選單的「SQL」（歸在 Databases 分類下），這裡管理 GCP 的受管關聯式資料庫。一句話：**GCP 幫你養 PostgreSQL**——patching、備份、HA、storage 擴容都由 GCP 負責，你只管連進去用（也支援 MySQL 和 SQL Server）。像租有管理員的套房：水電維修房東處理，你只管住。

### 建立 instance 的主要設定

點「Create instance」後選擇 database engine，主要決定這幾件事：

- **Edition**：Enterprise（一般用途）或 Enterprise Plus（更高效能、data cache、近零停機維護），dev 環境選 Enterprise 即可
- **Database version**：PostgreSQL 版本（例如 15、16）
- **Machine type**：vCPU / RAM 規格，之後可改（但改規格會短暫重啟）
- **Storage**：SSD 容量，建議開 **automatic storage increase**（滿了自動長大，只會變大不會縮小）
- **Region / Zone**：跟 GKE cluster 選同一個 region，降低延遲又省跨區流量費
- **High Availability**：勾選 regional instance 會在**另一個 zone 建一台 standby**，主機掛掉自動 failover（費用約兩倍，production 才需要）

### 備份、PITR 與維護

- **Automated backups**：每日自動備份，可設保留份數與備份時段
- **Point-in-time recovery（PITR）**：靠 write-ahead log 讓你還原到「任意時間點」，例如「還原到誤刪資料的前一分鐘」。要先啟用才有效，無法回溯
- **Maintenance window**：指定 GCP 幫你套 patch 的時段（維護可能造成短暫斷線），設在離峰時間

> **坑**：刪掉 instance 預設連備份一起消失。重要環境記得開 deletion protection，並考慮定期 export 到 Cloud Storage bucket 當第二道保險。

### 連線方式（重點）

| 方式 | 原理 | 適合場景 | 注意事項 |
|------|------|----------|----------|
| Public IP | instance 有公網 IP，來源 IP 要列入 **authorized networks** 白名單 | 本機開發、快速測試 | 直連需自管 TLS；白名單維護麻煩，不建議 production 直連 |
| Private IP | instance 掛在 VPC 內，只有同一個 VPC（或 peered VPC）能連 | **GKE 連 Cloud SQL 的常見選擇** | 建立後才加 private IP 可以，但 VPC peering 需要先設好；跨 VPC 連不到 |
| Cloud SQL Auth Proxy / Language Connectors | 本地跑一個 proxy（或在程式碼用 Go/Java/Python connector），**自動處理 TLS 加密與 IAM 認證** | 官方推薦，搭配 Public 或 Private IP 都可 | 需要 service account 有 `roles/cloudsql.client`；多一層元件要維運 |

從 GKE 連線的兩種常見做法：

- **Private IP 直連**：app 直接連 instance 的內網 IP。優點是簡單、少一個元件；缺點是加密與認證要自己顧（帳密放 Secret）。前提：GKE cluster 是 VPC-native 且與 Cloud SQL 在同一個 VPC。
- **Sidecar 跑 Auth Proxy**：在 Pod 裡多跑一個 `cloud-sql-proxy` container，app 連 `localhost:5432`，proxy 負責加密與 IAM 認證。優點是安全性最好（搭配 Workload Identity Federation for GKE——舊名 Workload Identity，見 IAM 章——連 DB 密碼都可省）；缺點是每個 Pod 多吃一點資源、多一個要設定的東西。

```yaml
# sidecar 範例（節錄）
- name: cloud-sql-proxy
  image: gcr.io/cloud-sql-connectors/cloud-sql-proxy:latest
  args:
    - "--private-ip"
    - "my-project:asia-east1:my-instance"
```

### Console 頁面能看什麼、設什麼

點進 instance 後，左側有各功能分頁：

- **Overview**：CPU / memory / storage / connections 的**監控圖表**，連線資訊（connection name、IP）
- **Databases**：建立 / 刪除 database（等同 `CREATE DATABASE`，不用連進去下 SQL）
- **Users**：建 DB 帳號、改密碼，也支援 **IAM database authentication**（用 Google 帳號 / service account 登入，免密碼）
- **Connections**：設定 Public IP / Private IP、authorized networks、SSL 強制與否
- **Flags**（在 Edit instance 內）：調整資料庫參數，如 `max_connections`、`log_min_duration_statement`，等同改 `postgresql.conf`
- **Query insights**：**慢查詢分析**神器，看哪條 query 最吃資源、query plan 長怎樣，效能問題先來這裡
- **Backups / Operations**：備份列表、還原，以及歷史操作紀錄

### Read Replica

在「Replicas」分頁可以建 **read replica**：一台唯讀副本，非同步複製主機資料。兩個用途：

1. **讀寫分離**：報表、重查詢打到 replica，減輕主機負擔
2. **跨區容災**：replica 可以建在別的 region，必要時 promote 成獨立的主機

> **注意**：replica 是非同步複製，會有 replication lag——剛寫入的資料馬上從 replica 讀可能讀不到，「寫完立刻讀」的邏輯要走主機。

### 成本注意

- Cloud SQL instance 是**按時計費**——只要跑著就在燒錢，跟有沒有人用無關
- **dev / staging 環境下班記得 stop instance**（stop 後只收 storage 費），或用最小 machine type、關 HA
- HA（regional）約兩倍價、read replica 每台都是獨立計費，別為了「感覺比較安全」在 dev 環境全開

---

## Secret Manager

位置在 Console 左側選單 **Security → Secret Manager**。它是整個 GCP 專案共用的「保險箱」：API key、DB 密碼、第三方憑證全部集中放這裡，而不是散落在 K8s Secret、環境變數或程式碼裡。GKE 上的 Pod、Cloud Build 的 pipeline、甚至你本機開發，都是向同一個保險箱拿鑰匙。

### 在這個頁面能看到與設定什麼

**能看到**：專案內所有 secret 的清單（名稱、replication location、建立時間、labels）；點進單一 secret 可以看 version 歷史（每個 version 的狀態：enabled / disabled / destroyed）、rotation 設定，以及這個 secret 自己的 IAM permissions。

**能設定**：

- 建立 secret、對既有 secret 新增 version（上傳新的 payload）
- **Replication policy**（建立時決定，之後不能改）：automatic 或 user-managed regions
- **Rotation** 排程：設定 rotation period 後，Secret Manager 會定期發訊息到你指定的 Pub/Sub topic——**它只負責提醒，實際換密碼要你自己（或 Cloud Function）動手**
- Version 的 disable（可復原）與 destroy（不可復原）
- 單一 secret 層級的 IAM 綁定（Permissions 分頁）

| Replication policy | 資料存放位置 | 適用情境 |
|---|---|---|
| Automatic | Google 自動選擇、全球可用 | 預設選這個，最簡單，計價也最單純 |
| User-managed | 自選一個或多個 region | 有資料落地（data residency）或合規要求 |

### 核心概念：secret 與 version

Secret 本身只是「名字＋設定」的容器，真正的機密內容放在 version 裡。每次更新都會產生新 version（1、2、3⋯），舊 version 不會被覆蓋——這是它和 K8s Secret 最大的差別之一：

- 讀取時可以指定版本號，或用 `latest` alias 拿最新版
- 換錯密碼？把應用程式指回舊 version 就 rollback 了
- 確定不再用的舊 version 先 disable 觀察，沒問題再 destroy

> **常見坑**：production 建議 pin 特定版本號而不是 `latest`——有人新增了一個壞掉的 version，所有用 `latest` 的服務會立刻一起炸。

### IAM 整合與稽核

「誰能讀哪個 secret」用 IAM 控制，粒度可以細到單一 secret：

| Role | 能做什麼 |
|---|---|
| `roles/secretmanager.secretAccessor` | 只能讀 payload（給應用程式的 service account 用這個） |
| `roles/secretmanager.secretVersionManager` | 新增/管理 version，但讀不到內容 |
| `roles/secretmanager.admin` | 完整管理權限 |

> **注意**：管理操作（建 secret、改 IAM）的 Admin Activity audit log 永遠開啟，但「誰在什麼時候讀了哪個 secret」屬於 **Data Access audit log，預設是關的**，要在 IAM & Admin → Audit Logs 手動啟用才查得到。

### 與 K8s Secret 的比較

| 面向 | K8s Secret | Secret Manager |
|---|---|---|
| 存放位置 | cluster 內的 etcd | GCP 專案層級的全域服務 |
| 加密 | 只有 base64 編碼（不是加密） | 預設加密，可再套 CMEK |
| 版本控制 | 無，更新即覆蓋 | 每次更新產生新 version，可 rollback |
| 稽核 | 要自己設定 audit policy | Cloud Audit Logs 整合，可查到單次讀取 |
| 作用範圍 | 單一 namespace / cluster | 全專案共用（GKE、Cloud Build、本機都能讀） |
| 權限控制 | K8s RBAC | IAM，粒度到單一 secret |

### 應用程式怎麼拿到 secret

三條主要路徑，對應這份筆記的三個場景：

**1. 程式內用 client library 讀**（適合啟動時載入設定）：

```javascript
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();
const [version] = await client.accessSecretVersion({
  name: 'projects/my-project/secrets/db-password/versions/latest',
});
const dbPassword = version.payload.data.toString();
```

**2. GKE 掛進 Pod**：官方的 **Secret Manager add-on**（基於 Secrets Store CSI driver，Standard 和 Autopilot 都支援）可以把 secret 掛成 Pod 裡的檔案；或用社群的 **External Secrets Operator** 把 Secret Manager 的內容同步成 K8s Secret 再照常使用。兩者都需要先設好 Workload Identity Federation for GKE（見 IAM 章），讓 K8s service account 對應到有 `secretAccessor` 權限的 GCP service account。

**3. Cloud Build 的 `availableSecrets`**（CI/CD 裡要用的 token、密碼）：

```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    entrypoint: 'bash'
    args: ['-c', 'docker login -u user -p "$$DOCKER_TOKEN"']
    secretEnv: ['DOCKER_TOKEN']
availableSecrets:
  secretManager:
    - versionName: projects/my-project/secrets/docker-token/versions/latest
      env: 'DOCKER_TOKEN'
```

### 實務原則

- **程式碼與 repo 裡永遠不出現明文機密**——`.env` 檔不進 git，YAML 裡不寫死密碼
- 本機開發也從 Secret Manager 拉：`gcloud secrets versions access latest --secret=db-password`
- Replication policy 建立後改不了，有合規需求要在第一天想清楚
- destroy 是不可逆的，猶豫時先 disable
- 單一 version payload 上限 64 KiB——放的是密碼和金鑰，不是設定檔

---

## 網路：固定 IP 與 Load Balancer

這章對應 console 左側選單的兩個地方：**VPC network → IP addresses**（管理專案裡所有保留的 IP）與 **Network services → Load balancing**（檢視所有 Load Balancer）。對跑在 GKE 上的 web 服務來說，這裡是「對外門牌」的管理處：網域 DNS 最終指向的那個 IP，就是在這裡保留、再綁回 Kubernetes 資源的。

### 為什麼需要固定 IP

GKE 的 Ingress 或 `type: LoadBalancer` 的 Service 建立時，GCP 預設會發一個 **ephemeral（暫時性）IP**。服務只要刪掉重建（改架構、搬 namespace、災難重建），IP 就換一個新的——但 DNS 的 A record 還指著舊 IP，網站就直接掛掉。所以正確流程是：**先 reserve 一個 static IP，再讓 Ingress/Service 綁定它**。可以想成先去戶政事務所登記一個永久門牌，之後店面怎麼改建，地址都不變。

### 保留 static IP：global vs regional 是最大的坑

在 **VPC network → IP addresses** 點「Reserve external static IP address」，或用 gcloud：

```bash
# 給 Ingress（Application LB）用：global
gcloud compute addresses create web-ip --global

# 給 Service type LoadBalancer（passthrough Network LB）用：regional，區域要跟 cluster 同區
gcloud compute addresses create web-app-svc-ip --region=asia-east1

# 查看保留的 IP
gcloud compute addresses list
```

| 項目 | Global IP | Regional IP |
| --- | --- | --- |
| 建立參數 | `--global` | `--region=REGION` |
| 適用的 LB | External **Application LB**（L7） | **Passthrough Network LB**（L4） |
| 對應 GKE 資源 | Ingress / Gateway | Service `type: LoadBalancer` |
| 常見錯誤 | 拿去綁 Service → 綁不上 | 拿去綁 Ingress → Ingress 一直卡在沒有 IP |

> **最大的坑就在這裡**：兩種 IP 不能混用。Ingress 要 global IP；Service 要 regional IP 且 region 必須跟 LB（也就是 cluster）相同。弄錯的症狀通常是 Ingress event 出現找不到 address、或 Service 的 `EXTERNAL-IP` 永遠 pending。

### 把 IP 綁回 Kubernetes 資源

注意：annotation 填的是**保留 IP 的「名稱」**，不是 IP 數字本身。

```yaml
# Ingress：用 annotation 指定 global IP 的名稱
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
  annotations:
    kubernetes.io/ingress.global-static-ip-name: web-ip
---
# Service：新式做法（GKE 1.29+，官方推薦），同樣填名稱
apiVersion: v1
kind: Service
metadata:
  name: web-app-svc
  annotations:
    networking.gke.io/load-balancer-ip-addresses: web-app-svc-ip
spec:
  type: LoadBalancer
```

舊式做法是在 Service 的 `spec.loadBalancerIP` 直接填 IP 數字——目前仍可用，但這個欄位在上游 Kubernetes 已標記 deprecated，兩者同時存在時 annotation 優先，新專案建議直接用 annotation。另外 internal Ingress 對應的是 `kubernetes.io/ingress.regional-static-ip-name`。

### GCP Load Balancer 家族總覽

GCP 在 2023 年後把 LB 命名整理成 Application LB / Network LB 兩大家族（舊名 HTTP(S) LB、TCP/UDP LB 已走入歷史）：

| LB 類型 | 層級 | 範圍 | 對應的 GKE 資源 |
| --- | --- | --- | --- |
| Global external Application LB | L7 HTTP(S) | Global | Ingress（外部）、Gateway `gke-l7-global-external-managed` |
| Regional external Application LB | L7 HTTP(S) | Regional | Gateway `gke-l7-regional-external-managed` |
| Internal Application LB | L7 HTTP(S) | Regional（內部） | Ingress（`gce-internal` class） |
| External passthrough Network LB | L4 TCP/UDP | Regional | Service `type: LoadBalancer`（預設就是這種） |
| Internal passthrough Network LB | L4 TCP/UDP | Regional（內部） | Service + `networking.gke.io/load-balancer-type: "Internal"` |
| Proxy Network LB | L4 TCP（proxy） | Global / Regional | GKE 較少直接對應，多用於非 HTTP 的全球服務 |

簡單記：**要吃 HTTP 路由、SSL 憑證、CDN → Application LB（走 Ingress，配 global IP）；只要單純把 TCP 流量丟進來 → passthrough Network LB（走 Service，配 regional IP）**。

### Load balancing 頁面能看到什麼

到 **Network services → Load balancing**，會看到 GKE 幫你自動建出來的 LB（名稱通常是 `k8s2-...` 開頭）。點進去可以看到三塊：

- **Frontend**：對外的 IP、port、protocol、綁定的 SSL 憑證——確認固定 IP 有沒有真的綁上就看這裡
- **Backend services**：後面接的 NEG（Network Endpoint Group，指向 Pod）、health check 狀態——排查 502 的第一站
- **Routing rules**：host/path 的轉發規則，對應 Ingress 裡的 rules

> **這些 LB 是 GKE Ingress controller 自動產生的，不要在 console 手動改。** 你手動調的設定會在下次 reconcile 時被蓋回去，或造成 console 與 cluster 狀態不一致、更難 debug。要改行為，一律回到 Ingress/Service 的 YAML（或 BackendConfig/FrontendConfig CRD）去改。

### 成本小坑：閒置的 static IP 反而更貴

Static IP **保留了但沒綁定任何資源時，計費費率比使用中還高**（Google 用這招逼你釋放閒置 IP）。砍掉服務前記得盤點：IP 之後還要用就留著（本來就是為了災難重建），確定不用就 `gcloud compute addresses delete` 釋放。定期到 IP addresses 頁看「In use by」欄位是空的那些，就是在燒錢的。

### 串起完整對外流程

有了固定 IP，整條對外鏈路就能定下來：

1. **Reserve global static IP**（`web-ip`）
2. **DNS**：在 Cloud DNS 或你的網域商，把 `A record` 指到這個 IP（例如 `app.example.com → 34.x.x.x`）
3. **Ingress** 加上 `kubernetes.io/ingress.global-static-ip-name: web-ip`
4. **HTTPS**：建立 `ManagedCertificate` CRD 並在 Ingress 加 `networking.gke.io/managed-certificates` annotation，Google 會自動簽發、續期憑證（需要 DNS 已正確指向該 IP 才驗得過，簽發約需 15–60 分鐘——順序弄反會一直卡在 Provisioning）

之後不管 Deployment 怎麼 rolling update、Ingress 怎麼重建，門牌（IP）跟招牌（網域）都不動，使用者永遠找得到你。

### 參考資料

- [Reserve a static external IP address](https://docs.cloud.google.com/vpc/docs/reserve-static-external-ip-address)
- [Configure domain names with static IP addresses (GKE)](https://docs.cloud.google.com/kubernetes-engine/docs/tutorials/configuring-domain-name-static-ip)
- [LoadBalancer Service parameters (GKE)](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/service-load-balancer-parameters)
- [Choose a load balancer](https://docs.cloud.google.com/load-balancing/docs/choosing-load-balancer)

---

## Cloud Storage 與 BigQuery

兩個常被一起提到的資料服務：Cloud Storage 在左側選單「Cloud Storage → Buckets」，管的是**檔案（物件）**；BigQuery 在左側選單「BigQuery → Studio」（介面叫 BigQuery Studio），管的是**分析用的表格資料**。一個是倉庫，一個是可以直接下 SQL 的資料倉儲。

### Cloud Storage（GCS）— 物件儲存

GCS 就是 S3 的 GCP 版：使用者上傳的圖片檔案、前端靜態資源、資料庫備份、log 歸檔都放這裡。在本情境中，Cloud SQL 的 export/import 走 GCS，Cloud Build 的 build log 與產出物也可以指定丟到 bucket。

**在 console 能看到什麼**：bucket 列表（location、storage class、公開狀態）；點進 bucket 就是網頁版檔案總管，可以瀏覽、上傳、下載、刪除物件，還有 Lifecycle、Permissions、Protection 等分頁與用量資訊（詳細用量圖表在 Monitoring／Observability tab）。

**能設定什麼**——建 bucket 時的三個關鍵決定：

1. **名稱**：全球唯一（跟所有 GCP 使用者搶同一個命名空間），建了不能改名。
2. **Location type**：

| Location type | 意思 | 適用情境 |
|---|---|---|
| Region | 單一區域 | 最便宜；跟 GKE 同 region 讀寫最快 |
| Dual-region | 兩個指定區域互備 | 要高可用又要控制資料位置 |
| Multi-region | 一整個大區（如 `asia`） | 面向大範圍讀者的靜態資源 |

3. **Storage class**（取用頻率 vs 價格的 trade-off）：

| Class | 適合的取用頻率 | 儲存單價 | 取用費 | 最短儲存期 |
|---|---|---|---|---|
| Standard | 隨時取用 | 最高 | 無 | 無 |
| Nearline | 約每月一次 | 較低 | 有 | 30 天 |
| Coldline | 約每季一次 | 更低 | 較高 | 90 天 |
| Archive | 約每年一次 | 最低 | 最高 | 365 天 |

> 冷門 class 存起來便宜但「拿出來要錢」，而且有最短儲存期——提早刪除照樣收滿期費用。網站會頻繁讀的東西放 Standard，備份和歸檔才往冷的放。

**Lifecycle rules**：在 bucket 的 Lifecycle 分頁點選設定，讓物件自動轉冷或刪除，不用自己寫 cron。例如 log 檔 30 天轉 Coldline、一年後刪除：

```json
{
  "rule": [
    { "action": { "type": "SetStorageClass", "storageClass": "COLDLINE" },
      "condition": { "age": 30 } },
    { "action": { "type": "Delete" }, "condition": { "age": 365 } }
  ]
}
```

**存取控制**：

- 開啟 **uniform bucket-level access**，整個 bucket 用 IAM 統一管理（舊式 per-object ACL 已不建議使用，新 bucket 預設就是 uniform）。
- 前端要限時上傳/下載時用 **signed URL**：後端拿 service account 簽出一個有效期限的網址，檔案直接在瀏覽器和 GCS 之間傳，不經過你的 server。

```bash
gcloud storage sign-url gs://my-app-uploads/avatar.png \
  --private-key-file=sa-key.json --duration=15m
```

> **不要隨手把 bucket 設成 public**。console 會在公開的 bucket 上顯示「Public to internet」警告標籤——看到它出現在不該公開的 bucket 上就是事故前兆。

### BigQuery — serverless 資料倉儲

BigQuery 讓你用 SQL 查 TB 級資料，不用開機器、不用建 index、不用管擴容。它跟 Cloud SQL 不是競爭關係而是分工：

| | Cloud SQL（PostgreSQL） | BigQuery |
|---|---|---|
| 定位 | OLTP：交易處理 | OLAP：分析查詢 |
| 典型操作 | 單筆讀寫、UPDATE、transaction | 全表彙總、大範圍 SELECT、報表 |
| 誰在連 | 你的 web 服務（app 連線池） | 工程師、分析師、BI 工具 |
| 計費邏輯 | instance 開著就計費 | on-demand 按掃描的 bytes 計費 |

**結構**：project → dataset → table。左側 Explorer 是樹狀圖，dataset 相當於資料庫的 schema，建 dataset 時要選 location（之後 query 只能 join 同 location 的資料）。

**計費與省錢**（on-demand 約 $6.25/TiB，每月首 1 TiB 免費）：

- **`SELECT *` 是燒錢大戶**。BigQuery 是 columnar 儲存，只掃你點名的欄位——選需要的欄位，掃描量可能差十倍。
- 大表建成 **partitioned table**（通常按日期分區），查詢時用 WHERE 過濾分區，只掃有碰到的分區：

```sql
SELECT user_id, event_name
FROM `my-project.app_logs.events`
WHERE DATE(timestamp) >= "2026-07-01"   -- 只掃這個月的分區
```

**資料怎麼進來**：

- **Batch load**：從 GCS 載入 CSV／JSON／Parquet（load 本身免費，不算查詢費）——GCS 常常就是進 BigQuery 的中繼站。
- **Streaming**（Storage Write API）：即時寫入，適合事件流。
- **Log sink**：在 Log Router 建 sink 把 GKE 的 log 導進 BigQuery dataset（見 [Logs Explorer——集中日誌](#logs-explorer集中日誌) 章的 sink 表），之後就能用 SQL 分析 log，比在 Logs Explorer 裡翻快得多。

**在 console（BigQuery Studio）能做什麼**：

- SQL 編輯器：寫完 query 後右上角會**先顯示預估掃描量**（"This query will process X MB"），送出前務必看一眼。
- Explorer 瀏覽 table schema、用 Preview 分頁看資料內容。
- Query history／Saved queries：看自己和整個 project 的查詢歷史與實際費用。

> **常見坑**：`LIMIT 10` 不會省錢——掃描量取決於掃了哪些欄位和分區，不是回傳幾筆。想免費看資料長怎樣，用 table 的 **Preview 分頁**，不要下 `SELECT * LIMIT 10`。

---

## Logs Explorer——集中日誌

位置：左側選單 **Logging → Logs Explorer**（同分類下還有 Log Router、Log-based Metrics、Log Storage、Log Analytics）。這裡是全專案 log 的集中查詢介面：GKE 容器的 stdout/stderr、Cloud Build 的建置輸出、Cloud SQL 的資料庫 log、Load Balancer 的請求 log，全部匯流到同一個地方查。

### 為什麼需要集中日誌

GKE 建立 cluster 時預設就開啟 Cloud Logging 整合——容器印到 stdout/stderr 的東西會被節點上的 logging agent 自動收走，**不用自己裝 Fluentd/Fluent Bit**。對照沒有集中日誌的世界：

| | `kubectl logs` 直接查 | Logs Explorer 集中查 |
|---|---|---|
| Pod 重啟後 | 前一個容器的 log 只剩最後一份（`--previous`），再重啟就沒了 | 全部都在，照時間查 |
| Pod 被刪除 / 節點被回收 | log 跟著消失 | 還查得到 |
| 跨多個 Pod / 服務 | 要一個個 pod 查、自己拼時間軸 | 一條 query 撈全部 |
| Cloud Build、Cloud SQL、LB 的 log | 各自散在不同地方 | 同一個介面 |

可以把它想成社區的中央監視器室：每戶（Pod）自己的錄影機壞了、搬走了都沒關係，畫面早就同步一份到監視器室了。

### 頁面上能看到什麼、設定什麼

- **看到**：log entry 列表 + 時間軸 histogram（一眼看出 error 何時暴增）、左側 field explorer（依 resource type、severity、cluster、namespace 快速篩選）。
- **設定**：查詢條件（可存成 saved query 團隊共用）、時間範圍、log 來源的 scope；進階功能（sink、exclusion、retention）在 Log Router 和 Log Storage 頁面設。

### 查詢語法（Logging query language）

上方 query 欄支援結構化查詢，幾個實用範例——

查某個 GKE container 的 error log：

```
resource.type="k8s_container"
resource.labels.cluster_name="my-cluster"
resource.labels.namespace_name="production"
resource.labels.container_name="web-app"
severity>=ERROR
```

查某段時間 Load Balancer 的 5xx：

```
resource.type="http_load_balancer"
httpRequest.status>=500
timestamp>="2026-07-28T00:00:00Z" AND timestamp<"2026-07-29T00:00:00Z"
```

查 Cloud Build 某次建置失敗的輸出：

```
resource.type="build"
severity>=WARNING
```

### Log entry 結構：jsonPayload vs textPayload

每筆 log entry 都帶有 `resource.labels`（cluster_name / namespace_name / pod_name / container_name）、`severity`、`timestamp`，以及實際內容：

| 欄位 | 何時出現 | 可查詢性 |
|---|---|---|
| `textPayload` | app 印純文字（如 `console.log("user 123 failed")`） | 只能全文比對，難篩選 |
| `jsonPayload` | app 印單行 JSON，Logging 自動解析成結構化欄位 | 可以 `jsonPayload.userId="123"`、`jsonPayload.latencyMs>1000` 精準查 |

> **實務建議**：讓 app 輸出 JSON 格式 log（Node.js 可用 pino、winston）。多花五分鐘設定，之後每次查 log 都省十分鐘。JSON 裡放 `severity` 欄位還能讓 Logging 正確標色分級，而不是全部灰灰的 `DEFAULT`。

### Log-based metrics 與 alerting

在 **Log-based Metrics** 頁面可以把「符合某條 query 的 log 筆數」變成 Cloud Monitoring 的指標——例如每分鐘 error log 數量——再搭配 alerting policy，超過門檻就發通知到 Slack / email。這是從「事後查 log」升級到「主動被通知」的橋樑（alerting policy 屬 Cloud Monitoring，本筆記不展開）。

### Log sink：把 log 導出去

log 預設只留 30 天，要歸檔或分析就在 **Log Router** 建 sink，用 filter 挑出要導的 log 送往：

| 目的地 | 用途 | 呼應章節 |
|---|---|---|
| Cloud Storage bucket | 長期歸檔（便宜、可設 Nearline/Coldline） | Storage |
| BigQuery | 用 SQL 分析（如統計 5xx 分布、慢查詢趨勢） | BigQuery |
| Pub/Sub | 串流給第三方系統（Datadog、自建 pipeline） | — |
| 另一個 log bucket | 集中多專案 log、或設不同 retention | — |

### 保留期限與成本

- 預設進 `_Default` bucket，**保留 30 天**；`_Required` bucket（audit log）固定 400 天、不可改也不收費。
- 要留更久：調高 bucket retention（超過 30 天的部分約 $0.01/GiB/月），或設 sink 導去 GCS/BigQuery。
- 每專案每月 **50 GiB 免費**，超過收約 $0.50/GiB ingestion 費。

> **常見坑**：log 費用暴增通常是某個 debug level 的 log 在迴圈裡狂印。在 Log Router 對 `_Default` sink 設 **exclusion filter** 排除吵雜 log（如 health check 的 200、verbose debug），被排除的 log 不收 ingestion 費——但也就真的查不到了，排除前想清楚。

---

## IAM 與 Service Accounts

位置：左側選單「IAM 與管理（IAM & Admin）」，底下包含 IAM、Service Accounts、Workload Identity Federation、Roles、Audit Logs 等頁面。這個分類是整個專案的權限中樞，管的是「誰（或哪台機器）可以對哪個資源做什麼」——前面每一章的動作（Cloud Build 推 image、GKE node 拉 image、app 連 Cloud SQL）背後全都是這裡設定的權限在放行。

### IAM 三要素：Principal × Role × Resource

一條 IAM 授權（policy binding）永遠由三個東西組成：

- **Principal（誰）**：Google 帳號、Google 群組，或最重要的——service account
- **Role（能做什麼）**：一組 permissions 的集合。單一 permission 長得像 `artifactregistry.repositories.downloadArtifacts`，太細碎，所以 GCP 用 role 打包成一串
- **Resource（對什麼東西）**：可以綁在整個 project，也可以只綁在單一 bucket、單一 Artifact Registry repository 上——綁的範圍越小越安全

比喻：role 是一串鑰匙、principal 是拿鑰匙的人、resource 是門。IAM 頁面上的每一列，就是一筆「把哪串鑰匙交給誰、開哪扇門」的紀錄。

### Role 的三種類型

| 類型 | 範例 | 特性 | 實務建議 |
|---|---|---|---|
| Basic | Owner、Editor、Viewer | 橫跨專案內所有服務，粒度極粗 | 幾乎不要用；給 Editor 等於把大半個專案交出去 |
| Predefined | `roles/cloudsql.client`、`roles/artifactregistry.reader` | Google 按服務預先打包好，有數百個 | **實務上絕大多數用這個**，先查各服務文件找對應 role |
| Custom | 自選 permissions 組合 | 完全自訂 | predefined 都不合再考慮，自己要維護、成本高 |

### Service Account：機器的帳號

Service account 是「給程式用的身分」，email 長得像 `xxx@PROJECT_ID.iam.gserviceaccount.com`。你的 app、GKE 的 node、Cloud Build 的建置過程，呼叫 GCP API 時都是以某個 service account 的身分行動，而不是用工程師個人的 Google 帳號。它有雙重身分：既是 principal（可以被授與 role），本身也是 resource（可以設定誰能使用它，例如 `roles/iam.serviceAccountUser`）。

> **Cloud Build 注意**：2024 年後新專案的 Cloud Build 預設改用 Compute Engine default service account（`PROJECT_NUMBER-compute@developer.gserviceaccount.com`），只有舊專案還在用 legacy 的 `PROJECT_NUMBER@cloudbuild.gserviceaccount.com`。實務建議直接替 pipeline 建一個專用 SA，在 trigger 設定裡指定，權限自己掌控。

### JSON Key 的風險與 Workload Identity Federation for GKE

Service Accounts 頁面可以替 SA 產生 JSON 金鑰下載——**盡量不要**。這把 key 預設不會過期，拿到就能完整冒用該 SA；一旦 commit 進 git 或包進 image 外洩，就是整包權限淪陷（GitHub 上掃 key 的 bot 幾分鐘內就會找上門）。

在 GKE 上的正解是 **Workload Identity Federation for GKE**（舊名 Workload Identity，已改名）。概念層級的流程：

1. cluster 啟用後，專案自動擁有 identity pool `PROJECT_ID.svc.id.goog`
2. pod 掛上一個 Kubernetes service account（KSA）
3. 把 IAM role 直接授權給這個 KSA（`principal://…` 格式，2024 年起的建議做法），或把 KSA 對應到一個 GCP service account
4. pod 裡的 Google client library 自動向 metadata server 換取短效 token——**全程不需要任何 key 檔**

比喻：pod 出示「我是這個 cluster 裡的這個 KSA」的證明，GCP 當場換發一張幾小時就過期的臨時通行證，取代那把永久有效的萬能鑰匙。

### 這套部署會用到的 Service Account 與角色

把前面所有章節的權限需求收在一張表：

| Service Account | 要做的事 | 需要的角色 |
|---|---|---|
| Cloud Build SA | 推 image 到 Artifact Registry | `roles/artifactregistry.writer` |
| Cloud Build SA | 對 GKE 執行 kubectl 部署（set image / apply） | `roles/container.developer` |
| Cloud Build SA（自建專用 SA 時） | 寫 build log | `roles/logging.logWriter` |
| GKE node SA | node 從 Artifact Registry 拉 image | `roles/artifactregistry.reader` |
| GKE node SA | 送 log 與 metrics 到 Cloud Observability | `roles/logging.logWriter`、`roles/monitoring.metricWriter` |
| App workload（KSA，走 Workload Identity Federation） | 連 Cloud SQL（經 Auth Proxy / connector） | `roles/cloudsql.client` |
| App workload（KSA，走 Workload Identity Federation） | 讀 Secret Manager 裡的 DB 密碼 | `roles/secretmanager.secretAccessor` |

> **常見坑**：pod 出現 `ImagePullBackOff`，很常是 node SA 少了 `artifactregistry.reader`；Cloud Build 部署 GKE 噴 permission denied，多半是少了 `container.developer`。GCP 的錯誤訊息通常會直接寫出缺哪個 permission，拿著它去查對應的 predefined role 就好。

### 最小權限原則與 Console 上的操作

**不要圖方便給 Editor。** 一個只需要推 image 的 CI pipeline 拿到 Editor，等於它被打穿時攻擊者能動整個專案。IAM 頁面內建 recommender：分析近 90 天的實際 API 使用量，對「給太大、根本沒用到」的 role 顯示降級建議（列上的 insight 圖示），值得定期回來看。

Console 各頁面能做的事：

- **IAM**：檢視/編輯整個 project 的 policy bindings，每列可直接加減 role，也能看 recommender 的權限建議
- **Service Accounts**：建立 SA、管理 key（看到還留著 key 的 SA 就該檢討是否能改用 Workload Identity Federation）、設定誰能 impersonate 它
- **Audit Logs**：查「誰在什麼時候對什麼資源做了什麼」。Admin Activity log 預設開啟且無法關閉，出事時第一個來這裡查（也可在 Logs Explorer 下 query）
