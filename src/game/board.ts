import { CATEGORY_ORDER, CategoryId } from '../data/questions/types';

export type TileKind = 'hub' | 'hq' | 'category' | 'minigame' | 'replay';

export interface BoardNode {
  id: string;
  kind: TileKind;
  category?: CategoryId;
  x: number;
  y: number;
  angleDeg: number;
  label: string;
  neighbors: string[];
}

export const BOARD_SIZE = 640;
export const BOARD_CENTER = 320;
export const RING_RADIUS = 218;
export const SPOKE_RADII = [76, 124, 172];
export const RING_COUNT = 35; // 5 spokes * 7 tiles per arc

function buildBoard(): { nodes: BoardNode[]; nodeMap: Record<string, BoardNode> } {
  const nodes: BoardNode[] = [];
  const nodeMap: Record<string, BoardNode> = {};

  const addNode = (node: BoardNode) => {
    nodes.push(node);
    nodeMap[node.id] = node;
  };

  // Central Hub (Start & Final Compass)
  addNode({
    id: 'hub',
    kind: 'hub',
    x: BOARD_CENTER,
    y: BOARD_CENTER,
    angleDeg: -90,
    label: 'Boussole centrale',
    neighbors: [],
  });

  // Outer Ring: 35 tiles; HQ at indices 0, 7, 14, 21, 28
  // Between two HQs (offsets 1..6):
  // offset 1: category (spokeIdx + 1) % 5
  // offset 2: category (spokeIdx + 2) % 5
  // offset 3: minigame (Atelier compétence sociale)
  // offset 4: category (spokeIdx + 3) % 5
  // offset 5: replay (Case Étoile · Rejoue + Empathie)
  // offset 6: category (spokeIdx + 4) % 5
  for (let i = 0; i < RING_COUNT; i++) {
    const angleDeg = -90 + (i * 360) / RING_COUNT;
    const rad = (angleDeg * Math.PI) / 180;
    const x = Math.round((BOARD_CENTER + RING_RADIUS * Math.cos(rad)) * 10) / 10;
    const y = Math.round((BOARD_CENTER + RING_RADIUS * Math.sin(rad)) * 10) / 10;

    const spokeIdx = Math.floor(i / 7);
    const offset = i % 7;

    let kind: TileKind = 'category';
    let category: CategoryId | undefined;
    let label = '';

    if (offset === 0) {
      kind = 'hq';
      category = CATEGORY_ORDER[spokeIdx];
      label = `Quartier Camembert ${category}`;
    } else if (offset === 3) {
      kind = 'minigame';
      label = 'Case Mini-Jeu social';
    } else if (offset === 5) {
      kind = 'replay';
      label = 'Case Étoile d’Entraide (Rejoue)';
    } else {
      kind = 'category';
      const catOffset = offset < 3 ? offset : offset === 4 ? 3 : 4;
      category = CATEGORY_ORDER[(spokeIdx + catOffset) % 5];
      label = `Case ${category}`;
    }

    addNode({
      id: `ring-${i}`,
      kind,
      category,
      x,
      y,
      angleDeg,
      label,
      neighbors: [],
    });
  }

  // Connect ring neighbors bidirectionally
  for (let i = 0; i < RING_COUNT; i++) {
    const prev = (i - 1 + RING_COUNT) % RING_COUNT;
    const next = (i + 1) % RING_COUNT;
    nodeMap[`ring-${i}`].neighbors.push(`ring-${prev}`, `ring-${next}`);
  }

  // Build 5 spokes (each spoke connects hub -> spoke-s-0 -> spoke-s-1 -> spoke-s-2 -> ring-(s*7))
  for (let s = 0; s < 5; s++) {
    const hqRingIdx = s * 7;
    const angleDeg = -90 + (hqRingIdx * 360) / RING_COUNT;
    const rad = (angleDeg * Math.PI) / 180;

    for (let step = 0; step < 3; step++) {
      const r = SPOKE_RADII[step];
      const x = Math.round((BOARD_CENTER + r * Math.cos(rad)) * 10) / 10;
      const y = Math.round((BOARD_CENTER + r * Math.sin(rad)) * 10) / 10;
      const category = CATEGORY_ORDER[(s + step + 1) % 5];
      const id = `spoke-${s}-${step}`;

      addNode({
        id,
        kind: 'category',
        category,
        x,
        y,
        angleDeg,
        label: `Rayon ${s + 1} · ${category}`,
        neighbors: [],
      });
    }

    // Wire spoke edges
    const hub = nodeMap['hub'];
    const s0 = nodeMap[`spoke-${s}-0`];
    const s1 = nodeMap[`spoke-${s}-1`];
    const s2 = nodeMap[`spoke-${s}-2`];
    const hq = nodeMap[`ring-${hqRingIdx}`];

    hub.neighbors.push(s0.id);
    s0.neighbors.push(hub.id, s1.id);
    s1.neighbors.push(s0.id, s2.id);
    s2.neighbors.push(s1.id, hq.id);
    hq.neighbors.push(s2.id);
  }

  return { nodes, nodeMap };
}

const BUILT = buildBoard();
export const BOARD_NODES: BoardNode[] = BUILT.nodes;
export const BOARD_NODE_MAP: Record<string, BoardNode> = BUILT.nodeMap;

/**
 * Computes all valid destinations reachable in exact `steps` moves without
 * reversing immediately onto the previously visited node in a single turn
 * (classic Trivial Pursuit movement rule).
 */
export function getReachableNodes(startNodeId: string, steps: number): string[] {
  if (!BOARD_NODE_MAP[startNodeId] || steps <= 0) {
    return [];
  }

  const results = new Set<string>();

  const dfs = (currentId: string, prevId: string | null, remaining: number) => {
    if (remaining === 0) {
      results.add(currentId);
      return;
    }
    const node = BOARD_NODE_MAP[currentId];
    if (!node) return;
    for (const nextId of node.neighbors) {
      if (nextId === prevId) continue;
      dfs(nextId, currentId, remaining - 1);
    }
  };

  dfs(startNodeId, null, steps);
  return Array.from(results);
}
