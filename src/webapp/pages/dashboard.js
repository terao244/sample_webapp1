// ダッシュボードページ（要認証）
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../lib/auth/AuthContext';
import LogoutButton from '../components/auth/LogoutButton';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { TaskList } from '../components/tasks';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="container">
        <Head>
          <title>ダッシュボード</title>
          <meta name="description" content="ユーザーダッシュボード" />
        </Head>

        <main>
          <h1>ダッシュボード</h1>
          
          <div className="dashboard-content">
            <div className="user-info">
              <h2>ユーザー情報</h2>
              {user && (
                <>
                  <p><strong>名前:</strong> {user.displayName || 'なし'}</p>
                  <p><strong>メール:</strong> {user.email}</p>
                  <p><strong>ユーザーID:</strong> {user.uid}</p>
                  <p><strong>メール確認:</strong> {user.emailVerified ? '済み' : '未確認'}</p>
                </>
              )}
              
              <div className="actions">
                <Link href="/profile" className="profile-button">
                  プロフィール設定
                </Link>
                <LogoutButton className="logout-button" />
              </div>
            </div>
            
            <div className="task-container">
              <TaskList />
            </div>
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
            padding: 3rem 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            max-width: 1200px;
          }

          h1 {
            margin-bottom: 2rem;
            color: #333;
          }
          
          .dashboard-content {
            display: flex;
            flex-direction: column;
            width: 100%;
          }
          
          @media (min-width: 768px) {
            .dashboard-content {
              flex-direction: row;
              gap: 2rem;
            }
          }

          .user-info {
            width: 100%;
            padding: 1.5rem;
            background-color: #f5f5f5;
            border-radius: 8px;
            margin-bottom: 2rem;
            flex-shrink: 0;
          }
          
          @media (min-width: 768px) {
            .user-info {
              width: 300px;
              margin-bottom: 0;
            }
          }

          .user-info h2 {
            margin-top: 0;
            margin-bottom: 1rem;
            color: #333;
          }

          .actions {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1.5rem;
          }

          .profile-button {
            padding: 0.5rem 1.5rem;
            background-color: #4285f4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            text-decoration: none;
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
          
          .task-container {
            flex: 1;
            width: 100%;
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}