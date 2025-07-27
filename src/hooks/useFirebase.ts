import { useCallback } from 'react';
import { logEvent } from 'firebase/analytics';
import { analytics, isFirebaseConfigured } from '@/config/firebase';
import { 
  GameStartEvent, 
  OptionSelectedEvent, 
  ResultViewedEvent,
  PromptCopiedEvent,
  ShareClickedEvent,
  ReplayGameEvent,
  ExitMidGameEvent,
  CardFlipEvent,
  PagePerformanceEvent 
} from '@/types/firebase';

/**
 * Firebase Analytics 이벤트 로깅을 위한 커스텀 훅
 */
export const useFirebase = () => {

  /**
   * Firebase 파라미터 형식으로 변환
   */
  const convertToFirebaseParams = (obj: Record<string, any>) => {
    const result: Record<string, string | number | boolean> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        result[key] = value;
      } else if (Array.isArray(value)) {
        result[key] = value.join(',');
      } else if (value != null) {
        result[key] = String(value);
      }
    }

    return result;
  };

  /**
   * 안전한 이벤트 로깅 (Firebase 미설정 시 콘솔 로그만)
   */
  const safeLogEvent = useCallback(<T extends object>(eventName: string, parameters: T) => {
    try {
      const cleanedParams = convertToFirebaseParams(parameters as Record<string, any>);

      if (isFirebaseConfigured() && analytics) {
        logEvent(analytics, eventName, cleanedParams);
        console.log(`🔥 Firebase Event: ${eventName}`, cleanedParams);
      } else {
        console.log(`📊 Analytics Event (not sent): ${eventName}`, cleanedParams);
      }
    } catch (error) {
      console.error('Firebase 이벤트 로깅 실패:', error);
    }
  }, []);

  const logGameStart = useCallback((data: Omit<GameStartEvent, 'timestamp'>) => {
    safeLogEvent('game_start', {
      ...data,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    });
  }, [safeLogEvent]);

  const logOptionSelected = useCallback((data: Omit<OptionSelectedEvent, 'timestamp'>) => {
    safeLogEvent('option_selected', {
      ...data,
      timestamp: Date.now(),
    });
  }, [safeLogEvent]);

  const logResultViewed = useCallback((data: Omit<ResultViewedEvent, 'timestamp'>) => {
    safeLogEvent('result_viewed', {
      ...data,
      timestamp: Date.now(),
    });
  }, [safeLogEvent]);

  const logPromptCopied = useCallback((data: Omit<PromptCopiedEvent, 'timestamp'>) => {
    safeLogEvent('prompt_copied', {
      ...data,
      timestamp: Date.now(),
    });
  }, [safeLogEvent]);

  const logShareClicked = useCallback((data: Omit<ShareClickedEvent, 'timestamp'>) => {
    safeLogEvent('share_clicked', {
      ...data,
      timestamp: Date.now(),
    });
  }, [safeLogEvent]);

  const logReplayGame = useCallback((data: Omit<ReplayGameEvent, 'timestamp'>) => {
    safeLogEvent('replay_game', {
      ...data,
      timestamp: Date.now(),
    });
  }, [safeLogEvent]);

  const logExitMidGame = useCallback((data: Omit<ExitMidGameEvent, 'timestamp'>) => {
    safeLogEvent('exit_mid_game', {
      ...data,
      timestamp: Date.now(),
    });
  }, [safeLogEvent]);

  const logCardFlip = useCallback((data: Omit<CardFlipEvent, 'timestamp'>) => {
    safeLogEvent('card_flip', {
      ...data,
      timestamp: Date.now(),
    });
  }, [safeLogEvent]);

  const logPagePerformance = useCallback((data: Omit<PagePerformanceEvent, 'timestamp'>) => {
    safeLogEvent('page_performance', {
      ...data,
      timestamp: Date.now(),
    });
  }, [safeLogEvent]);

  const logPageLoad = useCallback((pageName: 'start' | 'game' | 'result') => {
    const loadTime = performance.now();
    logPagePerformance({
      page: pageName,
      loadTime: Math.round(loadTime),
    });
  }, [logPagePerformance]);
  

  const setupExitDetection = useCallback((uuid: string, currentRound: number, gameStartTime: number) => {
    const handleBeforeUnload = () => {
      const timeSpent = (Date.now() - gameStartTime) / 1000;
      logExitMidGame({
        uuid,
        lastSeenRound: currentRound,
        timeSpent: Math.round(timeSpent),
        exitMethod: 'close',
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [logExitMidGame]);

  return {
    logGameStart,
    logOptionSelected,
    logResultViewed,
    logPromptCopied,
    logShareClicked,
    logReplayGame,
    logExitMidGame,
    logCardFlip,
    logPagePerformance,
    logPageLoad,
    setupExitDetection,
    isConfigured: isFirebaseConfigured(),
  };
};
