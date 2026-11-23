import { CYBER_QUESTIONS } from './cyber';
import { ISOLEMENT_QUESTIONS } from './isolement';
import { PHYSIQUE_QUESTIONS } from './physique';
import { REACTIONS_QUESTIONS } from './reactions';
import { CATEGORY_ORDER, CategoryId, Question } from './types';
import { VERBAL_QUESTIONS } from './verbal';

export * from './types';

export const QUESTIONS_BY_CATEGORY: Record<CategoryId, Question[]> = {
  physique: PHYSIQUE_QUESTIONS,
  isolement: ISOLEMENT_QUESTIONS,
  verbal: VERBAL_QUESTIONS,
  cyber: CYBER_QUESTIONS,
  reactions: REACTIONS_QUESTIONS,
};

export const ALL_QUESTIONS: Question[] = CATEGORY_ORDER.flatMap(
  (category) => QUESTIONS_BY_CATEGORY[category],
);

export function getQuestionCountSummary(): {
  total: number;
  byCategory: Record<CategoryId, number>;
} {
  const byCategory = {
    physique: PHYSIQUE_QUESTIONS.length,
    isolement: ISOLEMENT_QUESTIONS.length,
    verbal: VERBAL_QUESTIONS.length,
    cyber: CYBER_QUESTIONS.length,
    reactions: REACTIONS_QUESTIONS.length,
  };
  return {
    total: ALL_QUESTIONS.length,
    byCategory,
  };
}
