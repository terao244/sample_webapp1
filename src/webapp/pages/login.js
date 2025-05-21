// ログインページ
import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../lib/auth/AuthContext';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // すでにログインしている場合はホームページにリダイレクト
  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  // ローディング中は何も表示しない
  if (loading) {
    return <div>Loading...</div>;
  }

  // 未認証の場合はログインフォームを表示
  if (!user) {
    return (
      <div className="container">
        <Head>
          <title>ログイン</title>
          <meta name="description" content="アカウントにログイン" />
        </Head>

        <main>
          <LoginForm />
        </main>

        <style jsx>{`
          .container {
            min-height: 100vh;
            padding: 0 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          main {
            padding: 5rem 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
          }
        `}</style>
      </div>
    );
  }

  // すでにログインしている場合（通常はこのコードは実行されない）
  return null;
}