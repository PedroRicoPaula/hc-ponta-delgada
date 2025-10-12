import { Button } from "@/components/ui/button";

interface CookieConsentProps {
  onAccept: () => void;
  onReject: () => void;
}

export const CookieConsent = ({ onAccept, onReject }: CookieConsentProps) => (
  <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
    <div className="flex flex-col space-y-2">
      <p className="text-xs text-gray-600">
        Este site utiliza cookies para melhorar a sua experiência de navegação.
      </p>
      <div className="flex gap-2">
        <Button
          onClick={onAccept}
          className="flex-1 bg-primary hover:bg-primary/90 text-white text-xs py-1 h-8"
        >
          Aceitar
        </Button>
        <Button
          onClick={onReject}
          variant="outline"
          className="flex-1 text-xs py-1 h-8"
        >
          Não aceitar
        </Button>
      </div>
    </div>
  </div>
);