import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Users } from 'lucide-react';
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  getQuestionCountSummary,
  getTierForAge,
} from '../data/questions';
import { AVATAR_TOTEMS, AvatarTotemId, GameConfig } from '../game/engine';
import { CategoryIcon, TotemAvatar } from './CategoryIcon';

interface TitleScreenProps {
  initialAge: number;
  onStartGame: (config: GameConfig) => void;
  onOpenMinigames: (age: number) => void;
  onOpenHelp: () => void;
}

const TITLE_BG_SRC = '/src/assets/images/title_bg_1795412284475.jpg';

export function TitleScreen({
  initialAge,
  onStartGame,
  onOpenMinigames,
  onOpenHelp,
}: TitleScreenProps) {
  const [age, setAge] = useState<number>(initialAge);
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [playerSlots, setPlayerSlots] = useState<
    Array<{ name: string; totem: AvatarTotemId }>
  >([
    { name: 'Renard', totem: 'renard' },
    { name: 'Hibou', totem: 'hibou' },
    { name: 'Loutre', totem: 'loutre' },
    { name: 'Panda', totem: 'panda' },
  ]);
  const [bgFailed, setBgFailed] = useState(false);

  const tier = getTierForAge(age);
  const counts = getQuestionCountSummary();

  const updatePlayerName = (index: number, value: string) => {
    setPlayerSlots((prev) =>
      prev.map((slot, idx) => (idx === index ? { ...slot, name: value } : slot)),
    );
  };

  const cycleTotem = (index: number) => {
    setPlayerSlots((prev) =>
      prev.map((slot, idx) => {
        if (idx !== index) return slot;
        const currentIdx = AVATAR_TOTEMS.findIndex((t) => t.id === slot.totem);
        const nextTotem = AVATAR_TOTEMS[(currentIdx + 1) % AVATAR_TOTEMS.length];
        const wasDefault = AVATAR_TOTEMS.some((t) => t.defaultName === slot.name);
        return {
          totem: nextTotem.id,
          name: wasDefault ? nextTotem.defaultName : slot.name,
        };
      }),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartGame({
      age,
      players: playerSlots.slice(0, playerCount),
    });
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#F6F3EC] text-[#232B38]">
      {/* Full-bleed illustrated gouache key art backdrop */}
      {!bgFailed && (
        <img
          src={TITLE_BG_SRC}
          alt="Cour d’école illustrée à la gouache avec pions en bois, cartes et boussole"
          referrerPolicy="no-referrer"
          onError={() => setBgFailed(true)}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right select-none"
        />
      )}

      {/* Measured parchment fade on left half so typography sits cleanly over calm negative space */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#F6F3EC] via-[#F6F3EC]/94 to-[#F6F3EC]/15 lg:via-[#F6F3EC]/88 lg:to-transparent"
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1380px] flex-col justify-between px-5 py-6 sm:px-10 lg:py-8">
        {/* Top subtle utility strip (no marketing navbar) */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs font-medium text-[#555E6D]">
            <ShieldCheck className="h-4 w-4 text-[#1E7F5C]" aria-hidden="true" />
            <span>100 % local · Sans compte · Sans données personnelles</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onOpenMinigames(age)}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#D4CBB8] bg-white/90 px-4 py-2 text-sm font-semibold text-[#232B38] shadow-xs transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E7F5C] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-[#C97A16]" aria-hidden="true" />
              Atelier Mini-Jeux
            </button>
            <button
              type="button"
              onClick={onOpenHelp}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#D4CBB8] bg-white/90 px-4 py-2 text-sm font-semibold text-[#1E7F5C] shadow-xs transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E7F5C] whitespace-nowrap shrink-0 cursor-pointer"
            >
              Besoin d’aide ? 3018
            </button>
          </div>
        </div>

        {/* Main Left-Third / Half Compositional Stage */}
        <div className="my-auto grid grid-cols-1 items-center gap-8 py-6 lg:grid-cols-12">
          <section className="lg:col-span-6 xl:col-span-5">
            {/* Bespoke inline SVG Title Crest & Display Lockup */}
            <div className="mb-5 flex items-center gap-3.5">
              <svg
                width="54"
                height="54"
                viewBox="0 0 60 60"
                fill="none"
                aria-hidden="true"
                className="shrink-0"
              >
                <circle cx="30" cy="30" r="27" fill="#FFFDF8" stroke="#C99A3B" strokeWidth="2.5" />
                <circle cx="30" cy="30" r="21.5" stroke="#DFD6C3" strokeWidth="1.5" strokeDasharray="3 3" />
                <path d="M30 8L34.5 25.5L52 30L34.5 34.5L30 52L25.5 34.5L8 30L25.5 25.5L30 8Z" fill="#C97A16" fillOpacity="0.16" />
                <path d="M30 11L33.5 26.5L30 30L26.5 26.5L30 11Z" fill="#C94A38" />
                <path d="M30 49L26.5 33.5L30 30L33.5 33.5L30 49Z" fill="#1E7F5C" />
                <path d="M49 30L33.5 33.5L30 30L33.5 26.5L49 30Z" fill="#2E66B8" />
                <path d="M11 30L26.5 26.5L30 30L26.5 33.5L11 30Z" fill="#6D46A8" />
                <circle cx="30" cy="30" r="4" fill="#FFFDF8" stroke="#C97A16" strokeWidth="2" />
              </svg>
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-[#232B38] sm:text-4xl lg:text-[2.6rem] lg:leading-[1.1]">
                  La Boussole de l’Entraide
                </h1>
                <p className="mt-1 text-sm font-medium text-[#525B6B]">
                  Jeu de plateau coopératif contre le harcèlement scolaire
                </p>
              </div>
            </div>

            {/* Clean unboxed summary metadata (zero pills) */}
            <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-[#555E6D]">
              <span className="font-mono-num font-semibold text-[#232B38]">{counts.total} questions</span>
              <span aria-hidden="true">·</span>
              <span>5 catégories progressives</span>
              <span aria-hidden="true">·</span>
              <span>3 mini-jeux sociaux</span>
              <span aria-hidden="true">·</span>
              <span>De 6 à 15 ans</span>
            </div>

            {/* Setup Card (single elevation level, hairline border) */}
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-[#DDD4C2] bg-[#FFFDF9] p-5 shadow-sm sm:p-6"
            >
              {/* Age Level Selector (6 to 15 ans) */}
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <label
                    htmlFor="age-slider"
                    className="text-sm font-semibold text-[#232B38]"
                  >
                    Âge des joueurs
                  </label>
                  <div className="text-right">
                    <span className="font-mono-num text-lg font-bold text-[#1E7F5C]">
                      {age} ans
                    </span>
                    <span className="ml-2 text-xs font-medium text-[#555E6D]">
                      {tier.label} · {tier.schoolLevel}
                    </span>
                  </div>
                </div>

                <input
                  id="age-slider"
                  type="range"
                  min={6}
                  max={15}
                  step={1}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="mt-2.5 h-2 w-full cursor-pointer accent-[#1E7F5C]"
                />
                <div className="mt-1.5 flex justify-between font-mono-num text-[11px] text-[#6B7482]">
                  <span>6 ans</span>
                  <span>9 ans</span>
                  <span>12 ans</span>
                  <span>15 ans</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#525B6B]">
                  {tier.description}
                </p>
              </div>

              <hr className="my-4 border-[#EAE3D5]" />

              {/* Players count & anonymous animal totems */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#232B38]">
                    <Users className="h-4 w-4 text-[#2E66B8]" aria-hidden="true" />
                    Équipe de jeu (pseudos totems)
                  </span>
                  <div
                    role="group"
                    aria-label="Nombre de joueurs"
                    className="inline-flex rounded-lg bg-[#F1ECE0] p-1"
                  >
                    {[1, 2, 3, 4].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setPlayerCount(count)}
                        className={`min-h-[32px] min-w-[36px] rounded-md px-2.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          playerCount === count
                            ? 'bg-white text-[#232B38] shadow-xs'
                            : 'text-[#5C6472] hover:text-[#232B38]'
                        }`}
                      >
                        {count} {count === 1 ? 'solo' : 'J'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {playerSlots.slice(0, playerCount).map((slot, idx) => {
                    const totemDef =
                      AVATAR_TOTEMS.find((t) => t.id === slot.totem) ?? AVATAR_TOTEMS[0];
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-xl border border-[#E5DEC9] bg-[#FAF7F0] px-2.5 py-2"
                      >
                        <button
                          type="button"
                          onClick={() => cycleTotem(idx)}
                          aria-label={`Changer le totem du joueur ${idx + 1} (${totemDef.defaultName})`}
                          title="Changer d’animal totem"
                          className="rounded-full transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E7F5C] cursor-pointer"
                        >
                          <TotemAvatar totem={slot.totem} color={totemDef.color} size={32} />
                        </button>
                        <div className="min-w-0 flex-1">
                          <label
                            htmlFor={`player-name-${idx}`}
                            className="sr-only"
                          >
                            Pseudo du joueur {idx + 1}
                          </label>
                          <input
                            id={`player-name-${idx}`}
                            type="text"
                            maxLength={18}
                            value={slot.name}
                            onChange={(e) => updatePlayerName(idx, e.target.value)}
                            placeholder={totemDef.defaultName}
                            className="w-full bg-transparent text-sm font-semibold text-[#232B38] placeholder:text-[#8E96A4] focus:outline-none"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-2 text-[11px] text-[#667080]">
                  Astuce vie privée : garde un nom d’animal totem pour jouer anonymement en classe.
                </p>
              </div>

              {/* Primary CTA */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  data-start="true"
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-[#1E7F5C] px-6 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-[#17684B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E7F5C] whitespace-nowrap cursor-pointer"
                >
                  Lancer la partie
                </button>
              </div>
            </form>

            {/* Clean inline 5-category legend (zero pills) */}
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#444D5C]">
              {CATEGORY_ORDER.map((cat) => (
                <span key={cat} className="inline-flex items-center gap-1.5 font-medium">
                  <CategoryIcon category={cat} size={15} />
                  <span>{CATEGORY_META[cat].shortLabel}</span>
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Flat borderless bottom control hint */}
        <p className="text-xs font-medium text-[#5A6372]">
          Entrée / Espace : Commencer · Échap / P : Pause · M : Couper le son
        </p>
      </div>
    </main>
  );
}
