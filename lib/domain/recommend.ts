import type {
  MealRecord,
  MemoryItem,
  RecommendationItem,
} from "@/lib/types/chileme";

const recommendationPool: RecommendationItem[] = [
  {
    id: "pool-001",
    name: "番茄肥牛饭",
    reason: "热乎、稳、不容易出错。",
    budget: "28-34 元",
    scene: "求稳",
    weight: 80,
  },
  {
    id: "pool-002",
    name: "鸡胸肉能量碗",
    reason: "你最近更需要轻一点、清爽一点。",
    budget: "34-40 元",
    scene: "清淡点",
    weight: 84,
  },
  {
    id: "pool-003",
    name: "牛肉粉",
    reason: "想吃热的又别太油，这个比较平衡。",
    budget: "25-32 元",
    scene: "快一点",
    weight: 78,
  },
  {
    id: "pool-004",
    name: "烤鸡腿饭",
    reason: "比最近高频选择更新鲜，但仍在熟悉预算内。",
    budget: "29-35 元",
    scene: "换口味",
    weight: 77,
  },
  {
    id: "pool-005",
    name: "紫菜虾皮馄饨",
    reason: "如果晚上不想吃太重，这个压力小很多。",
    budget: "18-24 元",
    scene: "省钱",
    weight: 75,
  },
];

export const buildRecommendations = (
  records: MealRecord[],
  memories: MemoryItem[],
): RecommendationItem[] => {
  const recentRestaurants = new Set(records.slice(0, 2).map((record) => record.restaurant));
  const avoidHeavy = memories.some(
    (item) => item.id === "memory-taste" && item.detail.includes("清爽"),
  );
  const avoidRestaurant = records.find((record) => record.sentiment === "negative")?.restaurant;

  return recommendationPool
    .map((item) => {
      let weight = item.weight;

      if (avoidHeavy && item.scene === "清淡点") weight += 8;
      if (item.name.includes("鸡腿饭") && recentRestaurants.has("沙县小吃")) weight += 6;
      if (avoidRestaurant && item.reason.includes(avoidRestaurant)) weight -= 12;
      if (item.scene === "换口味" && records[0]?.repurchaseIntent === "no") weight += 5;

      return {
        ...item,
        weight,
        reason:
          item.scene === "换口味"
            ? `你最近对重复内容有点疲劳，${item.reason}`
            : item.reason,
      };
    })
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 4);
};

export const buildQuickMemory = (memories: MemoryItem[]) =>
  memories.slice(0, 3).map((memory) => memory.detail);
