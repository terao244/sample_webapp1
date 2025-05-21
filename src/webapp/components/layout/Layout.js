import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth/AuthContext';
import LogoutButton from '../auth/LogoutButton';

export default function Layout({ children, title = 'Next.js with Firebase' }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  return (
    <div className="layout">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Next.jsとFirebaseを使ったWebアプリケーション" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header>
        <div className="header-content">
          <Link href="/" className="logo">
            タスク管理アプリ
          </Link>
          
          <nav>
            {!loading && (
              user ? (
                <>
                  <Link href="/dashboard" className={router.pathname === '/dashboard' ? 'active' : ''}>
                    ダッシュボード
                  </Link>
                  <Link href="/profile" className={router.pathname === '/profile' ? 'active' : ''}>
                    プロフィール
                  </Link>
                  <LogoutButton className="nav-logout" />
                </>
              ) : (
                <>
                  <Link href="/login" className={router.pathname === '/login' ? 'active' : ''}>
                    ログイン
                  </Link>
                  <Link href="/signup" className={router.pathname === '/signup' ? 'active' : ''}>
                    新規登録
                  </Link>
                </>
              )
            )}
          </nav>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} タスク管理アプリ All Rights Reserved.</p>
      </footer>

      <style jsx>{`
        .layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        header {
          background-color: #1e293b;
          color: white;
          padding: 1rem 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
        }

        nav {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        nav a {
          color: #e2e8f0;
          font-weight: 500;
          padding: 0.5rem 0;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        nav a:hover, nav a.active {
          color: white;
          border-bottom-color: #3b82f6;
        }

        .nav-logout {
          background-color: transparent;
          border: 1px solid #e2e8f0;
          color: #e2e8f0;
          padding: 0.4rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .nav-logout:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .main-content {
          flex: 1;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        footer {
          background-color: #1e293b;
          color: #e2e8f0;
          text-align: center;
          padding: 1.5rem 0;
          margin-top: auto;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
          }

          nav {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }
        }
      `}</style>

      <style jsx global>{`
        body {
          background-color: #f8fafc;
          color: #1e293b;
        }

        a {
          color: #3b82f6;
          transition: color 0.2s;
        }

        a:hover {
          color: #2563eb;
        }

        button {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}