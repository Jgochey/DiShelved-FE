import firebase from 'firebase/app';
import 'firebase/auth';
import { createUser } from '../api/UserData';

const signIn = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  const result = await firebase.auth().signInWithPopup(provider);
  const { user } = result;
  if (user) {
    const token = await user.getIdToken();
    // Automatically register user in your backend
    await createUser({ uid: user.uid }, token);
    console.log('User signed in:', user);
    console.log('Result:', result);
  }
};

const signOut = () => {
  firebase.auth().signOut();
};

export { signIn, signOut };
