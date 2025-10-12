import React, { useState, useEffect, forwardRef } from 'react';
import { X, Zap, Trophy, Target, Users, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils'; // Assumindo que tem um ficheiro de utilitários como no shadcn/ui

// --- ESTRUTURA DE DADOS MELHORADA ---
type Escalao = 'Sub 11' | 'Sub 13' | 'Sub 17';

const escalaoConfig: Record<Escalao, { color: string }> = {
  'Sub 11': { color: '#facc15' }, // yellow-400
  'Sub 13': { color: '#4ade80' }, // green-400
  'Sub 17': { color: '#a78bfa' }, // violet-400
};

const allPlayersData = {
  "Seniores": {
    "Guarda-Redes": ["Nuno Teixeira", "Simão Loureiro", "Miguel Santos"],
    "Jogadores": ["Tiago Pimentel", "Mario Jesus", "Alexandre Resendes", "Vicente Correia", "Alexandre Ornelas", "Miguel Pimentel", "Carlos Guimarães", "Tiago Leite", "Pedro Paula", "Francisco Freitas", "Pedro Soares"]
  },
  "Formação": {
    "Guarda-Redes": {
      'Sub 11': ["Jonas Oliveira"],
      'Sub 13': ["Santiago Sousa", "Pedro Pacheco"],
      'Sub 17': ["Rafael Rocha", "João Albuquerque", "Gil Ribeiro", "Gonçalo Mendonça"],
    },
    "Jogadores": {
      'Sub 11': ["Joana Lourenço", "João Barroso", "Nuno Massa", "Leandro Rodrigues", "Rafael Malheiro", "Tiago Pereira"],
      'Sub 13': ["Santiago Resendes", "Salvador Resendes", "João Dias", "Guilherme Tavares", "Núria Faria", "Simão Melo"],
      'Sub 17': ["Gustavo Cordeiro", "Benjamim Castanheira", "Martim Farias", "Miguel Silva", "Pedro Massa", "Gonçalo Cordovil", "Carolina Benjamim", "Kelly Silvestre", "David Oliveira", "Ana Benjamim", "Bernardo Medeiros", "Francisco Feijó", "Marco Pacheco", "Rodrigo Cachapa", "Simão Paupério"],
    }
  }
};

// --- TIPOS ATUALIZADOS ---
interface PlayerSelection {
  name: string;
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

// Funções Helper (mantidas como estavam)
const formatScorerName = (name: string): string => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length > 1) {
    return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
  }
  return name;
};

const aggregateScorers = (scorers: string[]): Map<string, number> => {
  return scorers.reduce((acc, name) => {
    acc.set(name, (acc.get(name) || 0) + 1);
    return acc;
  }, new Map<string, number>());
};

// Componente para mostrar o jogador selecionado com a cor
const PlayerDisplay = forwardRef<HTMLDivElement, { player: PlayerSelection | null, placeholder: string }>(
  ({ player, placeholder }, ref) => {
    if (!player?.name) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }
    return (
      <div className="flex items-center gap-2">
      {player.escalao && (
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: escalaoConfig[player.escalao].color }}
        />
      )}
      <span>{player.name}</span>
    </div>
  );
}
);


export const RollerHockeyGame: React.FC<RollerHockeyGameProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<'Seniores' | 'Formação'>('Seniores');
  const [team1, setTeam1] = useState<TeamState>({ goalkeeper: null, players: [null, null, null, null] });
  const [team2, setTeam2] = useState<TeamState>({ goalkeeper: null, players: [null, null, null, null] });
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const handleReset = () => {
    setTeam1({ goalkeeper: null, players: [null, null, null, null] });
    setTeam2({ goalkeeper: null, players: [null, null, null, null] });
    setGameResult(null);
  };

  useEffect(() => {
    handleReset();
  }, [selectedCategory]);

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const updateTeamPlayer = (team: 'team1' | 'team2', position: 'goalkeeper' | number, value: string) => {
    const playerSelection: PlayerSelection = JSON.parse(value);
    const setTeam = team === 'team1' ? setTeam1 : setTeam2;

    setTeam(prev => {
      if (position === 'goalkeeper') {
        return { ...prev, goalkeeper: playerSelection };
      }
      const newPlayers = [...prev.players];
      newPlayers[position] = playerSelection;
      return { ...prev, players: newPlayers };
    });
  };

  const isTeamComplete = (team: TeamState) => {
    return team.goalkeeper && team.players.every(player => player);
  };

  const canPlay = isTeamComplete(team1) && isTeamComplete(team2);

  const playGame = () => {
    const team1Score = Math.floor(Math.random() * 11);
    const team2Score = Math.floor(Math.random() * 11);

    const team1PlayerNames = team1.players.map(p => p!.name);
    const team2PlayerNames = team2.players.map(p => p!.name);

    const team1Scorers = Array.from({ length: team1Score }, () => team1PlayerNames[Math.floor(Math.random() * team1PlayerNames.length)]);
    const team2Scorers = Array.from({ length: team2Score }, () => team2PlayerNames[Math.floor(Math.random() * team2PlayerNames.length)]);
    
    let winner: 'Equipa 1' | 'Equipa 2' | 'Empate';
    if (team1Score > team2Score) winner = 'Equipa 1';
    else if (team2Score > team1Score) winner = 'Equipa 2';
    else winner = 'Empate';

    setGameResult({ team1Score, team2Score, winner, team1Scorers, team2Scorers });
  };
  
  const getAvailablePlayers = (position: 'Guarda-Redes' | 'Jogadores') => {
      const allSelectedPlayerNames = [
          team1.goalkeeper?.name,
          ...team1.players.map(p => p?.name),
          team2.goalkeeper?.name,
          ...team2.players.map(p => p?.name)
      ].filter(Boolean);

      if (selectedCategory === 'Seniores') {
          const players = allPlayersData.Seniores[position];
          return players.filter(p => !allSelectedPlayerNames.includes(p));
      } else { // Formação
          const escaloes = allPlayersData.Formação[position];
          return Object.entries(escaloes).map(([escalao, players]) => ({
              escalao,
              players: (players as string[]).filter(p => !allSelectedPlayerNames.includes(p))
          })).filter(group => group.players.length > 0);
      }
  };


  const renderPlayerSelect = (
    team: 'team1' | 'team2',
    position: 'goalkeeper' | number,
    isMobile: boolean = false
  ) => {
    const teamState = team === 'team1' ? team1 : team2;
    const isGoalkeeper = position === 'goalkeeper';
    const currentPlayer = isGoalkeeper ? teamState.goalkeeper : teamState.players[position];
    const availablePlayers = getAvailablePlayers(isGoalkeeper ? 'Guarda-Redes' : 'Jogadores');

    const placeholderText = isGoalkeeper
        ? "Selecionar..."
        : isMobile ? `J${position + 1}` : `Jogador ${position + 1}`;
    
    const triggerClass = isMobile ? "h-8 w-full text-xs text-left" : "h-9 w-full text-sm text-left";
    const itemClass = isMobile ? "text-xs" : "text-sm";

    return (
      <Select
        value={currentPlayer ? JSON.stringify(currentPlayer) : ""}
        onValueChange={value => updateTeamPlayer(team, position, value)}
      >
        <SelectTrigger className={triggerClass}>
          <SelectValue asChild>
             <PlayerDisplay player={currentPlayer} placeholder={placeholderText} />
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
            <ScrollArea className="h-40">
                {selectedCategory === 'Seniores' ? (
                    (availablePlayers as string[]).map(p => (
                        <SelectItem key={p} value={JSON.stringify({ name: p })} className={itemClass}>{p}</SelectItem>
                    ))
                ) : (
                    (availablePlayers as { escalao: string; players: string[] }[]).map(group => (
                        <SelectGroup key={group.escalao}>
                            <SelectLabel className={cn(itemClass, "font-semibold")}>{group.escalao}</SelectLabel>
                            {group.players.map(p => (
                                <SelectItem key={p} value={JSON.stringify({ name: p, escalao: group.escalao })} className={itemClass}>
                                    {p}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    ))
                )}
            </ScrollArea>
        </SelectContent>
      </Select>
    );
  };
  

  return (
    <div className={`fixed inset-y-0 right-0 z-50 bg-background shadow-2xl transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} w-full sm:w-[32rem] lg:w-[40rem] overflow-y-auto`}>
      <div className="relative h-full bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <Button onClick={handleClose} variant="ghost" size="sm" className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background rounded-full p-1.5">
          <X className="h-4 w-4" />
        </Button>
        
        <div className="p-4 pb-2 sm:p-6 sm:pb-4">
          <div className="flex items-center justify-between gap-4 mb-1">
             <div className="flex items-center gap-2">
                <Target className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Mini Jogo</h2>
             </div>
             <Select value={selectedCategory} onValueChange={(value: 'Seniores' | 'Formação') => setSelectedCategory(value)}>
                <SelectTrigger className="w-[140px] h-9 text-xs sm:text-sm">
                    <SelectValue placeholder="Selecionar categoria..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Seniores"><div className="flex items-center gap-2"><Users className="h-4 w-4" />Seniores</div></SelectItem>
                    <SelectItem value="Formação"><div className="flex items-center gap-2"><Shirt className="h-4 w-4" />Formação</div></SelectItem>
                </SelectContent>
            </Select>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">Seleciona os "5 Iniciais" de cada equipa e vê quem ganha!</p>
        </div>

        <div className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-3 sm:space-y-6">
          {/* Mobile Tabs */}
          <div className="block sm:hidden">
            <Tabs defaultValue="team1" className="space-y-3">
              <TabsList className="grid w-full grid-cols-2 h-8">
                <TabsTrigger value="team1" className="text-xs flex items-center gap-1.5"><div className="w-2 h-2 bg-blue-500 rounded-full"></div>Equipa 1</TabsTrigger>
                <TabsTrigger value="team2" className="text-xs flex items-center gap-1.5"><div className="w-2 h-2 bg-red-500 rounded-full"></div>Equipa 2</TabsTrigger>
              </TabsList>

              {/* Team 1 Mobile */}
              <TabsContent value="team1" className="mt-3">
                <Card className="p-3 space-y-2.5 border-primary/20">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Guarda-Redes</label>
                    {renderPlayerSelect('team1', 'goalkeeper', true)}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Jogadores</label>
                    <div className="grid grid-cols-2 gap-2">
                        {team1.players.map((_, index) => <div key={index}>{renderPlayerSelect('team1', index, true)}</div>)}
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Team 2 Mobile */}
              <TabsContent value="team2" className="mt-3">
                <Card className="p-3 space-y-2.5 border-primary/20">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Guarda-Redes</label>
                    {renderPlayerSelect('team2', 'goalkeeper', true)}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Jogadores</label>
                    <div className="grid grid-cols-2 gap-2">
                        {team2.players.map((_, index) => <div key={index}>{renderPlayerSelect('team2', index, true)}</div>)}
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Desktop Side by Side */}
          <div className="hidden sm:grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Team 1 Desktop */}
            <Card className="p-4 space-y-3 border-primary/20">
              <div className="flex items-center gap-2 mb-3"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><h3 className="font-semibold text-sm">Equipa 1</h3></div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Guarda-Redes</label>
                {renderPlayerSelect('team1', 'goalkeeper')}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Jogadores</label>
                {team1.players.map((_, index) => <div key={index} className="pt-1">{renderPlayerSelect('team1', index)}</div>)}
              </div>
            </Card>

            {/* Team 2 Desktop */}
            <Card className="p-4 space-y-3 border-primary/20">
              <div className="flex items-center gap-2 mb-3"><div className="w-3 h-3 bg-red-500 rounded-full"></div><h3 className="font-semibold text-sm">Equipa 2</h3></div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Guarda-Redes</label>
                {renderPlayerSelect('team2', 'goalkeeper')}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Jogadores</label>
                {team2.players.map((_, index) => <div key={index} className="pt-1">{renderPlayerSelect('team2', index)}</div>)}
              </div>
            </Card>
          </div>
          
           {/* Play Button */}
          <div className="text-center">
            <Button onClick={playGame} disabled={!canPlay} size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold px-6 py-2.5 sm:px-8 sm:py-3 transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-50">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Jogar!
            </Button>
            {!canPlay && <p className="text-xs text-muted-foreground mt-1.5 sm:mt-2">Seleciona todos os jogadores para começar</p>}
          </div>

          {/* Results Display */}
          <Card className="p-4 sm:p-6 min-h-[120px] bg-gradient-to-br from-muted/30 to-muted/10 border-dashed border-2">
            {gameResult ? (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  <h4 className="text-base sm:text-lg font-semibold">Resultado</h4>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                  {/* Team 1 Result Card */}
                  <div className={`p-2.5 sm:p-3 rounded-lg text-left ${gameResult.winner === 'Equipa 1' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-muted'}`}>
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-xs sm:text-sm">Equipa 1</span>
                    </div>
                    <div className="mt-1 flex justify-between items-start gap-x-3 sm:gap-x-4">
                        <div className="text-3xl sm:text-4xl font-bold">{gameResult.team1Score}</div>
                        {gameResult.team1Scorers.length > 0 && (
                            <div className="min-w-0 text-right text-xs sm:text-sm text-muted-foreground space-y-0.5">
                            {Array.from(aggregateScorers(gameResult.team1Scorers).entries())
                                .sort(([, a], [, b]) => b - a)
                                .map(([name, count]) => (
                                <div key={name} className="flex justify-end items-baseline gap-x-1.5">
                                    <span className="truncate" title={name}>{formatScorerName(name)}</span>
                                    {count > 1 && <strong className="font-semibold text-foreground flex-shrink-0">{count}x</strong>}
                                </div>
                                ))}
                            </div>
                        )}
                    </div>
                  </div>

                  {/* Team 2 Result Card */}
                  <div className={`p-2.5 sm:p-3 rounded-lg text-left ${gameResult.winner === 'Equipa 2' ? 'bg-red-100 border-2 border-red-500' : 'bg-muted'}`}>
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                      <span className="font-medium text-xs sm:text-sm">Equipa 2</span>
                    </div>
                     <div className="mt-1 flex justify-between items-start gap-x-3 sm:gap-x-4">
                        <div className="text-3xl sm:text-4xl font-bold">{gameResult.team2Score}</div>
                        {gameResult.team2Scorers.length > 0 && (
                            <div className="min-w-0 text-right text-xs sm:text-sm text-muted-foreground space-y-0.5">
                            {Array.from(aggregateScorers(gameResult.team2Scorers).entries())
                                .sort(([, a], [, b]) => b - a)
                                .map(([name, count]) => (
                                <div key={name} className="flex justify-end items-baseline gap-x-1.5">
                                    <span className="truncate" title={name}>{formatScorerName(name)}</span>
                                    {count > 1 && <strong className="font-semibold text-foreground flex-shrink-0">{count}x</strong>}
                                </div>
                                ))}
                            </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-base sm:text-lg font-semibold text-primary">
                    {gameResult.winner === 'Empate' ? '🤝 Empate!' : `🏆 ${gameResult.winner} Venceu!`}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Target className="h-10 w-10 sm:h-12 sm:w-12 mb-2 sm:mb-3 opacity-50" />
                <p className="text-center font-medium text-sm sm:text-base">Área de Resultados</p>
                <p className="text-xs sm:text-sm text-center">Os resultados aparecerão aqui após o jogo</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};