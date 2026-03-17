# 吃了么 V1 Mock 技术栈

## 当前选择

- 前端框架：`Next.js 16`
- 语言：`TypeScript`
- UI：`React 19 + Tailwind CSS v4`
- API：`Next.js Route Handlers`
- 数据模式：`内存 mock store`
- 语音输入：`Web Speech API + TypeScript hook`

## 为什么这样选

- 当前仓库还没有工程代码，直接用一体化全栈结构可以最快把 4 个页面和 API 跑通。
- `Route Handlers` 能先提供稳定接口形态，后续拆独立后端时改动面更小。
- `内存 mock store` 让记录、记忆、推荐、历史、周总结能在同一轮开发里形成闭环。
- 语音输入按前端 TypeScript 封装，满足“语音用 ts”的要求，同时避免引入重 ASR 基础设施。

## Mock 边界

- 当前不接真实数据库，刷新进程后内存数据会重置。
- 当前不接真实 LLM，记录分析由规则/启发式逻辑生成。
- 当前不接真实地理定位和店铺识别，定位和餐厅补充为可选手填。
- 当前推荐引擎仍是规则版，但已经具备可解释输出结构。

## 后续替换点

- `lib/mock/store.ts` 可替换为数据库仓储层。
- `lib/domain/analyze.ts` 可替换为 ASR + LLM 结构化解析。
- `lib/domain/recommend.ts` 可替换为更细粒度召回与排序策略。
- `lib/domain/memory.ts` 可替换为长期偏好建模与纠错系统。
