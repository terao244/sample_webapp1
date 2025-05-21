// Firestoreサービスをエクスポート
import * as taskService from './taskService';
import * as profileService from './profileService';
import { COLLECTIONS } from './models';

export {
  taskService,
  profileService,
  COLLECTIONS,
};