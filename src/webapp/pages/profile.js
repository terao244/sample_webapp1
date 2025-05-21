// プロフィール編集ページ
import Head from 'next/head';
import Link from 'next/link';
import ProfileForm from '../components/auth/ProfileForm';
import ProtectedRoute from '../components/auth/ProtectedRoute';

export default function Profile() {
  return (
    <ProtectedRoute>
      <div className="container">
        <Head>
          <title>プロフィール設定</title>
          <meta name="description" content="プロフィール設定" />
        </Head>

        <main>
          <h1>プロフィール設定</h1>
          
          <ProfileForm />
          
          <div className="back-link">
            <Link href="/dashboard" className="back-link-text">
              ← ダッシュボードに戻る
            </Link>
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

          .back-link {
            margin-top: 2rem;
          }

          .back-link-text {
            color: #4285f4;
            text-decoration: none;
          }

          .back-link-text:hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}