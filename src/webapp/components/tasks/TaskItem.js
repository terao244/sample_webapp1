// タスク項目コンポーネント
import { useState } from 'react';
import { taskService } from '../../lib/firestore';

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [loading, setLoading] = useState(false);

  // タスク完了状態の切り替え
  const handleToggleComplete = async () => {
    try {
      setLoading(true);
      await taskService.toggleTaskCompletion(task.id, !task.completed);
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('タスク状態更新エラー:', error);
      alert('タスクの状態を更新できませんでした');
    } finally {
      setLoading(false);
    }
  };

  // タスク編集フォーム送信
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editTitle.trim()) {
      alert('タイトルを入力してください');
      return;
    }
    
    try {
      setLoading(true);
      
      await taskService.updateTask(task.id, {
        title: editTitle,
        description: editDescription,
      });
      
      setIsEditing(false);
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('タスク更新エラー:', error);
      alert('タスクを更新できませんでした');
    } finally {
      setLoading(false);
    }
  };

  // タスク削除
  const handleDelete = async () => {
    if (!window.confirm('このタスクを削除してもよろしいですか？')) {
      return;
    }
    
    try {
      setLoading(true);
      await taskService.deleteTask(task.id);
      
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('タスク削除エラー:', error);
      alert('タスクを削除できませんでした');
    } finally {
      setLoading(false);
    }
  };

  // 編集キャンセル
  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  // 日付フォーマット
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      {!isEditing ? (
        <div className="task-content">
          <div className="task-header">
            <div className="task-title-container">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={handleToggleComplete}
                disabled={loading}
                className="task-checkbox"
              />
              <h4 className="task-title">{task.title}</h4>
            </div>
            <div className="task-actions">
              <button 
                onClick={() => setIsEditing(true)} 
                className="edit-button"
                disabled={loading}
              >
                編集
              </button>
              <button 
                onClick={handleDelete} 
                className="delete-button"
                disabled={loading}
              >
                削除
              </button>
            </div>
          </div>
          
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          
          <div className="task-meta">
            <span className="task-date">作成: {formatDate(task.createdAt)}</span>
            {task.updatedAt && task.updatedAt !== task.createdAt && (
              <span className="task-date">更新: {formatDate(task.updatedAt)}</span>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleEditSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor={`title-${task.id}`}>タイトル</label>
            <input
              id={`title-${task.id}`}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor={`description-${task.id}`}>詳細</label>
            <textarea
              id={`description-${task.id}`}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="save-button"
              disabled={loading}
            >
              保存
            </button>
            <button 
              type="button" 
              onClick={handleCancelEdit}
              className="cancel-button"
              disabled={loading}
            >
              キャンセル
            </button>
          </div>
        </form>
      )}

      <style jsx>{`
        .task-item {
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .task-item.completed {
          background-color: #f5f5f5;
          border-color: #e0e0e0;
        }
        
        .task-item.completed .task-title {
          text-decoration: line-through;
          color: #757575;
        }
        
        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .task-title-container {
          display: flex;
          align-items: center;
        }
        
        .task-checkbox {
          margin-right: 0.75rem;
        }
        
        .task-title {
          margin: 0;
          font-weight: 500;
          color: #333;
        }
        
        .task-description {
          margin: 0.5rem 0;
          color: #555;
          white-space: pre-line;
        }
        
        .task-meta {
          font-size: 0.75rem;
          color: #757575;
          margin-top: 0.5rem;
          display: flex;
          gap: 1rem;
        }
        
        .task-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .edit-button, .delete-button, .save-button, .cancel-button {
          border: none;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
        }
        
        .edit-button {
          background-color: #2196f3;
          color: white;
        }
        
        .delete-button {
          background-color: #f44336;
          color: white;
        }
        
        .save-button {
          background-color: #4caf50;
          color: white;
          padding: 0.5rem 1rem;
        }
        
        .cancel-button {
          background-color: #9e9e9e;
          color: white;
          padding: 0.5rem 1rem;
        }
        
        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
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
        
        .form-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
}