import { responsiveText } from "@/styles/responsive";
import DesignIntentText from "../common/DesignIntentText";
import PartnerPickCard from "../game/PartnerPickCard";

interface OverlayCardProps {
  designIntent: string;
  partnerPick: {
    left: boolean;
    right: boolean;
  };
  left: { title: string; amount: string };
  right: { title: string; amount: string };
  round: number;
}

const OverlayCard = ({
  designIntent,
  left,
  right,
  partnerPick,
  round
}: OverlayCardProps) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 z-[30] flex flex-col items-center justify-center pb-[clamp(60px,10vh,120px)] px-[clamp(16px,5vw,28px)]">

      <img
        src={`/images/icons/avatar_${round}.png`}
        alt={`avatar ${round}`}
        className="w-[clamp(120px,25vw,180px)] h-auto mb-[clamp(16px,4vh,24px)]"
      />

      <p className={`text-[clamp(16px,4vw,18px)] font-medium leading-[1.2] tracking-[-0.45px] text-white text-center mb-[clamp(12px,2vh,16px)]`}>
        <span className={`${responsiveText.large}`}>상호는 이 보험을 선택했어요!</span>
      </p>

      <div className="mb-[clamp(16px,3vh,20px)]">
        <PartnerPickCard
          leftLabel={left.title}
          rightLabel={right.title}
          leftAmount={left.amount}
          rightAmount={right.amount}
          partnerPick={partnerPick}
        />
      </div>

      <div className="w-[clamp(280px,85vw,500px)] text-center">
        <DesignIntentText text={designIntent} />
      </div>

    </div>
  );
};

export default OverlayCard;