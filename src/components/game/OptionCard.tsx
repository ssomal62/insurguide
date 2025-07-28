import { CardFlip } from './CardFlip';

interface OptionCardProps {
  isSelected: boolean;
  isFlipped: boolean;
  onClick: () => void;
  front: React.ReactNode;
  back: React.ReactNode;
}

export const OptionCard = ({
  isFlipped,
  onClick,
  front,
  back,
}: OptionCardProps) => {
  return (

    <button onClick={onClick} className="rounded-[10px] w-full h-full">
      <CardFlip isFlipped={isFlipped} front={front} back={back} />
    </button>
  );
};