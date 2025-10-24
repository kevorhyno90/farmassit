import React from 'react';
import CropsManager from '../CropsManager';

export default async function SectionPage({ params }: any) {
  // Next may provide params as a Promise-like; await it before reading properties
  const resolvedParams = await params;
  const raw = resolvedParams?.section;
  const section = Array.isArray(raw) ? raw[0] : raw || "";
  return <CropsManager initialSection={section} />;
}
