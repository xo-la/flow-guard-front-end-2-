"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Simplified modern SVG icon paths matched to system labels
const menuItems = [
  { label: "Camera Management", href: "/camera-management", icon: "📹" },
  { label: "Detection Logs", href: "/detection-logs", icon: "📋" },
  { label: "Incident Reports", href: "/incident-reports", icon: "🚨" },
  { label: "User Permissions", href: "/user-permissions", icon: "🔒" },
  { label: "System Settings", href: "/system-settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#111111] border-r border-neutral-800 flex flex-col justify-between h-screen sticky top-0 shrink-0">
      <div className="flex flex-col">
        {/* System Title Branding Header */}
        <div className="p-6 border-b border-neutral-800">
          <h1 className="text-sm font-bold tracking-widest text-neutral-400 uppercase">
            AI Core Command
          </h1>
        </div>

        {/* Navigation Link Stack */}
        <nav className="mt-6 flex flex-col gap-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all group ${isActive
                    ? "text-brandBlue bg-brandBlue/5"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                  }`}
              >
                {/* Electric Blue Bar Active Screen Marker Indicator */}
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-brandBlue rounded-r" />
                )}

                <span className={`text-lg transition-transform ${isActive ? "scale-110" : "opacity-70 group-hover:opacity-100"}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-neutral-800 text-xs text-neutral-600 text-center">
        v2.4.0-PROD
      </div>
    </aside>
  );
}