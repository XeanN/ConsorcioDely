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
      <div className="aspect-square w-full bg-neutral-100">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
            Sin foto
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-neutral-400">{categoryName}</p>
        <p className="text-sm font-medium text-neutral-900">{name}</p>
      </div>
    </Link>
  );
}
