import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hopeforce — Emergency Response Platform",
  description: "AI-first disaster management and real-time emergency response platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="bg-white text-gray-900 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
