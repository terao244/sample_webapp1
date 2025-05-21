// プロフィール編集フォーム
import { useState } from 'react';
import { useAuth } from '../../lib/auth/AuthContext';
import { updateUserProfile, updateUserEmail, updateUserPassword } from '../../lib/auth/authUtils';

export default function ProfileForm() {
  const { user } = useAuth();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  // プロフィール更新
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await updateUserProfile(displayName);
      if (result.success) {
        setSuccess('プロフィールが更新されました');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('更新中にエラーが発生しました');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // メールアドレス更新
  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    if (!currentPassword) {
      setError('現在のパスワードを入力してください');
      setLoading(false);
      return;
    }
    
    try {
      const result = await updateUserEmail(email, currentPassword);
      if (result.success) {
        setSuccess('メールアドレスが更新されました');
        setCurrentPassword('');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('更新中にエラーが発生しました');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // パスワード更新
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    if (!currentPassword) {
      setError('現在のパスワードを入力してください');
      setLoading(false);
      return;
    }
    
    if (newPassword.length < 6) {
      setError('新しいパスワードは6文字以上である必要があります');
      setLoading(false);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('新しいパスワードが一致しません');
      setLoading(false);
      return;
    }
    
    try {
      const result = await updateUserPassword(currentPassword, newPassword);
      if (result.success) {
        setSuccess('パスワードが更新されました');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('更新中にエラーが発生しました');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="profile-form">
      <div className="tabs">
        <button 
          className={activeTab === 'profile' ? 'active' : ''} 
          onClick={() => setActiveTab('profile')}
        >
          プロフィール
        </button>
        <button 
          className={activeTab === 'email' ? 'active' : ''} 
          onClick={() => setActiveTab('email')}
        >
          メールアドレス
        </button>
        <button 
          className={activeTab === 'password' ? 'active' : ''} 
          onClick={() => setActiveTab('password')}
        >
          パスワード
        </button>
      </div>
      
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileUpdate}>
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
          
          <button type="submit" disabled={loading}>
            {loading ? '更新中...' : 'プロフィールを更新'}
          </button>
        </form>
      )}
      
      {activeTab === 'email' && (
        <form onSubmit={handleEmailUpdate}>
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
            <label htmlFor="currentPasswordEmail">現在のパスワード</label>
            <input
              type="password"
              id="currentPasswordEmail"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? '更新中...' : 'メールアドレスを更新'}
          </button>
        </form>
      )}
      
      {activeTab === 'password' && (
        <form onSubmit={handlePasswordUpdate}>
          <div className="form-group">
            <label htmlFor="currentPassword">現在のパスワード</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">新しいパスワード</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">新しいパスワード（確認）</label>
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
            {loading ? '更新中...' : 'パスワードを更新'}
          </button>
        </form>
      )}
      
      <style jsx>{`
        .profile-form {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .tabs {
          display: flex;
          margin-bottom: 20px;
          border-bottom: 1px solid #ddd;
        }
        
        .tabs button {
          background: none;
          border: none;
          padding: 10px 15px;
          cursor: pointer;
          font-size: 1rem;
          border-bottom: 2px solid transparent;
        }
        
        .tabs button.active {
          border-bottom: 2px solid #4285f4;
          color: #4285f4;
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
        
        button[type="submit"] {
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
        
        .error {
          color: red;
          margin-bottom: 15px;
        }
        
        .success {
          color: green;
          margin-bottom: 15px;
        }
      `}</style>
    </div>
  );
}