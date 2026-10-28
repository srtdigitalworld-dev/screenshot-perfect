import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const PHOTO_BUCKET = "invite-photos";

/** Resolve storage paths to viewable URLs (signed for 30 days). */
export function usePhotoUrls(paths: string[]) {
  const key = paths.join("|");
  const [urls, setUrls] = useState<Record<string, string>>({});
  useEffect(() => {
    const missing = paths.filter((p) => p && !urls[p]);
    if (missing.length === 0) return;
    supabase.storage.from(PHOTO_BUCKET).createSignedUrls(missing, 60 * 60 * 24 * 30).then(({ data }) => {
      if (!data) return;
      setUrls((u) => {
        const n = { ...u };
        data.forEach((d) => { if (d.path && d.signedUrl) n[d.path] = d.signedUrl; });
        return n;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return urls;
}

export async function uploadPhoto(userId: string, file: File) {
  if (file.size > 10 * 1024 * 1024) throw new Error("Photo must be under 10MB");
  if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) throw new Error("Use JPG, PNG, WebP or GIF");
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw error;
  return path;
}
