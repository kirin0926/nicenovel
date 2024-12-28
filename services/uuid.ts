import uuid from 'react-native-uuid';
import { storage } from '../lib/storage-adapter';

const UUID_STORAGE_KEY = 'app_user_uuid';

export async function getOrCreateUUID(): Promise<string> {
  // 尝试从存储中获取已存在的 UUID
  const existingUUID = await storage.getItem(UUID_STORAGE_KEY);
  
  if (existingUUID) {
    return existingUUID;
  }

  // 如果不存在，则生成新的 UUID 并存储
  const newUUID = uuid.v4() as string;
  await storage.setItem(UUID_STORAGE_KEY, newUUID);
  
  return newUUID;
}