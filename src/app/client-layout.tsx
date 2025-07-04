"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const savedTheme = localStorage.getItem("themeMode") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className={`${inter.className} transition-colors duration-200`}>
        {children}
      </div>
    </ErrorBoundary>
  );
}
