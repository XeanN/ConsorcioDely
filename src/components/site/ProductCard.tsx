import Link from "next/link";

export function ProductCard({
  href,
  name,
  categoryName,
  imageUrl,
}: {
  href: string;
  name: string;
  categoryName: string;
  imageUrl: string | null;
}) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-lg border border-neutral-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square w-full bg-neutral-100">
        <span className="absolute left-2 top-2 z-10 rounded-full bg-brand-green px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
          PRODUCTO PERUANO
        </span>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
            Sin foto
          </div>
        )}
      </div>
      <div className="p-3">
        <span className="inline-block rounded-full bg-brand-red/10 px-2 py-0.5 text-[11px] font-medium text-brand-red">
          {categoryName}
        </span>
        <p className="mt-1.5 text-sm font-medium text-neutral-900">{name}</p>
      </div>
    </Link>
  );
}
