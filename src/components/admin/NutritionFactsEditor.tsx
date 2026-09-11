"use client";

import { useState } from "react";

export type NutritionRow = { label: string; value: string; dailyValue?: string };

const inputClass =
  "w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-500";

export function NutritionFactsEditor({
  defaultServingSize,
  defaultServingsPerContainer,
  defaultRows,
}: {
  defaultServingSize?: string;
  defaultServingsPerContainer?: string;
  defaultRows?: NutritionRow[];
}) {
  const [servingSize, setServingSize] = useState(defaultServingSize ?? "");
  const [servingsPerContainer, setServingsPerContainer] = useState(
    defaultServingsPerContainer ?? ""
  );
  const [rows, setRows] = useState<NutritionRow[]>(defaultRows ?? []);

  function updateRow(index: number, patch: Partial<NutritionRow>) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function addRow() {
    setRows((prev) => [...prev, { label: "", value: "", dailyValue: "" }]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3 rounded-md border border-neutral-200 p-4">
      <p className="text-sm font-medium text-neutral-700">Tabla nutricional (opcional)</p>

      <input type="hidden" name="nutritionServingSize" value={servingSize} />
      <input type="hidden" name="nutritionServingsPerContainer" value={servingsPerContainer} />
      <input type="hidden" name="nutritionFacts" value={JSON.stringify(rows)} />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-neutral-500">Porción (ej. 1 cucharadita (14g))</label>
          <input
            value={servingSize}
            onChange={(e) => setServingSize(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-neutral-500">Porciones por envase (ej. 13 aprox.)</label>
          <input
            value={servingsPerContainer}
            onChange={(e) => setServingsPerContainer(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-xs text-neutral-500">
          <span>Nutriente</span>
          <span>Cantidad</span>
          <span>%VD</span>
          <span />
        </div>
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
            <input
              placeholder="Calorías"
              value={row.label}
              onChange={(e) => updateRow(i, { label: e.target.value })}
              className={inputClass}
            />
            <input
              placeholder="126 kcal"
              value={row.value}
              onChange={(e) => updateRow(i, { value: e.target.value })}
              className={inputClass}
            />
            <input
              placeholder="7%"
              value={row.dailyValue ?? ""}
              onChange={(e) => updateRow(i, { dailyValue: e.target.value })}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="text-xs font-medium text-neutral-600 underline hover:text-neutral-900"
      >
        + Agregar nutriente
      </button>
    </div>
  );
}
