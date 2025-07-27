import { PartnerChoice } from '@/hooks/useGame';

export const partnerChoices: PartnerChoice[]  = [
  {
    round: 1,
    selected: 'both',
    left: { title: '암 진단비', amount: '2천만원' },
    right: { title: '암 치료비', amount: '1천만원' },
  },
  {
    round: 2,
    selected: 'right',
    left: { title: '질병 수술비', amount: '30만원' },
    right: { title: '상해 수술비', amount: '100만원' },
  },
  {
    round: 3,
    selected: 'right',
    left: { title: '중입자 치료', amount: '5천만원' },
    right: { title: '암표적치료비', amount: '3천만원' },
  },
  {
    round: 4,
    selected: 'right',
    left: { title: '갱신형 보험', amount: '' },
    right: { title: '비갱신형 보험', amount: '' },
  },
  {
    round: 5,
    selected: 'both',
    left: { title: '허혈성 심장질환 진단비', amount: '500만원' },
    right: { title: '뇌혈관질환 진단비', amount: '500만원' },
  },
];
