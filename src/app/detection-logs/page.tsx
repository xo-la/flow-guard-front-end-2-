"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface LogEntry {
  id: string;
  timestamp: string;
  cameraName: string;
  eventType: "Fire" | "Smoke" | "Human Detected" | "Vehicle" | "Motion";
  objectDetected: string;
  confidence: number;
}

const demoLogs: LogEntry[] = [
  {
    id: "DL-101",
    timestamp: "2026-08-28 08:14:22",
    cameraName: "Camera 01 - Facility Zone",
    eventType: "Human Detected",
    objectDetected: "Person",
    confidence: 0.96,
  },
  {
    id: "DL-102",
    timestamp: "2026-08-28 08:18:05",
    cameraName: "Camera 07 - West Gate",
    eventType: "Vehicle",
    objectDetected: "Truck",
    confidence: 0.91,
  },
  {
    id: "DL-103",
    timestamp: "2026-08-28 08:25:41",
    cameraName: "Camera 15 - Loading Dock",
    eventType: "Smoke",
    objectDetected: "Smoke plume",
    confidence: 0.89,
  },
];

export default function DetectionLogsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const cameraFilter = searchParams.get("camera");

  // State handles data directly from Python backend now
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    async function fetchBackendLogs() {
      try {
        setLoading(true);
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiBaseUrl) {
          setLogs(demoLogs);
          return;
        }

        const response = await fetch(`${apiBaseUrl}/api/logs?event_type=${selectedType}`);
        if (!response.ok) throw new Error("Network response error matrix failure");

        const data = await response.json();
        setLogs(Array.isArray(data) && data.length > 0 ? data : demoLogs);
      } catch (error) {
        console.error("Failed pulling core logs from API:", error);
        setLogs(demoLogs);
      } finally {
        setLoading(false);
      }
    }

    fetchBackendLogs();
  }, [selectedType]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (cameraFilter && log.cameraName !== cameraFilter) return false;

      const matchesSearch =
        log.cameraName.toLowerCase().includes(search.toLowerCase()) ||
        log.objectDetected.toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [search, logs, cameraFilter]);

  const getEventTypeStyle = (type: string) => {
    switch (type) {
      case "Fire":
      case "Smoke": return "text-[#FF0000] font-bold uppercase";
      case "Human Detected": return "text-emerald-400 font-medium";
      case "Vehicle": return "text-orange-400 font-medium";
      default: return "text-white";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold">Detection Logs</h2>
          {cameraFilter && (
            <span className="text-[#00A3FF] text-xs font-semibold">Active Filter: {cameraFilter}</span>
          )}
        </div>
        <button
          onClick={() => router.push('/detection-logs')}
          className="text-xs text-neutral-500 hover:text-white underline transition-colors"
        >
          Clear Filters
        </button>
      </div>

      {/* Interactive Controls Bar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#242424] p-4 rounded-lg border border-neutral-800">
        <input
          type="text"
          value={search}
          placeholder="Search logs by camera or asset..."
          className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm focus:border-[#00A3FF] outline-none text-white"
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-300 focus:border-[#00A3FF] outline-none"
        >
          <option value="All">All Event Types</option>
          <option value="Fire">Fire</option>
          <option value="Smoke">Smoke</option>
          <option value="Human Detected">Human Detected</option>
          <option value="Vehicle">Vehicle</option>
        </select>
        <div className="text-right flex items-center justify-end text-xs text-neutral-500">
          {loading ? "Syncing hardware network..." : `Showing ${filteredLogs.length} matching events`}
        </div>
      </div>

      {/* Real-time Filtered Data Table Container */}
      <div className="bg-[#242424] border border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-900/50 text-neutral-400 text-xs uppercase tracking-wider">
              <th className="p-4 border-b border-neutral-800">Timestamp</th>
              <th className="p-4 border-b border-neutral-800">Camera Name</th>
              <th className="p-4 border-b border-neutral-800">Event Type</th>
              <th className="p-4 border-b border-neutral-800">Object</th>
              <th className="p-4 border-b border-neutral-800">Confidence</th>
              <th className="p-4 border-b border-neutral-800 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-neutral-800/60">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#00A3FF] text-xs font-mono tracking-widest animate-pulse">
                  FETCHING LIVE TELEMETRY LOGS FROM PYTHON MATRIX CONTROLLER...
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-neutral-500 text-xs">
                  No tracking sequences match active filter query parameters.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <td className="p-4 text-neutral-400 font-mono text-xs">{log.timestamp}</td>
                  <td className="p-4 font-medium">{log.cameraName}</td>
                  <td className={`p-4 ${getEventTypeStyle(log.eventType)}`}>{log.eventType}</td>
                  <td className="p-4 text-neutral-300 font-mono text-xs">{log.objectDetected}</td>
                  <td className="p-4 font-mono">{(log.confidence * 100).toFixed(0)}%</td>
                  <td className="p-4 text-center">
                    <button className="text-[#00A3FF] hover:scale-125 transition-transform">▶</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}