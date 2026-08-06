"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Camera {
  id: string;
  name: string;
  status: "Online" | "Offline";
}

export default function CameraManagementPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"All" | "Online" | "Offline">("All");
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [streamTimestamp, setStreamTimestamp] = useState<number>(Date.now());

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        setIsLoading(true);

        // Simulating the layout blueprint specs (16 cameras: 14 online, 2 offline)
        const mockGeneratedGrid: Camera[] = Array.from({ length: 16 }, (_, i) => {
          const idNum = i + 1;
          const isOffline = idNum === 3 || idNum === 15;
          return {
            id: idNum < 10 ? `0${idNum}` : `${idNum}`,
            name: idNum === 15 ? "Camera 15 - Loading Dock" : `Camera ${idNum < 10 ? '0' + idNum : idNum} - Facility Zone`,
            status: isOffline ? "Offline" : "Online",
          };
        });

        setCameras(mockGeneratedGrid);
      } catch (error) {
        console.error("Failed capturing hardware feed details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCameras();

    // Force periodic cache breaking string generation every 10 seconds for video sources
    const interval = setInterval(() => setStreamTimestamp(Date.now()), 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredCameras = cameras.filter(
    (cam) => filter === "All" || cam.status === filter
  );

  return (
    <div className="space-y-8 animate-fadeIn text-white">
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Camera Management</h2>
          <p className="text-sm text-neutral-400 mt-1">
            Monitor live hardware streams and track multi-threaded AI processing bounds.
          </p>
        </div>

        {/* Central Context Action Panel Buttons */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-[#00A3FF] hover:bg-blue-600 text-black font-semibold text-sm rounded transition-colors shadow-lg shadow-[#00A3FF]/10">
            + Add Camera
          </button>
          <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-sm rounded border border-neutral-700 transition-colors">
            Bulk Edit
          </button>
        </div>
      </div>

      {/* Filter Control Ribbon Toolbelt */}
      <div className="flex items-center gap-4 bg-neutral-900/40 p-4 rounded-lg border border-neutral-800/60">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Filter by Status:
        </label>
        <div className="inline-flex rounded-md p-1 bg-neutral-900 border border-neutral-800">
          {(["All", "Online", "Offline"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${filter === type
                ? "bg-[#00A3FF] text-black font-semibold shadow"
                : "text-neutral-400 hover:text-white"
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Canvas Panel Container */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-neutral-500 text-sm font-mono tracking-wider animate-pulse">
          Loading surveillance feed map configurations...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredCameras.map((camera) => {
            const isSpecialTarget = camera.id === "15";

            return (
              <div
                key={camera.id}
                onClick={() => {
                  if (isSpecialTarget) {
                    router.push(`/detection-logs?camera=${encodeURIComponent(camera.name)}`);
                  }
                }}
                className={`bg-[#242424] border rounded-xl p-4 flex flex-col justify-between h-52 cursor-pointer transition-all hover:scale-[1.02] relative group ${isSpecialTarget
                  ? "border-[#00A3FF] ring-2 ring-[#00A3FF]/30 shadow-lg shadow-[#00A3FF]/5"
                  : "border-neutral-800 hover:border-neutral-700"
                  }`}
              >
                {/* UPGRADED: LIVE INTERACTIVE STREAM VIDEO THUMBNAIL CANVAS */}
                <div className="w-full h-32 bg-black rounded-md flex items-center justify-center border border-neutral-800 overflow-hidden relative">
                  {camera.status === "Online" ? (
                    <img
                      src={`http://localhost:8000/api/camera/stream?node=${camera.id}&t=${streamTimestamp}`}
                      alt={`${camera.name} Live Stream`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        // Safe fallback layout if FastAPI crashes or resets network buffers
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextSibling) {
                          (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}

                  {/* Fallback layout interface overlay shown on offline items or failed handshakes */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 text-neutral-600 space-y-1"
                    style={{ display: camera.status === "Offline" ? "flex" : "none" }}
                  >
                    <span className="text-xl">⚠️</span>
                    <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-500">
                      {camera.status === "Offline" ? "NODE OFFLINE" : "BUFFERING ERROR"}
                    </span>
                  </div>
                </div>

                {/* Info and Status Layout Footer Meta Text */}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-medium text-neutral-200 truncate pr-2">
                    {camera.name}
                  </span>

                  {/* Strict Operational Status Dot Asset Render Rules */}
                  {camera.status === "Online" ? (
                    <div className="flex items-center gap-1.5 shrink-0 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] uppercase font-bold text-emerald-400">Online</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 shrink-0 bg-red-950/40 px-2 py-0.5 rounded-full border border-red-500/20">
                      <span className="text-[10px] font-bold text-red-500">✕</span>
                      <span className="text-[10px] uppercase font-bold text-red-500">Offline</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}