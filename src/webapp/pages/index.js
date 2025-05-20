import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

export default function Home() {
  const [firebaseStatus, setFirebaseStatus] = useState('接続確認中...');
  const [firestoreStatus, setFirestoreStatus] = useState('接続確認中...');

  useEffect(() => {
    // Firebaseの認証接続テスト
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseStatus('Firebase Authentication接続成功！');
    }, (error) => {
      setFirebaseStatus(`Firebase Authentication接続エラー: ${error.message}`);
    });

    // Firestoreの接続テスト
    const testFirestore = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'test_collection'));
        setFirestoreStatus('Firestore接続成功！');
      } catch (error) {
        setFirestoreStatus(`Firestore接続エラー: ${error.message}`);
      }
    };

    testFirestore();

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Next.js with Firebase</h1>
      <p>Welcome to our app!</p>
      
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Firebase接続ステータス</h2>
        <p>Authentication: {firebaseStatus}</p>
        <p>Firestore: {firestoreStatus}</p>
      </div>
    </div>
  );
}