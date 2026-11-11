"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../config/api";

interface Camera {
  id: string;
  name: string;
  rtsp_url?: string;
  status: "Online" | "Offline";
}

export default function CameraManagementPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"All" | "Online" | "Offline">("All");
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal State Controls
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newCameraName, setNewCameraName] = useState<string>("");
  const [newRtspUrl, setNewRtspUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 1. Fetch real cameras from your Render FastAPI backend on mount
  const fetchCameras = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cameras`);
      if (!response.ok) throw new Error("Failed to fetch cameras from backend");
      
      const data = await response.json();
      const formattedCameras: Camera[] = data.map((cam: any) => ({
        id: cam.id,
        name: cam.name,
        rtsp_url: cam.rtsp_url,
        status: cam.status || "Online",
      }));

      setCameras(formattedCameras);
    } catch (error) {
      console.error("Failed capturing hardware feed details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  // 2. Handle POST request to add a new camera
  const handleAddCameraSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCameraName || !newRtspUrl) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/api/cameras/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCameraName,
          rtsp_url: newRtspUrl,
        }),
      });

      const data = await response.json();
      if (response.ok && data.status === "SUCCESS") {
        // Append new camera to state grid immediately
        setCameras((prev) => [
          ...prev,
          {
            id: data.camera.id,
            name: data.camera.name,
            rtsp_url: data.camera.rtsp_url,
            status: data.camera.status || "Online",
          },
        ]);
        // Reset form & close modal
        setNewCameraName("");
        setNewRtspUrl("");
        setIsModalOpen(false);
      } else {
        alert("Failed to add camera. Check console for details.");
      }
    } catch (error) {
      console.error("Error posting new camera:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCameras = cameras.filter(
    (cam) => filter === "All" || cam.status === filter
  );

  return (
    <div className="space-y-8 animate-fadeIn text-white relative">
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
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#00A3FF] hover:bg-blue-600 text-black font-semibold text-sm rounded transition-colors shadow-lg shadow-[#00A3FF]/10 cursor-pointer"
          >
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
              className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                filter === type
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
          Loading surveillance feed map configurations from Render backend...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredCameras.map((camera) => {
            const isSpecialTarget = camera.id === "01" || camera.id === "15";

            return (
              <div
                key={camera.id}
                onClick={() => {
                  if (isSpecialTarget) {
                    router.push(`/detection-logs?camera=${encodeURIComponent(camera.name)}`);
                  }
                }}
                className={`bg-[#242424] border rounded-xl p-4 flex flex-col justify-between h-52 cursor-pointer transition-all hover:scale-[1.02] relative group ${
                  isSpecialTarget
                    ? "border-[#00A3FF] ring-2 ring-[#00A3FF]/30 shadow-lg shadow-[#00A3FF]/5"
                    : "border-neutral-800 hover:border-neutral-700"
                }`}
              >
                {/* LIVE MJPEG STREAM VIDEO THUMBNAIL CANVAS */}
                <div className="w-full h-32 bg-black rounded-md flex items-center justify-center border border-neutral-800 overflow-hidden relative">
                  {camera.status === "Online" ? (
                    <img
                      src={`${API_BASE_URL}/api/camera/stream/${camera.id}`}
                      alt={`${camera.name} Live Stream`}
                      className="w-full h-full object-cover"
                    />
                  ) : null}

                  {/* Fallback layout interface overlay shown on offline items */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 text-neutral-600 space-y-1"
                    style={{ display: camera.status === "Offline" ? "flex" : "none" }}
                  >
                    <span className="text-xl">⚠️</span>
                    <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-500">
                      NODE OFFLINE
                    </span>
                  </div>
                </div>

                {/* Info and Status Layout Footer Meta Text */}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-medium text-neutral-200 truncate pr-2">
                    {camera.name}
                  </span>

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

      {/* --- ADD CAMERA MODAL POPUP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
              <h3 className="text-lg font-bold text-white">Add New Camera Stream</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddCameraSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Camera Name / Designation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Camera 04 - Perimeter North"
                  value={newCameraName}
                  onChange={(e) => setNewCameraName(e.target.value)}
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-[#00A3FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  RTSP URL or Local Index
                </label>
                <input
                  type="text"
                  placeholder="rtsp://admin:pass@ip:554/stream or 0"
                  value={newRtspUrl}
                  onChange={(e) => setNewRtspUrl(e.target.value)}
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-[#00A3FF]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#00A3FF] hover:bg-blue-600 text-black text-sm font-semibold rounded transition-colors shadow disabled:opacity-50"
                >
                  {isSubmitting ? "Adding Node..." : "Save Camera"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
