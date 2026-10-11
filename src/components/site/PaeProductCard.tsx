"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { WhatsAppCta } from "@/components/site/WhatsAppCta";

export type PaeProductData = {
  id: string;
  name: string;
  slug: string;
  packSize: string;
  servingSize: string;
  servingsPerBottle: string;
  description: string;
  frontImage: string;
  backImage: string;
  nutritionFacts: { label: string; value: string; dailyValue?: string }[];
};

export function PaeProductCard({ product, phones }: { product: PaeProductData; phones: string[] }) {
  const [activeTab, setActiveTab] = useState<"front" | "back" | "table">("front");
  const [hovered, setHovered] = useState(false);

  const quoteMessage = `Hola, me comunico para cotizar el producto ${product.name} (${product.packSize}) de la línea PAE (Programa de Alimentación Escolar).`;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border-2 border-emerald-100 bg-white shadow-md transition-all duration-300 hover:border-emerald-300 hover:shadow-xl">
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between border-b border-emerald-50 bg-gradient-to-r from-emerald-50 via-emerald-100/40 to-teal-50 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
            Acreditado para PAE / Estado
          </span>
        </div>
        <span className="rounded-full bg-emerald-700 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
          {product.packSize}
        </span>
      </div>

      {/* Selector de visualización (Frente / Etiqueta Nutricional / Tabla) */}
      <div className="flex items-center justify-center gap-1.5 border-b border-neutral-100 bg-neutral-50/60 p-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("front")}
          className={`flex items-center gap-1 rounded-xl px-3 py-1.5 font-bold transition ${
            activeTab === "front"
              ? "bg-white text-emerald-700 shadow-sm border border-emerald-200"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          <span>🍼</span> Frente
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("back")}
          className={`flex items-center gap-1 rounded-xl px-3 py-1.5 font-bold transition ${
            activeTab === "back"
              ? "bg-white text-emerald-700 shadow-sm border border-emerald-200"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          <span>🔍</span> Etiqueta Reverso
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("table")}
          className={`flex items-center gap-1 rounded-xl px-3 py-1.5 font-bold transition ${
            activeTab === "table"
              ? "bg-white text-emerald-700 shadow-sm border border-emerald-200"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          <span>📊</span> Valores Nutricionales
        </button>
      </div>

      {/* Contenedor Visual */}
      <div className="relative flex min-h-[360px] flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-neutral-50/50">
        {activeTab === "front" && (
          <div
            className="relative h-80 w-full cursor-pointer transition-transform duration-300 group-hover:scale-105"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => setActiveTab("back")}
            title="Haz clic para ver la etiqueta de reverso"
          >
            <Image
              src={hovered ? product.backImage : product.frontImage}
              alt={product.name}
              fill
              className="object-contain transition-opacity duration-300"
              sizes="(max-width: 768px) 100vw, 500px"
            />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
              Pasa el cursor o haz clic para ver reverso
            </div>
          </div>
        )}

        {activeTab === "back" && (
          <div
            className="relative h-80 w-full cursor-pointer"
            onClick={() => setActiveTab("front")}
            title="Haz clic para volver a la vista frontal"
          >
            <Image
              src={product.backImage}
              alt={`Reverso etiqueta nutricional - ${product.name}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 500px"
            />
            <div className="absolute top-2 right-2 rounded-lg bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              Toma Real
            </div>
          </div>
        )}

        {activeTab === "table" && (
          <div className="w-full max-h-[320px] overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-4 shadow-inner text-xs">
            <div className="mb-3 border-b border-neutral-200 pb-2">
              <p className="font-black text-neutral-900 uppercase tracking-tight text-[13px]">
                Información Nutricional Oficial
              </p>
              <div className="mt-1 flex justify-between text-neutral-500 text-[11px]">
                <span>Porción: {product.servingSize}</span>
                <span>Porciones: {product.servingsPerBottle}</span>
              </div>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  <th className="py-1">Nutriente</th>
                  <th className="py-1 text-right">Composición</th>
                  <th className="py-1 text-right">% VD*</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                {product.nutritionFacts.map((fact, idx) => (
                  <tr key={idx} className="hover:bg-emerald-50/40">
                    <td className="py-1.5">{fact.label}</td>
                    <td className="py-1.5 text-right font-semibold text-neutral-900">{fact.value}</td>
                    <td className="py-1.5 text-right text-emerald-700 font-bold">{fact.dailyValue ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-[9px] text-neutral-400 leading-tight">
              * Valores Diarios de Referencia basados en una dieta de 2,000 kcal para escolares. Fuente: Ficha Técnica oficial del Programa PAE.
            </p>
          </div>
        )}
      </div>

      {/* Información del Producto */}
      <div className="flex flex-1 flex-col justify-between p-6 pt-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
            <span>Marca Lenysol</span>
            <span>•</span>
            <span>Uso Institucional Escolar</span>
          </div>
          <h3 className="mt-1 text-xl font-black text-neutral-900" style={{ fontFamily: "var(--font-display)" }}>
            {product.name}
          </h3>
          <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
            {product.description}
          </p>

          {/* Especificaciones clave */}
          <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-neutral-50 p-3 text-[11px]">
            <div>
              <span className="block text-neutral-400 font-medium">Presentación:</span>
              <strong className="text-neutral-800">{product.packSize}</strong>
            </div>
            <div>
              <span className="block text-neutral-400 font-medium">Porciones botella:</span>
              <strong className="text-neutral-800">{product.servingsPerBottle}</strong>
            </div>
            <div>
              <span className="block text-neutral-400 font-medium">Inocuidad:</span>
              <strong className="text-emerald-700">Certificación HACCP</strong>
            </div>
            <div>
              <span className="block text-neutral-400 font-medium">Grasas Trans:</span>
              <strong className="text-emerald-700">0% (Libre de Trans)</strong>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Link
            href={`/producto/${product.slug}`}
            className="flex-1 rounded-xl border border-neutral-200 bg-white py-2.5 text-center text-xs font-bold text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-900"
          >
            Ver Ficha Completa
          </Link>
          <WhatsAppCta
            phones={phones}
            message={quoteMessage}
            fallbackHref={`https://wa.me/51932598762?text=${encodeURIComponent(quoteMessage)}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
          >
            <span>💬</span> Cotizar PAE
          </WhatsAppCta>
        </div>
      </div>
    </div>
  );
}
