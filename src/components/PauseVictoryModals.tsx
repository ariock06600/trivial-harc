import React, { useState } from 'react';
import { Award, Play, RotateCcw, Home } from 'lucide-react';
import { EMPATHY_BADGES, Player } from '../game/engine';

const MEDAL_ART_SRC = '/src/assets/images/empathy_medal_art_1795412284593.jpg';

export function PauseModal({
  turnNumber,
  age,
  onResume,
  onRestart,
  onReturnTitle,
}: {
  turnNumber: number;
  age: number;
  onResume: () => void;
  onRestart: () => void;
  onReturnTitle: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#232B38]/60 p-4"
    >
      <div className="w-full max-w-md rounded-2xl border border-[#DDD4C2] bg-[#FFFDF9] p-6 shadow-xl">
        <h2
          id="pause-modal-title"
          className="font-display text-2xl font-bold text-[#232B38]"
        >
          Partie en pause
        </h2>
        <p className="mt-1 text-sm text-[#555E6D]">
          Prends le temps de discuter d’une question ou de souffler un instant.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-[#EAE2D2] bg-[#FAF7F0] p-3.5">
          <div>
            <p className="text-[11px] font-medium text-[#606A78]">Niveau choisi</p>
            <p className="font-mono-num text-lg font-bold text-[#232B38]">{age} ans</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#606A78]">Tour actuel</p>
            <p className="font-mono-num text-lg font-bold text-[#232B38]">#{turnNumber}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onResume}
            className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#1E7F5C] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#17684B] cursor-pointer"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Reprendre la partie
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-[#DDD4C2] bg-white px-5 py-2.5 text-sm font-semibold text-[#232B38] hover:bg-[#FAF7F0] cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Recommencer à zéro
          </button>
          <button
            type="button"
            onClick={onReturnTitle}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-[#DDD4C2] bg-white px-5 py-2.5 text-sm font-semibold text-[#555E6D] hover:bg-[#FAF7F0] cursor-pointer"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Retour à l’accueil
          </button>
        </div>
      </div>
    </div>
  );
}

export function VictoryModal({
  winner,
  players,
  turnNumber,
  onPlayAgain,
  onReturnTitle,
}: {
  winner: Player;
  players: Player[];
  turnNumber: number;
  onPlayAgain: () => void;
  onReturnTitle: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const totalCoop = players.reduce((acc, p) => acc + p.coopHearts, 0);
  const totalEmpathy = players.reduce((acc, p) => acc + p.empathyScore, 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#232B38]/60 p-4 overflow-y-auto"
    >
      <div className="my-auto w-full max-w-lg rounded-2xl border border-[#DDD4C2] bg-[#FFFDF9] p-6 text-center shadow-xl sm:p-7">
        {!imgFailed ? (
          <img
            src={MEDAL_ART_SRC}
            alt="Médaillon de La Boussole de l’Entraide entouré des 5 camemberts"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="mx-auto h-36 w-36 rounded-2xl border border-[#E6DEC9] object-cover"
          />
        ) : (
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#ECF8F3] text-[#1E7F5C]">
            <Award className="h-12 w-12" aria-hidden="true" />
          </div>
        )}

        <h2
          id="victory-modal-title"
          className="mt-4 font-display text-2xl font-bold text-[#232B38] sm:text-3xl"
        >
          Bravo {winner.name} !
        </h2>
        <p className="mt-1.5 text-sm text-[#525B6B]">
          Les 5 camemberts et la Boussole centrale ont été remportés ensemble dans le respect et l’empathie.
        </p>

        {/* Mastery metrics */}
        <div className="mt-5 grid grid-cols-3 gap-2.5 rounded-xl border border-[#EAE2D2] bg-[#FAF7F0] p-4">
          <div>
            <p className="text-[11px] font-medium text-[#606A78]">Empathie totale</p>
            <p className="font-mono-num text-xl font-bold text-[#1E7F5C]">{totalEmpathy}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#606A78]">Cœurs entraide</p>
            <p className="font-mono-num text-xl font-bold text-[#C94A38]">{totalCoop}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#606A78]">Tours joués</p>
            <p className="font-mono-num text-xl font-bold text-[#232B38]">{turnNumber}</p>
          </div>
        </div>

        {/* Unlocked badges */}
        {winner.badges.length > 0 && (
          <div className="mt-4 text-left">
            <p className="text-xs font-semibold text-[#606A78]">Badges remportés</p>
            <p className="mt-1 text-sm font-medium text-[#232B38]">
              {winner.badges
                .map((id) => EMPATHY_BADGES.find((b) => b.id === id)?.title ?? id)
                .join(' · ')}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            data-start="true"
            onClick={onPlayAgain}
            className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#1E7F5C] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#17684B] cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Rejouer une partie
          </button>
          <button
            type="button"
            onClick={onReturnTitle}
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-[#DDD4C2] bg-white px-5 py-2.5 text-sm font-semibold text-[#232B38] hover:bg-[#FAF7F0] cursor-pointer whitespace-nowrap"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Accueil
          </button>
        </div>
      </div>
    </div>
  );
}
