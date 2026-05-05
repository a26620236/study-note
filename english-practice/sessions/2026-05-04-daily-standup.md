# 每日站會 — 2026-05-04

## Context

- **Your role**: Frontend engineer on the Web Platform team
- **角色**: 前端工程師，Web Platform team

- **Counterpart**: Sarah, scrum master — friendly but sharp; calls out vague updates and digs into hidden blockers
- **對方**: Sarah，scrum master，個性 friendly 但敏銳，會挑模糊的進度報告、追問隱藏的 blocker

- **Goal**: Give a clear yesterday / today / blockers update; handle follow-up questions without scrambling
- **目標**: 給出清楚的 yesterday / today / blockers，被追問時能補細節而不慌

## Full Coached Transcript

### Turn 1

**Sarah**: Morning! Let's kick things off with you today. What did you get done yesterday?

**You (original)**: I finished serveral things:
1. implement virtual tag feature
2. fix dashboard page crash on mobile web issue
3. 1 on 1 with team lead

**You (polished)**: I wrapped up a few things yesterday. First, I shipped the virtual tag feature. I also fixed a crash on the dashboard page on mobile web. And I had a 1:1 with my team lead.

**Feedback**:
- 🔍 `serveral` 是 typo（正確：several）。口語站會更常用 `a few`。
- 🔍 條列三件事在口語裡要用完整句子串起來（First... I also... And...），不能像寫 Slack 那樣丟動詞原形。
- 🔍 動詞要過去式：implement → shipped、fix → fixed、1 on 1 → had a 1:1。
- 🔍 `crash on mobile web issue` 結尾的 issue 是冗字，bug 本身就是 issue。
- 💡 wrap up（收尾）/ ship（前端最常用）/ knock out（快速做完）/ a 1:1（一對一會議）。

---

### Turn 2

**Sarah**: Nice — the virtual tag feature is the one Product's been waiting on, right? Is it fully shipped to prod, or just merged to main? And quick one on the mobile crash — was that the same Safari issue we saw last sprint, or something new?

**You (original)**: The virtual tag feature has already shipped to staging, ready for QA to test. and I am not pretty sure the mobile crash is related to the Safari issue we found last sprint, let me take a look.

**You (polished)**: The virtual tag feature is already on staging — it's ready for QA. As for the mobile crash, I'm not 100% sure if it's the same Safari issue we hit last sprint. Let me dig into it and get back to you.

**Feedback**:
- 🔍 ❌ **"I am not pretty sure"** 重大錯誤。`pretty sure` 是固定片語，不能加 not 否定。要說 "I'm not sure" / "I'm not 100% sure"。
- 🔍 `ship` 通常指 prod / customer-facing，到 staging 用 deploy / push / "is on staging" 更精確。
- 🔍 兩件事之間用 "As for X, ..." 切換主題比 and 清楚。
- 💡 dig into / get back to you / EOD / As for X。

---

### Turn 3

**Sarah**: Sounds good — please post in #web-bugs once you've narrowed it down, even if it's just "different root cause." Last sprint we lost half a day because nobody updated the thread. Okay, what's on your plate today?

**You (original)**: I will survey package for element drag and drop using in next feature, and fix bugs found by QA on virtual tag e2e tests.

**You (polished)**: Today I'm going to evaluate a few drag-and-drop libraries for our next feature, and then knock out the bugs QA flagged in the virtual tag e2e tests.

**Feedback**:
- 🔍 ❌ **"survey package"** 是中翻英直譯。應該用 evaluate / compare / research / spike on。
- 🔍 package → libraries（JS 圈口語上 library 比 package 自然）。
- 🔍 `element drag and drop` → `drag-and-drop`（連字號，element 多餘）。
- 🔍 `using in next feature` 文法壞掉，要用 `to use in the next feature` / `for the next feature`。
- 🔍 `bugs found by QA on tests` → `bugs QA flagged in the tests`（主動句更直接，介系詞 in 不是 on）。
- 💡 spike on / on my plate / knock out / flag / circle back to。

---

### Turn 4

**Sarah**: Drag-and-drop, hmm — do you already have a shortlist, or starting from scratch? Asking because Mike on the mobile team did a similar evaluation two months ago for the file-upload feature; might save you half a day if you talk to him first.

**You (original)**: good! thanks for your information. I will ask him after daily

**You (polished)**: Oh nice, good to know — thanks for the heads-up. I'll ping Mike right after standup and see what he learned.

**Feedback**:
- 🔍 ❌ **"thanks for your information"** 經典中翻英災難，聽起來像客服機器人。Native 說 "thanks for the heads-up" / "thanks for letting me know" / "good call"。
- 🔍 ❌ **"after daily"** 是「早會後」直譯。要說 "after standup" / "after this"。
- 🔍 "I will ask him" → "I'll ping him" / "I'll reach out to him" / "I'll catch up with him" 更貼近工程師日常。
- 💡 thanks for the heads-up / good call / ping / reach out to / loop someone in / save me a ton of time。

---

### Turn 5

**Sarah**: Cool — last question for you, any blockers or anything you need from the team?

**You (original)**: I have an dentist appointment tomorrow morning and I will leave 3 hours.

**You (polished)**: No blockers, but heads up — I've got a dentist appointment tomorrow morning, so I'll be offline for about 3 hours. Should be back around noon.

**Feedback**:
- 🔍 ❌ **"an dentist"** — `dentist` 是子音開頭，要用 a。
- 🔍 ❌ **"I will leave 3 hours"** 重大中翻英。`leave` 是「離開」，不能用來表達「不在 X 小時」。要說 "I'll be out for 3 hours" / "I'll be offline for 3 hours" / "I'll be AFK for a few hours"。
- 🔍 Sarah 問 blockers，要先講 "No blockers, but heads up..." 把這件事框成「順便告知」而不是「卡住」。
- 🔍 加 "Should be back around noon" 給對方明確時間範圍。
- 💡 heads up / be out / be offline / AFK / No blockers from my side / Quick FYI / on my end。

---

## Polished Dialogue

[Sarah]: Morning! Let's kick things off with you today. What did you get done yesterday?
[中]: 早安！今天從你開始。你昨天完成了什麼？

[You]: I wrapped up a few things yesterday. First, I shipped the virtual tag feature. I also fixed a crash on the dashboard page on mobile web. And I had a 1:1 with my team lead.
[中]: 我昨天收尾了幾件事。第一，我把 virtual tag feature 上線了。我也修了 dashboard 頁面在 mobile web 的 crash。然後我跟 team lead 做了一次 1:1。

[Sarah]: Nice — the virtual tag feature is the one Product's been waiting on, right? Is it fully shipped to prod, or just merged to main? And quick one on the mobile crash — was that the same Safari issue we saw last sprint, or something new?
[中]: 不錯耶 — virtual tag feature 是 Product 一直在等的那個對吧？已經完全上 prod 了，還是只 merge 到 main？然後想快速問一下 mobile crash — 是上個 sprint 看到的那個 Safari 問題，還是新的問題？

[You]: The virtual tag feature is already on staging — it's ready for QA. As for the mobile crash, I'm not 100% sure if it's the same Safari issue we hit last sprint. Let me dig into it and get back to you.
[中]: virtual tag feature 已經在 staging 上 — QA 可以測了。至於 mobile crash，我不太確定是不是上個 sprint 遇到的那個 Safari 問題。我深入查一下再回覆你。

[Sarah]: Sounds good — please post in #web-bugs once you've narrowed it down, even if it's just "different root cause." Last sprint we lost half a day because nobody updated the thread. Okay, what's on your plate today?
[中]: 好，等你縮小範圍後請發到 #web-bugs，就算只是「不同的 root cause」也好。上 sprint 我們因為沒人更新 thread 浪費了半天。OK 今天你手上有什麼？

[You]: Today I'm going to evaluate a few drag-and-drop libraries for our next feature, and then knock out the bugs QA flagged in the virtual tag e2e tests.
[中]: 今天我打算評估幾個 drag-and-drop 的 library 給下一個 feature 用，然後把 QA 在 virtual tag e2e tests 裡發現的 bug 修一修。

[Sarah]: Drag-and-drop, hmm — do you already have a shortlist, or starting from scratch? Asking because Mike on the mobile team did a similar evaluation two months ago for the file-upload feature; might save you half a day if you talk to him first.
[中]: drag-and-drop 喔 — 你已經有候選清單了，還是從零開始？因為 mobile team 的 Mike 兩個月前為了 file-upload feature 做過類似評估，先去問他可能省你半天。

[You]: Oh nice, good to know — thanks for the heads-up. I'll ping Mike right after standup and see what he learned.
[中]: 喔太好了，謝謝你提醒。站會結束後我馬上 Slack 找 Mike，看他研究出什麼。

[Sarah]: Cool — last question for you, any blockers or anything you need from the team?
[中]: 好 — 最後一個問題，有什麼卡住的事，或需要 team 幫忙的嗎？

[You]: No blockers, but heads up — I've got a dentist appointment tomorrow morning, so I'll be offline for about 3 hours. Should be back around noon.
[中]: 沒有 blocker，但跟你們說一下 — 我明天早上有牙醫預約，所以會離線大約三小時。中午左右會回來。

[Sarah]: Got it, thanks for flagging. Hope it goes smoothly! Alright, that's it from you — appreciate the clear update today. Over to Mike.
[中]: 收到，謝謝你提一下。希望順利！好，你這邊到這 — 今天的更新很清楚，謝謝。換 Mike。

## Vocabulary Mined

| Word / Phrase | Meaning | Example from this session |
| --- | --- | --- |
| wrap up | 收尾、完成 | "I wrapped up a few things yesterday." |
| ship | 把功能做完並上線（前端最常用） | "I shipped the virtual tag feature." |
| knock out | 快速做完一批小事 / 修一堆小 bug | "I'll knock out the bugs QA flagged." |
| a 1:1 | 一對一會議（名詞，前面加 a / had） | "I had a 1:1 with my team lead." |
| dig into | 深入調查（bug、log） | "Let me dig into it and get back to you." |
| get back to you | 之後回覆你（站會神句） | "I'll get back to you by EOD." |
| EOD | end of day | "I'll have an answer by EOD." |
| As for X, ... | 切換話題到 X | "As for the mobile crash, ..." |
| evaluate / compare libraries | 比較套件選型（取代 survey package） | "I'll evaluate a few drag-and-drop libraries." |
| spike on | 花一小段時間做技術調研 | "I'll spike on Framer Motion this morning." |
| on my plate | 我手上要做的事 | "Two things on my plate today." |
| flag | （QA / reviewer）指出問題 | "The bugs QA flagged in the e2e tests." |
| circle back to | 等等再回來處理 | "I'll circle back to the API piece after lunch." |
| thanks for the heads-up | 謝謝提醒（取代 thanks for your information） | "Thanks for the heads-up about Mike." |
| good call | 你說得對 / 好建議 | "Good call, I hadn't thought of that." |
| ping | Slack 戳人 | "I'll ping Mike right after standup." |
| reach out to | 主動聯繫某人（比 ask 自然） | "I'll reach out to him later." |
| loop someone in | 把某人拉進對話 | "Let me loop in the backend team." |
| heads up | 提醒一下（名詞 / 動詞片語） | "Heads up — staging will be down at 3pm." |
| be out / be offline / be AFK | 不在線上、不在崗位 | "I'll be offline for about 3 hours." |
| No blockers (from my side) | 我這邊沒有卡住 | "No blockers from my side." |
| Quick FYI | 順便講一下 | "Quick FYI — I'll be out tomorrow morning." |
| on my end / from my side | 在我這邊 | "Everything looks good on my end." |
| save me a ton of time | 幫我省一堆時間 | "That'll save me a ton of time." |

## Phrase Patterns

- **Reporting completed work**: "I wrapped up X. I also did Y. And I had Z."
- **Hedging confidence**: "I'm not 100% sure if X — let me dig into it and get back to you."
- **Switching topics in standup**: "As for X, ..."
- **Stating today's plan**: "Today I'm going to X, and then Y." / "Two things on my plate today: X and Y."
- **Acknowledging a tip**: "Oh nice, good to know — thanks for the heads-up."
- **Framing non-blockers**: "No blockers, but heads up — ..."
- **Giving a return time**: "I'll be offline for X hours. Should be back around Y."

## Mistake Patterns to Watch

- ❌ **"I am not pretty sure"** — `pretty sure` 不能加 not 否定。用 "I'm not sure" / "I'm not 100% sure"。
- ❌ **"thanks for your information"** — 中翻英災難。用 "thanks for the heads-up" / "thanks for letting me know"。
- ❌ **"after daily"** — 中文「早會後」直譯。要說 "after standup" / "after this"。
- ❌ **"I will leave 3 hours"** — `leave` 不能表達「不在 X 小時」。要說 "I'll be out / offline / AFK for 3 hours"。
- ❌ **"survey package"** — `survey` 在工程語境不用來表達「比較套件」。用 evaluate / compare / spike on。
- ❌ **"using in next feature"** — 文法壞掉。要說 "to use in the next feature" / "for the next feature"。
- ❌ **"an dentist"** — 冠詞看「發音」不看字母，dentist 子音 /d/ 開頭用 a。
- ❌ 動詞原形列點（implement / fix / 1 on 1）— 口語要用完整句子，動詞要過去式。
- ❌ 結尾加冗字 `issue` — bug 本身就是 issue 不要重複（"crash on mobile web issue" → "crash on mobile web"）。
- ❌ 過度使用被動句（"bugs found by QA"）— 工程口語多用主動句（"bugs QA flagged"）。

## Next Session Suggestion

下次可以練 **code-review-receiving**（收到別人 review 怎麼回應 + 適度 push back），深化「不卑不亢回應批評」的英文表達。或是練 **pm-spec-discussion**，學會跟 PM 提出 edge case 跟技術可行性的英文話術。
