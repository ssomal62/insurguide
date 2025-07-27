import { InsuranceType } from './insuranceTypes';

export const insuranceRecommendations: Record<InsuranceType, {
  title: string;
  description: string;
  recommendations: string[];
  keywords: string[];
}> = {
  stability_seeker: {
    title: '🏛️ 안정성 추구형',
    description: '장기적인 안정성과 확실한 보장을 중시하는 신중한 성향',
    recommendations: [
      '종신보험으로 평생 보장 확보',
      '연금보험으로 노후 생활 안정성 준비',
      '정기적인 건강검진으로 예방 중심 관리'
    ],
    keywords: ['안정성', '장기보장', '신중함', '계획성']
  },
  practical_optimizer: {
    title: '⚡ 실용성 중시형',
    description: '현실적이고 효율적인 보장을 선호하는 합리적 성향',
    recommendations: [
      '실손의료보험으로 실제 의료비 보장',
      '종합상해보험으로 일상 위험 대비',
      '개인배상책임보험으로 생활 배상 위험 관리'
    ],
    keywords: ['실용성', '효율성', '합리성', '현실성']
  },
  family_protector: {
    title: '👨‍👩‍👧‍👦 가족 중심형',
    description: '가족의 안전과 미래를 최우선으로 생각하는 보호자 성향',
    recommendations: [
      '어린이보험으로 자녀 종합 보장',
      '가족의료보험으로 가족 단위 의료비 관리',
      '간병보험으로 가족 구성원 노후 대비'
    ],
    keywords: ['가족보호', '자녀우선', '종합보장', '미래계획']
  },
  adventurous_explorer: {
    title: '🌍 모험가형',
    description: '새로운 경험과 도전을 즐기며 글로벌한 시야를 가진 성향',
    recommendations: [
      '여행자보험으로 해외 활동 대비',
      '해외장기체류보험으로 글로벌 생활 준비',
      '스포츠상해보험으로 활동적인 라이프스타일 보장'
    ],
    keywords: ['모험정신', '글로벌', '활동성', '도전정신']
  },
  health_guardian: {
    title: '💪 건강 관리형',
    description: '건강을 가장 큰 자산으로 여기며 예방과 관리를 중시하는 성향',
    recommendations: [
      '건강검진보험으로 예방 중심 건강관리',
      '암보험으로 중대질병 집중 대비',
      '글로벌의료보험으로 최고 수준 의료서비스 확보'
    ],
    keywords: ['건강우선', '예방중심', '의료품질', '자기관리']
  },
  responsible_leader: {
    title: '🛡️ 책임감형',
    description: '타인에 대한 책임감이 강하고 사회적 의무를 중시하는 성향',
    recommendations: [
      '대인/대물 무제한 자동차보험으로 완전한 배상 보장',
      '사업자배상책임보험으로 업무상 책임 관리',
      '개인배상책임보험으로 일상 배상 위험 대비'
    ],
    keywords: ['책임감', '배상보장', '사회성', '신뢰성']
  },
  future_planner: {
    title: '📈 미래 계획형',
    description: '장기적인 관점에서 체계적으로 미래를 준비하는 계획적 성향',
    recommendations: [
      '연금보험으로 체계적인 노후 준비',
      '소득보상보험으로 수입 중단 위험 대비',
      '종신보험으로 평생 보장 설계'
    ],
    keywords: ['미래지향', '체계성', '계획성', '장기투자']
  },
  digital_native: {
    title: '💻 디지털 네이티브형',
    description: '디지털 환경에 익숙하며 새로운 위험에 대한 인식이 높은 성향',
    recommendations: [
      '사이버보험으로 디지털 위험 대비',
      '글로벌의료보험으로 국경 없는 보장',
      '소득보상보험으로 디지털 노마드 생활 보장'
    ],
    keywords: ['디지털', '혁신성', '적응력', '미래지향']
  }
};
