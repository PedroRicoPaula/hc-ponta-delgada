import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { youtubeEmbedSrc } from '@/lib/youtube';

export function LiveBroadcast({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const src = youtubeEmbedSrc(url);

  if (playing && src) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
        <iframe
          src={src}
          title={title}
          className="h-full w-full"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  if (playing && !src) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-sm font-heading font-black uppercase tracking-wider text-white hover:bg-red-500"
      >
        Abrir no YouTube
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-sm font-heading font-black uppercase tracking-wider text-white transition-colors hover:bg-red-500"
    >
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
      <Volume2 className="h-4 w-4" aria-hidden />
      Ver com som
    </button>
  );
}
