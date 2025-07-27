import { GameChoice } from '@/hooks/useGame';
import { RoundResult } from '@/types/game';

export const convertGameChoicesToRoundResults = (choices: GameChoice[]): RoundResult[] => {
  const toFullOption = (choice: any) => ({
    id: '',
    title: choice.title,
    amount: choice.amount ?? '',
    description: '',
    detailedDescription: '',
    category: choice.category!,
    imagePath: '',
    imageAlt: '',
  });

  return choices.map((choice, index) => {
    const selectedKey = choice.selected;
    const unselectedKey = selectedKey === 'left' ? 'right' : 'left';

    return {
      round: index + 1,
      selectionTime: Date.now(),
      question: {
        id: choice.questionId,
        title: '',
        description: '',
        designIntent: '',
        options: [
          toFullOption(choice.left),
          toFullOption(choice.right),
        ]
      },
      selectedOption: toFullOption(choice[selectedKey]),
      unselectedOption: toFullOption(choice[unselectedKey]),
    };
  });
};
