// Firestoreデータモデル定義

/**
 * タスクモデル
 * @typedef {Object} Task
 * @property {string} id - タスクID
 * @property {string} title - タスクタイトル
 * @property {string} description - タスク詳細
 * @property {boolean} completed - 完了状態
 * @property {Date} createdAt - 作成日時
 * @property {Date} updatedAt - 更新日時
 * @property {string} userId - 所有ユーザーID
 */

/**
 * プロフィールモデル
 * @typedef {Object} Profile
 * @property {string} id - プロフィールID (ユーザーIDと同一)
 * @property {string} displayName - 表示名
 * @property {string} photoURL - プロフィール画像URL
 * @property {string} bio - 自己紹介
 * @property {Date} createdAt - 作成日時
 * @property {Date} updatedAt - 更新日時
 */

// コレクション名の定数
export const COLLECTIONS = {
  TASKS: 'tasks',
  PROFILES: 'profiles',
};

export default {
  COLLECTIONS,
};