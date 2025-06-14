'use client';

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
      <Card className="mb-3" style={{ background: '#305bab', color: '#ffffff' }}>
        <div className="header">{containerId.name}</div>
        <div className="header">{container ? container.name : 'Loading...'}</div>
        <div className="headerDescription">{container ? container.description : ''}</div>
      </Card>

      <div className="text-center d-flex flex-column justify-content-center align-content-center">
        <Link href={`/NewItem/${containerId}/new`} passHref>
          <Button variant="danger" type="button" size="lg" className="copy-btn" style={{ background: '#ffffff', borderColor: '#ffffff', color: '#1a1a1a' }}>
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
                <Card className="savedItemcard" key={Item.id} style={{ background: '#305bab' }}>
                  <h1 style={{ color: '#ffffff' }}>{Item.name}</h1>
                  <h4 style={{ color: '#ffffff' }}> {Item.description} </h4>
                  <h4 style={{ color: '#ffffff' }}> Quantity: {Item.quantity} </h4>
                  <h4 style={{ color: '#ffffff' }}> {Item.complete ? '✔️ This item is complete' : '❌ This item is missing pieces'} </h4>
                  <div className="d-flex justify-content-between">
                    {' '}
                    <img src={Item.image} alt={Item.name} style={{ width: '100px', height: '100px' }} />
                    {/*  What should happen is that the Item's Categories should be fetched using the newly created ItemCategory to find the corresponding category and display it in the UI. */}
                    <h4 style={{ color: '#ffffff' }}> Categories: </h4>
                    <div>
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
                    <div>
                      <ModalForCategory
                        categories={Categories}
                        selectedCategoryIds={itemCategoryIds}
                        onCategoryAdd={async (categoryId) => {
                          await createItemCategory(Item.id, categoryId);
                          setUserItemCategories(); // Refresh item-category associations
                        }}
                        onCategoryRemove={async (categoryId) => {
                          await deleteItemCategory(Item.id, categoryId); // <-- You need this API function
                          setUserItemCategories();
                        }}
                      />
                    </div>
                  </div>

                  <Link href={`/NewItem/${containerId}/edit/${user.uid}/${Item.id}`} passHref>
                    <Button variant="info" style={{ background: '#ffffff', borderColor: '#ffffff', color: '#1a1a1a', width: '100%' }}>
                      {' '}
                      Edit{' '}
                    </Button>
                  </Link>

                  <Button variant="danger" onClick={() => deleteSavedItem(Item)}>
                    {' '}
                    Delete{' '}
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
