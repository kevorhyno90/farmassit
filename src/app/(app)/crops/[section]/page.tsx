import React from 'react';
import CropsManager from '../CropsManager';

// Next.js requires awaiting params in dynamic routes to ensure the runtime
// handles the params correctly. Make the route component async and await params.
export default async function SectionPage({ params } : { params: { section: string } }) {
  const { section } = await params;
  return <CropsManager initialSection={section} />;
}
