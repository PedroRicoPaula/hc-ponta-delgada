import React, { useState } from 'react';
import { X, Zap, Trophy, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const playersByPosition = {
  "Guarda-Redes": ["Nuno Teixeira", "Simão Loureiro", "Miguel Santos"],
  "Jogadores": ["Tiago Pimentel", "Mario Jesus", "Tiago Botelho", "Alexandre Resendes", "Vicente", "Alexandre Ornelas", "Miguel Pimentel", "Carlos Guimarães", "Tiago Leite", "Pedro Soares", "Pedro Paula", "Francisco Freitas"]
};

interface TeamState {
  goalkeeper: string;
  players: string[];
}

interface GameResult {
  team1Score: number;
  team2Score: number;
  winner: 'Team 1' | 'Team 2' | 'Draw';
}

interface RollerHockeyGameProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RollerHockeyGame: React.FC<RollerHockeyGameProps> = ({
  isOpen,
  onClose
}) => {
  const [team1, setTeam1] = useState<TeamState>({
    goalkeeper: '',
    players: ['', '', '', '']
  });
  const [team2, setTeam2] = useState<TeamState>({
    goalkeeper: '',
    players: ['', '', '', '']
  });
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const handleReset = () => {
    setTeam1({ goalkeeper: '', players: ['', '', '', ''] });
    setTeam2({ goalkeeper: '', players: ['', '', '', ''] });
    setGameResult(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const updateTeam1Goalkeeper = (goalkeeper: string) => {
    setTeam1(prev => ({ ...prev, goalkeeper }));
  };

  const updateTeam1Player = (index: number, player: string) => {
    setTeam1(prev => ({
      ...prev,
      players: prev.players.map((p, i) => i === index ? player : p)
    }));
  };

  const updateTeam2Goalkeeper = (goalkeeper: string) => {
    setTeam2(prev => ({ ...prev, goalkeeper }));
  };

  const updateTeam2Player = (index: number, player: string) => {
    setTeam2(prev => ({
      ...prev,
      players: prev.players.map((p, i) => i === index ? player : p)
    }));
  };

  const isTeamComplete = (team: TeamState) => {
    return team.goalkeeper && team.players.every(player => player);
  };

  const canPlay = isTeamComplete(team1) && isTeamComplete(team2);

  // UPDATED: playGame now uses random scores
  const playGame = () => {
    const team1Score = Math.floor(Math.random() * 11); // 0-10
    const team2Score = Math.floor(Math.random() * 11);

    let winner: 'Team 1' | 'Team 2' | 'Draw';
    if (team1Score > team2Score) winner = 'Team 1';
    else if (team2Score > team1Score) winner = 'Team 2';
    else winner = 'Draw';

    setGameResult({ team1Score, team2Score, winner });
  };

  const getAvailablePlayers = (currentTeam: 'team1' | 'team2', position: 'goalkeeper' | number) => {
    const otherTeam = currentTeam === 'team1' ? team2 : team1;
    const currentTeamState = currentTeam === 'team1' ? team1 : team2;

    if (position === 'goalkeeper') {
      const usedGoalkeepers = [otherTeam.goalkeeper, currentTeamState.goalkeeper].filter(Boolean);
      return playersByPosition["Guarda-Redes"].filter(gk => !usedGoalkeepers.includes(gk) || gk === currentTeamState.goalkeeper);
    } else {
      const allUsedPlayers = [...otherTeam.players, ...currentTeamState.players.filter((_, i) => i !== position)].filter(Boolean);
      return playersByPosition.Jogadores.filter(player => !allUsedPlayers.includes(player));
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 z-50 bg-background shadow-2xl transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} w-full sm:w-[32rem] lg:w-[40rem] overflow-y-auto`}>
      <div className="relative h-full bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <Button onClick={handleClose} variant="ghost" size="sm" className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background rounded-full p-1.5">
          <X className="h-4 w-4" />
        </Button>

        {/* Header */}
        <div className="p-4 pb-2 sm:p-6 sm:pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Mini Jogo</h2>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">Seleciona os teus "Starting 5" e vê quem ganha!</p>
        </div>

        <div className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-3 sm:space-y-6">
          {/* Mobile Tabs */}
          <div className="block sm:hidden">
            <Tabs defaultValue="team1" className="space-y-3">
              <TabsList className="grid w-full grid-cols-2 h-8">
                <TabsTrigger value="team1" className="text-xs flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Equipa 1
                </TabsTrigger>
                <TabsTrigger value="team2" className="text-xs flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Equipa 2
                </TabsTrigger>
              </TabsList>

              {/* Team 1 */}
              <TabsContent value="team1" className="mt-3">
                <Card className="p-3 space-y-2.5 border-primary/20">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Guarda-Redes</label>
                    <Select value={team1.goalkeeper} onValueChange={updateTeam1Goalkeeper}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Selecionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailablePlayers('team1', 'goalkeeper').map(gk => <SelectItem key={gk} value={gk} className="text-xs">{gk}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Jogadores</label>
                    <div className="grid grid-cols-2 gap-2">
                      {team1.players.map((player, index) => <Select key={index} value={player} onValueChange={value => updateTeam1Player(index, value)}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder={`J${index + 1}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailablePlayers('team1', index).map(p => <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>)}
                        </SelectContent>
                      </Select>)}
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Team 2 */}
              <TabsContent value="team2" className="mt-3">
                <Card className="p-3 space-y-2.5 border-primary/20">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Guarda-Redes</label>
                    <Select value={team2.goalkeeper} onValueChange={updateTeam2Goalkeeper}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Selecionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailablePlayers('team2', 'goalkeeper').map(gk => <SelectItem key={gk} value={gk} className="text-xs">{gk}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Jogadores</label>
                    <div className="grid grid-cols-2 gap-2">
                      {team2.players.map((player, index) => <Select key={index} value={player} onValueChange={value => updateTeam2Player(index, value)}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder={`J${index + 1}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailablePlayers('team2', index).map(p => <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>)}
                        </SelectContent>
                      </Select>)}
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Desktop Side by Side */}
          <div className="hidden sm:grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Team 1 */}
            <Card className="p-4 space-y-3 border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h3 className="font-semibold text-sm">Equipa 1</h3>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Guarda-Redes</label>
                <Select value={team1.goalkeeper} onValueChange={updateTeam1Goalkeeper}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Selecionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailablePlayers('team1', 'goalkeeper').map(gk => <SelectItem key={gk} value={gk} className="text-sm">{gk}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Jogadores</label>
                {team1.players.map((player, index) => <Select key={index} value={player} onValueChange={value => updateTeam1Player(index, value)}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder={`Jogador ${index + 1}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailablePlayers('team1', index).map(p => <SelectItem key={p} value={p} className="text-sm">{p}</SelectItem>)}
                  </SelectContent>
                </Select>)}
              </div>
            </Card>

            {/* Team 2 */}
            <Card className="p-4 space-y-3 border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h3 className="font-semibold text-sm">Equipa 2</h3>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Guarda-Redes</label>
                <Select value={team2.goalkeeper} onValueChange={updateTeam2Goalkeeper}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Selecionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailablePlayers('team2', 'goalkeeper').map(gk => <SelectItem key={gk} value={gk} className="text-sm">{gk}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Jogadores</label>
                {team2.players.map((player, index) => <Select key={index} value={player} onValueChange={value => updateTeam2Player(index, value)}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder={`Jogador ${index + 1}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailablePlayers('team2', index).map(p => <SelectItem key={p} value={p} className="text-sm">{p}</SelectItem>)}
                  </SelectContent>
                </Select>)}
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
          <Card className="p-4 sm:p-6 min-h-[100px] sm:min-h-[120px] bg-gradient-to-br from-muted/30 to-muted/10 border-dashed border-2">
            {gameResult ? (
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                  <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  <h4 className="text-base sm:text-lg font-semibold">Resultado</h4>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className={`p-2.5 sm:p-3 rounded-lg ${gameResult.winner === 'Team 1' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-muted'}`}>
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-xs sm:text-sm">Equipa 1</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-center">{gameResult.team1Score}</div>
                  </div>

                  <div className={`p-2.5 sm:p-3 rounded-lg ${gameResult.winner === 'Team 2' ? 'bg-red-100 border-2 border-red-500' : 'bg-muted'}`}>
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                      <span className="font-medium text-xs sm:text-sm">Equipa 2</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-center">{gameResult.team2Score}</div>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-base sm:text-lg font-semibold text-primary">
                    {gameResult.winner === 'Draw' ? '🤝 Empate!' : `🏆 ${gameResult.winner} Venceu!`}
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

        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 opacity-10">
          <div className="text-4xl sm:text-6xl">🏒</div>
        </div>
      </div>
    </div>
  );
};
