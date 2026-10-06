import { getMatchupNames, hasKnownTime, parseGameDateTime, type Game } from '@/data/siteData';

const toIsoDate = (date: string) => date.split('/').reverse().join('-');

// Type definitions for your data for better code safety
interface Comunicado {
  id: number;
  slug: string;
  titulo: string;
  data: string;
  conteudo: string;
}

// Helper function to convert date strings to ISO format with error handling
const toISOString = (dateStr: string, timeStr: string = '00:00'): string => {
  try {
    const [day, month, year] = dateStr.split('/');
    
    // Validate date parts exist
    if (!day || !month || !year) {
      console.warn(`Invalid date format: ${dateStr}`);
      return new Date().toISOString(); // Fallback to current date
    }
    
    // Create date object
    const date = new Date(`${year}-${month}-${day}T${timeStr}`);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date created from: ${dateStr} ${timeStr}`);
      return new Date().toISOString(); // Fallback to current date
    }
    
    return date.toISOString();
  } catch (error) {
    console.error(`Error parsing date: ${dateStr} ${timeStr}`, error);
    return new Date().toISOString(); // Fallback to current date
  }
};

/**
 * SportsEvent de um jogo do `games[]` — a mesma fonte do /calendario, por isso
 * a homepage e o calendário nunca podem divergir. Antes disto a homepage tinha
 * arrays próprios (`senioresEvents`/`formacaoEvents`) que ficaram na época
 * 2025/26 e publicavam jogos já realizados (ver docs/ISSUES-BACKLOG.md).
 */
export const gameEventSchema = (game: Game) => ({
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": game.encontro
    ? `${game.encontro}.º Encontro de Mini Hóquei`
    : `${getMatchupNames(game).home} vs ${getMatchupNames(game).away}`,
  "startDate": hasKnownTime(game) ? `${toIsoDate(game.date)}T${game.time}` : toIsoDate(game.date),
  "eventStatus": "https://schema.org/EventScheduled",
  "location": {
    "@type": "Place",
    "name": game.location,
    "address": game.location === 'Pavilhão Sidónio Serpa'
      ? { "@type": "PostalAddress", "streetAddress": "Rua do Mercado, 31", "addressLocality": "Ponta Delgada", "postalCode": "9500-326", "addressRegion": "Açores", "addressCountry": "PT" }
      : game.location === 'Pavilhão Municipal Carlos Silveira'
      ? { "@type": "PostalAddress", "addressLocality": "Ponta Delgada", "addressRegion": "Açores", "addressCountry": "PT" }
      : { "@type": "PostalAddress", "addressCountry": "PT" }
  },
  // Encontros de Mini Hóquei não têm adversário único: só se declara o PDL como participante.
  ...(game.encontro ? {
    "competitor": { "@type": "SportsTeam", "name": "Hóquei Clube PDL", "url": "https://hoqueiclubepdl.com/" }
  } : {
    "homeTeam": {
      "@type": "SportsTeam",
      "name": game.isHome ? "Hóquei Clube PDL" : game.opponent,
      ...(game.isHome ? { "url": "https://hoqueiclubepdl.com/" } : {})
    },
    "awayTeam": {
      "@type": "SportsTeam",
      "name": game.isHome ? game.opponent : "Hóquei Clube PDL",
      ...(!game.isHome ? { "url": "https://hoqueiclubepdl.com/" } : {})
    },
  }),
  "sport": "Hóquei em Patins",
  "description": `${game.competition}. Jogo em ${game.location}.`,
  "organizer": { "@type": "Organization", "name": game.competition.includes('Campeonato Nacional') ? "Federação de Patinagem de Portugal" : "Hóquei Clube PDL" },
  ...(game.result ? { "result": `${getMatchupNames(game).home} ${game.result.home} - ${game.result.away} ${getMatchupNames(game).away}` } : {}),
  ...(game.youtubeUrl ? { "recordedIn": { "@type": "VideoObject", "name": `${getMatchupNames(game).home} vs ${getMatchupNames(game).away} — Ao Vivo`, "url": game.youtubeUrl } } : {})
});

/** Próximos jogos (todos os escalões) para o JSON-LD da homepage. */
export const upcomingEventsSchema = (all: Game[], now = new Date(), limit = 12) =>
  all
    .filter((game) => parseGameDateTime(game).getTime() >= now.getTime())
    .sort((a, b) => parseGameDateTime(a).getTime() - parseGameDateTime(b).getTime())
    .slice(0, limit)
    .map(gameEventSchema);

// Function to generate the schema for news articles
export const generateNewsSchema = (comunicados: Comunicado[]) => {
  return comunicados.map(comunicado => ({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": comunicado.titulo,
    "datePublished": toISOString(comunicado.data),
    "dateModified": toISOString(comunicado.data),
    "articleBody": comunicado.conteudo,
    "inLanguage": "pt-PT",
    "url": `https://hoqueiclubepdl.com/comunicados/${comunicado.slug}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://hoqueiclubepdl.com/comunicados/${comunicado.slug}`
    },
    "author": {
      "@type": "Organization",
      "name": "Hóquei Clube PDL",
      "url": "https://hoqueiclubepdl.com/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hóquei Clube PDL",
      "url": "https://hoqueiclubepdl.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hoqueiclubepdl.com/uploads/pdlLogo.png",
        "width": 512,
        "height": 512
      }
    }
  }));
};