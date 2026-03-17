# 吃了么 V1 Mock API

## `GET /api/dashboard`

返回首页聚合数据：

- 当前餐次文案
- 最近记忆反馈
- 推荐列表
- 最近记录

## `POST /api/records`

请求体：

```json
{
  "text": "中午吃了和府，面还行，但是有点咸，32 块",
  "restaurant": "和府捞面",
  "location": "公司楼下",
  "source": "text",
  "transcript": "可选，语音转写结果"
}
```

响应：

- `feedback`：轻反馈文案
- `analysis`：结构化分析结果
- `record`：已经写入 mock store 的记录

## `GET /api/memory`

返回记忆页卡片数组。

## `PATCH /api/memory`

请求体：

```json
{
  "id": "memory-taste",
  "detail": "我不是一直不爱重口，只是最近几顿偏腻。"
}
```

响应：

- 更新后的记忆卡片数组

## `GET /api/profile`

返回：

- `history`：历史记录
- `weeklySummary`：每周总结
- `favorites`：收藏占位数据
- `settings`：设置占位数据
