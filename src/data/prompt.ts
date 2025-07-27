import { RoundResult } from '@/types/game';
import { analyzeSelectionPattern } from './analysis';
import { insuranceRecommendations } from './recommendation';

export const generatePrompt = (roundResults: RoundResult[]): string => {
  const resultType = analyzeSelectionPattern(roundResults);
  const recommendation = insuranceRecommendations[resultType];

  const selectionDetails = roundResults.map((result, index) => {
    const question = result.question;
    const selected = result.selectedOption;
    const unselected = result.unselectedOption;

    return `**${index + 1}라운드: ${question.title}**\n- 질문: ${question.description}\n- ✅ 선택: ${selected.title} (${selected.description})\n- ❌ 미선택: ${unselected.title} (${unselected.description})\n- 선택 이유 분석: ${selected.detailedDescription}`;
  }).join('\n\n');

  const selectedCategories = roundResults.map(r => r.selectedOption.category);
  const categoryFrequency = selectedCategories.reduce((acc, cat) => {
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const personaGuide = `\n\n---\n\n당신은 보험 컨설턴트입니다.  
클라이언트는 20~30대 직장인으로, 5가지 보험 상황에서 선택을 했습니다.  
그 선택 결과를 기반으로 보험 성향을 분석하고,  
- 맞춤형 상품 제안  
- 위험 인식 성향 분석  
- 보장 부족 영역 진단  
- 실질적인 가입 전략  
을 제공해주세요.  

답변은 친절하지만 과도하게 감성적이지 않게,  
전문성을 갖춘 신뢰도 있는 컨설팅 형태로 작성해주세요.`;

  const prompt = `# 🏥 InsurGuide 보험 성향 분석 결과\n\n## 📊 나의 보험 선택 히스토리\n${selectionDetails}\n\n## 🎯 분석 결과: ${recommendation.title}\n\n**성향 분석:** ${recommendation.description}\n\n**추천 보험 상품:**\n${recommendation.recommendations.map((rec: string) => `• ${rec}`).join('\n')}\n\n**핵심 키워드:** ${recommendation.keywords.join(' | ')}\n\n## 🤖 ChatGPT에게 질문할 내용\n\n위의 보험 선택 결과를 바탕으로 다음과 같이 분석해주세요:\n\n1. **나의 보험 성향 심화 분석**\n   - 선택 패턴에서 드러나는 가치관과 우선순위\n   - 각 선택이 나타내는 위험 관리 철학\n   - 연령대/라이프스타일에 따른 적합성 평가\n\n2. **맞춤형 보험 포트폴리오 제안**\n   - 현재 성향에 맞는 핵심 보험 3-5개 추천\n   - 각 보험의 가입 우선순위와 이유\n   - 예상 월 보험료 범위 및 예산 배분 가이드\n\n3. **부족한 보장 영역 진단**\n   - 선택하지 않은 옵션들이 의미하는 위험 요소\n   - 보완이 필요한 보장 영역 식별\n   - 향후 라이프스타일 변화 시 고려사항\n\n4. **보험 가입 실행 로드맵**\n   - 단계별 가입 순서와 타이밍\n   - 보험사별 상품 비교 포인트\n   - 보험료 절약 및 최적화 방법\n\n**선택된 카테고리 빈도:**\n${Object.entries(categoryFrequency).map(([cat, count]) => `• ${cat}: ${count}회`).join('\n')}${personaGuide}\n\n---\n*이 분석 결과를 ChatGPT에 복사하여 더 자세한 맞춤 상담을 받아보세요!*`;

  return prompt;
};

export const promptTemplates = {
  basic: generatePrompt,
  detailed: (roundResults: RoundResult[]) => {
    const basicPrompt = generatePrompt(roundResults);
    return `${basicPrompt}\n\n## 🔍 추가 분석 요청\n\n다음 관점에서도 분석해주세요:\n- 행동경제학적 관점에서의 선택 패턴 분석\n- 보험업계 최신 트렌드와 내 성향의 매칭도\n- 국내외 보험 상품 비교 및 글로벌 기준 적합성\n- 세제 혜택을 고려한 보험 포트폴리오 최적화\n- 디지털 보험 서비스 활용 방안`;
  },
  simple: (roundResults: RoundResult[]) => {
    const resultType = analyzeSelectionPattern(roundResults);
    const recommendation = insuranceRecommendations[resultType];

    return `내 보험 성향: ${recommendation.title}\n\n5라운드 선택 결과를 바탕으로 맞춤형 보험 상품 3개와 가입 우선순위를 추천해주세요.\n\n선택 내역:\n${roundResults.map((r, i) => `${i + 1}. ${r.selectedOption.title} vs ${r.unselectedOption.title} → ${r.selectedOption.title} 선택`).join('\n')}`;
  }
};
