# Scrypt

## 簡介

scrypt is a memory-hard key derivation function designed to resist brute-force and hardware-based attacks (GPUs, ASICs). Combines hash functions with high memory usage and CPU-intensive computation, making large-scale attacks costly and impractical. Used for secure password storage and cryptocurrency mining.

## 學習資源

### 文章

#### 1. Wikipedia - scrypt
> 原文：[https://en.wikipedia.org/wiki/Scrypt](https://en.wikipedia.org/wiki/Scrypt)

**什麼是 scrypt**

scrypt 是由 Colin Percival 於 2009 年 3 月創建的密碼型金鑰派生函數（password-based KDF），最初為其創建的 Tarsnap 線上備份服務開發。設計目標是「透過需要大量記憶體，讓大規模自訂硬體攻擊代價極高」。2016 年由 IETF 發布為 RFC 7914。

**關鍵參數**

| 參數 | 說明 |
|------|------|
| **Passphrase** | 需要雜湊的密碼字串 |
| **Salt** | 隨機字符，防禦 rainbow table 攻擊 |
| **CostFactor (N)** | CPU/記憶體成本（必須是 2 的冪次） |
| **BlockSizeFactor (r)** | 精調循序記憶體讀取大小 |
| **ParallelizationFactor (p)** | 啟用並行處理 |
| **DesiredKeyLen** | 輸出長度（位元組） |

**Memory-Hardness 特性**

與其他密碼型 KDF 相比，scrypt 需要「大量記憶體」，使硬體實作昂貴並限制並行攻擊的可行性。

**時間-記憶體權衡**

設計刻意讓「兩個方向的權衡都代價高昂」：低記憶體實作速度慢，高記憶體實作速度快但硬體成本高。

**加密貨幣應用**

scrypt 的簡化版本用作 Litecoin、Dogecoin 等加密貨幣的工作量證明（proof-of-work），最初在 Tenebrix（2011 年 9 月）中實作。

### 影片


### 其他資源

- [sCrypt Website](https://www.tarsnap.com/scrypt.html)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
