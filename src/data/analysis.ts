import { RoundResult } from '@/types/game';
import { categoryMapping } from './categoryMapping';
import { InsuranceType } from './insuranceTypes';

export const analyzeSelectionPattern = (roundResults: RoundResult[]): InsuranceType => {
  const categoryCount: Record<string, number> = {};
  const tendencyCount: Record<string, number> = {};

  roundResults.forEach(result => {
    const category = result.selectedOption.category;
    const tendency = categoryMapping[category as keyof typeof categoryMapping]?.tendency;
    const weight = categoryMapping[category as keyof typeof categoryMapping]?.weight || 1;

    categoryCount[category] = (categoryCount[category] || 0) + weight;
    if (tendency) {
      tendencyCount[tendency] = (tendencyCount[tendency] || 0) + weight;
    }
  });

  const stabilityScore = (tendencyCount.stability_seeking || 0) + (tendencyCount.future_planning || 0);
  const familyScore = (tendencyCount.family_oriented || 0) + (tendencyCount.comprehensive || 0);
  const healthScore = (tendencyCount.health_conscious || 0) + (tendencyCount.preventive || 0);
  const adventureScore = (tendencyCount.adventurous || 0) + (tendencyCount.global_minded || 0);
  const responsibilityScore = (tendencyCount.responsible || 0) + (tendencyCount.socially_responsible || 0);
  const digitalScore = (tendencyCount.tech_savvy || 0) + (tendencyCount.internationally_aware || 0);

  const scores: Record<InsuranceType, number> = {
    stability_seeker: stabilityScore,
    family_protector: familyScore,
    health_guardian: healthScore,
    adventurous_explorer: adventureScore,
    responsible_leader: responsibilityScore,
    digital_native: digitalScore,
    practical_optimizer: tendencyCount.practical || 0,
    future_planner: tendencyCount.future_planning || 0
  };

  const resultType = Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0] as InsuranceType;
  return resultType;
};
