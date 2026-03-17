import type { MealRecord, MemoryItem } from "@/lib/types/chileme";

const average = (values: number[]) => {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
};

export const buildMemoryCards = (records: MealRecord[]): MemoryItem[] => {
  const tagCounts = new Map<string, number>();
  const restaurantCounts = new Map<string, number>();
  const disliked: string[] = [];
  const priceSamples: number[] = [];

  for (const record of records) {
    for (const tag of record.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }

    restaurantCounts.set(record.restaurant, (restaurantCounts.get(record.restaurant) || 0) + 1);

    if (record.sentiment === "negative") {
      disliked.push(record.restaurant);
    }

    if (record.price) {
      priceSamples.push(record.price);
    }
  }

  const topTag = [...tagCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "求稳";
  const topRestaurant =
    [...restaurantCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "楼下常吃店";
  const averageBudget = average(priceSamples);
  const mealBias =
    records.filter((record) => record.mealSlot === "lunch").length >=
    records.filter((record) => record.mealSlot === "dinner").length
      ? "午餐更看重效率"
      : "晚餐更在意放松";

  return [
    {
      id: "memory-taste",
      title: "最近口味倾向",
      detail: `你最近明显在躲 ${topTag === "偏油" ? "太油" : topTag}，更偏向清爽和稳一点的选择。`,
      category: "taste",
      strength: 86,
      trend: "up",
      correctionHint: "不是一直不爱重口，只是最近这几顿偏腻。",
    },
    {
      id: "memory-budget",
      title: "预算与习惯",
      detail: `常见价格大约在 ${averageBudget || 30} 元上下，${mealBias}。`,
      category: "habit",
      strength: 78,
      trend: "steady",
      correctionHint: "最近贵一点也能接受，只要别踩雷。",
    },
    {
      id: "memory-favorite",
      title: "常吃与稳定选项",
      detail: `${topRestaurant} 还是你的高频选择，说明你对熟悉和省心有偏好。`,
      category: "favorite",
      strength: 73,
      trend: "steady",
      correctionHint: "高频不代表最喜欢，只是方便。",
    },
    {
      id: "memory-warning",
      title: "最近避坑提醒",
      detail:
        disliked.length > 0
          ? `${disliked[0]} 最近有负反馈，短期内不适合再高频推荐。`
          : "最近没有明显的避坑项，说明整体吃得还算稳定。",
      category: "warning",
      strength: 69,
      trend: disliked.length > 0 ? "up" : "down",
      correctionHint: "这次不满意不等于以后都不吃。",
    },
  ];
};

export const applyMemoryCorrection = (cards: MemoryItem[], id: string, detail: string) =>
  cards.map((card) =>
    card.id === id
      ? {
          ...card,
          detail,
          trend: "steady" as const,
        }
      : card,
  );
