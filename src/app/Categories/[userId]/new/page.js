'use client';

import React from 'react';
import NewCategoryForm from '@/components/forms/NewCategoryForm';
import { useAuth } from '../../../../utils/context/authContext';

export default function NewCategoryPage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Add New Category</h1>
      <NewCategoryForm userUid={user.uid} />
    </div>
  );
}
