"use client";

import { useEffect, useState } from "react";
import { SectionCard } from "@/components/section-card";
import type { MemoryItem, MemoryPayload } from "@/lib/types/chileme";

export function MemoryBoard() {
  const [cards, setCards] = useState<MemoryItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const response = await fetch("/api/memory");
      const payload = (await response.json()) as MemoryPayload;

      if (!cancelled) {
        setCards(payload.cards);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  const submitCorrection = async () => {
    if (!editingId || !draft.trim()) return;

    const response = await fetch("/api/memory", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, detail: draft.trim() }),
    });

    const payload = (await response.json()) as MemoryPayload;
    setCards(payload.cards);
    setEditingId(null);
    setDraft("");
  };

  return (
    <div className="space-y-5">
      <SectionCard title="系统正在这样理解你">
        <p className="soft-text leading-7">
          这里不是原始流水账，而是从你的记录里提炼出的倾向、习惯和避坑提醒。
        </p>
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <SectionCard
            key={card.id}
            title={card.title}
            action={<span className="chip">强度 {card.strength}</span>}
          >
            <div className="space-y-3">
              <p className="leading-7">{card.detail}</p>
              <div className="text-sm text-[var(--muted)]">趋势：{card.trend}</div>
              <button
                className="ghost-button"
                onClick={() => {
                  setEditingId(card.id);
                  setDraft(card.correctionHint || card.detail);
                }}
                type="button"
              >
                纠正这条理解
              </button>
            </div>
          </SectionCard>
        ))}
      </div>

      {editingId ? (
        <SectionCard title="轻量纠正">
          <div className="space-y-4">
            <textarea className="textarea" value={draft} onChange={(event) => setDraft(event.target.value)} />
            <div className="flex gap-3">
              <button className="primary-button" type="button" onClick={submitCorrection}>
                保存修正
              </button>
              <button
                className="ghost-button"
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setDraft("");
                }}
              >
                取消
              </button>
            </div>
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
