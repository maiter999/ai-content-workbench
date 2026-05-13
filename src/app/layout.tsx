import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "豹纹工坊 - AI自媒体群系统",
  description: "一个主题，多个平台同时出稿 - AI智能生成小红书、公众号、抖音等内容",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
