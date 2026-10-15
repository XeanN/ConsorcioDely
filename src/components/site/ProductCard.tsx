import Link from "next/link";
import { isProductOutOfStock } from "@/lib/stock";

export function ProductCard({
  href,
  name,
  categoryName,
  imageUrl,
  secondaryImageUrl,
  isOutOfStock,
}: {
  href: string;
  name: string;
  categoryName: string;
  imageUrl: string | null;
  secondaryImageUrl?: string | null;
  isOutOfStock?: boolean;
}) {
  const outOfStock = isOutOfStock ?? isProductOutOfStock(name);

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-lg border border-neutral-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square w-full bg-neutral-100 overflow-hidden">
        <span className="absolute left-2 top-2 z-10 rounded-full bg-brand-green px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
          PRODUCTO PERUANO
        </span>

        {outOfStock && (
          <span className="absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-md ring-2 ring-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
            Agotado
          </span>
        )}

        {/* Sticker central para producto agotado */}
        {outOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/15 pointer-events-none">
            <div className="transform -rotate-12 rounded-lg bg-red-600/95 px-3 py-1 shadow-xl ring-2 ring-white">
              <span className="text-xs font-black uppercase tracking-widest text-white">
                ¡Agotado!
              </span>
            </div>
          </div>
        )}

        {imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={name}
              loading="lazy"
              className={`h-full w-full object-cover transition-all duration-300 ${
                outOfStock ? "opacity-85 grayscale-[15%]" : ""
              } ${
                secondaryImageUrl ? "group-hover:opacity-0" : "group-hover:scale-105"
              }`}
            />
            {secondaryImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={secondaryImageUrl}
                alt={`${name} — vista alternativa`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
            Sin foto
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-block rounded-full bg-brand-red/10 px-2 py-0.5 text-[11px] font-medium text-brand-red">
            {categoryName}
          </span>
          {outOfStock && (
            <span className="inline-block rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-700">
              Sin stock
            </span>
          )}
        </div>
        <p className="mt-1.5 text-sm font-medium text-neutral-900">{name}</p>
      </div>
    </Link>
  );
}
