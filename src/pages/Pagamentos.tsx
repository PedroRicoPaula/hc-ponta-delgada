import { useMemo, useState, type MouseEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, Plus, Trash2, Wallet } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SocialIcons } from '@/components/SocialIcons';
import { CLUB_IBAN } from '@/data/merchData';
import {
  CLUB_NIPC,
  ESCALOES,
  MAX_ATHLETES,
  MAX_MEMBERS,
  PAYMENT_RULES,
  QUOTA_PAIS,
  SEASON_MONTHS,
  type Escalão,
} from '@/data/paymentsData';
import {
  athleteFeeCents,
  buildPaymentMessage,
  CLUB_EMAIL,
  eurosFromCents,
  formatEuro,
  isValidNif,
  isValidPhone,
  MAILTO_COOLDOWN_MS,
  paymentMailtoHref,
  paymentTotals,
  quotaUnitEuros,
  sanitizeNif,
  sanitizePhone,
  type AthleteLine,
  type MemberLine,
} from '@/lib/clubPayments';
import { safeStorage } from '@/lib/safeStorage';

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fieldClass =
  'w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500';

function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function emptyMember(): MemberLine {
  return { id: newId(), name: '' };
}

function emptyAthlete(): AthleteLine {
  return { id: newId(), name: '', escalao: 'Sub 11', months: [] };
}

export default function Pagamentos() {
  const [members, setMembers] = useState<MemberLine[]>([emptyMember()]);
  const [athletes, setAthletes] = useState<AthleteLine[]>([]);
  const [payerName, setPayerName] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [nif, setNif] = useState('');
  const [irsDeclaration, setIrsDeclaration] = useState(false);
  const [mailtoCooldown, setMailtoCooldown] = useState(false);

  const totals = useMemo(() => paymentTotals(members, athletes), [members, athletes]);
  const message = useMemo(
    () => buildPaymentMessage({ members, athletes, payerName, payerPhone, nif, irsDeclaration }),
    [members, athletes, payerName, payerPhone, nif, irsDeclaration],
  );

  const phoneOk = isValidPhone(payerPhone);
  const nifOk = isValidNif(nif);
  const nameOk = payerName.trim().length > 0;
  const canSubmit = message !== null;
  const quotaLabel = formatEuro(quotaUnitEuros(totals.hasAthletes));

  let submitHint = 'Adiciona pelo menos um sócio (com nome) ou um atleta com meses.';
  if (totals.memberCount + totals.athleteCount > 0 && (!nameOk || !phoneOk)) {
    submitHint = totals.hasAthletes
      ? 'Preenche o encarregado de educação (nome e telemóvel).'
      : 'Preenche quem paga (nome e telemóvel).';
  } else if (totals.memberCount + totals.athleteCount > 0 && nameOk && phoneOk && !nifOk) {
    submitHint = 'Indica um NIF português válido (9 dígitos).';
  }

  const onMailtoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const last = Number(safeStorage.getItem('payments-mailto-at') ?? '0');
    if (Number.isFinite(last) && Date.now() - last < MAILTO_COOLDOWN_MS) {
      e.preventDefault();
      setMailtoCooldown(true);
      return;
    }
    safeStorage.setItem('payments-mailto-at', String(Date.now()));
    setMailtoCooldown(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Pagamentos — Hóquei Clube PDL | Quotas e mensalidades</title>
        <meta
          name="description"
          content="Paga quotas de sócio e mensalidades de formação do HC PDL por transferência. O site calcula o total, abres o email e anexas o comprovativo. Sem pagamento no site."
        />
        <link rel="canonical" href="https://hoqueiclubepdl.com/pagamentos/" />
        <meta property="og:title" content="Pagamentos — Hóquei Clube PDL" />
        <meta property="og:description" content="Quotas 2026/27 e mensalidades Setembro a Junho. Email + IBAN. O clube confirma." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hoqueiclubepdl.com/pagamentos/" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Pagamentos — Hóquei Clube PDL',
          url: 'https://hoqueiclubepdl.com/pagamentos/',
          inLanguage: 'pt-PT',
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://hoqueiclubepdl.com/' },
            { '@type': 'ListItem', position: 2, name: 'Pagamentos', item: 'https://hoqueiclubepdl.com/pagamentos/' },
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
              <Wallet className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-heading text-4xl md:text-6xl uppercase leading-none text-gray-900 dark:text-white mb-3">
              Pagamentos <span className="text-primary">2026/27</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Quotas de sócio e mensalidades de formação. O site soma o valor. Transfere para o IBAN e anexas o comprovativo no email.
            </p>
            <ul className="mt-6 max-w-xl mx-auto text-left text-sm text-gray-600 dark:text-gray-400 space-y-2 leading-relaxed">
              {PAYMENT_RULES.map((rule) => (
                <li key={rule} className="pl-4 relative before:absolute before:left-0 before:text-primary before:content-['·']">
                  {rule}
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-10 lg:items-start">
            <div className="lg:col-span-7 space-y-6 mb-10 lg:mb-0">
              <section className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 md:p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-primary/70">Sócios</p>
                    <h2 className="font-heading font-black uppercase text-xl text-gray-900 dark:text-white">Quota anual</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {totals.hasAthletes
                        ? `Com atleta no pedido: ${quotaLabel} por sócio (pais de atletas).`
                        : `Sem mensalidade: ${quotaLabel} por associado. Se adicionares atleta, passa a ${formatEuro(QUOTA_PAIS)}.`}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={members.length >= MAX_MEMBERS}
                    onClick={() => setMembers((prev) => prev.length >= MAX_MEMBERS ? prev : [...prev, emptyMember()])}
                    className="shrink-0 flex items-center gap-1.5 bg-primary text-gray-950 hover:bg-primary/90 disabled:opacity-40 px-3 py-2 font-heading font-black text-[11px] uppercase tracking-wider"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Sócio
                  </button>
                </div>
                <ul className="space-y-3">
                  {members.map((m, i) => (
                    <li key={m.id} className="flex gap-2">
                      <input
                        type="text"
                        aria-label={`Nome do sócio ${i + 1}`}
                        maxLength={80}
                        value={m.name}
                        onChange={(e) => setMembers((prev) => prev.map((row) => row.id === m.id ? { ...row, name: e.target.value.replace(/[<>]/g, '').slice(0, 80) } : row))}
                        className={fieldClass}
                        placeholder="Nome completo do sócio"
                      />
                      <button
                        type="button"
                        aria-label="Remover sócio"
                        onClick={() => setMembers((prev) => prev.length <= 1 ? [{ ...prev[0], name: '' }] : prev.filter((row) => row.id !== m.id))}
                        className="p-2.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 md:p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-primary/70">Formação</p>
                    <h2 className="font-heading font-black uppercase text-xl text-gray-900 dark:text-white">Mensalidades</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Sub 11, Sub 13 e Sub 17. Setembro 7,50 €. Anuidade: desconto de dois meses (112,50 € no total).
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={athletes.length >= MAX_ATHLETES}
                    onClick={() => setAthletes((prev) => prev.length >= MAX_ATHLETES ? prev : [...prev, emptyAthlete()])}
                    className="shrink-0 flex items-center gap-1.5 bg-primary text-gray-950 hover:bg-primary/90 disabled:opacity-40 px-3 py-2 font-heading font-black text-[11px] uppercase tracking-wider"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Atleta
                  </button>
                </div>
                {athletes.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sem atletas. Podes pagar só quotas, ou adicionar formação.</p>
                ) : (
                  <ul className="space-y-6">
                    {athletes.map((a) => {
                      const fee = athleteFeeCents(a.months);
                      return (
                        <li key={a.id} className="border border-gray-100 dark:border-gray-800 rounded-xl p-4">
                          <div className="flex justify-end mb-2">
                            <button
                              type="button"
                              aria-label="Remover atleta"
                              onClick={() => setAthletes((prev) => prev.filter((row) => row.id !== a.id))}
                              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3 mb-3">
                            <label className="block">
                              <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Nome completo</span>
                              <input
                                type="text"
                                maxLength={80}
                                value={a.name}
                                onChange={(e) => setAthletes((prev) => prev.map((row) => row.id === a.id ? { ...row, name: e.target.value.replace(/[<>]/g, '').slice(0, 80) } : row))}
                                className={`${fieldClass} mt-1`}
                                placeholder="Nome do atleta"
                              />
                            </label>
                            <label className="block">
                              <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Escalão</span>
                              <select
                                className={`${fieldClass} mt-1`}
                                value={a.escalao}
                                onChange={(e) => setAthletes((prev) => prev.map((row) => row.id === a.id ? { ...row, escalao: e.target.value as Escalão } : row))}
                              >
                                {ESCALOES.map((esc) => (
                                  <option key={esc} value={esc}>{esc}</option>
                                ))}
                              </select>
                            </label>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <button
                              type="button"
                              onClick={() => setAthletes((prev) => prev.map((row) => row.id === a.id ? { ...row, months: [...SEASON_MONTHS.map((m) => m.id)] } : row))}
                              className="text-xs font-semibold text-primary hover:underline"
                            >
                              Época toda (anuidade)
                            </button>
                            <button
                              type="button"
                              onClick={() => setAthletes((prev) => prev.map((row) => row.id === a.id ? { ...row, months: [] } : row))}
                              className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:underline"
                            >
                              Limpar meses
                            </button>
                            {a.months.length > 0 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatEuro(eurosFromCents(fee.net))}
                                {fee.octJunDiscount ? ' (2 meses de desconto)' : ''}
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {SEASON_MONTHS.map((month) => {
                              const on = a.months.includes(month.id);
                              return (
                                <label
                                  key={month.id}
                                  data-hover
                                  className={`cursor-pointer text-center text-xs px-2 py-2 rounded-lg border ${on ? 'border-primary bg-primary/10 text-gray-900 dark:text-white font-semibold' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}
                                >
                                  <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={on}
                                    onChange={() => setAthletes((prev) => prev.map((row) => {
                                      if (row.id !== a.id) return row;
                                      const months = on
                                        ? row.months.filter((id) => id !== month.id)
                                        : [...row.months, month.id];
                                      return { ...row, months };
                                    }))}
                                  />
                                  {month.label.replace(/ 20\d\d/, '')}
                                  <span className="block text-[10px] opacity-70 mt-0.5">{month.september ? '7,50 €' : '15 €'}</span>
                                </label>
                              );
                            })}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            </div>

            <aside id="resumo" className="lg:col-span-5 lg:sticky lg:top-24 scroll-mt-24">
              <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 md:p-6 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary/70 mb-1">Pedido</p>
                <h2 className="font-heading font-black uppercase text-2xl text-gray-900 dark:text-white mb-4">
                  Resumo
                </h2>

                <dl className="text-sm space-y-2 mb-5">
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500 dark:text-gray-400">Sócios ({totals.memberCount} × {quotaLabel})</dt>
                    <dd className="font-semibold text-gray-900 dark:text-white tabular-nums">{formatEuro(eurosFromCents(totals.quotasCents))}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500 dark:text-gray-400">Mensalidades</dt>
                    <dd className="font-semibold text-gray-900 dark:text-white tabular-nums">{formatEuro(eurosFromCents(totals.mensalCents))}</dd>
                  </div>
                  <div className="flex justify-between gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <dt className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Total</dt>
                    <dd className="font-heading font-black text-xl text-gray-900 dark:text-white tabular-nums">{formatEuro(eurosFromCents(totals.totalCents))}</dd>
                  </div>
                </dl>

                <div className="space-y-3 mb-5">
                  <label className="block">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                      {totals.hasAthletes ? 'Encarregado de educação' : 'Quem paga'}
                    </span>
                    <input
                      type="text"
                      autoComplete="name"
                      maxLength={80}
                      value={payerName}
                      onChange={(e) => setPayerName(e.target.value.replace(/[<>]/g, '').slice(0, 80))}
                      className={`${fieldClass} mt-1`}
                      placeholder="Nome completo"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Telemóvel</span>
                    <input
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      maxLength={20}
                      value={payerPhone}
                      onChange={(e) => setPayerPhone(sanitizePhone(e.target.value))}
                      className={`${fieldClass} mt-1`}
                      placeholder="+351 9xx xxx xxx"
                    />
                    {payerPhone.length > 0 && !phoneOk && (
                      <span className="mt-1 block text-xs text-red-600 dark:text-red-400">Número com 9 a 15 dígitos.</span>
                    )}
                  </label>
                  <label className="block">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">NIF de quem transfere</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={9}
                      value={nif}
                      onChange={(e) => setNif(sanitizeNif(e.target.value))}
                      className={`${fieldClass} mt-1`}
                      placeholder="9 dígitos"
                    />
                    {nif.length > 0 && !nifOk && (
                      <span className="mt-1 block text-xs text-red-600 dark:text-red-400">NIF inválido.</span>
                    )}
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer text-sm text-gray-600 dark:text-gray-400 leading-snug">
                    <input
                      type="checkbox"
                      className="mt-1 rounded border-gray-300"
                      checked={irsDeclaration}
                      onChange={(e) => setIrsDeclaration(e.target.checked)}
                    />
                    <span>
                      Quero declaração para IRS (mecenato). O clube responde por email. NIPC {CLUB_NIPC}. Isto não garante 25 % sobre quotas ou mensalidades.
                    </span>
                  </label>
                </div>

                <div className="mb-5 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">IBAN do clube</p>
                  <p className="font-mono text-xs sm:text-sm text-gray-900 dark:text-white break-all">{CLUB_IBAN}</p>
                  <p className="mt-2 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                    Beneficiário: Hóquei Clube PDL. Anexa o comprovativo no email.
                  </p>
                </div>

                {canSubmit && message ? (
                  <a
                    href={paymentMailtoHref(message)}
                    onClick={onMailtoClick}
                    className="flex items-center justify-center gap-2 w-full bg-primary text-gray-950 hover:bg-primary/90 px-4 py-3 font-heading font-black text-xs uppercase tracking-wider"
                  >
                    <Mail className="w-4 h-4" />
                    Abrir email do pagamento
                  </a>
                ) : (
                  <div className="space-y-2">
                    <button
                      type="button"
                      disabled
                      className="flex items-center justify-center gap-2 w-full bg-primary/40 text-gray-950/60 px-4 py-3 font-heading font-black text-xs uppercase tracking-wider cursor-not-allowed"
                    >
                      <Mail className="w-4 h-4" />
                      Abrir email do pagamento
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-1">{submitHint}</p>
                  </div>
                )}

                {mailtoCooldown && (
                  <p className="mt-2 text-xs text-center text-amber-700 dark:text-amber-400">
                    Espera uns segundos antes de voltar a abrir o email.
                  </p>
                )}

                <p className="mt-4 text-[11px] leading-relaxed text-gray-400 dark:text-gray-500">
                  Os dados não ficam neste site. O email sai da tua conta para {CLUB_EMAIL}.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {totals.totalCents > 0 && (
        <a
          href="#resumo"
          className="lg:hidden fixed bottom-4 right-4 z-40 bg-primary text-gray-950 px-4 py-3 font-heading font-black text-xs uppercase tracking-wider shadow-lg"
        >
          {formatEuro(eurosFromCents(totals.totalCents))} · Pedido
        </a>
      )}

      <Footer />
    </div>
  );
}
