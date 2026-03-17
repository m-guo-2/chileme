import type { PropsWithChildren, ReactNode } from "react";

interface SectionCardProps extends PropsWithChildren {
  title?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionCard({ title, action, className, children }: SectionCardProps) {
  return (
    <section className={`card p-5 ${className || ""}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? <h2 className="section-title mb-0">{title}</h2> : <span />}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
