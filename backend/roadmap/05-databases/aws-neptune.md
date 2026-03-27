# AWS Neptune

## 簡介

AWS Neptune is a fully managed graph database supporting property graph and RDF models. Uses Gremlin and SPARQL query languages for complex relationships in social networks, recommendations, and fraud detection. Offers high availability, multi-AZ replication, and up to 15 read replicas.

## 學習資源

### 文章

#### 1. Setting Up Amazon Neptune Graph Database
> 原文：https://cliffordedsouza.medium.com/setting-up-amazon-neptune-graph-database-2b73512a7388

**概述**

Amazon Neptune 是全託管的圖形資料庫服務，專為處理高度連接的資料而設計。本文介紹使用 Terraform 配置 Neptune 雙節點叢集、載入資料，以及執行 Gremlin 查詢。

**Knowledge Graphs（知識圖譜）**

知識圖譜表示現實世界實體的互聯事實，由以下元素組成：
- **Vertices（節點）**：代表實體，如 Person、Conference、Institution
- **Edges（邊）**：定義頂點間的關係（如 "knows"、"authored_by"）
- **Properties（屬性）**：與頂點和邊關聯的屬性

**設置前置需求**

- 已安裝 Terraform
- 已配置 AWS CLI 與存取憑證
- AWS 帳戶

**建立 Neptune 叢集（Terraform）**

```bash
git clone https://github.com/decliffy/amazon-neptune-database.git
cd terraform-aws-neptune
terraform init
terraform apply -auto-approve
```

> 部署需要 15-20 分鐘，叢集包含跨可用區的 Writer 和 Reader 兩個節點。

**資料載入**

```bash
# 上傳 CSV 至 S3
aws s3 cp vertex.csv s3://neptune-bulkloader-bucket/vertex.csv
aws s3 cp edge.csv s3://neptune-bulkloader-bucket/edge.csv
```

**Gremlin 查詢範例**

```groovy
# 連接 Neptune
:remote connect tinkerpop.server conf/neptune-remote-cfg.yaml
:remote console

# 計算各類型頂點和邊的數量
g.V().groupCount().by(label);
g.E().groupCount().by(label);

# 查詢產品被大量使用的機構
g.V().hasLabel('institution').as('inst').inE().hasLabel('made_by')
  .outV().inE().hasLabel('usage')
  .filter(properties("weight").value().is(gte(0.6)))
  .select('inst').dedup().id().fold();
```

**清除資源（避免費用）**

```bash
cd terraform-aws-neptune
terraform destroy -auto-approve
cd ../terraform-aws-instance
terraform destroy -auto-approve
```

---

### 影片

- [Getting Started with Neptune Serverless](https://www.youtube.com/watch?v=b04-jjM9t4g)

### 其他資源

- [AWS Neptune](https://aws.amazon.com/neptune/)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
