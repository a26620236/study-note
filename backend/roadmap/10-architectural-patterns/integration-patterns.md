# Integration Patterns

## 簡介

Integration patterns are reusable solutions to commonly occurring problems when connecting different software systems or applications. They provide a structured approach for ensuring data is correctly exchanged, services are seamlessly accessed, and overall system behavior is predictable and reliable when integrating AI-powered functionalities. This allows developers to handle complexities like data transformations, error handling, security, and message routing in a standardized way.

## 學習資源

### 文章

#### 1. Emerging Patterns in Building GenAI Products - Martin Fowler
> 原文：[https://martinfowler.com/articles/gen-ai-patterns/](https://martinfowler.com/articles/gen-ai-patterns/)

**九大 GenAI 整合模式**

| 模式 | 說明 |
|------|------|
| **Direct Prompting** | 直接將用戶查詢發送給 LLM，適合一般用途，但受限於訓練數據和幻覺風險 |
| **Evals** | 系統性評估 LLM 在特定任務中的回應，使用自動評分和人工判斷 |
| **Embeddings** | 將大塊數據轉換為數字向量，語義相似的項目聚集在一起，支持高效相似性比較 |
| **RAG** | 檢索增強生成，在提示中包含相關文檔片段，讓 LLM 回應基於當前領域特定信息 |
| **Hybrid Retriever** | 結合向量相似性搜索和傳統關鍵詞技術（TF/IDF、BM25），改善檢索覆蓋率 |
| **Query Rewriting** | 使用 LLM 生成多個查詢重構，用所有變體搜索以改善模糊請求的結果 |
| **Reranker** | 使用交叉編碼器模型按相關性對檢索文檔片段重新排序，過濾低質量候選 |
| **Guardrails** | 通過單獨的 LLM 調用或基於規則的系統過濾輸入/輸出，阻止惡意提示和信息洩露 |
| **Fine-Tuning** | 在領域特定數據集上額外訓練，使用 LoRA 等方法提高資源效率 |

- [5 Patterns for Scalable LLM Service Integration](https://latitude.so/blog/5-patterns-for-scalable-llm-service-integration/)

### 影片

- [AI Design Patterns - LLM Integration: Choosing Between Direct Calls, Agents, RAG, MCP & Workflows](https://www.youtube.com/watch?v=_amJOKrM0XU)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
