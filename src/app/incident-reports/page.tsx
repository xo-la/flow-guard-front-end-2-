export const dynamic = "force-dynamic"; //
"use client";

import { useSearchParams } from "next/navigation";

export default function IncidentReportsPage() {
  const searchParams = useSearchParams();
  const incidentId = searchParams.get("incidentId");

  return (
    <div className="h-full flex flex-col space-y-6 animate-fadeIn">
      {/* Title & Top Actions[cite: 1] */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Incident Reports</h2>
        <div className="flex gap-3">
          <button className="px-6 py-2 bg-brandRed hover:bg-red-700 text-white font-bold rounded text-sm transition-colors">
            Export Video Clips
          </button>
          <button className="px-6 py-2 bg-brandBlue hover:bg-blue-600 text-black font-bold rounded text-sm transition-colors">
            Generate PDF
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-[600px]">
        {/* Left Panel: Recent Incidents[cite: 1] */}
        <div className="w-80 bg-panelGray border border-neutral-800 rounded-lg flex flex-col">
          <div className="p-4 border-b border-neutral-800 font-bold text-xs uppercase text-neutral-500">
            Recent Incidents
          </div>
          <div className="p-2 space-y-2 overflow-y-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`p-3 rounded border transition-colors cursor-pointer ${i === 1 && incidentId ? 'border-brandBlue bg-brandBlue/5' : 'border-neutral-800 hover:bg-neutral-800'}`}>
                <div className="text-[10px] text-neutral-500 mb-1">May 29, 2026</div>
                <div className="text-sm font-bold">Structural Fire Alert #00{i}</div>
                <div className="mt-2 inline-block px-2 py-0.5 rounded-full bg-brandRed/20 text-brandRed text-[10px] font-bold">CRITICAL</div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Area: Report Generator[cite: 1] */}
        <div className="flex-1 bg-panelGray border border-neutral-800 rounded-lg p-8 overflow-y-auto">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-brandBlue rounded-full" />
            Event Timeline Analysis
          </h3>

          {/* Vertical Timeline visualized with Electric Blue[cite: 1] */}
          <div className="relative border-l-2 border-brandBlue/30 ml-4 mb-10 space-y-8">
            {[
              { time: "08:30:00", event: "Initial Heat Signature Detected", desc: "Sensor 15A triggered threshold" },
              { time: "08:30:12", event: "Visual Smoke Confirmation", desc: "AI Confidence 94% on Camera 15" },
              { time: "08:31:05", event: "Automated Alarm Triggered", desc: "Global notification sent to security" },
            ].map((step, idx) => (
              <div key={idx} className="relative pl-8">
                <div className="absolute -left-[9px] top-1 w-4 h-4 bg-brandBlue rounded-full border-4 border-charcoal shadow-[0_0_10px_#00A3FF]" />
                <div className="text-xs text-brandBlue font-mono">{step.time}</div>
                <div className="text-sm font-bold text-white">{step.event}</div>
                <div className="text-xs text-neutral-400">{step.desc}</div>
              </div>
            ))}
          </div>

          {/* AI Integration Inputs[cite: 1] */}
          <div className="space-y-6 mt-10 border-t border-neutral-800 pt-8">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Incident Description</label>
              <textarea
                className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-3 text-sm text-neutral-300 focus:border-brandBlue outline-none min-h-[80px]"
                defaultValue="Unidentified smoke plume detected in north-west loading dock quadrant..."
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Root Cause Analysis</label>
                <input className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-3 text-sm text-neutral-300 focus:border-brandBlue outline-none" placeholder="Enter findings..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Remediation Actions</label>
                <input className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-3 text-sm text-neutral-300 focus:border-brandBlue outline-none" placeholder="Enter steps taken..." />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}