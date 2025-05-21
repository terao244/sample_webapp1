// タスク一覧コンポーネント
import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth/AuthContext';
import { taskService } from '../../lib/firestore';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

export default function TaskList() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed

  // タスク読み込み
  const loadTasks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userTasks = await taskService.getUserTasks(user.uid);
      setTasks(userTasks);
      setError(null);
    } catch (err) {
      console.error('タスク取得エラー:', err);
      setError('タスクの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 初回読み込み
  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  // フィルター適用
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // all
  });

  // 統計情報
  const stats = {
    total: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
  };

  return (
    <div className="task-list-container">
      <h2>タスク管理</h2>
      
      {/* タスク作成フォーム */}
      <TaskForm onTaskCreated={loadTasks} />
      
      {/* フィルターとタスク統計 */}
      <div className="task-filters">
        <div className="filter-buttons">
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'active' : ''}
          >
            すべて ({stats.total})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={filter === 'active' ? 'active' : ''}
          >
            未完了 ({stats.active})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={filter === 'completed' ? 'active' : ''}
          >
            完了済み ({stats.completed})
          </button>
        </div>
        
        {stats.completed > 0 && (
          <button 
            className="clear-completed"
            onClick={async () => {
              if (window.confirm('完了済みのタスクをすべて削除してもよろしいですか？')) {
                try {
                  const completedTasks = tasks.filter(task => task.completed);
                  await Promise.all(
                    completedTasks.map(task => taskService.deleteTask(task.id))
                  );
                  loadTasks();
                } catch (err) {
                  console.error('タスク削除エラー:', err);
                  alert('タスクの削除に失敗しました');
                }
              }
            }}
          >
            完了済みを削除
          </button>
        )}
      </div>
      
      {/* エラーメッセージ */}
      {error && <p className="error">{error}</p>}
      
      {/* ローディング表示 */}
      {loading ? (
        <p className="loading">タスクを読み込み中...</p>
      ) : (
        <div className="task-items">
          {filteredTasks.length === 0 ? (
            <p className="no-tasks">
              {filter === 'all' ? 
                'タスクがまだありません。新しいタスクを作成してください。' :
                filter === 'active' ? 
                  '未完了のタスクはありません。' : 
                  '完了済みのタスクはありません。'
              }
            </p>
          ) : (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={loadTasks}
                onDelete={loadTasks}
              />
            ))
          )}
        </div>
      )}
      
      <style jsx>{`
        .task-list-container {
          width: 100%;
        }
        
        h2 {
          margin-bottom: 1.5rem;
          color: #333;
          border-bottom: 2px solid #4285f4;
          padding-bottom: 0.5rem;
        }
        
        .task-filters {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          background-color: #f5f5f5;
          padding: 0.75rem;
          border-radius: 8px;
        }
        
        .filter-buttons {
          display: flex;
          gap: 0.5rem;
        }
        
        .filter-buttons button {
          background-color: #e0e0e0;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
        }
        
        .filter-buttons button.active {
          background-color: #4285f4;
          color: white;
        }
        
        .clear-completed {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
        }
        
        .error {
          color: #f44336;
          background-color: #ffebee;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }
        
        .loading {
          text-align: center;
          color: #757575;
          padding: 1rem;
        }
        
        .no-tasks {
          text-align: center;
          color: #757575;
          padding: 2rem;
          background-color: #f5f5f5;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}