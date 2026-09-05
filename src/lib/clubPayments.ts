import { CLUB_IBAN } from '@/data/merchData';
import {
  ESCALOES,
  FEE_MONTH,
  FEE_SEPTEMBER,
  MAX_ATHLETES,
  MAX_MEMBERS,
  PAYMENT_RULES,
  QUOTA_PAIS,
  QUOTA_RESTANTES,
  SEASON_DISCOUNT,
  SEASON_MONTHS,
  type Escalão,
  type MonthId,
} from '@/data/paymentsData';
import {
  CLUB_EMAIL,
  formatEuro,
  isValidPhone,
  sanitizeName,
  sanitizePhone,
} from '@/lib/merchReservation';

export const MAILTO_COOLDOWN_MS = 45_000;
export { formatEuro, isValidPhone, sanitizeName, sanitizePhone, CLUB_EMAIL };

export interface MemberLine {
  id: string;
  name: string;
}

export interface AthleteLine {
  id: string;
  name: string;
  escalao: Escalão;
  months: MonthId[];
}

const MONTH_IDS = new Set<string>(SEASON_MONTHS.map((m) => m.id));

function toCents(euros: number): number {
  return Math.round(euros * 100);
}

export function quotaUnitEuros(hasAthletes: boolean): number {
  return hasAthletes ? QUOTA_PAIS : QUOTA_RESTANTES;
}

export function isValidNif(raw: string): boolean {
  const n = raw.replace(/\D/g, '');
  if (n.length !== 9) return false;
  const d = n.split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += d[i] * (9 - i);
  const mod = sum % 11;
  const check = mod < 2 ? 0 : 11 - mod;
  return d[8] === check;
}

export function sanitizeNif(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 9);
}

export function normalizeMonths(months: readonly string[]): MonthId[] {
  const seen = new Set<MonthId>();
  for (const id of months) {
    if (MONTH_IDS.has(id)) seen.add(id as MonthId);
  }
  return SEASON_MONTHS.map((m) => m.id).filter((id) => seen.has(id));
}

export function athleteFeeCents(months: readonly string[]): { gross: number; net: number; fullSeason: boolean } {
  const ids = normalizeMonths(months);
  let gross = 0;
  for (const id of ids) {
    const meta = SEASON_MONTHS.find((m) => m.id === id);
    if (!meta) continue;
    gross += toCents(meta.september ? FEE_SEPTEMBER : FEE_MONTH);
  }
  const fullSeason = ids.length === SEASON_MONTHS.length;
  const net = fullSeason ? Math.round(gross * (1 - SEASON_DISCOUNT)) : gross;
  return { gross, net, fullSeason };
}

export function membersTotalCents(count: number, hasAthletes: boolean): number {
  const n = Math.max(0, Math.min(MAX_MEMBERS, Math.floor(count)));
  return n * toCents(quotaUnitEuros(hasAthletes));
}

export function paymentTotals(members: MemberLine[], athletes: AthleteLine[]) {
  const namedAthletes = athletes.filter((a) => sanitizeName(a.name));
  const billedAthletes = namedAthletes.filter((a) => normalizeMonths(a.months).length > 0);
  const hasAthletes = namedAthletes.length > 0;
  const validMembers = members.filter((m) => sanitizeName(m.name));
  const quotas = membersTotalCents(validMembers.length, hasAthletes);
  let mensal = 0;
  for (const a of billedAthletes) mensal += athleteFeeCents(a.months).net;
  return {
    hasAthletes,
    quotaUnit: quotaUnitEuros(hasAthletes),
    memberCount: validMembers.length,
    athleteCount: billedAthletes.length,
    quotasCents: quotas,
    mensalCents: mensal,
    totalCents: quotas + mensal,
  };
}

export function eurosFromCents(cents: number): number {
  return cents / 100;
}

export function buildPaymentMessage(input: {
  members: MemberLine[];
  athletes: AthleteLine[];
  payerName: string;
  payerPhone: string;
  nif: string;
  irsDeclaration: boolean;
}): string | null {
  const name = sanitizeName(input.payerName);
  const phone = sanitizePhone(input.payerPhone);
  const nif = sanitizeNif(input.nif);
  if (!name || !isValidPhone(phone) || !isValidNif(nif)) return null;

  const members = input.members
    .map((m) => ({ ...m, name: sanitizeName(m.name) }))
    .filter((m) => m.name)
    .slice(0, MAX_MEMBERS);

  const namedAthletes = input.athletes
    .map((a) => ({
      ...a,
      name: sanitizeName(a.name),
      months: normalizeMonths(a.months),
      escalao: ESCALOES.includes(a.escalao) ? a.escalao : ESCALOES[0],
    }))
    .filter((a) => a.name)
    .slice(0, MAX_ATHLETES);

  const athletes = namedAthletes.filter((a) => a.months.length > 0);

  if (members.length === 0 && athletes.length === 0) return null;

  const totals = paymentTotals(members, namedAthletes);
  const lines: string[] = [
    'Pagamento quotas / mensalidades HC PDL 2026/27',
    '',
    namedAthletes.length > 0 ? `Encarregado de educação: ${name}` : `Quem paga: ${name}`,
    `Contacto: ${phone}`,
    `NIF (quem transfere): ${nif}`,
    `Pedido de declaração IRS (mecenato): ${input.irsDeclaration ? 'Sim. O clube confirma se aplica.' : 'Não'}`,
    '',
  ];

  if (members.length > 0) {
    lines.push(`Sócios (quota ${formatEuro(totals.quotaUnit)} cada):`);
    for (const m of members) {
      lines.push(`- ${m.name}  ${formatEuro(totals.quotaUnit)}`);
    }
    lines.push(`Subtotal sócios: ${formatEuro(eurosFromCents(totals.quotasCents))}`, '');
  }

  if (athletes.length > 0) {
    lines.push('Mensalidades (formação):');
    for (const a of athletes) {
      const fee = athleteFeeCents(a.months);
      const monthLabels = SEASON_MONTHS.filter((m) => a.months.includes(m.id)).map((m) => m.label).join(', ');
      const disc = fee.fullSeason ? ' (época toda, 20% desconto)' : '';
      lines.push(`- ${a.name} (${a.escalao}): ${monthLabels}${disc} = ${formatEuro(eurosFromCents(fee.net))}`);
    }
    lines.push(`Subtotal mensalidades: ${formatEuro(eurosFromCents(totals.mensalCents))}`, '');
  }

  lines.push(
    `Total: ${formatEuro(eurosFromCents(totals.totalCents))}`,
    '',
    `IBAN HC PDL: ${CLUB_IBAN}`,
    'Anexa o comprovativo de transferência neste email.',
    '',
    'Condições:',
    ...PAYMENT_RULES.map((r) => `- ${r}`),
    '',
    'Não é pagamento no site. O clube confirma valores, sócio e escalão.',
  );

  return lines.join('\n');
}

export function paymentMailtoHref(message: string): string {
  return `mailto:${CLUB_EMAIL}?subject=${encodeURIComponent('Pagamento sócios/mensalidades HC PDL 2026/27')}&body=${encodeURIComponent(message)}`;
}
