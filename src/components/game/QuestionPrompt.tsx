import { responsiveText } from "@/styles/responsive";

interface Props {
  text: string;
}

const QuestionPrompt = ({ text }: Props) => {
  return (
    <div className={`w-full max-w-[clamp(300px,85vw,650px)] mx-auto ${responsiveText.question}`}>
      {text.split('\n').map((line, idx) => (
        <p
          key={idx}
          className="whitespace-pre-line break-keep mb-[6px]"
          dangerouslySetInnerHTML={{
            __html: line.replace(
              /\*\*(.*?)\*\*/g,
              '<span class="text-[#1989FF] font-semibold">$1</span>'
            ),
          }}
        />
      ))}
    </div>
  );
};

export default QuestionPrompt;