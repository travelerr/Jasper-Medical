"use client";
import "@/app/_ui/tailwind.css";
import "@/app/_ui/global.css";
import { inter } from "@/app/_ui/fonts";
import Header from "./marketing/Header";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDoctorRoute = pathname.startsWith("/doctor");
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {!isDoctorRoute && <Header />}
        {children}
      </body>
    </html>
  );
}
