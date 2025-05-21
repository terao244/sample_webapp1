import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../lib/auth/AuthContext';
import LogoutButton from '../components/auth/LogoutButton';

export default function Home() {
  const { user, loading } = useAuth();
  const [firebaseStatus, setFirebaseStatus] = useState('接続確認中...');
  const [firestoreStatus, setFirestoreStatus] = useState('接続確認中...');

  useEffect(() => {
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
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Next.js with Firebase</title>
        <meta name="description" content="Next.jsとFirebaseを使ったWebアプリケーション" />
      </Head>

      <main>
        <h1>Next.js with Firebase</h1>
        
        {loading ? (
          <p>読み込み中...</p>
        ) : user ? (
          <div className="authenticated">
            <p>こんにちは、{user.displayName || user.email}さん！</p>
            <div className="actions">
              <Link href="/dashboard" className="dashboard-link">
                ダッシュボードへ
              </Link>
              <LogoutButton className="logout-button" />
            </div>
          </div>
        ) : (
          <div className="unauthenticated">
            <p>アプリケーションをご利用いただくにはログインが必要です</p>
            <div className="auth-buttons">
              <Link href="/login" className="login-button">
                ログイン
              </Link>
              <Link href="/signup" className="signup-button">
                新規登録
              </Link>
            </div>
          </div>
        )}
        
        <div className="status-box">
          <h2>Firebase接続ステータス</h2>
          <p>Authentication: {user ? 'Firebase Authentication接続成功！' : loading ? '確認中...' : 'ログインしていません'}</p>
          <p>Firestore: {firestoreStatus}</p>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 800px;
        }

        h1 {
          margin-bottom: 2rem;
        }

        .authenticated, .unauthenticated {
          margin-bottom: 2rem;
          text-align: center;
        }

        .actions, .auth-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .dashboard-link, .login-button, .signup-button {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
        }

        .dashboard-link, .login-button {
          background-color: #4285f4;
          color: white;
        }

        .signup-button {
          background-color: #34a853;
          color: white;
        }

        .logout-button {
          padding: 0.5rem 1.5rem;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }

        .status-box {
          width: 100%;
          margin-top: 2rem;
          padding: 1.5rem;
          background-color: #f5f5f5;
          border-radius: 5px;
        }

        .status-box h2 {
          margin-top: 0;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}