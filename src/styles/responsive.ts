/** 텍스트 크기: 모바일~태블릿 대응 */
export const responsiveText = {
  base: "text-[clamp(12px,4vw,18px)] leading-[1.5] font-normal font-[Pretendard] text-center",
  medium:
    "text-[clamp(16px,4vw,26px)] leading-[1.3] font-[Pretendard] text-center",
  medium_bold:
    "text-[clamp(14px,3vw,24px)] font-bold leading-[1.45] font-[Pretendard] text-center",
  large:
    "text-[clamp(22px,5vw,40px)] font-nomal leading-[1.45] font-[Pretendard] text-center",
  heading: "text-[clamp(30px,6vw,46px)] font-semibold leading-tight text-center",
  subtext:
    "text-[clamp(14px,4vw,24px)] leading-[1.5] text-[#030303] tracking-[-0.35px] font-[Archivo] text-center",
  small: "text-small leading-[1.4] font-sans",
  question:
    "text-[clamp(12px,4vw,24px)] leading-[1.45] font-[Pretendard] text-center",
  description:
    "text-[clamp(14px,3vw,22px)] font-nomal leading-[1.6] font-[Pretendard]",
  title:
    "text-[clamp(16px,4vw,24px)] font-medium leading-[1.2] font-[Pretendard] text-center",
  vs: "text-[clamp(18px,3vw,24px)] font-semibold text-primary-600",
  prompt: "text-[clamp(13px,3vw,16px)] leading-[1.6]",
  cardTitle:
    "text-[clamp(14px,3.5vw,18px)] font-medium leading-[1.4] font-[Pretendard]",
};

export const responsiveImage = {
  square: "w-[57%] max-w-[400px] aspect-square",
  result: "w-[57%] max-w-[400px] aspect-square",
  // 카드 이미지용 - 높이 제한
  cardImage: "w-full aspect-[4/3] max-h-[240px] object-cover rounded-lg",
};

/** 버튼 스타일: 너비 + 높이 반응형 */
export const responsiveButton = {
  base: "btn-primary",
  text: "btn-text",
};

export const responsiveSpacing = {
  pagePaddingX: "px-[clamp(16px,5vw,28px)]",
  pagePaddingTop: "pt-[clamp(20px,3vh,40px)]", // 상단 패딩 줄임
  sectionGap: "gap-y-[clamp(20px,4vh,36px)]", // 섹션 간격 줄임
  cardGap: "gap-[clamp(12px,3vw,24px)]",
  // 게임 페이지 전용 간격
  gameCardGap: "gap-y-[clamp(16px,3vh,28px)]", // 카드 간 간격
  vsGap: "gap-y-[clamp(12px,2vh,20px)]", // VS 텍스트 위아래 간격
};

export const responsiveLayout = {
  container: "w-full max-w-container min-w-screen mx-auto",
  pagePaddingX: "px-[clamp(16px,5vw,28px)]",
  sectionGap: "gap-y-[clamp(16px,5vw,32px)]",
  // 게임 페이지용 메인 컨테이너
  gameContainer:
    "w-full max-w-container min-w-screen mx-auto flex flex-col items-center text-center",
  // 카드 컨테이너 - 태블릿에서 최대 높이 제한
  cardContainer: "w-full max-w-[400px] mx-auto",
};

/** 카드 관련 반응형 스타일 */
export const responsiveCard = {
  // 카드 전체 컨테이너 - 높이 제한 중요
  container:
    "w-full max-w-[400px] mx-auto min-h-[200px] max-h-[280px] overflow-hidden",
  // 카드 내용 영역
  content: "flex flex-col h-full",
  // 이미지 영역 - 비율 고정
  imageContainer:
    "flex-shrink-0 w-full aspect-[4/3] max-h-[180px] overflow-hidden rounded-lg",
  // 텍스트 영역 - 남은 공간 활용
  textContainer:
    "flex-1 flex flex-col justify-center p-[clamp(12px,3vw,20px)] min-h-[80px]",
  // 카드 제목
  title:
    "text-[clamp(14px,3.5vw,18px)] font-medium leading-[1.4] font-[Pretendard] text-center",
};

/** 뷰포트별 조건부 스타일 */
export const responsiveBreakpoints = {
  // 모바일: ~767px
  mobile: {
    cardMaxHeight: "max-h-[320px]",
    imageAspect: "aspect-[4/3]",
    gap: "gap-y-[20px]",
  },
  // 태블릿: 768px~1023px
  tablet: {
    cardMaxHeight: "max-h-[280px] md:max-h-[260px]",
    imageAspect: "aspect-[4/3] md:aspect-[16/10]",
    gap: "gap-y-[16px] md:gap-y-[14px]",
  },
  // 데스크톱: 1024px+
  desktop: {
    cardMaxHeight: "lg:max-h-[300px]",
    imageAspect: "lg:aspect-[4/3]",
    gap: "lg:gap-y-[24px]",
  },
};
