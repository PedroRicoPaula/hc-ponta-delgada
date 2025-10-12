import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface FooterProps {
  onOpenDonations: () => void;
}

export const Footer = ({ onOpenDonations }: FooterProps) => (
  <footer className="bg-gray-900 text-white py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="mb-4">© 2025 Hóquei Clube Ponta Delgada. Todos os direitos reservados.</p>
      <Button
        variant="outline"
        className="bg-transparent border-primary text-primary hover:bg-primary hover:text-white"
        onClick={onOpenDonations}
      >
        <Heart className="mr-2 h-4 w-4" /> Fazer uma Doação
      </Button>
    </div>
  </footer>
);