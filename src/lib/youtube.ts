/** Canal @HoqueiClubePDL — necessário para o embed `live_stream`. */
export const HC_PDL_YOUTUBE_CHANNEL_ID = 'UCAPsz3zuAv8JtBh0CoAabLQ';

/**
 * Converte um URL YouTube (watch, youtu.be, /live, /channel/UC…/live, @HoqueiClubePDL/live)
 * num src de iframe com autoplay. Depois de um clique, o browser deixa áudio.
 *
 * Outro clube: `watch?v=` ou `https://www.youtube.com/channel/UC…/live`.
 * Só `@handle/live` de outro canal não chega — falta o ID UC.
 */
export function youtubeEmbedSrc(url: string): string | null {
  let u: URL;
  try {
    u = new URL(url.trim());
  } catch {
    return null;
  }

  const host = u.hostname.replace(/^www\./, '');
  const autoplay = 'autoplay=1';

  if (host === 'youtu.be') {
    const id = u.pathname.split('/').filter(Boolean)[0];
    return id ? `https://www.youtube.com/embed/${id}?${autoplay}` : null;
  }

  if (!host.includes('youtube.com') && !host.includes('youtube-nocookie.com')) return null;

  const v = u.searchParams.get('v');
  if (v) return `https://www.youtube.com/embed/${v}?${autoplay}`;

  const embed = u.pathname.match(/\/embed\/([^/]+)/);
  if (embed?.[1] && embed[1] !== 'live_stream') {
    return `https://www.youtube.com/embed/${embed[1]}?${autoplay}`;
  }

  const liveId = u.pathname.match(/\/live\/([^/]+)/);
  if (liveId?.[1]) return `https://www.youtube.com/embed/${liveId[1]}?${autoplay}`;

  const channelLive = u.pathname.match(/\/channel\/(UC[\w-]+)\/live\/?$/);
  if (channelLive?.[1]) {
    return `https://www.youtube.com/embed/live_stream?channel=${channelLive[1]}&${autoplay}`;
  }

  const handle = u.pathname.match(/^\/@([^/]+)\/live\/?$/);
  if (handle?.[1]?.toLowerCase() === 'hoqueiclubepdl') {
    return `https://www.youtube.com/embed/live_stream?channel=${HC_PDL_YOUTUBE_CHANNEL_ID}&${autoplay}`;
  }

  return null;
}
