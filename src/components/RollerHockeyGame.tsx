import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { X, Play, Gamepad2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const playersByPosition = {
  "Guarda-Redes": ["Nuno Teixeira", "Simão Loureiro", "Miguel Santos"],
  "Defesa": ["Tiago Pimentel", "Mario Jesus", "Tiago Botelho"],
  "Médio": ["Alexandre Resendes", "Vicente"],
  "Avançado": ["Miguel Pimentel", "Carlos Guimarães", "Tiago Leite", "Alexandre Ornelas"],
  "Universal": ["Pedro Paula", "Francisco Freitas"]
};

interface TeamSelection {
  'Guarda-Redes': string;
  'Defesa': string;
  'Médio': string;
  'Avançado': string;
  'Universal': string;
}

interface GameResult {
  team1Percentage: number;
  team2Percentage: number;
  winner: 'Equipa 1' | 'Equipa 2' | 'Empate';
}

export function RollerHockeyGame() {
  const [isOpen, setIsOpen] = useState(false);
  const [team1, setTeam1] = useState<TeamSelection>({
    'Guarda-Redes': '',
    'Defesa': '',
    'Médio': '',
    'Avançado': '',
    'Universal': ''
  });
  const [team2, setTeam2] = useState<TeamSelection>({
    'Guarda-Redes': '',
    'Médio': '',
    'Defesa': '',
    'Avançado': '',
    'Universal': ''
  });
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const updateTeamSelection = (team: 'team1' | 'team2', position: keyof TeamSelection, player: string) => {
    if (team === 'team1') {
      setTeam1(prev => ({ ...prev, [position]: player }));
    } else {
      setTeam2(prev => ({ ...prev, [position]: player }));
    }
  };

  const isTeamComplete = (team: TeamSelection) => {
    return Object.values(team).every(player => player !== '');
  };

  const canPlay = () => {
    return isTeamComplete(team1) && isTeamComplete(team2);
  };

  const playGame = () => {
    if (!canPlay()) return;

    setIsPlaying(true);
    
    // Simulate game calculation with animation
    setTimeout(() => {
      const team1Percentage = Math.floor(Math.random() * 101);
      const team2Percentage = 100 - team1Percentage;
      
      let winner: 'Equipa 1' | 'Equipa 2' | 'Empate';
      if (team1Percentage > team2Percentage) {
        winner = 'Equipa 1';
      } else if (team2Percentage > team1Percentage) {
        winner = 'Equipa 2';
      } else {
        winner = 'Empate';
      }

      setGameResult({ team1Percentage, team2Percentage, winner });
      setIsPlaying(false);
    }, 2000);
  };

  const resetGame = () => {
    setTeam1({
      'Guarda-Redes': '',
      'Defesa': '',
      'Médio': '',
      'Avançado': '',
      'Universal': ''
    });
    setTeam2({
      'Guarda-Redes': '',
      'Defesa': '',
      'Médio': '',
      'Avançado': '',
      'Universal': ''
    });
    setGameResult(null);
  };

  const positions = ['Guarda-Redes', 'Defesa', 'Médio', 'Avançado', 'Universal'] as const;

  return (
    <>
      {/* Floating Button */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              size="lg"
              className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 flex-col gap-1 p-2 writing-mode-vertical"
              onClick={() => setIsOpen(true)}
            >
              <Gamepad2 className="h-6 w-6" />
              <span className="text-xs font-semibold [writing-mode:vertical-rl] [text-orientation:mixed]">JOGO</span>
            </Button>
          </SheetTrigger>
          
          <SheetContent side="right" className="w-full sm:max-w-2xl p-0 overflow-y-auto">
            <div className="p-6">
              <SheetHeader className="mb-6">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                    <Gamepad2 className="h-6 w-6" />
                    Mini Jogo de Hóquei
                  </SheetTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetGame}
                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </SheetHeader>

              {/* Team Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Team 1 */}
                <Card className="p-4 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                  <h3 className="text-lg font-semibold mb-4 text-center text-primary">Equipa 1</h3>
                  <div className="space-y-3">
                    {positions.map((position) => (
                      <div key={`team1-${position}`} className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">{position}</label>
                        <Select
                          value={team1[position]}
                          onValueChange={(value) => updateTeamSelection('team1', position, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={`Selecionar ${position}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {playersByPosition[position].map((player) => (
                              <SelectItem 
                                key={player} 
                                value={player}
                                disabled={Object.values(team2).includes(player)}
                              >
                                {player}
                                {Object.values(team2).includes(player) && (
                                  <Badge variant="secondary" className="ml-2">Equipa 2</Badge>
                                )}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Team 2 */}
                <Card className="p-4 border-2 border-secondary/20 hover:border-secondary/40 transition-colors">
                  <h3 className="text-lg font-semibold mb-4 text-center text-secondary">Equipa 2</h3>
                  <div className="space-y-3">
                    {positions.map((position) => (
                      <div key={`team2-${position}`} className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">{position}</label>
                        <Select
                          value={team2[position]}
                          onValueChange={(value) => updateTeamSelection('team2', position, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={`Selecionar ${position}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {playersByPosition[position].map((player) => (
                              <SelectItem 
                                key={player} 
                                value={player}
                                disabled={Object.values(team1).includes(player)}
                              >
                                {player}
                                {Object.values(team1).includes(player) && (
                                  <Badge variant="outline" className="ml-2">Equipa 1</Badge>
                                )}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Play Button */}
              <div className="text-center mb-6">
                <Button 
                  size="lg"
                  onClick={playGame}
                  disabled={!canPlay() || isPlaying}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50"
                >
                  {isPlaying ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                      Calculando...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Jogar
                    </>
                  )}
                </Button>
              </div>

              {/* Results */}
              {gameResult && (
                <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20">
                  <h3 className="text-xl font-bold text-center mb-4">Resultado do Jogo</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <h4 className="font-semibold text-primary mb-2">Equipa 1</h4>
                      <div className="text-3xl font-bold text-primary">
                        {gameResult.team1Percentage}%
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <h4 className="font-semibold text-secondary mb-2">Equipa 2</h4>
                      <div className="text-3xl font-bold text-secondary">
                        {gameResult.team2Percentage}%
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className={`text-2xl font-bold mb-2 ${
                      gameResult.winner === 'Equipa 1' ? 'text-primary' : 
                      gameResult.winner === 'Equipa 2' ? 'text-secondary' : 
                      'text-gray-600'
                    }`}>
                      {gameResult.winner === 'Empate' ? '🤝 Empate!' : `🏆 ${gameResult.winner} Vence!`}
                    </div>
                  </div>
                </Card>
              )}

              {!canPlay() && (
                <div className="text-center text-gray-500 text-sm mt-4">
                  Selecione todos os jogadores de ambas as equipas para jogar
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}