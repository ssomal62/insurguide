/**
 * 클립보드 복사 결과 타입
 */
export interface ClipboardResult {
  success: boolean;
  error?: string;
  method: 'modern' | 'legacy' | 'fallback';
}

/**
 * 텍스트를 클립보드에 복사합니다.
 * 최신 Clipboard API를 우선 사용하고, 지원하지 않는 경우 legacy 방식을 사용합니다.
 */
export const copyToClipboard = async (text: string): Promise<ClipboardResult> => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true, method: 'modern' };
    } catch (error) {
      console.warn('Modern clipboard API failed:', error);
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      return { success: true, method: 'legacy' };
    }
  } catch (error) {
    console.warn('Legacy clipboard method failed:', error);
  }

  return {
    success: false,
    method: 'fallback',
    error: '클립보드 복사를 지원하지 않는 환경입니다. 텍스트를 수동으로 선택하여 복사해주세요.'
  };
};

/**
 * 복사 성공시 사용자 피드백 메시지를 반환합니다.
 */
export const getCopyFeedbackMessage = (result: ClipboardResult): string => {
  return result.success
    ? '프롬프트가 클립보드에 복사되었습니다!'
    : result.error || '복사에 실패했습니다. 다시 시도해주세요.';
};
