import React from 'react';
import { CATEGORY_META } from '../data/questions';
import {
  BOARD_CENTER,
  BOARD_NODES,
  BOARD_NODE_MAP,
  BOARD_SIZE,
  BoardNode,
  RING_RADIUS,
} from '../game/board';
import { Player } from '../game/engine';

interface BoardViewProps {
  players: Player[];
  activePlayerIndex: number;
  reachableNodeIds: string[];
  onSelectDestination: (nodeId: string) => void;
}

function getTileFill(node: BoardNode): string {
  if (node.kind === 'hub') return '#FFFDF7';
  if (node.kind === 'minigame') return '#FDF6E3';
  if (node.kind === 'replay') return '#EEF7F2';
  if (node.category) return CATEGORY_META[node.category].color;
  return '#E5DEC9';
}

function getTileAccessibleLabel(node: BoardNode): string {
  if (node.kind === 'hub') return 'Aller sur la Boussole centrale';
  if (node.kind === 'hq' && node.category) {
    return `Aller sur le quartier Camembert ${CATEGORY_META[node.category].shortLabel}`;
  }
  if (node.kind === 'minigame') return 'Aller sur la case Mini-Jeu social';
  if (node.kind === 'replay') return 'Aller sur la case Étoile d’Entraide (rejouer)';
  if (node.category) return `Aller sur une case ${CATEGORY_META[node.category].shortLabel}`;
  return `Aller sur ${node.label}`;
}

export function BoardView({
  players,
  activePlayerIndex,
  reachableNodeIds,
  onSelectDestination,
}: BoardViewProps) {
  const reachableSet = new Set(reachableNodeIds);

  // Group players standing on the same node so pawns offset cleanly without colliding
  const playersByNode: Record<string, Player[]> = {};
  players.forEach((p) => {
    if (!playersByNode[p.nodeId]) playersByNode[p.nodeId] = [];
    playersByNode[p.nodeId].push(p);
  });

  return (
    <div
      data-testid="board-surface"
      className="relative mx-auto aspect-square w-full max-w-[610px] select-none"
    >
      <svg
        viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE}`}
        className="h-full w-full drop-shadow-sm"
        aria-label="Plateau de jeu circulaire La Boussole de l’Entraide"
      >
        {/* Outer wooden tabletop rim */}
        <circle
          cx={BOARD_CENTER}
          cy={BOARD_CENTER}
          r={304}
          fill="#E7DFCE"
          stroke="#C8BA9F"
          strokeWidth="3"
        />
        <circle
          cx={BOARD_CENTER}
          cy={BOARD_CENTER}
          r={290}
          fill="#F9F6EE"
          stroke="#D7CCB7"
          strokeWidth="2"
        />

        {/* Subtle decorative inner ring guide */}
        <circle
          cx={BOARD_CENTER}
          cy={BOARD_CENTER}
          r={RING_RADIUS}
          fill="none"
          stroke="#DFD5C2"
          strokeWidth="16"
        />

        {/* Five wooden spoke paths */}
        {[0, 7, 14, 21, 28].map((ringIdx) => {
          const hq = BOARD_NODE_MAP[`ring-${ringIdx}`];
          if (!hq) return null;
          return (
            <line
              key={ringIdx}
              x1={BOARD_CENTER}
              y1={BOARD_CENTER}
              x2={hq.x}
              y2={hq.y}
              stroke="#DFD5C2"
              strokeWidth="14"
              strokeLinecap="round"
            />
          );
        })}

        {/* Decorative inner compass rose lines in calm background */}
        <circle
          cx={BOARD_CENTER}
          cy={BOARD_CENTER}
          r={140}
          fill="none"
          stroke="#EAE2D2"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />

        {/* Render all 51 tiles */}
        {BOARD_NODES.map((node) => {
          const isReachable = reachableSet.has(node.id);
          const fill = getTileFill(node);
          const isHub = node.kind === 'hub';
          const isHq = node.kind === 'hq';
          const radius = isHub ? 42 : isHq ? 22 : 16;

          return (
            <g key={node.id}>
              {isReachable && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius + 7}
                  fill="#1E7F5C"
                  fillOpacity="0.22"
                  stroke="#1E7F5C"
                  strokeWidth="2.5"
                  className="animate-reachable"
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                />
              )}

              <circle
                cx={node.x}
                cy={node.y}
                r={radius}
                fill={fill}
                stroke={
                  isReachable
                    ? '#14583F'
                    : isHub
                      ? '#C99A3B'
                      : isHq
                        ? '#232B38'
                        : '#FFFFFF'
                }
                strokeWidth={isReachable ? 3 : isHq || isHub ? 2.5 : 2}
              />

              {/* Tile inner glyph */}
              {isHub && (
                <g aria-hidden="true">
                  <circle cx={node.x} cy={node.y} r="31" fill="none" stroke="#E5D9BF" strokeWidth="1.2" />
                  <path
                    d={`M ${node.x} ${node.y - 22} L ${node.x + 6} ${node.y - 6} L ${node.x + 22} ${node.y} L ${node.x + 6} ${node.y + 6} L ${node.x} ${node.y + 22} L ${node.x - 6} ${node.y + 6} L ${node.x - 22} ${node.y} L ${node.x - 6} ${node.y - 6} Z`}
                    fill="#C99A3B"
                    fillOpacity="0.26"
                    stroke="#A67A23"
                    strokeWidth="1.4"
                  />
                  <circle cx={node.x} cy={node.y} r="5.5" fill="#FFFDF7" stroke="#A67A23" strokeWidth="1.8" />
                </g>
              )}

              {isHq && (
                <g aria-hidden="true">
                  {/* Small wedge / camembert emblem inside HQ space */}
                  <path
                    d={`M ${node.x} ${node.y - 9} L ${node.x + 8} ${node.y + 6} A 10 10 0 0 1 ${node.x - 8} ${node.y + 6} Z`}
                    fill="#FFFFFF"
                    fillOpacity="0.92"
                  />
                </g>
              )}

              {node.kind === 'minigame' && (
                <g aria-hidden="true">
                  <path
                    d={`M ${node.x} ${node.y - 8} L ${node.x + 2.4} ${node.y - 2.4} L ${node.x + 8} ${node.y} L ${node.x + 2.4} ${node.y + 2.4} L ${node.x} ${node.y + 8} L ${node.x - 2.4} ${node.y + 2.4} L ${node.x - 8} ${node.y} L ${node.x - 2.4} ${node.y - 2.4} Z`}
                    fill="#C97A16"
                  />
                </g>
              )}

              {node.kind === 'replay' && (
                <g aria-hidden="true">
                  <path
                    d={`M ${node.x} ${node.y - 6.5} C ${node.x - 5.5} ${node.y - 11}, ${node.x - 10} ${node.y - 1}, ${node.x} ${node.y + 7.5} C ${node.x + 10} ${node.y - 1}, ${node.x + 5.5} ${node.y - 11}, ${node.x} ${node.y - 6.5} Z`}
                    fill="#1E7F5C"
                  />
                </g>
              )}
            </g>
          );
        })}

        {/* Outer HQ category labels curved concentrically along the wooden bezel */}
        <defs>
          {[0, 7, 14, 21, 28].map((ringIdx) => {
            const hq = BOARD_NODE_MAP[`ring-${ringIdx}`];
            if (!hq) return null;
            const isBottom = hq.angleDeg > 20 && hq.angleDeg < 160;
            const arcR = isBottom ? 274 : 265;
            const span = 28;
            const a1 = ((isBottom ? hq.angleDeg + span : hq.angleDeg - span) * Math.PI) / 180;
            const a2 = ((isBottom ? hq.angleDeg - span : hq.angleDeg + span) * Math.PI) / 180;
            const x1 = BOARD_CENTER + arcR * Math.cos(a1);
            const y1 = BOARD_CENTER + arcR * Math.sin(a1);
            const x2 = BOARD_CENTER + arcR * Math.cos(a2);
            const y2 = BOARD_CENTER + arcR * Math.sin(a2);
            const sweep = isBottom ? 0 : 1;
            return (
              <path
                key={`arc-${ringIdx}`}
                id={`hq-arc-${ringIdx}`}
                d={`M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${arcR} ${arcR} 0 0 ${sweep} ${x2.toFixed(1)} ${y2.toFixed(1)}`}
                fill="none"
              />
            );
          })}
        </defs>
        {[0, 7, 14, 21, 28].map((ringIdx) => {
          const hq = BOARD_NODE_MAP[`ring-${ringIdx}`];
          if (!hq || !hq.category) return null;
          return (
            <text
              key={`lbl-${ringIdx}`}
              fontSize="12.5"
              fontWeight="700"
              letterSpacing="0.03em"
              fill={CATEGORY_META[hq.category].darkText}
            >
              <textPath href={`#hq-arc-${ringIdx}`} startOffset="50%" textAnchor="middle">
                {CATEGORY_META[hq.category].shortLabel}
              </textPath>
            </text>
          );
        })}

        {/* Render Player Pawns */}
        {Object.entries(playersByNode).map(([nodeId, group]) => {
          const node = BOARD_NODE_MAP[nodeId];
          if (!node) return null;
          return group.map((player, subIdx) => {
            const isCurrent = players[activePlayerIndex]?.id === player.id;
            const offsetAngle = (subIdx * 2 * Math.PI) / Math.max(group.length, 1) - Math.PI / 4;
            const spread = group.length === 1 ? 0 : node.kind === 'hub' ? 16 : 10;
            const px = node.x + spread * Math.cos(offsetAngle);
            const py = node.y + spread * Math.sin(offsetAngle);

            return (
              <g
                key={player.id}
                style={{
                  transform: `translate(${px}px, ${py}px)`,
                  transition: 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {isCurrent && (
                  <circle
                    cx={0}
                    cy={0}
                    r={16}
                    fill="none"
                    stroke="#232B38"
                    strokeWidth="2.2"
                    strokeDasharray="3 2"
                  />
                )}
                <circle
                  cx={0}
                  cy={0}
                  r={12}
                  fill={player.color}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
                <text
                  x={0}
                  y={4}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight="700"
                  fill="#FFFFFF"
                >
                  {player.name.slice(0, 1).toUpperCase()}
                </text>
              </g>
            );
          });
        })}
      </svg>

      {/* Accessible native <button> overlay targets strictly for reachable destinations */}
      {reachableNodeIds.map((nodeId) => {
        const node = BOARD_NODE_MAP[nodeId];
        if (!node) return null;
        const leftPct = (node.x / BOARD_SIZE) * 100;
        const topPct = (node.y / BOARD_SIZE) * 100;
        return (
          <button
            key={`target-${nodeId}`}
            type="button"
            onClick={() => onSelectDestination(nodeId)}
            aria-label={getTileAccessibleLabel(node)}
            style={{
              left: `${leftPct}%`,
              top: `${topPct}%`,
            }}
            className="absolute z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-transparent transition-transform hover:scale-110 hover:bg-[#1E7F5C]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14583F] cursor-pointer"
          >
            <span className="sr-only">{getTileAccessibleLabel(node)}</span>
          </button>
        );
      })}
    </div>
  );
}
