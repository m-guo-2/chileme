"use client";

import { useEffect, useState } from "react";
import { SectionCard } from "@/components/section-card";
import type { ProfilePayload } from "@/lib/types/chileme";

export function ProfileOverview() {
  const [data, setData] = useState<ProfilePayload | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((payload: ProfilePayload) => setData(payload));
  }, []);

  if (!data) {
    return <div className="soft-text">正在整理历史记录和周总结...</div>;
  }

  return (
    <div className="space-y-5">
      <SectionCard title="这周总结" action={<span className="chip">{data.weeklySummary.weekLabel}</span>}>
        <div className="grid gap-4 md:grid-cols-3">
          <Metric label="记录次数" value={`${data.weeklySummary.recordCount}`} />
          <Metric label="平均花费" value={`${data.weeklySummary.averageSpend} 元`} />
          <Metric label="最常吃" value={data.weeklySummary.mostFrequent} />
        </div>
        <div className="mt-4 space-y-2 text-[var(--muted)]">
          {data.weeklySummary.highlights.map((highlight) => (
            <div key={highlight}>- {highlight}</div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="历史记录">
        <div className="space-y-3">
          {data.history.map((item) => (
            <div
              key={item.id}
              className="rounded-[20px] border border-[rgba(176,108,46,0.12)] bg-[rgba(255,255,255,0.68)] p-4"
            >
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <div className="font-medium">
                  {item.restaurant} · {item.foods.join(" / ")}
                </div>
                <div className="text-sm text-[var(--muted)]">
                  {new Date(item.timestamp).toLocaleString("zh-CN")}
                </div>
              </div>
              <div className="soft-text text-sm">{item.originalText}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="收藏占位">
          <div className="flex flex-wrap gap-2">
            {data.favorites.map((item) => (
              <span key={item} className="chip">
                {item}
              </span>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="设置占位">
          <div className="space-y-3">
            {data.settings.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-[var(--muted)]">{item.key}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-[rgba(255,255,255,0.68)] p-4">
      <div className="mb-1 text-sm text-[var(--muted)]">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
