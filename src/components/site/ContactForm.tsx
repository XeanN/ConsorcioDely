"use client";

import { useState } from "react";

export function ContactForm({
  phone,
  email,
}: {
  phone: string | null;
  email: string | null;
}) {
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [city, setCity] = useState("");
  const [productInterest, setProductInterest] = useState("Abarrotes en general");
  const [message, setMessage] = useState("");

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone?.replace(/[^0-9]/g, "") || "970835166";
    const text = `Hola Consorcio Dely, mi nombre es ${name || "un cliente"}${business ? ` de ${business}` : ""}${city ? ` (${city})` : ""}. Estoy interesado en: ${productInterest}.${message ? ` Mensaje: ${message}` : ""}`;
    const url = `https://wa.me/51${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleEmail = () => {
    const targetEmail = email || "ventas@dely.pe";
    const subject = `Cotización web - ${name || "Cliente"} (${business || "Empresa"})`;
    const body = `Nombre: ${name}\nEmpresa/Negocio: ${business}\nCiudad/Región: ${city}\nInterés: ${productInterest}\nMensaje: ${message}`;
    window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={handleWhatsApp} className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xl shadow-black/5 sm:p-8">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red">
        <span className="h-2 w-2 rounded-full bg-brand-red animate-pulse" />
        Cotización Inmediata
      </div>
      <h3 className="mt-2 text-xl font-black text-neutral-900" style={{ fontFamily: "var(--font-display)" }}>
        Envíanos tu consulta
      </h3>
      <p className="mt-1 text-xs text-neutral-500">
        Completa los datos y nuestro equipo comercial te responderá al instante.
      </p>

      <div className="mt-6 space-y-4 text-sm">
        <div>
          <label className="block text-xs font-bold text-neutral-700">Tu nombre completo</label>
          <input
            type="text"
            required
            placeholder="Ej: Carlos Mendoza"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 text-neutral-900 outline-none transition focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/10"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-neutral-700">Nombre de negocio / Bodega</label>
            <input
              type="text"
              placeholder="Ej: Bodega San José"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 text-neutral-900 outline-none transition focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/10"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-700">Ciudad / Departamento</label>
            <input
              type="text"
              placeholder="Ej: Lima, Arequipa, Trujillo"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 text-neutral-900 outline-none transition focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/10"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-700">Categoría o productos de interés</label>
          <select
            value={productInterest}
            onChange={(e) => setProductInterest(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2.5 text-neutral-900 outline-none transition focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/10"
          >
            <option value="Abarrotes en general">Abarrotes en general</option>
            <option value="Aceites vegetales">Aceites vegetales (al por mayor)</option>
            <option value="Conservas">Conservas de pescado y vegetales</option>
            <option value="Mermeladas y untables">Mermeladas y untables</option>
            <option value="Marcas aliadas (P&G, Alicorp, etc.)">Marcas aliadas</option>
            <option value="Licitaciones y compras corporativas">Licitaciones / Compras corporativas</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-700">Mensaje o detalle del pedido</label>
          <textarea
            rows={3}
            placeholder="Indícanos cantidades aproximadas o consulta sobre cobertura..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 text-neutral-900 outline-none transition focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/10 resize-none"
          />
        </div>

        <div className="pt-2 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-brand-green px-5 py-3 text-sm font-bold text-white shadow-md shadow-brand-green/20 transition-all hover:brightness-95 hover:shadow-lg active:scale-[0.98]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <svg viewBox="0 0 32 32" className="h-5 w-5 fill-white">
              <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.36.696 4.56 1.89 6.406L4 29l7.79-1.85A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Z" />
            </svg>
            Cotizar por WhatsApp
          </button>
          <button
            type="button"
            onClick={handleEmail}
            className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-xs font-bold text-neutral-700 transition hover:bg-neutral-50 hover:border-neutral-300"
          >
            <svg className="h-4 w-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Por correo
          </button>
        </div>
      </div>
    </form>
  );
}