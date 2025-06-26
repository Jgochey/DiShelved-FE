'use client';

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import NewItemForm from '@/components/forms/NewItemForm';
import { getSingleItem } from '../../../../../../api/ItemData';

export default function EditItemPage({ params }) {
  const { itemId } = params; // <-- lowercase
  const [Item, setItem] = useState(null);

  useEffect(() => {
    if (itemId) {
      getSingleItem(itemId).then(setItem);
    }
  }, [itemId]);

  if (!Item) return <div>Loading...</div>;

  return <NewItemForm Item={Item} />;
}

EditItemPage.propTypes = {
  params: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    itemId: PropTypes.string.isRequired,
  }).isRequired,
};
