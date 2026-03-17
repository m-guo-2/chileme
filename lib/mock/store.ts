import { analyzeMeal, buildFeedback } from "@/lib/domain/analyze";
import { applyMemoryCorrection, buildMemoryCards } from "@/lib/domain/memory";
import { buildQuickMemory, buildRecommendations } from "@/lib/domain/recommend";
import { buildWeeklySummary } from "@/lib/domain/summary";
import { seededRecords } from "@/lib/mock/seed";
import type {
  AnalyzeResponse,
  DashboardPayload,
  MealRecord,
  MealRecordInput,
  MemoryPayload,
  ProfilePayload,
} from "@/lib/types/chileme";

const records: MealRecord[] = [...seededRecords].sort((a, b) =>
  b.timestamp.localeCompare(a.timestamp),
);

let memoryCards = buildMemoryCards(records);

const currentMealLabel = () => {
  const hour = new Date().getHours();
  if (hour < 10) return "早餐";
  if (hour < 15) return "午餐";
  if (hour < 21) return "晚餐";
  return "加餐";
};

const currentPrompt = () => {
  const meal = currentMealLabel();
  if (meal === "午餐") {
    return "中午了，今天吃了么？";
  }

  if (meal === "晚餐") {
    return "今晚别让自己随便糊弄过去，来点更懂你的。";
  }

  return "记一顿、看一顿，让系统慢慢懂你。";
};

export const getDashboardPayload = (): DashboardPayload => ({
  currentMealLabel: currentMealLabel(),
  prompt: currentPrompt(),
  quickMemory: buildQuickMemory(memoryCards),
  recommendations: buildRecommendations(records, memoryCards),
  recentRecords: records.slice(0, 3),
});

export const getMemoryPayload = (): MemoryPayload => ({
  cards: memoryCards,
});

export const getProfilePayload = (): ProfilePayload => ({
  history: records,
  weeklySummary: buildWeeklySummary(records),
  favorites: Array.from(new Set(records.map((record) => record.restaurant))).slice(0, 3),
  settings: [
    { key: "推荐风格", value: "朋友式、少打断、讲理由" },
    { key: "语音输入", value: "浏览器支持时启用" },
    { key: "数据模式", value: "Mock 演示数据" },
  ],
});

export const createRecord = (input: MealRecordInput): AnalyzeResponse => {
  const analysis = analyzeMeal(input);
  const record: MealRecord = {
    id: `rec-${Date.now()}`,
    ...analysis,
    source: input.source,
    location: input.location,
  };

  records.unshift(record);
  memoryCards = buildMemoryCards(records);

  return {
    feedback: buildFeedback(analysis),
    analysis,
    record,
  };
};

export const updateMemoryCard = (id: string, detail: string) => {
  memoryCards = applyMemoryCorrection(memoryCards, id, detail);
  return { cards: memoryCards };
};
