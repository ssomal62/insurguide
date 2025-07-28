import { responsiveText } from "@/styles/responsive";

interface PartnerPickCardProps {
  leftLabel: string;
  rightLabel: string;
  leftAmount: string;
  rightAmount: string;
  partnerPick: { left: boolean; right: boolean };
}

const PartnerPickCard = ({
  leftLabel,
  rightLabel,
  leftAmount,
  rightAmount,
  partnerPick,
}: PartnerPickCardProps) => {
  const picks: { label: string; amount?: string; isPrimary: boolean }[] = [];

  if (partnerPick.left) {
    picks.push({ label: leftLabel, amount: leftAmount, isPrimary: true });
  }

  if (partnerPick.right) {
    picks.push({
      label: rightLabel,
      amount: rightAmount,
      isPrimary: !partnerPick.left,
    });
  }

  return (
    <div className="flex flex-wrap justify-center gap-[clamp(8px,3vw,14px)]">
      {picks.map((pick, idx) => (
        <div
          key={idx}
          className={`${
            picks.length === 1 ? "w-full" : "w-[clamp(130px,44%,250px)]"
          } rounded-[6px] px-[clamp(12px,3vw,18px)] py-[clamp(8px,2vw,14px)] flex items-center justify-center 
          ${
            pick.isPrimary
              ? "bg-[#1989FF] text-white"
              : "bg-white text-[#1989FF]"
          }
          `}
        >
          <span
            className={`${responsiveText.medium} text-[clamp(13px,2.5vw,16px)] text-center leading-snug break-keep`}
          >
            {pick.label} {pick.amount}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PartnerPickCard;
