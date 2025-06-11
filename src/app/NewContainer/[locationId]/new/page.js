'use client';

import React from 'react';
import NewContainerForm from '@/components/forms/NewContainerForm';
import { useParams } from 'next/navigation';

export default function NewContainerPage() {
  const { locationId } = useParams();

  return (
    <div>
      <h1>Add New Container</h1>
      <NewContainerForm locationId={locationId} />
    </div>
  );
}
