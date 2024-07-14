"use client"

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const UserProfile = () => {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }

    if (user) {
      const fetchUserData = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error getting document:', error);
        }
      };

      fetchUserData();
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {user &&
        <div className="w-full max-w-md p-8 space-y-3 bg-white rounded shadow-md">
          <h1 className="text-2xl font-bold text-center">Welcome, {user.email}</h1>
          {userData && (
            <div className="space-y-2">
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              {/* Display other user-specific data */}
            </div>
          )}
          <button 
            onClick={handleSignOut} 
            className="w-full px-4 py-2 font-bold text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
          >
            Sign Out
          </button>
        </div>
      }
    </div>
  );
};

export default UserProfile;
