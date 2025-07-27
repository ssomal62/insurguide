interface Props {
  reference: string;
}

const QuestionReference = ({ reference }: Props) => {
  return (
    <div className="absolute top-[245px] left-1/2 -translate-x-1/2 text-center text-[12px] text-gray-500">
      📊 {reference}
    </div>
  );
};

export default QuestionReference;