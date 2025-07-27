export interface PartnerPick {
  round: number;
  picks: {
    left: boolean;   // true면 좌측 선택
    right: boolean;  // true면 우측 선택
  };
}