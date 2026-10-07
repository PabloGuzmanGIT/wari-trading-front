import React from 'react';
import { company } from '@/lib/company';

/**
 * Esquema (no a escala) del corredor de acopio, de norte a sur, siguiendo
 * los ríos Ene y Apurímac, con la planta en Ayacucho al oeste.
 */
export const CorridorMap: React.FC<{ plantLabel: string; riverLabel: string; className?: string }> = ({
  plantLabel, riverLabel, className,
}) => {
  const places = company.origin.districts;
  const top = 40;
  const step = 38;
  const height = top * 2 + step * (places.length - 1) + 20;
  const pts = places.map((name, i) => ({ name, x: 210 + 28 * Math.sin(i * 0.8), y: top + i * step }));

  const river = pts
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y - 30}` : `S ${pts[i - 1].x + (p.x - pts[i - 1].x) * 0.2 + 18} ${p.y - step / 2} ${p.x} ${p.y}`))
    .join(' ') + ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].y + 30}`;

  const hub = pts[Math.max(places.indexOf('San Francisco'), 0)];
  const plant = { x: 60, y: hub.y + 20 };
  const isEnd = (i: number) => i === 0 || i === pts.length - 1;

  return (
    <svg viewBox={`0 0 360 ${height}`} className={className} role="img" aria-label={`${places[0]} – ${places[places.length - 1]}`}>
      <path d={river} fill="none" className="stroke-emerald-200" strokeWidth="14" strokeLinecap="round" />
      <path d={river} fill="none" className="stroke-emerald-400" strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" />
      <text x={pts[0].x - 22} y={pts[0].y + step / 2} className="fill-emerald-500" fontSize="10" fontWeight="700" letterSpacing="2" transform={`rotate(-90 ${pts[0].x - 22} ${pts[0].y + step / 2})`} textAnchor="middle">
        {riverLabel.toUpperCase()}
      </text>

      <path d={`M ${hub.x} ${hub.y} Q ${(hub.x + plant.x) / 2} ${plant.y + 40} ${plant.x} ${plant.y}`} fill="none" className="stroke-slate-400" strokeWidth="1.5" strokeDasharray="5 5" />
      <rect x={plant.x - 14} y={plant.y - 14} width="28" height="28" rx="7" className="fill-slate-900" />
      <path d={`M ${plant.x - 7} ${plant.y + 6} v -8 l 5 -4 v 4 l 5 -4 v 12 z`} className="fill-white" />
      <text x={plant.x - 14} y={plant.y + 34} className="fill-slate-900" fontSize="12" fontWeight="700">{plantLabel}</text>

      {pts.map((p, i) => (
        <g key={p.name}>
          <circle cx={p.x} cy={p.y} r={isEnd(i) ? 9 : 6} className={isEnd(i) ? 'fill-emerald-600' : 'fill-white stroke-emerald-600'} strokeWidth="2.5" />
          <text x={p.x + 18} y={p.y + 4} className={isEnd(i) ? 'fill-slate-900' : 'fill-slate-600'} fontSize={isEnd(i) ? 14 : 12} fontWeight={isEnd(i) ? 800 : 500}>
            {p.name}
          </text>
        </g>
      ))}
    </svg>
  );
};
