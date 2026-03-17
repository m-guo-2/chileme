"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "首页" },
  { href: "/record", label: "记录" },
  { href: "/memory", label: "记忆" },
  { href: "/profile", label: "我的" },
] satisfies Array<{ href: Route; label: string }>;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const isActive =
          item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            className={`nav-link ${isActive ? "active" : ""}`}
            href={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
