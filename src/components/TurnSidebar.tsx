import React, { useState } from 'react';
import { Award, Dices, HeartHandshake, Send } from 'lucide-react';
import {
  CATEGORY_META,
  CATEGORY_ORDER,
} from '../data/questions';
import {
  EMPATHY_BADGES,
  EncouragementEntry,
  Player,
  SAFE_ENCOURAGEMENTS,
  TurnStage,
} from '../game/engine';
import { CamembertWheel, CategoryIcon, TotemAvatar } from './CategoryIcon';

interface TurnSidebarProps {
  players: Player[];
  activePlayerIndex: number;
  turnStage: TurnStage;
  diceValue: number | null;
  statusBanner: string;
  encouragements: EncouragementEntry[];
  onRollDice: () => void;
  onSendEncouragement: (fromId: string, toId: string, msg: string) => void;
}

function DiceFace({ value }: { value: number | null }) {
  const pips: Record<number, Array<[number, number]>> = {
    1: [[18, 18]],
    2: [
      [11, 11],
      [25, 25],
    ],
    3: [
      [11, 11],
      [18, 18],
      [25, 25],
    ],
    4: [
      [11, 11],
      [25, 11],
      [11, 25],
      [25, 25],
    ],
    5: [
      [11, 11],
      [25, 11],
      [18, 18],
      [11, 25],
      [25, 25],
    ],
    6: [
      [11, 10],
      [25, 10],
      [11, 18],
      [25, 18],
      [11, 26],
      [25, 26],
    ],
  };
  const dots = value ? pips[value] ?? pips[1] : [];

  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" className="shrink-0">
      <rect
        x="2"
        y="2"
        width="32"
        height="32"
        rx="7"
        fill="#FFFDF9"
        stroke="#C5B9A1"
        strokeWidth="2"
      />
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#232B38" />
      ))}
      {!value && (
        <text x="18" y="22.5" textAnchor="middle" fontSize="14" fontWeight="700" fill="#8C8370">
          ?
        </text>
      )}
    </svg>
  );
}

export function TurnSidebar({
  players,
  activePlayerIndex,
  turnStage,
  diceValue,
  statusBanner,
  encouragements,
  onRollDice,
  onSendEncouragement,
}: TurnSidebarProps) {
  const [showEncouragementBox, setShowEncouragementBox] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [diceAnimKey, setDiceAnimKey] = useState(0);

  const activePlayer = players[activePlayerIndex];
  const otherPlayers = players.filter((p) => p.id !== activePlayer.id);
  const effectiveRecipient =
    selectedRecipient && otherPlayers.some((p) => p.id === selectedRecipient)
      ? selectedRecipient
      : otherPlayers[0]?.id ?? '';

  const handleRollClick = () => {
    setDiceAnimKey((k) => k + 1);
    onRollDice();
  };

  return (
    <aside className="flex flex-col gap-4">
      {/* Primary Turn Action Panel */}
      <section className="rounded-2xl border border-[#DDD4C2] bg-[#FFFDF9] p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <TotemAvatar totem={activePlayer.totem} color={activePlayer.color} size={40} />
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#606A78]">Tour en cours</p>
              <h2 className="truncate font-display text-xl font-bold text-[#232B38]">
                {activePlayer.name}
              </h2>
            </div>
          </div>
          <CamembertWheel wedges={activePlayer.wedges} size={48} />
        </div>

        <p
          role="status"
          aria-live="polite"
          className="mt-3 text-sm leading-relaxed text-[#384252]"
        >
          {statusBanner}
        </p>

        {/* Tactile Roll Die Action */}
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleRollClick}
            disabled={turnStage !== 'ready-to-roll'}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2.5 rounded-xl bg-[#1E7F5C] px-5 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#17684B] disabled:cursor-not-allowed disabled:bg-[#C7CFCB] disabled:text-[#55615C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E7F5C] whitespace-nowrap cursor-pointer"
          >
            <Dices className="h-5 w-5" aria-hidden="true" />
            {turnStage === 'choose-destination'
              ? `Dé : ${diceValue} — Choisis une case`
              : 'Lancer le dé'}
          </button>

          <div
            key={diceAnimKey}
            aria-label={diceValue ? `Résultat du dé : ${diceValue}` : 'Dé prêt à être lancé'}
            className={diceValue ? 'animate-dice' : ''}
          >
            <DiceFace value={diceValue} />
          </div>
        </div>

        {/* Clean inline board symbol legend (zero pills) */}
        <div className="mt-4 flex flex-wrap items-center gap-x-3.5 gap-y-1 border-t border-[#ECE6D8] pt-3 text-[11px] font-medium text-[#5A6372]">
          <span>Triangle blanc = Quartier Camembert</span>
          <span aria-hidden="true">·</span>
          <span>Étoile ocre = Mini-Jeu</span>
          <span aria-hidden="true">·</span>
          <span>Cœur vert = Rejouer</span>
        </div>
      </section>

      {/* Players & Camemberts Roster */}
      <section className="rounded-2xl border border-[#DDD4C2] bg-[#FFFDF9] p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-base font-bold text-[#232B38] whitespace-nowrap">
            Camemberts & Empathie
          </h3>
          <span className="text-xs text-[#606A78] whitespace-nowrap shrink-0">
            5 + Boussole
          </span>
        </div>

        <ul className="mt-3 divide-y divide-[#EFE9DC]">
          {players.map((p, idx) => {
            const isActive = idx === activePlayerIndex;
            return (
              <li
                key={p.id}
                className={`flex items-center justify-between gap-3 py-2.5 first:pt-1 last:pb-1 ${
                  isActive ? 'text-[#232B38]' : 'text-[#525B6B]'
                }`}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <TotemAvatar totem={p.totem} color={p.color} size={30} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`truncate text-sm ${isActive ? 'font-bold text-[#232B38]' : 'font-semibold'}`}>
                        {p.name}
                      </span>
                      {isActive && (
                        <span className="text-[11px] font-semibold text-[#1E7F5C]">
                          · Actif
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#606A78]">
                      <span className="font-mono-num font-semibold text-[#232B38]">
                        {p.empathyScore} pts
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num">
                        {p.wedges.length}/5
                      </span>
                      {p.coopHearts > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-num text-[#C94A38]">
                            {p.coopHearts} entraide
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <CamembertWheel wedges={p.wedges} size={38} />
              </li>
            );
          })}
        </ul>

        {/* Category Key Row */}
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-[#ECE6D8] pt-3 text-[11px] text-[#555E6D]">
          {CATEGORY_ORDER.map((cat) => (
            <span key={cat} className="inline-flex items-center gap-1 font-medium">
              <CategoryIcon category={cat} size={13} />
              <span>{CATEGORY_META[cat].shortLabel}</span>
            </span>
          ))}
        </div>
      </section>

      {/* Cooperative Encouragement & Empathy Badges */}
      <section className="rounded-2xl border border-[#DDD4C2] bg-[#FFFDF9] p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <h3 className="inline-flex items-center gap-1.5 font-display text-base font-bold text-[#232B38]">
            <Award className="h-4 w-4 text-[#C97A16]" aria-hidden="true" />
            Récompenses d’empathie
          </h3>
          {otherPlayers.length > 0 && (
            <button
              type="button"
              onClick={() => setShowEncouragementBox((v) => !v)}
              className="inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border border-[#D8CEBB] bg-[#FAF7F0] px-3 py-1 text-xs font-semibold text-[#1E7F5C] transition-colors hover:bg-[#EFE9DC] cursor-pointer whitespace-nowrap"
            >
              <HeartHandshake className="h-3.5 w-3.5" aria-hidden="true" />
              Encourager
            </button>
          )}
        </div>

        {/* Safe preset encouragement sender (zero free-text bullying risk) */}
        {showEncouragementBox && otherPlayers.length > 0 && (
          <div className="mt-3 rounded-xl border border-[#E2DAC9] bg-[#FAF7F0] p-3">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="encouragement-recipient"
                className="text-xs font-semibold text-[#384252]"
              >
                Envoyer un mot bienveillant à :
              </label>
              <select
                id="encouragement-recipient"
                value={effectiveRecipient}
                onChange={(e) => setSelectedRecipient(e.target.value)}
                className="rounded-md border border-[#D5CBB7] bg-white px-2 py-1 text-xs font-semibold text-[#232B38]"
              >
                {otherPlayers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-1.5">
              {SAFE_ENCOURAGEMENTS.slice(0, 3).map((msg) => (
                <button
                  key={msg}
                  type="button"
                  onClick={() => {
                    onSendEncouragement(activePlayer.id, effectiveRecipient, msg);
                    setShowEncouragementBox(false);
                  }}
                  className="flex min-h-[36px] items-center justify-between gap-2 rounded-lg border border-[#E3DBC9] bg-white px-3 py-1.5 text-left text-xs font-medium text-[#232B38] transition-colors hover:border-[#1E7F5C] hover:bg-[#ECF8F3] cursor-pointer"
                >
                  <span>{msg}</span>
                  <Send className="h-3.5 w-3.5 shrink-0 text-[#1E7F5C]" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active player's unlocked badges */}
        <div className="mt-3">
          {activePlayer.badges.length === 0 ? (
            <p className="text-xs text-[#606A78]">
              Réponds aux questions, offre un coup de pouce ou réussis un mini-jeu pour débloquer des badges de bienveillance.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {activePlayer.badges.map((badgeId) => {
                const badge = EMPATHY_BADGES.find((b) => b.id === badgeId);
                if (!badge) return null;
                return (
                  <li key={badgeId} className="text-xs text-[#232B38]">
                    <span className="font-semibold text-[#1E7F5C]">{badge.title}</span>
                    <span className="text-[#606A78]"> — {badge.description}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Latest kindness message */}
        {encouragements.length > 0 && (
          <div className="mt-3 border-t border-[#ECE6D8] pt-3">
            <p className="text-[11px] font-semibold text-[#606A78]">Dernier encouragement</p>
            <p className="mt-1 text-xs text-[#232B38]">
              <span className="font-semibold">{encouragements[0].fromName}</span>
              <span className="text-[#606A78]"> → </span>
              <span className="font-semibold">{encouragements[0].toName}</span> : « {encouragements[0].message} »
            </p>
          </div>
        )}
      </section>
    </aside>
  );
}
