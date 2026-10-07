import React from 'react';

/** Tabla de ficha técnica (filas clave/valor desde translations.specs). */
export const SpecTable: React.FC<{ name: string; rows: string[][] }> = ({ name, rows }) => (
  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
    <div className="bg-slate-900 text-white px-6 py-4 font-bold">{name}</div>
    <dl className="divide-y divide-slate-100">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-3 gap-3 px-6 py-3 text-sm">
          <dt className="text-slate-500 font-semibold col-span-1">{k}</dt>
          <dd className="text-slate-800 col-span-2">{v}</dd>
        </div>
      ))}
    </dl>
  </div>
);
