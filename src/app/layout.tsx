import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import FloatingAssistant from "@/components/assistant/FloatingAssistant";

export const metadata: Metadata = {
  title: "NexStep AI | Autonomous Adaptive Learning Platform",
  description: "AI-Powered Personalized Learning Platform for Engineering Students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('nexstep_theme');
                  if (!theme) {
                    theme = 'dark';
                  }
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="h-full min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          {children}
          <Suspense fallback={null}>
            <FloatingAssistant />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
