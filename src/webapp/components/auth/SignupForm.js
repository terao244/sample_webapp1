// サインアップフォームコンポーネント
import { useState } from 'react';
import { useRouter } from 'next/router';
import { registerWithEmail, loginWithGoogle } from '../../lib/auth/authUtils';

export default function SignupForm() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // メールとパスワードで新規登録
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // バリデーション
    if (!email || !password || !confirmPassword) {
      setError('すべての項目を入力してください');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上である必要があります');
      setLoading(false);
      return;
    }

    try {
      const result = await registerWithEmail(email, password, displayName);
      if (result.error) {
        setError(result.error);
      } else {
        // 登録成功
        router.push('/');
      }
    } catch (err) {
      setError('アカウント作成中にエラーが発生しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Googleで新規登録
  const handleGoogleSignup = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await loginWithGoogle();
      if (result.error) {
        setError(result.error);
      } else {
        // 登録成功
        router.push('/');
      }
    } catch (err) {
      setError('Googleサインアップ中にエラーが発生しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-form">
      <h2>アカウント作成</h2>
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleEmailSignup}>
        <div className="form-group">
          <label htmlFor="displayName">名前</label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">パスワード（確認）</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? '登録中...' : 'アカウント作成'}
        </button>
      </form>
      
      <div className="divider">または</div>
      
      <button
        className="google-button"
        onClick={handleGoogleSignup}
        disabled={loading}
      >
        Googleで登録
      </button>
      
      <p className="login-link">
        すでにアカウントをお持ちの場合は <a href="/login">ログイン</a>
      </p>
      
      <style jsx>{`
        .signup-form {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
        }
        
        input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        button {
          width: 100%;
          padding: 10px;
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        }
        
        button:disabled {
          background-color: #cccccc;
        }
        
        .google-button {
          background-color: white;
          color: #757575;
          border: 1px solid #ddd;
        }
        
        .divider {
          text-align: center;
          margin: 15px 0;
          color: #757575;
        }
        
        .error {
          color: red;
          margin-bottom: 15px;
        }
        
        .login-link {
          text-align: center;
          margin-top: 15px;
        }
      `}</style>
    </div>
  );
}