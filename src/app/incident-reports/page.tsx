"use client";

// FORCE DYNAMIC RENDERING TO PREVENT BUILD ERRORS
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
// ... rest of your component code

import React, { Suspense } from "react";
import IncidentReportsClient from "./IncidentReportsClient";
export default function IncidentReportsPage() {
  return (
    <Suspense fallback={<div className="h-full" /> }>
      <IncidentReportsClient />
    </Suspense>
  );
}
