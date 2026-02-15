import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Worst Newsletter Ever",
  description: "Sign up to read absolutely nothing. You're welcome.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
