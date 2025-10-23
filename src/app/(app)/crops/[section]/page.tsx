import React from 'react';
import CropsManager from '../CropsManager';

export default function SectionPage({ params } : { params: { section: string } }) {
  const { section } = params;
  return <CropsManager initialSection={section} />;
}
