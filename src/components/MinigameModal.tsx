import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  MessageSquareHeart,
  ShieldAlert,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import {
  CYBER_ACTION_LABELS,
  CyberActionType,
  MINIGAME_META,
  MinigameId,
  WORD_DETECTOR_CHALLENGES,
  pickCyberSortForAge,
  pickInclusionScenarioForAge,
} from '../data/minigames';
import { getTierForAge } from '../data/questions';
import { shuffleArray } from '../game/engine';

interface MinigameModalProps {
  age: number;
  initialMinigame: MinigameId | null;
  isBoardTurn: boolean;
  onFinishBoardMinigame?: (success: boolean, bonusPoints: number, minigameId: MinigameId) => void;
  onCloseAtelier?: () => void;
}

/**
 * Mini-game 1: Le Détecteur de Mots (Non-violent compassionate reformulation)
 */
function WordDetectorGame({
  age,
  onComplete,
}: {
  age: number;
  onComplete: (success: boolean, points: number) => void;
}) {
  const tier = getTierForAge(age).tier;
  const rounds = useMemo(() => {
    const tierItems = WORD_DETECTOR_CHALLENGES.filter((c) => c.tier === tier);
    const picked = tierItems.length >= 3 ? tierItems.slice(0, 3) : WORD_DETECTOR_CHALLENGES.slice(0, 3);
    return shuffleArray(picked).map((challenge) => ({
      ...challenge,
      options: shuffleArray(challenge.options) as typeof challenge.options,
    }));
  }, [tier]);

  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const current = rounds[roundIdx];
  const isFinished = roundIdx >= rounds.length;

  if (isFinished) {
    const success = correctCount >= 2;
    const points = 8 + correctCount * 6;
    return (
      <div className="space-y-4 py-2 text-center">
        <p className="font-display text-2xl font-bold text-[#232B38]">
          {success ? 'Bravo, tes mots apaisent les tensions !' : 'Bel entraînement de reformulation !'}
        </p>
        <p className="font-mono-num text-sm font-semibold text-[#1E7F5C]">
          Score : {correctCount} / {rounds.length} situations désamorcées · +{points} pts d’empathie
        </p>
        <p className="mx-auto max-w-md text-sm text-[#525B6B]">
          Choisir des mots calmes qui expriment notre ressenti sans attaquer l’autre transforme l’ambiance de toute la classe.
        </p>
        <button
          type="button"
          onClick={() => onComplete(success, points)}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#1E7F5C] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#17684B] cursor-pointer"
        >
          Valider et continuer
        </button>
      </div>
    );
  }

  const handlePick = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    if (current.options[idx].isKind) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    setSelectedIdx(null);
    setRoundIdx((i) => i + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-medium text-[#606A78]">
        <span>Situation {roundIdx + 1} sur {rounds.length}</span>
        <span className="font-mono-num font-semibold text-[#1E7F5C]">
          Jauge d’apaisement : {Math.round((correctCount / rounds.length) * 100)} %
        </span>
      </div>

      {/* Calmness progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#EFE9DC]">
        <div
          className="h-full bg-[#1E7F5C] transition-all duration-200"
          style={{ width: `${Math.max(8, (correctCount / rounds.length) * 100)}%` }}
        />
      </div>

      <div className="rounded-xl border border-[#E5DEC9] bg-[#FAF7F0] p-4">
        <p className="text-xs font-semibold text-[#606A78]">{current.context}</p>
        <p className="mt-1.5 text-base font-bold text-[#8C2D20]">
          Phrase blessante entendue : {current.hurtfulPhrase}
        </p>
        <p className="mt-2 text-xs text-[#4D5665]">
          Choisis la reformulation la plus bienveillante pour désamorcer la situation :
        </p>
      </div>

      <div className="space-y-2.5">
        {current.options.map((opt, idx) => {
          const picked = selectedIdx === idx;
          let style = 'border-[#DDD4C2] bg-white text-[#232B38] hover:border-[#C97A16] hover:bg-[#FEF6E9]';
          if (selectedIdx !== null) {
            if (opt.isKind) {
              style = 'border-[#1E7F5C] bg-[#ECF8F3] text-[#14583F]';
            } else if (picked) {
              style = 'border-[#C94A38] bg-[#FDF1EE] text-[#8C2D20]';
            } else {
              style = 'border-[#EAE4D8] bg-[#FAF8F3] text-[#828A97]';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={selectedIdx !== null}
              onClick={() => handlePick(idx)}
              className={`flex min-h-[48px] w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${style} ${
                selectedIdx === null ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <span>{opt.text}</span>
              {selectedIdx !== null && opt.isKind && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#1E7F5C]" aria-hidden="true" />
              )}
              {selectedIdx !== null && picked && !opt.isKind && (
                <XCircle className="h-5 w-5 shrink-0 text-[#C94A38]" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      {selectedIdx !== null && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DDD4C2] bg-[#FAF7F0] p-3.5">
          <p className="flex-1 text-sm text-[#2D3645]">
            {current.options[selectedIdx].feedback}
          </p>
          <button
            type="button"
            onClick={handleNext}
            className="min-h-[40px] rounded-lg bg-[#1E7F5C] px-4 py-2 text-xs font-bold text-white hover:bg-[#17684B] cursor-pointer whitespace-nowrap"
          >
            {roundIdx + 1 < rounds.length ? 'Situation suivante' : 'Voir le résultat'}
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Mini-game 2: Bouclier Cyber-Vigilance (Simulated safe classroom tablet triage)
 */
function CyberSortGame({
  age,
  onComplete,
}: {
  age: number;
  onComplete: (success: boolean, points: number) => void;
}) {
  const items = useMemo(() => shuffleArray(pickCyberSortForAge(age)), [age]);
  const [idx, setIdx] = useState(0);
  const [pickedAction, setPickedAction] = useState<CyberActionType | null>(null);
  const [score, setScore] = useState(0);

  if (idx >= items.length) {
    const success = score >= 2;
    const points = 8 + score * 6;
    return (
      <div className="space-y-4 py-2 text-center">
        <p className="font-display text-2xl font-bold text-[#232B38]">
          {success ? 'Bouclier numérique activé !' : 'Continue à exercer tes réflexes numériques !'}
        </p>
        <p className="font-mono-num text-sm font-semibold text-[#6D46A8]">
          {score} / {items.length} bons réflexes · +{points} pts d’empathie
        </p>
        <p className="mx-auto max-w-md text-sm text-[#525B6B]">
          Ne jamais relayer, conserver une capture d’écran en cas d’abus et prévenir un adulte ou le 3018 te protège toujours.
        </p>
        <button
          type="button"
          onClick={() => onComplete(success, points)}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#6D46A8] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#57358A] cursor-pointer"
        >
          Valider et continuer
        </button>
      </div>
    );
  }

  const current = items[idx];
  const actions: CyberActionType[] = ['encourage', 'block-report', 'support-alert'];

  const handleAction = (action: CyberActionType) => {
    if (pickedAction !== null) return;
    setPickedAction(action);
    if (action === current.correctAction) {
      setScore((s) => s + 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-medium text-[#606A78]">
        <span>Message {idx + 1} sur {items.length}</span>
        <span className="font-mono-num font-semibold text-[#6D46A8]">
          Bons réflexes : {score}/{items.length}
        </span>
      </div>

      {/* Simulated Classroom Tablet Frame */}
      <div className="rounded-2xl border-2 border-[#3A4354] bg-[#F7F9FC] p-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#DCE2EC] pb-2 text-xs text-[#556072]">
          <span className="font-bold text-[#232B38]">{current.sender}</span>
          <span>{current.channel}</span>
        </div>
        <p className="mt-3 text-base font-medium leading-relaxed text-[#232B38]">
          {current.message}
        </p>
      </div>

      <p className="text-xs font-semibold text-[#4D5665]">
        Quelle est la meilleure réaction à choisir tout de suite ?
      </p>

      <div className="grid grid-cols-1 gap-2.5">
        {actions.map((action) => {
          const meta = CYBER_ACTION_LABELS[action];
          const isCorrect = action === current.correctAction;
          const isPicked = pickedAction === action;
          let style = 'border-[#DDD4C2] bg-white hover:border-[#6D46A8] hover:bg-[#F4EFFB] text-[#232B38]';
          if (pickedAction !== null) {
            if (isCorrect) style = 'border-[#1E7F5C] bg-[#ECF8F3] text-[#14583F]';
            else if (isPicked) style = 'border-[#C94A38] bg-[#FDF1EE] text-[#8C2D20]';
            else style = 'border-[#EAE4D8] bg-[#FAF8F3] text-[#828A97]';
          }

          return (
            <button
              key={action}
              type="button"
              disabled={pickedAction !== null}
              onClick={() => handleAction(action)}
              className={`flex min-h-[54px] w-full flex-col items-start rounded-xl border px-4 py-2.5 text-left transition-colors ${style} ${
                pickedAction === null ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <span className="text-sm font-bold">{meta.label}</span>
              <span className="text-xs opacity-80">{meta.shortDesc}</span>
            </button>
          );
        })}
      </div>

      {pickedAction !== null && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DDD4C2] bg-[#FAF7F0] p-3.5">
          <p className="flex-1 text-sm text-[#2D3645]">{current.explanation}</p>
          <button
            type="button"
            onClick={() => {
              setPickedAction(null);
              setIdx((n) => n + 1);
            }}
            className="min-h-[40px] rounded-lg bg-[#6D46A8] px-4 py-2 text-xs font-bold text-white hover:bg-[#57358A] cursor-pointer whitespace-nowrap"
          >
            {idx + 1 < items.length ? 'Message suivant' : 'Voir le bilan'}
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Mini-game 3: Le Cercle d'Inclusion (Interactive SVG schoolyard scene that evolves live!)
 */
function InclusionCircleGame({
  age,
  onComplete,
}: {
  age: number;
  onComplete: (success: boolean, points: number) => void;
}) {
  const scenario = useMemo(() => {
    const base = pickInclusionScenarioForAge(age);
    return {
      ...base,
      steps: base.steps.map((step) => ({
        ...step,
        choices: shuffleArray(step.choices) as typeof step.choices,
      })) as typeof base.steps,
    };
  }, [age]);
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [allySteps, setAllySteps] = useState(0);

  const isDone = stepIdx >= scenario.steps.length;
  const mood: 'isolated' | 'hopeful' | 'included' =
    allySteps >= 3 ? 'included' : allySteps >= 1 ? 'hopeful' : 'isolated';

  // Animated interactive SVG schoolyard courtyard scene
  const renderCourtyardScene = () => {
    const victimX = mood === 'isolated' ? 92 : mood === 'hopeful' ? 190 : 235;
    const allyX = mood === 'isolated' ? 345 : mood === 'hopeful' ? 275 : 315;
    const matesX = mood === 'included' ? 395 : 445;
    const skyFill = mood === 'included' ? '#E4F3EC' : mood === 'hopeful' ? '#F3F0E4' : '#ECEAE4';

    return (
      <svg
        viewBox="0 0 560 155"
        preserveAspectRatio="xMidYMid slice"
        className="aspect-[560/155] w-full rounded-xl border border-[#DED5C4]"
        role="img"
        aria-label={`Scène de cour : ${scenario.victimName} est ${
          mood === 'included' ? 'entouré et inclus' : mood === 'hopeful' ? 'rejoint par un allié' : 'isolé sur le côté'
        }`}
      >
        <rect x="0" y="0" width="560" height="98" fill={skyFill} />
        <rect x="0" y="98" width="560" height="57" fill="#E6DEC8" />
        {/* Courtyard tree on far right */}
        <rect x="498" y="48" width="14" height="54" rx="3" fill="#9A7856" />
        <circle cx="505" cy="38" r="27" fill="#639A79" />
        <circle cx="486" cy="48" r="18" fill="#518968" />
        {/* Wooden bench on left */}
        <rect x="52" y="92" width="80" height="9" rx="3" fill="#B58A5C" />
        <rect x="62" y="101" width="7" height="15" fill="#8C6640" />
        <rect x="115" y="101" width="7" height="15" fill="#8C6640" />

        {/* Friendly circle ring when included */}
        {mood === 'included' && (
          <ellipse
            cx="315"
            cy="120"
            rx="115"
            ry="18"
            fill="#1E7F5C"
            fillOpacity="0.14"
            stroke="#1E7F5C"
            strokeWidth="1.6"
            strokeDasharray="4 4"
          />
        )}

        {/* Victim pawn */}
        <g
          style={{
            transform: `translate(${victimX}px, 82px)`,
            transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <path d="M -12 34 L -8 9 Q 0 2 8 9 L 12 34 Z" fill="#2E66B8" />
          <circle cx="0" cy="-2" r="11" fill="#F2C8A2" stroke="#232B38" strokeWidth="1.5" />
          {mood === 'isolated' && (
            <path d="M -4 2.5 Q 0 -1 4 2.5" stroke="#232B38" strokeWidth="1.5" fill="none" />
          )}
          {mood === 'hopeful' && (
            <line x1="-4" y1="1.5" x2="4" y2="1.5" stroke="#232B38" strokeWidth="1.5" />
          )}
          {mood === 'included' && (
            <path d="M -4.5 0 Q 0 4.5 4.5 0" stroke="#232B38" strokeWidth="1.5" fill="none" />
          )}
          <text x="0" y="50" textAnchor="middle" fontSize="12" fontWeight="700" fill="#232B38">
            {scenario.victimName}
          </text>
        </g>

        {/* Player ally pawn */}
        <g
          style={{
            transform: `translate(${allyX}px, 82px)`,
            transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <path d="M -12 34 L -8 9 Q 0 2 8 9 L 12 34 Z" fill="#1E7F5C" />
          <circle cx="0" cy="-2" r="11" fill="#E8B88E" stroke="#232B38" strokeWidth="1.5" />
          <path d="M -4.5 0 Q 0 4.5 4.5 0" stroke="#232B38" strokeWidth="1.5" fill="none" />
          <text x="0" y="50" textAnchor="middle" fontSize="12" fontWeight="700" fill="#14583F">
            Toi (Allié)
          </text>
        </g>

        {/* Other classmates joining once circle opens */}
        <g
          style={{
            transform: `translate(${matesX}px, 84px)`,
            transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <path d="M -11 32 L -7 9 Q 0 3 7 9 L 11 32 Z" fill="#C97A16" />
          <circle cx="0" cy="-1" r="10.5" fill="#F2C8A2" stroke="#232B38" strokeWidth="1.5" />
          <text x="0" y="48" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#525B6B">
            Camarades
          </text>
        </g>
      </svg>
    );
  };

  if (isDone) {
    const success = allySteps >= 2;
    const points = 8 + allySteps * 6;
    return (
      <div className="space-y-4">
        {renderCourtyardScene()}
        <div className="space-y-2 text-center">
          <p className="font-display text-2xl font-bold text-[#232B38]">
            {success
              ? `Le cercle d’inclusion est ouvert pour ${scenario.victimName} !`
              : 'Tu as exploré plusieurs façons d’agir en allié !'}
          </p>
          <p className="font-mono-num text-sm font-semibold text-[#1E7F5C]">
            {allySteps} / 3 gestes d’allié réussis · +{points} pts d’empathie
          </p>
          <button
            type="button"
            onClick={() => onComplete(success, points)}
            className="mt-2 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#1E7F5C] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#17684B] cursor-pointer"
          >
            Valider et continuer
          </button>
        </div>
      </div>
    );
  }

  const currentStep = scenario.steps[stepIdx];

  const handleSelect = (choiceIdx: number) => {
    if (selectedChoice !== null) return;
    setSelectedChoice(choiceIdx);
    if (currentStep.choices[choiceIdx].isAlly) {
      setAllySteps((n) => n + 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-medium text-[#606A78]">
        <span>{scenario.title} · {scenario.setting}</span>
        <span className="font-mono-num font-semibold text-[#1E7F5C]">
          Étape {stepIdx + 1} / 3
        </span>
      </div>

      {renderCourtyardScene()}

      <p className="text-sm font-semibold leading-relaxed text-[#232B38]">
        {currentStep.situationText}
      </p>

      <div className="space-y-2">
        {currentStep.choices.map((choice, cIdx) => {
          const isPicked = selectedChoice === cIdx;
          let style = 'border-[#DDD4C2] bg-white text-[#232B38] hover:border-[#1E7F5C] hover:bg-[#ECF8F3]';
          if (selectedChoice !== null) {
            if (choice.isAlly) style = 'border-[#1E7F5C] bg-[#ECF8F3] text-[#14583F]';
            else if (isPicked) style = 'border-[#C94A38] bg-[#FDF1EE] text-[#8C2D20]';
            else style = 'border-[#EAE4D8] bg-[#FAF8F3] text-[#828A97]';
          }

          return (
            <button
              key={cIdx}
              type="button"
              disabled={selectedChoice !== null}
              onClick={() => handleSelect(cIdx)}
              className={`flex min-h-[46px] w-full items-center justify-between gap-2 rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-colors ${style} ${
                selectedChoice === null ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <span>{choice.label}</span>
              {selectedChoice !== null && choice.isAlly && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#1E7F5C]" aria-hidden="true" />
              )}
              {selectedChoice !== null && isPicked && !choice.isAlly && (
                <XCircle className="h-5 w-5 shrink-0 text-[#C94A38]" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      {selectedChoice !== null && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DDD4C2] bg-[#FAF7F0] p-3.5">
          <p className="flex-1 text-sm text-[#2D3645]">
            {currentStep.choices[selectedChoice].outcome}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedChoice(null);
              setStepIdx((n) => n + 1);
            }}
            className="min-h-[40px] rounded-lg bg-[#1E7F5C] px-4 py-2 text-xs font-bold text-white hover:bg-[#17684B] cursor-pointer whitespace-nowrap"
          >
            {stepIdx + 1 < 3 ? 'Étape suivante' : 'Voir l’évolution'}
          </button>
        </div>
      )}
    </div>
  );
}

export function MinigameModal({
  age,
  initialMinigame,
  isBoardTurn,
  onFinishBoardMinigame,
  onCloseAtelier,
}: MinigameModalProps) {
  const [activeId, setActiveId] = useState<MinigameId | null>(initialMinigame);
  const tier = getTierForAge(age);

  const handleComplete = (success: boolean, points: number) => {
    if (isBoardTurn && activeId && onFinishBoardMinigame) {
      onFinishBoardMinigame(success, points, activeId);
    } else {
      setActiveId(null);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="minigame-modal-title"
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#232B38]/55 p-4 overflow-y-auto"
    >
      <div className="my-auto w-full max-w-2xl rounded-2xl border border-[#DDD4C2] bg-[#FFFDF9] p-6 shadow-xl sm:p-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#ECE6D8] pb-3.5">
          <div>
            <h2
              id="minigame-modal-title"
              className="font-display text-xl font-bold text-[#232B38] sm:text-2xl"
            >
              {activeId ? MINIGAME_META[activeId].title : 'Atelier des Mini-Jeux Sociaux'}
            </h2>
            <p className="mt-0.5 text-xs text-[#606A78]">
              {activeId
                ? `${MINIGAME_META[activeId].subtitle} · Niveau ${age} ans (${tier.label})`
                : `3 ateliers interactifs adaptés à ${age} ans (${tier.label}) pour entraîner l’empathie`}
            </p>
          </div>
          {!isBoardTurn && (
            <button
              type="button"
              onClick={() => (activeId ? setActiveId(null) : onCloseAtelier?.())}
              aria-label={activeId ? 'Retour à la liste des mini-jeux' : 'Fermer l’atelier mini-jeux'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#DDD4C2] bg-white text-[#525B6B] hover:bg-[#FAF7F0] hover:text-[#232B38] cursor-pointer"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="mt-5">
          {!activeId ? (
            <div className="grid grid-cols-1 gap-3.5">
              {(['word-detector', 'cyber-sort', 'inclusion-circle'] as MinigameId[]).map(
                (mgId) => {
                  const meta = MINIGAME_META[mgId];
                  const Icon =
                    mgId === 'word-detector'
                      ? MessageSquareHeart
                      : mgId === 'cyber-sort'
                        ? ShieldAlert
                        : Users;
                  return (
                    <div
                      key={mgId}
                      className="flex flex-col justify-between gap-3 rounded-xl border border-[#E2DAC9] bg-[#FAF7F0] p-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/5 bg-white"
                          style={{ color: meta.accentColor }}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="font-display text-base font-bold text-[#232B38]">
                            {meta.title}
                          </h3>
                          <p className="text-xs font-medium text-[#606A78]">
                            {meta.subtitle} · {meta.skillLabel}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-[#454E5E]">
                            {meta.description}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveId(mgId)}
                        className="min-h-[42px] shrink-0 rounded-xl bg-[#232B38] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#1E7F5C] cursor-pointer whitespace-nowrap"
                      >
                        Jouer à l’atelier
                      </button>
                    </div>
                  );
                },
              )}
            </div>
          ) : activeId === 'word-detector' ? (
            <WordDetectorGame age={age} onComplete={handleComplete} />
          ) : activeId === 'cyber-sort' ? (
            <CyberSortGame age={age} onComplete={handleComplete} />
          ) : (
            <InclusionCircleGame age={age} onComplete={handleComplete} />
          )}
        </div>
      </div>
    </div>
  );
}
