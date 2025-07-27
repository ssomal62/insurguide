import { GameChoice, PartnerChoice } from "@/hooks/useGame";
import avatarUser from "/images/icons/avatar_default.png";
import avatarPartner from "/images/icons/avatar.png";
import clsx from 'clsx';

type ChoiceListCardProps =
  | {
      title: string;
      type: 'user';
      choices: GameChoice[];
    }
  | {
      title: string;
      type: 'partner';
      choices: PartnerChoice[];
    };


const ChoiceListCard = ({ title, choices, type }: ChoiceListCardProps) => {
  const avatar = type === "user" ? avatarUser : avatarPartner;

  return (
    <div
      className={`w-[358px] p-[10px] rounded-[20px] shrink-0 bg-[#F8F8F8] border-[20px] border-[#F8F8F8] relative mb-[12px]`}
    >
      {/* 타이틀 */}
      <div className="flex items-center mb-[10px]">
        <img src={avatar} alt="avatar" className="w-[28px] h-[28px] mr-2" />
        <span className="text-[16px] font-nomal text-[#1C1C1C]">
    {type === 'partner' ? (
      <>
        상호의 <span className="text-[#1989FF] font-medium">Pick!</span>
      </>
    ) : (
      title
    )}
        </span>
      </div>

      {/* 5개 라운드 카드 */}
      <div>
      {choices.map((choice, index) => {
  const isUser = type === 'user';

const leftSelected = isUser
  ? choice.selected === 'left'
  : choice.selected === 'left' || choice.selected === 'both';

const rightSelected = isUser
  ? choice.selected === 'right'
  : choice.selected === 'right' || choice.selected === 'both';

const leftText = (
  <>
    {choice.left.title}
    <br />
    {choice.left.amount}
  </>
);

const rightText = (
  <>
    {choice.right.title}
    <br />
    {choice.right.amount}
  </>
);

const separator =
  !isUser && (choice as PartnerChoice).selected === 'both'
    ? '+'
    : 'vs';

  return (
<div
  key={index}
  className={clsx(
    "flex justify-center items-center space-x-2",
    index !== choices.length - 1 ? "pt-[13px] pb-[13px] border-b border-[#E5E5E5]" : "pt-[13px]"
  )}
>
      <div
        className={`w-[150px] h-[40px] px-3 py-2 rounded-[4px] text-[11px] font-medium text-center flex items-center justify-center
          ${leftSelected ? "bg-[#FFFFFF] border border-[#1989FF] text-[#1989FF]" : "bg-[#E1E1E1] text-[#8D8D8D]"}
        `}
      >
        <div className="whitespace-pre-line">{leftText}</div>
      </div>

      <span className="text-[#A9A9A9] text-[16px] font-medium">{separator}</span>

      <div
        className={`w-[150px] h-[40px] px-3 py-2 rounded-[4px] text-[11px] font-medium text-center flex items-center justify-center
          ${rightSelected ? "bg-[#FFFFFF] border border-[#1989FF] text-[#1989FF]" : "bg-[#E1E1E1] text-[#8D8D8D]"}
        `}
      >
        <div className="whitespace-pre-line">{rightText}</div>
      </div>
    </div>
  );
})}
      </div>
    </div>
  );
};

export default ChoiceListCard;
