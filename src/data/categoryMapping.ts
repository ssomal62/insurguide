export const categoryMapping = {
  // 보장 성향
  travel_focused: { weight: 1, tendency: 'adventurous' },
  health_focused: { weight: 1, tendency: 'health_conscious' },
  long_term_stability: { weight: 2, tendency: 'stability_seeking' },
  practical_coverage: { weight: 1, tendency: 'practical' },

  // 책임감 성향
  responsibility_focused: { weight: 2, tendency: 'responsible' },
  self_protection: { weight: 1, tendency: 'self_caring' },

  // 가족 성향
  family_focused: { weight: 2, tendency: 'family_oriented' },
  comprehensive_family: { weight: 1, tendency: 'comprehensive' },

  // 건강 관리 성향
  critical_illness: { weight: 2, tendency: 'risk_aware' },
  preventive_care: { weight: 1, tendency: 'preventive' },

  // 경제적 성향
  income_protection: { weight: 2, tendency: 'income_focused' },
  business_liability: { weight: 1, tendency: 'business_minded' },

  // 노후 성향
  retirement_income: { weight: 2, tendency: 'future_planning' },
  long_term_care: { weight: 2, tendency: 'care_conscious' },

  // 글로벌 성향
  overseas_comprehensive: { weight: 1, tendency: 'global_minded' },
  global_medical: { weight: 1, tendency: 'internationally_aware' },

  // 활동 성향
  sports_specialized: { weight: 1, tendency: 'active_lifestyle' },
  comprehensive_accident: { weight: 1, tendency: 'safety_conscious' },

  // 디지털 성향
  digital_protection: { weight: 1, tendency: 'tech_savvy' },
  personal_liability: { weight: 1, tendency: 'socially_responsible' },

  // 추가된 카테고리
  renewal: { weight: 2, tendency: 'practical' },
  non_renewal: { weight: 2, tendency: 'stability_seeking' },
  heart_disease: { weight: 2, tendency: 'risk_aware' },
  brain_disease: { weight: 2, tendency: 'risk_aware' },
};
