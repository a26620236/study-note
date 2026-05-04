# voice-input 技術筆記

> 整理 voice-input 工具的技術細節：本地模型怎麼跑、mlx-whisper 是什麼、資源消耗、cloud vs local 對比。
> 對象：對 ML 推論不熟悉的開發者。

---

## 1. 這個工具在做什麼

按住熱鍵（或 toggle 模式按一下）→ 講話 → 文字貼到游標位置。

技術鏈：

```
麥克風 → sounddevice 錄 PCM 音訊 → mlx-whisper 轉文字
       → pyperclip 寫剪貼簿 → pynput 模擬 Cmd+V
```

行程結構：

- 一個 Python 行程，用 launchd 在登入時自動啟動
- 行程內三條執行緒：
  - **主執行緒**：pystray 系統列圖示（macOS 規定 GUI 元件要在主執行緒）
  - **listener 執行緒**：pynput 監聽鍵盤事件
  - **transcribe 執行緒**：每次錄完音 spawn 一條，轉錄完就 die

---

## 2. 「模型跑在電腦上」是什麼意思

### 2.1 模型本質：硬碟上的一個檔案

下載到 `~/.cache/huggingface/hub/models--mlx-community--whisper-small-mlx/`：

| 檔案 | 大小 | 是什麼 |
|---|---|---|
| `weights.npz` | **459 MB** | 模型本體：2.4 億個 float16 數字 |
| `config.json` | 266 B | 結構描述（幾層、每層幾顆 neuron） |
| `README.md` | 343 B | 模型卡片 |

`weights.npz` 解開就是純粹的數字陣列：

```
[[0.234, -0.157, 0.892, ...],
 [0.731, 0.012, -0.456, ...],
 ... 重複幾百萬行 ...]
```

**沒有程式邏輯、沒有 if/else、就是一坨參數**。

### 2.2 這些數字怎麼變成「會聽中英文」的東西

OpenAI 用 680,000 小時的人類錄音 + 字幕，訓練出這 2.4 億個參數：

1. 把音訊餵進去，模型猜文字
2. 對比正確答案，算誤差
3. 微調 2.4 億個參數，讓下次猜得更準
4. 重複幾億次（在 OpenAI 的 GPU 機房跑了好幾週）

訓練完後，這坨數字「記住」了人類語音轉文字的數學規則。**它不是記答案，而是學到模式** —— 所以你講從來沒人講過的句子，它也能轉。

### 2.3 推論時實際發生什麼（按下 Cmd+' 到貼字的 0.3 秒）

```
[麥克風]
  ↓ 16 kHz 採樣
[float32 陣列]
  audio = [0.012, -0.045, 0.123, ...]   每秒 16,000 個數字
  ↓
[轉成 mel spectrogram]
  時域波形 → 頻域，更容易讓模型處理
  ↓
[餵進 encoder]
  encoder 用 weights.npz 對 spectrogram 做幾百億次乘加
  ↓
[encoder 輸出 hidden states]
  ↓
[decoder autoregressive 生成]
  每一輪預測「下一個 token 最可能是什麼」
  挑機率最高的 → 拼成句子
  ↓
[文字回傳]
  "我今天去吃午餐"
```

整個過程：音訊 → 權重 → 數字運算 → 文字。**音訊從沒離開記憶體，更別說離開電腦。**

### 2.4 對前端工程師的類比

| ML 概念 | 前端對應 |
|---|---|
| 模型權重 (`weights.npz`) | 一個 minified JS bundle，但裡面**不是程式碼是參數** |
| mlx-whisper Python 套件 | V8 引擎，知道怎麼把這坨參數跑起來 |
| 推論一段音訊 | 等同呼叫 `bundle(audio) → text` |
| 訓練 | OpenAI 已經做完，我們不用做 |

---

## 3. mlx-whisper 是什麼

### 3.1 先理解 MLX 框架

**MLX** 是 Apple ML Research 在 2023 年 12 月開源的機器學習框架。

定位：**為 Apple Silicon 量身打造的 PyTorch / NumPy**。

| 特性 | 說明 |
|---|---|
| 統一記憶體 | 不需要把資料在 CPU/GPU 之間搬 — Apple Silicon 的 RAM 是 CPU/GPU/Neural Engine 共用的 |
| Metal 加速 | GPU 運算走 Apple 的 Metal API（不是 NVIDIA CUDA） |
| Lazy evaluation | 跟 PyTorch 一樣，先建構運算圖再執行 |
| Pythonic API | 寫起來跟 NumPy 很像，學習曲線平緩 |
| 開源 | MIT License，GitHub 上 `ml-explore/mlx` |

對比：

| 框架 | 屬於誰 | 跑在哪 |
|---|---|---|
| PyTorch | Meta | x86 CPU + NVIDIA GPU（主流），Apple Silicon（部分支援） |
| TensorFlow | Google | 同上 |
| **MLX** | **Apple** | **僅 Apple Silicon，但全力榨乾它** |
| JAX | Google | TPU + GPU + CPU |

### 3.2 mlx-whisper 是 MLX 框架下的 Whisper 實作

它做的事：

1. 把 OpenAI 釋出的 PyTorch 版 Whisper 模型權重，**轉換成 MLX 原生格式（`.npz`）**
2. 提供 Python API 跑這個模型 (`mlx_whisper.transcribe(audio, ...)`)
3. 預先轉換好的權重上傳到 HuggingFace（`mlx-community/whisper-*-mlx`）

GitHub: `ml-explore/mlx-examples/whisper`（範例庫的一部分）

### 3.3 為什麼比 faster-whisper 在 Mac 上快

| 引擎 | 底層 | 在 M2 上跑哪 |
|---|---|---|
| 原版 OpenAI Whisper | PyTorch | CPU 或 NVIDIA GPU（Mac 沒 CUDA → CPU） |
| **faster-whisper** | CTranslate2 (C++) | 只走 CPU（沒 Mac GPU 支援） |
| **whisper.cpp** | C++ + GGML | CPU + 部分 Metal |
| **mlx-whisper** | MLX | **CPU + GPU + Neural Engine 全用** |

實測（M2、small 模型、3.15 秒英文音訊、warm run）：

| 引擎 | 推論時間 |
|---|---|
| faster-whisper (CPU + int8) | 1.75 秒 |
| **mlx-whisper** | **0.28 秒（6.25× 加速）** |

### 3.4 為什麼選 small 模型

Whisper 各尺寸對比：

| 模型 | 參數量 | 磁碟大小 | M2 推論時間（3 秒音訊） | 中文準確度 |
|---|---|---|---|---|
| tiny | 39 M | 75 MB | < 0.1 s | 低 |
| base | 74 M | 140 MB | ~0.15 s | 中低 |
| **small** | **244 M** | **459 MB** | **~0.3 s** | **中高（我們的選擇）** |
| medium | 769 M | 1.5 GB | ~0.6 s | 高 |
| large-v3 | 1550 M | 3 GB | ~1.5 s | 最高 |

決策邏輯：small 是「速度／準確度／體積」的甜蜜點。對日常 push-to-talk 已經夠用。

如果準確度不夠，可以在 `config.json` 改 `"model_size": "medium"` —— 體積×3、推論慢×2，但準確度提升。

### 3.5 Whisper 模型架構簡述

Whisper 是 **encoder-decoder transformer**：

```
audio (mel spectrogram)
       ↓
   ┌─────────┐
   │ encoder │  ← 把音訊壓縮成 hidden representation
   └─────────┘
       ↓
   ┌─────────┐
   │ decoder │  ← autoregressive 一個 token 一個 token 生成文字
   └─────────┘
       ↓
   "我今天去..."
```

訓練資料：680,000 小時人類錄音 + 字幕（多語言）。

---

## 4. 資源使用實測（M2、16GB Mac）

### 4.1 記憶體 (RSS)

| 階段 | RSS |
|---|---|
| 行程剛啟動，還沒載模型 | ~91 MB |
| 第一次轉錄完（模型 mmap 進記憶體） | ~290 MB |
| 之後穩定 | 80–300 MB（macOS 自動換出冷頁） |

= 0.5%–1.8% 記憶體占用。無感。

### 4.2 CPU

| 狀態 | 用量 |
|---|---|
| 待機（聽鍵盤事件） | 0.0% |
| 錄音中 | 1–3% |
| 轉錄那 0.3 秒 | 短暫吃 GPU + Neural Engine |

每天用個幾十次，累計約 1–2 分鐘的「重度運算」。電池影響微乎其微。

### 4.3 第一次按熱鍵的 cold start

- 開機後第一次按熱鍵：**2.7 秒**（模型從硬碟載進記憶體）
- 之後每次：**0.3 秒**

**睡眠/喚醒不算冷啟動** → 記憶體保留，模型還在 → 0.3 秒。

只有以下情境才會冷啟動：
- 完全重開機
- 登出再登入
- macOS 套用安全更新自動重開機
- 手動 `launchctl kickstart -k`

---

## 5. Cloud vs Local 對比

```
┌──────────────────────────────┐    ┌──────────────────────────────┐
│  雲端（OpenAI Whisper API）    │    │  本地（mlx-whisper）          │
├──────────────────────────────┤    ├──────────────────────────────┤
│  音訊 → 上傳 OpenAI 伺服器     │    │  音訊 → 留在你 Mac 的 RAM     │
│  他們 GPU 算 → 文字 → 回傳    │    │  M2 晶片算 → 文字            │
│  $0.006 / 分鐘                │    │  $0                          │
│  需要網路                     │    │  離線可用                     │
│  資料在他們伺服器              │    │  資料永遠在你 Mac             │
│  模型版本他們控               │    │  你決定用哪個版本             │
└──────────────────────────────┘    └──────────────────────────────┘
```

對應的商業工具比較：

| 工具 | 成本 | 隱私 | 模型 |
|---|---|---|---|
| **這個 voice-input** | $0 + 290 MB 記憶體 | 100% 本地 | mlx-whisper small |
| Wispr Flow | $12/月 | 上傳到他們伺服器 | 商業模型 |
| Apple 內建聽寫 | $0 | 跨網路傳給 Apple | Apple 自家 |
| OpenAI Whisper API | ~$0.006/分鐘 | 上傳給 OpenAI | Whisper large |
| Otter.ai | $20/月 | 上傳到他們伺服器 | 商業模型 |

---

## 6. 為什麼現在能在筆電做這件事

過去十年三個關鍵突破讓本地推論變可能：

### 6.1 模型壓縮（Distillation）

- Whisper Large 是 1550 MB → small 是 459 MB → tiny 只 75 MB
- 透過知識蒸餾（distillation），讓小模型學到大模型的能力
- 準確度雖低一些，但對日常使用夠用

### 6.2 量化（Quantization）

- 原始參數每個是 32-bit float（4 bytes）
- 壓成 16-bit float (2 bytes) 或 int8 (1 byte) → 體積砍半甚至 1/4
- 數學精度損失極小，但運算速度快很多

### 6.3 Apple Silicon 的 Neural Engine

- M2 內建 16 核心 **ANE (Apple Neural Engine)**
- 專門做矩陣乘法
- 15.8 TOPS（每秒 15.8 兆次運算）
- 散熱低、耗電少
- 跑 mlx-whisper 時 macOS 自動分派任務給它

### 6.4 歷史對比

| 年份 | 在筆電跑 Whisper-quality 模型 |
|---|---|
| 2018 | 不可能 — 需要 NVIDIA 服務器 |
| 2020 | 要 Mac + 外接 GPU |
| 2022 | M1 上勉強跑（純 CPU 慢） |
| 2024 | M2/M3 + mlx 框架成熟 |
| 現在 | **0.3 秒轉錄 3 秒語音，接近實時** |

---

## 7. 順帶一提：你電腦上其實已經跑著很多 ML

「本地跑 ML 模型」並不是新鮮事，只是平常你沒注意：

- **macOS 相簿的人臉辨識** → 全本地
- **iPhone Face ID** → 全本地（在 Secure Enclave）
- **macOS Spotlight 語意搜尋**（macOS 15+） → 本地 LLM
- **iOS 即時翻譯（離線模式）** → 本地
- **iPhone 鍵盤的字詞建議** → 本地小型語言模型

差別只是：以前這些模型都很小很簡單。現在我們把「OpenAI 等級」的模型也搬下來自己跑了。

---

## 8. 延伸閱讀

- **MLX 框架**: https://github.com/ml-explore/mlx
- **MLX 範例庫**（含 Whisper、Llama、Stable Diffusion）: https://github.com/ml-explore/mlx-examples
- **Whisper 原論文**: *Robust Speech Recognition via Large-Scale Weak Supervision* (OpenAI, 2022)
- **HuggingFace MLX 社群模型**: https://huggingface.co/mlx-community
- **faster-whisper**（Windows / Linux / 沒 GPU 的 Mac 替代）: https://github.com/SYSTRAN/faster-whisper
- **whisper.cpp**（純 C++ 實作，跨平台）: https://github.com/ggerganov/whisper.cpp

---

## 名詞對照表

| 縮寫 / 術語 | 中文 | 在這份文件裡的脈絡 |
|---|---|---|
| ANE | Apple Neural Engine | Apple 自家晶片內建的 ML 加速器 |
| TOPS | Tera Operations Per Second | 每秒兆次運算，衡量晶片 ML 算力的單位 |
| Inference / 推論 | 用訓練好的模型做預測 | 跟「訓練」相對 |
| Encoder / Decoder | 編碼器 / 解碼器 | Transformer 兩大區塊 |
| Mel Spectrogram | 梅爾頻譜 | 音訊的頻域表示，給模型看的標準格式 |
| Quantization / 量化 | 把高精度數字壓成低精度 | float32 → int8 |
| Distillation / 蒸餾 | 大模型教小模型 | 讓小模型也夠用 |
| RSS | Resident Set Size | 行程實際在物理記憶體裡的 bytes 數 |
| mmap | Memory-mapped file | 把檔案對應到記憶體地址，懶載入 |
