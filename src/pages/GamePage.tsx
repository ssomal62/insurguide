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
import OverlayCard from "@/components/result/OverlayCard";
import GameOptionCard from "@/components/game/GameOptionCard";
import QuestionPrompt from "@/components/game/QuestionPrompt";
import QuestionReference from "@/components/game/QuestionReference";
import { useEffect } from "react";
import { useMemo } from "react";

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

  useEffect(() => {
    const loadTime = Math.round(performance.now());
    logPagePerformance({ page: "game", loadTime });
  }, []);

  useEffect(() => {
    setSelectionStartTime(Date.now());
  }, [currentQuestionIndex]);

  const gameStartTimeRef = useRef(Date.now());

  useEffect(() => {
    sessionStorage.setItem(
      "gameStartTime",
      gameStartTimeRef.current.toString()
    );
  }, []);

  useEffect(() => {
    const cleanup = setupExitDetection(
      uuid,
      currentRound,
      gameStartTimeRef.current
    );

    return () => {
      cleanup();
    };
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
        left: {
          title: currentQuestion.options[0].title,
          amount: currentQuestion.options[0].amount,
          category: currentQuestion.options[0].category,
        },
        right: {
          title: currentQuestion.options[1].title,
          amount: currentQuestion.options[1].amount,
          category: currentQuestion.options[1].category,
        },
        selected,
      });
    } else {
      if (currentQuestionIndex < totalRounds - 1) {
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
    <div className="relative w-[393px] h-[852px] bg-white overflow-hidden font-[Pretendard]">
      {/* 슬라이딩 대상: 질문+옵션 */}
      <SlideTransition keyId={currentQuestion.id}>
        <div className="relative w-full h-full pt-[180px] px-[22px]">
          <QuestionPrompt text={currentQuestion.description} />

          {currentQuestion.reference && (
            <QuestionReference reference={currentQuestion.reference} />
          )}

          <GameOptionCard
            option={currentQuestion.options[0]}
            position="left"
            isSelected={selectedOptionId === currentQuestion.options[0].id}
            questionId={currentQuestion.id}
            round={currentRound}
            onClick={() => handleOptionSelect(currentQuestion.options[0])}
          />

          <GameOptionCard
            option={currentQuestion.options[1]}
            position="right"
            isSelected={selectedOptionId === currentQuestion.options[1].id}
            questionId={currentQuestion.id}
            round={currentRound}
            onClick={() => handleOptionSelect(currentQuestion.options[1])}
          />

          <div className="absolute top-[415px] left-1/2 -translate-x-1/2 text-[#1989FF] text-[20px] font-semibold leading-[28px] z-10">
            VS
          </div>
        </div>
      </SlideTransition>

      {confirmed && partnerPick && (
        <div className="absolute inset-0 z-[50]">
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

      {/* 고정 상단 프로그레스 바 */}
      <div className="absolute top-[94px] left-0 right-0 px-[22px] z-20">
        <ProgressBar currentRound={currentRound} totalRounds={totalRounds} />
      </div>

      {/* 고정 하단 버튼 */}
      <div className="absolute top-[722px] left-0 right-0 flex justify-center z-50">
        <CommonButton
          variant={
            confirmed ? (isLastRound ? "primary" : "secondary") : "primary"
          }
          disabled={!selectedOptionId}
          onClick={handleConfirm}
          label={
            confirmed ? (isLastRound ? "결과 보기" : "다음 단계") : "선택하기"
          }
        />
      </div>
    </div>
  );
};

export default GamePage;
