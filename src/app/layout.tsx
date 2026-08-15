"use client"; // Required to check the active web address link dynamically

import { usePathname } from "next/navigation"; // Hook to see what page we are on
import "./globals.css";
import Sidebar from "../components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Isolate login screen: If the user is on /login, hide the layout shell completely
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return (
      <html lang="en">
        <body className="bg-[#181818] text-white font-sans antialiased">
          {children}
        </body>
      </html>
    );
  }

  // Otherwise, render the complete dashboard layout system normally
  return (
    <html lang="en">
      <body className="bg-[#181818] text-white flex min-h-screen font-sans antialiased">
        {/* Permanent Navigation Sidebar */}
        <Sidebar />

        {/* Main Fluid Content Canvas View */}
        <main className="flex-1 min-h-screen overflow-y-auto p-8 lg:p-12">
          {children}
        </main>
      </body>
    </html>
  );
}