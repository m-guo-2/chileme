"use client";

import { useMemo, useState } from "react";
import { SectionCard } from "@/components/section-card";
import { useSpeechInput } from "@/lib/voice/use-speech-input";
import type { AnalyzeResponse } from "@/lib/types/chileme";

const recentQuickPicks = ["和府捞面", "Green Bowl", "沙县小吃", "公司楼下麻辣烫"];

export function RecordComposer() {
  const [text, setText] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [location, setLocation] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  const speech = useSpeechInput();
  const finalDraft = useMemo(() => speech.transcript || text, [speech.transcript, text]);

  const handleSubmit = async () => {
    if (!finalDraft.trim()) return;

    setPending(true);
    const payload = {
      text: finalDraft.trim(),
      restaurant: restaurant.trim() || undefined,
      location: location.trim() || undefined,
      source: speech.transcript ? ("voice" as const) : ("text" as const),
      transcript: speech.transcript || undefined,
    };

    const response = await fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = (await response.json()) as AnalyzeResponse;
    setResult(json);
    setText("");
    setRestaurant("");
    setLocation("");
    speech.reset();
    setPending(false);
  };

  return (
    <div className="space-y-5">
      <SectionCard title="随口记一顿" action={<span className="chip">低成本输入</span>}>
        <div className="space-y-4">
          <textarea
            className="textarea"
            placeholder="比如：中午吃了和府，面还行，但是有点咸，32 块。"
            value={finalDraft}
            onChange={(event) => setText(event.target.value)}
          />

          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="input"
              placeholder="可选补充餐厅名"
              value={restaurant}
              onChange={(event) => setRestaurant(event.target.value)}
            />
            <input
              className="input"
              placeholder="可选补充定位，例如公司楼下"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {recentQuickPicks.map((item) => (
              <button
                key={item}
                className="ghost-button !px-4 !py-2 !text-sm"
                onClick={() => setRestaurant(item)}
                type="button"
              >
                最近吃过 · {item}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="primary-button"
              onClick={speech.status === "listening" ? speech.stop : speech.start}
              type="button"
            >
              {speech.status === "listening" ? "停止语音" : "开始语音"}
            </button>
            <button className="ghost-button" onClick={handleSubmit} type="button" disabled={pending}>
              {pending ? "正在分析..." : "提交并分析"}
            </button>
          </div>

          <div className="rounded-[20px] bg-[rgba(255,255,255,0.66)] p-4 text-sm leading-7 text-[var(--muted)]">
            <div>语音状态：{speech.status === "listening" ? "正在听" : "空闲"}</div>
            <div>转写草稿：{speech.transcript || "还没有语音内容"}</div>
            {speech.error ? <div className="text-[var(--warning)]">{speech.error}</div> : null}
          </div>
        </div>
      </SectionCard>

      {result ? (
        <>
          <SectionCard title="轻反馈">
            <p className="text-lg leading-8">{result.feedback}</p>
          </SectionCard>

          <SectionCard title="结构化分析结果">
            <div className="grid gap-3 md:grid-cols-2">
              <InfoRow label="餐次" value={result.analysis.mealSlot} />
              <InfoRow label="餐厅" value={result.analysis.restaurant} />
              <InfoRow label="菜品" value={result.analysis.foods.join(" / ")} />
              <InfoRow label="价格" value={result.analysis.price ? `${result.analysis.price} 元` : "未识别"} />
              <InfoRow label="满意度" value={result.analysis.sentiment} />
              <InfoRow label="复购意愿" value={result.analysis.repurchaseIntent} />
              <InfoRow label="标签" value={result.analysis.tags.join("、")} />
              <InfoRow label="不确定性" value={result.analysis.uncertainty ? "有" : "无"} />
            </div>
            <div className="mt-4 rounded-[20px] bg-[rgba(255,255,255,0.64)] p-4 leading-7">
              {result.analysis.summary}
            </div>
          </SectionCard>
        </>
      ) : null}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-[rgba(176,108,46,0.12)] bg-[rgba(255,255,255,0.68)] p-4">
      <div className="mb-1 text-sm text-[var(--muted)]">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
