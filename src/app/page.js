'use client';

// any component that uses useAuth needs this because if a component directly imports useAuth, it needs to be a client component since useAuth uses React hooks.

import { Button, Card } from 'react-bootstrap';
import { useAuth } from '@/utils/context/authContext';

function Home() {
  const { user } = useAuth();

  return (
    <div
      className="home-outer"
      style={{
        minHeight: '90vh',
        padding: '40px 0',
        width: '100%',
      }}
    >
      <h1 className="text-center" style={{ marginTop: '4rem' }}>
        Welcome to DiShelved!
      </h1>
      <div className="ds-header" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
        <p style={{ maxWidth: '900px', margin: '0 auto' }}>This app helps you manage and keep track of your collections. Whether it&apos;s Games, Furniture, or anything in between, DiShelved makes it easy to organize and find your belongings!</p>
      </div>

      <div className="ds-main-sections">
        <Card className="ds-card ds-how-to-use-card" style={{ backgroundColor: '#305bab', color: '#ffffff', border: '2px solid black' }}>
          <Card.Body>
            <h2>How to Use DiShelved</h2>
            <p>To begin, you will need to create a Saved Location. A Saved Location is a place where you can keep your collections organized. For example, you might have a Saved Location for your Attic, Bedroom, or Garage.</p>
            <p>Once a new Location has been made you can add storage Containers to it, such as Boxes or Shelves. You can add a description or a picture to each Container to help identify it.</p>
            <p>After you have created a Saved Location and added Containers, you can start adding Items to your Containers. Items can have a name, description, quantity, and an image. You can also indicate whether or not the Item is missing any pieces.</p>
            <p>You can assign categories to each Item to help keep them organized by clicking the Manage Categories button above. Once you have made a Category, you can easily assign it to any Item by visiting the Item Details page.</p>
          </Card.Body>
        </Card>

        <Card className="ds-card ds-get-started-card" style={{ backgroundColor: '#305bab', color: '#ffffff', border: '2px solid black' }}>
          <Card.Body className="d-flex flex-column align-items-end">
            <h2>Get Started!</h2>
            <p>To begin, click the button below to go to the Saved Locations page and start organizing your collections!</p>
            <Button
              className="my-4"
              variant="success"
              style={{ color: '#ffffff', border: '2px solid black', right: '45px', position: 'relative', scale: '1.2' }}
              onClick={() => {
                window.location.href = `/Locations/${user.uid}`;
              }}
            >
              Saved Locations
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default Home;
