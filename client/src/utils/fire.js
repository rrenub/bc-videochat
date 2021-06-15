import firebase from 'firebase';
import { firebaseConfig } from './api-config'

try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack);
  }
}

export const fire = firebase;

export const createToken = async () => {
  const user = fire.auth().currentUser;
  const token = user && (await user.getIdToken());

  const payloadHeader = {
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      }
  };
  return payloadHeader;
}
