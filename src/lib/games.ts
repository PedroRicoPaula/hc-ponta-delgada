import { useEffect, useState } from 'react';
import { parseGameDateTime, type Game } from '@/data/siteData';

export const GAME_DURATION_MINUTES = 150; // duração média de um jogo de hóquei em patins
export const LIVE_COUNTDOWN_HOURS = 24;

export type GameStatus = 'upcoming' | 'countdown' | 'live' | 'ended';

export function getGameEnd(game: Game): Date {
  return new Date(parseGameDateTime(game).getTime() + GAME_DURATION_MINUTES * 60000);
}

export function getGameStatus(game: Game, now: Date): GameStatus {
  const start = parseGameDateTime(game);
  if (now >= getGameEnd(game)) return 'ended';
  if (now >= start) return 'live';
  if (now.getTime() >= start.getTime() - LIVE_COUNTDOWN_HOURS * 3600000) return 'countdown';
  return 'upcoming';
}

export function getNextGame(games: Game[], now: Date): Game | undefined {
  return [...games]
    .sort((a, b) => parseGameDateTime(a).getTime() - parseGameDateTime(b).getTime())
    .find((g) => getGameStatus(g, now) !== 'ended');
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
