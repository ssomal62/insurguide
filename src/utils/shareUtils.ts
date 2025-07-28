import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

// 6자리 공유 ID 생성 (대문자 + 숫자)
export const generateShareId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 공유 ID 중복 확인
export const isShareIdUnique = async (shareId: string): Promise<boolean> => {
  if (!db) return false;
  
  try {
    const docRef = doc(db, 'sharedResults', shareId);
    const docSnap = await getDoc(docRef);
    return !docSnap.exists();
  } catch (error) {
    console.error('공유 ID 중복 확인 실패:', error);
    return false;
  }
};

// 고유한 공유 ID 생성 (최대 10번 시도)
export const generateUniqueShareId = async (): Promise<string | null> => {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const shareId = generateShareId();
    const isUnique = await isShareIdUnique(shareId);
    
    if (isUnique) {
      return shareId;
    }
    
    attempts++;
  }
  
  console.error('고유한 공유 ID 생성 실패: 최대 시도 횟수 초과');
  return null;
};

// 공유 URL 생성
export const generateShareUrl = (shareId: string): string => {
  return `${window.location.origin}/shared/${shareId}`;
};