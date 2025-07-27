// src/utils/uuid.ts
import { v4 as uuidv4 } from 'uuid';

const UUID_KEY = 'user_uuid';

export const getOrCreateUUID = (): string => {
  const existing = sessionStorage.getItem(UUID_KEY);
  if (existing) return existing;

  const newId = uuidv4();
  sessionStorage.setItem(UUID_KEY, newId);
  return newId;
};

export const resetUUID = (): void => {
  sessionStorage.removeItem(UUID_KEY);
};
