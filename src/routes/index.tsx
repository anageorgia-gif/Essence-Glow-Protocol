import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Flame,
  Activity,
  Apple,
  Moon,
  Droplets,
  Leaf,
  Heart,
  Check,
  ShoppingBag,
  ArrowRight,
  X,
  Star,
  Plus,
  Minus,
} from "lucide-react";
import { blobToBase64, generateProtocolPdf } from "@/lib/generateProtocolPdf";
import heroImg from "@/assets/seca/hero.jpg";
import evidenceLogo from "@/assets/seca/evidence-logo.png";

import ecobagLifestyle1 from "@/assets/seca/ecobag-lifestyle-1.png";
import { supabase } from "@/integrations/supabase/client";

import termogenicoImg from "@/assets/seca/termogenico.jpg";
import bocaImg from "@/assets/seca/boca-fechada.jpg";
import basicoImg from "@/assets/seca/basico.jpg";
import sonoImg from "@/assets/seca/sono.jpg";
import cabeloImg from "@/assets/seca/cabelo.jpg";
import lipManhaImg from "@/assets/seca/lipedema-manha.jpg";
import lipNoiteImg from "@/assets/seca/lipedema-noite.jpg";

import { Instagram } from "lucide-react";
import {
  getDiscount,
  nextThreshold,
  COMPLETE_PROTOCOL_PRICE,
  WHATSAPP_NUMBER,
  type Formula,
} from "@/lib/formulas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Seca Tudo — Edição Pré-Copa & Pré-Férias | Larah Nóbrega x Evidence",
      },
      {
        name: "description",
        content:
          "Protocolo manipulado estratégico para mais leveza, disposição e bem-estar. Por Larah Nóbrega em parceria com a Farmácia Evidence.",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Poppins:wght@300;400;500;600;700&family=Allura&display=swap",
      },
    ],
  }),
  component: Index,
});

type ProductRow = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string | null;
  benefits: string[] | null;
  posology: string | null;
  formula: string[] | null;
  active: boolean | null;
  sort_order: number | null;
};

type FAQRow = {
  id: string;
  question: string;
  answer: string;
  active: boolean | null;
  sort_order: number | null;
};

const fallbackImages: Record<string, string> = {
  termogenico: termogenicoImg,
  "boca-fechada": bocaImg,
  basico: basicoImg,
  sono: sonoImg,
  cabelo: cabeloImg,
  "lipedema-manha": lipManhaImg,
  "lipedema-noite": lipNoiteImg,
};

const benefits = [
  { icon: Activity, label: "Mais disposição" },
  { icon: Flame, label: "Auxílio metabólico" },
  { icon: Apple, label: "Controle da compulsão" },
  { icon: Moon, label: "Melhora do sono" },
  { icon: Droplets, label: "Redução do inchaço" },
  { icon: Sparkles, label: "Pele, cabelo e unhas" },
  { icon: Leaf, label: "Sensação de leveza" },
  { icon: Heart, label: "Autocuidado diário" },
];

const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function useAnimatedNumber(value: number, duration = 700) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const startRef = useRef<number | null>(null);
  useEffect(() => {
    const from = display;
    fromRef.current = from;
    startRef.current = null;
    let raf = 0;
    const step = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (value - from) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return display;
}

function Index() {
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [faqs, setFaqs] = useState<FAQRow[]>([]);
  const [loadingFormulas, setLoadingFormulas] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [unlockMsg, setUnlockMsg] = useState<string | null>(null);
  const prevDiscountRef = useRef(0);

  useEffect(() => {
    loadProducts();
    loadFaqs();
  }, []);

  async function loadProducts() {
    setLoadingFormulas(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error(error);
      setLoadingFormulas(false);
      return;
    }

    const mapped = ((data ?? []) as ProductRow[]).map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price ?? 0),
      image: p.image_url || fallbackImages[p.id] || "",
      description: p.description ?? "",
      benefits: p.benefits ?? [],
      posology: p.posology ?? "",
      formula: p.formula ?? [],
    }));

    setFormulas(mapped);
    setLoadingFormulas(false);
  }

  async function loadFaqs() {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setFaqs((data ?? []) as FAQRow[]);
  }

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectAll = () => {
    setSelected(new Set(formulas.map((f) => f.id)));
    setTimeout(() => {
      document.getElementById("formulas")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const items = useMemo(() => formulas.filter((f) => selected.has(f.id)), [formulas, selected]);
  const subtotal = items.reduce((s, f) => s + f.price, 0);
  const isComplete = formulas.length > 0 && items.length === formulas.length;
  const discount = getDiscount(items.length);
  const total = isComplete ? COMPLETE_PROTOCOL_PRICE : subtotal * (1 - discount);
  const savings = subtotal - total;
  const threshold = nextThreshold(items.length);

  useEffect(() => {
    if (discount > prevDiscountRef.current) {
      const label = isComplete
        ? "Protocolo completo desbloqueado ✦"
        : `${Math.round(discount * 100)}% OFF desbloqueado ✦`;
      setUnlockMsg(label);
      const t = setTimeout(() => setUnlockMsg(null), 2600);
      prevDiscountRef.current = discount;
      return () => clearTimeout(t);
    }
    prevDiscountRef.current = discount;
  }, [discount, isComplete]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header count={items.length} onCheckout={() => setCheckoutOpen(true)} />
      <Hero />
      <IntroBand />
      <Benefits />
      <DiscountSection onSelectAll={selectAll} />
      <Comparison formulas={formulas} subtotal={subtotal} total={total} savings={savings} isComplete={isComplete} count={items.length} onSelectAll={selectAll} />
      <ExclusividadeEvidence onSelectAll={selectAll} />
      

      {loadingFormulas ? (
        <section className="py-20 text-center text-muted-foreground">
          Carregando fórmulas...
        </section>
      ) : (
        <FormulaSection
          formulas={formulas}
          selected={selected}
          toggle={toggle}
          threshold={threshold}
          items={items}
        />
      )}
      <FAQ faqs={faqs} />
      {items.length > 0 && (
        <StickyBar
          count={items.length}
          subtotal={subtotal}
          total={total}
          savings={savings}
          discount={discount}
          isComplete={isComplete}
          onCheckout={() => setCheckoutOpen(true)}
        />
      )}
      <EvidenceFooter />
      {unlockMsg && (
        <div
          key={unlockMsg}
          className="fixed left-1/2 top-20 z-50 animate-unlock pointer-events-none"
        >
          <div className="rounded-full bg-gradient-gold text-navy px-6 py-3 shadow-gold flex items-center gap-2 text-sm font-medium tracking-wide">
            <Sparkles className="h-4 w-4" />
            {unlockMsg}
          </div>
        </div>
      )}
      {checkoutOpen && (
        <CheckoutModal
          items={items}
          subtotal={subtotal}
          total={total}
          savings={savings}
          discount={discount}
          isComplete={isComplete}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </div>
  );
}

function EvidenceMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 50" className={className} fill="none" aria-hidden>
      <rect x="2" y="2" width="36" height="46" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 10 C 28 16, 12 22, 28 28 C 12 34, 28 40, 12 40"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M28 10 C 12 16, 28 22, 12 28 C 28 34, 12 40, 28 40"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Header({ count, onCheckout }: { count: number; onCheckout: () => void }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-navy/95 border-b border-gold/20">
      <div className="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <img
            src={evidenceLogo}
            alt="Farmácia Evidence — Manipulação Farmacêutica"
            className="h-8 md:h-9 w-auto"
          />
        </a>
        <button
          onClick={onCheckout}
          disabled={count === 0}
          className="relative inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-gold/15 disabled:opacity-40"
        >
          <ShoppingBag className="h-4 w-4 text-gold" />
          <span className="tabular-nums">{count}</span>
          {count > 0 && (
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-gold ring-2 ring-navy" />
          )}
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-navy text-navy-foreground">
      <div className="absolute inset-0 topo-pattern opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 pt-10 pb-16 md:pt-20 md:pb-28 grid md:grid-cols-[0.95fr_1.05fr] gap-10 md:gap-14 items-center">
        <div className="animate-fade-up text-center md:text-left order-2 md:order-1">
          <div className="inline-flex items-center gap-1.5 mb-6 justify-center md:justify-start">
            {[...Array(6)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
            ))}
          </div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl md:text-6xl leading-[1.02] text-white tracking-tight">
            Te mostro o poder do{" "}
            <em className="not-italic text-gold">BÁSICO BEM FEITO</em>
          </h1>
          <div className="mx-auto md:mx-0 mt-6 h-px w-20 bg-gradient-to-r from-transparent via-gold to-transparent md:bg-gradient-to-l" />
          <p className="mt-6 text-base sm:text-lg text-navy-foreground/80 max-w-md mx-auto md:mx-0 text-balance leading-relaxed">
            Fórmulas manipuladas desenvolvidas por Larah Nóbrega em parceria
            com a Farmácia Evidence — para potencializar seus resultados.
          </p>

          <div className="mt-8 flex items-center gap-4 justify-center md:justify-start">
            <div className="text-left">
              <p className="font-display text-xl text-white leading-tight">
                Larah Nóbrega
              </p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold mt-1">
                Nutricionista · CRN 6197CE
              </p>
              <a
                href="https://www.instagram.com/larahnobreganutri/?hl=pt-br"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-xs text-navy-foreground/70 hover:text-gold transition"
              >
                <Instagram className="h-3.5 w-3.5" />
                @larahnobreganutri
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <a href="#formulas" className="btn-pill btn-pill-gold group">
              Montar meu protocolo
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <a href="#descontos" className="btn-pill border border-white/20 text-navy-foreground hover:bg-white/5">
              Ver descontos
            </a>
          </div>
        </div>

        <div className="relative animate-fade-up order-1 md:order-2">
          <div
            className="absolute -inset-3 rounded-[2.25rem] bg-gradient-gold opacity-25 blur-3xl"
            aria-hidden
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] ring-1 ring-gold/40 shadow-luxe">
            <img
              src={heroImg}
              alt="Seca Tudo — Edição Pré-Copa e Pré-Férias com Larah Nóbrega"
              className="h-full w-full object-cover"
              width={1066}
              height={1332}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function IntroBand() {
  return (
    <section className="bg-gradient-gold text-navy py-16 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-25" aria-hidden style={{
        backgroundImage: "repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0 1px, transparent 1px 24px)"
      }} />
      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-navy/70 mb-5">
          Manifesto
        </p>
        <p className="font-display text-2xl sm:text-3xl leading-snug text-balance">
          Eu e a <em className="not-italic underline decoration-navy/30 underline-offset-4">Farmácia Evidence</em>{" "}
          acreditamos que cuidar da saúde deve ser algo leve e alinhado ao seu
          momento. Por isso preparamos uma condição especial para facilitar sua
          jornada — com um incentivo extra para quem optar pelo protocolo
          completo.
        </p>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section id="beneficios" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
            Por que esse protocolo
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-balance text-navy">
            Cuidado completo, do interior à pele.
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {benefits.map(({ icon: Icon, label }, i) => (
            <div
              key={label}
              style={{ animationDelay: `${i * 60}ms` }}
              className="animate-fade-up group rounded-2xl bg-card border border-border/70 p-5 md:p-6 transition-all duration-500 hover:shadow-soft hover:-translate-y-1 hover:border-gold/40"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-gold transition group-hover:scale-105">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <p className="mt-5 text-sm md:text-[15px] font-medium leading-snug text-navy">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExclusividadeEvidence({ onSelectAll }: { onSelectAll: () => void }) {
  return (
    <section
      id="exclusividade"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ backgroundColor: "oklch(0.96 0.018 85)" }}
    >
      {/* soft decorative gold accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--gold) 30%, transparent), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--navy) 25%, transparent), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-5">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* LEFT — Copy + CTA */}
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur border border-gold/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.32em] text-gold shadow-soft">
              <Sparkles className="h-3 w-3" /> Exclusividade Evidence
            </span>

            <h2 className="mt-6 font-display text-4xl md:text-5xl lg:text-6xl text-navy leading-[1.05] tracking-tight text-balance">
              Sua transformação <span className="text-gold italic">merece um presente</span> exclusivo
            </h2>

            <p className="mt-6 text-base md:text-lg text-navy/70 leading-relaxed max-w-xl">
              Ao concluir o <strong className="text-navy">Protocolo Seca Tudo</strong>, você recebe
              uma <strong className="text-navy">Ecobag Evidence</strong> exclusiva para acompanhar
              sua rotina com elegância e praticidade.
            </p>

            <ul
              className="mt-8 space-y-3.5 text-sm md:text-base text-navy/85 animate-fade-up"
              style={{ animationDelay: "150ms" }}
            >
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 border border-gold/40 flex-shrink-0">
                  <Check className="h-3.5 w-3.5 text-gold" />
                </span>
                <span><strong className="text-navy">Ecobag gratuita</strong> no protocolo completo</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 border border-gold/40 flex-shrink-0">
                  <Check className="h-3.5 w-3.5 text-gold" />
                </span>
                <span><strong className="text-navy">50% OFF na ecobag</strong> ao comprar 4 fórmulas</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 border border-gold/40 flex-shrink-0">
                  <Check className="h-3.5 w-3.5 text-gold" />
                </span>
                <span>Apenas <strong className="text-navy">60 unidades</strong> disponíveis</span>
              </li>
            </ul>

            <div
              className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              <button
                onClick={onSelectAll}
                className="btn-pill btn-pill-navy hover:scale-[1.03] transition-transform"
              >
                Quero garantir minha ecobag
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-[11px] text-navy/55 max-w-[16rem]">
                *Brinde aplicado automaticamente ao fechar o protocolo completo.
              </p>
            </div>
          </div>

          {/* RIGHT — Lifestyle image */}
          <div
            className="relative animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="relative overflow-hidden rounded-3xl shadow-luxe ring-gold-line aspect-[4/5] bg-navy/5">
              <img
                src={ecobagLifestyle1}
                alt="Mulher carregando a Ecobag Evidence — Protocolo Seca Tudo"
                className="absolute inset-0 h-full w-full object-cover animate-slow-zoom"
                width={1024}
                height={1280}
                loading="lazy"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, transparent 55%, color-mix(in oklab, var(--navy) 35%, transparent))" }}
              />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                <div className="rounded-2xl bg-white/85 backdrop-blur px-4 py-3 shadow-soft">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-gold">Edição limitada</p>
                  <p className="text-xs font-medium text-navy mt-0.5">Ecobag Evidence</p>
                </div>
                <span className="rounded-full bg-navy text-navy-foreground text-[10px] uppercase tracking-[0.25em] px-3.5 py-1.5 shadow-soft">
                  60 unidades
                </span>
              </div>
            </div>

            {/* floating accent card */}
            <div
              className="hidden md:flex absolute -bottom-6 -left-6 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-luxe border border-gold/30 animate-float-soft"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 border border-gold/40">
                <Sparkles className="h-4 w-4 text-gold" />
              </span>
              <div className="leading-tight">
                <p className="text-[10px] uppercase tracking-[0.25em] text-navy/60">Brinde exclusivo</p>
                <p className="text-sm font-medium text-navy">Grátis no protocolo completo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}






function DiscountSection({ onSelectAll }: { onSelectAll: () => void }) {
  const tiers = [
    { qty: "2 fórmulas", off: "10%" },
    { qty: "3 a 5 fórmulas", off: "20%" },
    { qty: "7 fórmulas", off: "30%" },
  ];
  return (
    <section
      id="descontos"
      className="relative py-20 md:py-28 bg-gradient-navy text-navy-foreground overflow-hidden"
    >
      <div className="absolute inset-0 topo-pattern opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
            Descontos progressivos
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-balance">
            Quanto mais completo, maior a economia.
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-4">
          {tiers.map((t, i) => (
            <div
              key={t.qty}
              style={{ animationDelay: `${i * 100}ms` }}
              className="animate-fade-up rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 text-center transition hover:border-gold/40 hover:-translate-y-1 duration-500"
            >
              <p className="text-[10px] uppercase tracking-[0.35em] text-gold-soft/80">
                {t.qty}
              </p>
              <p className="mt-4 font-display text-7xl text-white">
                {t.off}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-navy-foreground/60">
                de desconto
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 relative rounded-3xl bg-gradient-gold p-8 md:p-12 text-center text-gold-foreground shadow-gold overflow-hidden">
          <div className="absolute inset-0 opacity-20" aria-hidden style={{
            backgroundImage: "repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0 1px, transparent 1px 24px)"
          }} />
          <span className="relative inline-flex items-center gap-2 rounded-full bg-navy px-3.5 py-1.5 text-[10px] uppercase tracking-[0.3em] text-gold animate-pulse-gold">
            <Sparkles className="h-3 w-3" /> Manipulação prioritária
          </span>
          <p className="relative mt-4 text-[10px] uppercase tracking-[0.4em]">Protocolo completo</p>
          <p className="relative mt-3 font-display text-3xl md:text-5xl">
            7 fórmulas por {formatBRL(COMPLETE_PROTOCOL_PRICE)}
          </p>
          <p className="relative mt-2 text-sm font-medium">
            ou em até <span className="font-semibold">5x sem juros</span> no cartão.
          </p>
          <p className="relative mt-4 text-sm opacity-85 max-w-md mx-auto">
            Feche agora o protocolo completo e <strong>entre na fila prioritária de manipulação</strong> — suas fórmulas ficam prontas o quanto antes para você começar com tudo.
          </p>
          <button onClick={onSelectAll} className="relative btn-pill btn-pill-navy mt-6">
            Quero o protocolo completo agora
          </button>
        </div>
      </div>
    </section>
  );
}

function FormulaSection({
  formulas,
  selected,
  toggle,
  threshold,
  items,
}: {
  formulas: Formula[];
  selected: Set<string>;
  toggle: (id: string) => void;
  threshold: ReturnType<typeof nextThreshold>;
  items: Formula[];
}) {
  const progress = formulas.length > 0 ? Math.min(items.length / formulas.length, 1) * 100 : 0;
  return (
    <section id="formulas" className="py-20 md:py-28 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
            Monte seu protocolo
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-balance text-navy">
            Escolha as fórmulas que combinam com você.
          </h2>
        </div>

        <div className="sticky top-[64px] z-20 mt-10 rounded-2xl border border-border bg-card/95 backdrop-blur-md p-4 md:p-5 shadow-soft">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="font-medium text-navy">
              {items.length}{" "}
              {items.length === 1 ? "fórmula selecionada" : "fórmulas selecionadas"}
            </span>
            <span className="text-gold font-medium text-right text-xs sm:text-sm">
              {threshold
                ? `Faltam ${threshold.needed} para ${threshold.nextLabel}`
                : "Desconto máximo desbloqueado ✦"}
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-gradient-gold transition-all duration-700 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 shimmer-bar" />
            </div>
          </div>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {formulas.map((f) => (
            <FormulaCard
              key={f.id}
              formula={f}
              isSelected={selected.has(f.id)}
              onToggle={() => toggle(f.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FormulaCard({
  formula,
  isSelected,
  onToggle,
}: {
  formula: Formula;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className={`group relative rounded-3xl bg-card overflow-hidden border transition-all duration-500 ${
        isSelected
          ? "border-gold shadow-luxe -translate-y-1"
          : "border-border/70 hover:shadow-soft hover:-translate-y-1 hover:border-gold/40"
      }`}
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-navy">
        <img
          src={formula.image}
          alt={formula.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy/30 to-transparent" />
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-navy">
          <span className="h-1 w-1 rounded-full bg-gold" />
          Fórmula manipulada
        </div>
        {isSelected && (
          <span className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-gold text-navy shadow-gold animate-fade-up">
            <Check className="h-4 w-4" strokeWidth={2.5} />
          </span>
        )}
        <div className="absolute bottom-5 left-5 right-5">
          <h3 className="font-display text-2xl md:text-[1.7rem] leading-tight text-white">
            {formula.name}
          </h3>
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {formula.description}
        </p>

        <ul className="mt-5 space-y-2">
          {formula.benefits.map((b) => (
            <li
              key={b}
              className="flex items-start gap-2.5 text-sm text-navy"
            >
              <span className="mt-2 h-1 w-1 rounded-full bg-gold flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>

        <details className="mt-5 group/details">
          <summary className="cursor-pointer text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-navy transition list-none flex items-center gap-2">
            <span>Composição & posologia</span>
            <span className="transition group-open/details:rotate-90">›</span>
          </summary>
          <div className="mt-3 space-y-3 text-xs text-muted-foreground">
            <p>
              <span className="font-medium text-navy">Posologia:</span>{" "}
              {formula.posology}
            </p>
            <ul className="space-y-1">
              {formula.formula.map((line) => (
                <li key={line} className="flex items-center gap-2">
                  <span className="h-px w-3 bg-gold/60" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </details>

        <div className="mt-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              30 dias
            </p>
            <p className="font-display text-2xl text-navy">
              {formatBRL(formula.price)}
            </p>
          </div>
          <button
            onClick={onToggle}
            className={`btn-pill ${
              isSelected ? "btn-pill-outline" : "btn-pill-navy"
            } !py-3 !px-5 !text-[10px]`}
          >
            {isSelected ? "Remover" : "Selecionar"}
          </button>
        </div>
      </div>
    </article>
  );
}

function StickyBar({
  count,
  subtotal,
  total,
  savings,
  discount,
  isComplete,
  onCheckout,
}: {
  count: number;
  subtotal: number;
  total: number;
  savings: number;
  discount: number;
  isComplete: boolean;
  onCheckout: () => void;
}) {
  const aTotal = useAnimatedNumber(total);
  const aSavings = useAnimatedNumber(savings);
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/95 backdrop-blur-xl shadow-luxe animate-fade-up"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-navy text-[10px] text-navy-foreground font-medium tabular-nums">
              {count}
            </span>
            <span className="truncate">
              {count === 1 ? "fórmula" : "fórmulas"}
              {isComplete && " · Protocolo completo"}
            </span>
          </div>
          <div className="mt-0.5 flex items-baseline gap-2 flex-wrap">
            <p className="font-display text-xl sm:text-2xl text-navy tabular-nums">
              {formatBRL(aTotal)}
            </p>
            {savings > 0 && (
              <>
                <span className="text-xs line-through text-muted-foreground tabular-nums">
                  {formatBRL(subtotal)}
                </span>
                <span className="inline-flex items-center rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-medium text-navy tabular-nums">
                  {isComplete ? "Protocolo" : `${Math.round(discount * 100)}% OFF`} · −{formatBRL(aSavings)}
                </span>
              </>
            )}
          </div>
        </div>
        <button onClick={onCheckout} className="btn-pill btn-pill-navy !py-3 !px-5 shrink-0">
          <span className="hidden sm:inline">Finalizar pedido</span>
          <span className="sm:hidden">Finalizar</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Comparison({
  formulas,
  subtotal,
  total,
  savings,
  isComplete,
  count,
  onSelectAll,
}: {
  formulas: Formula[];
  subtotal: number;
  total: number;
  savings: number;
  isComplete: boolean;
  count: number;
  onSelectAll: () => void;
}) {
  const fullSubtotal = formulas.reduce((s, f) => s + f.price, 0);
  const fullSavings = fullSubtotal - COMPLETE_PROTOCOL_PRICE;
  const aSavings = useAnimatedNumber(savings);
  const aTotal = useAnimatedNumber(total);
  return (
    <section id="comparativo" className="py-20 md:py-28 bg-secondary/40">
      <div className="mx-auto max-w-5xl px-5">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
            Comparativo
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-balance text-navy">
            Individual ou protocolo completo?
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Veja em tempo real o quanto você economiza ao escolher o protocolo completo.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-5">
          <div className="rounded-3xl bg-card border border-border p-7 md:p-8 shadow-soft">
            <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              Sua seleção atual
            </p>
            <p className="mt-3 font-display text-4xl text-navy tabular-nums">
              {formatBRL(aTotal)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {count === 0 ? "Nenhuma fórmula selecionada" : `${count} ${count === 1 ? "fórmula" : "fórmulas"} · subtotal ${formatBRL(subtotal)}`}
            </p>
            <div className="mt-6 h-px bg-border" />
            <ul className="mt-6 space-y-2 text-sm text-navy">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" /> Liberdade de combinar fórmulas</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" /> Descontos progressivos</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" /> Economia de até <span className="font-medium tabular-nums">{formatBRL(aSavings)}</span></li>
            </ul>
          </div>

          <div className="relative rounded-3xl bg-gradient-navy text-navy-foreground p-7 md:p-8 shadow-luxe overflow-hidden">
            <div className="absolute inset-0 topo-pattern opacity-50" aria-hidden />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.32em] text-gold">
                  Protocolo completo
                </p>
                <span className="rounded-full bg-gold/15 border border-gold/30 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.25em] text-gold">
                  Recomendado
                </span>
              </div>
              <p className="mt-3 font-display text-4xl text-white tabular-nums">
                {formatBRL(COMPLETE_PROTOCOL_PRICE)}
              </p>
              <p className="mt-1 text-xs text-navy-foreground/70">
                7 fórmulas · de <span className="line-through">{formatBRL(fullSubtotal)}</span>
              </p>
              <div className="mt-6 h-px bg-white/10" />
              <ul className="mt-6 space-y-2 text-sm text-navy-foreground/90">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" /> Protocolo do início ao fim</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" /> Maior economia: <span className="font-medium text-gold tabular-nums">{formatBRL(fullSavings)}</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" /> Em até <span className="font-medium text-gold">5x sem juros</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" /> Manipulação prioritária</li>
              </ul>
              <button onClick={onSelectAll} disabled={isComplete} className="btn-pill btn-pill-gold mt-7 w-full disabled:opacity-60">
                {isComplete ? "Você já escolheu" : "Quero o protocolo completo"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ({ faqs }: { faqs: FAQRow[] }) {
  const [open, setOpen] = useState<number | null>(0);

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
            Dúvidas frequentes
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-balance text-navy">
            Tudo que você precisa saber.
          </h2>
        </div>
        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.id}
                className={`rounded-2xl border bg-card transition-all duration-500 ${
                  isOpen ? "border-gold/50 shadow-soft" : "border-border hover:border-gold/30"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-5 text-left"
                >
                  <span className="font-display text-lg text-navy">{f.question}</span>
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${isOpen ? "bg-navy text-navy-foreground border-navy" : "border-border text-navy"}`}>
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-500 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 md:px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {f.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function EvidenceFooter() {
  return (
    <footer className="relative bg-gradient-navy text-navy-foreground py-20 mt-12 mb-24 overflow-hidden">
      <div className="absolute inset-0 topo-pattern opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-5 text-center flex flex-col items-center">
        <img
          src={evidenceLogo}
          alt="Farmácia Evidence"
          className="h-16 md:h-20 w-auto"
        />
        <a href="#formulas" className="btn-pill btn-pill-gold mt-8">
          Adquira suas fórmulas
        </a>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
          <a
            href="https://www.instagram.com/farmaciaevidence/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-gold/25 bg-white/[0.04] p-5 hover:border-gold/60 transition group"
          >
            <p className="text-[10px] uppercase tracking-[0.32em] text-gold">Farmácia</p>
            <p className="mt-2 inline-flex items-center gap-2 font-display text-lg text-white group-hover:text-gold transition">
              <Instagram className="h-4 w-4" /> @farmaciaevidence
            </p>
          </a>
          <a
            href="https://www.instagram.com/larahnobreganutri/?hl=pt-br"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-gold/25 bg-white/[0.04] p-5 hover:border-gold/60 transition group"
          >
            <p className="text-[10px] uppercase tracking-[0.32em] text-gold">Nutricionista</p>
            <p className="mt-2 inline-flex items-center gap-2 font-display text-lg text-white group-hover:text-gold transition">
              <Instagram className="h-4 w-4" /> @larahnobreganutri
            </p>
          </a>
        </div>

        <p className="mt-10 text-xs text-navy-foreground/70">
          Atendimento WhatsApp:{" "}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            (85) 9235-2755
          </a>
        </p>
        <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-navy-foreground/40">
          Larah Nóbrega · CRN 6197CE — em parceria com a Farmácia Evidence
        </p>
      </div>
    </footer>
  );
}

type CheckoutForm = {
  nome: string;
  cpf: string;
  whatsapp: string;
  email: string;
  pagamento: string;
  regiao: string;
};

type Regiao = "fortaleza" | "metropolitana" | "brasil" | "exterior";

const REGIOES: { id: Regiao; label: string; hint: string }[] = [
  { id: "fortaleza", label: "Fortaleza", hint: "R$ 10 abaixo de R$ 500 · Grátis acima de R$ 500" },
  { id: "metropolitana", label: "Eusébio, Maranguape ou Caucaia", hint: "Grátis acima de R$ 500 · Abaixo, calculado pela central" },
  { id: "brasil", label: "Outras cidades do Brasil", hint: "Grátis acima de R$ 500 · Abaixo, calculado pela central" },
  { id: "exterior", label: "Exterior", hint: "Frete calculado pela central" },
];

function CheckoutModal({
  items,
  subtotal,
  total,
  savings,
  discount,
  isComplete,
  onClose,
}: {
  items: Formula[];
  subtotal: number;
  total: number;
  savings: number;
  discount: number;
  isComplete: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CheckoutForm>({
    nome: "",
    cpf: "",
    whatsapp: "",
    email: "",
    pagamento: "PIX",
    regiao: "fortaleza",
  });
  const [pdfBusy, setPdfBusy] = useState<"idle" | "download" | "print">("idle");
  const submitLockRef = useRef(false);
  const completedRef = useRef(false);
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const update = (k: keyof CheckoutForm, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const paymentOptions = isComplete
    ? ["PIX", "Débito", "Crédito 5x sem juros"]
    : ["PIX", "Débito", "Crédito 3x sem juros"];

  useEffect(() => {
    if (!paymentOptions.includes(form.pagamento)) {
      setForm((p) => ({ ...p, pagamento: paymentOptions[0] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  const ECOBAG_PRICE = 70;
  const [addEcobag, setAddEcobag] = useState(false);
  const ecobagFree = isComplete;
  const ecobagEligible = !isComplete && items.length >= 4;
  const ecobagHalfOff = ecobagEligible && addEcobag;
  const ecobagIncluded = ecobagFree || ecobagHalfOff;
  const ecobagValor = ecobagFree ? 0 : ecobagHalfOff ? ECOBAG_PRICE * 0.5 : 0;

  useEffect(() => {
    if (!ecobagEligible && addEcobag) setAddEcobag(false);
  }, [ecobagEligible, addEcobag]);


  const isFortaleza = form.regiao === "fortaleza";
  const isBrasil =
    form.regiao === "fortaleza" ||
    form.regiao === "metropolitana" ||
    form.regiao === "brasil";
  const totalComEcobag = total + ecobagValor;
  const freteGratis = isBrasil && totalComEcobag >= 500;
  const fretePago = isFortaleza && totalComEcobag < 500;
  const freteValor = fretePago ? 10 : 0;
  const totalComFrete = totalComEcobag + freteValor;
  const freteLabel = freteGratis
    ? "Grátis (pedido acima de R$ 500)"
    : isFortaleza
      ? "R$ 10,00 (Fortaleza)"
      : "A calcular pela central";


  const valid =
    !!form.nome && !!form.cpf && !!form.whatsapp && !!form.email && items.length > 0;

  const buildMessage = () => {
    const regiaoLabel = REGIOES.find((r) => r.id === form.regiao)?.label ?? "";
    const lines: string[] = [];
    lines.push("Olá! Gostaria de fechar meu pedido do Seca Tudo - Larah Nobrega x Farmacia Evidence.");
    lines.push("");
    lines.push("*- DADOS DO CLIENTE -*");
    lines.push(`*Nome:* ${form.nome}`);
    lines.push(`*CPF:* ${form.cpf}`);
    lines.push(`*WhatsApp:* ${form.whatsapp}`);
    lines.push(`*E-mail:* ${form.email}`);
    lines.push(`*Regiao de entrega:* ${regiaoLabel}`);
    lines.push("");
    lines.push("*- FORMULAS SELECIONADAS -*");
    items.forEach((f) => lines.push(`- ${f.name} - ${formatBRL(f.price)}`));
    lines.push("");
    lines.push("*- RESUMO FINANCEIRO -*");
    lines.push(`*Subtotal:* ${formatBRL(subtotal)}`);
    if (savings > 0) {
      lines.push(
        `*Desconto:* ${
          isComplete ? "Protocolo completo" : `${Math.round(discount * 100)}% OFF`
        } (-${formatBRL(savings)})`
      );
    }
    lines.push(`*Total das formulas:* ${formatBRL(total)}`);
    if (ecobagIncluded) {
      lines.push(
        `*Brinde Ecobag Evidence:* ${ecobagFree ? "GRATIS (protocolo completo)" : `50% OFF - ${formatBRL(ECOBAG_PRICE * 0.5)}`}`
      );
    }
    lines.push(`*Forma de pagamento:* ${form.pagamento}`);
    if (form.regiao === "exterior") {
      lines.push("*Entrega:* Envio internacional - frete calculado pela central");
    } else if (freteGratis) {
      lines.push("*Entrega:* Gratis (pedido acima de R$ 500 em todo o Brasil)");
      if (ecobagIncluded) lines.push(`*Total do pedido:* ${formatBRL(totalComEcobag)}`);
    } else if (isFortaleza) {
      lines.push("*Entrega:* Taxa de R$ 10,00 (Fortaleza)");
      lines.push(`*Total com entrega:* ${formatBRL(totalComFrete)}`);
    } else if (form.regiao === "metropolitana") {
      lines.push("*Entrega:* Eusebio / Maranguape / Caucaia - frete calculado pela central");
    } else {
      lines.push("*Entrega:* Envio para o Brasil - frete calculado pela central");
    }
    lines.push("");
    lines.push("Pode confirmar meu pedido, por favor?");
    return lines.join("\n");
  };

  const whatsappUrl = useMemo(() => {
    if (!valid) return "#";
    const msg = encodeURIComponent(buildMessage());
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  }, [valid, form, items, subtotal, total, savings, discount, isComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-navy-deep/60 backdrop-blur-sm animate-fade-up">
      <div className="w-full max-w-2xl max-h-[95vh] overflow-y-auto bg-background rounded-t-3xl md:rounded-3xl shadow-luxe">
        <div className="sticky top-0 bg-background/95 backdrop-blur-xl border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold">Checkout</p>
            <h3 className="font-display text-2xl text-navy">Seu pedido</h3>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition text-navy"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <section className="rounded-2xl bg-secondary/60 p-5 space-y-2">
            {items.map((f) => (
              <div key={f.id} className="flex justify-between text-sm">
                <span className="text-navy">{f.name}</span>
                <span className="text-muted-foreground tabular-nums">
                  {formatBRL(f.price)}
                </span>
              </div>
            ))}
            <div className="border-t border-border my-3" />
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatBRL(subtotal)}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between text-sm text-gold">
                <span>
                  {isComplete ? "Protocolo completo" : `Desconto ${Math.round(discount * 100)}%`}
                </span>
                <span className="tabular-nums">− {formatBRL(savings)}</span>
              </div>
            )}
            {ecobagIncluded && (
              <div className="flex justify-between text-sm text-gold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" />
                  Ecobag Evidence {ecobagFree ? "(brinde)" : "(50% OFF)"}
                </span>
                <span className="tabular-nums">
                  {ecobagFree ? "Grátis" : `+ ${formatBRL(ECOBAG_PRICE * 0.5)}`}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-navy">Entrega</span>
              <span className="tabular-nums text-navy">
                {fretePago ? formatBRL(10) : freteLabel}
              </span>
            </div>
            <div className="flex justify-between font-display text-xl pt-2 text-navy">
              <span>Total</span>
              <span className="tabular-nums">
                {formatBRL(isFortaleza ? totalComFrete : totalComEcobag)}
                {!isFortaleza && !freteGratis && (
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-sans text-right">
                    + frete a calcular
                  </span>
                )}
              </span>
            </div>

          </section>

          {ecobagEligible && (
            <section className="rounded-2xl border-2 border-gold/50 bg-gradient-to-br from-gold/10 to-transparent p-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addEcobag}
                  onChange={(e) => setAddEcobag(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-gold flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-1">Brinde opcional</p>
                  <p className="font-display text-lg text-navy leading-tight">
                    Quero adicionar a Ecobag Evidence com 50% OFF
                  </p>
                  <p className="mt-1.5 text-sm text-navy/80 leading-relaxed">
                    Como você está levando 4 ou mais fórmulas, pode incluir a ecobag exclusiva por{" "}
                    <strong className="text-navy">{formatBRL(ECOBAG_PRICE * 0.5)}</strong>{" "}
                    <span className="text-muted-foreground line-through">{formatBRL(ECOBAG_PRICE)}</span>.
                    Edição limitada a 60 unidades.
                  </p>
                </div>
              </label>
            </section>
          )}


          <section className="rounded-2xl border-2 border-gold/50 bg-gradient-to-br from-gold/10 to-transparent p-5">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="h-4 w-4 text-navy" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-1">Entrega</p>
                <p className="font-display text-lg text-navy leading-tight">
                  Entrega grátis em todo o Brasil acima de R$ 500
                </p>
                <p className="mt-1.5 text-sm text-navy/80 leading-relaxed">
                  Abaixo desse valor, taxa fixa de <strong>R$ 10,00</strong> para Fortaleza.
                  Para <strong>Eusébio, Maranguape, Caucaia</strong> e demais cidades do Brasil,
                  o frete é calculado pela central.
                  Enviamos também para o <strong>exterior</strong>.
                </p>
              </div>
            </div>
          </section>

          {!isComplete && (
            <div className="rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm text-navy flex gap-3 items-start">
              <Sparkles className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
              <p>
                <strong>Feche o protocolo completo</strong> e parcele em até{" "}
                <strong>5x sem juros</strong>, com manipulação prioritária.
              </p>
            </div>
          )}

          <section className="space-y-4">
            <h4 className="font-display text-lg text-navy">Seus dados</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Nome completo" value={form.nome} onChange={(v) => update("nome", v)} className="sm:col-span-2" />
              <Field label="CPF" value={form.cpf} onChange={(v) => update("cpf", v)} />
              <Field label="WhatsApp" value={form.whatsapp} onChange={(v) => update("whatsapp", v)} />
              <Field label="E-mail" type="email" value={form.email} onChange={(v) => update("email", v)} className="sm:col-span-2" />
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="font-display text-lg text-navy">Região de entrega</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {REGIOES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => update("regiao", r.id)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    form.regiao === r.id
                      ? "border-gold bg-gold/10 ring-gold-line"
                      : "border-border bg-card hover:bg-secondary"
                  }`}
                >
                  <p className="text-sm font-medium text-navy">{r.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{r.hint}</p>
                </button>
              ))}
            </div>
          </section>


          <section className="space-y-4">
            <h4 className="font-display text-lg text-navy">Pagamento</h4>
            <div className="grid grid-cols-3 gap-3">
              {paymentOptions.map((p) => (
                <button
                  key={p}
                  onClick={() => update("pagamento", p)}
                  className={`rounded-2xl border px-3 py-4 text-xs sm:text-sm font-medium transition text-center leading-tight ${
                    form.pagamento === p
                      ? "border-gold bg-gold/10 text-navy ring-gold-line"
                      : "border-border bg-card text-navy hover:bg-secondary"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </section>

          <button
            type="button"
            disabled={!valid || pdfBusy !== "idle"}
            onClick={async (e) => {
              e.preventDefault();

              if (!valid || pdfBusy !== "idle" || submitLockRef.current || completedRef.current) {
                return;
              }

              submitLockRef.current = true;
              setPdfBusy("download");

              let waWindow: Window | null = null;

              try {
                const finalTotal = isFortaleza ? totalComFrete : totalComEcobag;
                const discountAmount = savings > 0 ? savings : 0;

                const orderItemsPayload = items.map((item) => ({
                  product_id: item.id,
                  product_name: item.name,
                  quantity: 1,
                  price: Number(item.price),
                  unit_price: Number(item.price),
                  total_price: Number(item.price),
                }));

                const orderRes = await fetch("/api/public/create-order", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    idempotency_key: idempotencyKeyRef.current,
                    customer_name: form.nome,
                    customer_cpf: form.cpf,
                    customer_phone: form.whatsapp,
                    customer_email: form.email || null,
                    payment_method: form.pagamento,
                    region: form.regiao,
                    subtotal,
                    discount: discountAmount,
                    total: finalTotal,
                    items: orderItemsPayload,
                  }),
                });

                const orderResult = (await orderRes.json()) as {
                  ok?: boolean;
                  order_id?: string;
                  error?: string;
                };

                if (!orderRes.ok || !orderResult.order_id) {
                  console.error("Erro ao salvar pedido:", orderResult);
                  alert(
                    orderResult.error ??
                      "Erro ao salvar pedido. Tente novamente em alguns instantes.",
                  );
                  return;
                }

                const orderId = orderResult.order_id;

                waWindow = window.open(whatsappUrl, "_blank");

                try {
                  const { blob, filename } = await generateProtocolPdf({
                    patientName: form.nome,
                    patientCpf: form.cpf,
                    patientPhone: form.whatsapp,
                    patientEmail: form.email,
                    formulas: items,
                  });

                  const pdfBase64 = await blobToBase64(blob);

                  await fetch("/api/public/submit-protocol", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      order_id: orderId,
                      patient_name: form.nome,
                      patient_cpf: form.cpf,
                      patient_phone: form.whatsapp,
                      patient_email: form.email || null,
                      formulas: items.map((f) => ({
                        id: f.id,
                        name: f.name,
                        price: f.price,
                        composition: f.formula,
                        posology: f.posology,
                      })),
                      wants_ecobag: addEcobag,
                      payment_method: form.pagamento,
                      region: form.regiao,
                      subtotal,
                      discount: discountAmount,
                      total: finalTotal,
                      pdf_base64: pdfBase64,
                      pdf_filename: filename,
                    }),
                  }).catch((err) => console.error("Protocol submit failed", err));
                } catch (pdfErr) {
                  console.error("PDF generation/submit failed", pdfErr);
                }

                completedRef.current = true;
                onClose();
              } catch (err) {
                console.error(err);
                alert("Erro inesperado ao finalizar pedido.");
              } finally {
                submitLockRef.current = false;
                if (!completedRef.current) {
                  setPdfBusy("idle");
                }

                if (!waWindow && valid) {
                  window.location.href = whatsappUrl;
                }
              }
            }}
            className={`btn-pill btn-pill-navy w-full text-center ${!valid || pdfBusy !== "idle" ? "opacity-40 pointer-events-none" : ""}`}
          >
            {pdfBusy !== "idle" ? "Enviando…" : "Enviar pedido para a central"}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Seu pedido será encaminhado via WhatsApp à Farmácia Evidence.
          </p>

        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-1.5">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition"
      />
    </label>
  );
}
