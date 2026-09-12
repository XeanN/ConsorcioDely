"use client";

import { useActionState } from "react";

import { updateSocialLinks, type SocialLinksFormState } from "@/lib/actions/site-settings";

const initialState: SocialLinksFormState = {};
const inputClass =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-500";

export function SocialLinksForm({
  defaultValues,
}: {
  defaultValues: {
    facebookUrl: string | null;
    instagramUrl: string | null;
    twitterUrl: string | null;
    tiktokUrl: string | null;
    youtubeUrl: string | null;
  };
}) {
  const [state, formAction, pending] = useActionState(updateSocialLinks, initialState);

  return (
    <form action={formAction} className="max-w-sm space-y-4">
      <div className="space-y-1">
        <label htmlFor="facebookUrl" className="text-sm font-medium text-neutral-700">
          Facebook
        </label>
        <input
          id="facebookUrl"
          name="facebookUrl"
          type="url"
          placeholder="https://facebook.com/consorciodely"
          defaultValue={defaultValues.facebookUrl ?? ""}
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="instagramUrl" className="text-sm font-medium text-neutral-700">
          Instagram
        </label>
        <input
          id="instagramUrl"
          name="instagramUrl"
          type="url"
          placeholder="https://instagram.com/consorciodely"
          defaultValue={defaultValues.instagramUrl ?? ""}
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="twitterUrl" className="text-sm font-medium text-neutral-700">
          X (Twitter)
        </label>
        <input
          id="twitterUrl"
          name="twitterUrl"
          type="url"
          placeholder="https://x.com/consorciodely"
          defaultValue={defaultValues.twitterUrl ?? ""}
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="tiktokUrl" className="text-sm font-medium text-neutral-700">
          TikTok
        </label>
        <input
          id="tiktokUrl"
          name="tiktokUrl"
          type="url"
          placeholder="https://tiktok.com/@consorciodely"
          defaultValue={defaultValues.tiktokUrl ?? ""}
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="youtubeUrl" className="text-sm font-medium text-neutral-700">
          YouTube
        </label>
        <input
          id="youtubeUrl"
          name="youtubeUrl"
          type="url"
          placeholder="https://youtube.com/@consorciodely"
          defaultValue={defaultValues.youtubeUrl ?? ""}
          className={inputClass}
        />
      </div>

      <p className="text-xs text-neutral-400">Deja el campo vacío para ocultar ese ícono en el pie de página.</p>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
