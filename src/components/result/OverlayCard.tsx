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

    <div className="absolute inset-0 bg-black bg-opacity-80 z-[40]">

      <img
        src={`/images/icons/avatar_${round}.png`}
        alt={`avatar ${round}`}
        className="absolute top-[111px] left-[129px] w-[148px] max-h-[90%]"
      />

      <div className="absolute top-[322px] left-1/2 transform -translate-x-1/2 w-[298px] text-center text-white font-[Pretendard]">
        <p className="text-[18px] font-medium leading-[22px] tracking-[-0.45px] mb-[16px]">
          상호는 이 보험을 선택했어요!
        </p>

        <div className="flex justify-center">
          <PartnerPickCard
            leftLabel={left.title}
            rightLabel={right.title}
            leftAmount={left.amount}
            rightAmount={right.amount}
            partnerPick={partnerPick}
          />
        </div>

          <DesignIntentText text={designIntent} />

      </div>
    </div>
  );
};

export default OverlayCard;
