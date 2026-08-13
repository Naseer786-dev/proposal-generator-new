import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PropGen - Professional Proposals, Instant Payments",
  description: "Create stunning project proposals and collect deposits instantly via PayPal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}