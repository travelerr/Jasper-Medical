"use client";
import "@/app/_ui/tailwind.css";
import "@/app/_ui/global.css";
import { inter } from "@/app/_ui/fonts";
import Header from "./marketing/Header";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaHeart, FaCode } from "react-icons/fa6";

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
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t justify-between">
        <p className="text-xs text-muted-foreground w-1/3">
          &copy; 2024 Jasper Medical. All rights reserved.
        </p>
        <div className="text-xs text-muted-foreground w-1/3 text-center">
          <p className="flex items-center justify-center">
            <span className="me-1">Made with </span>
            <span className="me-1">
              <FaHeart />
            </span>
            <span className="me-1">and</span>
            <span className="me-1">
              <FaCode />
            </span>
            <span className="me-1">in Portland, Maine</span>
          </p>
        </div>
        <nav className="w-1/3 text-right">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </html>
  );
}
