export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";
export type Sentiment = "positive" | "neutral" | "negative";
export type RepurchaseIntent = "yes" | "maybe" | "no";
export type RecommendationScene = "省钱" | "求稳" | "换口味" | "快一点" | "清淡点";
export type MemoryCategory = "taste" | "habit" | "favorite" | "warning";

export interface MealRecordInput {
  text: string;
  restaurant?: string;
  location?: string;
  source: "text" | "voice";
  transcript?: string;
}

export interface MealAnalysis {
  mealSlot: MealSlot;
  timestamp: string;
  originalText: string;
  transcript?: string;
  restaurant: string;
  foods: string[];
  price?: number;
  sentiment: Sentiment;
  tags: string[];
  repurchaseIntent: RepurchaseIntent;
  uncertainty: boolean;
  summary: string;
}

export interface MealRecord extends MealAnalysis {
  id: string;
  source: "text" | "voice";
  location?: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  detail: string;
  category: MemoryCategory;
  strength: number;
  trend: "up" | "down" | "steady";
  correctionHint?: string;
}

export interface RecommendationItem {
  id: string;
  name: string;
  reason: string;
  budget: string;
  scene: RecommendationScene;
  weight: number;
}

export interface WeeklySummary {
  weekLabel: string;
  recordCount: number;
  averageSpend: number;
  mostFrequent: string;
  repeated: boolean;
  highlights: string[];
}

export interface DashboardPayload {
  currentMealLabel: string;
  prompt: string;
  quickMemory: string[];
  recommendations: RecommendationItem[];
  recentRecords: MealRecord[];
}

export interface MemoryPayload {
  cards: MemoryItem[];
}

export interface ProfilePayload {
  history: MealRecord[];
  weeklySummary: WeeklySummary;
  favorites: string[];
  settings: Array<{ key: string; value: string }>;
}

export interface AnalyzeResponse {
  feedback: string;
  analysis: MealAnalysis;
  record: MealRecord;
}
