import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { taskService } from '../../lib/firestore';
import Link from 'next/link';

export default function TaskDetail({ taskId, onEdit, onDelete, onBack }) {
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const taskData = await taskService.getTask(taskId);
        
        if (taskData) {
          setTask(taskData);
          setError(null);
        } else {
          setError('タスクが見つかりませんでした');
          setTask(null);
        }
      } catch (err) {
        console.error('タスク取得エラー:', err);
        setError('タスクの読み込みに失敗しました');
        setTask(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  // タスク完了状態の切り替え
  const handleToggleComplete = async () => {
    try {
      setLoading(true);
      await taskService.toggleTaskCompletion(taskId, !task.completed);
      
      // 再読み込み
      const updatedTask = await taskService.getTask(taskId);
      setTask(updatedTask);
    } catch (error) {
      console.error('タスク状態更新エラー:', error);
      setError('タスクの状態を更新できませんでした');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="task-detail-loading">
        <p>タスクを読み込み中...</p>
        <style jsx>{`
          .task-detail-loading {
            text-align: center;
            padding: 2rem;
            color: #64748b;
            background-color: #f8fafc;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
          }
        `}</style>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="task-detail-error">
        <p>{error || 'タスクが見つかりませんでした'}</p>
        <button onClick={onBack} className="back-button">
          戻る
        </button>
        <style jsx>{`
          .task-detail-error {
            text-align: center;
            padding: 2rem;
            color: #ef4444;
            background-color: #fee2e2;
            border-radius: 6px;
            border: 1px solid #fecaca;
          }
          
          .back-button {
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background-color: #f1f5f9;
            color: #334155;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          
          .back-button:hover {
            background-color: #e2e8f0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="task-detail">
      <div className="task-detail-header">
        <h2>タスク詳細</h2>
        <div className="task-actions">
          <button 
            className="edit-button"
            onClick={() => onEdit && onEdit(task)}
          >
            編集
          </button>
          <button 
            className="delete-button"
            onClick={() => {
              if (window.confirm('このタスクを削除してもよろしいですか？')) {
                onDelete && onDelete(taskId);
              }
            }}
          >
            削除
          </button>
        </div>
      </div>

      <div className="task-content">
        <div className="task-header-content">
          <div className="task-status">
            <span className={`status-badge ${task.completed ? 'completed' : 'active'}`}>
              {task.completed ? '完了' : '未完了'}
            </span>
            <button 
              className="toggle-status"
              onClick={handleToggleComplete}
            >
              {task.completed ? '未完了に戻す' : '完了にする'}
            </button>
          </div>
          <h3 className="task-title">{task.title}</h3>
        </div>

        <div className="task-body">
          <div className="task-info">
            <div className="info-item">
              <span className="info-label">作成日時:</span>
              <span className="info-value">{formatDate(task.createdAt)}</span>
            </div>
            {task.updatedAt && task.updatedAt !== task.createdAt && (
              <div className="info-item">
                <span className="info-label">更新日時:</span>
                <span className="info-value">{formatDate(task.updatedAt)}</span>
              </div>
            )}
          </div>

          <div className="task-description">
            <h4>詳細</h4>
            {task.description ? (
              <div className="description-content">{task.description}</div>
            ) : (
              <p className="no-description">詳細はありません</p>
            )}
          </div>
        </div>
      </div>

      <div className="task-footer">
        <button onClick={onBack} className="back-button">
          一覧に戻る
        </button>
      </div>

      <style jsx>{`
        .task-detail {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }
        
        .task-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          background-color: #f8fafc;
        }
        
        .task-detail-header h2 {
          margin: 0;
          font-size: 1.25rem;
          color: #0f172a;
        }
        
        .task-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .edit-button, .delete-button {
          padding: 0.4rem 0.75rem;
          border: none;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
        }
        
        .edit-button {
          background-color: #3b82f6;
          color: white;
        }
        
        .edit-button:hover {
          background-color: #2563eb;
        }
        
        .delete-button {
          background-color: #ef4444;
          color: white;
        }
        
        .delete-button:hover {
          background-color: #dc2626;
        }
        
        .task-content {
          padding: 1.5rem;
        }
        
        .task-header-content {
          margin-bottom: 1.5rem;
        }
        
        .task-status {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }
        
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .status-badge.active {
          background-color: #e0f2fe;
          color: #0369a1;
        }
        
        .status-badge.completed {
          background-color: #dcfce7;
          color: #15803d;
        }
        
        .toggle-status {
          background: none;
          border: 1px solid #cbd5e1;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          color: #64748b;
          cursor: pointer;
        }
        
        .toggle-status:hover {
          background-color: #f1f5f9;
          border-color: #94a3b8;
        }
        
        .task-title {
          margin: 0;
          font-size: 1.5rem;
          color: #0f172a;
          font-weight: 600;
        }
        
        .task-body {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .task-info {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .info-label {
          font-size: 0.75rem;
          color: #64748b;
        }
        
        .info-value {
          font-size: 0.875rem;
          color: #334155;
        }
        
        .task-description {
          padding-top: 0.5rem;
        }
        
        .task-description h4 {
          margin-top: 0;
          margin-bottom: 0.75rem;
          font-size: 1rem;
          color: #334155;
        }
        
        .description-content {
          white-space: pre-line;
          line-height: 1.6;
          color: #334155;
        }
        
        .no-description {
          color: #94a3b8;
          font-style: italic;
        }
        
        .task-footer {
          padding: 1rem 1.5rem;
          background-color: #f8fafc;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-start;
        }
        
        .back-button {
          padding: 0.5rem 1rem;
          background-color: #f1f5f9;
          color: #334155;
          border: none;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
        }
        
        .back-button:hover {
          background-color: #e2e8f0;
        }
        
        @media (max-width: 640px) {
          .task-detail-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          
          .task-actions {
            width: 100%;
            justify-content: flex-end;
          }
          
          .task-status {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}