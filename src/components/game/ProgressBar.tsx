interface ProgressBarProps {
  currentRound: number;
  totalRounds: number;
}

export const ProgressBar = ({ currentRound, totalRounds }: ProgressBarProps) => {
  const progress = Math.min((currentRound / totalRounds) * 100, 100);

  return (
    <div className="w-full flex items-center h-[14px]">
      {/* 진행 바 */}
      <div className="inline-flex h-1 flex-grow items-center flex-shrink-0 bg-[#E3E3E3] rounded-[8px] overflow-hidden mr-[9px]">
        <div
          className="bg-[#1989FF] h-full rounded-[8px] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 진행 숫자 */}
      <div className="flex items-center">
        <span className="text-[10px] leading-[14px] font-medium font-[Pretendard] text-black">
          {currentRound}
        </span>
        <span className="text-[10px] leading-[14px] font-medium font-[Pretendard] text-[#9B9B9B]">
          /{totalRounds}
        </span>
      </div>
    </div>
  );
};
