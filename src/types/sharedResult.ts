import { GameChoice } from "@/hooks/useGame";

// Firestore에 저장될 공유 결과 데이터
export interface SharedResultData {
  id: string; // 공유 ID (6자리 랜덤)
  userChoices: GameChoice[]; // 사용자의 게임 선택 결과
  prompt: string; // 생성된 GPT 프롬프트
  createdAt: Date; // 생성 시간
  viewCount: number; // 조회수
  creatorUuid: string; // 생성자 UUID
}

// 공유 결과 조회 응답
export interface SharedResultResponse {
  success: boolean;
  data?: SharedResultData;
  error?: string;
}

// 공유 URL 생성 응답
export interface ShareUrlResponse {
  success: boolean;
  shareId?: string;
  shareUrl?: string;
  error?: string;
}