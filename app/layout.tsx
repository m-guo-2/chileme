import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "吃了么",
  description: "围绕记录每一顿和决定下一顿的轻量饮食助手",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="app-shell">
          <div className="app-container">{children}</div>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
