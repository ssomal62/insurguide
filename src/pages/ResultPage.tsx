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
import { responsiveImage, responsiveText } from "@/styles/responsive";

import ChoiceListCard from "@/components/result/ChoiceListCard";
import ScrollPageLayout from "@/components/layout/ScrollPageLayout";

const ResultPage = () => {
  const navigate = useNavigate();
  const [userChoices, setUserChoices] = useState<GameChoice[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  const { generateBasicPrompt } = usePromptGeneration();
  const {
    logResultViewed,
    logPromptCopied,
    logShareClicked,
    logReplayGame,
    logPagePerformance,
  } = useFirebase();

  const uuid = getOrCreateUUID(); // [🔥 Firebase]

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

  // [🔥 Firebase] 공유 클릭
  const handleShare = async () => {
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "마이리틀 보험팝 결과",
          text: "이거 나랑 비슷한지 해봐!",
          url: shareUrl,
        });

        logShareClicked({
          uuid,
          method: "native",
          success: true,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);

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
                  공유하기
                </div>
              }
              onClick={handleShare}
            />
          </div>
        </div>
      }
    >
      <div className="w-full flex flex-col items-center pt-[71px] text-center font-[Pretendard]">
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
