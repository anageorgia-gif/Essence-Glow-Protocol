import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as jsPDF } from "../_libs/jspdf.mjs";
import { h as html2canvas } from "../_libs/html2canvas-pro.mjs";
import { s as supabase } from "./client-DZhUyplX.mjs";
import { q as Sparkles, p as ShoppingBag, r as Star, I as Instagram, b as ArrowRight, A as Activity, i as Flame, a as Apple, l as Moon, f as Droplets, L as Leaf, H as Heart, C as Check, M as Minus, n as Plus, X } from "../_libs/lucide-react.mjs";
import "fs";
import "path";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/dompurify.mjs";
import "../_libs/canvg.mjs";
import "../_libs/core-js.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/raf.mjs";
import "../_libs/performance-now.mjs";
import "../_libs/rgbcolor.mjs";
import "../_libs/svg-pathdata.mjs";
import "../_libs/stackblur-canvas.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const letterhead = "/assets/letterhead-DcX1hkqK.jpg";
function todayLong() {
  const months = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro"
  ];
  const d = /* @__PURE__ */ new Date();
  return `Fortaleza – CE, ${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}
function objectiveFor(formulas) {
  const ids = new Set(formulas.map((f) => f.id));
  const goals = [];
  if (ids.has("termogenico")) goals.push("estímulo do metabolismo e queima de gordura");
  if (ids.has("boca-fechada")) goals.push("controle do apetite e da compulsão alimentar");
  if (ids.has("basico")) goals.push("suporte imunológico e equilíbrio nutricional");
  if (ids.has("sono")) goals.push("melhora da qualidade do sono e recuperação noturna");
  if (ids.has("cabelo")) goals.push("fortalecimento de cabelos, pele e unhas");
  if (ids.has("lipedema-manha") || ids.has("lipedema-noite"))
    goals.push("redução do inchaço, suporte circulatório e ação anti-inflamatória");
  const base = "Este plano personalizado de suplementação tem como finalidade promover ";
  if (goals.length === 0)
    return base + "o bem-estar integral, o equilíbrio metabólico e a saúde geral da paciente.";
  if (goals.length === 1) return base + goals[0] + ".";
  return base + goals.slice(0, -1).join(", ") + " e " + goals[goals.length - 1] + ", de forma integrada à rotina da paciente.";
}
function buildHtml(input, letterheadDataUrl) {
  const nutri = input.nutritionist ?? { name: "Larah Nóbrega", crn: "CRN 6197CE" };
  const formulasHtml = input.formulas.map(
    (f, i) => `
        <section class="formula">
          <header>
            <span class="badge">Fórmula ${String(i + 1).padStart(2, "0")}</span>
            <h3>${escapeHtml(f.name)}</h3>
          </header>
          <div class="block">
            <p class="label">Composição</p>
            <ul class="composition">
              ${f.formula.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}
            </ul>
          </div>
          <div class="block">
            <p class="label">Posologia e horários</p>
            <p class="body">${escapeHtml(f.posology)}</p>
          </div>
        </section>`
  ).join("");
  return `
  <div id="pdf-root" style="font-family: 'Poppins', 'Helvetica Neue', sans-serif;">
    <style>
      #pdf-root, #pdf-root * { box-sizing: border-box; }
      .page {
        position: relative;
        width: 794px;       /* A4 @ 96dpi */
        min-height: 1123px;
        background-image: url('${letterheadDataUrl}');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-color: #ffffff;
        padding: 200px 70px 170px 70px;
        color: #0f1b3d;
        -webkit-print-color-adjust: exact;
      }
      .page + .page { margin-top: 24px; }
      .meta {
        display: flex;
        justify-content: flex-end;
        font-size: 11px;
        color: #6b6f7a;
        letter-spacing: 0.04em;
        margin-bottom: 18px;
      }
      .title-block {
        text-align: center;
        margin-bottom: 28px;
      }
      .eyebrow {
        font-size: 10px;
        letter-spacing: 0.42em;
        color: #b9974a;
        text-transform: uppercase;
        font-weight: 600;
      }
      h1 {
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        font-size: 28px;
        letter-spacing: 0.18em;
        margin: 10px 0 6px;
        color: #0f1b3d;
      }
      h2 {
        font-family: 'Poppins', sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #555a6a;
        margin: 0;
        letter-spacing: 0.06em;
      }
      .rule {
        width: 60px;
        height: 2px;
        background: #b9974a;
        margin: 14px auto 0;
        border-radius: 2px;
      }
      .section-title {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.32em;
        text-transform: uppercase;
        color: #b9974a;
        margin: 22px 0 10px;
      }
      .card {
        border: 1px solid #e6e0d2;
        border-radius: 14px;
        padding: 18px 22px;
        background: #fbf9f5;
        font-size: 12.5px;
        line-height: 1.55;
      }
      .patient-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px 22px;
      }
      .patient-grid .label { color: #8a8f9c; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; }
      .patient-grid .value { color: #0f1b3d; font-weight: 500; font-size: 13px; margin-bottom: 6px; }
      .objective p { margin: 0; font-size: 12.5px; line-height: 1.6; color: #2a2f3d; }
      .formula {
        page-break-inside: avoid;
        border: 1px solid #e6e0d2;
        border-radius: 14px;
        padding: 18px 22px;
        margin-bottom: 14px;
        background: #ffffff;
      }
      .formula header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 10px; }
      .formula .badge {
        font-size: 9px;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: #b9974a;
        font-weight: 600;
      }
      .formula h3 {
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        font-size: 15px;
        color: #0f1b3d;
        margin: 0;
      }
      .formula .label {
        font-size: 9.5px;
        letter-spacing: 0.24em;
        text-transform: uppercase;
        color: #8a8f9c;
        margin: 8px 0 4px;
      }
      .formula .composition {
        margin: 0; padding-left: 16px;
        font-size: 12px; line-height: 1.5; color: #2a2f3d;
      }
      .formula .body { margin: 0; font-size: 12px; color: #2a2f3d; line-height: 1.55; }
      .signature {
        margin-top: 42px;
        text-align: center;
      }
      .sig-line {
        margin: 0 auto 8px;
        width: 280px;
        border-top: 1px solid #0f1b3d;
      }
      .sig-name { font-weight: 600; font-size: 13px; color: #0f1b3d; letter-spacing: 0.04em; }
      .sig-role { font-size: 11px; color: #6b6f7a; letter-spacing: 0.16em; text-transform: uppercase; margin-top: 2px; }
    </style>
    <article class="page">
      <div class="meta">${escapeHtml(todayLong())}</div>
      <div class="title-block">
        <p class="eyebrow">Evidence · Larah Nóbrega</p>
        <h1>PROTOCOLO SECA TUDO</h1>
        <h2>Plano Personalizado de Suplementação</h2>
        <div class="rule"></div>
      </div>

      <p class="section-title">Paciente</p>
      <div class="card patient-grid">
        <div>
          <div class="label">Nome completo</div>
          <div class="value">${escapeHtml(input.patientName)}</div>
        </div>
        <div>
          <div class="label">CPF</div>
          <div class="value">${escapeHtml(input.patientCpf)}</div>
        </div>
        <div>
          <div class="label">Telefone</div>
          <div class="value">${escapeHtml(input.patientPhone)}</div>
        </div>
        ${input.patientEmail ? `<div><div class="label">E-mail</div><div class="value">${escapeHtml(input.patientEmail)}</div></div>` : ""}
      </div>

      <p class="section-title">Objetivo do protocolo</p>
      <div class="card objective"><p>${escapeHtml(objectiveFor(input.formulas))}</p></div>

      <p class="section-title">Fórmulas prescritas</p>
      ${formulasHtml}

      <div class="signature">
        <div class="sig-line"></div>
        <div class="sig-name">${escapeHtml(nutri.name)}</div>
        <div class="sig-role">Nutricionista responsável · ${escapeHtml(nutri.crn)}</div>
      </div>
    </article>
  </div>`;
}
async function ensurePoppinsLoaded() {
  try {
    if (document.fonts && document.fonts.load) {
      await Promise.all([
        // @ts-ignore
        document.fonts.load("400 12px Poppins"),
        // @ts-ignore
        document.fonts.load("600 14px Poppins")
      ]);
    }
  } catch {
  }
}
async function generateProtocolPdf(input) {
  const letterheadDataUrl = await imageToDataUrl(letterhead);
  await ensurePoppinsLoaded();
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-10000px";
  container.style.left = "0";
  container.style.width = "794px";
  container.style.background = "#fff";
  container.innerHTML = buildHtml(input, letterheadDataUrl);
  document.body.appendChild(container);
  try {
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageWidthMm = 210;
    const pageHeightMm = 297;
    const pages = container.querySelectorAll(".page");
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, 0, pageWidthMm, pageHeightMm, void 0, "FAST");
    }
    const safeName = input.patientName.replace(/[^a-zA-Z0-9-_ ]/g, "").trim().replace(/\s+/g, "_");
    const filename = `Protocolo_Seca_Tudo_${safeName || "Paciente"}.pdf`;
    const blob = pdf.output("blob");
    return { blob, filename };
  } finally {
    document.body.removeChild(container);
  }
}
const heroImg = "/assets/hero-BeVDCqw0.jpg";
const evidenceLogo = "/assets/evidence-logo-AfNEzCuy.png";
const ecobagLifestyle1 = "/assets/ecobag-lifestyle-1-BUXRciFA.png";
const termogenicoImg = "/assets/termogenico-4J60jSXM.jpg";
const bocaImg = "/assets/boca-fechada-CCIIqPgi.jpg";
const basicoImg = "/assets/basico-CEp8Yb4z.jpg";
const sonoImg = "/assets/sono-DPMZOhsn.jpg";
const cabeloImg = "/assets/cabelo-BiiGVRt9.jpg";
const lipManhaImg = "/assets/lipedema-manha-DqU4zhKS.jpg";
const lipNoiteImg = "/assets/lipedema-noite-t0Lw1Buj.jpg";
function getDiscount(count) {
  if (count >= 7) return 0.3;
  if (count >= 3) return 0.2;
  if (count >= 2) return 0.1;
  return 0;
}
function nextThreshold(count) {
  if (count < 2) return { needed: 2 - count, nextLabel: "10% OFF" };
  if (count < 3) return { needed: 3 - count, nextLabel: "20% OFF" };
  if (count < 7) return { needed: 7 - count, nextLabel: "30% OFF — protocolo completo" };
  return null;
}
const COMPLETE_PROTOCOL_PRICE = 889.9;
const WHATSAPP_NUMBER = "558592352755";
const fallbackImages = {
  termogenico: termogenicoImg,
  "boca-fechada": bocaImg,
  basico: basicoImg,
  sono: sonoImg,
  cabelo: cabeloImg,
  "lipedema-manha": lipManhaImg,
  "lipedema-noite": lipNoiteImg
};
const benefits = [{
  icon: Activity,
  label: "Mais disposição"
}, {
  icon: Flame,
  label: "Auxílio metabólico"
}, {
  icon: Apple,
  label: "Controle da compulsão"
}, {
  icon: Moon,
  label: "Melhora do sono"
}, {
  icon: Droplets,
  label: "Redução do inchaço"
}, {
  icon: Sparkles,
  label: "Pele, cabelo e unhas"
}, {
  icon: Leaf,
  label: "Sensação de leveza"
}, {
  icon: Heart,
  label: "Autocuidado diário"
}];
const formatBRL = (n) => n.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL"
});
function useAnimatedNumber(value, duration = 700) {
  const [display, setDisplay] = reactExports.useState(value);
  const fromRef = reactExports.useRef(value);
  const startRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const from = display;
    fromRef.current = from;
    startRef.current = null;
    let raf = 0;
    const step = (t) => {
      if (startRef.current === null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (value - from) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return display;
}
function Index() {
  const [formulas, setFormulas] = reactExports.useState([]);
  const [faqs, setFaqs] = reactExports.useState([]);
  const [loadingFormulas, setLoadingFormulas] = reactExports.useState(true);
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [checkoutOpen, setCheckoutOpen] = reactExports.useState(false);
  const [unlockMsg, setUnlockMsg] = reactExports.useState(null);
  const prevDiscountRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    loadProducts();
    loadFaqs();
  }, []);
  async function loadProducts() {
    setLoadingFormulas(true);
    const {
      data,
      error
    } = await supabase.from("products").select("*").eq("active", true).order("sort_order", {
      ascending: true
    });
    if (error) {
      console.error(error);
      setLoadingFormulas(false);
      return;
    }
    const mapped = (data ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price ?? 0),
      image: p.image_url || fallbackImages[p.id] || "",
      description: p.description ?? "",
      benefits: p.benefits ?? [],
      posology: p.posology ?? "",
      formula: p.formula ?? []
    }));
    setFormulas(mapped);
    setLoadingFormulas(false);
  }
  async function loadFaqs() {
    const {
      data,
      error
    } = await supabase.from("faqs").select("*").eq("active", true).order("sort_order", {
      ascending: true
    });
    if (error) {
      console.error(error);
      return;
    }
    setFaqs(data ?? []);
  }
  const toggle = (id) => setSelected((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const selectAll = () => {
    setSelected(new Set(formulas.map((f) => f.id)));
    setTimeout(() => {
      document.getElementById("formulas")?.scrollIntoView({
        behavior: "smooth"
      });
    }, 50);
  };
  const items = reactExports.useMemo(() => formulas.filter((f) => selected.has(f.id)), [formulas, selected]);
  const subtotal = items.reduce((s, f) => s + f.price, 0);
  const isComplete = formulas.length > 0 && items.length === formulas.length;
  const discount = getDiscount(items.length);
  const total = isComplete ? COMPLETE_PROTOCOL_PRICE : subtotal * (1 - discount);
  const savings = subtotal - total;
  const threshold = nextThreshold(items.length);
  reactExports.useEffect(() => {
    if (discount > prevDiscountRef.current) {
      const label = isComplete ? "Protocolo completo desbloqueado ✦" : `${Math.round(discount * 100)}% OFF desbloqueado ✦`;
      setUnlockMsg(label);
      const t = setTimeout(() => setUnlockMsg(null), 2600);
      prevDiscountRef.current = discount;
      return () => clearTimeout(t);
    }
    prevDiscountRef.current = discount;
  }, [discount, isComplete]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { count: items.length, onCheckout: () => setCheckoutOpen(true) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(IntroBand, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Benefits, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DiscountSection, { onSelectAll: selectAll }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Comparison, { formulas, subtotal, total, savings, isComplete, count: items.length, onSelectAll: selectAll }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ExclusividadeEvidence, { onSelectAll: selectAll }),
    loadingFormulas ? /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 text-center text-muted-foreground", children: "Carregando fórmulas..." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FormulaSection, { formulas, selected, toggle, threshold, items }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FAQ, { faqs }),
    items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(StickyBar, { count: items.length, subtotal, total, savings, discount, isComplete, onCheckout: () => setCheckoutOpen(true) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EvidenceFooter, {}),
    unlockMsg && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed left-1/2 top-20 z-50 animate-unlock pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-full bg-gradient-gold text-navy px-6 py-3 shadow-gold flex items-center gap-2 text-sm font-medium tracking-wide", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
      unlockMsg
    ] }) }, unlockMsg),
    checkoutOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(CheckoutModal, { items, subtotal, total, savings, discount, isComplete, onClose: () => setCheckoutOpen(false) })
  ] });
}
function Header({
  count,
  onCheckout
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-30 backdrop-blur-xl bg-navy/95 border-b border-gold/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-5 py-3 flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: evidenceLogo, alt: "Farmácia Evidence — Manipulação Farmacêutica", className: "h-8 md:h-9 w-auto" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onCheckout, disabled: count === 0, className: "relative inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-gold/15 disabled:opacity-40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4 text-gold" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: count }),
      count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-gold ring-2 ring-navy" })
    ] })
  ] }) });
}
function Hero() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden bg-gradient-navy text-navy-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 topo-pattern opacity-60", "aria-hidden": true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-6xl px-5 pt-10 pb-16 md:pt-20 md:pb-28 grid md:grid-cols-[0.95fr_1.05fr] gap-10 md:gap-14 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-up text-center md:text-left order-2 md:order-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-1.5 mb-6 justify-center md:justify-start", children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 fill-gold text-gold" }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-2 font-display text-4xl sm:text-5xl md:text-6xl leading-[1.02] text-white tracking-tight", children: [
          "Te mostro o poder do",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "not-italic text-gold", children: "BÁSICO BEM FEITO" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto md:mx-0 mt-6 h-px w-20 bg-gradient-to-r from-transparent via-gold to-transparent md:bg-gradient-to-l" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-base sm:text-lg text-navy-foreground/80 max-w-md mx-auto md:mx-0 text-balance leading-relaxed", children: "Fórmulas manipuladas desenvolvidas por Larah Nóbrega em parceria com a Farmácia Evidence — para potencializar seus resultados." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 flex items-center gap-4 justify-center md:justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl text-white leading-tight", children: "Larah Nóbrega" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.3em] text-gold mt-1", children: "Nutricionista · CRN 6197CE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://www.instagram.com/larahnobreganutri/?hl=pt-br", target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1.5 mt-2 text-xs text-navy-foreground/70 hover:text-gold transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "h-3.5 w-3.5" }),
            "@larahnobreganutri"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#formulas", className: "btn-pill btn-pill-gold group", children: [
            "Montar meu protocolo",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 transition group-hover:translate-x-0.5" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#descontos", className: "btn-pill border border-white/20 text-navy-foreground hover:bg-white/5", children: "Ver descontos" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative animate-fade-up order-1 md:order-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-3 rounded-[2.25rem] bg-gradient-gold opacity-25 blur-3xl", "aria-hidden": true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative aspect-[4/5] overflow-hidden rounded-[1.75rem] ring-1 ring-gold/40 shadow-luxe", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroImg, alt: "Seca Tudo — Edição Pré-Copa e Pré-Férias com Larah Nóbrega", className: "h-full w-full object-cover", width: 1066, height: 1332 }) })
      ] })
    ] })
  ] });
}
function IntroBand() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-gradient-gold text-navy py-16 md:py-20 relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-25", "aria-hidden": true, style: {
      backgroundImage: "repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0 1px, transparent 1px 24px)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-3xl px-5 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.4em] text-navy/70 mb-5", children: "Manifesto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-2xl sm:text-3xl leading-snug text-balance", children: [
        "Eu e a ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "not-italic underline decoration-navy/30 underline-offset-4", children: "Farmácia Evidence" }),
        " ",
        "acreditamos que cuidar da saúde deve ser algo leve e alinhado ao seu momento. Por isso preparamos uma condição especial para facilitar sua jornada — com um incentivo extra para quem optar pelo protocolo completo."
      ] })
    ] })
  ] });
}
function Benefits() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "beneficios", className: "py-20 md:py-28", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.4em] text-gold", children: "Por que esse protocolo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 font-display text-4xl md:text-5xl text-balance text-navy", children: "Cuidado completo, do interior à pele." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5", children: benefits.map(({
      icon: Icon,
      label
    }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      animationDelay: `${i * 60}ms`
    }, className: "animate-fade-up group rounded-2xl bg-card border border-border/70 p-5 md:p-6 transition-all duration-500 hover:shadow-soft hover:-translate-y-1 hover:border-gold/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-navy text-gold transition group-hover:scale-105", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5", strokeWidth: 1.5 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-sm md:text-[15px] font-medium leading-snug text-navy", children: label })
    ] }, label)) })
  ] }) });
}
function ExclusividadeEvidence({
  onSelectAll
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "exclusividade", className: "relative py-20 md:py-28 overflow-hidden", style: {
    backgroundColor: "oklch(0.96 0.018 85)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": true, className: "pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-40 blur-3xl", style: {
      background: "radial-gradient(circle, color-mix(in oklab, var(--gold) 30%, transparent), transparent 70%)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": true, className: "pointer-events-none absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full opacity-30 blur-3xl", style: {
      background: "radial-gradient(circle, color-mix(in oklab, var(--navy) 25%, transparent), transparent 70%)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-auto max-w-7xl px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-12 lg:gap-20 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur border border-gold/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.32em] text-gold shadow-soft", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
          " Exclusividade Evidence"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-6 font-display text-4xl md:text-5xl lg:text-6xl text-navy leading-[1.05] tracking-tight text-balance", children: [
          "Sua transformação ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold italic", children: "merece um presente" }),
          " exclusivo"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-base md:text-lg text-navy/70 leading-relaxed max-w-xl", children: [
          "Ao concluir o ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-navy", children: "Protocolo Seca Tudo" }),
          ", você recebe uma ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-navy", children: "Ecobag Evidence" }),
          " exclusiva para acompanhar sua rotina com elegância e praticidade."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-8 space-y-3.5 text-sm md:text-base text-navy/85 animate-fade-up", style: {
          animationDelay: "150ms"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 border border-gold/40 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-gold" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-navy", children: "Ecobag gratuita" }),
              " no protocolo completo"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 border border-gold/40 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-gold" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-navy", children: "50% OFF na ecobag" }),
              " ao comprar 4 fórmulas"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 border border-gold/40 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-gold" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Apenas ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-navy", children: "60 unidades" }),
              " disponíveis"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-col sm:flex-row sm:items-center gap-4 animate-fade-up", style: {
          animationDelay: "300ms"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onSelectAll, className: "btn-pill btn-pill-navy hover:scale-[1.03] transition-transform", children: [
            "Quero garantir minha ecobag",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-navy/55 max-w-[16rem]", children: "*Brinde aplicado automaticamente ao fechar o protocolo completo." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative animate-fade-up", style: {
        animationDelay: "200ms"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl shadow-luxe ring-gold-line aspect-[4/5] bg-navy/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: ecobagLifestyle1, alt: "Mulher carregando a Ecobag Evidence — Protocolo Seca Tudo", className: "absolute inset-0 h-full w-full object-cover animate-slow-zoom", width: 1024, height: 1280, loading: "lazy" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": true, className: "absolute inset-0", style: {
            background: "linear-gradient(180deg, transparent 55%, color-mix(in oklab, var(--navy) 35%, transparent))"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-white/85 backdrop-blur px-4 py-3 shadow-soft", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] uppercase tracking-[0.3em] text-gold", children: "Edição limitada" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-navy mt-0.5", children: "Ecobag Evidence" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-navy text-navy-foreground text-[10px] uppercase tracking-[0.25em] px-3.5 py-1.5 shadow-soft", children: "60 unidades" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex absolute -bottom-6 -left-6 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-luxe border border-gold/30 animate-float-soft", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 border border-gold/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-gold" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.25em] text-navy/60", children: "Brinde exclusivo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-navy", children: "Grátis no protocolo completo" })
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
function DiscountSection({
  onSelectAll
}) {
  const tiers = [{
    qty: "2 fórmulas",
    off: "10%"
  }, {
    qty: "3 a 5 fórmulas",
    off: "20%"
  }, {
    qty: "7 fórmulas",
    off: "30%"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "descontos", className: "relative py-20 md:py-28 bg-gradient-navy text-navy-foreground overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 topo-pattern opacity-60", "aria-hidden": true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-6xl px-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-2xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.4em] text-gold", children: "Descontos progressivos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 font-display text-4xl md:text-5xl text-balance", children: "Quanto mais completo, maior a economia." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-14 grid md:grid-cols-3 gap-4", children: tiers.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        animationDelay: `${i * 100}ms`
      }, className: "animate-fade-up rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 text-center transition hover:border-gold/40 hover:-translate-y-1 duration-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.35em] text-gold-soft/80", children: t.qty }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 font-display text-7xl text-white", children: t.off }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[10px] uppercase tracking-[0.3em] text-navy-foreground/60", children: "de desconto" })
      ] }, t.qty)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 relative rounded-3xl bg-gradient-gold p-8 md:p-12 text-center text-gold-foreground shadow-gold overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-20", "aria-hidden": true, style: {
          backgroundImage: "repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0 1px, transparent 1px 24px)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative inline-flex items-center gap-2 rounded-full bg-navy px-3.5 py-1.5 text-[10px] uppercase tracking-[0.3em] text-gold animate-pulse-gold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
          " Manipulação prioritária"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "relative mt-4 text-[10px] uppercase tracking-[0.4em]", children: "Protocolo completo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "relative mt-3 font-display text-3xl md:text-5xl", children: [
          "7 fórmulas por ",
          formatBRL(COMPLETE_PROTOCOL_PRICE)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "relative mt-2 text-sm font-medium", children: [
          "ou em até ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "5x sem juros" }),
          " no cartão."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "relative mt-4 text-sm opacity-85 max-w-md mx-auto", children: [
          "Feche agora o protocolo completo e ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "entre na fila prioritária de manipulação" }),
          " — suas fórmulas ficam prontas o quanto antes para você começar com tudo."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onSelectAll, className: "relative btn-pill btn-pill-navy mt-6", children: "Quero o protocolo completo agora" })
      ] })
    ] })
  ] });
}
function FormulaSection({
  formulas,
  selected,
  toggle,
  threshold,
  items
}) {
  const progress = formulas.length > 0 ? Math.min(items.length / formulas.length, 1) * 100 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "formulas", className: "py-20 md:py-28 bg-secondary/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.4em] text-gold", children: "Monte seu protocolo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 font-display text-4xl md:text-5xl text-balance text-navy", children: "Escolha as fórmulas que combinam com você." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-[64px] z-20 mt-10 rounded-2xl border border-border bg-card/95 backdrop-blur-md p-4 md:p-5 shadow-soft", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-navy", children: [
          items.length,
          " ",
          items.length === 1 ? "fórmula selecionada" : "fórmulas selecionadas"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold font-medium text-right text-xs sm:text-sm", children: threshold ? `Faltam ${threshold.needed} para ${threshold.nextLabel}` : "Desconto máximo desbloqueado ✦" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-1.5 w-full rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-gold transition-all duration-700 relative", style: {
        width: `${progress}%`
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 shimmer-bar" }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6", children: formulas.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(FormulaCard, { formula: f, isSelected: selected.has(f.id), onToggle: () => toggle(f.id) }, f.id)) })
  ] }) });
}
function FormulaCard({
  formula,
  isSelected,
  onToggle
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: `group relative rounded-3xl bg-card overflow-hidden border transition-all duration-500 ${isSelected ? "border-gold shadow-luxe -translate-y-1" : "border-border/70 hover:shadow-soft hover:-translate-y-1 hover:border-gold/40"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[5/4] overflow-hidden bg-navy", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: formula.image, alt: formula.name, loading: "lazy", className: "h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy/30 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-navy", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full bg-gold" }),
        "Fórmula manipulada"
      ] }),
      isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-gold text-navy shadow-gold animate-fade-up", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4", strokeWidth: 2.5 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-5 left-5 right-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl md:text-[1.7rem] leading-tight text-white", children: formula.name }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: formula.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-5 space-y-2", children: formula.benefits.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2.5 text-sm text-navy", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-2 h-1 w-1 rounded-full bg-gold flex-shrink-0" }),
        b
      ] }, b)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "mt-5 group/details", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { className: "cursor-pointer text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-navy transition list-none flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Composição & posologia" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "transition group-open/details:rotate-90", children: "›" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-3 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-navy", children: "Posologia:" }),
            " ",
            formula.posology
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: formula.formula.map((line) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-3 bg-gold/60" }),
            line
          ] }, line)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-end justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.25em] text-muted-foreground", children: "30 dias" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl text-navy", children: formatBRL(formula.price) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onToggle, className: `btn-pill ${isSelected ? "btn-pill-outline" : "btn-pill-navy"} !py-3 !px-5 !text-[10px]`, children: isSelected ? "Remover" : "Selecionar" })
      ] })
    ] })
  ] });
}
function StickyBar({
  count,
  subtotal,
  total,
  savings,
  discount,
  isComplete,
  onCheckout
}) {
  const aTotal = useAnimatedNumber(total);
  const aSavings = useAnimatedNumber(savings);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/95 backdrop-blur-xl shadow-luxe animate-fade-up", style: {
    paddingBottom: "env(safe-area-inset-bottom)"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-navy text-[10px] text-navy-foreground font-medium tabular-nums", children: count }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
          count === 1 ? "fórmula" : "fórmulas",
          isComplete && " · Protocolo completo"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex items-baseline gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl sm:text-2xl text-navy tabular-nums", children: formatBRL(aTotal) }),
        savings > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs line-through text-muted-foreground tabular-nums", children: formatBRL(subtotal) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-medium text-navy tabular-nums", children: [
            isComplete ? "Protocolo" : `${Math.round(discount * 100)}% OFF`,
            " · −",
            formatBRL(aSavings)
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onCheckout, className: "btn-pill btn-pill-navy !py-3 !px-5 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Finalizar pedido" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Finalizar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
    ] })
  ] }) });
}
function Comparison({
  formulas,
  subtotal,
  total,
  savings,
  isComplete,
  count,
  onSelectAll
}) {
  const fullSubtotal = formulas.reduce((s, f) => s + f.price, 0);
  const fullSavings = fullSubtotal - COMPLETE_PROTOCOL_PRICE;
  const aSavings = useAnimatedNumber(savings);
  const aTotal = useAnimatedNumber(total);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "comparativo", className: "py-20 md:py-28 bg-secondary/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.4em] text-gold", children: "Comparativo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 font-display text-4xl md:text-5xl text-balance text-navy", children: "Individual ou protocolo completo?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "Veja em tempo real o quanto você economiza ao escolher o protocolo completo." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 grid md:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-card border border-border p-7 md:p-8 shadow-soft", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.32em] text-muted-foreground", children: "Sua seleção atual" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 font-display text-4xl text-navy tabular-nums", children: formatBRL(aTotal) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: count === 0 ? "Nenhuma fórmula selecionada" : `${count} ${count === 1 ? "fórmula" : "fórmulas"} · subtotal ${formatBRL(subtotal)}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 h-px bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-6 space-y-2 text-sm text-navy", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-gold" }),
            " Liberdade de combinar fórmulas"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-gold" }),
            " Descontos progressivos"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-gold" }),
            " Economia de até ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium tabular-nums", children: formatBRL(aSavings) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-3xl bg-gradient-navy text-navy-foreground p-7 md:p-8 shadow-luxe overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 topo-pattern opacity-50", "aria-hidden": true }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.32em] text-gold", children: "Protocolo completo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-gold/15 border border-gold/30 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.25em] text-gold", children: "Recomendado" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 font-display text-4xl text-white tabular-nums", children: formatBRL(COMPLETE_PROTOCOL_PRICE) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-navy-foreground/70", children: [
            "7 fórmulas · de ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-through", children: formatBRL(fullSubtotal) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 h-px bg-white/10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-6 space-y-2 text-sm text-navy-foreground/90", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-gold" }),
              " Protocolo do início ao fim"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-gold" }),
              " Maior economia: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gold tabular-nums", children: formatBRL(fullSavings) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-gold" }),
              " Em até ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gold", children: "5x sem juros" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-gold" }),
              " Manipulação prioritária"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onSelectAll, disabled: isComplete, className: "btn-pill btn-pill-gold mt-7 w-full disabled:opacity-60", children: isComplete ? "Você já escolheu" : "Quero o protocolo completo" })
        ] })
      ] })
    ] })
  ] }) });
}
function FAQ({
  faqs
}) {
  const [open, setOpen] = reactExports.useState(0);
  if (faqs.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "faq", className: "py-20 md:py-28", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.4em] text-gold", children: "Dúvidas frequentes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 font-display text-4xl md:text-5xl text-balance text-navy", children: "Tudo que você precisa saber." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 space-y-3", children: faqs.map((f, i) => {
      const isOpen = open === i;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-2xl border bg-card transition-all duration-500 ${isOpen ? "border-gold/50 shadow-soft" : "border-border hover:border-gold/30"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(isOpen ? null : i), className: "w-full flex items-center justify-between gap-4 px-5 md:px-6 py-5 text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg text-navy", children: f.question }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `flex h-8 w-8 items-center justify-center rounded-full border transition ${isOpen ? "bg-navy text-navy-foreground border-navy" : "border-border text-navy"}`, children: isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid transition-[grid-template-rows] duration-500 ease-out", style: {
          gridTemplateRows: isOpen ? "1fr" : "0fr"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-5 md:px-6 pb-5 text-sm text-muted-foreground leading-relaxed", children: f.answer }) }) })
      ] }, f.id);
    }) })
  ] }) });
}
function EvidenceFooter() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "relative bg-gradient-navy text-navy-foreground py-20 mt-12 mb-24 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 topo-pattern opacity-60", "aria-hidden": true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-3xl px-5 text-center flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: evidenceLogo, alt: "Farmácia Evidence", className: "h-16 md:h-20 w-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#formulas", className: "btn-pill btn-pill-gold mt-8", children: "Adquira suas fórmulas" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://www.instagram.com/farmaciaevidence/", target: "_blank", rel: "noopener noreferrer", className: "rounded-2xl border border-gold/25 bg-white/[0.04] p-5 hover:border-gold/60 transition group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.32em] text-gold", children: "Farmácia" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 inline-flex items-center gap-2 font-display text-lg text-white group-hover:text-gold transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "h-4 w-4" }),
            " @farmaciaevidence"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://www.instagram.com/larahnobreganutri/?hl=pt-br", target: "_blank", rel: "noopener noreferrer", className: "rounded-2xl border border-gold/25 bg-white/[0.04] p-5 hover:border-gold/60 transition group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.32em] text-gold", children: "Nutricionista" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 inline-flex items-center gap-2 font-display text-lg text-white group-hover:text-gold transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "h-4 w-4" }),
            " @larahnobreganutri"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-10 text-xs text-navy-foreground/70", children: [
        "Atendimento WhatsApp:",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `https://wa.me/${WHATSAPP_NUMBER}`, target: "_blank", rel: "noopener noreferrer", className: "text-gold hover:underline", children: "(85) 9235-2755" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[10px] uppercase tracking-[0.3em] text-navy-foreground/40", children: "Larah Nóbrega · CRN 6197CE — em parceria com a Farmácia Evidence" })
    ] })
  ] });
}
const REGIOES = [{
  id: "fortaleza",
  label: "Fortaleza",
  hint: "Taxa de R$ 10,00 · Grátis acima de R$ 500"
}, {
  id: "metropolitana",
  label: "Eusébio, Maranguape ou Caucaia",
  hint: "Frete calculado pela central"
}, {
  id: "brasil",
  label: "Outras cidades do Brasil",
  hint: "Frete calculado pela central"
}, {
  id: "exterior",
  label: "Exterior",
  hint: "Frete calculado pela central"
}];
function CheckoutModal({
  items,
  subtotal,
  total,
  savings,
  discount,
  isComplete,
  onClose
}) {
  const [form, setForm] = reactExports.useState({
    nome: "",
    cpf: "",
    whatsapp: "",
    email: "",
    pagamento: "PIX",
    regiao: "fortaleza"
  });
  const [pdfBusy, setPdfBusy] = reactExports.useState("idle");
  reactExports.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  const update = (k, v) => setForm((p) => ({
    ...p,
    [k]: v
  }));
  const paymentOptions = isComplete ? ["PIX", "Débito", "Crédito 5x sem juros"] : ["PIX", "Débito", "Crédito 3x sem juros"];
  reactExports.useEffect(() => {
    if (!paymentOptions.includes(form.pagamento)) {
      setForm((p) => ({
        ...p,
        pagamento: paymentOptions[0]
      }));
    }
  }, [isComplete]);
  const ECOBAG_PRICE = 70;
  const [addEcobag, setAddEcobag] = reactExports.useState(false);
  const ecobagFree = isComplete;
  const ecobagEligible = !isComplete && items.length >= 4;
  const ecobagHalfOff = ecobagEligible && addEcobag;
  const ecobagIncluded = ecobagFree || ecobagHalfOff;
  const ecobagValor = ecobagFree ? 0 : ecobagHalfOff ? ECOBAG_PRICE * 0.5 : 0;
  reactExports.useEffect(() => {
    if (!ecobagEligible && addEcobag) setAddEcobag(false);
  }, [ecobagEligible, addEcobag]);
  const isFortaleza = form.regiao === "fortaleza";
  const totalComEcobag = total + ecobagValor;
  const fretePago = isFortaleza && totalComEcobag < 500;
  const freteValor = fretePago ? 10 : 0;
  const totalComFrete = totalComEcobag + freteValor;
  const freteLabel = isFortaleza ? totalComEcobag >= 500 ? "Grátis (pedido acima de R$ 500)" : "R$ 10,00 (Fortaleza)" : "A calcular pela central";
  const valid = !!form.nome && !!form.cpf && !!form.whatsapp && !!form.email && items.length > 0;
  const buildMessage = () => {
    const regiaoLabel = REGIOES.find((r) => r.id === form.regiao)?.label ?? "";
    const lines = [];
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
      lines.push(`*Desconto:* ${isComplete ? "Protocolo completo" : `${Math.round(discount * 100)}% OFF`} (-${formatBRL(savings)})`);
    }
    lines.push(`*Total das formulas:* ${formatBRL(total)}`);
    if (ecobagIncluded) {
      lines.push(`*Brinde Ecobag Evidence:* ${ecobagFree ? "GRATIS (protocolo completo)" : `50% OFF - ${formatBRL(ECOBAG_PRICE * 0.5)}`}`);
    }
    lines.push(`*Forma de pagamento:* ${form.pagamento}`);
    if (isFortaleza) {
      if (totalComEcobag >= 500) {
        lines.push("*Entrega:* Gratis (pedido acima de R$ 500 em Fortaleza)");
        if (ecobagIncluded) lines.push(`*Total do pedido:* ${formatBRL(totalComEcobag)}`);
      } else {
        lines.push("*Entrega:* Taxa de R$ 10,00 (Fortaleza)");
        lines.push(`*Total com entrega:* ${formatBRL(totalComFrete)}`);
      }
    } else if (form.regiao === "metropolitana") {
      lines.push("*Entrega:* Eusebio / Maranguape / Caucaia - frete calculado pela central");
    } else if (form.regiao === "brasil") {
      lines.push("*Entrega:* Envio para o Brasil - frete calculado pela central");
    } else {
      lines.push("*Entrega:* Envio internacional - frete calculado pela central");
    }
    lines.push("");
    lines.push("Pode confirmar meu pedido, por favor?");
    return lines.join("\n");
  };
  const whatsappUrl = reactExports.useMemo(() => {
    if (!valid) return "#";
    const msg = encodeURIComponent(buildMessage());
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  }, [valid, form, items, subtotal, total, savings, discount, isComplete]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-end md:items-center justify-center bg-navy-deep/60 backdrop-blur-sm animate-fade-up", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-2xl max-h-[95vh] overflow-y-auto bg-background rounded-t-3xl md:rounded-3xl shadow-luxe", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 bg-background/95 backdrop-blur-xl border-b border-border px-6 py-4 flex items-center justify-between z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.35em] text-gold", children: "Checkout" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl text-navy", children: "Seu pedido" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition text-navy", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl bg-secondary/60 p-5 space-y-2", children: [
        items.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-navy", children: f.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground tabular-nums", children: formatBRL(f.price) })
        ] }, f.id)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border my-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: formatBRL(subtotal) })
        ] }),
        savings > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm text-gold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isComplete ? "Protocolo completo" : `Desconto ${Math.round(discount * 100)}%` }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
            "− ",
            formatBRL(savings)
          ] })
        ] }),
        ecobagIncluded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm text-gold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
            "Ecobag Evidence ",
            ecobagFree ? "(brinde)" : "(50% OFF)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: ecobagFree ? "Grátis" : `+ ${formatBRL(ECOBAG_PRICE * 0.5)}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-navy", children: "Entrega" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums text-navy", children: fretePago ? formatBRL(10) : freteLabel })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-display text-xl pt-2 text-navy", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
            isFortaleza ? formatBRL(totalComFrete) : formatBRL(totalComEcobag),
            !isFortaleza && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-sans text-right", children: "+ frete a calcular" })
          ] })
        ] })
      ] }),
      ecobagEligible && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rounded-2xl border-2 border-gold/50 bg-gradient-to-br from-gold/10 to-transparent p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-start gap-3 cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: addEcobag, onChange: (e) => setAddEcobag(e.target.checked), className: "mt-1 h-4 w-4 accent-gold flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.3em] text-gold mb-1", children: "Brinde opcional" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg text-navy leading-tight", children: "Quero adicionar a Ecobag Evidence com 50% OFF" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1.5 text-sm text-navy/80 leading-relaxed", children: [
            "Como você está levando 4 ou mais fórmulas, pode incluir a ecobag exclusiva por",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-navy", children: formatBRL(ECOBAG_PRICE * 0.5) }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground line-through", children: formatBRL(ECOBAG_PRICE) }),
            ". Edição limitada a 60 unidades."
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rounded-2xl border-2 border-gold/50 bg-gradient-to-br from-gold/10 to-transparent p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4 text-navy" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.3em] text-gold mb-1", children: "Entrega" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg text-navy leading-tight", children: "Entrega grátis em Fortaleza acima de R$ 500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1.5 text-sm text-navy/80 leading-relaxed", children: [
            "Abaixo desse valor, taxa fixa de ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "R$ 10,00" }),
            " para Fortaleza. Para ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Eusébio, Maranguape e Caucaia" }),
            ", o frete é calculado pela central. Enviamos também para ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "todo o Brasil e exterior" }),
            "."
          ] })
        ] })
      ] }) }),
      !isComplete && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm text-navy flex gap-3 items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-gold mt-0.5 flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Feche o protocolo completo" }),
          " e parcele em até",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "5x sem juros" }),
          ", com manipulação prioritária."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-lg text-navy", children: "Seus dados" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Nome completo", value: form.nome, onChange: (v) => update("nome", v), className: "sm:col-span-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "CPF", value: form.cpf, onChange: (v) => update("cpf", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "WhatsApp", value: form.whatsapp, onChange: (v) => update("whatsapp", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "E-mail", type: "email", value: form.email, onChange: (v) => update("email", v), className: "sm:col-span-2" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-lg text-navy", children: "Região de entrega" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-3", children: REGIOES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => update("regiao", r.id), className: `rounded-2xl border px-4 py-3 text-left transition ${form.regiao === r.id ? "border-gold bg-gold/10 ring-gold-line" : "border-border bg-card hover:bg-secondary"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-navy", children: r.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: r.hint })
        ] }, r.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-lg text-navy", children: "Pagamento" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: paymentOptions.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => update("pagamento", p), className: `rounded-2xl border px-3 py-4 text-xs sm:text-sm font-medium transition text-center leading-tight ${form.pagamento === p ? "border-gold bg-gold/10 text-navy ring-gold-line" : "border-border bg-card text-navy hover:bg-secondary"}`, children: p }, p)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: !valid || pdfBusy !== "idle", onClick: async (e) => {
        e.preventDefault();
        if (!valid || pdfBusy !== "idle") return;
        setPdfBusy("download");
        let waWindow = null;
        try {
          const finalTotal = isFortaleza ? totalComFrete : totalComEcobag;
          const discountAmount = savings > 0 ? savings : 0;
          const {
            data: orderData,
            error: orderError
          } = await supabase.from("orders").insert({
            customer_name: form.nome,
            customer_cpf: form.cpf,
            customer_phone: form.whatsapp,
            customer_email: form.email || null,
            payment_method: form.pagamento,
            region: form.regiao,
            subtotal,
            discount: discountAmount,
            total: finalTotal,
            status: "novo"
          }).select("id").single();
          if (orderError) {
            console.error("Erro ao salvar pedido:", orderError);
            alert("Erro ao salvar pedido: " + orderError.message);
            setPdfBusy("idle");
            return;
          }
          const orderItemsPayload = items.map((item) => ({
            order_id: orderData.id,
            product_id: item.id,
            product_name: item.name,
            quantity: 1,
            price: Number(item.price),
            unit_price: Number(item.price),
            total_price: Number(item.price)
          }));
          console.log("ORDER:", orderData);
          console.log("ORDER ITEMS PAYLOAD:", orderItemsPayload);
          const {
            error: itemsError
          } = await supabase.from("order_items").insert(orderItemsPayload);
          if (itemsError) {
            console.error("Erro ao salvar itens:", itemsError);
            alert("Erro ao salvar itens: " + itemsError.message);
            setPdfBusy("idle");
            return;
          }
          waWindow = window.open(whatsappUrl, "_blank");
          const {
            blob,
            filename
          } = await generateProtocolPdf({
            patientName: form.nome,
            patientCpf: form.cpf,
            patientPhone: form.whatsapp,
            patientEmail: form.email,
            formulas: items
          });
          const buf = await blob.arrayBuffer();
          let binary = "";
          const bytes = new Uint8Array(buf);
          const chunk = 32768;
          for (let i = 0; i < bytes.length; i += chunk) {
            binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
          }
          const pdfBase64 = btoa(binary);
          await fetch("/api/public/submit-protocol", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              order_id: orderData.id,
              patient_name: form.nome,
              patient_cpf: form.cpf,
              patient_phone: form.whatsapp,
              patient_email: form.email || null,
              formulas: items.map((f) => ({
                id: f.id,
                name: f.name,
                price: f.price,
                composition: f.formula,
                posology: f.posology
              })),
              wants_ecobag: addEcobag,
              payment_method: form.pagamento,
              region: form.regiao,
              subtotal,
              discount: discountAmount,
              total: finalTotal,
              pdf_base64: pdfBase64,
              pdf_filename: filename
            })
          }).catch((err) => console.error("Protocol submit failed", err));
          onClose();
        } catch (err) {
          console.error(err);
          alert("Erro inesperado ao finalizar pedido.");
        } finally {
          setPdfBusy("idle");
          if (!waWindow && valid) {
            window.location.href = whatsappUrl;
          }
        }
      }, className: `btn-pill btn-pill-navy w-full text-center ${!valid || pdfBusy !== "idle" ? "opacity-40 pointer-events-none" : ""}`, children: pdfBusy !== "idle" ? "Enviando…" : "Enviar pedido para a central" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: "Seu pedido será encaminhado via WhatsApp à Farmácia Evidence." })
    ] })
  ] }) });
}
function Field({
  label,
  value,
  onChange,
  type = "text",
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `block ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-1.5", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value, onChange: (e) => onChange(e.target.value), className: "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition" })
  ] });
}
export {
  Index as component
};
