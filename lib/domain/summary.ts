import type { MealRecord, WeeklySummary } from "@/lib/types/chileme";

const average = (values: number[]) =>
  values.length === 0
    ? 0
    : Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);

export const buildWeeklySummary = (records: MealRecord[]): WeeklySummary => {
  const currentWeekLabel = `第 ${Math.ceil(new Date().getDate() / 7)} 周`;
  const prices = records.flatMap((record) => (record.price ? [record.price] : []));
  const allFoods = records.flatMap((record) => record.foods);

  const foodCounts = allFoods.reduce<Record<string, number>>((acc, food) => {
    acc[food] = (acc[food] || 0) + 1;
    return acc;
  }, {});

  const mostFrequent =
    Object.entries(foodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "简餐";

  const heavyCount = records.filter((record) => record.tags.includes("偏油")).length;
  const repeated = new Set(records.map((record) => record.restaurant)).size < records.length - 1;

  return {
    weekLabel: currentWeekLabel,
    recordCount: records.length,
    averageSpend: average(prices),
    mostFrequent,
    repeated,
    highlights: [
      repeated ? "这周有几家店重复出现，说明你最近更偏向省心选项。" : "这周尝试得更分散，换口味意愿在上升。",
      heavyCount > 0 ? "偏油内容出现过几次，推荐会适当拉回清淡选项。" : "整体吃得不算重，状态比较平衡。",
      `你当前的主流预算大约在 ${average(prices) || 30} 元附近。`,
    ],
  };
};
