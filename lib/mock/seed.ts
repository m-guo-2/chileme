import type {
  MealRecord,
  RecommendationItem,
  WeeklySummary,
} from "@/lib/types/chileme";

const now = new Date();

const toRecentIso = (daysAgo: number, hour: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, 20, 0, 0);
  return date.toISOString();
};

export const seededRecords: MealRecord[] = [
  {
    id: "rec-001",
    timestamp: toRecentIso(0, 12),
    mealSlot: "lunch",
    originalText: "中午吃了和府，面还行，但是有点咸，32 块。",
    restaurant: "和府捞面",
    foods: ["面"],
    price: 32,
    sentiment: "neutral",
    tags: ["偏咸", "工作日午餐", "连锁"],
    repurchaseIntent: "maybe",
    uncertainty: false,
    summary: "你中午更看重快和稳，但对口味有一点挑剔。",
    source: "text",
  },
  {
    id: "rec-002",
    timestamp: toRecentIso(1, 19),
    mealSlot: "dinner",
    originalText: "晚饭还是吃了沙县，便宜是便宜，就是最近有点吃腻了。",
    restaurant: "沙县小吃",
    foods: ["拌面", "蒸饺"],
    price: 22,
    sentiment: "negative",
    tags: ["便宜", "吃腻", "快"],
    repurchaseIntent: "no",
    uncertainty: false,
    summary: "你最近对便宜快餐有点疲劳，晚饭想换换口味。",
    source: "text",
  },
  {
    id: "rec-003",
    timestamp: toRecentIso(2, 12),
    mealSlot: "lunch",
    originalText: "今天还是公司楼下轻食，贵一点，但吃完没负担。",
    restaurant: "Green Bowl",
    foods: ["鸡胸肉沙拉"],
    price: 39,
    sentiment: "positive",
    tags: ["轻食", "清淡", "办公室"],
    repurchaseIntent: "yes",
    uncertainty: false,
    summary: "你对清爽轻负担的午餐评价更高。",
    source: "voice",
    transcript: "今天还是公司楼下轻食，贵一点，但吃完没负担。",
  },
  {
    id: "rec-004",
    timestamp: toRecentIso(3, 19),
    mealSlot: "dinner",
    originalText: "晚上吃了川菜，挺下饭，但有点太油了。",
    restaurant: "川香馆",
    foods: ["回锅肉", "米饭"],
    price: 48,
    sentiment: "neutral",
    tags: ["偏油", "重口", "晚饭"],
    repurchaseIntent: "maybe",
    uncertainty: false,
    summary: "你能接受重口，但最近晚上不太想吃得太油。",
    source: "text",
  },
];

export const seededRecommendations: RecommendationItem[] = [
  {
    id: "recmd-001",
    name: "楼下轻食碗",
    reason: "你最近中午更喜欢清爽一点，而且这家吃完不累。",
    budget: "35-42 元",
    scene: "清淡点",
    weight: 92,
  },
  {
    id: "recmd-002",
    name: "牛肉粉",
    reason: "想吃热乎点但别太重口，这个比川菜更稳。",
    budget: "26-32 元",
    scene: "求稳",
    weight: 86,
  },
  {
    id: "recmd-003",
    name: "烤鸡腿饭",
    reason: "价格还在你常见区间，也能避开最近吃腻的沙县。",
    budget: "28-34 元",
    scene: "换口味",
    weight: 81,
  },
];

export const seededWeeklySummary: WeeklySummary = {
  weekLabel: "第 10 周",
  recordCount: 9,
  averageSpend: 34,
  mostFrequent: "面 / 粉",
  repeated: true,
  highlights: [
    "这周午餐更偏清淡，晚餐明显在躲太油的选项。",
    "你对快、稳、别踩雷的关注度正在上升。",
    "沙县这类高频选项开始出现疲劳信号。",
  ],
};
