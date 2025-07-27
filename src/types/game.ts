export interface Question {
  id: string;
  title: string;
  description: string;
  reference?: string;
  designIntent: string;
  options: [Option, Option];
}

export interface ChoiceOption {
  title: string;
  amount: string;
  category?: string; 
}

// 선택지 옵션 타입
export interface Option {
  id: string;
  title: string;
  amount: string;
  description: string; // 카드 앞면 간단 설명
  detailedDescription: string; // 카드 뒤면 상세 설명
  category: string; // 결과 분석용 카테고리
  imagePath: string; // 이미지 경로
  imageAlt: string; // 접근성을 위한 alt 텍스트
}

// 게임 상태 관리
export interface GameState {
  gameId: string; // UUID
  currentRound: number; // 현재 라운드 (1-5)
  totalRounds: number; // 총 라운드 수 (5)
  selectedOptions: Option[]; // 선택된 옵션들
  availableQuestions: Question[]; // 사용 가능한 질문들 (셔플된 상태)
  currentQuestion: Question | null; // 현재 질문
  gameStartTime: number; // 게임 시작 시간 (타임스탬프)
  isCompleted: boolean; // 게임 완료 여부
}

// 개별 라운드 선택 결과
export interface RoundResult {
  round: number;
  question: Question;
  selectedOption: Option;
  unselectedOption: Option;
  selectionTime: number; // 선택까지 걸린 시간 (초)
}

// 전체 게임 결과
export interface GameResult {
  gameId: string;
  roundResults: RoundResult[];
  totalTime: number; // 전체 게임 시간 (초)
  promptText: string; // 생성된 GPT 프롬프트
  completedAt: number; // 완료 시간 (타임스탬프)
}

// 카드 상태 (UI용)
export interface CardState {
  isFlipped: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

// 게임 액션 타입
export type GameAction =
  | { type: "START_GAME"; payload: { gameId: string; questions: Question[] } }
  | {
      type: "SELECT_OPTION";
      payload: { option: Option; selectionTime: number };
    }
  | { type: "NEXT_ROUND" }
  | { type: "COMPLETE_GAME"; payload: { promptText: string } }
  | { type: "RESET_GAME" }
  | { type: "SET_CURRENT_QUESTION"; payload: Question };

// 로컬 스토리지 저장용 데이터
export interface StoredGameData {
  gameId: string;
  currentRound: number;
  selectedOptions: Option[];
  gameStartTime: number;
  lastUpdated: number;
}
