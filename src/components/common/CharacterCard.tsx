interface CharacterCardProps {
  name: string;
  imageSrc: string;
  info: string[];
}

const CharacterCard = ({ name, imageSrc, info }: CharacterCardProps) => {
  return (
<div className="w-[clamp(298px,60vw,460px)] h-[clamp(164px,30vw,240px)] bg-white rounded-[14px] shadow-md flex items-center px-[clamp(16px,4vw,28px)] gap-[clamp(16px,3vw,40px)]">
  <div className="h-[clamp(80px, 22vw, 110px)] w-[clamp(80px,18vw,96px)] flex flex-col justify-center items-center shrink-0">
    <img
      src={imageSrc}
      alt="avatar"
      className="w-full h-full bg-[#007DFF] rounded-full object-cover"
    />
    <div className="mt-[4px] text-basic text-black">{name}</div>
  </div>

  <div className="text-basic text-black leading-[1.5] text-left space-y-[2px]">
    {info.map((line, idx) => (
      <div key={idx}>{line}</div>
    ))}
  </div>
</div>
  );
};

export default CharacterCard;
