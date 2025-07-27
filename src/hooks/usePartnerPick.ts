import { useState } from 'react';
import { PartnerPick } from '@/types/partner';

export const usePartnerPick = () => {
  const [partnerPicks, setPartnerPicks] = useState<PartnerPick[]>([]);

  const savePick = (round: number, left: boolean, right: boolean) => {
    setPartnerPicks(prev => {
      const existing = prev.find(p => p.round === round);
      if (existing) {
        return prev.map(p =>
          p.round === round ? { ...p, picks: { left, right } } : p
        );
      }
      return [...prev, { round, picks: { left, right } }];
    });
  };

  const getPickForRound = (round: number): PartnerPick | undefined =>
    partnerPicks.find(p => p.round === round);

  return { partnerPicks, savePick, getPickForRound };
};
