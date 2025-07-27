import { GameChoice } from "@/hooks/useGame";

interface Props {
  choice: GameChoice;
}

const ResultChoiceCard = ({ choice }: Props) => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div
        className={`w-[150px] h-[48px] px-3 py-2 rounded-[6px] text-[13px] font-medium text-center flex items-center justify-center
          ${choice.selected === "left"
            ? "bg-[#1989FF] text-white"
            : "bg-[#F1F1F1] text-[#969696]"}
        `}
      >
        {choice.left.title}
        <br />
        {choice.left.amount}
      </div>
      <span className="text-[#A9A9A9] text-[16px] font-medium">vs</span>
      <div
        className={`w-[150px] h-[48px] px-3 py-2 rounded-[6px] text-[13px] font-medium text-center flex items-center justify-center
          ${choice.selected === "right"
            ? "bg-[#1989FF] text-white"
            : "bg-[#F1F1F1] text-[#969696]"}
        `}
      >
        {choice.right.title}
        <br />
        {choice.right.amount}
      </div>
    </div>
  );
};

export default ResultChoiceCard;
