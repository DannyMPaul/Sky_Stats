"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("themeMode") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div className={`${inter.className} transition-colors duration-200`}>
      {children}
    </div>
  );
}
