import React from 'react';
import { CheckCircle2, HeartHandshake, Lightbulb, Sparkles, XCircle } from 'lucide-react';
import { CATEGORY_META, Question, getDifficultyLabel } from '../data/questions';
import {
  AnswerOutcome,
  EMPATHY_BADGES,
  Player,
} from '../game/engine';
import { CategoryIcon } from './CategoryIcon';

interface QuestionModalProps {
  question: Question;
  activePlayer: Player;
  otherPlayers: Player[];
  isHqTile: boolean;
  isFinalChallenge: boolean;
  eliminatedOptionIndex: number | null;
  helperPlayerId: string | null;
  outcome: AnswerOutcome | null;
  onUseCoopHint: (helperId: string) => void;
  onSelectAnswer: (optionIndex: number) => void;
  onContinue: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function QuestionModal({
  question,
  activePlayer,
  otherPlayers,
  isHqTile,
  isFinalChallenge,
  eliminatedOptionIndex,
  helperPlayerId,
  outcome,
  onUseCoopHint,
  onSelectAnswer,
  onContinue,
}: QuestionModalProps) {
  const catMeta = CATEGORY_META[question.category];
  const helperPlayer = otherPlayers.find((p) => p.id === helperPlayerId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="question-modal-title"
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#232B38]/55 p-4 overflow-y-auto"
    >
      <div className="my-auto w-full max-w-2xl rounded-2xl border border-[#DDD4C2] bg-[#FFFDF9] p-6 shadow-xl sm:p-7">
        {/* Clean typographic header (zero static pills) */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECE6D8] pb-3.5">
          <div className="flex items-center gap-2.5">
            <CategoryIcon category={question.category} size={22} />
            <div>
              <p
                className="text-sm font-bold"
                style={{ color: catMeta.darkText }}
              >
                {catMeta.label}
              </p>
              <p className="text-xs text-[#606A78]">
                {getDifficultyLabel(question.difficulty)} · Joueur : {activePlayer.name}
                {isFinalChallenge
                  ? ' · Défi final de la Boussole'
                  : isHqTile
                    ? ' · Question Camembert'
                    : ''}
              </p>
            </div>
          </div>
          <span className="font-mono-num text-xs font-semibold text-[#606A78]">
            {question.minAge}–{question.maxAge} ans
          </span>
        </div>

        {/* Question Prompt */}
        <h2
          id="question-modal-title"
          className="mt-5 font-display text-xl font-bold leading-snug text-[#232B38] sm:text-2xl"
        >
          {question.prompt}
        </h2>

        {/* Cooperative Help Bar (multiplayer, before answering) */}
        {!outcome && otherPlayers.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E5DEC9] bg-[#FAF7F0] px-4 py-2.5">
            {helperPlayer ? (
              <p className="inline-flex items-center gap-2 text-xs font-semibold text-[#1E7F5C]">
                <HeartHandshake className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {helperPlayer.name} a offert un Coup de pouce bienveillant (1 mauvaise piste retirée · +bonus entraide si réussi) !
                </span>
              </p>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4D5665]">
                  <HeartHandshake className="h-4 w-4 shrink-0 text-[#1E7F5C]" aria-hidden="true" />
                  Besoin d’entraide ? Un autre joueur peut retirer une mauvaise réponse :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {otherPlayers.map((ally) => (
                    <button
                      key={ally.id}
                      type="button"
                      onClick={() => onUseCoopHint(ally.id)}
                      className="min-h-[34px] rounded-lg border border-[#1E7F5C]/40 bg-white px-3 py-1 text-xs font-semibold text-[#1E7F5C] transition-colors hover:bg-[#ECF8F3] cursor-pointer whitespace-nowrap"
                    >
                      Aide de {ally.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Answer Options */}
        <div className="mt-5 grid grid-cols-1 gap-2.5">
          {question.options.map((opt, idx) => {
            const isEliminated = !outcome && eliminatedOptionIndex === idx;
            const isSelected = outcome?.selectedIndex === idx;
            const isCorrectOption = idx === question.correctIndex;

            let cardStyle =
              'border-[#DDD4C2] bg-white text-[#232B38] hover:border-[#1E7F5C] hover:bg-[#FAF7F0]';
            if (isEliminated) {
              cardStyle = 'border-[#EAE4D8] bg-[#F5F2EB] text-[#9AA2AE] line-through';
            } else if (outcome) {
              if (isCorrectOption) {
                cardStyle = 'border-[#1E7F5C] bg-[#ECF8F3] text-[#14583F]';
              } else if (isSelected && !outcome.isCorrect) {
                cardStyle = 'border-[#C94A38] bg-[#FDF1EE] text-[#8C2D20]';
              } else {
                cardStyle = 'border-[#EAE4D8] bg-[#FAF8F3] text-[#7A8290]';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={Boolean(outcome) || isEliminated}
                onClick={() => onSelectAnswer(idx)}
                className={`flex min-h-[52px] w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E7F5C] ${cardStyle} ${
                  outcome || isEliminated ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <span className="font-mono-num mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-current/25 text-xs font-bold">
                  {OPTION_LETTERS[idx]}
                </span>
                <span className="flex-1 leading-relaxed">{opt}</span>
                {outcome && isCorrectOption && (
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#1E7F5C]"
                    aria-label="Bonne réponse"
                  />
                )}
                {outcome && isSelected && !outcome.isCorrect && (
                  <XCircle
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#C94A38]"
                    aria-label="Réponse incorrecte"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Pedagogical Explanation & Empathy Tip */}
        {outcome && (
          <div className="mt-5 rounded-xl border border-[#DDD4C2] bg-[#FAF7F0] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p
                className={`text-sm font-bold ${
                  outcome.isCorrect ? 'text-[#14583F]' : 'text-[#8C2D20]'
                }`}
              >
                {outcome.isCorrect
                  ? outcome.awardedWedge
                    ? `Bravo ! Tu remportes le camembert ${CATEGORY_META[outcome.awardedWedge].shortLabel} !`
                    : 'Excellente réponse ! Tu gardes la main.'
                  : 'Pas tout à fait — voici ce qu’il faut retenir :'}
              </p>
              <span className="font-mono-num text-xs font-semibold text-[#1E7F5C]">
                +{outcome.empathyDelta} pts d’empathie
              </span>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-[#2D3645]">
              {question.explanation}
            </p>

            <div className="mt-3 flex items-start gap-2 border-t border-[#E6DFD0] pt-2.5 text-xs text-[#384252]">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#C97A16]" aria-hidden="true" />
              <p>
                <strong className="font-semibold text-[#232B38]">Réflexe empathie :</strong>{' '}
                {question.empathyTip}
              </p>
            </div>

            {outcome.coopBonusAwarded && outcome.helperName && (
              <p className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-[#1E7F5C]">
                <HeartHandshake className="h-4 w-4 shrink-0" aria-hidden="true" />
                Entraide réussie ! {activePlayer.name} et {outcome.helperName} reçoivent chacun un Cœur d’Entraide.
              </p>
            )}

            {outcome.newlyUnlockedBadges.length > 0 && (
              <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-[#824C09]">
                <Sparkles className="h-4 w-4 shrink-0 text-[#C97A16]" aria-hidden="true" />
                <span>
                  Nouveau badge débloqué :{' '}
                  {outcome.newlyUnlockedBadges
                    .map((id) => EMPATHY_BADGES.find((b) => b.id === id)?.title ?? id)
                    .join(', ')}
                </span>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={onContinue}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#1E7F5C] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#17684B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E7F5C] cursor-pointer whitespace-nowrap"
              >
                Continuer la partie
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
