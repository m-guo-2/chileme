"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SectionCard } from "@/components/section-card";
import type { DashboardPayload } from "@/lib/types/chileme";

export function HomeDashboard() {
  const [data, setData] = useState<DashboardPayload | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((payload: DashboardPayload) => setData(payload));
  }, []);

  if (!data) {
    return <div className="soft-text">正在整理你的下一顿和最近记忆...</div>;
  }

  return (
    <div className="space-y-5">
      <SectionCard className="overflow-hidden p-0">
        <div className="rounded-[28px] bg-[linear-gradient(135deg,#fff1e2,#ffe0c8_50%,#ffd5bc)] p-6">
          <div className="chip mb-4">{data.currentMealLabel}时段</div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight">{data.prompt}</h1>
          <p className="soft-text mb-6 text-base leading-7">
            你可以随口记一顿，也可以直接看看现在更适合吃什么。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="primary-button" href="/record">
              记录这一顿
            </Link>
            <a className="ghost-button" href="#recommendations">
              看看现在吃什么
            </a>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="最近系统记住了什么">
        <div className="grid gap-3 md:grid-cols-3">
          {data.quickMemory.map((item) => (
            <div
              key={item}
              className="rounded-[22px] border border-[rgba(176,108,46,0.12)] bg-[rgba(255,255,255,0.66)] p-4 leading-7"
            >
              {item}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="下一顿推荐" className="space-y-4" action={<span className="chip">3-5 条可解释推荐</span>}>
        <div id="recommendations" className="grid gap-4">
          {data.recommendations.map((item) => (
            <article
              key={item.id}
              className="rounded-[24px] border border-[rgba(176,108,46,0.12)] bg-[rgba(255,255,255,0.68)] p-5"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <span className="chip">{item.scene}</span>
              </div>
              <p className="mb-3 leading-7 text-[var(--text)]">{item.reason}</p>
              <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                <span>预算 {item.budget}</span>
                <span>匹配度 {item.weight}</span>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="最近刚记下的">
        <div className="space-y-3">
          {data.recentRecords.map((record) => (
            <div
              key={record.id}
              className="flex flex-col gap-2 rounded-[20px] border border-[rgba(176,108,46,0.12)] bg-[rgba(255,255,255,0.62)] p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="mb-1 font-medium">
                  {record.restaurant} · {record.foods.join(" / ")}
                </div>
                <div className="soft-text text-sm">{record.summary}</div>
              </div>
              <div className="text-sm text-[var(--muted)]">
                {new Date(record.timestamp).toLocaleDateString("zh-CN")} · {record.price ?? "--"} 元
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
