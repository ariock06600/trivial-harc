import React, { useCallback, useEffect, useState } from 'react';
import {
  LifeBuoy,
  Pause,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { BoardView } from './components/BoardView';
import { HelpPrivacyModal } from './components/HelpPrivacyModal';
import { MinigameModal } from './components/MinigameModal';
import { PauseModal, VictoryModal } from './components/PauseVictoryModals';
import { QuestionModal } from './components/QuestionModal';
import { TitleScreen } from './components/TitleScreen';
import { TurnSidebar } from './components/TurnSidebar';
import { MinigameId } from './data/minigames';
import { getTierForAge } from './data/questions';
import {
  isMuted,
  playCorrectSound,
  playDiceRollSound,
  playGentleWrongSound,
  playStepSound,
  playWedgeCelebrationSound,
  setMuted,
} from './game/audio';
import { BOARD_NODE_MAP } from './game/board';
import {
  GameConfig,
  GameState,
  activateCoopHint,
  completeMinigameOnBoard,
  continueAfterFeedback,
  createInitialGameState,
  movePlayerToNode,
  rollDiceAction,
  sendSafeEncouragement,
  submitQuestionAnswer,
} from './game/engine';

const DEFAULT_CONFIG: GameConfig = {
  age: 10,
  players: [
    { name: 'Renard', totem: 'renard' },
    { name: 'Hibou', totem: 'hibou' },
  ],
};

function shouldAutoStart(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('autostart') === '1';
}

export default function App() {
  const [lastConfig, setLastConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialGameState(DEFAULT_CONFIG, shouldAutoStart() ? 'playing' : 'title'),
  );
  const [atelierOpenAge, setAtelierOpenAge] = useState<number | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [mutedState, setMutedState] = useState(() => isMuted());

  // Mirror game state machine to document.body.dataset.state
  useEffect(() => {
    document.body.dataset.state = gameState.phase;
  }, [gameState.phase]);

  const handleStartGame = useCallback((config: GameConfig) => {
    setLastConfig(config);
    setAtelierOpenAge(null);
    setHelpOpen(false);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setGameState(createInitialGameState(config, 'playing'));
  }, []);

  const handleToggleMute = useCallback(() => {
    setMutedState((prev) => {
      const next = !prev;
      setMuted(next);
      return next;
    });
  }, []);

  const handleTogglePause = useCallback(() => {
    setGameState((prev) => {
      if (prev.phase === 'playing') return { ...prev, phase: 'paused' };
      if (prev.phase === 'paused') return { ...prev, phase: 'playing' };
      return prev;
    });
  }, []);

  // Global keyboard shortcuts: Enter/Space on title, Escape/P to pause, M to mute
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditing =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT');

      if (e.key === 'm' || e.key === 'M') {
        if (!isEditing) {
          handleToggleMute();
        }
        return;
      }

      if (gameState.phase === 'title' && !atelierOpenAge && !helpOpen) {
        if (!isEditing && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleStartGame(lastConfig);
        }
        return;
      }

      if (e.key === 'Escape') {
        if (helpOpen) {
          setHelpOpen(false);
          return;
        }
        if (atelierOpenAge !== null) {
          setAtelierOpenAge(null);
          return;
        }
        if (gameState.phase === 'playing' || gameState.phase === 'paused') {
          handleTogglePause();
        }
        return;
      }

      if ((e.key === 'p' || e.key === 'P') && !isEditing && !helpOpen && atelierOpenAge === null) {
        if (gameState.phase === 'playing' || gameState.phase === 'paused') {
          handleTogglePause();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    atelierOpenAge,
    gameState.phase,
    handleStartGame,
    handleToggleMute,
    handleTogglePause,
    helpOpen,
    lastConfig,
  ]);

  const handleRollDice = () => {
    playDiceRollSound();
    setGameState((prev) => rollDiceAction(prev));
  };

  const handleSelectDestination = (nodeId: string) => {
    playStepSound();
    setGameState((prev) => movePlayerToNode(prev, nodeId));
  };

  const handleUseCoopHint = (helperId: string) => {
    playStepSound();
    setGameState((prev) => activateCoopHint(prev, helperId));
  };

  const handleSelectAnswer = (optionIndex: number) => {
    setGameState((prev) => {
      const next = submitQuestionAnswer(prev, optionIndex);
      if (next.lastOutcome?.isCorrect) {
        if (next.lastOutcome.awardedWedge || next.phase === 'gameover') {
          playWedgeCelebrationSound();
        } else {
          playCorrectSound();
        }
      } else {
        playGentleWrongSound();
      }
      return next;
    });
  };

  const handleContinueFeedback = () => {
    setGameState((prev) => continueAfterFeedback(prev));
  };

  const handleBoardMinigameComplete = (
    success: boolean,
    bonusPoints: number,
    minigameId: MinigameId,
  ) => {
    if (success) playCorrectSound();
    setGameState((prev) => completeMinigameOnBoard(prev, success, bonusPoints, minigameId));
  };

  const handleSendEncouragement = (fromId: string, toId: string, message: string) => {
    playCorrectSound();
    setGameState((prev) => sendSafeEncouragement(prev, fromId, toId, message));
  };

  const activePlayer = gameState.players[gameState.activePlayerIndex];
  const otherPlayers = gameState.players.filter((p) => p.id !== activePlayer.id);
  const activeNode = BOARD_NODE_MAP[activePlayer.nodeId];
  const tier = getTierForAge(gameState.age);
  const winner =
    gameState.players.find((p) => p.id === gameState.winnerPlayerId) ?? activePlayer;

  if (gameState.phase === 'title') {
    return (
      <>
        <TitleScreen
          initialAge={lastConfig.age}
          onStartGame={handleStartGame}
          onOpenMinigames={(selectedAge) => setAtelierOpenAge(selectedAge)}
          onOpenHelp={() => setHelpOpen(true)}
        />
        {atelierOpenAge !== null && (
          <MinigameModal
            age={atelierOpenAge}
            initialMinigame={null}
            isBoardTurn={false}
            onCloseAtelier={() => setAtelierOpenAge(null)}
          />
        )}
        {helpOpen && <HelpPrivacyModal onClose={() => setHelpOpen(false)} />}
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F3EC] text-[#232B38]">
      {/* Compact World-Matched Game Shell Perimeter HUD (not a marketing navbar) */}
      <div className="border-b border-[#DFD6C3] bg-[#FFFDF9] px-4 py-2.5 sm:px-6">
        <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-display text-lg font-bold tracking-tight text-[#232B38] whitespace-nowrap shrink-0">
              La Boussole de l’Entraide
            </span>
            <span aria-hidden="true" className="hidden text-[#C4B9A2] sm:inline">
              ·
            </span>
            <span className="hidden text-xs font-medium text-[#5A6372] sm:inline whitespace-nowrap">
              <strong className="font-mono-num text-[#1E7F5C]">{gameState.age} ans</strong> ({tier.label}) · Tour{' '}
              <span className="font-mono-num">#{gameState.turnNumber}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setAtelierOpenAge(gameState.age)}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#DDD4C2] bg-[#FAF7F0] px-3 py-1.5 text-xs font-semibold text-[#232B38] transition-colors hover:bg-[#EFE9DC] cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#C97A16]" aria-hidden="true" />
              Mini-Jeux
            </button>
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#DDD4C2] bg-[#FAF7F0] px-3 py-1.5 text-xs font-semibold text-[#1E7F5C] transition-colors hover:bg-[#ECF8F3] cursor-pointer whitespace-nowrap"
            >
              <LifeBuoy className="h-3.5 w-3.5" aria-hidden="true" />
              Aide 3018
            </button>
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur();
                handleToggleMute();
              }}
              aria-label={mutedState ? 'Activer le son (M)' : 'Couper le son (M)'}
              title={mutedState ? 'Activer le son [M]' : 'Couper le son [M]'}
              className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-[#DDD4C2] bg-white text-[#4A5362] hover:bg-[#FAF7F0] cursor-pointer"
            >
              {mutedState ? (
                <VolumeX className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Volume2 className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur();
                handleTogglePause();
              }}
              aria-label="Mettre en pause (P ou Échap)"
              title="Pause [P]"
              className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-[#DDD4C2] bg-white text-[#4A5362] hover:bg-[#FAF7F0] cursor-pointer"
            >
              <Pause className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Zone Game Arena */}
      <main className="mx-auto grid w-full max-w-[1380px] flex-1 grid-cols-1 items-center gap-6 px-4 py-5 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:py-6">
        <div className="lg:col-span-7 xl:col-span-7">
          <BoardView
            players={gameState.players}
            activePlayerIndex={gameState.activePlayerIndex}
            reachableNodeIds={gameState.reachableNodeIds}
            onSelectDestination={handleSelectDestination}
          />
        </div>

        <div className="lg:col-span-5 xl:col-span-5">
          <TurnSidebar
            players={gameState.players}
            activePlayerIndex={gameState.activePlayerIndex}
            turnStage={gameState.turnStage}
            diceValue={gameState.diceValue}
            statusBanner={gameState.statusBanner}
            encouragements={gameState.encouragements}
            onRollDice={handleRollDice}
            onSendEncouragement={handleSendEncouragement}
          />
        </div>
      </main>

      {/* Active Question Modal */}
      {(gameState.turnStage === 'answering' ||
        (gameState.turnStage === 'turn-feedback' && gameState.phase === 'playing')) &&
        gameState.activeQuestion && (
          <QuestionModal
            question={gameState.activeQuestion}
            activePlayer={activePlayer}
            otherPlayers={otherPlayers}
            isHqTile={activeNode?.kind === 'hq'}
            isFinalChallenge={gameState.isFinalChallenge}
            eliminatedOptionIndex={gameState.eliminatedOptionIndex}
            helperPlayerId={gameState.helperPlayerId}
            outcome={gameState.lastOutcome}
            onUseCoopHint={handleUseCoopHint}
            onSelectAnswer={handleSelectAnswer}
            onContinue={handleContinueFeedback}
          />
        )}

      {/* Board-Triggered Minigame Modal */}
      {gameState.turnStage === 'minigame' && gameState.activeMinigame && (
        <MinigameModal
          age={gameState.age}
          initialMinigame={gameState.activeMinigame}
          isBoardTurn={true}
          onFinishBoardMinigame={handleBoardMinigameComplete}
        />
      )}

      {/* Standalone Minigame Atelier Modal */}
      {atelierOpenAge !== null && gameState.turnStage !== 'minigame' && (
        <MinigameModal
          age={atelierOpenAge}
          initialMinigame={null}
          isBoardTurn={false}
          onCloseAtelier={() => setAtelierOpenAge(null)}
        />
      )}

      {/* Help 3018 & Privacy Modal */}
      {helpOpen && <HelpPrivacyModal onClose={() => setHelpOpen(false)} />}

      {/* Pause Modal */}
      {gameState.phase === 'paused' && (
        <PauseModal
          turnNumber={gameState.turnNumber}
          age={gameState.age}
          onResume={() => setGameState((prev) => ({ ...prev, phase: 'playing' }))}
          onRestart={() => handleStartGame(lastConfig)}
          onReturnTitle={() =>
            setGameState(createInitialGameState(lastConfig, 'title'))
          }
        />
      )}

      {/* Victory Modal */}
      {gameState.phase === 'gameover' && (
        <VictoryModal
          winner={winner}
          players={gameState.players}
          turnNumber={gameState.turnNumber}
          onPlayAgain={() => handleStartGame(lastConfig)}
          onReturnTitle={() =>
            setGameState(createInitialGameState(lastConfig, 'title'))
          }
        />
      )}
    </div>
  );
}
