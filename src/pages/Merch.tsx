import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SocialIcons } from '@/components/SocialIcons';
import { CLUB_IBAN, merchProducts, type MerchProduct } from '@/data/merchData';
import {
  addLine,
  buildReservationMessage,
  formatEuro,
  getProduct,
  isValidPhone,
  mailtoHref,
  MAX_QTY,
  reservationTotal,
  sanitizePhone,
  sizesFor,
  unitPrice,
  CLUB_EMAIL,
  type ReservationLine,
} from '@/lib/merchReservation';

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fieldClass =
  'w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500';

function ProductCard({ product, onAdd }: { product: MerchProduct; onAdd: (line: ReservationLine) => void }) {
  const sizeOptions = sizesFor(product);
  const uniqueSize = sizeOptions.length === 1;
  const [size, setSize] = useState(sizeOptions.includes('M') ? 'M' : sizeOptions[0]);
  const [variant, setVariant] = useState(product.variants?.[0]);
  const [qty, setQty] = useState(1);
  const photo = (variant && product.variantImages?.[variant]) || product.image;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, rotateX: 3 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease }}
      style={{ transformPerspective: 1200 }}
      className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col shadow-sm"
    >
      <div className="bg-gray-100 dark:bg-gray-900 aspect-[4/5] flex items-center justify-center p-3">
        <img
          src={photo}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h2 className="font-heading font-black uppercase text-gray-900 dark:text-white text-lg leading-tight">
            {product.name}
          </h2>
          {product.note && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-snug">{product.note}</p>
          )}
          <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">{formatEuro(product.priceMember)}</span>
            <span className="text-gray-400 dark:text-gray-500"> sócio</span>
            <span className="mx-1.5 text-gray-300 dark:text-gray-600">·</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatEuro(product.priceNonMember)}</span>
            <span className="text-gray-400 dark:text-gray-500"> não sócio</span>
          </p>
        </div>

        {product.variants && (
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Modelo</span>
            <select className={`${fieldClass} mt-1`} value={variant} onChange={(e) => setVariant(e.target.value)}>
              {product.variants.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </label>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Tamanho</span>
            {uniqueSize ? (
              <p className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm mt-1 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-default select-none">
                {size}
              </p>
            ) : (
              <select
                className={`${fieldClass} mt-1`}
                value={size}
                onChange={(e) => setSize(e.target.value)}
                aria-label="Tamanho"
              >
                {sizeOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          </div>
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Qtd</span>
            <select className={`${fieldClass} mt-1`} value={qty} onChange={(e) => setQty(Number(e.target.value))}>
              {Array.from({ length: MAX_QTY }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={() => onAdd({ productId: product.id, size, qty, ...(variant ? { variant } : {}) })}
          className="mt-auto bg-primary text-gray-950 hover:bg-primary/90 px-4 py-2.5 font-heading font-black text-xs uppercase tracking-wider"
        >
          Adicionar à reserva
        </button>
      </div>
    </motion.article>
  );
}

function LineRow({ line, member, onRemove, onQty }: {
  line: ReservationLine;
  member: boolean | null;
  onRemove: () => void;
  onQty: (qty: number) => void;
}) {
  const product = getProduct(line.productId);
  if (!product) return null;
  const extras = [line.variant, line.size].filter(Boolean).join(' · ');
  const unit = member === null ? null : unitPrice(product, member);
  const lineTotal = unit === null ? null : unit * line.qty;

  return (
    <li className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <img
        src={(line.variant && product.variantImages?.[line.variant]) || product.image}
        alt=""
        className="w-12 h-12 object-contain bg-gray-100 dark:bg-gray-900 rounded-lg flex-shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">{product.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{extras}</p>
        {lineTotal !== null && (
          <p className="text-xs font-semibold text-gray-900 dark:text-white mt-1 tabular-nums">{formatEuro(lineTotal)}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <button
            type="button"
            aria-label="Diminuir quantidade"
            onClick={() => onQty(line.qty - 1)}
            className="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-sm tabular-nums text-gray-900 dark:text-white w-5 text-center">{line.qty}</span>
          <button
            type="button"
            aria-label="Aumentar quantidade"
            onClick={() => onQty(line.qty + 1)}
            disabled={line.qty >= MAX_QTY}
            className="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <button
        type="button"
        aria-label={`Remover ${product.name}`}
        onClick={onRemove}
        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-primary"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </li>
  );
}

export default function Merch() {
  const [lines, setLines] = useState<ReservationLine[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [member, setMember] = useState<boolean | null>(null);

  const message = useMemo(
    () => buildReservationMessage(lines, { name, phone, note, member }),
    [lines, name, phone, note, member],
  );
  const pieceCount = lines.reduce((n, l) => n + l.qty, 0);
  const canSubmit = message !== null;
  const nameOk = name.trim().length > 0;
  const phoneOk = isValidPhone(phone);
  const total = member === null ? null : reservationTotal(lines, member);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Merch — Hóquei Clube PDL',
    description: 'Loja oficial do Hóquei Clube PDL. Reserva de merch da época 2026/27 por email, com preços de sócio e não sócio.',
    url: 'https://hoqueiclubepdl.com/merch',
    inLanguage: 'pt-PT',
    publisher: { '@type': 'Organization', name: 'Hóquei Clube PDL', url: 'https://hoqueiclubepdl.com/' },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: merchProducts.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: p.name,
          image: `https://hoqueiclubepdl.com${p.image}`,
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'EUR',
            lowPrice: p.priceMember,
            highPrice: p.priceNonMember,
            availability: 'https://schema.org/PreOrder',
          },
        },
      })),
    },
  };

  let submitHint = 'Adiciona pelo menos uma peça.';
  if (lines.length > 0 && (!nameOk || !phoneOk)) submitHint = 'Preenche nome e telemóvel para enviar.';
  else if (lines.length > 0 && member === null) submitHint = 'Indica se és sócio do clube.';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Merch — Hóquei Clube PDL | Reserva de Loja Oficial</title>
        <meta
          name="description"
          content="Merch oficial do Hóquei Clube PDL (Açores): camisolas, sweat, softshell, cachecóis e bonés. Reserva por email com preços de sócio e não sócio. Sem pagamento no site."
        />
        <link rel="canonical" href="https://hoqueiclubepdl.com/merch/" />
        <meta property="og:title" content="Merch — Hóquei Clube PDL" />
        <meta property="og:description" content="Reserva merch oficial do Hóquei Clube PDL por email. Encomenda prévia com transferência para o IBAN do clube." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hoqueiclubepdl.com/merch/" />
        <script type="application/ld+json">{JSON.stringify(collectionSchema)}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://hoqueiclubepdl.com/' },
            { '@type': 'ListItem', position: 2, name: 'Merch', item: 'https://hoqueiclubepdl.com/merch' },
          ],
        })}</script>
      </Helmet>

      <Navigation />
      <SocialIcons />

      <main className="pt-24 pb-24 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10 md:mb-14"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 mb-4">
              <ShoppingBag className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-heading text-4xl md:text-6xl uppercase leading-none text-gray-900 dark:text-white mb-3">
              Merch <span className="text-primary">oficial</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Colecção 2026/27. Escolhe as peças e envia a reserva por email.
              Encomenda prévia: transfere o valor para o IBAN do clube e anexa o comprovativo na mensagem.
            </p>
          </motion.div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-10 lg:items-start">
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-5 mb-10 lg:mb-0">
              {merchProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={(line) => setLines((prev) => addLine(prev, line))}
                />
              ))}
            </div>

            <aside id="reserva" className="lg:col-span-4 lg:sticky lg:top-24 scroll-mt-24">
              <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 md:p-6 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary/70 mb-1">Reserva</p>
                <h2 className="font-heading font-black uppercase text-2xl text-gray-900 dark:text-white mb-4">
                  O teu pedido
                </h2>

                {lines.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Ainda não há peças. Adiciona do catálogo à esquerda.
                  </p>
                ) : (
                  <ul className="mb-4">
                    {lines.map((line, i) => (
                      <LineRow
                        key={`${line.productId}-${line.size}-${line.variant ?? ''}`}
                        line={line}
                        member={member}
                        onRemove={() => setLines((prev) => prev.filter((_, idx) => idx !== i))}
                        onQty={(qty) => setLines((prev) => {
                          if (qty < 1) return prev.filter((_, idx) => idx !== i);
                          return prev.map((l, idx) => idx === i ? { ...l, qty: Math.min(MAX_QTY, qty) } : l);
                        })}
                      />
                    ))}
                  </ul>
                )}

                {total !== null && lines.length > 0 && (
                  <p className="flex items-baseline justify-between mb-5 pt-1 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Total</span>
                    <span className="font-heading font-black text-xl text-gray-900 dark:text-white tabular-nums">{formatEuro(total)}</span>
                  </p>
                )}

                <fieldset className="mb-5">
                  <legend className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                    És sócio do clube?
                  </legend>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`flex items-center justify-center gap-2 px-3 py-2.5 border text-sm font-semibold cursor-pointer ${member === true ? 'border-primary bg-primary/10 text-gray-900 dark:text-white' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>
                      <input
                        type="radio"
                        name="member"
                        className="sr-only"
                        checked={member === true}
                        onChange={() => setMember(true)}
                      />
                      Sócio
                    </label>
                    <label className={`flex items-center justify-center gap-2 px-3 py-2.5 border text-sm font-semibold cursor-pointer ${member === false ? 'border-primary bg-primary/10 text-gray-900 dark:text-white' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>
                      <input
                        type="radio"
                        name="member"
                        className="sr-only"
                        checked={member === false}
                        onChange={() => setMember(false)}
                      />
                      Não sócio
                    </label>
                  </div>
                </fieldset>

                <div className="space-y-3 mb-5">
                  <label className="block">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Nome</span>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      maxLength={80}
                      value={name}
                      onChange={(e) => setName(e.target.value.replace(/[<>]/g, '').slice(0, 80))}
                      className={`${fieldClass} mt-1`}
                      placeholder="Primeiro e último nome"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Telemóvel</span>
                    <input
                      type="tel"
                      name="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      maxLength={20}
                      value={phone}
                      onChange={(e) => setPhone(sanitizePhone(e.target.value))}
                      className={`${fieldClass} mt-1`}
                      placeholder="+351 9xx xxx xxx"
                    />
                    {phone.length > 0 && !phoneOk && (
                      <span className="mt-1 block text-xs text-red-600 dark:text-red-400">Indica um número válido (9 a 15 dígitos).</span>
                    )}
                  </label>
                  <label className="block">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Nota (opcional)</span>
                    <textarea
                      name="note"
                      maxLength={280}
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value.replace(/[<>]/g, '').slice(0, 280))}
                      className={`${fieldClass} mt-1 resize-none`}
                      placeholder="Ex: número na camisola, prazo de levantamento…"
                    />
                  </label>
                </div>

                <div className="mb-5 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">IBAN do clube</p>
                  <p className="font-mono text-xs sm:text-sm text-gray-900 dark:text-white break-all">{CLUB_IBAN}</p>
                  <p className="mt-2 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                    Transfere o total e anexa o comprovativo no email da reserva.
                  </p>
                </div>

                {canSubmit && message ? (
                  <a
                    href={mailtoHref(message)}
                    className="flex items-center justify-center gap-2 w-full bg-primary text-gray-950 hover:bg-primary/90 px-4 py-3 font-heading font-black text-xs uppercase tracking-wider"
                  >
                    <Mail className="w-4 h-4" />
                    Enviar reserva por email
                  </a>
                ) : (
                  <div className="space-y-2">
                    <button
                      type="button"
                      disabled
                      className="flex items-center justify-center gap-2 w-full bg-primary/40 text-gray-950/60 px-4 py-3 font-heading font-black text-xs uppercase tracking-wider cursor-not-allowed"
                    >
                      <Mail className="w-4 h-4" />
                      Enviar reserva por email
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-1">
                      {submitHint}
                    </p>
                  </div>
                )}

                <p className="mt-4 text-[11px] leading-relaxed text-gray-400 dark:text-gray-500">
                  Os dados não ficam guardados neste site. São enviados por ti, no teu cliente de email,
                  para {CLUB_EMAIL}.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {pieceCount > 0 && (
        <a
          href="#reserva"
          className="lg:hidden fixed bottom-4 right-4 z-40 bg-primary text-gray-950 px-4 py-3 font-heading font-black text-xs uppercase tracking-wider shadow-lg"
        >
          {pieceCount} {pieceCount === 1 ? 'peça' : 'peças'}
          {total !== null ? ` · ${formatEuro(total)}` : ''} · Reserva
        </a>
      )}

      <Footer />
    </div>
  );
}
