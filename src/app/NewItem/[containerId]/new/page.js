'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import NewItemForm from '@/components/forms/NewItemForm';

export default function NewItemPage() {
  const { containerId } = useParams();

  return (
    <div>
      <h1>Add New Item</h1>
      <NewItemForm containerId={containerId} />
    </div>
  );
}
