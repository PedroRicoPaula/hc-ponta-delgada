import { games, FORMACAO_ESCALOES, getMatchupNames, hasKnownTime, parseGameDateTime, type Game } from '@/data/siteData';
import { formacaoGames, getGameEnd, senioresGames } from '@/lib/games';

/**
 * Calendários para subscrever (iPhone/Mac/Google/Outlook), um por escalão.
 * Escritos em `dist/calendario/<slug>.ics` pelo `scripts/prerender.js` e servidos
 * no `npm run dev` pelo plugin em `vite.config.ts` — mesma função nos dois.
 *
 * O UID de cada evento é o `game.id`: é por ele que o calendário de quem
 * subscreveu actualiza um jogo (hora, pavilhão) em vez de o duplicar. Mudar o
 * `id` de um jogo já publicado cria um evento repetido nesses calendários.
 */

const SITE_URL = 'https://hoqueiclubepdl.com';

const slugify = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, '-');

export const CALENDAR_FEEDS = [
  { slug: 'seniores', label: 'Seniores', games: () => senioresGames(games) },
  ...FORMACAO_ESCALOES.map((e) => ({ slug: slugify(e), label: e, games: () => formacaoGames(games, e) })),
];

export const feedPath = (slug: string) => `/calendario/${slug}.ics`;

const escape = (s: string) => s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

/** 20261024T180000Z */
const utc = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

const encoder = new TextEncoder();

/** RFC 5545: linhas até 75 octetos, continuação começa com espaço. Não parte caracteres UTF-8. */
function fold(line: string): string {
  let out = '';
  let bytes = 0;
  for (const ch of line) {
    const n = encoder.encode(ch).length;
    if (bytes + n > 75) {
      out += '\r\n ';
      bytes = 1;
    }
    out += ch;
    bytes += n;
  }
  return out;
}

function summary(game: Game): string {
  if (game.encontro) return `Mini Hóquei · ${game.encontro}.º Encontro`;
  const { home, away } = getMatchupNames(game);
  return game.escalao ? `${game.escalao} · ${home} vs ${away}` : `${home} vs ${away}`;
}

function vevent(game: Game, stamp: string): string[] {
  // Sem hora marcada: evento de dia inteiro (sem DTEND = dura o dia), em vez de
  // um falso jogo à meia-noite.
  const when = hasKnownTime(game)
    ? [`DTSTART:${utc(parseGameDateTime(game))}`, `DTEND:${utc(getGameEnd(game))}`]
    : [`DTSTART;VALUE=DATE:${game.date.split('/').reverse().join('')}`];
  return [
    'BEGIN:VEVENT',
    `UID:${game.id}@hoqueiclubepdl.com`,
    `DTSTAMP:${stamp}`,
    ...when,
    `SUMMARY:${escape(summary(game))}`,
    `LOCATION:${escape(game.location)}`,
    `DESCRIPTION:${escape(`${game.competition}\n${SITE_URL}/calendario/`)}`,
    `URL:${SITE_URL}/calendario/`,
    'END:VEVENT',
  ];
}

export function renderFeed(slug: string, now = new Date()): string | undefined {
  const feed = CALENDAR_FEEDS.find((f) => f.slug === slug);
  if (!feed) return undefined;
  const stamp = utc(now);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hoquei Clube PDL//Calendario//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escape(`HC PDL · ${feed.label}`)}`,
    // Pedido aos clientes para irem buscar mudanças de hora com frequência.
    // O Apple respeita; o Google Calendar ignora e actualiza quando quer (horas).
    'REFRESH-INTERVAL;VALUE=DURATION:PT1H',
    'X-PUBLISHED-TTL:PT1H',
    ...feed.games().flatMap((g) => vevent(g, stamp)),
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
