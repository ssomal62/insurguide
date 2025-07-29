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
import CopyToast from "@/components/common/CopyToast";
import { responsiveImage, responsiveText } from "@/styles/responsive";

import { 
  share, 
  createGameShareData, 
  ShareResult,
  isNativeShareSupported 
} from "@/utils/share";

const ResultPage = () => {
  const navigate = useNavigate();
  const [userChoices, setUserChoices] = useState<GameChoice[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isSharing, setIsSharing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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

  // 게임 결과 로드
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

  // 공유 URL 생성
  useEffect(() => {
    const createShareUrl = async () => {
      if (userChoices.length === 0 || shareUrl) return;

      try {
        const result = await saveAndShareResult(userChoices, prompt, uuid);
        if (result.success && result.shareUrl) {
          setShareUrl(result.shareUrl);
          console.log('🔥 공유 URL 생성 완료:', result.shareUrl);
        }
      } catch (error) {
        console.error('공유 URL 생성 실패:', error);
      }
    };

    createShareUrl();
  }, [userChoices, prompt, uuid, shareUrl]);

  // 토스트 표시 함수
  const showCopyToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  // 토스트 닫기 함수
  const handleToastClose = () => {
    setShowToast(false);
    setToastMessage("");
  };

  // 프롬프트 복사
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

  // 🔥 개선된 공유 함수
  const handleShare = async () => {
    if (!shareUrl) {
      alert("공유 링크를 생성하는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setIsSharing(true);

    try {
      // 🔥 공유 데이터 생성
      const shareData = createGameShareData(shareUrl);
      console.log('🔥 공유 데이터:', shareData);

      // 🔥 개선된 공유 함수 호출
      const result: ShareResult = await share(shareData);
      console.log('🔥 공유 결과:', result);

      // Firebase 로깅
      logShareClicked({
        uuid,
        method: result.method,
        success: result.success,
      });

      // 결과에 따른 사용자 피드백
      if (result.success) {
        if (result.method === 'native') {
          // 네이티브 공유 성공 시 별도 토스트 없음 (시스템에서 처리)
          console.log('✅ 네이티브 공유 완료');
        } else if (result.method === 'clipboard') {
          showCopyToast("공유 링크가 복사되었습니다!");
        }
      } else {
        // 실패 시 사용자에게 수동 복사 제공
        console.log('❌ 공유 실패:', result.error);
        
        // 최종 fallback: alert로 링크 제공
        const confirmed = confirm(
          `자동 공유에 실패했습니다.\n링크를 수동으로 복사하시겠습니까?\n\n${shareUrl}`
        );
        
        if (confirmed) {
          // 수동 복사 시도
          try {
            if (navigator.clipboard && window.isSecureContext) {
              await navigator.clipboard.writeText(shareUrl);
              showCopyToast("링크가 복사되었습니다!");
            } else {
              // execCommand 시도
              const textArea = document.createElement('textarea');
              textArea.value = shareUrl;
              textArea.style.position = 'fixed';
              textArea.style.left = '-9999px';
              document.body.appendChild(textArea);
              textArea.focus();
              textArea.select();
              
              const successful = document.execCommand('copy');
              document.body.removeChild(textArea);
              
              if (successful) {
                showCopyToast("링크가 복사되었습니다!");
              } else {
                alert("복사에 실패했습니다. 링크를 수동으로 복사해주세요.");
              }
            }
          } catch (copyError) {
            console.error('수동 복사 실패:', copyError);
            alert("복사에 실패했습니다. 링크를 수동으로 복사해주세요.");
          }
        }
      }

    } catch (error) {
      console.error('💥 공유 중 예외 발생:', error);
      
      logShareClicked({
        uuid,
        method: "fallback",
        success: false,
      });
      
      // 최종 fallback
      alert(`공유 중 오류가 발생했습니다.\n링크를 수동으로 복사해주세요:\n${shareUrl}`);
      
    } finally {
      setIsSharing(false);
    }
  };

  // 다시하기
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