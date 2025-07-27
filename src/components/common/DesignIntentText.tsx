// src/components/common/DesignIntentText.tsx
interface Props {
  text: string;
}

const DesignIntentText = ({ text }: Props) => {
  return (
    <div className="whitespace-pre-line text-white text-center leading-[22px] text-[14px]">
      {text}
    </div>
  );
};

export default DesignIntentText;
