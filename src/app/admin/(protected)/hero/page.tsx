import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { HeroSlidesForm } from "@/components/admin/HeroSlidesForm";
import { getHeroSlides } from "@/lib/hero-slides";

export default async function HeroSlidesPage() {
  const slides = await getHeroSlides();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <AdminPageHeader title="Hero (inicio)" />
      <p className="mt-2 text-sm text-neutral-500">
        Imágenes que rotan automáticamente en el banner principal del inicio (cada 2 segundos).
      </p>

      <div className="mt-6">
        <HeroSlidesForm defaultSlides={slides} />
      </div>
    </div>
  );
}
