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
import { useSharedResult } from "@/hooks/useSharedResult"; // 🔥 추가

import ChoiceListCard from "@/components/result/ChoiceListCard";
import ScrollPageLayout from "@/components/layout/ScrollPageLayout";
import { responsiveImage, responsiveText } from "@/styles/responsive";

const ResultPage = () => {
  const navigate = useNavigate();
  const [userChoices, setUserChoices] = useState<GameChoice[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>(""); // 🔥 추가
  const [isSharing, setIsSharing] = useState(false); // 🔥 추가

  const { generateBasicPrompt } = usePromptGeneration();
  const { saveAndShareResult } = useSharedResult(); // 🔥 추가
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

  // [🔥 Firebase] 공유 클릭 - 업데이트
  const handleShare = async () => {
    if (!shareUrl) {
      alert("공유 링크를 생성하는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setIsSharing(true);

    try {
      if (navigator.share) {
        await navigator.share({
          title: "마이리틀 보험팝 결과",
          text: "이거 나랑 비슷한지 해봐!",
          url: shareUrl, // 🔥 변경: Firestore 공유 URL 사용
        });

        logShareClicked({
          uuid,
          method: "native",
          success: true,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl); // 🔥 변경

        logShareClicked({
          uuid,
          method: "clipboard",
          success: true,
        });
        alert("링크가 복사되었어요!");
      } else {
        logShareClicked({
          uuid,
          method: "fallback",
          success: false,
        });
        alert("공유 기능을 지원하지 않는 환경이에요.");
      }
    } catch (error) {
      logShareClicked({
        uuid,
        method: "fallback",
        success: false,
      });
      alert("공유에 실패했어요.");
    } finally {
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
              disabled={isSharing || !shareUrl} // 🔥 추가: 공유 URL이 없거나 공유 중일 때 비활성화
            />
          </div>
        </div>
      }
    >
      <div className="w-full flex flex-col items-center pt-[71px] text-center font-[Pretendard]">
        {/* 1. 이미지 */}
        <img
          src="/images/icons/clapping.png"
          alt="trophy"
          className={responsiveImage.result}
        />

        <div style={{ marginTop: "clamp(16px, 4vw, 32px)" }} />
        <h1 className={responsiveText.large}>보험 탐구 여정이 끝났어요!</h1>
        <div style={{ marginTop: "clamp(12px, 3vw, 24px)" }} />
        <span className={responsiveText.subtext}>
          이제 결과를 확인할 차례예요!
          <br />
          아래 프롬프트를 ChatGPT에 붙여넣으면
          <br />
          당신의 보험 성향을 분석해드려요.
        </span>
        <div style={{ marginTop: "clamp(40px, 6vw, 80px)" }} />
        <ChoiceListCard
          title="내가 선택한 보험"
          type="user"
          choices={userChoices}
        />
        <div style={{ marginTop: "clamp(16px, 4vw, 40px)" }} />
        <ChoiceListCard
          title="상호의 Pick!"
          type="partner"
          choices={partnerChoices}
        />
      </div>
    </ScrollPageLayout>
  );
};

export default ResultPage;