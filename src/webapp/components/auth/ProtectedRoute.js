// 認証が必要なルートを保護するためのコンポーネント
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // ローディング中は何も表示しない
  if (loading) {
    return <div>Loading...</div>;
  }

  // 未認証の場合はログインページにリダイレクト
  if (!user) {
    router.push('/login');
    return null;
  }

  // 認証済みの場合は子コンポーネントを表示
  return <>{children}</>;
}