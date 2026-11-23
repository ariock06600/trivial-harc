import React from 'react';
import { CATEGORY_META, CATEGORY_ORDER, CategoryId } from '../data/questions/types';
import { AvatarTotemId } from '../game/engine';

export function CategoryIcon({
  category,
  size = 18,
  color,
  className = '',
}: {
  category: CategoryId;
  size?: number;
  color?: string;
  className?: string;
}) {
  const stroke = color ?? CATEGORY_META[category].color;
  switch (category) {
    case 'physique':
      // Shield icon
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={className}
        >
          <path
            d="M12 3L4.5 6.2V11.5C4.5 16.4 7.7 20.3 12 21.6C16.3 20.3 19.5 16.4 19.5 11.5V6.2L12 3Z"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M9 12.2L11 14.2L15.3 9.8"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'isolement':
      // Connected circle / bridge of inclusion
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={className}
        >
          <circle cx="8" cy="9" r="3" stroke={stroke} strokeWidth="2" />
          <circle cx="16.5" cy="9" r="3" stroke={stroke} strokeWidth="2" />
          <path
            d="M3.5 19C3.5 15.8 5.5 14 8 14C10.5 14 12.5 15.8 12.5 19"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12.5 19C12.5 16.2 14.2 14.3 16.5 14.3C18.8 14.3 20.5 16.2 20.5 19"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'verbal':
      // Speech bubble with calm wave
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={className}
        >
          <path
            d="M4.5 6.5C4.5 5.4 5.4 4.5 6.5 4.5H17.5C18.6 4.5 19.5 5.4 19.5 6.5V14.5C19.5 15.6 18.6 16.5 17.5 16.5H10L6 20V16.5H6.5C5.4 16.5 4.5 15.6 4.5 14.5V6.5Z"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 9.5H15.5M8.5 12.5H13"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'cyber':
      // Safe tablet / screen shield
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={className}
        >
          <rect
            x="4"
            y="4.5"
            width="16"
            height="12"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
          />
          <path
            d="M8.5 20H15.5M12 16.5V20"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M9.5 10.5L11.2 12.2L14.8 8.8"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'reactions':
      // Open compass star / helping heart
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={className}
        >
          <path
            d="M12 20.5C12 20.5 4.5 15.5 4.5 9.6C4.5 7 6.5 5 9 5C10.5 5 11.4 5.8 12 6.8C12.6 5.8 13.5 5 15 5C17.5 5 19.5 7 19.5 9.6C19.5 15.5 12 20.5 12 20.5Z"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

/**
 * 5-slice SVG Camembert wheel tracker for each player.
 */
export function CamembertWheel({
  wedges,
  size = 44,
}: {
  wedges: CategoryId[];
  size?: number;
}) {
  const cx = 24;
  const cy = 24;
  const r = 19;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label={`${wedges.length} camemberts sur 5`}
      className="shrink-0"
    >
      <circle cx={cx} cy={cy} r={22} fill="#EFE9DC" stroke="#CFC5B2" strokeWidth="1.5" />
      {CATEGORY_ORDER.map((cat, idx) => {
        const startAngle = (-90 + idx * 72) * (Math.PI / 180);
        const endAngle = (-90 + (idx + 1) * 72) * (Math.PI / 180);
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const d = `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
        const earned = wedges.includes(cat);
        return (
          <path
            key={cat}
            d={d}
            fill={earned ? CATEGORY_META[cat].color : '#FDFBF7'}
            stroke="#C7BDA8"
            strokeWidth="1.2"
          />
        );
      })}
      <circle cx={cx} cy={cy} r="5.5" fill="#FDFBF7" stroke="#B7AA91" strokeWidth="1.3" />
    </svg>
  );
}

/**
 * Stylized animal totem icon for anonymous minor-safe player avatars.
 */
export function TotemAvatar({
  totem,
  color,
  size = 32,
}: {
  totem: AvatarTotemId;
  color: string;
  size?: number;
}) {
  const initialMap: Record<AvatarTotemId, string> = {
    renard: 'R',
    hibou: 'H',
    loutre: 'L',
    panda: 'P',
    herisson: 'É',
    colibri: 'C',
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="18" cy="18" r="16.5" fill={color} stroke="#FFFFFF" strokeWidth="2" />
      {totem === 'renard' && (
        <path
          d="M11 13L13.5 9L16 13H20L22.5 9L25 13L23.5 22L18 25.5L12.5 22L11 13Z"
          fill="#FFFFFF"
          fillOpacity="0.92"
        />
      )}
      {totem === 'hibou' && (
        <g fill="#FFFFFF" fillOpacity="0.92">
          <circle cx="14" cy="16" r="3.5" />
          <circle cx="22" cy="16" r="3.5" />
          <path d="M16 21L18 24L20 21H16Z" />
          <circle cx="14" cy="16" r="1.3" fill={color} />
          <circle cx="22" cy="16" r="1.3" fill={color} />
        </g>
      )}
      {totem === 'loutre' && (
        <g fill="#FFFFFF" fillOpacity="0.92">
          <circle cx="18" cy="18" r="7.5" />
          <circle cx="12" cy="12" r="2.2" />
          <circle cx="24" cy="12" r="2.2" />
          <circle cx="15.5" cy="17" r="1.1" fill={color} />
          <circle cx="20.5" cy="17" r="1.1" fill={color} />
          <ellipse cx="18" cy="20" rx="2" ry="1.3" fill={color} />
        </g>
      )}
      {totem === 'panda' && (
        <g fill="#FFFFFF" fillOpacity="0.94">
          <circle cx="12" cy="12" r="2.7" />
          <circle cx="24" cy="12" r="2.7" />
          <circle cx="18" cy="19" r="7.2" />
          <ellipse cx="15.2" cy="18" rx="1.9" ry="2.3" fill={color} />
          <ellipse cx="20.8" cy="18" rx="1.9" ry="2.3" fill={color} />
          <circle cx="18" cy="21.2" r="1.1" fill={color} />
        </g>
      )}
      {totem === 'herisson' && (
        <g fill="#FFFFFF" fillOpacity="0.92">
          <path d="M9 21C9 14.5 13 11 18 11C23 11 27 14.5 27 21H9Z" />
          <circle cx="21.5" cy="17.5" r="1.2" fill={color} />
        </g>
      )}
      {totem === 'colibri' && (
        <g fill="#FFFFFF" fillOpacity="0.92">
          <path d="M11 21C13 15 17 12 22 13L27 11.5L22.5 16C22 20 18.5 23 13 23L11 21Z" />
        </g>
      )}
      <text
        x="18"
        y="34"
        textAnchor="middle"
        fontSize="0"
        fill="transparent"
      >
        {initialMap[totem]}
      </text>
    </svg>
  );
}
