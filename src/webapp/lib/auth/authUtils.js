// 認証関連のユーティリティ関数
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { auth } from '../../firebase/config';

// メールとパスワードでユーザー登録
export const registerWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // ユーザープロフィールの更新
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// メールとパスワードでログイン
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Googleでログイン
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// ログアウト
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// パスワードリセットメールの送信
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 現在のユーザーを取得
export const getCurrentUser = () => {
  return auth.currentUser;
};

// ユーザープロフィールの更新
export const updateUserProfile = async (displayName, photoURL = null) => {
  try {
    const user = auth.currentUser;
    if (!user) return { success: false, error: 'ユーザーがログインしていません' };

    const profileData = {};
    if (displayName) profileData.displayName = displayName;
    if (photoURL) profileData.photoURL = photoURL;

    await updateProfile(user, profileData);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ユーザーメールアドレスの更新
export const updateUserEmail = async (newEmail, currentPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) return { success: false, error: 'ユーザーがログインしていません' };
    
    // 再認証が必要
    if (currentPassword) {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
    }
    
    await updateEmail(user, newEmail);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ユーザーパスワードの更新
export const updateUserPassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) return { success: false, error: 'ユーザーがログインしていません' };
    
    // 再認証が必要
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    await updatePassword(user, newPassword);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};