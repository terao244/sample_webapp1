// ログアウトボタンコンポーネント
import { useState } from 'react';
import { useRouter } from 'next/router';
import { logout } from '../../lib/auth/authUtils';

export default function LogoutButton({ className, buttonText = 'ログアウト' }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const result = await logout();
      if (result.success) {
        router.push('/login');
      } else {
        console.error('ログアウトエラー:', result.error);
      }
    } catch (error) {
      console.error('ログアウトエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={className}
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? 'ログアウト中...' : buttonText}
    </button>
  );
}