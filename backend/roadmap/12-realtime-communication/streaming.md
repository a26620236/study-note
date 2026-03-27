# Streamed Responses

## 簡介

Streamed and unstreamed responses describe how an AI agent sends its answer to the user. With a streamed response, the agent starts sending words as soon as it generates them. The user sees the text grow on the screen in real time. This feels fast and lets the user stop or change the request early. It is useful for long answers and chat-like apps.
An unstreamed response waits until the whole answer is ready, then sends it all at once. This makes the code on the client side simpler and is easier to cache or log, but the user must wait longer, especially for big outputs. Choosing between the two depends on the need for speed, the length of the answer, and how complex you want the client and server to be.

## 學習資源

### 文章

#### 1. Streaming Responses in AI - Dev.to
> 原文：[https://dev.to/pranshu_kabra_fe98a73547a/streaming-responses-in-ai-how-ai-outputs-are-generated-in-real-time-18kb](https://dev.to/pranshu_kabra_fe98a73547a/streaming-responses-in-ai-how-ai-outputs-are-generated-in-real-time-18kb)

**什麼是 AI Streaming Responses**

串流響應讓 AI 系統逐步傳遞輸出，而非等待完整生成。「回應幾乎立即出現，在螢幕上『打字』，就像 AI 在實時說話」。

**三大核心機制**

| 機制 | 說明 |
|------|------|
| **Token-by-Token Generation** | LLM 逐步生成文本，每個 token（詞、詞片段或字符）生成後立即發送 |
| **Streaming APIs** | OpenAI 等服務的 API 包含 `stream` 參數，啟用實時 token 傳遞 |
| **Real-Time Rendering** | 客戶端應用即時顯示收到的 token，創造「打字」效果 |

**支持技術**：Server-Sent Events（SSE）用於推送數據更新、非同步程式設計框架處理並發請求

**主要優勢**
- **感知速度提升**：用戶即時看到結果，即使是長篇回應
- **增強互動性**：實時反饋讓交流感覺動態和對話式
- **資源效率**：避免同時在記憶體中存儲完整回應

**挑戰**：網路延遲、中斷時的錯誤處理、實現複雜性增加

- [AI for Web Devs: Faster Responses with HTTP Streaming](https://austingil.com/ai-for-web-devs-streaming/)
- [Master the OpenAI API: Stream Responses](https://www.toolify.ai/gpts/master-the-openai-api-stream-responses-139447)

### 影片


---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
