import React, { Suspense } from "react";
export const dynamic = "force-dynamic";

import IncidentReportsClient from "./IncidentReportsClient";

export default function IncidentReportsPage() {
  return (
    <Suspense fallback={<div className="h-full" /> }>
      <IncidentReportsClient />
    </Suspense>
  );
}