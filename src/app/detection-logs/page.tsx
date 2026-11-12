"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import React, { Suspense } from "react";

import DetectionLogsClient from "./DetectionLogsClient";

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
  return (
    <Suspense fallback={<div className="min-h-[200px]" />}>
      <DetectionLogsClient />
    </Suspense>
  );
}
