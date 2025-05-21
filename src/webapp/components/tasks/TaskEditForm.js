import { useState, useEffect } from 'react';
import { taskService } from '../../lib/firestore';

export default function TaskEditForm({ task, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 初期値の設定
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setCompleted(task.completed || false);
    }
  }, [task]);

  // フォームのバリデーション
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'タイトルは必須です';
    } else if (title.length > 100) {
      newErrors.title = 'タイトルは100文字以内で入力してください';
    }
    
    if (description && description.length > 1000) {
      newErrors.description = '詳細は1000文字以内で入力してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォーム送信ハンドラ
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      if (task && task.id) {
        // 既存タスクの更新
        await taskService.updateTask(task.id, {
          title,
          description,
          completed,
        });
      } else {
        // 新規タスク作成
        await taskService.createTask({
          title,
          description,
          completed,
        });
      }
      
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('タスク保存エラー:', error);
      setErrors({ submit: 'タスクの保存に失敗しました。後でやり直してください。' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-edit-form">
      <h3>{task && task.id ? 'タスクを編集' : '新しいタスクを作成'}</h3>
      
      {errors.submit && (
        <div className="error-message">{errors.submit}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">タイトル <span className="required">*</span></label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タスクのタイトルを入力"
            maxLength="100"
            className={errors.title ? 'error' : ''}
            disabled={loading}
            required
          />
          {errors.title && <div className="field-error">{errors.title}</div>}
          <div className="char-count">{title.length}/100</div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">詳細</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="タスクの詳細を入力（任意）"
            rows="5"
            maxLength="1000"
            className={errors.description ? 'error' : ''}
            disabled={loading}
          />
          {errors.description && <div className="field-error">{errors.description}</div>}
          <div className="char-count">{description.length}/1000</div>
        </div>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              disabled={loading}
            />
            完了済み
          </label>
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
            disabled={loading}
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="save-button"
            disabled={loading}
          >
            {loading ? '保存中...' : task && task.id ? '更新' : '作成'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .task-edit-form {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }
        
        h3 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          font-size: 1.25rem;
          color: #0f172a;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 0.5rem;
        }
        
        .error-message {
          background-color: #fee2e2;
          color: #b91c1c;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
          position: relative;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #334155;
        }
        
        .required {
          color: #ef4444;
        }
        
        input[type="text"],
        textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.95rem;
          color: #0f172a;
          transition: border-color 0.2s;
        }
        
        input[type="text"]:focus,
        textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        input.error,
        textarea.error {
          border-color: #ef4444;
        }
        
        input.error:focus,
        textarea.error:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        .field-error {
          color: #ef4444;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }
        
        .char-count {
          position: absolute;
          right: 0;
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 0.25rem;
        }
        
        .checkbox-group {
          margin-bottom: 2rem;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        
        .checkbox-label input {
          margin-right: 0.5rem;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }
        
        button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .cancel-button {
          background-color: #f1f5f9;
          color: #334155;
        }
        
        .cancel-button:hover {
          background-color: #e2e8f0;
        }
        
        .save-button {
          background-color: #3b82f6;
          color: white;
        }
        
        .save-button:hover {
          background-color: #2563eb;
        }
        
        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        @media (max-width: 640px) {
          .form-actions {
            flex-direction: column-reverse;
          }
          
          .form-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}