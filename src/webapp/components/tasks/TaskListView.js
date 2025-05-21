import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth/AuthContext';
import { taskService } from '../../lib/firestore';
import Link from 'next/link';

export default function TaskListView() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('grid'); // grid, list
  const [sortBy, setSortBy] = useState('createdAt'); // createdAt, title, updatedAt
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

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

  // ソート処理
  const sortedTasks = [...tasks].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // 文字列比較の場合
    if (sortBy === 'title') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    // 日付比較の場合
    return sortOrder === 'asc' 
      ? new Date(aValue) - new Date(bValue)
      : new Date(bValue) - new Date(aValue);
  });

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

  // ソート切り替え
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // ステータスバッジ
  const StatusBadge = ({ completed }) => (
    <span className={`status-badge ${completed ? 'completed' : 'active'}`}>
      {completed ? '完了' : '未完了'}
      <style jsx>{`
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
          text-align: center;
        }
        .active {
          background-color: #e3f2fd;
          color: #1976d2;
        }
        .completed {
          background-color: #e8f5e9;
          color: #2e7d32;
        }
      `}</style>
    </span>
  );

  return (
    <div className="task-list-view">
      <div className="list-header">
        <h2>タスク一覧</h2>
        <div className="view-controls">
          <button 
            className={`view-button ${view === 'grid' ? 'active' : ''}`}
            onClick={() => setView('grid')}
            title="グリッド表示"
          >
            ■
          </button>
          <button 
            className={`view-button ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
            title="リスト表示"
          >
            ≡
          </button>
        </div>
      </div>

      <div className="list-toolbar">
        <div className="sort-controls">
          <span>並び替え:</span>
          <button 
            className={sortBy === 'createdAt' ? 'active' : ''}
            onClick={() => toggleSort('createdAt')}
          >
            作成日 {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            className={sortBy === 'updatedAt' ? 'active' : ''}
            onClick={() => toggleSort('updatedAt')}
          >
            更新日 {sortBy === 'updatedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            className={sortBy === 'title' ? 'active' : ''}
            onClick={() => toggleSort('title')}
          >
            タイトル {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
        
        <Link href="/dashboard" className="dashboard-link">
          ダッシュボードへ
        </Link>
      </div>

      {/* エラーメッセージ */}
      {error && <p className="error">{error}</p>}
      
      {/* ローディング表示 */}
      {loading ? (
        <div className="loading">
          <p>タスクを読み込み中...</p>
        </div>
      ) : (
        <>
          {tasks.length === 0 ? (
            <div className="empty-state">
              <p>タスクがまだありません</p>
              <Link href="/dashboard" className="create-link">
                新しいタスクを作成する
              </Link>
            </div>
          ) : (
            view === 'grid' ? (
              <div className="task-grid">
                {sortedTasks.map(task => (
                  <div key={task.id} className="task-card">
                    <div className="task-card-header">
                      <h3 className="task-card-title">{task.title}</h3>
                      <StatusBadge completed={task.completed} />
                    </div>
                    
                    {task.description && (
                      <p className="task-card-description">
                        {task.description.length > 100 
                          ? `${task.description.substring(0, 100)}...` 
                          : task.description}
                      </p>
                    )}
                    
                    <div className="task-card-footer">
                      <div className="task-card-dates">
                        <span>作成: {formatDate(task.createdAt)}</span>
                        {task.updatedAt !== task.createdAt && (
                          <span>更新: {formatDate(task.updatedAt)}</span>
                        )}
                      </div>
                      <Link href={`/dashboard?taskId=${task.id}`} className="view-details">
                        詳細
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="task-table-container">
                <table className="task-table">
                  <thead>
                    <tr>
                      <th>状態</th>
                      <th onClick={() => toggleSort('title')} className="sortable">
                        タイトル {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => toggleSort('createdAt')} className="sortable">
                        作成日 {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => toggleSort('updatedAt')} className="sortable">
                        更新日 {sortBy === 'updatedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTasks.map(task => (
                      <tr key={task.id} className={task.completed ? 'completed-row' : ''}>
                        <td><StatusBadge completed={task.completed} /></td>
                        <td>{task.title}</td>
                        <td>{formatDate(task.createdAt)}</td>
                        <td>{formatDate(task.updatedAt)}</td>
                        <td>
                          <Link href={`/dashboard?taskId=${task.id}`} className="view-details">
                            詳細
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </>
      )}

      <style jsx>{`
        .task-list-view {
          width: 100%;
        }
        
        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        h2 {
          margin: 0;
          color: #1e293b;
          font-size: 1.75rem;
        }
        
        .view-controls {
          display: flex;
          gap: 0.5rem;
        }
        
        .view-button {
          background-color: #e2e8f0;
          color: #64748b;
          border: none;
          border-radius: 4px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
        }
        
        .view-button.active {
          background-color: #3b82f6;
          color: white;
        }
        
        .list-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding: 0.75rem 1rem;
          background-color: #f8fafc;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }
        
        .sort-controls {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        
        .sort-controls button {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          font-size: 0.9rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }
        
        .sort-controls button:hover {
          background-color: #e2e8f0;
        }
        
        .sort-controls button.active {
          background-color: #e2e8f0;
          color: #0f172a;
          font-weight: 500;
        }
        
        .dashboard-link {
          display: inline-block;
          padding: 0.5rem 1rem;
          background-color: #3b82f6;
          color: white;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
        }
        
        .dashboard-link:hover {
          background-color: #2563eb;
        }
        
        .error {
          background-color: #fee2e2;
          color: #b91c1c;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
        }
        
        .loading {
          text-align: center;
          padding: 2rem;
          color: #64748b;
          background-color: #f8fafc;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          background-color: #f8fafc;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }
        
        .empty-state p {
          color: #64748b;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }
        
        .create-link {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background-color: #3b82f6;
          color: white;
          border-radius: 6px;
          font-weight: 500;
        }
        
        .create-link:hover {
          background-color: #2563eb;
        }
        
        .task-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .task-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          height: 100%;
          border: 1px solid #e2e8f0;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .task-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .task-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }
        
        .task-card-title {
          margin: 0;
          font-size: 1.1rem;
          color: #0f172a;
          flex: 1;
          margin-right: 1rem;
        }
        
        .task-card-description {
          color: #475569;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 1.25rem;
          flex: 1;
        }
        
        .task-card-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        
        .task-card-dates {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: #64748b;
        }
        
        .view-details {
          display: inline-block;
          padding: 0.4rem 0.75rem;
          background-color: #eff6ff;
          color: #3b82f6;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .view-details:hover {
          background-color: #dbeafe;
        }
        
        .task-table-container {
          overflow-x: auto;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }
        
        .task-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .task-table th, .task-table td {
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .task-table th {
          background-color: #f8fafc;
          font-weight: 500;
          color: #0f172a;
        }
        
        .task-table th.sortable {
          cursor: pointer;
        }
        
        .task-table th.sortable:hover {
          background-color: #f1f5f9;
        }
        
        .task-table tbody tr:hover {
          background-color: #f8fafc;
        }
        
        .completed-row {
          background-color: #f8fafc;
          color: #64748b;
        }
        
        @media (max-width: 768px) {
          .list-toolbar {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .sort-controls {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }
          
          .task-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}