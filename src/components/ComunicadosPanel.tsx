import { X } from "lucide-react";

interface Comunicado {
  id: number;
  titulo: string;
  data: string;
  conteudo: string;
}

interface ComunicadosPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: Comunicado[];
}

export const ComunicadosPanel = ({ isOpen, onClose, data }: ComunicadosPanelProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 opacity-100"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out translate-x-0">
        <div className="p-6 relative h-full">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            aria-label="Fechar comunicados"
          >
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-2xl font-bold mb-4">Comunicados</h2>
          <div className="h-[calc(100%-50px)] overflow-y-auto pr-2 space-y-4">
            {data.map((comunicado) => (
              <div 
                key={comunicado.id} 
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-primary mb-1">
                  {comunicado.titulo}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{comunicado.data}</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {comunicado.conteudo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};