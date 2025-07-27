import { useState, useEffect, useCallback } from 'react';
import { StoredGameData } from '@/types/game';

/**
 * 로컬스토리지 훅의 반환 타입
 */
interface UseLocalStorageReturn<T> {
  value: T | null;
  setValue: (value: T) => void;
  removeValue: () => void;
  isLoading: boolean;
  error: string | null;
}

/**
 * 로컬스토리지와 연동된 상태를 관리하는 커스텀 훅
 */
export const useLocalStorage = <T>(
  key: string,
  defaultValue?: T
): UseLocalStorageReturn<T> => {
  const [value, setValueState] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 로컬스토리지에서 값 읽기
  const readValue = useCallback((): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      setError('로컬스토리지에서 데이터를 읽는 중 오류가 발생했습니다.');
      return defaultValue || null;
    }
  }, [key, defaultValue]);

  // 로컬스토리지에 값 저장
  const setValue = useCallback((newValue: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(newValue));
      setValueState(newValue);
      setError(null);
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
      setError('로컬스토리지에 데이터를 저장하는 중 오류가 발생했습니다.');
    }
  }, [key]);

  // 로컬스토리지에서 값 제거
  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setValueState(null);
      setError(null);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
      setError('로컬스토리지에서 데이터를 삭제하는 중 오류가 발생했습니다.');
    }
  }, [key]);

  // 초기 로드
  useEffect(() => {
    const initialValue = readValue();
    setValueState(initialValue);
    setIsLoading(false);
  }, [readValue]);

  // 다른 탭에서 값이 변경되었을 때 동기화
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : null;
          setValueState(newValue);
        } catch (error) {
          console.warn('Error parsing storage event value:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return {
    value,
    setValue,
    removeValue,
    isLoading,
    error
  };
};

/**
 * 게임 데이터 전용 로컬스토리지 훅
 */
export const useGameStorage = () => {
  const GAME_DATA_KEY = 'insurguide_game_data';
  const SESSION_ID_KEY = 'insurguide_session_id';
  
  const gameStorage = useLocalStorage<StoredGameData>(GAME_DATA_KEY);
  const sessionStorage = useLocalStorage<string>(SESSION_ID_KEY);

  // 게임 데이터 저장
  const saveGameData = useCallback((gameData: StoredGameData) => {
    const dataWithTimestamp = {
      ...gameData,
      lastUpdated: Date.now()
    };
    gameStorage.setValue(dataWithTimestamp);
  }, [gameStorage]);

  // 게임 데이터 불러오기 (유효성 검증 포함)
  const loadGameData = useCallback((): StoredGameData | null => {
    const data = gameStorage.value;
    
    if (!data) return null;
    
    // 24시간 이후 데이터는 만료로 처리
    const EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24시간
    const isExpired = Date.now() - data.lastUpdated > EXPIRY_TIME;
    
    if (isExpired) {
      console.log('Game data expired, clearing...');
      gameStorage.removeValue();
      return null;
    }
    
    return data;
  }, [gameStorage]);

  // 세션 ID 저장/불러오기
  const saveSessionId = useCallback((sessionId: string) => {
    sessionStorage.setValue(sessionId);
  }, [sessionStorage]);

  const getSessionId = useCallback((): string | null => {
    return sessionStorage.value;
  }, [sessionStorage]);

  // 모든 게임 관련 데이터 삭제
  const clearAllGameData = useCallback(() => {
    gameStorage.removeValue();
    // 세션 ID는 유지 (같은 브라우저 세션 추적용)
  }, [gameStorage]);

  // 세션 포함 모든 데이터 삭제
  const clearAllData = useCallback(() => {
    gameStorage.removeValue();
    sessionStorage.removeValue();
  }, [gameStorage, sessionStorage]);

  return {
    // 게임 데이터 관리
    gameData: gameStorage.value,
    saveGameData,
    loadGameData,
    
    // 세션 ID 관리
    sessionId: sessionStorage.value,
    saveSessionId,
    getSessionId,
    
    // 삭제 함수들
    clearAllGameData,
    clearAllData,
    
    // 상태 정보
    isLoading: gameStorage.isLoading || sessionStorage.isLoading,
    error: gameStorage.error || sessionStorage.error
  };
};

/**
 * 사용자 설정 전용 로컬스토리지 훅 (선택적)
 */
export const useUserSettings = () => {
  interface UserSettings {
    soundEnabled: boolean;
    animationEnabled: boolean;
    theme: 'light' | 'dark' | 'auto';
    lastVisit: number;
  }

  const defaultSettings: UserSettings = {
    soundEnabled: true,
    animationEnabled: true,
    theme: 'auto',
    lastVisit: Date.now()
  };

  const settings = useLocalStorage<UserSettings>('insurguide_settings', defaultSettings);

  const updateSetting = useCallback(<K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    if (settings.value) {
      settings.setValue({
        ...settings.value,
        [key]: value
      });
    }
  }, [settings]);

  return {
    settings: settings.value || defaultSettings,
    updateSetting,
    resetSettings: () => settings.setValue(defaultSettings),
    isLoading: settings.isLoading,
    error: settings.error
  };
};