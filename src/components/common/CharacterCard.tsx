interface CharacterCardProps {
  name: string;
  imageSrc: string;
  info: string[];
}

const CharacterCard = ({ name, imageSrc, info }: CharacterCardProps) => {
  return (
    <div className="w-[298px] h-[164px] bg-[#007DFF] rounded-[14px] flex items-center relative">
      {/* 아바타 영역 */}
      <div className="absolute left-[22px] top-[28px] w-[80px] flex flex-col items-center">
        <img src={imageSrc} alt="avatar" className="w-[80px] h-[80px]" />
        <div className="mt-[3px] text-white text-[12px]">{name}</div>
      </div>

      {/* 프로필 정보 텍스트 (좌측 정렬) */}
      <div className="ml-[119px] text-white text-[12px] leading-[18px] text-left">
        {info.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
    </div>
  );
};

export default CharacterCard;
