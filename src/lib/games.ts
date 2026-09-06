import { useEffect, useState } from 'react';
import { parseGameDateTime, hasKnownTime, gameCategory, type Game, type FormacaoEscalao } from '@/data/siteData';

export const GAME_DURATION_MINUTES = 150; // duração média de um jogo de hóquei em patins
export const LIVE_COUNTDOWN_HOURS = 24;
/** Player YouTube no site: 1 min antes do início (a live no canal costuma abrir ~5 min antes). */
export const BROADCAST_LEAD_MINUTES = 1;

export type GameStatus = 'upcoming' | 'countdown' | 'live' | 'ended';

export function getGameEnd(game: Game): Date {
  return new Date(parseGameDateTime(game).getTime() + GAME_DURATION_MINUTES * 60000);
}

export function getGameStatus(game: Game, now: Date): GameStatus {
  const start = parseGameDateTime(game);

  // Sem hora marcada, parseGameDateTime devolve meia-noite desse dia. Tratar
  // isso como hora real poria o jogo "em direto" a partir das 00:00 e a fazer
  // contagem decrescente no dia anterior. Enquanto a FPP não marcar a hora, o
  // jogo fica 'upcoming' até ao fim do próprio dia e só depois 'ended'.
  if (!hasKnownTime(game)) {
    const endOfDay = new Date(start);
    endOfDay.setHours(23, 59, 59, 999);
    return now > endOfDay ? 'ended' : 'upcoming';
  }

  if (now >= getGameEnd(game)) return 'ended';
  if (now >= start) return 'live';
  if (now.getTime() >= start.getTime() - LIVE_COUNTDOWN_HOURS * 3600000) return 'countdown';
  return 'upcoming';
}

/** Tem URL de transmissão e está na janela do player (1 min antes → fim estimado). Casa ou fora. */
export function isBroadcastWindow(game: Game, now: Date): boolean {
  if (!game.youtubeUrl || !hasKnownTime(game)) return false;
  const start = parseGameDateTime(game).getTime();
  const open = start - BROADCAST_LEAD_MINUTES * 60_000;
  const t = now.getTime();
  return t >= open && t < getGameEnd(game).getTime();
}

/** Badge “ao vivo”: janela de transmissão, ou relógio do jogo se não houver YouTube. */
export function isMatchLive(game: Game, now: Date): boolean {
  return isBroadcastWindow(game, now) || getGameStatus(game, now) === 'live';
}

export function getNextGame(list: Game[], now: Date): Game | undefined {
  return [...list]
    .sort((a, b) => parseGameDateTime(a).getTime() - parseGameDateTime(b).getTime())
    .find((g) => getGameStatus(g, now) !== 'ended');
}

export function senioresGames(list: Game[]): Game[] {
  return list.filter((g) => gameCategory(g) === 'seniores');
}

export function formacaoGames(list: Game[], escalao: FormacaoEscalao): Game[] {
  return list.filter((g) => gameCategory(g) === 'formacao' && g.escalao === escalao);
}

export function formatCountdown(target: Date, now: Date): string {
  const totalSeconds = Math.floor(Math.max(0, target.getTime() - now.getTime()) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
