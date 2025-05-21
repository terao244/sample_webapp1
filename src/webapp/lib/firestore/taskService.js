// タスク関連のFirestore操作
import { 
  collection, 
  addDoc, 
  doc,
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { COLLECTIONS } from './models';

/**
 * 新しいタスクを作成する
 * @param {string} userId - ユーザーID
 * @param {Object} taskData - タスクデータ
 * @returns {Promise<string>} 作成されたタスクのID
 */
export const createTask = async (userId, taskData) => {
  try {
    const tasksRef = collection(db, COLLECTIONS.TASKS);
    const newTask = {
      ...taskData,
      userId,
      completed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(tasksRef, newTask);
    return docRef.id;
  } catch (error) {
    console.error('タスク作成エラー:', error);
    throw error;
  }
};

/**
 * ユーザーの全タスクを取得する
 * @param {string} userId - ユーザーID
 * @returns {Promise<Array>} タスクの配列
 */
export const getUserTasks = async (userId) => {
  try {
    const tasksRef = collection(db, COLLECTIONS.TASKS);
    const q = query(
      tasksRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Timestamp型をDate型に変換
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }));
  } catch (error) {
    console.error('タスク取得エラー:', error);
    throw error;
  }
};

/**
 * 特定のタスクを取得する
 * @param {string} taskId - タスクID
 * @returns {Promise<Object|null>} タスクデータ
 */
export const getTask = async (taskId) => {
  try {
    const taskRef = doc(db, COLLECTIONS.TASKS, taskId);
    const taskSnap = await getDoc(taskRef);
    
    if (taskSnap.exists()) {
      const data = taskSnap.data();
      return {
        id: taskSnap.id,
        ...data,
        // Timestamp型をDate型に変換
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('タスク詳細取得エラー:', error);
    throw error;
  }
};

/**
 * タスクを更新する
 * @param {string} taskId - タスクID
 * @param {Object} taskData - 更新するタスクデータ
 * @returns {Promise<void>}
 */
export const updateTask = async (taskId, taskData) => {
  try {
    const taskRef = doc(db, COLLECTIONS.TASKS, taskId);
    await updateDoc(taskRef, {
      ...taskData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('タスク更新エラー:', error);
    throw error;
  }
};

/**
 * タスク完了状態を切り替える
 * @param {string} taskId - タスクID
 * @param {boolean} completed - 完了状態
 * @returns {Promise<void>}
 */
export const toggleTaskCompletion = async (taskId, completed) => {
  try {
    const taskRef = doc(db, COLLECTIONS.TASKS, taskId);
    await updateDoc(taskRef, {
      completed,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('タスク状態更新エラー:', error);
    throw error;
  }
};

/**
 * タスクを削除する
 * @param {string} taskId - タスクID
 * @returns {Promise<void>}
 */
export const deleteTask = async (taskId) => {
  try {
    const taskRef = doc(db, COLLECTIONS.TASKS, taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error('タスク削除エラー:', error);
    throw error;
  }
};