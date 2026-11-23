import { MinigameId } from '../data/minigames';
import {
  ALL_QUESTIONS,
  CATEGORY_ORDER,
  CategoryId,
  DifficultyLevel,
  QUESTIONS_BY_CATEGORY,
  Question,
  getTierForAge,
} from '../data/questions';
import { BOARD_NODE_MAP, getReachableNodes } from './board';

export type GamePhase = 'title' | 'playing' | 'paused' | 'gameover';

export type TurnStage =
  | 'ready-to-roll'
  | 'choose-destination'
  | 'answering'
  | 'minigame'
  | 'turn-feedback';

export type AvatarTotemId = 'renard' | 'hibou' | 'loutre' | 'panda' | 'herisson' | 'colibri';

export interface AvatarTotem {
  id: AvatarTotemId;
  defaultName: string;
  color: string;
  ringColor: string;
}

export const AVATAR_TOTEMS: AvatarTotem[] = [
  { id: 'renard', defaultName: 'Renard', color: '#C94A38', ringColor: '#F7D2CC' },
  { id: 'hibou', defaultName: 'Hibou', color: '#2E66B8', ringColor: '#C9DCF7' },
  { id: 'loutre', defaultName: 'Loutre', color: '#1E7F5C', ringColor: '#C4EAD9' },
  { id: 'panda', defaultName: 'Panda', color: '#6D46A8', ringColor: '#DFD2F4' },
  { id: 'herisson', defaultName: 'Hérisson', color: '#C97A16', ringColor: '#F7DFBE' },
  { id: 'colibri', defaultName: 'Colibri', color: '#0E7490', ringColor: '#BFEAF3' },
];

export interface EmpathyBadge {
  id: string;
  title: string;
  description: string;
}

export const EMPATHY_BADGES: EmpathyBadge[] = [
  {
    id: 'premier-pas',
    title: 'Premier pas d’allié',
    description: 'Réussir sa première question avec empathie.',
  },
  {
    id: 'main-tendue',
    title: 'Main tendue',
    description: 'S’entraider avec un autre joueur grâce au Coup de pouce bienveillant.',
  },
  {
    id: 'bouclier-cyber',
    title: 'Bouclier numérique',
    description: 'Remporter le camembert Cyberharcèlement ou réussir le mini-jeu Cyber.',
  },
  {
    id: 'coeur-ecoute',
    title: 'Écoute attentive',
    description: 'Atteindre 50 points d’empathie en partie.',
  },
  {
    id: 'atelier-social',
    title: 'Champion des mini-jeux',
    description: 'Terminer avec succès un mini-jeu de compétences sociales.',
  },
  {
    id: 'boussole-or',
    title: 'Boussole d’or',
    description: 'Réunir les 5 camemberts et remporter le défi final.',
  },
];

export const SAFE_ENCOURAGEMENTS: string[] = [
  'Bravo pour ta super réflexion !',
  'J’adore ton esprit d’entraide !',
  'Continue comme ça, tu assures !',
  'Merci de jouer avec autant de bienveillance !',
  'Belle réponse pleine d’empathie !',
  'On forme une équipe formidable !',
];

export interface Player {
  id: string;
  name: string;
  totem: AvatarTotemId;
  color: string;
  nodeId: string;
  wedges: CategoryId[];
  empathyScore: number;
  coopHearts: number;
  correctCount: number;
  answeredCount: number;
  minigamesWon: number;
  badges: string[];
}

export interface EncouragementEntry {
  id: string;
  fromName: string;
  toName: string;
  message: string;
}

export interface AnswerOutcome {
  question: Question;
  selectedIndex: number;
  isCorrect: boolean;
  awardedWedge: CategoryId | null;
  empathyDelta: number;
  coopBonusAwarded: boolean;
  helperName: string | null;
  wasFinalChallenge: boolean;
  newlyUnlockedBadges: string[];
}

export interface GameConfig {
  age: number;
  players: Array<{ name: string; totem: AvatarTotemId }>;
}

export interface GameState {
  phase: GamePhase;
  age: number;
  players: Player[];
  activePlayerIndex: number;
  turnNumber: number;
  turnStage: TurnStage;
  diceValue: number | null;
  reachableNodeIds: string[];
  activeQuestion: Question | null;
  isFinalChallenge: boolean;
  activeMinigame: MinigameId | null;
  eliminatedOptionIndex: number | null;
  helperPlayerId: string | null;
  lastOutcome: AnswerOutcome | null;
  statusBanner: string;
  usedQuestionIds: string[];
  encouragements: EncouragementEntry[];
  winnerPlayerId: string | null;
}

export function clampAge(age: number): number {
  return Math.max(6, Math.min(15, Math.round(age)));
}

export function createInitialPlayers(
  playerSpecs: Array<{ name: string; totem: AvatarTotemId }>,
): Player[] {
  const safeSpecs =
    playerSpecs.length > 0
      ? playerSpecs.slice(0, 4)
      : [
          { name: 'Renard', totem: 'renard' as AvatarTotemId },
          { name: 'Hibou', totem: 'hibou' as AvatarTotemId },
        ];

  return safeSpecs.map((spec, idx) => {
    const totemDef = AVATAR_TOTEMS.find((t) => t.id === spec.totem) ?? AVATAR_TOTEMS[idx % AVATAR_TOTEMS.length];
    const cleanName = spec.name.trim().slice(0, 18) || totemDef.defaultName;
    return {
      id: `player-${idx + 1}`,
      name: cleanName,
      totem: totemDef.id,
      color: totemDef.color,
      nodeId: 'hub',
      wedges: [],
      empathyScore: 0,
      coopHearts: 0,
      correctCount: 0,
      answeredCount: 0,
      minigamesWon: 0,
      badges: [],
    };
  });
}

export function createInitialGameState(
  config: GameConfig,
  initialPhase: GamePhase = 'title',
): GameState {
  const age = clampAge(config.age);
  const players = createInitialPlayers(config.players);
  return {
    phase: initialPhase,
    age,
    players,
    activePlayerIndex: 0,
    turnNumber: 1,
    turnStage: 'ready-to-roll',
    diceValue: null,
    reachableNodeIds: [],
    activeQuestion: null,
    isFinalChallenge: false,
    activeMinigame: null,
    eliminatedOptionIndex: null,
    helperPlayerId: null,
    lastOutcome: null,
    statusBanner: `C’est au tour de ${players[0].name} : lance le dé pour avancer sur le plateau.`,
    usedQuestionIds: [],
    encouragements: [],
    winnerPlayerId: null,
  };
}

export function shuffleArray<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function shuffleQuestionOptions(
  question: Question,
  rng: () => number = Math.random,
): Question {
  const indexed = question.options.map((text, idx) => ({
    text,
    isCorrect: idx === question.correctIndex,
  }));
  const shuffled = shuffleArray(indexed, rng);
  const newCorrectIndex = shuffled.findIndex((item) => item.isCorrect) as 0 | 1 | 2 | 3;

  return {
    ...question,
    options: [
      shuffled[0].text,
      shuffled[1].text,
      shuffled[2].text,
      shuffled[3].text,
    ],
    correctIndex: newCorrectIndex,
  };
}

/**
 * Selects an age-appropriate question with progressive difficulty scaling:
 * - Age maps to a baseline tier (6-8 -> 1, 9-11 -> 2, 12-15 -> 3).
 * - Within the player's progression, earlier turns draw from easier/exact-tier
 *   questions, and as the player accumulates wedges/correct answers, difficulty
 *   smoothly ramps upward (and stays age-safe for 6-8 year olds).
 * - Always randomizes the A/B/C/D answer order while preserving the correct answer.
 */
export function selectProgressiveQuestion(
  category: CategoryId,
  age: number,
  playerCorrectCount: number,
  usedQuestionIds: string[],
  rng: () => number = Math.random,
): Question {
  const safeAge = clampAge(age);
  const baseTier = getTierForAge(safeAge).tier;
  const categoryPool = QUESTIONS_BY_CATEGORY[category];
  const usedSet = new Set(usedQuestionIds);

  // Determine target difficulty progression based on age & player experience
  let preferredDifficulties: DifficultyLevel[];
  if (baseTier === 1) {
    // 6-8 ans: primarily tier 1 (age-appropriate vocabulary); if age === 8 and experienced, allow gentle tier 2 stretch
    preferredDifficulties = safeAge === 8 && playerCorrectCount >= 6 ? [1, 2] : [1];
  } else if (baseTier === 2) {
    // 9-11 ans: start gently with mix of 1/2, ramp firmly to 2, then stretch to 3 for 11yo experts
    if (playerCorrectCount < 2) {
      preferredDifficulties = [1, 2];
    } else if (safeAge === 11 && playerCorrectCount >= 6) {
      preferredDifficulties = [2, 3];
    } else {
      preferredDifficulties = [2, 1];
    }
  } else {
    // 12-15 ans: warm up with tier 2 on very first turn, then progress into tier 3
    preferredDifficulties = playerCorrectCount === 0 ? [2, 3] : [3, 2];
  }

  for (const diff of preferredDifficulties) {
    const fresh = categoryPool.filter((q) => q.difficulty === diff && !usedSet.has(q.id));
    if (fresh.length > 0) {
      return shuffleQuestionOptions(fresh[Math.floor(rng() * fresh.length)], rng);
    }
  }

  // Fallback: any unused question in the category closest to baseTier
  const anyUnused = categoryPool.filter((q) => !usedSet.has(q.id));
  if (anyUnused.length > 0) {
    anyUnused.sort(
      (a, b) => Math.abs(a.difficulty - baseTier) - Math.abs(b.difficulty - baseTier),
    );
    return shuffleQuestionOptions(anyUnused[0], rng);
  }

  // Full deck exhausted: recycle matching tier
  const sameTier = categoryPool.filter((q) => q.difficulty === baseTier);
  const pool = sameTier.length > 0 ? sameTier : categoryPool;
  const picked = pool[Math.floor(rng() * pool.length)] ?? ALL_QUESTIONS[0];
  return shuffleQuestionOptions(picked, rng);
}

export function rollDiceAction(
  state: GameState,
  forcedRoll?: number,
  rng: () => number = Math.random,
): GameState {
  if (state.phase !== 'playing' || state.turnStage !== 'ready-to-roll') {
    return state;
  }
  const activePlayer = state.players[state.activePlayerIndex];
  const roll =
    forcedRoll !== undefined
      ? Math.max(1, Math.min(6, Math.round(forcedRoll)))
      : Math.floor(rng() * 6) + 1;

  const reachableNodeIds = getReachableNodes(activePlayer.nodeId, roll);

  return {
    ...state,
    diceValue: roll,
    reachableNodeIds,
    turnStage: 'choose-destination',
    lastOutcome: null,
    statusBanner: `${activePlayer.name} a fait ${roll} ! Choisis une case illuminée sur le plateau.`,
  };
}

export function movePlayerToNode(
  state: GameState,
  targetNodeId: string,
  rng: () => number = Math.random,
): GameState {
  if (
    state.phase !== 'playing' ||
    state.turnStage !== 'choose-destination' ||
    !state.reachableNodeIds.includes(targetNodeId)
  ) {
    return state;
  }

  const targetNode = BOARD_NODE_MAP[targetNodeId];
  if (!targetNode) return state;

  const activePlayer = state.players[state.activePlayerIndex];
  const updatedPlayers = state.players.map((p, idx) =>
    idx === state.activePlayerIndex ? { ...p, nodeId: targetNodeId } : p,
  );

  // Case 1: Replay / Empathy Star space
  if (targetNode.kind === 'replay') {
    const bonusPlayers = updatedPlayers.map((p, idx) =>
      idx === state.activePlayerIndex
        ? applyBadges({ ...p, empathyScore: p.empathyScore + 10 })
        : p,
    );
    return {
      ...state,
      players: bonusPlayers,
      reachableNodeIds: [],
      diceValue: null,
      turnStage: 'ready-to-roll',
      statusBanner: `Étoile d’Entraide ! ${activePlayer.name} gagne +10 pts d’empathie et rejoue !`,
    };
  }

  // Case 2: Minigame space
  if (targetNode.kind === 'minigame') {
    const minigamePool: MinigameId[] = ['word-detector', 'cyber-sort', 'inclusion-circle'];
    const picked = minigamePool[Math.floor(rng() * minigamePool.length)];
    return {
      ...state,
      players: updatedPlayers,
      reachableNodeIds: [],
      turnStage: 'minigame',
      activeMinigame: picked,
      statusBanner: `${activePlayer.name} découvre un atelier Mini-Jeu de compétences sociales !`,
    };
  }

  // Case 3: Hub — Final challenge if player already has all 5 wedges, otherwise pick a missing category
  const hasAllWedges = activePlayer.wedges.length === CATEGORY_ORDER.length;
  let questionCategory: CategoryId;
  let isFinalChallenge = false;

  if (targetNode.kind === 'hub') {
    if (hasAllWedges) {
      isFinalChallenge = true;
      questionCategory = 'reactions';
    } else {
      const missing = CATEGORY_ORDER.filter((c) => !activePlayer.wedges.includes(c));
      questionCategory = missing[Math.floor(rng() * missing.length)] ?? 'reactions';
    }
  } else {
    questionCategory = targetNode.category ?? 'reactions';
  }

  const question = selectProgressiveQuestion(
    questionCategory,
    state.age,
    activePlayer.correctCount,
    state.usedQuestionIds,
    rng,
  );

  return {
    ...state,
    players: updatedPlayers,
    reachableNodeIds: [],
    turnStage: 'answering',
    activeQuestion: question,
    isFinalChallenge,
    eliminatedOptionIndex: null,
    helperPlayerId: null,
    usedQuestionIds: [...state.usedQuestionIds, question.id],
    statusBanner: isFinalChallenge
      ? `Défi final de la Boussole pour ${activePlayer.name} !`
      : `Question pour ${activePlayer.name} !`,
  };
}

/**
 * Cooperative mechanic: in multiplayer, another player can lend a friendly hand
 * ("Coup de pouce bienveillant") before the answer is submitted, removing one
 * incorrect option and unlocking a shared Coop Heart if answered correctly.
 */
export function activateCoopHint(
  state: GameState,
  helperPlayerId: string,
  rng: () => number = Math.random,
): GameState {
  if (
    state.turnStage !== 'answering' ||
    !state.activeQuestion ||
    state.helperPlayerId !== null
  ) {
    return state;
  }
  const activePlayer = state.players[state.activePlayerIndex];
  const helper = state.players.find((p) => p.id === helperPlayerId && p.id !== activePlayer.id);
  if (!helper) return state;

  const wrongIndices = [0, 1, 2, 3].filter((i) => i !== state.activeQuestion!.correctIndex);
  const eliminatedOptionIndex = wrongIndices[Math.floor(rng() * wrongIndices.length)];

  return {
    ...state,
    helperPlayerId: helper.id,
    eliminatedOptionIndex,
    statusBanner: `${helper.name} offre un Coup de pouce bienveillant à ${activePlayer.name} !`,
  };
}

function applyBadges(player: Player, wonFinal = false): Player {
  const next = new Set(player.badges);
  if (player.correctCount >= 1) next.add('premier-pas');
  if (player.coopHearts >= 1) next.add('main-tendue');
  if (player.wedges.includes('cyber')) next.add('bouclier-cyber');
  if (player.empathyScore >= 50) next.add('coeur-ecoute');
  if (player.minigamesWon >= 1) next.add('atelier-social');
  if (wonFinal) next.add('boussole-or');
  return { ...player, badges: Array.from(next) };
}

export function submitQuestionAnswer(state: GameState, selectedIndex: number): GameState {
  if (state.turnStage !== 'answering' || !state.activeQuestion) {
    return state;
  }

  const question = state.activeQuestion;
  const activePlayer = state.players[state.activePlayerIndex];
  const currentNode = BOARD_NODE_MAP[activePlayer.nodeId];
  const isCorrect = selectedIndex === question.correctIndex;

  let awardedWedge: CategoryId | null = null;
  let empathyDelta = 0;
  let coopBonusAwarded = false;
  let helperName: string | null = null;
  let wonGame = false;

  if (isCorrect) {
    empathyDelta = state.isFinalChallenge ? 25 : currentNode?.kind === 'hq' ? 20 : 12;

    if (
      currentNode?.kind === 'hq' &&
      currentNode.category &&
      !activePlayer.wedges.includes(currentNode.category)
    ) {
      awardedWedge = currentNode.category;
    }

    if (state.isFinalChallenge && activePlayer.wedges.length === CATEGORY_ORDER.length) {
      wonGame = true;
    }

    if (state.helperPlayerId) {
      coopBonusAwarded = true;
      helperName = state.players.find((p) => p.id === state.helperPlayerId)?.name ?? null;
    }
  } else {
    // Even on a wrong answer, reading the explanation encourages learning (+2 empathy effort)
    empathyDelta = 2;
  }

  const prevBadges = new Set(activePlayer.badges);

  const updatedPlayers = state.players.map((p, idx) => {
    if (idx === state.activePlayerIndex) {
      const updatedWedges = awardedWedge ? [...p.wedges, awardedWedge] : p.wedges;
      const baseUpdated: Player = {
        ...p,
        wedges: updatedWedges,
        empathyScore: p.empathyScore + empathyDelta + (coopBonusAwarded ? 5 : 0),
        coopHearts: p.coopHearts + (coopBonusAwarded ? 1 : 0),
        correctCount: p.correctCount + (isCorrect ? 1 : 0),
        answeredCount: p.answeredCount + 1,
      };
      return applyBadges(baseUpdated, wonGame);
    }

    if (coopBonusAwarded && p.id === state.helperPlayerId) {
      return applyBadges({
        ...p,
        empathyScore: p.empathyScore + 10,
        coopHearts: p.coopHearts + 1,
      });
    }

    return p;
  });

  const activeAfter = updatedPlayers[state.activePlayerIndex];
  const newlyUnlockedBadges = activeAfter.badges.filter((b) => !prevBadges.has(b));

  const outcome: AnswerOutcome = {
    question,
    selectedIndex,
    isCorrect,
    awardedWedge,
    empathyDelta: empathyDelta + (coopBonusAwarded ? 5 : 0),
    coopBonusAwarded,
    helperName,
    wasFinalChallenge: state.isFinalChallenge,
    newlyUnlockedBadges,
  };

  if (wonGame) {
    return {
      ...state,
      phase: 'gameover',
      players: updatedPlayers,
      turnStage: 'turn-feedback',
      lastOutcome: outcome,
      winnerPlayerId: activeAfter.id,
      statusBanner: `${activeAfter.name} remporte La Boussole de l’Entraide !`,
    };
  }

  return {
    ...state,
    players: updatedPlayers,
    turnStage: 'turn-feedback',
    lastOutcome: outcome,
    statusBanner: isCorrect
      ? awardedWedge
        ? `Bravo ${activeAfter.name} ! Camembert remporté — tu gardes la main !`
        : `Bonne réponse ${activeAfter.name} ! Tu peux relancer le dé.`
      : `Bien essayé ${activeAfter.name} ! Découvre l’explication avant le tour suivant.`,
  };
}

export function continueAfterFeedback(state: GameState): GameState {
  if (state.phase === 'gameover') return state;
  if (state.turnStage !== 'turn-feedback') return state;

  const keptTurn = state.lastOutcome?.isCorrect === true;
  const nextIndex = keptTurn
    ? state.activePlayerIndex
    : (state.activePlayerIndex + 1) % state.players.length;
  const nextPlayer = state.players[nextIndex];

  return {
    ...state,
    activePlayerIndex: nextIndex,
    turnNumber: keptTurn ? state.turnNumber : state.turnNumber + 1,
    turnStage: 'ready-to-roll',
    diceValue: null,
    activeQuestion: null,
    isFinalChallenge: false,
    eliminatedOptionIndex: null,
    helperPlayerId: null,
    lastOutcome: null,
    statusBanner:
      nextPlayer.wedges.length === CATEGORY_ORDER.length
        ? `${nextPlayer.name} a les 5 camemberts ! Rejoins la Boussole centrale pour le défi final.`
        : keptTurn
          ? `${nextPlayer.name} garde la main ! Lance le dé.`
          : `C’est au tour de ${nextPlayer.name} : lance le dé.`,
  };
}

export function completeMinigameOnBoard(
  state: GameState,
  success: boolean,
  bonusPoints: number,
  minigameId: MinigameId,
): GameState {
  if (state.turnStage !== 'minigame') return state;

  const activePlayer = state.players[state.activePlayerIndex];
  const updatedPlayers = state.players.map((p, idx) => {
    if (idx !== state.activePlayerIndex) return p;
    const nextBadges = new Set(p.badges);
    if (success && minigameId === 'cyber-sort') {
      nextBadges.add('bouclier-cyber');
    }
    return applyBadges({
      ...p,
      empathyScore: p.empathyScore + Math.max(5, bonusPoints),
      minigamesWon: p.minigamesWon + (success ? 1 : 0),
      badges: Array.from(nextBadges),
    });
  });

  const nextIndex = success
    ? state.activePlayerIndex
    : (state.activePlayerIndex + 1) % state.players.length;
  const nextPlayer = updatedPlayers[nextIndex];

  return {
    ...state,
    players: updatedPlayers,
    activePlayerIndex: nextIndex,
    turnNumber: success ? state.turnNumber : state.turnNumber + 1,
    turnStage: 'ready-to-roll',
    diceValue: null,
    activeMinigame: null,
    statusBanner: success
      ? `Bravo ${activePlayer.name} ! Atelier réussi (+${Math.max(5, bonusPoints)} pts d’empathie) — tu rejoues !`
      : `Bel entraînement ${activePlayer.name} ! Au tour de ${nextPlayer.name}.`,
  };
}

export function sendSafeEncouragement(
  state: GameState,
  fromPlayerId: string,
  toPlayerId: string,
  message: string,
): GameState {
  if (!SAFE_ENCOURAGEMENTS.includes(message)) return state;
  const from = state.players.find((p) => p.id === fromPlayerId);
  const to = state.players.find((p) => p.id === toPlayerId);
  if (!from || !to || from.id === to.id) return state;

  const entry: EncouragementEntry = {
    id: `enc-${Date.now()}-${state.encouragements.length}`,
    fromName: from.name,
    toName: to.name,
    message,
  };

  const updatedPlayers = state.players.map((p) =>
    p.id === from.id || p.id === to.id
      ? applyBadges({ ...p, empathyScore: p.empathyScore + 3 })
      : p,
  );

  return {
    ...state,
    players: updatedPlayers,
    encouragements: [entry, ...state.encouragements].slice(0, 6),
  };
}
