import { useCallback, useState } from 'react';
import { RoundResult } from '@/types/game';
import { analyzeSelectionPattern } from '@/data/analysis';
import { promptTemplates } from '@/data/prompt';
import { InsuranceType } from '@/data/insuranceTypes';

/**
 * 프롬프트 생성 결과
 */
interface PromptResult {
  prompt: string;
  metadata: {
    resultType: InsuranceType;
    roundCount: number;
    categories: string[];
    generatedAt: number;
  };
}

/**
 * 게임 결과 기반 프롬프트 생성 훅
 */
export const usePromptGeneration = () => {
  /**
   * 기본 프롬프트 생성 (고급 분석 기반)
   */
  const generateBasicPrompt = useCallback((
    roundResults: RoundResult[],
  ): PromptResult => {
    const resultType = analyzeSelectionPattern(roundResults);
    const categories = roundResults.map(result => result.selectedOption.category);

    const promptText = promptTemplates.basic(roundResults);

    return {
      prompt: promptText,
      metadata: {
        resultType,
        roundCount: roundResults.length,
        categories,
        generatedAt: Date.now()
      }
    };
  }, []);

  /**
   * 상세 분석 프롬프트 생성
   */
  const generateDetailedPrompt = useCallback((roundResults: RoundResult[]): PromptResult => {
    const resultType = analyzeSelectionPattern(roundResults);
    const categories = roundResults.map(result => result.selectedOption.category);

    const promptText = promptTemplates.detailed(roundResults);

    return {
      prompt: promptText,
      metadata: {
        resultType,
        roundCount: roundResults.length,
        categories,
        generatedAt: Date.now()
      }
    };
  }, []);

  /**
   * 간단한 프롬프트 생성
   */
  const generateSimplePrompt = useCallback((roundResults: RoundResult[]): PromptResult => {
    const resultType = analyzeSelectionPattern(roundResults);
    const categories = roundResults.map(result => result.selectedOption.category);

    const promptText = promptTemplates.simple(roundResults);

    return {
      prompt: promptText,
      metadata: {
        resultType,
        roundCount: roundResults.length,
        categories,
        generatedAt: Date.now()
      }
    };
  }, []);

  /**
   * 커스텀 프롬프트 생성 (고급 사용자용)
   */
  const generateCustomPrompt = useCallback((
    roundResults: RoundResult[],
    customTemplate: string
  ): PromptResult => {
    const resultType = analyzeSelectionPattern(roundResults);
    const categories = roundResults.map(result => result.selectedOption.category);

    let customPrompt = customTemplate
      .replace(/\{resultType\}/g, resultType)
      .replace(/\{roundCount\}/g, roundResults.length.toString());

    roundResults.forEach((result, index) => {
      const roundNum = index + 1;
      customPrompt = customPrompt
        .replace(new RegExp(`\\{round${roundNum}_question\\}`, 'g'), result.question.title)
        .replace(new RegExp(`\\{round${roundNum}_selected\\}`, 'g'), result.selectedOption.title)
        .replace(new RegExp(`\\{round${roundNum}_unselected\\}`, 'g'), result.unselectedOption.title);
    });

    return {
      prompt: customPrompt,
      metadata: {
        resultType,
        roundCount: roundResults.length,
        categories,
        generatedAt: Date.now()
      }
    };
  }, []);

  /**
   * 프롬프트 미리보기 생성
   */
  const generatePreview = useCallback((roundResults: RoundResult[]): string => {
    if (roundResults.length === 0) return '';

    const resultType = analyzeSelectionPattern(roundResults);
    const selectedCategories = roundResults.map(r => r.selectedOption.category);
    const uniqueCategories = [...new Set(selectedCategories)];

    return `현재까지의 선택 패턴: ${resultType}\n선택된 카테고리: ${uniqueCategories.join(', ')}\n완료된 라운드: ${roundResults.length}/5`;
  }, []);

  return {
    generateBasicPrompt,
    generateDetailedPrompt,
    generateSimplePrompt,
    generateCustomPrompt,
    generatePreview,
    analyzeSelectionPattern
  };
};

/**
 * 프롬프트 템플릿 관리 훅 (고급 기능)
 */
export const usePromptTemplates = () => {
  const [customTemplates, setCustomTemplates] = useState<Record<string, string>>({});

  const saveTemplate = useCallback((name: string, template: string) => {
    setCustomTemplates(prev => ({
      ...prev,
      [name]: template
    }));
  }, []);

  const deleteTemplate = useCallback((name: string) => {
    setCustomTemplates(prev => {
      const newTemplates = { ...prev };
      delete newTemplates[name];
      return newTemplates;
    });
  }, []);

  const getTemplate = useCallback((name: string): string | null => {
    return customTemplates[name] || null;
  }, [customTemplates]);

  const getAllTemplates = useCallback(() => {
    return {
      ...promptTemplates,
      ...customTemplates
    };
  }, [customTemplates]);

  return {
    saveTemplate,
    deleteTemplate,
    getTemplate,
    getAllTemplates,
    customTemplates
  };
};
