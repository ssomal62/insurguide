interface Props {
  text: string;
}

const QuestionPrompt = ({ text }: Props) => {
  return (
    <div className="absolute top-[139px] w-[326px] left-1/2 -translate-x-1/2 text-[16px] leading-[22.4px] tracking-[-0.4px] font-normal text-black">
      {text.split('\n').map((line, idx) => (
        <p
          key={idx}
          className="whitespace-pre-line text-centerbreak-keep mb-[6px]"
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
