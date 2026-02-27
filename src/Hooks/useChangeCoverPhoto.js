import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../Components/firebase'; // adjust path if needed

const useChangeCoverPhoto = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const changeCoverPhoto = async (userId, photoURL) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!userId || !photoURL) {
      setError('Missing userId or photoURL');
      setLoading(false);
      return;
    }

    try {
      const userRef = doc(db, 'Users', userId);
      await updateDoc(userRef, { profilecover: photoURL });
      setSuccess(true);
    } catch (err) {
      console.error('Error updating cover photo:', err);
      setError(err.message || 'Failed to update cover photo');
    } finally {
      setLoading(false);
    }
  };

  return { changeCoverPhoto, loading, error, success };
};

export default useChangeCoverPhoto;