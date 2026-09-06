import React, { useState, useEffect } from 'react';
import { X, Zap, Trophy, Target, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

type Escalao = 'Sub 11' | 'Sub 13' | 'Sub 17';

interface PlayerSelection {
  name: string;
  group: string;
  escalao?: Escalao;
}

interface TeamState {
  goalkeeper: PlayerSelection | null;
  players: (PlayerSelection | null)[];
}

interface GameResult {
  team1Score: number;
  team2Score: number;
  winner: 'Equipa 1' | 'Equipa 2' | 'Empate';
  team1Scorers: string[];
  team2Scorers: string[];
}

interface RollerHockeyGameProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tactic = '2-2' | '1-1-2' | '1-2-1' | '3-1' | '1-3';

const TACTICS: Tactic[] = ['2-2', '1-1-2', '1-2-1', '3-1', '1-3'];

/** Índices 0–3, linhas do ataque (cima) para a defesa. */
const TACTIC_ROWS: Record<Tactic, number[][]> = {
  '2-2': [[2, 3], [0, 1]],
  '1-1-2': [[2, 3], [1], [0]],
  '1-2-1': [[3], [1, 2], [0]],
  '3-1': [[3], [0, 1, 2]],
  '1-3': [[1, 2, 3], [0]],
};

function slotRole(tactic: Tactic, index: number): 'D' | 'M' | 'A' {
  const map: Record<Tactic, ('D' | 'M' | 'A')[]> = {
    '2-2': ['D', 'D', 'A', 'A'],
    '1-1-2': ['D', 'M', 'A', 'A'],
    '1-2-1': ['D', 'M', 'M', 'A'],
    '3-1': ['D', 'D', 'D', 'A'],
    '1-3': ['D', 'A', 'A', 'A'],
  };
  return map[tactic][index];
}

const GOALKEEPERS: PlayerSelection[] = [
  { name: 'Nuno Teixeira', group: 'Seniores' },
  { name: 'Simão Loureiro', group: 'Seniores' },
  { name: 'Jonas Oliveira', group: 'Sub 11', escalao: 'Sub 11' },
  { name: 'José Vieira', group: 'Sub 11', escalao: 'Sub 11' },
  { name: 'Santiago Sousa', group: 'Sub 13', escalao: 'Sub 13' },
  { name: 'Rafael Rocha', group: 'Sub 17', escalao: 'Sub 17' },
  { name: 'João Albuquerque', group: 'Sub 17', escalao: 'Sub 17' },
  { name: 'Ana Benjamim', group: 'Sub 17', escalao: 'Sub 17' },
  { name: 'Gonçalo Mendonça', group: 'Sub 17', escalao: 'Sub 17' },
];

const FIELD_PLAYERS: PlayerSelection[] = [
  { name: 'Tiago Pimentel', group: 'Seniores' },
  { name: 'Marco Resendes', group: 'Seniores' },
  { name: 'David Reis', group: 'Seniores' },
  { name: 'Alexandre Resendes', group: 'Seniores' },
  { name: 'Alexandre Ornelas', group: 'Seniores' },
  { name: 'Pedro Paula', group: 'Seniores' },
  { name: 'Francisco Freitas', group: 'Seniores' },
  { name: 'Tiago Leite', group: 'Seniores' },
  { name: 'Miguel Pimentel', group: 'Seniores' },
  { name: 'Carlos Guimarães', group: 'Seniores' },
  { name: 'Vicente Correia', group: 'Seniores' },
  { name: 'Joana Lourenço', group: 'Sub 11', escalao: 'Sub 11' },
  { name: 'João Barroso', group: 'Sub 11', escalao: 'Sub 11' },
  { name: 'Nuno Massa', group: 'Sub 11', escalao: 'Sub 11' },
  { name: 'Leandro Rodrigues', group: 'Sub 11', escalao: 'Sub 11' },
  { name: 'Rafael Malheiro', group: 'Sub 11', escalao: 'Sub 11' },
  { name: 'Tiago Pereira', group: 'Sub 11', escalao: 'Sub 11' },
  { name: 'Vasco Lourenço', group: 'Sub 11', escalao: 'Sub 11' },
  { name: 'Joaquim Pereira', group: 'Sub 11', escalao: 'Sub 11' },
  { name: 'Santiago Resendes', group: 'Sub 13', escalao: 'Sub 13' },
  { name: 'Salvador Resendes', group: 'Sub 13', escalao: 'Sub 13' },
  { name: 'Guilherme Tavares', group: 'Sub 13', escalao: 'Sub 13' },
  { name: 'Núria Faria', group: 'Sub 13', escalao: 'Sub 13' },
  { name: 'Simão Melo', group: 'Sub 13', escalao: 'Sub 13' },
  { name: 'Lourenço Áspera', group: 'Sub 13', escalao: 'Sub 13' },
  { name: 'Gustavo Cordeiro', group: 'Sub 17', escalao: 'Sub 17' },
  { name: 'Miguel Silva', group: 'Sub 17', escalao: 'Sub 17' },
  { name: 'Pedro Massa', group: 'Sub 17', escalao: 'Sub 17' },
  { name: 'Gonçalo Cordovil', group: 'Sub 17', escalao: 'Sub 17' },
  { name: 'Carolina Benjamim', group: 'Sub 17', escalao: 'Sub 17' },
  { name: 'Kelly Silvestre', group: 'Sub 17', escalao: 'Sub 17' },
  { name: 'David Oliveira', group: 'Sub 17', escalao: 'Sub 17' },
  { name: 'Marco Pacheco', group: 'Sub 17', escalao: 'Sub 17' },
  { name: 'Rodrigo Cachapa', group: 'Sub 17', escalao: 'Sub 17' },
];

const GROUP_ORDER = ['Seniores', 'Sub 11', 'Sub 13', 'Sub 17'];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function aggregateScorers(scorers: string[]): Map<string, number> {
  return scorers.reduce((acc, name) => {
    acc.set(name, (acc.get(name) || 0) + 1);
    return acc;
  }, new Map<string, number>());
}

function groupedPool(pool: PlayerSelection[], taken: Set<string>, keepName?: string) {
  const byGroup = new Map<string, PlayerSelection[]>();
  for (const p of pool) {
    if (taken.has(p.name) && p.name !== keepName) continue;
    const list = byGroup.get(p.group) ?? [];
    list.push(p);
    byGroup.set(p.group, list);
  }
  return GROUP_ORDER.filter((g) => (byGroup.get(g)?.length ?? 0) > 0).map((g) => ({
    group: g,
    players: byGroup.get(g)!,
  }));
}

function emptyTeam(): TeamState {
  return { goalkeeper: null, players: [null, null, null, null] };
}

function SlotPicker({
  current,
  groups,
  emptyLabel,
  compact,
  onPick,
}: {
  current: PlayerSelection | null;
  groups: { group: string; players: PlayerSelection[] }[];
  emptyLabel: string;
  compact: boolean;
  onPick: (p: PlayerSelection) => void;
}) {
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<string | null>(null);
  const players = groups.find((g) => g.group === group)?.players ?? [];

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setGroup(null);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={current ? current.name : emptyLabel}
          className={cn(
            'rounded-full border-2 border-white/70 dark:border-white/20 bg-white/90 dark:bg-gray-900/90 shadow-sm flex items-center justify-center',
            compact ? 'h-11 w-11' : 'h-14 w-14',
          )}
        >
          {current ? (
            <span className={cn('font-heading font-black text-gray-900 dark:text-white leading-none', compact ? 'text-sm' : 'text-base')}>
              {initials(current.name)}
            </span>
          ) : (
            <span className="text-[9px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">{emptyLabel}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="z-[70] w-56 p-2" align="center" side="top">
        {group === null ? (
          <div className="flex flex-col gap-1">
            <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">Escolhe o grupo</p>
            {groups.map((g) => (
              <button
                key={g.group}
                type="button"
                onClick={() => setGroup(g.group)}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {g.group}
                <span className="ml-2 text-xs text-gray-400">({g.players.length})</span>
              </button>
            ))}
            {groups.length === 0 && <p className="px-2 py-2 text-xs text-gray-500">Ninguém disponível</p>}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setGroup(null)}
              className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              {group}
            </button>
            <div className="max-h-48 overflow-y-auto flex flex-col gap-0.5">
              {players.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    onPick(p);
                    setOpen(false);
                    setGroup(null);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-900 dark:text-white hover:bg-primary/20"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export const RollerHockeyGame: React.FC<RollerHockeyGameProps> = ({ isOpen, onClose }) => {
  const [team1, setTeam1] = useState<TeamState>(emptyTeam);
  const [team2, setTeam2] = useState<TeamState>(emptyTeam);
  const [tactic1, setTactic1] = useState<Tactic>('2-2');
  const [tactic2, setTactic2] = useState<Tactic>('2-2');
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const handleReset = () => {
    setTeam1(emptyTeam());
    setTeam2(emptyTeam());
    setGameResult(null);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const takenNames = new Set(
    [team1.goalkeeper?.name, ...team1.players.map((p) => p?.name), team2.goalkeeper?.name, ...team2.players.map((p) => p?.name)].filter(Boolean) as string[],
  );

  const updateTeamPlayer = (team: 'team1' | 'team2', position: 'goalkeeper' | number, playerSelection: PlayerSelection) => {
    const setTeam = team === 'team1' ? setTeam1 : setTeam2;
    setTeam((prev) => {
      if (position === 'goalkeeper') return { ...prev, goalkeeper: playerSelection };
      const newPlayers = [...prev.players];
      newPlayers[position] = playerSelection;
      return { ...prev, players: newPlayers };
    });
  };

  const canPlay = Boolean(team1.goalkeeper && team2.goalkeeper && team1.players.every(Boolean) && team2.players.every(Boolean));

  const playGame = () => {
    const team1Score = Math.floor(Math.random() * 11);
    const team2Score = Math.floor(Math.random() * 11);
    const team1PlayerNames = team1.players.map((p) => p!.name);
    const team2PlayerNames = team2.players.map((p) => p!.name);
    const team1Scorers = Array.from({ length: team1Score }, () => team1PlayerNames[Math.floor(Math.random() * team1PlayerNames.length)]);
    const team2Scorers = Array.from({ length: team2Score }, () => team2PlayerNames[Math.floor(Math.random() * team2PlayerNames.length)]);
    let winner: GameResult['winner'];
    if (team1Score > team2Score) winner = 'Equipa 1';
    else if (team2Score > team1Score) winner = 'Equipa 2';
    else winner = 'Empate';
    setGameResult({ team1Score, team2Score, winner, team1Scorers, team2Scorers });
  };

  const renderSlot = (
    team: 'team1' | 'team2',
    position: 'goalkeeper' | number,
    compact: boolean,
    tactic: Tactic,
  ) => {
    const teamState = team === 'team1' ? team1 : team2;
    const isGk = position === 'goalkeeper';
    const current = isGk ? teamState.goalkeeper : teamState.players[position];
    const groups = groupedPool(isGk ? GOALKEEPERS : FIELD_PLAYERS, takenNames, current?.name);
    const emptyLabel = isGk ? 'GR' : slotRole(tactic, position);

    return (
      <SlotPicker
        current={current}
        groups={groups}
        emptyLabel={emptyLabel}
        compact={compact}
        onPick={(p) => updateTeamPlayer(team, position, p)}
      />
    );
  };

  const TacticBar = ({ value, onChange }: { value: Tactic; onChange: (t: Tactic) => void }) => (
    <div className="flex flex-wrap gap-1 mb-2">
      {TACTICS.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={cn(
            'px-2 py-1 text-[10px] font-heading font-black tracking-wide rounded-md border',
            value === t
              ? 'bg-primary text-gray-950 border-primary'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary',
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );

  const Rink = ({ team, compact, tactic }: { team: 'team1' | 'team2'; compact: boolean; tactic: Tactic }) => (
    <div
      className={cn(
        'relative w-full rounded-2xl border-2 border-primary/40 overflow-visible',
        'bg-gradient-to-b from-sky-100 to-emerald-100 dark:from-sky-950/50 dark:to-emerald-950/40',
        compact ? 'aspect-[4/5] max-h-72' : 'aspect-[3/4] max-h-80',
      )}
    >
      <div className="absolute left-1/2 top-1/2 h-px w-3/4 -translate-x-1/2 -translate-y-1/2 bg-white/60 dark:bg-white/20 pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50 dark:border-white/20 pointer-events-none" />
      <div className="absolute inset-0 flex flex-col items-center justify-between py-[8%] px-[8%]">
        {TACTIC_ROWS[tactic].map((row, ri) => (
          <div key={ri} className="flex w-full justify-around">
            {row.map((slot) => (
              <div key={slot}>{renderSlot(team, slot, compact, tactic)}</div>
            ))}
          </div>
        ))}
        <div className="flex justify-center">{renderSlot(team, 'goalkeeper', compact, tactic)}</div>
      </div>
    </div>
  );

  const resultBlock = (side: 'Equipa 1' | 'Equipa 2', score: number, scorers: string[], win: boolean, color: string) => (
    <div className={`p-2.5 sm:p-3 rounded-lg text-left ${win ? `${color} border-2` : 'bg-muted dark:bg-gray-800'}`}>
      <span className="font-medium text-xs sm:text-sm">{side}</span>
      <div className="mt-1 flex justify-between items-start gap-x-3">
        <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{score}</div>
        {scorers.length > 0 && (
          <div className="min-w-0 text-right text-xs sm:text-sm text-muted-foreground space-y-0.5">
            {Array.from(aggregateScorers(scorers).entries())
              .sort(([, a], [, b]) => b - a)
              .map(([name, count]) => (
                <div key={name} className="flex justify-end items-baseline gap-x-1.5">
                  <span className="truncate" title={name}>{name}</span>
                  {count > 1 && <strong className="font-semibold text-foreground flex-shrink-0">{count}x</strong>}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 bg-background shadow-2xl transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} w-full sm:w-[32rem] lg:w-[42rem] overflow-y-auto`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label="Mini Jogo"
    >
      <div className="relative h-full bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <Button onClick={handleClose} variant="ghost" size="sm" className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background rounded-full p-1.5">
          <X className="h-4 w-4" />
        </Button>

        <div className="p-4 pb-2 sm:p-6 sm:pb-4 pr-12">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">Mini Jogo</h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Faz a tua equipa e a adversária, preenchendo todas posições, define a tática e vamos ver quem ganha!
          </p>
        </div>

        <div className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-4">
          <div className="block sm:hidden">
            <Tabs defaultValue="team1">
              <TabsList className="grid w-full grid-cols-2 h-8">
                <TabsTrigger value="team1" className="text-xs">Equipa 1</TabsTrigger>
                <TabsTrigger value="team2" className="text-xs">Equipa 2</TabsTrigger>
              </TabsList>
              <TabsContent value="team1" className="mt-3">
                <TacticBar value={tactic1} onChange={setTactic1} />
                <Rink team="team1" compact tactic={tactic1} />
              </TabsContent>
              <TabsContent value="team2" className="mt-3">
                <TacticBar value={tactic2} onChange={setTactic2} />
                <Rink team="team2" compact tactic={tactic2} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="hidden sm:grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold mb-2 text-blue-600 dark:text-blue-400">Equipa 1</p>
              <TacticBar value={tactic1} onChange={setTactic1} />
              <Rink team="team1" compact={false} tactic={tactic1} />
            </div>
            <div>
              <p className="text-xs font-semibold mb-2 text-red-600 dark:text-red-400">Equipa 2</p>
              <TacticBar value={tactic2} onChange={setTactic2} />
              <Rink team="team2" compact={false} tactic={tactic2} />
            </div>
          </div>

          <div className="text-center">
            <Button onClick={playGame} disabled={!canPlay} size="lg" className="bg-primary text-gray-950 hover:bg-primary/90 font-heading font-black uppercase tracking-wider px-6">
              <Zap className="h-4 w-4 mr-2" />
              Jogar
            </Button>
          </div>

          <Card className="p-4 sm:p-6 min-h-[120px] bg-gradient-to-br from-muted/30 to-muted/10 border-dashed border-2">
            {gameResult ? (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <h4 className="text-base sm:text-lg font-semibold">Resultado</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {resultBlock('Equipa 1', gameResult.team1Score, gameResult.team1Scorers, gameResult.winner === 'Equipa 1', 'bg-blue-100 dark:bg-blue-950/40 border-blue-500')}
                  {resultBlock('Equipa 2', gameResult.team2Score, gameResult.team2Scorers, gameResult.winner === 'Equipa 2', 'bg-red-100 dark:bg-red-950/40 border-red-500')}
                </div>
                <span className="text-base sm:text-lg font-semibold text-primary">
                  {gameResult.winner === 'Empate' ? 'Empate' : `${gameResult.winner} venceu`}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground py-6">
                <Target className="h-10 w-10 mb-2 opacity-50" />
                <p className="text-sm">O resultado aparece aqui</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
