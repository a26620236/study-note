# Helm & Kubernetes 基本概念

## Kubernetes 是什麼

Kubernetes（k8s）是雲端的容器編排平台，負責管理「多個 Docker container 要怎麼跑在伺服器上」。

---

## Helm 是什麼

Helm 是 Kubernetes 的套件管理工具，類似 npm 之於 Node.js。

**Helm chart** 是一組描述「如何把一個 app 部署到 k8s」的模板檔案集合。

---

## 類比：Helm vs npm

|  | npm | Helm |
|---|---|---|
| 管理對象 | Node.js 套件 | Kubernetes app |
| 套件定義 | `package.json` | chart（一堆 YAML 模板） |
| 安裝參數 | `.env` / config | `values.yaml` |
| 安裝指令 | `npm install` | `helm install` |
| 套件倉庫 | npmjs.com | Artifact Hub |

**最大差別：**
- npm 管的是**程式碼執行時需要的函式庫**
- Helm 管的是**整個服務怎麼跑在伺服器上**

流程：程式碼用 npm 打包 → 透過 Helm 部署到 k8s。

---

## 為什麼用 Helm（values 分環境）

直接寫 k8s YAML 的問題：同樣的服務部署到 dev / staging / production，設定幾乎一樣，只有少數不同（domain、replica 數、resource 大小）。

Helm 把 YAML 變成模板：

```yaml
replicas: {{ .Values.website.replicasCount }}
image: {{ .Values.website.image.repository }}:{{ .Values.website.image.tag }}
