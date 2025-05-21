// ログインフォームコンポーネント
import { useState } from 'react';
import { useRouter } from 'next/router';
import { loginWithEmail, loginWithGoogle } from '../../lib/auth/authUtils';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // メールとパスワードでログイン
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // バリデーション
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      setLoading(false);
      return;
    }

    try {
      const result = await loginWithEmail(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        // ログイン成功
        router.push('/');
      }
    } catch (err) {
      setError('ログイン中にエラーが発生しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Googleでログイン
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await loginWithGoogle();
      if (result.error) {
        setError(result.error);
      } else {
        // ログイン成功
        router.push('/');
      }
    } catch (err) {
      setError('Googleログイン中にエラーが発生しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <h2>ログイン</h2>
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleEmailLogin}>
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
        
        <button type="submit" disabled={loading}>
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
      
      <div className="divider">または</div>
      
      <button
        className="google-button"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        Googleでログイン
      </button>
      
      <p className="signup-link">
        アカウントをお持ちでない場合は <a href="/signup">新規登録</a>
      </p>
      
      <style jsx>{`
        .login-form {
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
        
        .signup-link {
          text-align: center;
          margin-top: 15px;
        }
      `}</style>
    </div>
  );
}