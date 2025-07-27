import { ChoiceOption } from "@/types/game";
import { useState } from "react";

export interface ChoiceData {
  title: string;
  category: string;
  amount: string;
}

export interface GameChoice {
  questionId: string;
  left: ChoiceOption;
  right: ChoiceOption;
  selected: "left" | "right";
}

export interface PartnerChoice {
  round: number;
  left: ChoiceOption;
  right: ChoiceOption;
  selected: "left" | "right" | "both";
}

export const useGameState = () => {
  const [choices, setChoices] = useState<GameChoice[]>([]);

  const recordChoice = (choice: GameChoice) => {
    setChoices((prev) => [...prev, choice]);
    sessionStorage.setItem("userChoices", JSON.stringify([...choices, choice]));
  };

  const resetChoices = () => {
    setChoices([]);
    sessionStorage.removeItem("userChoices");
  };

  const loadChoices = (): GameChoice[] => {
    const raw = sessionStorage.getItem("userChoices");
    return raw ? JSON.parse(raw) : [];
  };

  return { choices, recordChoice, resetChoices, loadChoices };
};
