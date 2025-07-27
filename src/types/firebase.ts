// Firebase 이벤트 기본 인터페이스
export interface FirebaseEvent {
  name: string;
  parameters: Record<string, string | number | boolean>;
}

// 게임 시작 이벤트
export interface GameStartEvent {
  uuid: string;
  timestamp: number;
  userAgent?: string;
}

// 옵션 선택 이벤트
export interface OptionSelectedEvent {
  uuid: string;
  questionId: string;
  selectedOptionId: string;
  selectedOptionCategory: string;
  round: number;
  selectionTime: number; // 선택까지 걸린 시간 (초)
  timestamp: number;
}

// 결과 화면 조회 이벤트
export interface ResultViewedEvent {
  uuid: string;
  roundCount: number;
  totalGameTime: number; // 전체 게임 시간 (초)
  selectedCategories: string[]; // 선택된 카테고리들
  timestamp: number;
}

// 프롬프트 복사 이벤트
export interface PromptCopiedEvent {
  uuid: string;
  copied: boolean;
  promptLength: number;
  timestamp: number;
}

// 공유 버튼 클릭 이벤트
export interface ShareClickedEvent {
  uuid: string;
  method: 'clipboard' | 'native' | 'fallback';
  success: boolean;
  timestamp: number;
}

// 게임 재시작 이벤트
export interface ReplayGameEvent {
  uuid: string;
  previousGameRounds: number;
  replayCount: number;
  timestamp: number;
}

// 게임 중간 이탈 이벤트
export interface ExitMidGameEvent {
  uuid: string;
  lastSeenRound: number;
  timeSpent: number; // 머문 시간 (초)
  exitMethod: 'refresh' | 'close' | 'navigate';
  timestamp: number;
}

// 카드 뒤집기 이벤트 (추가 분석용)
export interface CardFlipEvent {
  uuid: string;
  questionId: string;
  optionId: string;
  round: number;
  flipTime: number; // 카드를 뒤집는데 걸린 시간
  timestamp: number;
}

// 페이지 성능 이벤트
export interface PagePerformanceEvent {
  page: 'start' | 'game' | 'result';
  loadTime: number;
  timestamp: number;
}

// 모든 게임 이벤트 타입 통합
export type GameEventType = 
  | 'game_start'
  | 'option_selected'
  | 'result_viewed'
  | 'prompt_copied'
  | 'share_clicked'
  | 'replay_game'
  | 'exit_mid_game'
  | 'card_flip'
  | 'page_performance';

// 이벤트 매개변수 타입 매핑
export interface GameEventParameters {
  game_start: GameStartEvent;
  option_selected: OptionSelectedEvent;
  result_viewed: ResultViewedEvent;
  prompt_copied: PromptCopiedEvent;
  share_clicked: ShareClickedEvent;
  replay_game: ReplayGameEvent;
  exit_mid_game: ExitMidGameEvent;
  card_flip: CardFlipEvent;
  page_performance: PagePerformanceEvent;
}

// Firebase Analytics 커스텀 이벤트
export interface CustomEvent<T extends GameEventType> {
  eventName: T;
  parameters: GameEventParameters[T];
}