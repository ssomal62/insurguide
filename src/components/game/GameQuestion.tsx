export interface QuestionCard {
  id: string;
  title: string;
  amount: string; // "2천만원", "30만원" 등
  shortDescription: string; // 카드 앞면 간단 설명
  detailedDescription: string; // 카드 뒤면 상세 설명
  category: string;
  imagePath?: string;
  imageAlt?: string;
}

export interface GameQuestionData {
  id: string;
  questionNumber: number;
  title: string;
  context: string; // 질문 배경 설명
  reference?: string; // 참고 정보
  designIntent: string; // 기획 의도
  cards: [QuestionCard, QuestionCard];
}

export interface GameQuestionProps {
  question: GameQuestionData;
  currentRound: number;
  totalRounds: number;
  onCardSelect: (selectedCard: QuestionCard) => void;
  onNextRound: () => void;
  selectedCardId?: string;
  isNextEnabled: boolean;
  loading?: boolean;
}