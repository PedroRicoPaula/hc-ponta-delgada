import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LegalModalProps {
  type: 'terms' | 'privacy' | 'cookies' | null;
  onClose: () => void;
}

const TERMS = `
**1. Aceitação dos Termos**
Ao aceder e utilizar o site do Hóquei Clube PDL (hoqueiclubepdl.com), aceita os presentes termos e condições de utilização.

**2. Utilização do Site**
O conteúdo deste site destina-se exclusivamente a fins informativos sobre as atividades do clube. É proibida a reprodução ou utilização comercial de qualquer conteúdo sem autorização prévia.

**3. Propriedade Intelectual**
Todos os conteúdos (textos, imagens, logótipos, vídeos) são propriedade do Hóquei Clube PDL ou utilizados com a devida autorização. A reprodução não autorizada é proibida.

**4. Responsabilidade**
O Hóquei Clube PDL não se responsabiliza por eventuais imprecisões nas informações publicadas, reservando-se o direito de as alterar sem aviso prévio.

**5. Links Externos**
O site pode conter links para sites de terceiros. O clube não se responsabiliza pelo conteúdo desses sites.

**6. Alterações**
Reservamo-nos o direito de alterar estes termos a qualquer momento. As alterações entram em vigor imediatamente após publicação.

**7. Contacto**
Para questões relacionadas com estes termos, contacte-nos através de hoquei.clube.pdl@gmail.com.
`.trim();

const PRIVACY = `
**1. Responsável pelo Tratamento**
Hóquei Clube PDL · hoquei.clube.pdl@gmail.com · +351 296 382 987

**2. Dados Recolhidos**
Recolhemos apenas os dados que nos fornece voluntariamente (ex: nome e email no formulário de contacto). Não recolhemos dados de navegação além de cookies técnicos essenciais.

**3. Finalidade do Tratamento**
Os dados são utilizados exclusivamente para responder a pedidos de contacto, gerir associados e comunicar informações sobre o clube.

**4. Base Legal**
O tratamento baseia-se no consentimento do titular (RGPD, Art.º 6.º, n.º 1, al. a)) ou na execução de contrato de associado.

**5. Conservação**
Os dados são conservados pelo período necessário à finalidade que motivou a recolha, ou pelo prazo legalmente exigido.

**6. Partilha com Terceiros**
Não vendemos nem partilhamos dados pessoais com terceiros para fins comerciais. Podemos partilhar com a Federação de Patinagem de Portugal (FPP) no âmbito da federação desportiva.

**7. Direitos do Titular**
Tem direito de acesso, retificação, apagamento, portabilidade e oposição ao tratamento dos seus dados. Exerça estes direitos através de hoquei.clube.pdl@gmail.com.

**8. Cookies**
Utilizamos cookies técnicos essenciais para o funcionamento do site. Pode gerir as suas preferências no banner de cookies.

**9. Contacto DPO**
Para questões de privacidade: hoquei.clube.pdl@gmail.com
`.trim();

const COOKIES = `
**1. O que são Cookies?**
Cookies são pequenos ficheiros de texto armazenados no seu dispositivo quando visita um website. Permitem que o site reconheça o seu dispositivo em visitas futuras e guarde preferências.

**2. Cookies que Utilizamos**

**Cookies Essenciais (sempre ativos)**
Necessários para o funcionamento básico do site. Incluem: preferências de tema (modo claro/escuro), consentimento de cookies. Não podem ser desativados pois são indispensáveis ao funcionamento do site.

**Cookies de Preferências**
Guardam as suas escolhas de personalização, como o tema visual preferido. Sem estes cookies, pode ter de redefinir as suas preferências em cada visita.

**3. Cookies de Terceiros**
Este site pode incluir conteúdos incorporados de terceiros (ex: vídeos do YouTube). Esses serviços podem instalar os seus próprios cookies, sujeitos às respetivas políticas de privacidade.

**4. Como Gerir Cookies**
Pode gerir ou eliminar cookies através das definições do seu navegador. Note que desativar certos cookies pode afetar a funcionalidade do site.

**5. Duração**
Os cookies de sessão são eliminados quando fecha o navegador. Os cookies persistentes (como preferências de tema) têm duração máxima de 12 meses.

**6. Alterações**
Esta política pode ser atualizada. A data da última revisão é indicada no rodapé do site.

**7. Contacto**
Para questões sobre cookies: hoquei.clube.pdl@gmail.com
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
