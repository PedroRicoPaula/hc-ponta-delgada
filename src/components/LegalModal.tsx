import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LegalModalProps {
  type: 'terms' | 'privacy' | 'cookies' | null;
  onClose: () => void;
}

const TERMS = `
**1. Aceitação**
Ao usares o site do Hóquei Clube PDL (hoqueiclubepdl.com), aceitas estes termos.

**2. O que o site faz**
O site apresenta o clube, treinos, calendário, comunicados, blog, merch e pagamentos de quotas/mensalidades. Há também transmissão ao vivo no YouTube quando há jogo em casa. Não é uma loja online com envios nem um serviço que cobra no cartão. É proibida a reprodução comercial de conteúdos sem autorização.

**3. Propriedade intelectual**
Textos, imagens, logótipos e vídeos são do Hóquei Clube PDL ou usados com autorização. Não copies para uso comercial sem pedir.

**4. Exactidão**
Esforçamo-nos por manter a informação correcta. Horários, resultados e preços podem mudar. O clube pode actualizar o site sem aviso prévio.

**5. Links e conteúdos de terceiros**
Há ligações para a FPP, redes sociais, mapas e o YouTube. O clube não controla esses sites.

**6. Merch**
Na página de merch reservas peças. Não há correio: levantas no Pavilhão Sidónio Serpa, em Ponta Delgada. Pagamento por transferência para o IBAN publicado (beneficiário Hóquei Clube PDL). O clube confirma valores e se o preço de sócio se aplica. O site não cobra nem envia o email da reserva. Tu envias a partir da tua conta de correio.

**7. Pagamentos**
A página de pagamentos calcula quotas e mensalidades de formação. Não há débito no site. Transfere para o IBAN publicado e anexas o comprovativo no email que tu envias. O clube confirma valores, qualidade de sócio e escalão. Pedir declaração para IRS não garante que quotas ou mensalidades sejam tratadas como donativo de mecenato.

**8. Alterações**
Podemos alterar estes termos. A versão em vigor é a que está publicada neste diálogo.

**9. Contacto**
Dúvidas: hoquei.clube.pdl@gmail.com.
`.trim();

const PRIVACY = `
**1. Responsável**
Hóquei Clube PDL. Email: hoquei.clube.pdl@gmail.com. Telefone: +351 296 382 987.

**2. O que recolhemos**
Não há formulário de contacto no site. Na homepage falas connosco por email ou telefone.

Na merch e nos pagamentos, o pedido sai do teu programa de correio. Nome, telefone, NIF, nomes de atletas ou sócios e o que pediste chegam à caixa Gmail do clube. O site não guarda essa mensagem num servidor nosso.

Não vendemos listas de emails. Não fazemos perfis publicitários.

**3. Para que servem**
Responder a contactos, gerir reservas de merch, quotas, mensalidades, associados e comunicação do clube.

**4. Base legal**
Consentimento (quando nos escreves) ou relação de associado, quando se aplica. RGPD, Art.º 6.º, n.º 1.

**5. Quanto tempo**
O tempo necessário para tratar o pedido, ou o prazo que a lei exigir (por exemplo, contabilidade de uma venda).

**6. Partilha**
Não vendemos dados. Podemos partilhar com a Federação de Patinagem de Portugal no âmbito desportivo, se for preciso.

**7. Os teus direitos**
Acesso, rectificação, apagamento, portabilidade e oposição. Escreve para hoquei.clube.pdl@gmail.com.

**8. Armazenamento no teu dispositivo**
O tema claro/escuro e a escolha do banner de cookies ficam no armazenamento local do navegador. Na merch e nos pagamentos há um intervalo curto entre aberturas de email (também local). Ver a política de cookies.

**9. Privacidade**
Questões: o mesmo email do clube. Não temos um DPO nomeado à parte.
`.trim();

const COOKIES = `
**1. Cookies e armazenamento local**
Cookies são ficheiros pequenos no teu dispositivo. Este site usa sobretudo armazenamento local (localStorage). O Google Analytics só corre depois de aceitares o aviso.

**2. Banner**
O aviso de cookies aparece em todas as páginas. Recusar guarda a escolha e não carrega o Google Analytics. O tema claro/escuro continua a funcionar: é uma preferência técnica, não publicidade.

**3. O que guardamos no navegador**
Preferência de tema (next-themes). Escolha do banner (cookie-consent). Na merch e nos pagamentos, um carimbo de tempo para não reabrires o mesmo pedido de imediato.

**4. Google Analytics**
Se aceitares, carregamos o Google Analytics (G-JJMSCRMS87) para perceber visitas e páginas. Sem aceitar, esse script não corre. Não usamos Google AdSense.

**5. YouTube**
Quando há vídeo incorporado (galeria, calendário ou jogo ao vivo), o YouTube pode instalar cookies próprios. Isso é da Google, segundo a política deles.

**6. No navegador**
Podes apagar dados do site nas definições. Sem tema guardado, voltas ao modo claro por omissão.

**7. Contacto**
hoquei.clube.pdl@gmail.com.
`.trim();

function renderText(text: string) {
  return text.split('\n\n').map((para, i) => (
    <p key={i} className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3"
      dangerouslySetInnerHTML={{
        __html: para.replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900 dark:text-gray-100">$1</strong>')
      }}
    />
  ));
}

const TITLES: Record<string, string> = {
  terms: 'Termos e Condições',
  privacy: 'Política de Privacidade',
  cookies: 'Política de Cookies',
};

const CONTENT: Record<string, string> = {
  terms: TERMS,
  privacy: PRIVACY,
  cookies: COOKIES,
};

export const LegalModal = ({ type, onClose }: LegalModalProps) => (
  <Dialog open={!!type} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">
          {type ? TITLES[type] : ''}
        </DialogTitle>
      </DialogHeader>
      <div className="mt-2">
        {type ? renderText(CONTENT[type]) : null}
      </div>
    </DialogContent>
  </Dialog>
);
