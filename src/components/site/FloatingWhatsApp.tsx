import { getRandomQuoteLink } from "@/lib/whatsapp";

export async function FloatingWhatsApp() {
  const link = await getRandomQuoteLink("Hola, quisiera más información sobre sus productos");
  if (!link) return null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="Cotizar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-white shadow-lg transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 32 32" className="h-8 w-8 fill-white">
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.36.696 4.56 1.89 6.406L4 29l7.79-1.85A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.75a9.7 9.7 0 0 1-4.94-1.35l-.354-.21-4.62 1.098 1.11-4.5-.232-.368A9.66 9.66 0 0 1 5.25 15c0-5.93 4.823-10.75 10.754-10.75S26.75 9.07 26.75 15 21.936 24.75 16.004 24.75Zm5.62-7.61c-.307-.154-1.816-.897-2.098-1-.28-.103-.485-.154-.69.154-.204.307-.79 1-.97 1.205-.178.205-.357.23-.664.077-.307-.154-1.296-.478-2.47-1.523-.913-.814-1.53-1.82-1.708-2.128-.178-.307-.02-.473.134-.626.137-.137.307-.358.46-.537.154-.18.205-.307.307-.512.103-.205.052-.384-.026-.538-.077-.154-.69-1.665-.946-2.28-.25-.598-.503-.517-.69-.527-.178-.008-.383-.01-.588-.01-.205 0-.538.077-.82.384-.28.307-1.075 1.05-1.075 2.562s1.1 2.972 1.253 3.177c.154.205 2.166 3.31 5.248 4.64.733.316 1.305.505 1.75.646.735.234 1.404.201 1.933.122.59-.088 1.816-.742 2.072-1.46.256-.717.256-1.332.18-1.46-.077-.128-.282-.205-.59-.359Z" />
      </svg>
    </a>
  );
}
