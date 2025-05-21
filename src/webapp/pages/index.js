import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import { useAuth } from '../lib/auth/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const [firebaseStatus, setFirebaseStatus] = useState('接続確認中...');

  useEffect(() => {
    // Firestoreの接続テスト
    const testFirestore = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'test_collection'));
        setFirebaseStatus('Firestore接続成功！');
      } catch (error) {
        setFirebaseStatus(`Firestore接続エラー: ${error.message}`);
      }
    };

    testFirestore();
  }, []);

  return (
    <Layout title="ホーム | タスク管理アプリ">
      <div className="home-container">
        <section className="hero">
          <h1>効率的なタスク管理を<br />始めましょう</h1>
          <p className="subtitle">シンプルで使いやすいタスク管理アプリで、あなたの生産性を向上させましょう。</p>
          
          {loading ? (
            <div className="loading">読み込み中...</div>
          ) : user ? (
            <div className="cta">
              <Link href="/dashboard" className="cta-button primary">
                ダッシュボードへ
              </Link>
            </div>
          ) : (
            <div className="cta">
              <Link href="/signup" className="cta-button primary">
                無料で始める
              </Link>
              <Link href="/login" className="cta-button secondary">
                ログイン
              </Link>
            </div>
          )}
        </section>

        <section className="features">
          <h2>主な機能</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>タスク管理</h3>
              <p>簡単にタスクを作成、編集、完了できます。優先順位やカテゴリで整理しましょう。</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">☁️</div>
              <h3>クラウド同期</h3>
              <p>あなたのタスクはクラウドに保存され、どのデバイスからでもアクセスできます。</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>リマインダー</h3>
              <p>重要なタスクを忘れないように、リマインダーを設定できます。</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>進捗管理</h3>
              <p>タスクの進捗状況を視覚的に確認し、生産性を向上させましょう。</p>
            </div>
          </div>
        </section>

        {!user && (
          <section className="get-started">
            <h2>さっそく始めましょう</h2>
            <p>アカウント登録は無料です。今すぐ始めて生産性を向上させましょう。</p>
            <Link href="/signup" className="cta-button primary">
              アカウント作成
            </Link>
          </section>
        )}

        <section className="status">
          <h3>Firebase接続ステータス</h3>
          <p>Authentication: {user ? '接続成功' : loading ? '確認中...' : 'ログインしていません'}</p>
          <p>Firestore: {firebaseStatus}</p>
        </section>
      </div>

      <style jsx>{`
        .home-container {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }

        .hero {
          text-align: center;
          padding: 2rem 1rem 4rem;
        }

        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .subtitle {
          font-size: 1.2rem;
          color: #64748b;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .loading {
          display: inline-block;
          margin-top: 1rem;
          font-style: italic;
          color: #64748b;
        }

        .cta {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1.5rem;
        }

        .cta-button {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 500;
          transition: all 0.2s;
          text-align: center;
        }

        .cta-button.primary {
          background-color: #3b82f6;
          color: white;
        }

        .cta-button.primary:hover {
          background-color: #2563eb;
        }

        .cta-button.secondary {
          background-color: #e2e8f0;
          color: #1e293b;
        }

        .cta-button.secondary:hover {
          background-color: #cbd5e1;
        }

        .features {
          padding: 2rem 0;
        }

        .features h2 {
          text-align: center;
          margin-bottom: 2.5rem;
          font-size: 1.8rem;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          margin-bottom: 0.75rem;
          font-size: 1.25rem;
        }

        .feature-card p {
          color: #64748b;
          line-height: 1.5;
        }

        .get-started {
          background-color: #eff6ff;
          padding: 3rem;
          border-radius: 8px;
          text-align: center;
        }

        .get-started h2 {
          margin-bottom: 1rem;
          font-size: 1.8rem;
        }

        .get-started p {
          margin-bottom: 1.5rem;
          color: #64748b;
        }

        .status {
          background-color: #f1f5f9;
          padding: 1.5rem;
          border-radius: 8px;
          margin-top: 2rem;
        }

        .status h3 {
          margin-bottom: 0.75rem;
          font-size: 1.25rem;
        }

        .status p {
          margin-bottom: 0.5rem;
          color: #64748b;
        }

        @media (min-width: 768px) {
          h1 {
            font-size: 3.5rem;
          }

          .hero {
            padding: 4rem 1rem 6rem;
          }
        }
      `}</style>
    </Layout>
  );
}