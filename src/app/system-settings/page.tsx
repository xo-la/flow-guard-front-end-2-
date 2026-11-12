"use client";

// FORCE DYNAMIC RENDERING TO PREVENT BUILD ERRORS
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";

export default function SystemSettingsPage() {
  // Section 1 State: AI Thresholds Calibration parameters
  const [confidence, setConfidence] = useState<number>(85);
  const [sensitivity, setSensitivity] = useState<number>(70);

  // Section 2 State: Live Dynamic IP Camera Provision Configuration
  const [cameraName, setCameraName] = useState("Main Security Node 01");
  const [rtspUrl, setRtspUrl] = useState("");
  const [syncStatus, setSyncStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateCameraNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rtspUrl) {
      setSyncStatus("❌ Error: RTSP stream destination link cannot be blank.");
      return;
    }

    setLoading(true);
    setSyncStatus("");

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiBaseUrl) {
      setSyncStatus("✅ Demo mode active: set NEXT_PUBLIC_API_URL in Vercel to connect to your real backend.");
      setLoading(false);
      return;
    }

    try {
      // CORRECTION: Updated endpoint path to /api/cameras/add and payload key to 'name' to match backend
      const response = await fetch(`${apiBaseUrl}/api/cameras/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cameraName,
          rtsp_url: rtspUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSyncStatus(`✅ Node Connected: Pipeline successfully registered for ${data.camera?.name || cameraName}.`);
      } else {
        setSyncStatus(`❌ Network Sync Refused: ${data.detail || "Unknown hardware rejection."}`);
      }
    } catch (error) {
      setSyncStatus("❌ Server Gateway Interface Error: Cannot connect to the configured backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl animate-fadeIn text-white">
      <div>
        <h2 className="text-2xl font-bold">System Settings</h2>
        <p className="text-sm text-neutral-400 mt-1">Calibrate computer vision layers and update active camera streaming links.</p>
      </div>

      {/* SECTION 1: AI Thresholds Engine Calibration Grid */}
      <section className="bg-[#242424] border border-neutral-800 rounded-xl p-6 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-800 pb-3 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#00A3FF] rounded" />
          Section 1: AI Analytics Calibration Matrix
        </h3>

        <div className="space-y-8">
          {/* Slider Row 1: Object Detection */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4">
              <label className="block text-sm font-bold text-neutral-200">Object Detection Confidence</label>
              <span className="text-xs text-neutral-500">Minimum visual confidence required to fire an event.</span>
            </div>
            <div className="md:col-span-5 flex items-center gap-4">
              <input
                type="range" min="0" max="100" value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full accent-[#00A3FF] bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <span className="w-12 text-right font-mono font-bold text-sm text-[#00A3FF]">{confidence}%</span>
            </div>
            <div className="md:col-span-3 bg-neutral-900 p-2.5 rounded border border-neutral-800 flex items-center justify-between gap-1.5 h-12">
              <span className="text-[10px] uppercase font-bold text-neutral-600">Precision:</span>
              <div className="flex items-end gap-0.5 h-full flex-1 justify-end px-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className={`w-1 rounded-t-sm transition-all ${i < Math.round(confidence / 14) ? 'bg-[#00A3FF]' : 'bg-neutral-800'}`} style={{ height: `${(i + 1) * 4 + 4}px` }} />
                ))}
              </div>
            </div>
          </div>

          {/* Slider Row 2: Smoke Sensitivity */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4">
              <label className="block text-sm font-bold text-neutral-200">Smoke Sensitivity</label>
              <span className="text-xs text-neutral-500">Fine-tune volumetric changes and plume visibility triggers.</span>
            </div>
            <div className="md:col-span-5 flex items-center gap-4">
              <input
                type="range" min="0" max="100" value={sensitivity}
                onChange={(e) => setSensitivity(Number(e.target.value))}
                className="w-full accent-[#00A3FF] bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <span className="w-12 text-right font-mono font-bold text-sm text-[#00A3FF]">{sensitivity}%</span>
            </div>
            <div className="md:col-span-3 bg-neutral-900 p-2.5 rounded border border-neutral-800 flex items-center justify-between gap-1.5 h-12">
              <span className="text-[10px] uppercase font-bold text-neutral-600">Recall:</span>
              <div className="flex items-end gap-0.5 h-full flex-1 justify-end px-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className={`w-1 rounded-t-sm transition-all ${i < Math.round(sensitivity / 14) ? 'bg-[#00A3FF]' : 'bg-neutral-800'}`} style={{ height: `${(i + 1) * 4 + 8}px` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTIONS 2 & 3: Dynamic IP Camera Input Form & API Integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Section 2: LIVE Dynamic CAMERA Config Forms */}
        <section className="bg-[#242424] border border-neutral-800 rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-800 pb-3">
              Section 2: Active IP Camera Connection Matrix
            </h3>

            <form onSubmit={handleUpdateCameraNode} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Camera Identifier Label
                </label>
                <input
                  type="text"
                  value={cameraName}
                  onChange={(e) => setCameraName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:border-[#00A3FF] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  RTSP URL / Camera IP Input Box
                </label>
                <input
                  type="text"
                  required
                  value={rtspUrl}
                  onChange={(e) => setRtspUrl(e.target.value)}
                  placeholder="rtsp://admin:pass@192.168.1.50:554/stream1 (or '0' for test webcam)"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-white font-mono placeholder-neutral-600 focus:border-[#00A3FF] outline-none transition-colors"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  💡 Enter <code className="text-neutral-300 font-mono bg-black/40 px-1 py-0.5 rounded">0</code> here to capture your computer's built-in local webcam.
                </span>
              </div>

              {syncStatus && (
                <div className={`p-2.5 text-xs rounded border font-mono ${syncStatus.startsWith("✅") ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-400" : "bg-red-950/20 border-red-800/40 text-[#FF0000]"
                  }`}>
                  {syncStatus}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-[#00A3FF] hover:bg-blue-600 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-bold rounded text-xs tracking-wide uppercase transition-colors"
              >
                {loading ? "Re-Routing Network Stream Pipeline..." : "Sync Camera Interface"}
              </button>
            </form>
          </div>
        </section>

        {/* Section 3: Third Party Gateway Integrations */}
        <section className="bg-[#242424] border border-neutral-800 rounded-xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-800 pb-3">
            Section 3: AWS Cloud & API Integration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Kinesis Stream Target Endpoint</label>
              <input type="text" defaultValue="https://kinesis.us-east-1.amazonaws.com" readOnly className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-500 font-mono outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Infrastructure Bearer Token</label>
              <input type="password" value="••••••••••••••••••••••••••••••••" readOnly className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-[#00A3FF] font-mono outline-none" />
            </div>
          </div>
        </section>
      </div>

      {/* Save Button Row for sliders */}
      <div className="flex justify-end pt-4 border-t border-neutral-800/60">
        <button className="px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-md text-sm transition-colors">
          Commit System Rules
        </button>
      </div>
    </div>
  );
}
