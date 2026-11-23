import assert from 'node:assert/strict';
import test from 'node:test';
import { BOARD_NODES, BOARD_NODE_MAP, getReachableNodes } from './board';
import {
  activateCoopHint,
  completeMinigameOnBoard,
  continueAfterFeedback,
  createInitialGameState,
  movePlayerToNode,
  rollDiceAction,
  selectProgressiveQuestion,
  sendSafeEncouragement,
  shuffleQuestionOptions,
  submitQuestionAnswer,
  SAFE_ENCOURAGEMENTS,
} from './engine';
import { ALL_QUESTIONS, CATEGORY_ORDER } from '../data/questions';

test('board topology has 51 connected nodes and 5 HQ camembert spaces', () => {
  assert.equal(BOARD_NODES.length, 51); // 1 hub + 35 ring + 15 spokes
  const hqNodes = BOARD_NODES.filter((n) => n.kind === 'hq');
  assert.equal(hqNodes.length, 5);
  assert.deepEqual(
    hqNodes.map((n) => n.category),
    CATEGORY_ORDER,
  );

  // Bidirectional adjacency invariant
  for (const node of BOARD_NODES) {
    assert.ok(node.neighbors.length >= 2, `Node ${node.id} should have >= 2 neighbors`);
    for (const neighborId of node.neighbors) {
      const neighbor = BOARD_NODE_MAP[neighborId];
      assert.ok(neighbor, `Missing neighbor ${neighborId}`);
      assert.ok(
        neighbor.neighbors.includes(node.id),
        `Edge ${node.id} <-> ${neighborId} is not symmetric`,
      );
    }
  }
});

test('getReachableNodes returns exact-step destinations from hub and ring', () => {
  // From hub in 4 steps -> all 5 HQ ring nodes
  const fromHub4 = getReachableNodes('hub', 4).sort();
  assert.deepEqual(fromHub4, ['ring-0', 'ring-14', 'ring-21', 'ring-28', 'ring-7']);

  // From ring-1 in 1 step -> ring-0 and ring-2
  const fromRing1 = getReachableNodes('ring-1', 1).sort();
  assert.deepEqual(fromRing1, ['ring-0', 'ring-2']);
});

test('progressive question selector adapts to age 6-15 and avoids repeats', () => {
  const q6 = selectProgressiveQuestion('physique', 6, 0, [], () => 0.1);
  assert.equal(q6.difficulty, 1);

  const q10Mid = selectProgressiveQuestion('verbal', 10, 3, [], () => 0.2);
  assert.equal(q10Mid.difficulty, 2);

  const q14Adv = selectProgressiveQuestion('cyber', 14, 2, [], () => 0.3);
  assert.equal(q14Adv.difficulty, 3);

  const qNext = selectProgressiveQuestion('cyber', 14, 2, [q14Adv.id], () => 0.3);
  assert.notEqual(qNext.id, q14Adv.id);
});

test('full turn flow: roll -> HQ move -> coop hint -> correct answer awards camembert and coop heart', () => {
  let state = createInitialGameState(
    {
      age: 10,
      players: [
        { name: 'Renard', totem: 'renard' },
        { name: 'Hibou', totem: 'hibou' },
      ],
    },
    'playing',
  );

  // Roll 4 from hub reaches all 5 HQ tiles (including ring-0 = physique)
  state = rollDiceAction(state, 4);
  assert.equal(state.turnStage, 'choose-destination');
  assert.ok(state.reachableNodeIds.includes('ring-0'));

  state = movePlayerToNode(state, 'ring-0', () => 0.0);
  assert.equal(state.turnStage, 'answering');
  assert.ok(state.activeQuestion);
  assert.equal(state.activeQuestion.category, 'physique');

  // Player 2 lends a cooperative hint
  state = activateCoopHint(state, state.players[1].id, () => 0.0);
  assert.equal(state.helperPlayerId, state.players[1].id);
  assert.notEqual(state.eliminatedOptionIndex, null);
  assert.ok(state.activeQuestion);
  assert.notEqual(state.eliminatedOptionIndex, state.activeQuestion.correctIndex);

  // Player 1 answers correctly
  state = submitQuestionAnswer(state, state.activeQuestion.correctIndex);
  assert.equal(state.turnStage, 'turn-feedback');
  assert.equal(state.lastOutcome?.isCorrect, true);
  assert.equal(state.lastOutcome?.awardedWedge, 'physique');
  assert.equal(state.players[0].wedges.includes('physique'), true);
  assert.equal(state.players[0].coopHearts, 1);
  assert.equal(state.players[1].coopHearts, 1);
  assert.equal(state.players[0].badges.includes('main-tendue'), true);

  // On correct answer, player keeps their turn
  state = continueAfterFeedback(state);
  assert.equal(state.activePlayerIndex, 0);
  assert.equal(state.turnStage, 'ready-to-roll');
});

test('wrong answer advances turn to next player and final hub challenge triggers victory', () => {
  let state = createInitialGameState(
    {
      age: 12,
      players: [
        { name: 'Loutre', totem: 'loutre' },
        { name: 'Panda', totem: 'panda' },
      ],
    },
    'playing',
  );

  state = rollDiceAction(state, 1);
  state = movePlayerToNode(state, state.reachableNodeIds[0], () => 0.0);
  const wrongIdx = (state.activeQuestion!.correctIndex + 1) % 4;
  state = submitQuestionAnswer(state, wrongIdx);
  assert.equal(state.lastOutcome?.isCorrect, false);

  state = continueAfterFeedback(state);
  assert.equal(state.activePlayerIndex, 1);

  // Give player 2 all 5 wedges and put them 1 step away from hub
  state = {
    ...state,
    players: state.players.map((p, i) =>
      i === 1 ? { ...p, nodeId: 'spoke-0-0', wedges: [...CATEGORY_ORDER] } : p,
    ),
  };

  state = rollDiceAction(state, 1);
  assert.ok(state.reachableNodeIds.includes('hub'));
  state = movePlayerToNode(state, 'hub', () => 0.0);
  assert.equal(state.isFinalChallenge, true);

  state = submitQuestionAnswer(state, state.activeQuestion!.correctIndex);
  assert.equal(state.phase, 'gameover');
  assert.equal(state.winnerPlayerId, state.players[1].id);
  assert.ok(state.players[1].badges.includes('boussole-or'));
});

test('minigame completion and safe encouragement cards update empathy scores', () => {
  let state = createInitialGameState(
    {
      age: 8,
      players: [
        { name: 'Renard', totem: 'renard' },
        { name: 'Loutre', totem: 'loutre' },
      ],
    },
    'playing',
  );

  // Move to ring-3 (minigame tile) from ring-2 with roll 1
  state = {
    ...state,
    players: state.players.map((p, i) => (i === 0 ? { ...p, nodeId: 'ring-2' } : p)),
  };
  state = rollDiceAction(state, 1);
  state = movePlayerToNode(state, 'ring-3', () => 0.5);
  assert.equal(state.turnStage, 'minigame');
  assert.ok(state.activeMinigame);

  state = completeMinigameOnBoard(state, true, 18, state.activeMinigame!);
  assert.equal(state.turnStage, 'ready-to-roll');
  assert.equal(state.players[0].minigamesWon, 1);
  assert.ok(state.players[0].empathyScore >= 18);

  const before0 = state.players[0].empathyScore;
  const before1 = state.players[1].empathyScore;
  state = sendSafeEncouragement(
    state,
    state.players[0].id,
    state.players[1].id,
    SAFE_ENCOURAGEMENTS[0],
  );
  assert.equal(state.encouragements.length, 1);
  assert.equal(state.players[0].empathyScore, before0 + 3);
  assert.equal(state.players[1].empathyScore, before1 + 3);
});

test('shuffleQuestionOptions and selectProgressiveQuestion randomize correctIndex across A/B/C/D without losing the right answer', () => {
  // Deterministic LCG PRNG for reproducible uniform distribution checks
  let seed = 42;
  const seededRng = () => {
    seed = (seed * 1664525 + 1013904223) % 0x100000000;
    return seed / 0x100000000;
  };

  const sample = ALL_QUESTIONS[0];
  const originalCorrectText = sample.options[sample.correctIndex];
  const originalOptionsSnapshot = [...sample.options];

  const seenIndices = new Set<number>();
  for (let i = 0; i < 80; i++) {
    const shuffled = shuffleQuestionOptions(sample, seededRng);
    assert.equal(shuffled.options.length, 4);
    assert.deepEqual([...shuffled.options].sort(), [...originalOptionsSnapshot].sort());
    assert.equal(shuffled.options[shuffled.correctIndex], originalCorrectText);
    seenIndices.add(shuffled.correctIndex);
  }
  // Original question must remain unmutated
  assert.deepEqual(sample.options, originalOptionsSnapshot);
  // All 4 answer slots (A=0, B=1, C=2, D=3) must occur
  assert.deepEqual([...seenIndices].sort(), [0, 1, 2, 3]);

  // Also verify selectProgressiveQuestion produces varied correctIndex values across draws
  const drawnIndices = new Set<number>();
  const used: string[] = [];
  for (let i = 0; i < 40; i++) {
    const cat = CATEGORY_ORDER[i % CATEGORY_ORDER.length];
    const q = selectProgressiveQuestion(cat, 10, i % 5, used, seededRng);
    used.push(q.id);
    const original = ALL_QUESTIONS.find((item) => item.id === q.id)!;
    assert.equal(q.options[q.correctIndex], original.options[original.correctIndex]);
    drawnIndices.add(q.correctIndex);
  }
  assert.deepEqual([...drawnIndices].sort(), [0, 1, 2, 3]);
});

