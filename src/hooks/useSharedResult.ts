import { useState } from 'react';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { GameChoice } from './useGame';
import { SharedResultData, SharedResultResponse, ShareUrlResponse } from '@/types/sharedResult';
import { generateUniqueShareId, generateShareUrl } from '@/utils/shareUtils';

export const useSharedResult = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 게임 결과를 Firestore에 저장하고 공유 URL 생성
  const saveAndShareResult = async (
    userChoices: GameChoice[],
    prompt: string,
    creatorUuid: string
  ): Promise<ShareUrlResponse> => {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // 고유한 공유 ID 생성
      const shareId = await generateUniqueShareId();
      if (!shareId) {
        throw new Error('공유 ID 생성에 실패했습니다.');
      }

      // Firestore에 저장할 데이터 준비
      const sharedData: SharedResultData = {
        id: shareId,
        userChoices,
        prompt,
        createdAt: new Date(),
        viewCount: 0,
        creatorUuid
      };

      // Firestore에 저장
      await setDoc(doc(db, 'sharedResults', shareId), sharedData);

      // 공유 URL 생성
      const shareUrl = generateShareUrl(shareId);

      setIsLoading(false);
      return {
        success: true,
        shareId,
        shareUrl
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      setIsLoading(false);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  // 공유된 결과 조회 (조회수 증가 포함)
  const loadSharedResult = async (shareId: string): Promise<SharedResultResponse> => {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const docRef = doc(db, 'sharedResults', shareId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setIsLoading(false);
        return {
          success: false,
          error: '공유된 결과를 찾을 수 없습니다.'
        };
      }

      const data = docSnap.data() as SharedResultData;

      // 조회수 증가 (비동기로 처리하여 사용자 경험에 영향 없음)
      updateDoc(docRef, {
        viewCount: increment(1)
      }).catch(error => {
        console.warn('조회수 업데이트 실패:', error);
      });

      setIsLoading(false);
      return {
        success: true,
        data
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '결과 조회 중 오류가 발생했습니다.';
      setError(errorMessage);
      setIsLoading(false);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  return {
    saveAndShareResult,
    loadSharedResult,
    isLoading,
    error
  };
};