import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "塑膠包材品質客訴智慧分析與改善管理系統",
  description: "整合客訴案件、生產履歷追溯、根本原因分析、8D 報告與品質 KPI 的塑膠包材品質管理系統。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body className="antialiased">{children}</body></html>;
}
