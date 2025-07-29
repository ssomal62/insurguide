import { Option } from "@/types/game";
import { OptionCard } from "@/components/game/OptionCard";
import { useRef } from 'react';
import { useFirebase } from '@/hooks/useFirebase';
import { getOrCreateUUID } from '@/utils/uuid';
import { responsiveText } from "@/styles/responsive";

interface Props {
  option: Option;
  isSelected: boolean;
  position: "left" | "right";
  onClick: () => void;
  questionId: string;
  round: number;
}

const GameOptionCard = ({ option, isSelected, onClick, questionId, round}: Props) => {
  const { logCardFlip } = useFirebase();
  const uuid = getOrCreateUUID();
  const flipStartTimeRef = useRef<number | null>(null);
  
  const handleClick = () => {
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
      flipStartTimeRef.current = now;
    }
    onClick();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[min(40vw,300px)] min-w-[140px]">
      <div className="w-full aspect-[160/218]">
        <OptionCard
          isSelected={isSelected}
          isFlipped={isSelected}
          onClick={handleClick}
          front={
            <div
              className={`relative w-full h-full rounded-[10px] overflow-hidden ${
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
            <div className="w-full h-full bg-[#EDF4FF] rounded-[10px] p-[clamp(8px,2vw,12px)] flex flex-col text-center border border-[#1989FF] relative">
              <div className="flex justify-center pt-[clamp(8px,2vw,12px)] pb-[clamp(6px,1.5vw,10px)]">
                <div className="w-[clamp(28px,8vw,60px)] h-[clamp(28px,8vw,60px)] rounded-full overflow-hidden border border-white flex items-center justify-center bg-white flex-shrink-0">
                  <img
                    src="/images/icons/lightbulb.png"
                    className="w-[clamp(20px,6vw,40px)] h-[clamp(20px,6vw,40px)] object-cover"
                    alt="Hint"
                  />
                </div>
              </div>
              
              <div className="flex-1 flex items-center justify-center px-1">
                <p className={`${responsiveText.description} text-[#1989FF] leading-relaxed text-center`}>
                  {option.detailedDescription}
                </p>
              </div>
            </div>
          }
        />
      </div>
      
      <div className={`mt-[clamp(10px,2vw,20px)] ${responsiveText.title} text-center ${
        isSelected ? "text-[#1989FF]" : "text-[#000000]"
      }`}>
        <span>{option.title}</span><br />
        <span>{option.amount}</span>
      </div>
    </div>
  );
};

export default GameOptionCard;