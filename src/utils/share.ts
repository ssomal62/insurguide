import { copyToClipboard, ClipboardResult } from './clipboard';

/**
 * 공유 결과 타입
 */
export interface ShareResult {
  success: boolean;
  method: 'native' | 'clipboard' | 'fallback';
  error?: string;
}

/**
 * 공유 데이터 인터페이스
 */
export interface ShareData {
  title: string;
  text: string;
  url?: string;
}

/**
 * 네이티브 Web Share API가 지원되는지 확인합니다.
 */
export const isNativeShareSupported = (): boolean => {
  return !!(navigator.share);
};

/**
 * 네이티브 공유 기능을 사용합니다.
 * 모바일 환경에서 시스템 공유 메뉴를 호출합니다.
 */
export const shareNative = async (data: ShareData): Promise<ShareResult> => {
  if (!isNativeShareSupported()) {
    return {
      success: false,
      method: 'native',
      error: '네이티브 공유 기능을 지원하지 않습니다.'
    };
  }

  try {
    // canShare로 데이터 유효성 검증 (지원하는 경우만)
    if (navigator.canShare && !navigator.canShare(data)) {
      return {
        success: false,
        method: 'native',
        error: '공유할 수 없는 데이터 형식입니다.'
      };
    }

    await navigator.share(data);
    return { success: true, method: 'native' };
  } catch (error) {
    // 사용자가 공유를 취소한 경우 (AbortError)
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        method: 'native',
        error: '공유가 취소되었습니다.'
      };
    }

    return {
      success: false,
      method: 'native',
      error: '공유 중 오류가 발생했습니다.'
    };
  }
};

/**
 * URL을 클립보드에 복사하는 방식으로 공유합니다.
 */
export const shareViaClipboard = async (data: ShareData): Promise<ShareResult> => {
  const shareText = data.url 
    ? `${data.title}\n${data.text}\n${data.url}`
    : `${data.title}\n${data.text}`;

  const clipboardResult: ClipboardResult = await copyToClipboard(shareText);
  
  return {
    success: clipboardResult.success,
    method: 'clipboard',
    error: clipboardResult.error
  };
};

/**
 * 통합 공유 함수
 * 네이티브 공유를 우선 시도하고, 실패시 클립보드 복사로 fallback
 */
export const share = async (data: ShareData): Promise<ShareResult> => {
  // 1. 네이티브 공유 시도 (모바일 환경)
  if (isNativeShareSupported()) {
    const nativeResult = await shareNative(data);
    if (nativeResult.success) {
      return nativeResult;
    }
    // 네이티브 공유 실패시 클립보드로 fallback
    console.warn('Native share failed, falling back to clipboard');
  }

  // 2. 클립보드 복사로 fallback
  return shareViaClipboard(data);
};

/**
 * 게임 결과 공유용 데이터를 생성합니다.
 */
export const createGameShareData = (resultType: string, gameId: string): ShareData => {
  const baseUrl = window.location.origin;
  const gameUrl = `${baseUrl}?shared=${gameId}`;
  
  return {
    title: '🏥 InsurGuide - 나의 보험 성향 테스트 결과',
    text: `나는 "${resultType}" 타입! 당신의 보험 성향은 무엇인가요?`,
    url: gameUrl
  };
};

/**
 * SNS별 공유 URL을 생성합니다. (선택적 기능)
 */
export const createSNSShareUrls = (data: ShareData) => {
  const encodedText = encodeURIComponent(`${data.title} ${data.text}`);
  const encodedUrl = encodeURIComponent(data.url || window.location.href);
  
  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    kakao: `https://story.kakao.com/share?url=${encodedUrl}&text=${encodedText}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`
  };
};

/**
 * 공유 결과에 대한 사용자 피드백 메시지를 생성합니다.
 */
export const getShareFeedbackMessage = (result: ShareResult): string => {
  if (result.success) {
    switch (result.method) {
      case 'native':
        return '공유가 완료되었습니다!';
      case 'clipboard':
        return '링크가 클립보드에 복사되었습니다!';
      default:
        return '공유가 완료되었습니다!';
    }
  }
  
  return result.error || '공유에 실패했습니다. 다시 시도해주세요.';
};