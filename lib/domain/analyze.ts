import type {
  MealAnalysis,
  MealRecordInput,
  MealSlot,
  RepurchaseIntent,
  Sentiment,
} from "@/lib/types/chileme";

const restaurantKeywords: Array<[string, string]> = [
  ["和府", "和府捞面"],
  ["沙县", "沙县小吃"],
  ["轻食", "Green Bowl"],
  ["川菜", "川香馆"],
  ["麻辣烫", "麻辣烫"],
  ["黄焖鸡", "黄焖鸡米饭"],
  ["粉", "牛肉粉"],
];

const foodKeywords = ["面", "粉", "沙拉", "米饭", "鸡腿饭", "蒸饺", "麻辣烫"];

const positiveWords = ["好吃", "满意", "不错", "喜欢", "没负担", "稳", "清爽"];
const negativeWords = ["咸", "腻", "一般", "太油", "踩雷", "不行", "难吃"];

const tagKeywords: Array<[string, string]> = [
  ["便宜", "便宜"],
  ["快", "快"],
  ["咸", "偏咸"],
  ["腻", "吃腻"],
  ["油", "偏油"],
  ["轻", "清淡"],
  ["辣", "偏辣"],
];

const extractPrice = (text: string) => {
  const match = text.match(/(\d{1,3})(?:\s*块|\s*元)?/);
  return match ? Number(match[1]) : undefined;
};

const inferMealSlot = (text: string): MealSlot => {
  if (text.includes("早") || text.includes("早餐")) return "breakfast";
  if (text.includes("晚") || text.includes("晚饭")) return "dinner";
  if (text.includes("夜宵") || text.includes("加餐")) return "snack";
  return "lunch";
};

const inferRestaurant = (text: string, fallback?: string) => {
  if (fallback?.trim()) return fallback.trim();

  for (const [keyword, restaurant] of restaurantKeywords) {
    if (text.includes(keyword)) return restaurant;
  }

  return "今天这顿";
};

const inferFoods = (text: string) => {
  const hits = foodKeywords.filter((keyword) => text.includes(keyword));
  return hits.length > 0 ? hits : ["简餐"];
};

const inferSentiment = (text: string): Sentiment => {
  const positiveScore = positiveWords.filter((word) => text.includes(word)).length;
  const negativeScore = negativeWords.filter((word) => text.includes(word)).length;

  if (negativeScore > positiveScore) return "negative";
  if (positiveScore > negativeScore) return "positive";
  return "neutral";
};

const inferRepurchaseIntent = (text: string, sentiment: Sentiment): RepurchaseIntent => {
  if (text.includes("不") || text.includes("不一定") || text.includes("吃腻")) return "no";
  if (text.includes("下次还") || text.includes("还会") || sentiment === "positive") return "yes";
  return "maybe";
};

const inferTags = (text: string) => {
  const tags = tagKeywords
    .filter(([keyword]) => text.includes(keyword))
    .map(([, tag]) => tag);

  return tags.length > 0 ? Array.from(new Set(tags)) : ["日常记录"];
};

const buildSummary = (analysis: Omit<MealAnalysis, "summary">) => {
  if (analysis.sentiment === "positive") {
    return `这顿 ${analysis.restaurant} 整体体验不错，你对 ${analysis.tags[0]} 的反馈是正向的。`;
  }

  if (analysis.sentiment === "negative") {
    return `这顿更像是在填饱肚子，${analysis.tags[0]} 已经开始影响你的下次选择。`;
  }

  return `这是一顿偏日常的 ${analysis.mealSlot}，你在意 ${analysis.tags.join("、")}。`;
};

export const analyzeMeal = (input: MealRecordInput): MealAnalysis => {
  const sourceText = input.source === "voice" ? input.transcript || input.text : input.text;
  const mealSlot = inferMealSlot(sourceText);
  const restaurant = inferRestaurant(sourceText, input.restaurant);
  const foods = inferFoods(sourceText);
  const price = extractPrice(sourceText);
  const sentiment = inferSentiment(sourceText);
  const tags = inferTags(sourceText);
  const repurchaseIntent = inferRepurchaseIntent(sourceText, sentiment);
  const uncertainty = restaurant === "今天这顿";

  const analysisBase = {
    mealSlot,
    timestamp: new Date().toISOString(),
    originalText: input.text,
    transcript: input.transcript,
    restaurant,
    foods,
    price,
    sentiment,
    tags,
    repurchaseIntent,
    uncertainty,
  };

  return {
    ...analysisBase,
    summary: buildSummary(analysisBase),
  };
};

export const buildFeedback = (analysis: MealAnalysis) => {
  if (analysis.sentiment === "positive") {
    return `记下了，这顿 ${analysis.restaurant} 看起来挺对胃口。`;
  }

  if (analysis.sentiment === "negative") {
    return `记下了，我会把这顿的不满意也算进下一顿推荐里。`;
  }

  return `收到，这顿先帮你记住，后面我会继续学你更偏哪一口。`;
};
