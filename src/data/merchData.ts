export type MerchSizeMode = 'apparel' | 'onesize';

export interface MerchProduct {
  id: string;
  name: string;
  image: string;
  sizes: MerchSizeMode;
  variants?: string[];
  variantImages?: Record<string, string>;
  note?: string;
  priceMember: number;
  priceNonMember: number;
}

export const merchProducts: MerchProduct[] = [
  {
    id: 'camisola-jogador',
    name: 'Camisola de jogo',
    image: '/uploads/merch/jerseyplayer.jpeg',
    sizes: 'apparel',
    variants: ['Principal', 'Alternativa'],
    priceMember: 23,
    priceNonMember: 27,
  },
  {
    id: 'camisola-guarda-redes',
    name: 'Camisola guarda-redes',
    image: '/uploads/merch/jerseygk.jpeg',
    sizes: 'apparel',
    priceMember: 23,
    priceNonMember: 27,
  },
  {
    id: 'equipamento-jogo',
    name: 'Equipamento de jogo',
    image: '/uploads/merch/jerseyplayer.jpeg',
    sizes: 'apparel',
    variants: ['Jogador', 'Guarda-redes'],
    variantImages: {
      Jogador: '/uploads/merch/jerseyplayer.jpeg',
      'Guarda-redes': '/uploads/merch/jerseygk.jpeg',
    },
    note: 'Camisolas reversíveis e calções pretos',
    priceMember: 45,
    priceNonMember: 49,
  },
  {
    id: 't-shirt-15-anos',
    name: 'Camisola 15 anos',
    image: '/uploads/merch/t-shirt15anos.jpeg',
    sizes: 'apparel',
    priceMember: 23,
    priceNonMember: 27,
  },
  {
    id: 'sweat',
    name: 'Sweat',
    image: '/uploads/merch/sweat.jpeg',
    sizes: 'apparel',
    variants: ['Com capuz', 'Sem capuz'],
    priceMember: 25,
    priceNonMember: 30,
  },
  {
    id: 'softshell',
    name: 'Casaco softshell',
    image: '/uploads/merch/softsheel.jpeg',
    sizes: 'apparel',
    priceMember: 45,
    priceNonMember: 50,
  },
  {
    id: 'cachecol',
    name: 'Cachecol',
    image: '/uploads/merch/cachecois.jpeg',
    sizes: 'onesize',
    variants: ['Branco', 'Preto 15 anos'],
    priceMember: 10,
    priceNonMember: 15,
  },
  {
    id: 'bone',
    name: 'Boné',
    image: '/uploads/merch/bone-c-rede.jpeg',
    sizes: 'onesize',
    variants: ['Com rede', 'Sem rede'],
    variantImages: {
      'Com rede': '/uploads/merch/bone-c-rede.jpeg',
      'Sem rede': '/uploads/merch/bone-s-rede.jpeg',
    },
    priceMember: 10,
    priceNonMember: 15,
  },
];

export const CLUB_IBAN = 'PT50 0010 0000 48649200001 07';

export const MERCH_PICKUP = 'Pavilhão Sidónio Serpa, Ponta Delgada';

/** Texto partilhado na página e no email da reserva. */
export const MERCH_RULES = [
  `O clube não faz envios. O levantamento é só no pavilhão (${MERCH_PICKUP}).`,
  'Reserva por email, transferência para o IBAN do Hóquei Clube PDL, comprovativo no mesmo email, levantamento no pavilhão quando o clube confirmar a encomenda.',
  'O preço de sócio é confirmado pelo clube. Se não fores sócio, aplica-se o preço de não sócio.',
  'O site não envia emails automaticamente: abres o teu programa de correio e és tu que envias.',
] as const;

export function ibanCompact(iban: string): string {
  return iban.replace(/\s/g, '');
}
