import { Inter } from "next/font/google";

// Inter is a clean, highly readable sans-serif — a common default for technical
// blogs. Scoped to /blog/* so the rest of the site keeps its Roboto Mono look.
// Code blocks still use font-mono, so they stay monospaced.
const inter = Inter({ subsets: ["latin"] });

export default function BlogLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={inter.className}>{children}</div>;
}
