import { CLUB_IBAN, merchProducts, type MerchProduct } from '@/data/merchData';

export const CLUB_EMAIL = 'hoquei.clube.pdl@gmail.com';

export const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
export const ONESIZE = 'Único';

export const MAX_QTY = 9;
const MAX_NAME = 80;
const MAX_PHONE = 20;
const MAX_NOTE = 280;
const MAX_LINES = 12;

export interface ReservationLine {
  productId: string;
  size: string;
  variant?: string;
  qty: number;
}

const productById = new Map(merchProducts.map((p) => [p.id, p]));

const euro = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });

export function formatEuro(value: number): string {
  return euro.format(value);
}

function stripControls(s: string): string {
  return [...s]
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code > 31 && code !== 127;
    })
    .join('')
    .trim();
}

export function getProduct(id: string): MerchProduct | undefined {
  return productById.get(id);
}

export function sizesFor(product: MerchProduct): readonly string[] {
  return product.sizes === 'apparel' ? APPAREL_SIZES : [ONESIZE];
}

export function unitPrice(product: MerchProduct, member: boolean): number {
  return member ? product.priceMember : product.priceNonMember;
}

export function sanitizeName(raw: string): string {
  return stripControls(raw).replace(/[<>]/g, '').slice(0, MAX_NAME);
}

export function sanitizePhone(raw: string): string {
  return stripControls(raw).replace(/[^\d+\s]/g, '').slice(0, MAX_PHONE);
}

export function sanitizeNote(raw: string): string {
  return stripControls(raw).replace(/[<>]/g, '').replace(/\s+/g, ' ').slice(0, MAX_NOTE);
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 15;
}

export function normalizeLine(input: ReservationLine): ReservationLine | null {
  const product = productById.get(input.productId);
  if (!product) return null;

  if (!sizesFor(product).includes(input.size)) return null;

  let variant: string | undefined;
  if (product.variants && product.variants.length > 0) {
    if (!input.variant || !product.variants.includes(input.variant)) return null;
    variant = input.variant;
  } else if (input.variant) {
    return null;
  }

  const qty = Math.min(MAX_QTY, Math.max(1, Math.floor(Number(input.qty)) || 1));
  return variant
    ? { productId: product.id, size: input.size, variant, qty }
    : { productId: product.id, size: input.size, qty };
}

function lineKey(line: ReservationLine): string {
  return `${line.productId}|${line.size}|${line.variant ?? ''}`;
}

export function addLine(existing: ReservationLine[], raw: ReservationLine): ReservationLine[] {
  const line = normalizeLine(raw);
  if (!line) return existing;

  const idx = existing.findIndex((l) => lineKey(l) === lineKey(line));
  if (idx === -1) {
    if (existing.length >= MAX_LINES) return existing;
    return [...existing, line];
  }

  const next = [...existing];
  next[idx] = { ...next[idx], qty: Math.min(MAX_QTY, next[idx].qty + line.qty) };
  return next;
}

export function reservationTotal(lines: ReservationLine[], member: boolean): number {
  return lines.reduce((sum, raw) => {
    const line = normalizeLine(raw);
    if (!line) return sum;
    const product = productById.get(line.productId);
    if (!product) return sum;
    return sum + unitPrice(product, member) * line.qty;
  }, 0);
}

export function buildReservationMessage(
  lines: ReservationLine[],
  contact: { name: string; phone: string; note: string; member: boolean | null },
): string | null {
  const name = sanitizeName(contact.name);
  const phone = sanitizePhone(contact.phone);
  const note = sanitizeNote(contact.note);
  if (!name || !isValidPhone(phone) || contact.member === null) return null;

  const normalized = lines
    .map(normalizeLine)
    .filter((l): l is ReservationLine => l !== null);
  if (normalized.length === 0) return null;

  const member = contact.member;
  const pieceLines = normalized.map((l) => {
    const product = productById.get(l.productId);
    if (!product) return null;
    const extras = [l.variant, l.size].filter(Boolean).join(', ');
    const unit = unitPrice(product, member);
    const lineTotal = unit * l.qty;
    const label = product.note ? `${product.name} (${extras}) — ${product.note}` : `${product.name} (${extras})`;
    return `- ${l.qty}× ${label} — ${formatEuro(unit)} × ${l.qty} = ${formatEuro(lineTotal)}`;
  }).filter((row): row is string => row !== null);

  if (pieceLines.length === 0) return null;

  const total = reservationTotal(normalized, member);
  const parts = [
    'Reserva de merch — HC PDL',
    '',
    `Nome: ${name}`,
    `Contacto: ${phone}`,
    `Sócio: ${member ? 'Sim' : 'Não'}`,
    '',
    'Peças:',
    ...pieceLines,
    '',
    `Total: ${formatEuro(total)}`,
    '',
    `IBAN HC PDL: ${CLUB_IBAN}`,
    'Anexar comprovativo de transferência neste email.',
  ];
  if (note) parts.push('', `Nota: ${note}`);
  parts.push('', 'Encomenda prévia — não é pagamento no site.');
  return parts.join('\n');
}

export function mailtoHref(message: string): string {
  return `mailto:${CLUB_EMAIL}?subject=${encodeURIComponent('Reserva merch — HC PDL')}&body=${encodeURIComponent(message)}`;
}
