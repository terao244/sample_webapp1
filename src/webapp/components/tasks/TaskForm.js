// タスク作成フォーム
import { useState } from 'react';
import { useAuth } from '../../lib/auth/AuthContext';
import { taskService } from '../../lib/firestore';

export default function TaskForm({ onTaskCreated }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await taskService.createTask(user.uid, {
        title,
        description,
      });
      
      // フォームをリセット
      setTitle('');
      setDescription('');
      
      // 親コンポーネントに通知
      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (err) {
      console.error('タスク作成エラー:', err);
      setError('タスクの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form">
      <h3>新しいタスクを作成</h3>
      
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">タイトル</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            placeholder="タスクのタイトル"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">詳細</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            placeholder="タスクの詳細"
            rows={3}
          />
        </div>
        
        <button 
          type="submit" 
          className="create-button"
          disabled={loading}
        >
          {loading ? '作成中...' : 'タスクを作成'}
        </button>
      </form>
      
      <style jsx>{`
        .task-form {
          background-color: #f9f9f9;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          width: 100%;
        }
        
        h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #333;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        input, textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .create-button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.2s;
        }
        
        .create-button:hover {
          background-color: #45a049;
        }
        
        .create-button:disabled {
          background-color: #9e9e9e;
          cursor: not-allowed;
        }
        
        .error {
          color: #f44336;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}