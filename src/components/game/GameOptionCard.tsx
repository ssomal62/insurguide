import { Option } from "@/types/game";
import { OptionCard } from "@/components/game/OptionCard";
import { useRef } from 'react';
import { useFirebase } from '@/hooks/useFirebase';
import { getOrCreateUUID } from '@/utils/uuid';


interface Props {
  option: Option;
  isSelected: boolean;
  position: "left" | "right";
  onClick: () => void;
  questionId: string;
  round: number;
}

const GameOptionCard = ({ option, isSelected, position, onClick, questionId, round}: Props) => {

  const { logCardFlip } = useFirebase();
  const uuid = getOrCreateUUID();
  const flipStartTimeRef = useRef<number | null>(null);
  
    const handleClick = () => {
    // [🔥 Firebase] 카드 뒤집기 시작 시간 기록
    const now = Date.now();
    const flipStartTime = flipStartTimeRef.current;
    if (flipStartTime === null) {
      flipStartTimeRef.current = now;
    } else {
      const flipTime = (now - flipStartTime) / 1000;
      logCardFlip({
        uuid,
        questionId,
        optionId: option.id,
        round,
        flipTime,
      });
      flipStartTimeRef.current = now; // 다음 flip을 위해 초기화
    }

    onClick(); // 기존 동작
  };

  const positionClass = position === "left" ? "left-[16px]" : "right-[15px]";

  return (
    <div className={`absolute top-[306px] ${positionClass}`}>
      <OptionCard
        isSelected={isSelected}
        isFlipped={isSelected}
        onClick={handleClick}
        front={
          <div
            className={`relative w-[160px] h-[218px] rounded-[10px] overflow-hidden ${
              isSelected ? "border border-[#1989FF]" : ""
            } outline-none focus:outline-none focus:ring-0`}
            tabIndex={-1}
          >
            <img
              src={option.imagePath || "/images/insurance/default.png"}
              alt={option.imageAlt || option.title}
              className="w-full h-full object-cover"
            />
          </div>
        }
        back={
          <div className="w-[160px] h-[218px] bg-[#EDF4FF] rounded-[10px] p-3 flex flex-col justify-center items-center text-center border border-[#1989FF]">
<div className="w-[38px] h-[38px] rounded-full overflow-hidden border border-white flex items-center justify-center mb-2 bg-white">
  <img
    src="/images/icons/lightbulb.png"
    className="w-full h-full object-cover"
    alt="Hint"
  />
</div>
            <p className="text-[11px] text-blue-700 leading-relaxed">
              {option.detailedDescription}
            </p>
          </div>
        }
      />
      <div
        className={`mt-2 text-[14px] font-medium ${
          isSelected ? "text-[#1989FF]" : "text-[#000000]"
        } text-center leading-[20px]`}
      >
  <span>{option.title}</span><br />
  <span>{option.amount}</span>
      </div>
      <div className="mt-1 text-[12px] text-gray-600 text-center">
      </div>
    </div>
  );
};

export default GameOptionCard;
