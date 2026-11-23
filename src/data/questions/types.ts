export type CategoryId = 'physique' | 'isolement' | 'verbal' | 'cyber' | 'reactions';

export type DifficultyLevel = 1 | 2 | 3;

export interface Question {
  id: string;
  category: CategoryId;
  difficulty: DifficultyLevel;
  minAge: number;
  maxAge: number;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  empathyTip: string;
}

/**
 * Compact authoring tuple:
 * [difficulty, minAge, maxAge, prompt, [opt0, opt1, opt2, opt3], correctIndex, explanation, empathyTip]
 */
export type CompactQuestionTuple = [
  DifficultyLevel,
  number,
  number,
  string,
  [string, string, string, string],
  0 | 1 | 2 | 3,
  string,
  string,
];

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  lightBg: string;
  darkText: string;
  borderColor: string;
}

export const CATEGORY_ORDER: CategoryId[] = [
  'physique',
  'isolement',
  'verbal',
  'cyber',
  'reactions',
];

export const CATEGORY_META: Record<CategoryId, CategoryMeta> = {
  physique: {
    id: 'physique',
    label: 'Harcèlement physique',
    shortLabel: 'Physique',
    description: 'Bousculades répétées, coups, croche-pieds, vol ou dégradation d’affaires.',
    color: '#C94A38',
    lightBg: '#FDF1EE',
    darkText: '#8C2D20',
    borderColor: '#E7B4AB',
  },
  isolement: {
    id: 'isolement',
    label: 'Isolement & exclusion',
    shortLabel: 'Isolement',
    description: 'Mise à l’écart répétée, refus de jouer ensemble, boycott ou silence forcé.',
    color: '#2E66B8',
    lightBg: '#EEF4FC',
    darkText: '#1D447D',
    borderColor: '#AFC6EA',
  },
  verbal: {
    id: 'verbal',
    label: 'Harcèlement verbal',
    shortLabel: 'Verbal',
    description: 'Moqueries répétées, surnoms blessants, insultes, menaces et fausses rumeurs.',
    color: '#C97A16',
    lightBg: '#FEF6E9',
    darkText: '#824C09',
    borderColor: '#EBC897',
  },
  cyber: {
    id: 'cyber',
    label: 'Cyberharcèlement',
    shortLabel: 'Cyber',
    description: 'Messages méchants en ligne, groupes d’exclusion, photos moqueuses sans accord.',
    color: '#6D46A8',
    lightBg: '#F4EFFB',
    darkText: '#492B75',
    borderColor: '#CBB8E6',
  },
  reactions: {
    id: 'reactions',
    label: 'Les bonnes réactions',
    shortLabel: 'Bonnes réactions',
    description: 'Repérer les signaux, agir en allié bienveillant, désamorcer et demander de l’aide.',
    color: '#1E7F5C',
    lightBg: '#ECF8F3',
    darkText: '#14583F',
    borderColor: '#A7D8C5',
  },
};

export interface AgeTierInfo {
  tier: DifficultyLevel;
  label: string;
  ageRange: string;
  schoolLevel: string;
  minAge: number;
  maxAge: number;
  description: string;
}

export const AGE_TIERS: AgeTierInfo[] = [
  {
    tier: 1,
    label: 'Explorateurs',
    ageRange: '6 – 8 ans',
    schoolLevel: 'CP – CE2',
    minAge: 6,
    maxAge: 8,
    description: 'Situations concrètes de la cour, de la cantine et des premiers écrans.',
  },
  {
    tier: 2,
    label: 'Veilleurs',
    ageRange: '9 – 11 ans',
    schoolLevel: 'CM1 – 6e',
    minAge: 9,
    maxAge: 11,
    description: 'Dynamiques de groupe, rumeurs, jeux en ligne et rôle du témoin actif.',
  },
  {
    tier: 3,
    label: 'Ambassadeurs',
    ageRange: '12 – 15 ans',
    schoolLevel: '5e – 3e',
    minAge: 12,
    maxAge: 15,
    description: 'Réseaux sociaux, droit à l’image, 3018, médiation et désamorçage avancé.',
  },
];

export function getTierForAge(age: number): AgeTierInfo {
  if (age <= 8) return AGE_TIERS[0];
  if (age <= 11) return AGE_TIERS[1];
  return AGE_TIERS[2];
}

export function getDifficultyLabel(difficulty: DifficultyLevel): string {
  switch (difficulty) {
    case 1:
      return 'Niveau 1 · Découverte';
    case 2:
      return 'Niveau 2 · Consolidation';
    case 3:
      return 'Niveau 3 · Expert';
  }
}

export function expandQuestions(
  category: CategoryId,
  tuples: CompactQuestionTuple[],
): Question[] {
  return tuples.map((tuple, index) => ({
    id: `${category}-${String(index + 1).padStart(3, '0')}`,
    category,
    difficulty: tuple[0],
    minAge: tuple[1],
    maxAge: tuple[2],
    prompt: tuple[3],
    options: tuple[4],
    correctIndex: tuple[5],
    explanation: tuple[6],
    empathyTip: tuple[7],
  }));
}
