import { useCallback } from "react";
import { logEvent } from "firebase/analytics";
import { analytics, isFirebaseConfigured } from "@/config/firebase";
import { logEvent as firebaseLogEvent } from "firebase/analytics";

import {
  GameStartEvent,
  OptionSelectedEvent,
  ResultViewedEvent,
  PromptCopiedEvent,
  ShareClickedEvent,
  ReplayGameEvent,
  ExitMidGameEvent,
  CardFlipEvent,
  PagePerformanceEvent,
} from "@/types/firebase";

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
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        result[key] = value;
      } else if (Array.isArray(value)) {
        result[key] = value.join(",");
      } else if (value != null) {
        result[key] = String(value);
      }
    }

    return result;
  };

  /**
   * 안전한 이벤트 로깅 (Firebase 미설정 시 콘솔 로그만)
   */
  const safeLogEvent = useCallback(
    <T extends object>(eventName: string, parameters: T) => {
      try {
        const cleanedParams = convertToFirebaseParams(
          parameters as Record<string, any>
        );

        if (isFirebaseConfigured() && analytics) {
          logEvent(analytics, eventName, cleanedParams);
          console.log(`🔥 Firebase Event: ${eventName}`, cleanedParams);
        } else {
          console.log(
            `📊 Analytics Event (not sent): ${eventName}`,
            cleanedParams
          );
        }
      } catch (error) {
        console.error("Firebase 이벤트 로깅 실패:", error);
      }
    },
    []
  );

  const logGameStart = useCallback(
    (data: Omit<GameStartEvent, "timestamp">) => {
      safeLogEvent("game_start", {
        ...data,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      });
    },
    [safeLogEvent]
  );

  const logOptionSelected = useCallback(
    (data: Omit<OptionSelectedEvent, "timestamp">) => {
      safeLogEvent("option_selected", {
        ...data,
        timestamp: Date.now(),
      });
    },
    [safeLogEvent]
  );

  const logResultViewed = useCallback(
    (data: Omit<ResultViewedEvent, "timestamp">) => {
      safeLogEvent("result_viewed", {
        ...data,
        timestamp: Date.now(),
      });
    },
    [safeLogEvent]
  );

  const logPromptCopied = useCallback(
    (data: Omit<PromptCopiedEvent, "timestamp">) => {
      safeLogEvent("prompt_copied", {
        ...data,
        timestamp: Date.now(),
      });
    },
    [safeLogEvent]
  );

  const logShareClicked = useCallback(
    (data: Omit<ShareClickedEvent, "timestamp">) => {
      safeLogEvent("share_clicked", {
        ...data,
        timestamp: Date.now(),
      });
    },
    [safeLogEvent]
  );

  const logReplayGame = useCallback(
    (data: Omit<ReplayGameEvent, "timestamp">) => {
      safeLogEvent("replay_game", {
        ...data,
        timestamp: Date.now(),
      });
    },
    [safeLogEvent]
  );

  const logExitMidGame = useCallback(
    (data: Omit<ExitMidGameEvent, "timestamp">) => {
      safeLogEvent("exit_mid_game", {
        ...data,
        timestamp: Date.now(),
      });
    },
    [safeLogEvent]
  );

  const logCardFlip = useCallback(
    (data: Omit<CardFlipEvent, "timestamp">) => {
      safeLogEvent("card_flip", {
        ...data,
        timestamp: Date.now(),
      });
    },
    [safeLogEvent]
  );

  const logPagePerformance = useCallback(
    (data: Omit<PagePerformanceEvent, "timestamp">) => {
      safeLogEvent("page_performance", {
        ...data,
        timestamp: Date.now(),
      });
    },
    [safeLogEvent]
  );

  const logPageLoad = useCallback(
    (pageName: "start" | "game" | "result") => {
      const loadTime = performance.now();
      logPagePerformance({
        page: pageName,
        loadTime: Math.round(loadTime),
      });
    },
    [logPagePerformance]
  );

  const setupExitDetection = useCallback(
    (uuid: string, currentRound: number, gameStartTime: number) => {
      const handleBeforeUnload = () => {
        const timeSpent = (Date.now() - gameStartTime) / 1000;
        logExitMidGame({
          uuid,
          lastSeenRound: currentRound,
          timeSpent: Math.round(timeSpent),
          exitMethod: "close",
        });
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    },
    [logExitMidGame]
  );

  // 공유된 결과 조회 이벤트
  const logSharedResultViewed = (params: {
    shareId: string;
    viewerUuid: string;
    originalCreatorUuid?: string;
    choiceCount?: number;
    action?: string;
  }) => {
    if (analytics) {
      // 🔥 analytics 체크 추가
      firebaseLogEvent(analytics, "shared_result_viewed", {
        // 🔥 올바른 호출 방식
        share_id: params.shareId,
        viewer_uuid: params.viewerUuid,
        original_creator_uuid: params.originalCreatorUuid || "",
        choice_count: params.choiceCount || 0,
        action: params.action || "view",
        timestamp: Date.now(),
      });
    }
  };

  // 공유 URL 생성 성공/실패 이벤트
  const logShareUrlGenerated = (params: {
    uuid: string;
    shareId: string;
    success: boolean;
    error?: string;
  }) => {
    if (analytics) {
      // 🔥 analytics 체크 추가
      firebaseLogEvent(analytics, "share_url_generated", {
        // 🔥 올바른 호출 방식
        uuid: params.uuid,
        share_id: params.shareId,
        success: params.success,
        error: params.error || "",
        timestamp: Date.now(),
      });
    }
  };

  // 공유된 결과에서 게임 시작 이벤트
  const logPlayFromShared = (params: {
    referrerShareId: string;
    newPlayerUuid: string;
  }) => {
    if (analytics) {
      // 🔥 analytics 체크 추가
      firebaseLogEvent(analytics, "play_from_shared", {
        // 🔥 올바른 호출 방식
        referrer_share_id: params.referrerShareId,
        new_player_uuid: params.newPlayerUuid,
        timestamp: Date.now(),
      });
    }
  };

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
    logSharedResultViewed,
    logShareUrlGenerated,
    logPlayFromShared,
    isConfigured: isFirebaseConfigured(),
  };
};
