export interface ShareResult {
  success: boolean;
  method: 'native' | 'clipboard' | 'fallback';
  error?: string;
}

export interface ShareData {
  title: string;
  text: string;
  url?: string;
}

// 🔥 더 엄격한 네이티브 공유 지원 체크
export const isNativeShareSupported = (): boolean => {
  return !!(
    typeof navigator.share === 'function' && 
    window.isSecureContext && // HTTPS 체크
    'ontouchstart' in window // 터치 디바이스 체크 (모바일)
  );
};

// 🔥 공유 데이터 유효성 검증
export const canShareData = (data: ShareData): boolean => {
  if (typeof navigator.canShare !== 'function') return true; // canShare가 없으면 기본 허용
  
  try {
    return navigator.canShare(data);
  } catch (error) {
    console.warn('canShare 체크 실패:', error);
    return false;
  }
};

export const shareNative = async (data: ShareData): Promise<ShareResult> => {
  console.log('🔥 네이티브 공유 시도:', {
    hasShare: typeof navigator.share === 'function',
    isSecure: window.isSecureContext,
    userAgent: navigator.userAgent,
    data
  });

  if (!isNativeShareSupported()) {
    return {
      success: false,
      method: 'native',
      error: '네이티브 공유를 지원하지 않습니다.'
    };
  }

  // 🔥 데이터 유효성 검증
  if (!canShareData(data)) {
    console.warn('🔥 공유 데이터 유효성 검증 실패');
    return {
      success: false,
      method: 'native',
      error: '공유할 수 없는 데이터입니다.'
    };
  }

  try {
    console.log('🔥 navigator.share() 호출 시작...');
    await navigator.share(data);
    console.log('✅ 네이티브 공유 성공!');
    
    return { success: true, method: 'native' };
    
  } catch (error) {
    console.error('💥 네이티브 공유 실패:', error);
    
    if (error instanceof Error) {
      // 사용자 취소
      if (error.name === 'AbortError') {
        return {
          success: false,
          method: 'native',
          error: '공유가 취소되었습니다.'
        };
      }
      
      // 권한 오류
      if (error.name === 'NotAllowedError') {
        return {
          success: false,
          method: 'native',
          error: '공유 권한이 없습니다.'
        };
      }
      
      // 기타 오류
      return {
        success: false,
        method: 'native',
        error: `공유 오류: ${error.message}`
      };
    }

    return {
      success: false,
      method: 'native',
      error: '알 수 없는 공유 오류'
    };
  }
};

// 🔥 클립보드 복사 (fallback)
export const shareViaClipboard = async (data: ShareData): Promise<ShareResult> => {
  const shareText = data.url 
    ? `${data.title}\n${data.text}\n${data.url}`
    : `${data.title}\n${data.text}`;

  console.log('🔥 클립보드 복사 시도:', shareText);

  // 1순위: Clipboard API
  if (typeof navigator.clipboard?.writeText === 'function' && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(shareText);
      console.log('✅ Clipboard API 성공');
      return { success: true, method: 'clipboard' };
    } catch (error) {
      console.warn('🔥 Clipboard API 실패:', error);
    }
  }

  // 2순위: execCommand
  try {
    const textArea = document.createElement('textarea');
    textArea.value = shareText;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      console.log('✅ execCommand 성공');
      return { success: true, method: 'clipboard' };
    }
  } catch (error) {
    console.warn('🔥 execCommand 실패:', error);
  }

  return {
    success: false,
    method: 'fallback',
    error: '클립보드 복사에 실패했습니다.'
  };
};

// 🔥 통합 공유 함수
export const share = async (data: ShareData): Promise<ShareResult> => {
  console.log('🔥 공유 시작:', data);
  
  // 1순위: 네이티브 공유 (모바일에서만)
  if (isNativeShareSupported()) {
    console.log('🔥 네이티브 공유 시도...');
    const nativeResult = await shareNative(data);
    
    if (nativeResult.success) {
      return nativeResult;
    }
    
    console.log('🔥 네이티브 공유 실패, 클립보드로 fallback:', nativeResult.error);
  } else {
    console.log('🔥 네이티브 공유 지원 안함, 클립보드로 진행');
  }

  // 2순위: 클립보드 복사
  return shareViaClipboard(data);
};

// 🔥 게임 결과용 공유 데이터 생성
export const createGameShareData = (shareUrl: string): ShareData => {
  return {
    title: "마이리틀 보험팝 결과",
    text: "이거 나랑 비슷한지 해봐!",
    url: shareUrl
  };
};