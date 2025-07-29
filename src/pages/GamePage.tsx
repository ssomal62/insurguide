import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { CommonButton } from "@/components/common/Button";
import { ProgressBar } from "@/components/game/ProgressBar";
import { questions } from "@/data/questions";
import { Question, Option } from "@/types/game";
import { useGameState } from "@/hooks/useGame";
import { partnerChoices } from "@/data/partnerChoices";
import { useFirebase } from "@/hooks/useFirebase";
import { getOrCreateUUID } from "@/utils/uuid";
import FadeTransition from "@/components/common/FadeTransition";
import SlideTransition from "@/components/common/SlideTransition";
import OverlayCard from "@/components/layout/OverlayCard";
import GameOptionCard from "@/components/game/GameOptionCard";
import QuestionPrompt from "@/components/game/QuestionPrompt";
import QuestionReference from "@/components/game/QuestionReference";
import { useEffect } from "react";
import { useMemo } from "react";
import ShortPageLayout from "@/components/layout/ShortPageLayout";

const GamePage = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [gameQuestions] = useState<Question[]>(questions);

  const currentQuestion = gameQuestions[currentQuestionIndex];
  const currentRound = currentQuestionIndex + 1;
  const totalRounds = gameQuestions.length;
  const isLastRound = currentRound === totalRounds;
  const partnerPick = partnerChoices.find((p) => p.round === currentRound);

  const { logOptionSelected, setupExitDetection } = useFirebase();
  const [selectionStartTime, setSelectionStartTime] = useState<number>(
    Date.now()
  );
  const uuid = useMemo(() => getOrCreateUUID(), []);
  const { recordChoice } = useGameState();
  const { logPagePerformance } = useFirebase();

  const gameStartTimeRef = useRef(Date.now());

  useEffect(() => {
    logPagePerformance({
      page: "game",
      loadTime: Math.round(performance.now()),
    });
    setSelectionStartTime(Date.now());
    sessionStorage.setItem(
      "gameStartTime",
      gameStartTimeRef.current.toString()
    );
  }, []);

  useEffect(() => {
    setSelectionStartTime(Date.now());
  }, [currentQuestionIndex]);

  useEffect(() => {
    const cleanup = setupExitDetection(
      uuid,
      currentRound,
      gameStartTimeRef.current
    );
    return () => cleanup();
  }, [uuid, currentRound]);

  const handleOptionSelect = (option: Option) => {
    const selectionTime = (Date.now() - selectionStartTime) / 1000;

    logOptionSelected({
      uuid,
      questionId: currentQuestion.id,
      selectedOptionId: option.id,
      selectedOptionCategory: option.category,
      round: currentRound,
      selectionTime,
    });

    setSelectedOptionId(option.id);
    setConfirmed(false);
  };

  const handleConfirm = () => {
    if (!currentQuestion || !selectedOptionId) return;

    if (!confirmed) {
      setConfirmed(true);
      const selected =
        selectedOptionId === currentQuestion.options[0].id ? "left" : "right";
      recordChoice({
        questionId: currentQuestion.id,
        left: currentQuestion.options[0],
        right: currentQuestion.options[1],
        selected,
      });
    } else {
      if (!isLastRound) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOptionId(null);
        setConfirmed(false);
      } else {
        navigate("/result");
      }
    }
  };

  if (!currentQuestion) return <div>로딩 중...</div>;

  return (
    <ShortPageLayout
      className="bg-white text-black font-[Pretendard]"
      header={
        <div className="w-full px-[clamp(16px,5vw,28px)] pt-[clamp(20px,3vh,40px)] max-w-container">
          <ProgressBar currentRound={currentRound} totalRounds={totalRounds} />
        </div>
      }
      footer={
        <CommonButton
          className="relative z-50"
          variant={
            confirmed ? (isLastRound ? "primary" : "secondary") : "primary"
          }
          disabled={!selectedOptionId}
          onClick={handleConfirm}
          label={
            confirmed ? (isLastRound ? "결과 보기" : "다음 단계") : "선택하기"
          }
        />
      }
    >
<SlideTransition keyId={currentQuestion.id}>
<div className="flex flex-col justify-between flex-1">
  {/* 상단 영역 - ProgressBar는 이미 Layout의 header에서 처리됨 */}

  {/* 중앙 영역 - QuestionPrompt */}
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center">
      <QuestionPrompt text={currentQuestion.description} />
      {currentQuestion.reference && (
        <div className="mt-[clamp(8px,2vh,16px)]">
          <QuestionReference reference={currentQuestion.reference} />
        </div>
      )}
    </div>
  </div>

    {/* 3. 카드 영역 */}
    <div className="flex items-center justify-center mt-[clamp(12px,4vh,32px)]">
      <div className="flex items-center justify-center gap-x-[clamp(6px,2vw,24px)] w-full px-[clamp(12px,5vw,28px)]">
        <GameOptionCard
          option={currentQuestion.options[0]}
          position="left"
          isSelected={selectedOptionId === currentQuestion.options[0].id}
          questionId={currentQuestion.id}
          round={currentRound}
          onClick={() => handleOptionSelect(currentQuestion.options[0])}
        />

        <div className="flex items-center justify-center h-full px-1">
          <div className="text-[#A9A9A9] text-[clamp(14px,3.5vw,28px)] font-semibold leading-[1.2] translate-y-[-40%]">
            VS
          </div>
        </div>

        <GameOptionCard
          option={currentQuestion.options[1]}
          position="right"
          isSelected={selectedOptionId === currentQuestion.options[1].id}
          questionId={currentQuestion.id}
          round={currentRound}
          onClick={() => handleOptionSelect(currentQuestion.options[1])}
        />
      </div>
    </div>
  </div>
</SlideTransition>


      {confirmed && partnerPick && (
        <div className="absolute inset-0 z-50">
          <FadeTransition isVisible={true}>
            <OverlayCard
              designIntent={currentQuestion.designIntent}
              partnerPick={{
                left:
                  partnerPick.selected === "left" ||
                  partnerPick.selected === "both",
                right:
                  partnerPick.selected === "right" ||
                  partnerPick.selected === "both",
              }}
              left={partnerPick.left}
              right={partnerPick.right}
              round={currentRound}
            />
          </FadeTransition>
        </div>
      )}
    </ShortPageLayout>
  );
};

export default GamePage;
