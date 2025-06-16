'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/utils/context/authContext';
import { Button, Card } from 'react-bootstrap';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { deleteItem, getItemsByContainerId } from '@/api/ItemData';
import ModalForCategory from '@/components/CategoryModal';
import { createItemCategory, getItemCategoriesByItemId, deleteItemCategory } from '@/api/ItemCategoryData'; // You need to implement this
import { getCatergoriesByUserUid } from '../../../../api/CategoryData';
import { getContainerById } from '../../../../api/ContainerData';

function ItemsPage() {
  const { user } = useAuth();
  const params = useParams(); // <-- Get params from the URL
  const router = useRouter(); // <-- For navigation
  const { containerId } = params; // <-- Destructure params
  const [Items, setItems] = useState([]);
  const [Categories, setCategories] = useState([]);
  const [ItemCategories, setItemCategories] = useState([]);
  const [container, setContainer] = useState({});

  const setUserItems = () => {
    if (user && user.uid && containerId) {
      getItemsByContainerId(containerId).then((data) => {
        if (!data || Object.keys(data).length === 0) {
          router.replace(`/NewItem/${containerId}/new`);
          return;
        }
        // Always set as array
        setItems(Array.isArray(data) ? data : Object.values(data));
      });
    }
  };

  const setUserCategories = () => {
    if (user && user.uid && containerId) {
      getCatergoriesByUserUid(user.uid).then((data) => {
        if (!data || Object.keys(data).length === 0) {
          console.warn('No categories found for this user. Please add categories first.');
          return;
        }
        // Always set as array
        setCategories(Array.isArray(data) ? data : Object.values(data));
      });
    }
  };

  const setUserItemCategories = async () => {
    if (!Items.length) return;
    const allItemCategoriesArrays = await Promise.all(Items.map((item) => getItemCategoriesByItemId(item.id)));
    const allItemCategories = allItemCategoriesArrays.flat().filter(Boolean);
    setItemCategories(allItemCategories);
  };

  useEffect(() => {
    setUserItems();
    setUserCategories();
  }, [user, containerId]);

  useEffect(() => {
    setUserItemCategories();
  }, [Items]);

  useEffect(() => {
    if (containerId) {
      getContainerById(containerId).then(setContainer);
    }
  }, [containerId]);

  const deleteSavedItem = async (Item) => {
    if (window.confirm(`Delete ${Item.name}?`)) {
      // Find all ItemCategory relationships for this item
      const relatedItemCategories = ItemCategories.filter((ic) => ic.itemId === Item.id);

      // Delete all related ItemCategory entries
      await Promise.all(relatedItemCategories.map((ic) => deleteItemCategory(Item.id, ic.categoryId)));
      await deleteItem(Item.id);

      setUserItems();
      setUserItemCategories();
    }
  };

  return (
    <>
      <Card
        className="text-center justify-content-center align-items-center"
        style={{
          background: '#305bab',
          marginBottom: '1rem',
          maxWidth: '45%',
          border: '2px solid black',
          margin: '0 auto',
          marginTop: '1rem',
        }}
      >
        <h1 className="text-center" style={{ color: '#ffffff', marginTop: '1rem' }}>
          {container ? container.name : 'Loading container...'}
        </h1>
        <h4 className="text-center" style={{ color: '#ffffff', marginBottom: '1rem' }}>
          {container ? container.description : 'Loading description...'}
        </h4>
        {container && container.image && (
          <img
            src={container.image}
            alt={container.name}
            style={{
              maxWidth: '90%',
              maxHeight: '200px',
              width: 'auto',
              height: 'auto',
              display: 'block',
              margin: '0.5rem auto',
              objectFit: 'contain',
            }}
          />
        )}
      </Card>

      <div className="text-center d-flex flex-column justify-content-center align-content-center">
        <Link href={`/NewItem/${containerId}/new`} passHref>
          <Button variant="danger" type="button" size="lg" className="copy-btn" style={{ background: '#ffffff', borderColor: '#ffffff', color: '#1a1a1a', marginTop: '1rem' }}>
            Add New Item
          </Button>
        </Link>

        {/* This should only be displayed if the user has saved Items. If not, only show the "Add New Item" button. */}
        {Items.length > 0 && (
          <div className="savedItemsItem">
            {Object.values(Items).map((Item) => {
              const itemCategoryIds = ItemCategories.filter((ic) => ic.itemId === Item.id).map((ic) => ic.categoryId);

              const itemCategories = Categories.filter((cat) => itemCategoryIds.includes(cat.id));

              return (
                <Card className="savedItemcard" key={Item.id} style={{ background: '#305bab', margin: '1rem', padding: '1rem', color: '#ffffff', width: '75%' }}>
                  <h1 style={{ color: '#ffffff' }}>{Item.name}</h1>
                  <h4 style={{ color: '#ffffff' }}> {Item.description} </h4>
                  <img
                    src={Item.image}
                    alt={Item.name}
                    style={{
                      maxWidth: '90%',
                      maxHeight: '175px',
                      width: 'auto',
                      height: 'auto',
                      display: 'block',
                      margin: '0.5rem auto',
                      objectFit: 'contain',
                    }}
                  />
                  <h4 style={{ color: '#ffffff' }}> Quantity: {Item.quantity} </h4>
                  <h4 style={{ color: '#ffffff' }}> {Item.complete ? '✔️ This item is complete' : '❌ This item is missing pieces'} </h4>
                  <div style={{ textAlign: 'center', color: '#ffffff', marginBottom: '0.5rem' }}>
                    <h4 style={{ color: '#ffffff', marginBottom: '0.25rem' }}>Categories:</h4>
                    {itemCategories.length > 0 ? (
                      itemCategories.map((category) => (
                        <span key={category.id} style={{ color: '#ffffff', marginRight: '10px' }}>
                          {category.name}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: '#ffffff' }}>No categories assigned</span>
                    )}
                  </div>

                  <div style={{ width: '100%', marginBottom: '0.5rem' }}>
                    <ModalForCategory
                      categories={Categories}
                      selectedCategoryIds={itemCategoryIds}
                      onCategoryAdd={async (categoryId) => {
                        await createItemCategory(Item.id, categoryId);
                        setUserItemCategories();
                      }}
                      onCategoryRemove={async (categoryId) => {
                        await deleteItemCategory(Item.id, categoryId);
                        setUserItemCategories();
                      }}
                    />
                  </div>

                  <Link href={`/NewItem/${containerId}/edit/${user.uid}/${Item.id}`} passHref>
                    <Button variant="info" style={{ background: '#ffffff', borderColor: '#ffffff', color: '#1a1a1a', width: '100%', marginBottom: '0.5rem' }}>
                      {' '}
                      Edit Item Information{' '}
                    </Button>
                  </Link>

                  <Button variant="danger" onClick={() => deleteSavedItem(Item)}>
                    {' '}
                    Delete Item{' '}
                  </Button>

                  {/* Note the link here for later */}
                  {/* <Link href={`/Categories/${user.uid}/${Item.id}`} passHref>
                        <Button variant='primary'>
                          {' '}
                          View/Add Categories{' '}
                        </Button>
                      </Link> */}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default ItemsPage;
