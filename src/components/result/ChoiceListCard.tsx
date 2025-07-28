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
      className={`w-full max-w-[728px] min-w-[300px] mx-auto p-[clamp(10px,2.5vw,16px)] rounded-[clamp(16px,4vw,20px)] shrink-0 bg-[#F8F8F8] border-[clamp(16px,4vw,20px)] border-[#F8F8F8] relative mb-[clamp(12px,3vw,16px)]`}
    >
      <div className="flex items-center mb-[clamp(8px,2vw,12px)]"
            style={{ marginLeft: 'clamp(1px,2vw,50px)' }}
      >
        <img 
          src={avatar} 
          alt="avatar" 
          className="w-[clamp(24px,6vw,50px)] h-[clamp(24px,6vw,50px)] mr-2" 
        />
        <span 
          className="text-[clamp(14px,3.5vw,18px)] font-normal text-[#1C1C1C] leading-[1.2]"
          style={{ fontSize: 'clamp(18px, 3.5vw, 26px)' }}
        >
          {type === 'partner' ? (
            <>
              상호의 <span className="text-[#1989FF] font-medium">Pick!</span>
            </>
          ) : (
            title
          )}
        </span>
      </div>

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
              ? '+ '
              : 'vs';

          return (
            <div
              key={index}
              className={clsx(
                "flex justify-center items-center gap-[clamp(8px,2vw,12px)]",
                index !== choices.length - 1 
                  ? "pt-[clamp(10px,2.5vw,16px)] pb-[clamp(10px,2.5vw,16px)] border-b border-[#E5E5E5]" 
                  : "pt-[clamp(10px,2.5vw,16px)]"
              )}
            >
              {/* 왼쪽 선택지 */}
              <div
                className={`flex-1 max-w-[clamp(130px,35vw,250px)] h-[clamp(36px,8vw,70px)] px-[clamp(8px,2vw,12px)] py-[clamp(6px,1.5vw,8px)] rounded-[clamp(4px,1vw,8px)] font-medium text-center flex items-center justify-center transition-colors duration-200
                  ${leftSelected 
                    ? "bg-[#FFFFFF] border border-[#1989FF] text-[#1989FF]" 
                    : "bg-[#E1E1E1] text-[#8D8D8D]"
                  }
                `}
                style={{ fontSize: 'clamp(10px, 2.5vw, 18px)' }}
              >
                <div className="whitespace-pre-line leading-[1.2]">{leftText}</div>
              </div>

              <span 
                className="text-[#A9A9A9] font-medium shrink-0" 
                style={{ fontSize: 'clamp(14px, 3.5vw, 22px)' }}
              >
                {separator}
              </span>

              <div
                className={`flex-1 max-w-[clamp(130px,35vw,250px)] h-[clamp(36px,8vw,70px)] px-[clamp(8px,2vw,12px)] py-[clamp(6px,1.5vw,8px)] rounded-[clamp(4px,1vw,8px)] font-medium text-center flex items-center justify-center transition-colors duration-200
                  ${rightSelected 
                    ? "bg-[#FFFFFF] border border-[#1989FF] text-[#1989FF]" 
                    : "bg-[#E1E1E1] text-[#8D8D8D]"
                  }
                `}
                style={{ fontSize: 'clamp(10px, 2.5vw, 18px)' }}
              >
                <div className="whitespace-pre-line leading-[1.2]">{rightText}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChoiceListCard;