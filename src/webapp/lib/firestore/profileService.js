// プロフィール関連のFirestore操作
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { COLLECTIONS } from './models';

/**
 * ユーザープロフィールを取得する
 * @param {string} userId - ユーザーID
 * @returns {Promise<Object|null>} プロフィールデータ
 */
export const getProfile = async (userId) => {
  try {
    const profileRef = doc(db, COLLECTIONS.PROFILES, userId);
    const profileSnap = await getDoc(profileRef);
    
    if (profileSnap.exists()) {
      const data = profileSnap.data();
      return {
        id: profileSnap.id,
        ...data,
        // Timestamp型をDate型に変換
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('プロフィール取得エラー:', error);
    throw error;
  }
};

/**
 * ユーザー登録時にプロフィールを初期化する
 * @param {string} userId - ユーザーID
 * @param {string} displayName - 表示名
 * @param {string} photoURL - プロフィール画像URL
 * @returns {Promise<void>}
 */
export const createProfile = async (userId, displayName = '', photoURL = '') => {
  try {
    const profileRef = doc(db, COLLECTIONS.PROFILES, userId);
    const newProfile = {
      displayName,
      photoURL,
      bio: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    await setDoc(profileRef, newProfile);
  } catch (error) {
    console.error('プロフィール作成エラー:', error);
    throw error;
  }
};

/**
 * プロフィールを更新する
 * @param {string} userId - ユーザーID
 * @param {Object} profileData - プロフィールデータ
 * @returns {Promise<void>}
 */
export const updateProfile = async (userId, profileData) => {
  try {
    const profileRef = doc(db, COLLECTIONS.PROFILES, userId);
    await updateDoc(profileRef, {
      ...profileData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('プロフィール更新エラー:', error);
    throw error;
  }
};