import { responsiveText } from "@/styles/responsive";

interface Props {
  text: string;
}

const DesignIntentText = ({ text }: Props) => {
  return (
    <div className={`whitespace-pre-line text-white text-center leading-[22px] text-[14px] ${responsiveText.base}`}>
      {text}
    </div>
  );
};

export default DesignIntentText;
