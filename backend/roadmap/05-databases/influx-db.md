# InfluxDB

## 簡介

InfluxDB is a high-performance, open-source time-series database for handling timestamped data like metrics and events. Optimized for monitoring, IoT, and APM with SQL-like Flux queries. Features retention policies, downsampling, and automatic compaction for scalable time-series storage.

## 學習資源

### 文章

#### 1. Time series database
> 原文：https://www.influxdata.com/time-series-database/

**主要概念**

時間序列資料庫（TSDB）是針對時間戳記資料進行優化的資料庫，專門處理隨時間推移而追蹤、監控和聚合的測量值或事件。

**常見應用場景**

- 伺服器指標（CPU、記憶體、磁碟 I/O）
- 應用程式效能監控（APM）
- 網路資料和感測器數據
- 市場交易數據
- 分析類資料

**核心特徵**

| 特性 | 說明 |
|------|------|
| **資料生命週期管理** | 自動刪除過期資料並進行彙總 |
| **時間範圍掃描** | 快速處理大量時間相關記錄 |
| **資料壓縮** | 根據精度需求進行變量壓縮 |
| **時間感知查詢** | 支援時間相關的複雜分析 |

**InfluxDB 資料模型**

```
measurement-name tag-set field-set timestamp
例：cpu,host=serverA,region=uswest idle=23,user=42,system=12 1464623548s
```

**主要優勢**

1. **時間戳記精度** - 支援秒、毫秒、微秒、奈秒等多種精度
2. **多欄位與標籤支援** - 無限制的標籤與欄位數量
3. **欄位式儲存** - 單一欄位的聚合計算效率極高

**與其他 TSDB 的對比**

| 特性 | InfluxDB | OpenTSDB/KairosDB | Graphite/RRD |
|------|----------|------------------|-------------|
| 多欄位支援 | ✓ | ✗ | ✗ |
| 標籤限制 | 無限 | ~5-6個會出現瓶頸 | 不支援 |
| 資料型別多樣性 | 多種 | 主要float64 | 有限 |
| 倒排索引 | ✓ | ✓ | ✗ |

**典型應用場景**

- **基礎設施與應用監控** - 追蹤伺服器、容器、微服務指標
- **物聯網（IoT）** - 感測器資料的高頻率更新
- **金融市場** - 股票價格、交易量處理
- **能源與公用事業** - 電網穩定性監控
- **業務分析** - KPI 實時追蹤

---

#### 2. Introduction to InfluxDB - TICK Stack 監控系統指標
> 原文：https://www.digitalocean.com/community/tutorials/how-to-monitor-system-metrics-with-the-tick-stack-on-centos-7

**TICK Stack 概述**

TICK Stack 是由 InfluxDB 開發者推出的時間序列監控解決方案，用於收集、存儲和可視化時間序列數據。

**核心組件**

| 組件 | 功能 |
|------|------|
| **Telegraf** | 代理程序，蒐集系統和應用指標 |
| **InfluxDB** | 時間序列資料庫，儲存監控數據 |
| **Chronograf** | Web 使用介面，用於數據可視化和儀表板 |
| **Kapacitor** | 資料處理引擎，用於告警和異常檢測 |

**關鍵特性**

- **實時圖表顯示** - 在線實時展示圖表
- **多主機支持** - 支援監控多個不同應用配置的主機
- **告警功能** - 能配置郵件通知
- **靈活部署** - 可在單一伺服器或分散式架構上部署

**部署建議**

- 所有元件可安裝在單一伺服器上
- 需評估資料庫磁碟空間規劃
- Telegraf 需搭配 InfluxDB 使用以進行資料傳輸

---

### 影片

- [InfluxDB for Beginners - Getting Started](https://www.youtube.com/watch?v=Vq4cDIdz_M8)
- [The Basics of Time Series Data](https://www.youtube.com/watch?v=wBWTj-1XiRU)
- [Explore top posts about Backend Development](https://app.daily.dev/tags/backend?ref=roadmapsh)

### 其他資源

- [InfluxDB Website](https://www.influxdata.com/)
- [InfluxDB Documentation](https://docs.influxdata.com/influxdb/cloud/)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
