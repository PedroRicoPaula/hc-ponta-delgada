export const CLUB_NIPC = '510 378 242';

export const ESCALOES = ['Sub 11', 'Sub 13', 'Sub 17'] as const;
export type Escalão = (typeof ESCALOES)[number];

export const QUOTA_PAIS = 15;
export const QUOTA_RESTANTES = 20;
export const FEE_MONTH = 15;
export const FEE_SEPTEMBER = 7.5;
/** Outubro a Junho: 9 × 15 €. Desconto de 2 meses = 105 €. Setembro à parte. */
export const OCT_JUN_PACK_EUROS = 105;
export const OCT_JUN_COUNT = 9;

export const SEASON_MONTHS = [
  { id: '2026-09', label: 'Setembro 2026', september: true },
  { id: '2026-10', label: 'Outubro 2026', september: false },
  { id: '2026-11', label: 'Novembro 2026', september: false },
  { id: '2026-12', label: 'Dezembro 2026', september: false },
  { id: '2027-01', label: 'Janeiro 2027', september: false },
  { id: '2027-02', label: 'Fevereiro 2027', september: false },
  { id: '2027-03', label: 'Março 2027', september: false },
  { id: '2027-04', label: 'Abril 2027', september: false },
  { id: '2027-05', label: 'Maio 2027', september: false },
  { id: '2027-06', label: 'Junho 2027', september: false },
] as const;

export type MonthId = (typeof SEASON_MONTHS)[number]['id'];

export const PAYMENT_RULES = [
  'Quotas 2026/27: 15 € se o pedido incluir mensalidade de atleta; 20 € nos restantes associados.',
  'Mensalidades (formação): 15 € por mês. Setembro é 7,50 €. Se pagares a anuidade, há desconto de dois meses: Outubro a Junho ficam 105 € em vez de 135 €, mais 7,50 € de Setembro, total 112,50 €.',
  'Com mensalidade, indica o encarregado de educação. Um NIF: quem faz a transferência.',
  'O site não cobra. Abres o email, transfere para o IBAN do clube e anexas o comprovativo. O clube confirma.',
  'A opção IRS pede declaração ao clube. O mecenato de 25 % na página de patrocinadores aplica-se a donativos. Quotas e mensalidades o clube trata no email; o site não garante a dedução.',
] as const;

export const MAX_MEMBERS = 8;
export const MAX_ATHLETES = 6;
