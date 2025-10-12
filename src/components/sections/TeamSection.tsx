import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { BarChart3, ExternalLink, Trophy } from 'lucide-react'; // Adicionei o ícone Trophy
import { playersByPosition, staff } from '@/data/siteData';

const sectionVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 2.0 }
    }
};

// ✅ NOVO: Definição do tipo para os detalhes do pop-up
interface ConfirmationDetails {
  isOpen: boolean;
  title: string;
  description: string;
  url: string;
}

export const TeamSection = () => {
  // ✅ ALTERADO: O estado agora guarda todos os detalhes do pop-up
  const [confirmationDetails, setConfirmationDetails] = useState<ConfirmationDetails>({
    isOpen: false,
    title: '',
    description: '',
    url: ''
  });

  // ✅ NOVO: Função para abrir o pop-up com os dados corretos
  const handleOpenConfirmation = (type: 'stats' | 'classification') => {
    if (type === 'stats') {
      setConfirmationDetails({
        isOpen: true,
        title: 'Ver Estatísticas e Resultados',
        description: 'Está prestes a ser redirecionado para o site da FPP para ver as estatísticas da equipa. Deseja continuar?',
        url: 'https://hp.fpp.pt/Equipa/414/804'
      });
    } else {
      setConfirmationDetails({
        isOpen: true,
        title: 'Ver Classificação',
        description: 'Está prestes a ser redirecionado para o site da FPP para ver a classificação do campeonato. Deseja continuar?',
        url: 'https://hp.fpp.pt/Classificacao/414'
      });
    }
  };

  const handleCloseConfirmation = () => {
    setConfirmationDetails({ isOpen: false, title: '', description: '', url: '' });
  };

  return (
    <>
      <motion.section
        id="team"
        className="py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">A Nossa Equipa</h2>
          
          {/* ✅ ALTERADO: Container para os dois botões */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            <Button onClick={() => handleOpenConfirmation('stats')}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Estatísticas e Resultados
            </Button>
            <Button onClick={() => handleOpenConfirmation('classification')} variant="outline">
              <Trophy className="mr-2 h-4 w-4" />
              Ver Classificação
            </Button>
          </div>
          
          <h3 className="text-2xl font-semibold mb-6">Jogadores</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
            {Object.entries(playersByPosition).map(([position, players]) => (
              <Card key={position} className="p-4 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <h4 className="font-semibold text-lg mb-3 text-primary">{position}</h4>
                  <ul className="space-y-1">
                    {players.map((playerName) => (
                      <li key={playerName} className="text-gray-700">{playerName}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>

          <h3 className="text-2xl font-semibold mb-6">Equipa Técnica</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {staff.map((member) => (
              <Card key={member.name} className="p-4 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-gray-600 text-sm">{member.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ✅ ALTERADO: O pop-up agora usa os dados do estado para ser dinâmico */}
      <Dialog open={confirmationDetails.isOpen} onOpenChange={handleCloseConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{confirmationDetails.title}</DialogTitle>
            <DialogDescription>
              {confirmationDetails.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleCloseConfirmation}>
              Cancelar
            </Button>
            <Button type="button" asChild>
              <a href={confirmationDetails.url} target="_blank" rel="noopener noreferrer">
                Continuar
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}