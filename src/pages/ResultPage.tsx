import { CommonButton } from "@/components/common/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GameChoice } from "@/hooks/useGame";
import { copyToClipboard, getCopyFeedbackMessage } from "@/utils/clipboard";
import { usePromptGeneration } from "@/hooks/usePromptGeneration";
import { convertGameChoicesToRoundResults } from "@/utils/convertGameChoice";
import { partnerChoices } from "@/data/partnerChoices";

import { useFirebase } from "@/hooks/useFirebase";
import { getOrCreateUUID, resetUUID } from "@/utils/uuid";
import { useSharedResult } from "@/hooks/useSharedResult";

import ChoiceListCard from "@/components/result/ChoiceListCard";
import ScrollPageLayout from "@/components/layout/ScrollPageLayout";
import CopyToast from "@/components/common/CopyToast"; // 🔥 추가
import { responsiveImage, responsiveText } from "@/styles/responsive";

const ResultPage = () => {
  const navigate = useNavigate();
  const [userChoices, setUserChoices] = useState<GameChoice[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isSharing, setIsSharing] = useState(false);
  const [showToast, setShowToast] = useState(false); // 🔥 토스트 상태 추가
  const [toastMessage, setToastMessage] = useState(""); // 🔥 토스트 메시지 추가

  const { generateBasicPrompt } = usePromptGeneration();
  const { saveAndShareResult } = useSharedResult();
  const {
    logResultViewed,
    logPromptCopied,
    logShareClicked,
    logReplayGame,
    logPagePerformance,
  } = useFirebase();

  const uuid = getOrCreateUUID();

  useEffect(() => {
    const loadTime = Math.round(performance.now());
    logPagePerformance({ page: "result", loadTime });
  }, []);

  // [🔥 Firebase] 게임 결과 보기 이벤트 전송
  useEffect(() => {
    const stored = sessionStorage.getItem("userChoices");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserChoices(parsed);

      const totalGameTime =
        (Date.now() -
          parseInt(
            sessionStorage.getItem("gameStartTime") || `${Date.now()}`,
            10
          )) /
        1000;
      const selectedCategories = parsed.map((c: GameChoice) =>
        c.selected === "left" ? c.left.category : c.right.category
      );

      logResultViewed({
        uuid,
        roundCount: parsed.length,
        totalGameTime: Math.round(totalGameTime),
        selectedCategories,
      });
    }
  }, []);

  const roundResults = convertGameChoicesToRoundResults(userChoices);
  const { prompt } = generateBasicPrompt(roundResults);

  // [🔥 Firestore] 공유 URL 생성
  useEffect(() => {
    const createShareUrl = async () => {
      if (userChoices.length === 0 || shareUrl) return;

      try {
        const result = await saveAndShareResult(userChoices, prompt, uuid);
        if (result.success && result.shareUrl) {
          setShareUrl(result.shareUrl);
        }
      } catch (error) {
        console.error('공유 URL 생성 실패:', error);
      }
    };

    createShareUrl();
  }, [userChoices, prompt, uuid, shareUrl]);

  // 🔥 토스트 표시 함수
  const showCopyToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  // 🔥 토스트 닫기 함수
  const handleToastClose = () => {
    setShowToast(false);
    setToastMessage("");
  };

  // [🔥 Firebase] 프롬프트 복사
  const handleCopy = async () => {
    const result = await copyToClipboard(prompt);
    if (result.success) {
      logPromptCopied({
        uuid,
        copied: true,
        promptLength: prompt.length,
      });

      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    } else {
      alert(getCopyFeedbackMessage(result));
    }
  };

const handleShare = async () => {
  console.log('🔥 handleShare 시작');
  console.log('shareUrl:', shareUrl);
  
  if (!shareUrl) {
    alert("공유 링크를 생성하는 중입니다. 잠시 후 다시 시도해주세요.");
    return;
  }

  setIsSharing(true);
  console.log('🔥 공유 시작...');

  try {
    // 🔥 1순위: 네이티브 공유 API
    console.log('🔥 네이티브 공유 체크:', {
      'navigator.share': !!navigator.share,
      'window.isSecureContext': window.isSecureContext
    });
    
    if (navigator.share && window.isSecureContext) {
      console.log('🔥 네이티브 공유 시도...');
      await navigator.share({
        title: "마이리틀 보험팝 결과",
        text: "이거 나랑 비슷한지 해봐!",
        url: shareUrl,
      });

      console.log('✅ 네이티브 공유 성공');
      logShareClicked({
        uuid,
        method: "native",
        success: true,
      });
      return;
    }

    // 🔥 2순위: 클립보드 API
    console.log('🔥 클립보드 API 체크:', {
      'navigator.clipboard': !!navigator.clipboard,
      'window.isSecureContext': window.isSecureContext
    });
    
    if (navigator.clipboard && window.isSecureContext) {
      console.log('🔥 클립보드 복사 시도...');
      await navigator.clipboard.writeText(shareUrl);
      console.log('✅ 클립보드 복사 성공');
      
      logShareClicked({
        uuid,
        method: "clipboard",
        success: true,
      });
      showCopyToast("링크가 복사되었어요!"); // 🔥 alert → 토스트로 변경
      return;
    }

    // 🔥 3순위: document.execCommand 복사
    console.log('🔥 execCommand 복사 시도...');
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = shareUrl;
    tempTextArea.style.position = 'fixed';
    tempTextArea.style.left = '-999999px';
    tempTextArea.style.top = '-999999px';
    document.body.appendChild(tempTextArea);
    tempTextArea.focus();
    tempTextArea.select();
    
    try {
      const successful = document.execCommand('copy');
      console.log('🔥 execCommand 결과:', successful);
      
      if (successful) {
        console.log('✅ execCommand 복사 성공');
        logShareClicked({
          uuid,
          method: "fallback",
          success: true,
        });
        showCopyToast("링크 복사완료 - 친구들에게 공유해보세요.");
        document.body.removeChild(tempTextArea);
        return;
      } else {
        throw new Error("execCommand 복사 실패");
      }
    } catch (copyError) {
      console.log('❌ execCommand 실패:', copyError);
      
      // 🔥 4순위: 수동 복사 안내
      console.log('🔥 수동 복사 안내 시도...');
      logShareClicked({
        uuid,
        method: "fallback",
        success: true,
      });
      
      document.body.removeChild(tempTextArea);
      
      // alert로 링크 표시 (가장 확실한 방법)
      alert(`링크를 복사해서 공유하세요:\n${shareUrl}`);
      return;
    }

  } catch (error) {
    console.log('💥 최종 오류:', error);
    
    logShareClicked({
      uuid,
      method: "fallback",
      success: false,
    });
    
    // 🔥 최종 최종 fallback - 절대 실패하지 않는 방법
    alert(`링크를 복사해서 공유하세요:\n${shareUrl}`);
    
  } finally {
    console.log('🔥 공유 완료');
    setIsSharing(false);
  }
};

  // [🔥 Firebase] 다시하기 클릭
  const handleReplay = () => {
    logReplayGame({
      uuid,
      previousGameRounds: userChoices.length,
      replayCount: 1,
    });
    sessionStorage.removeItem("userChoices");
    resetUUID();
    navigate("/");
  };

  return (
    <>
      <ScrollPageLayout
        footer={
          <div className="w-full">
            <CommonButton
              variant="primary"
              className="w-full result-page"
              label={
                <div className="flex items-center justify-center gap-2">
                  <img
                    src={
                      isCopied
                        ? "/images/icons/check-broken.svg"
                        : "/images/icons/copy_right.png"
                    }
                    alt={isCopied ? "check icon" : "copy icon"}
                    className="w-[20px] h-[20px]"
                  />
                  {isCopied ? "복사완료" : "결과 복사하기"}
                </div>
              }
              onClick={isCopied ? undefined : handleCopy}
            />

            <div className="mt-2 w-full">
              <a
                href="https://chat.openai.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block"
              >
                <CommonButton
                  variant="gpt"
                  style={{ width: "100%" }}
                  icon={null}
                  className="w-full result-page"
                  label={
                    <span className="flex items-center">
                      <img
                        src="/images/icons/gpt.png"
                        alt="GPT"
                        className="w-[18px] h-[18px] mr-2"
                      />
                      ChatGPT 바로가기
                    </span>
                  }
                />
              </a>
            </div>

            <div className="flex justify-between gap-2 mt-2">
              <CommonButton
                variant="secondary"
                className="w-full"
                label={
                  <div className="flex items-center justify-center gap-2 text-[#1989FF]">
                    <img
                      src="/images/icons/arrow-rotate.png"
                      alt="retry icon"
                      className="w-[19px] h-[19px]"
                    />
                    다시하기
                  </div>
                }
                onClick={handleReplay}
              />

              <CommonButton
                variant="secondary"
                className="w-full"
                label={
                  <div className="flex items-center justify-center gap-2 text-[#1989FF]">
                    <img
                      src="/images/icons/share.png"
                      alt="share icon"
                      className="w-[22px] h-[22px]"
                    />
                    {isSharing ? "공유 중..." : "공유하기"}
                  </div>
                }
                onClick={handleShare}
                disabled={isSharing || !shareUrl}
              />
            </div>
          </div>
        }
      >
        <div className="w-full flex flex-col items-center text-center font-[Pretendard]">
          <img
            src="/images/icons/clapping.png"
            alt="trophy"
            className={responsiveImage.result}
          />

          <h1 className={`${responsiveText.large} mt-[clamp(12px,3vw,24px)]`}>
            보험 탐구 여정이 끝났어요!
          </h1>

          <span className={`${responsiveText.subtext} mt-[clamp(8px,2.5vw,20px)]`}>
            이제 결과를 확인할 차례예요!
            <br />
            아래 프롬프트를 ChatGPT에 붙여넣으면
            <br />
            당신의 보험 성향을 분석해드려요.
          </span>

          <div className="mt-[clamp(24px,5vw,48px)] w-full">
            <ChoiceListCard
              title="내가 선택한 보험"
              type="user"
              choices={userChoices}
            />
          </div>

          <div className="mt-[clamp(16px,4vw,32px)] w-full">
            <ChoiceListCard
              title="상호의 Pick!"
              type="partner"
              choices={partnerChoices}
            />
          </div>
        </div>
      </ScrollPageLayout>

      {showToast && (
        <CopyToast 
          message={toastMessage} 
          onClose={handleToastClose} 
        />
      )}
    </>
  );
};

export default ResultPage;