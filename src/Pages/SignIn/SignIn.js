import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import { signInWithGoogle, db } from '../../Components/firebase'; // adjust path if needed
import { 
  getDoc,
  doc, 
  setDoc  
} from 'firebase/firestore';
import generateUniqueReferralCode from "../../AsyncFunctions/generateUniqueReferralCode";

const SignIn = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    let user;
    try {
      // 1️⃣ Just sign in with Google (old working code)
      user = await signInWithGoogle();
      navigate('/videos'); // redirect immediately after login
    } catch (error) {
      console.error('Google sign-in failed:', error);
      alert('Google sign-in failed. Please try again.');
      return; // stop here if login fails
    }

    try {
      // 2️⃣ Safely create Firestore Users document AFTER login succeeds
      const userRef = doc(db, 'Users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const referralCode = await generateUniqueReferralCode();

        await setDoc(userRef, {
          userid: user.uid,
          username: user.displayName || 'Anonymous',
          aboutme: '',
          email: user.email || '',
          tokens: 0,
          profilepic: user.photoURL || '', // just save Google photo URL
          photos: [],
          banned: false,
          following: [],
          followers: [],
          referralCode
        });
        console.log('Firestore user document created successfully');
      
      } else {
        // 🧠 Existing user — check if referralCode missing
        const existingData = userSnap.data();

        if (!existingData.referralCode) {
          const referralCode = await generateUniqueReferralCode();

          await setDoc(
            userRef,
            { referralCode },
            { merge: true } // ✅ prevents overwriting entire document
          );

          console.log('Referral code added to existing user');
        }
      }
    
    } catch (firestoreError) {
      console.error('Error creating Firestore user document:', firestoreError);
      // No alert here — we don’t want to break login if Firestore fails
    }
  };

  return (
    <div className="vrumies-signin-screen">
      <img
        src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1754732908/VrumiesLogo_jxdvsw.png"
        alt="Vrumies Logo"
        className="vrumies-signin-logo"
      />

      <div className="vrumies-signin-center">
        <img
          src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1754732913/Welcome_jngzua.png"
          alt="Welcome"
          className="vrumies-signin-welcome-image"
        />

        <button
          className="vrumies-signin-google-button"
          onClick={handleGoogleSignIn}
          aria-label="Sign in with Google"
          type="button"
        >
          <img
            src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1754732908/GoogleSignIn_gk6tbs.png"
            alt="Google Sign-In"
            className="vrumies-signin-google-image"
          />
        </button>
      </div>
    </div>
  );
};

export default SignIn;
