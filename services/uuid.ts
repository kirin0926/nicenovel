import uuid from 'react-native-uuid';
import { storage } from '../lib/storage-adapter';
import { supabase } from '../lib/supabase';

const UUID_STORAGE_KEY = 'app_user_uuid';

export async function getOrCreateUUID(): Promise<string> {
  // 尝试从存储中获取已存在的 UUID
  const existingUUID = await storage.getItem(UUID_STORAGE_KEY);
  
  if (existingUUID) {
    return existingUUID;
  }

  // 如果不存在，则生成新的 UUID 并存储
  const newUUID = uuid.v4() as string;
  
  
  // Store the UUID in Supabase users table
  const { error } = await supabase
    .from('user')
    .insert([
      { uuid: newUUID }
    ]);

  if (error) {
    console.error('Error storing UUID in Supabase:', error);
  }
  await storage.setItem(UUID_STORAGE_KEY, newUUID);

  return newUUID;
}