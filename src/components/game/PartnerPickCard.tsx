interface PartnerPickCardProps {
  leftLabel: string;
  rightLabel: string;
  leftAmount: string;
  rightAmount: string;
  partnerPick: { left: boolean; right: boolean };
}

const PartnerPickCard = ({ leftLabel, rightLabel, leftAmount, rightAmount, partnerPick }: PartnerPickCardProps) => {
  const picks: { label: string; amount?: string; isPrimary: boolean }[] = [];

  if (partnerPick.left) {
    picks.push({ label: leftLabel, amount: leftAmount, isPrimary: true });
  }

  if (partnerPick.right) {
    picks.push({ label: rightLabel, amount: rightAmount, isPrimary: !partnerPick.left });
  }

  return (
<div className="flex flex-wrap justify-center gap-[11px] mb-[14px]">
  {picks.map((pick, idx) => (
    <div
      key={idx}
      className={`${
        picks.length === 1 ? 'w-full' : 'max-w-[48%]'
      } rounded-[6px] px-[14px] py-[10px] flex items-center justify-center 
        ${pick.isPrimary ? 'bg-[#1989FF] text-white' : 'bg-white text-[#1989FF]'}
      `}
    >
      <span className="text-[14px] whitespace-normal text-center break-keep">
        {pick.label} {pick.amount}
      </span>
    </div>
  ))}
</div>
  );
};

export default PartnerPickCard;
