import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { N as Navigate } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-DZhUyplX.mjs";
import { j as jsPDF } from "../_libs/jspdf.mjs";
import { h as html2canvas } from "../_libs/html2canvas-pro.mjs";
import { n as Plus, D as Download, o as Printer, k as LogOut, P as Package, p as ShoppingBag, F as FileSpreadsheet, e as CircleQuestionMark, s as Users, E as Eye, g as EyeOff, T as Trash2, U as Upload, S as Save, d as ChevronUp, c as ChevronDown, m as Pencil, j as LoaderCircle, h as FileText } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
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
const nutritionistStamp = "/assets/nutritionist-stamp-C6MyJt9w.png";
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: nutritionistStamp
}, Symbol.toStringTag, { value: "Module" }));
const letterhead = "/assets/letterhead-DcX1hkqK.jpg";
const COMPLETE_PROTOCOL_ITEM_COUNT = 7;
function slugify(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-+/g, "-");
}
function getPatientFirstName(fullName) {
  const trimmed = fullName.trim();
  if (!trimmed) return "Paciente";
  return trimmed.split(/\s+/)[0] ?? "Paciente";
}
function getProtocolName(itemCount, itemNames) {
  if (itemCount >= COMPLETE_PROTOCOL_ITEM_COUNT) {
    return "Protocolo Seca Tudo";
  }
  if (itemNames.length === 1) {
    return itemNames[0];
  }
  return "Protocolo Personalizado Seca Tudo";
}
function getOrderNumberLabel(pharmacyOrderNumber, orderId) {
  const pcp = pharmacyOrderNumber?.trim();
  if (pcp) return pcp;
  return `PED-${orderId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}
function buildPrescriptionFilename(opts) {
  const orderNumber = getOrderNumberLabel(opts.pharmacyOrderNumber, opts.orderId);
  const firstName = slugify(getPatientFirstName(opts.patientName)) || "Paciente";
  const protocol = slugify(getProtocolName(opts.itemCount, opts.itemNames)) || "Protocolo";
  return `${orderNumber}-${firstName}-${protocol}.pdf`;
}
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function printBlob(blob) {
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.src = url;
  iframe.onload = () => {
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
      }
    }, 200);
  };
  document.body.appendChild(iframe);
  setTimeout(() => {
    iframe.remove();
    URL.revokeObjectURL(url);
  }, 6e4);
}
async function blobToBase64(blob) {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 32768;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
async function imageToDataUrl(src) {
  const res = await fetch(src);
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}
const stampModules = /* @__PURE__ */ Object.assign({
  "/src/assets/prescription/nutritionist-stamp.png": __vite_glob_0_0
});
const nutritionistStampUrl = Object.values(stampModules)[0]?.default ?? null;
const NUTRITIONIST = { name: "Larah Nóbrega", crn: "CRN 6197CE" };
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
async function ensurePrescriptionFontsLoaded() {
  try {
    if (document.fonts?.load) {
      await Promise.all([
        document.fonts.load('400 12pt "Book Antiqua"'),
        document.fonts.load('700 12pt "Book Antiqua"'),
        document.fonts.load('400 12pt "Palatino Linotype"')
      ]);
    }
  } catch {
  }
}
function buildHtml(input, letterheadDataUrl, stampDataUrl) {
  const orderNumber = getOrderNumberLabel(input.pharmacyOrderNumber, input.orderId);
  const itemNames = input.formulas.map((f) => f.name);
  const protocolName = getProtocolName(input.formulas.length, itemNames);
  const formulasHtml = input.formulas.map(
    (f, i) => `
        <section class="formula">
          <h3>${String(i + 1).padStart(2, "0")}. ${escapeHtml(f.name)}</h3>
          <p class="label">Composição</p>
          <ul class="composition">
            ${(f.composition.length ? f.composition : ["—"]).map((c) => `<li>${escapeHtml(c)}</li>`).join("")}
          </ul>
          <p class="label">Posologia</p>
          <p class="body">${escapeHtml(f.posology || "—")}</p>
        </section>`
  ).join("");
  const signatureHtml = stampDataUrl ? `<img class="nutritionist-stamp" src="${stampDataUrl}" alt="Carimbo Larah Nóbrega" />` : `
        <div class="sig-line"></div>
        <div class="sig-name">${escapeHtml(NUTRITIONIST.name)}</div>
        <div class="sig-role">Nutricionista · ${escapeHtml(NUTRITIONIST.crn)}</div>
      `;
  return `
  <div id="prescription-root">
    <style>
      #prescription-root, #prescription-root * { box-sizing: border-box; }
      #prescription-root {
        font-family: "Book Antiqua", "Palatino Linotype", Palatino, Georgia, serif;
        font-size: 12pt;
        line-height: 1.45;
        color: #1a1a1a;
      }
      .page {
        position: relative;
        width: 794px;
        min-height: 1123px;
        background-image: url('${letterheadDataUrl}');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-color: #ffffff;
        padding: 190px 64px 130px 64px;
        -webkit-print-color-adjust: exact;
      }
      .meta {
        text-align: right;
        font-size: 11pt;
        color: #444;
        margin-bottom: 16px;
      }
      .title {
        text-align: center;
        margin-bottom: 22px;
      }
      .title h1 {
        font-size: 14pt;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin: 0 0 6px;
      }
      .title p {
        margin: 0;
        font-size: 12pt;
      }
      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px 24px;
        margin-bottom: 18px;
        border: 1px solid #c8b88a;
        padding: 14px 18px;
        background: rgba(255, 255, 255, 0.92);
      }
      .info-grid .label {
        font-size: 10pt;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #666;
        margin: 0;
      }
      .info-grid .value {
        margin: 2px 0 8px;
        font-size: 12pt;
        font-weight: 700;
      }
      .section-title {
        font-size: 12pt;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin: 16px 0 8px;
        border-bottom: 1px solid #c8b88a;
        padding-bottom: 4px;
      }
      .formula {
        margin-bottom: 14px;
        page-break-inside: avoid;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid #ddd;
        padding: 12px 16px;
      }
      .formula h3 {
        margin: 0 0 8px;
        font-size: 12pt;
        font-weight: 700;
      }
      .formula .label {
        margin: 6px 0 2px;
        font-size: 11pt;
        font-weight: 700;
        text-transform: uppercase;
      }
      .formula .composition {
        margin: 0 0 8px;
        padding-left: 18px;
        font-size: 12pt;
      }
      .formula .body {
        margin: 0;
        font-size: 12pt;
      }
      .signature {
        margin-top: 32px;
        text-align: center;
      }
      .nutritionist-stamp {
        width: 240px;
        max-width: 100%;
        height: auto;
        object-fit: contain;
      }
      .sig-line {
        width: 280px;
        margin: 0 auto 8px;
        border-top: 1px solid #1a1a1a;
      }
      .sig-name {
        font-size: 12pt;
        font-weight: 700;
      }
      .sig-role {
        font-size: 11pt;
        color: #555;
      }
    </style>
    <article class="page">
      <div class="meta">${escapeHtml(todayLong())}</div>
      <div class="title">
        <h1>Prescrição</h1>
        <p>Protocolo Seca Tudo · Farmácia Evidence</p>
      </div>

      <div class="info-grid">
        <div>
          <p class="label">Paciente</p>
          <p class="value">${escapeHtml(input.patientName)}</p>
        </div>
        <div>
          <p class="label">CPF</p>
          <p class="value">${escapeHtml(input.patientCpf)}</p>
        </div>
        <div>
          <p class="label">Nº do pedido</p>
          <p class="value">${escapeHtml(orderNumber)}</p>
        </div>
        <div>
          <p class="label">Protocolo adquirido</p>
          <p class="value">${escapeHtml(protocolName)}</p>
        </div>
      </div>

      <p class="section-title">Fórmulas prescritas</p>
      ${formulasHtml}

      <div class="signature">
        ${signatureHtml}
      </div>
    </article>
  </div>`;
}
async function generatePrescriptionPdf(input) {
  const [letterheadDataUrl, stampDataUrl] = await Promise.all([
    imageToDataUrl(letterhead),
    nutritionistStampUrl ? imageToDataUrl(nutritionistStampUrl) : Promise.resolve(null)
  ]);
  await ensurePrescriptionFontsLoaded();
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-10000px";
  container.style.left = "0";
  container.style.width = "794px";
  container.style.background = "#fff";
  container.innerHTML = buildHtml(input, letterheadDataUrl, stampDataUrl);
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
    const itemNames = input.formulas.map((f) => f.name);
    const filename = buildPrescriptionFilename({
      pharmacyOrderNumber: input.pharmacyOrderNumber,
      orderId: input.orderId,
      patientName: input.patientName,
      itemCount: input.formulas.length,
      itemNames
    });
    return { blob: pdf.output("blob"), filename };
  } finally {
    document.body.removeChild(container);
  }
}
const STATUS_OPTIONS = [{
  value: "novo",
  label: "Novo"
}, {
  value: "em_atendimento",
  label: "Em atendimento"
}, {
  value: "aguardando_pagamento",
  label: "Aguardando pagamento"
}, {
  value: "nao_finalizado",
  label: "Não finalizado"
}, {
  value: "pago",
  label: "Pago"
}, {
  value: "manipulando",
  label: "Manipulando"
}, {
  value: "enviado",
  label: "Enviado"
}, {
  value: "entregue",
  label: "Entregue"
}, {
  value: "cancelado",
  label: "Cancelado"
}];
const CONFIRMED_STATUSES = ["pago", "manipulando", "enviado", "entregue"];
const NOT_FINALIZED_STATUSES = ["nao_finalizado", "cancelado", "aguardando_pagamento"];
const PRESCRIPTION_STATUSES = ["pago", "manipulando"];
function emptyProduct() {
  return {
    id: crypto.randomUUID(),
    name: "",
    price: 0,
    description: "",
    image_url: "",
    benefits: [""],
    formula: [""],
    posology: "",
    active: true,
    sort_order: 999
  };
}
function emptyFaq() {
  return {
    id: crypto.randomUUID(),
    question: "",
    answer: "",
    active: true,
    sort_order: 999
  };
}
const formatBRL = (value) => Number(value || 0).toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL"
});
const formatDateTime = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("pt-BR");
};
const formatDate = (value) => {
  if (!value) return "";
  return value.slice(0, 10);
};
function escapeCsv(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}
function getOrderFormulas(order) {
  return (order.order_items ?? []).map((item) => `${item.quantity || 1}x ${item.product_name}`).join(" | ");
}
function getStatusLabel(status) {
  return STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}
function getOrderItemsCount(order) {
  return (order.order_items ?? []).reduce((sum, item) => sum + (item.quantity || 1), 0);
}
function getItemTotal(item) {
  return Number(item.total_price ?? (item.unit_price ? item.unit_price * (item.quantity || 1) : item.price ?? 0));
}
function buildPrescriptionFormulas(order, productsById) {
  return (order.order_items ?? []).map((item) => {
    const product = productsById.get(item.product_id);
    return {
      name: item.product_name,
      composition: product?.formula?.filter(Boolean) ?? [],
      posology: product?.posology?.trim() || "—"
    };
  });
}
async function getAdminAuthHeaders() {
  const {
    data: {
      session
    }
  } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) {
    throw new Error("Sessão expirada. Faça login novamente.");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
}
function AdminPage() {
  const [loading, setLoading] = reactExports.useState(true);
  const [authorized, setAuthorized] = reactExports.useState(false);
  const [tab, setTab] = reactExports.useState("products");
  const [products, setProducts] = reactExports.useState([]);
  const [orders, setOrders] = reactExports.useState([]);
  const [faqs, setFaqs] = reactExports.useState([]);
  const [users, setUsers] = reactExports.useState([]);
  const [currentProfile, setCurrentProfile] = reactExports.useState(null);
  const [newUser, setNewUser] = reactExports.useState({
    email: "",
    password: "",
    role: "vendedor"
  });
  const [creatingUser, setCreatingUser] = reactExports.useState(false);
  const [editingOrders, setEditingOrders] = reactExports.useState({});
  const [savingOrderId, setSavingOrderId] = reactExports.useState(null);
  const [savedOrderId, setSavedOrderId] = reactExports.useState(null);
  const [expandedOrders, setExpandedOrders] = reactExports.useState({});
  const [generatingPrescriptionId, setGeneratingPrescriptionId] = reactExports.useState(null);
  const [prescriptionActionId, setPrescriptionActionId] = reactExports.useState(null);
  const [prescriptionErrors, setPrescriptionErrors] = reactExports.useState({});
  const productsById = reactExports.useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);
  const isMaster = currentProfile?.role === "admin_master";
  const canProducts = isMaster || currentProfile?.can_products === true;
  const canOrders = isMaster || currentProfile?.can_orders === true;
  const canReports = isMaster || currentProfile?.can_reports === true;
  const canFaqs = isMaster || currentProfile?.can_faqs === true;
  const canUsers = isMaster || currentProfile?.can_users === true;
  reactExports.useEffect(() => {
    init();
  }, []);
  async function init() {
    await checkAdmin();
  }
  async function checkAdmin() {
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        setAuthorized(false);
        setLoading(false);
        return;
      }
      const {
        data,
        error
      } = await supabase.from("profiles").select("id, email, role, can_products, can_orders, can_reports, can_faqs, can_users").eq("id", user.id).maybeSingle();
      if (error) {
        console.error(error);
        setAuthorized(false);
        setLoading(false);
        return;
      }
      const profile = data;
      const hasAccess = profile?.role === "admin_master" || profile?.can_products === true || profile?.can_orders === true || profile?.can_reports === true || profile?.can_faqs === true || profile?.can_users === true;
      if (!hasAccess) {
        setAuthorized(false);
        setLoading(false);
        return;
      }
      setCurrentProfile(profile);
      setAuthorized(true);
      await Promise.all([loadProducts(), loadOrders(), loadFaqs(), loadUsers()]);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setAuthorized(false);
      setLoading(false);
    }
  }
  async function loadProducts() {
    const {
      data
    } = await supabase.from("products").select("*").order("sort_order");
    if (data) {
      setProducts(data);
    }
  }
  async function loadOrders() {
    const {
      data,
      error
    } = await supabase.from("orders").select("*, order_items(*)").order("created_at", {
      ascending: false
    });
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      setOrders(data);
    }
  }
  async function loadFaqs() {
    const {
      data,
      error
    } = await supabase.from("faqs").select("*").order("sort_order", {
      ascending: true
    });
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      setFaqs(data);
    }
  }
  async function loadUsers() {
    const {
      data,
      error
    } = await supabase.from("profiles").select("id, email, role, can_products, can_orders, can_reports, can_faqs, can_users").order("email", {
      ascending: true
    });
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      setUsers(data);
    }
  }
  async function saveProduct(product) {
    const cleaned = {
      ...product,
      benefits: product.benefits.filter(Boolean),
      formula: product.formula.filter(Boolean)
    };
    const {
      error
    } = await supabase.from("products").upsert(cleaned);
    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }
    alert("Produto salvo!");
    await loadProducts();
  }
  async function deleteProduct(id) {
    const confirmed = confirm("Deseja excluir este produto?");
    if (!confirmed) return;
    const {
      error
    } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    await loadProducts();
  }
  async function saveFaq(faq) {
    const cleaned = {
      id: faq.id,
      question: faq.question.trim(),
      answer: faq.answer.trim(),
      active: faq.active,
      sort_order: Number(faq.sort_order || 0)
    };
    if (!cleaned.question || !cleaned.answer) {
      alert("Preencha a pergunta e a resposta.");
      return;
    }
    const {
      error
    } = await supabase.from("faqs").upsert(cleaned);
    if (error) {
      alert(error.message);
      return;
    }
    alert("Dúvida salva!");
    await loadFaqs();
  }
  async function deleteFaq(id) {
    const confirmed = confirm("Deseja excluir esta dúvida frequente?");
    if (!confirmed) return;
    const {
      error
    } = await supabase.from("faqs").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    await loadFaqs();
  }
  async function createAdminUser() {
    if (!newUser.email.trim() || !newUser.password.trim()) {
      alert("Preencha e-mail e senha.");
      return;
    }
    if (!canUsers) {
      alert("Você não tem permissão para criar usuários.");
      return;
    }
    setCreatingUser(true);
    const {
      data,
      error
    } = await supabase.functions.invoke("create-admin-user", {
      body: {
        email: newUser.email.trim(),
        password: newUser.password,
        role: newUser.role
      }
    });
    setCreatingUser(false);
    if (error) {
      alert(error.message);
      return;
    }
    if (data?.error) {
      alert(data.error);
      return;
    }
    alert("Usuário criado com sucesso!");
    setNewUser({
      email: "",
      password: "",
      role: "vendedor"
    });
    await loadUsers();
  }
  async function removeUserAccess(user) {
    if (user.id === currentProfile?.id) {
      alert("Você não pode remover seu próprio acesso.");
      return;
    }
    const confirmed = confirm(`Remover acesso de ${user.email}?`);
    if (!confirmed) return;
    const {
      error
    } = await supabase.from("profiles").update({
      role: "bloqueado",
      can_products: false,
      can_orders: false,
      can_reports: false,
      can_faqs: false,
      can_users: false
    }).eq("id", user.id);
    if (error) {
      alert(error.message);
      return;
    }
    alert("Acesso removido.");
    await loadUsers();
  }
  async function fetchPrescriptionSignedUrl(orderId) {
    const headers = await getAdminAuthHeaders();
    const res = await fetch(`/api/admin/orders/prescription-url?order_id=${encodeURIComponent(orderId)}`, {
      headers
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "Não foi possível obter a prescrição.");
    }
    return data;
  }
  async function refreshOrder(orderId) {
    const {
      data,
      error
    } = await supabase.from("orders").select("*, order_items(*)").eq("id", orderId).maybeSingle();
    if (error) {
      console.error(error);
      return null;
    }
    if (data) {
      setOrders((prev) => prev.map((current) => current.id === orderId ? data : current));
      return data;
    }
    return null;
  }
  async function ensurePrescriptionForOrder(order, opts) {
    if (order.prescription_pdf_path) return order;
    if (!PRESCRIPTION_STATUSES.includes(order.status)) return order;
    if (!(order.order_items ?? []).length) {
      const message = "Este pedido não possui itens. Não é possível gerar a prescrição.";
      setPrescriptionErrors((prev) => ({
        ...prev,
        [order.id]: message
      }));
      alert(message);
      return order;
    }
    setGeneratingPrescriptionId(order.id);
    setPrescriptionErrors((prev) => {
      const next = {
        ...prev
      };
      delete next[order.id];
      return next;
    });
    try {
      const formulas = buildPrescriptionFormulas(order, productsById);
      const {
        blob,
        filename
      } = await generatePrescriptionPdf({
        orderId: order.id,
        pharmacyOrderNumber: order.pharmacy_order_number,
        patientName: order.customer_name,
        patientCpf: order.customer_cpf,
        formulas
      });
      const headers = await getAdminAuthHeaders();
      const res = await fetch("/api/admin/orders/prescription", {
        method: "POST",
        headers,
        body: JSON.stringify({
          order_id: order.id,
          pdf_base64: await blobToBase64(blob),
          pdf_filename: filename
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data.error || "Falha ao salvar a prescrição no servidor. Verifique Supabase e migration.";
        setPrescriptionErrors((prev) => ({
          ...prev,
          [order.id]: message
        }));
        if (opts?.downloadOnFailure) {
          downloadBlob(blob, filename);
        }
        throw new Error(message);
      }
      const refreshed = await refreshOrder(order.id);
      return refreshed ?? {
        ...order,
        prescription_pdf_path: data.prescription_pdf_path,
        prescription_pdf_filename: data.prescription_pdf_filename
      };
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Erro ao gerar a prescrição. O pedido foi salvo normalmente.";
      setPrescriptionErrors((prev) => ({
        ...prev,
        [order.id]: message
      }));
      alert(message);
      return order;
    } finally {
      setGeneratingPrescriptionId(null);
    }
  }
  async function viewPrescription(order) {
    if (!order.prescription_pdf_path) return;
    setPrescriptionActionId(order.id);
    try {
      const {
        url
      } = await fetchPrescriptionSignedUrl(order.id);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao abrir prescrição.");
    } finally {
      setPrescriptionActionId(null);
    }
  }
  async function downloadPrescription(order) {
    if (!order.prescription_pdf_path) return;
    setPrescriptionActionId(order.id);
    try {
      const {
        url,
        filename
      } = await fetchPrescriptionSignedUrl(order.id);
      const res = await fetch(url);
      if (!res.ok) throw new Error("Falha ao baixar a prescrição.");
      const blob = await res.blob();
      downloadBlob(blob, filename);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao baixar prescrição.");
    } finally {
      setPrescriptionActionId(null);
    }
  }
  async function printPrescription(order) {
    if (!order.prescription_pdf_path) return;
    setPrescriptionActionId(order.id);
    try {
      const {
        url
      } = await fetchPrescriptionSignedUrl(order.id);
      const res = await fetch(url);
      if (!res.ok) throw new Error("Falha ao carregar a prescrição.");
      const blob = await res.blob();
      printBlob(blob);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao imprimir prescrição.");
    } finally {
      setPrescriptionActionId(null);
    }
  }
  async function saveOrder(order, successMessage = "Pedido atualizado!") {
    setSavingOrderId(order.id);
    setSavedOrderId(null);
    const payload = {
      status: order.status,
      pharmacy_order_number: order.pharmacy_order_number || null,
      tracking_code: order.tracking_code || null,
      responsible_name: order.responsible_name || null,
      system_inclusion_date: order.system_inclusion_date || null,
      delivery_date: order.delivery_date || null
    };
    const {
      error
    } = await supabase.from("orders").update(payload).eq("id", order.id);
    setSavingOrderId(null);
    if (error) {
      alert(error.message);
      return false;
    }
    setOrders((prev) => prev.map((current) => current.id === order.id ? {
      ...current,
      ...payload
    } : current));
    setEditingOrders((prev) => ({
      ...prev,
      [order.id]: false
    }));
    setSavedOrderId(order.id);
    const updatedOrder = {
      ...order,
      ...payload
    };
    if (PRESCRIPTION_STATUSES.includes(updatedOrder.status) && !updatedOrder.prescription_pdf_path) {
      await ensurePrescriptionForOrder(updatedOrder, {
        downloadOnFailure: true
      });
    }
    await loadOrders();
    alert(successMessage);
    return true;
  }
  async function markOrderNotFinalized(order) {
    const confirmed = confirm("Marcar este pedido como não finalizado? Use esta opção quando o cliente desistiu ou não concluiu o pedido pelo WhatsApp.");
    if (!confirmed) return;
    await saveOrder({
      ...order,
      status: "nao_finalizado",
      delivery_date: null
    }, "Pedido marcado como não finalizado.");
  }
  async function cancelOrder(order) {
    const confirmed = confirm("Cancelar este pedido?");
    if (!confirmed) return;
    await saveOrder({
      ...order,
      status: "cancelado",
      delivery_date: null
    }, "Pedido cancelado.");
  }
  async function deleteOrder(order) {
    const confirmed = confirm("Excluir este pedido definitivamente? Esta ação remove o pedido do painel e dos relatórios.");
    if (!confirmed) return;
    const {
      error
    } = await supabase.from("orders").delete().eq("id", order.id);
    if (error) {
      alert(error.message);
      return;
    }
    setOrders((prev) => prev.filter((current) => current.id !== order.id));
    alert("Pedido excluído.");
  }
  function updateProduct(id, field, value) {
    setProducts((prev) => prev.map((p) => p.id === id ? {
      ...p,
      [field]: value
    } : p));
  }
  function updateFaq(id, field, value) {
    setFaqs((prev) => prev.map((faq) => faq.id === id ? {
      ...faq,
      [field]: value
    } : faq));
  }
  function updateOrder(id, field, value) {
    setOrders((prev) => prev.map((order) => order.id === id ? {
      ...order,
      [field]: value
    } : order));
  }
  const reportRows = reactExports.useMemo(() => {
    return orders.map((order) => ({
      pcp: order.pharmacy_order_number ?? "",
      cliente: order.customer_name,
      formulas: getOrderFormulas(order),
      total: Number(order.total || 0),
      status: getStatusLabel(order.status),
      rastreio: order.tracking_code ?? "",
      responsavel: order.responsible_name ?? "",
      dataInclusaoSistema: order.system_inclusion_date ?? "",
      dataEntrega: order.delivery_date ?? "",
      dataPedido: order.created_at
    }));
  }, [orders]);
  const pedidosConfirmados = orders.filter((order) => CONFIRMED_STATUSES.includes(order.status));
  const pedidosNaoFinalizados = orders.filter((order) => NOT_FINALIZED_STATUSES.includes(order.status));
  const totalSolicitado = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const totalConfirmado = pedidosConfirmados.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const totalNaoFinalizado = pedidosNaoFinalizados.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const formulasSolicitadas = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    orders.forEach((order) => {
      (order.order_items ?? []).forEach((item) => {
        map.set(item.product_name, (map.get(item.product_name) ?? 0) + (item.quantity || 1));
      });
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [orders]);
  const formulasVendidas = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    pedidosConfirmados.forEach((order) => {
      (order.order_items ?? []).forEach((item) => {
        map.set(item.product_name, (map.get(item.product_name) ?? 0) + (item.quantity || 1));
      });
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [pedidosConfirmados]);
  const formulasFaturamento = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    pedidosConfirmados.forEach((order) => {
      (order.order_items ?? []).forEach((item) => {
        const current = map.get(item.product_name) ?? {
          quantidade: 0,
          faturamento: 0
        };
        map.set(item.product_name, {
          quantidade: current.quantidade + (item.quantity || 1),
          faturamento: current.faturamento + getItemTotal(item)
        });
      });
    });
    return [...map.entries()].sort((a, b) => b[1].faturamento - a[1].faturamento);
  }, [pedidosConfirmados]);
  function exportCsv() {
    const pedidosHeader = ["PCP", "Cliente", "Telefone", "CPF", "Fórmulas solicitadas", "Quantidade de itens", "Subtotal", "Desconto", "Valor total", "Status", "Rastreio", "Responsável", "Pagamento", "Região", "Data da inclusão no sistema", "Data de entrega", "Data do pedido no site"];
    const pedidosRows = orders.map((order) => [order.pharmacy_order_number ?? "", order.customer_name, order.customer_phone, order.customer_cpf, getOrderFormulas(order), getOrderItemsCount(order), Number(order.subtotal || 0).toFixed(2).replace(".", ","), Number(order.discount || 0).toFixed(2).replace(".", ","), Number(order.total || 0).toFixed(2).replace(".", ","), getStatusLabel(order.status), order.tracking_code ?? "", order.responsible_name ?? "", order.payment_method, order.region, order.system_inclusion_date ?? "", order.delivery_date ?? "", formatDateTime(order.created_at)]);
    const formulasHeader = ["Fórmula", "Quantidade vendida", "Faturamento confirmado"];
    const formulasRows = formulasFaturamento.map(([name, data]) => [name, data.quantidade, data.faturamento.toFixed(2).replace(".", ",")]);
    const resumoHeader = ["Indicador", "Valor"];
    const resumoRows = [["Pedidos recebidos", orders.length], ["Pedidos confirmados", pedidosConfirmados.length], ["Pedidos não finalizados/cancelados/aguardando", pedidosNaoFinalizados.length], ["Total solicitado", totalSolicitado.toFixed(2).replace(".", ",")], ["Total confirmado", totalConfirmado.toFixed(2).replace(".", ",")], ["Total não finalizado", totalNaoFinalizado.toFixed(2).replace(".", ",")], ["Conversão", orders.length ? `${Math.round(pedidosConfirmados.length / orders.length * 100)}%` : "0%"]];
    const csv = [["RELATÓRIO DE PEDIDOS"], pedidosHeader, ...pedidosRows, [], ["RESUMO"], resumoHeader, ...resumoRows, [], ["FÓRMULAS MAIS VENDIDAS / FATURAMENTO"], formulasHeader, ...formulasRows].map((line) => line.map(escapeCsv).join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "relatorio-pedidos-completo.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  function exportPdf() {
    const statusResumo = `
      <div class="cards">
        <div><small>Pedidos recebidos</small><strong>${orders.length}</strong></div>
        <div><small>Pedidos confirmados</small><strong>${pedidosConfirmados.length}</strong></div>
        <div><small>Não finalizados</small><strong>${pedidosNaoFinalizados.length}</strong></div>
        <div><small>Total confirmado</small><strong>${formatBRL(totalConfirmado)}</strong></div>
        <div><small>Conversão</small><strong>${orders.length ? Math.round(pedidosConfirmados.length / orders.length * 100) : 0}%</strong></div>
      </div>
    `;
    const formulasHtml = formulasFaturamento.length ? formulasFaturamento.map(([name, data], index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${name}</td>
                <td>${data.quantidade}</td>
                <td>${formatBRL(data.faturamento)}</td>
              </tr>
            `).join("") : `<tr><td colspan="4">Sem dados de vendas confirmadas.</td></tr>`;
    const pedidosHtml = orders.map((order) => `
          <tr>
            <td>${order.pharmacy_order_number || "-"}</td>
            <td>${order.customer_name || "-"}</td>
            <td>${getOrderFormulas(order) || "-"}</td>
            <td>${formatBRL(order.total)}</td>
            <td>${getStatusLabel(order.status)}</td>
            <td>${order.tracking_code || "-"}</td>
            <td>${order.responsible_name || "-"}</td>
            <td>${order.system_inclusion_date || "-"}</td>
            <td>${order.delivery_date || "-"}</td>
          </tr>
        `).join("");
    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Relatório de pedidos</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: Arial, sans-serif; color: #061743; margin: 32px; }
            h1 { margin: 0 0 4px; font-size: 28px; }
            h2 { margin: 28px 0 10px; font-size: 18px; }
            p { margin: 0 0 18px; color: #555; }
            .cards { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin: 18px 0 26px; }
            .cards div { border: 1px solid #ddd; border-radius: 12px; padding: 12px; }
            small { display: block; color: #666; margin-bottom: 6px; }
            strong { font-size: 16px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
            th { background: #f4f1ed; }
            @media print { body { margin: 16px; } .cards { grid-template-columns: repeat(3, 1fr); } }
          </style>
        </head>
        <body>
          <h1>Relatório de pedidos</h1>
          <p>Gerado em ${(/* @__PURE__ */ new Date()).toLocaleString("pt-BR")}</p>
          ${statusResumo}

          <h2>Fórmulas vendidas por faturamento</h2>
          <table>
            <thead>
              <tr><th>#</th><th>Fórmula</th><th>Quantidade</th><th>Faturamento</th></tr>
            </thead>
            <tbody>${formulasHtml}</tbody>
          </table>

          <h2>Planilha de acompanhamento</h2>
          <table>
            <thead>
              <tr>
                <th>PCP</th><th>Cliente</th><th>Fórmulas</th><th>Total</th><th>Status</th>
                <th>Rastreio</th><th>Responsável</th><th>Inclusão</th><th>Entrega</th>
              </tr>
            </thead>
            <tbody>${pedidosHtml}</tbody>
          </table>
        </body>
      </html>
    `;
    const printWindow = window.open("", "_blank", "width=1200,height=800");
    if (!printWindow) {
      alert("O navegador bloqueou a janela de impressão. Libere pop-ups para exportar em PDF.");
      return;
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", children: "Carregando..." });
  }
  if (!authorized) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background p-6 md:p-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-gold", children: "Painel administrativo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-display text-navy", children: tab === "products" ? "Produtos" : tab === "orders" ? "Pedidos" : tab === "reports" ? "Relatórios" : tab === "faqs" ? "Dúvidas frequentes" : "Usuários" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        tab === "products" && canProducts && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setProducts((prev) => [...prev, emptyProduct()]), className: "flex items-center gap-2 px-5 py-3 rounded-2xl bg-gold text-navy font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          "Novo produto"
        ] }),
        tab === "faqs" && canFaqs && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setFaqs((prev) => [...prev, emptyFaq()]), className: "flex items-center gap-2 px-5 py-3 rounded-2xl bg-gold text-navy font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          "Nova dúvida"
        ] }),
        tab === "reports" && canReports && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: exportCsv, className: "flex items-center gap-2 px-5 py-3 rounded-2xl bg-gold text-navy font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
            "Exportar Excel"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: exportPdf, className: "flex items-center gap-2 px-5 py-3 rounded-2xl border bg-card text-navy font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4" }),
            "Exportar PDF"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: async () => {
          await supabase.auth.signOut();
          window.location.href = "/login";
        }, className: "flex items-center gap-2 px-5 py-3 rounded-2xl border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
          "Sair"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex flex-wrap gap-3", children: [
      canProducts && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab("products"), className: `flex items-center gap-2 px-5 py-3 rounded-2xl border ${tab === "products" ? "bg-navy text-white" : "bg-card"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4" }),
        "Produtos"
      ] }),
      canOrders && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab("orders"), className: `flex items-center gap-2 px-5 py-3 rounded-2xl border ${tab === "orders" ? "bg-navy text-white" : "bg-card"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4" }),
        "Pedidos"
      ] }),
      canReports && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab("reports"), className: `flex items-center gap-2 px-5 py-3 rounded-2xl border ${tab === "reports" ? "bg-navy text-white" : "bg-card"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4" }),
        "Relatórios"
      ] }),
      canFaqs && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab("faqs"), className: `flex items-center gap-2 px-5 py-3 rounded-2xl border ${tab === "faqs" ? "bg-navy text-white" : "bg-card"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleQuestionMark, { className: "h-4 w-4" }),
        "Dúvidas"
      ] }),
      canUsers && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab("users"), className: `flex items-center gap-2 px-5 py-3 rounded-2xl border ${tab === "users" ? "bg-navy text-white" : "bg-card"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
        "Usuários"
      ] })
    ] }),
    tab === "products" && canProducts && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-8", children: products.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border bg-card p-6 md:p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-navy", children: product.name || "Novo produto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateProduct(product.id, "active", !product.active), className: `px-4 py-2 rounded-xl flex items-center gap-2 ${product.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`, children: product.active ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }),
            "Ativo"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }),
            "Oculto"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deleteProduct(product.id), className: "px-4 py-2 rounded-xl bg-red-100 text-red-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-2 block", children: "Nome do produto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: product.name, onChange: (e) => updateProduct(product.id, "name", e.target.value), className: "border rounded-2xl px-4 py-3 w-full" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-2 block", children: "Preço" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: product.price, onChange: (e) => updateProduct(product.id, "price", Number(e.target.value)), className: "border rounded-2xl px-4 py-3 w-full" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-2 block", children: "Ordem de exibição" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: product.sort_order, onChange: (e) => updateProduct(product.id, "sort_order", Number(e.target.value)), className: "border rounded-2xl px-4 py-3 w-full" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-2 block", children: "Imagem do produto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "border rounded-2xl px-4 py-3 cursor-pointer flex items-center gap-2 hover:bg-accent transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
              "Enviar imagem",
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const fileName = `${Date.now()}-${file.name}`;
                const {
                  error: uploadError
                } = await supabase.storage.from("product-images").upload(fileName, file);
                if (uploadError) {
                  alert(uploadError.message);
                  return;
                }
                const {
                  data: {
                    publicUrl
                  }
                } = supabase.storage.from("product-images").getPublicUrl(fileName);
                updateProduct(product.id, "image_url", publicUrl);
              } })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: product.image_url, onChange: (e) => updateProduct(product.id, "image_url", e.target.value), className: "border rounded-2xl px-4 py-3 w-full", placeholder: "URL da imagem" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-2 block", children: "Descrição" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: product.description, onChange: (e) => updateProduct(product.id, "description", e.target.value), className: "border rounded-2xl px-4 py-3 min-h-[120px] w-full" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-2 block", children: "Posologia" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: product.posology, onChange: (e) => updateProduct(product.id, "posology", e.target.value), className: "border rounded-2xl px-4 py-3 w-full" })
        ] })
      ] }),
      product.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image_url, alt: "", className: "h-64 w-full object-cover rounded-2xl border" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6 mt-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium mb-3 text-navy", children: "Benefícios" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            product.benefits.map((benefit, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: benefit, onChange: (e) => {
              const updated = [...product.benefits];
              updated[index] = e.target.value;
              updateProduct(product.id, "benefits", updated);
            }, className: "border rounded-xl px-4 py-3 w-full", placeholder: "Benefício" }, index)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateProduct(product.id, "benefits", [...product.benefits, ""]), className: "text-sm text-gold", children: "+ adicionar benefício" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium mb-3 text-navy", children: "Composição / Fórmula" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            product.formula.map((formula, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: formula, onChange: (e) => {
              const updated = [...product.formula];
              updated[index] = e.target.value;
              updateProduct(product.id, "formula", updated);
            }, className: "border rounded-xl px-4 py-3 w-full", placeholder: "Composição" }, index)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateProduct(product.id, "formula", [...product.formula, ""]), className: "text-sm text-gold", children: "+ adicionar composição" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => saveProduct(product), className: "px-6 py-3 rounded-2xl bg-navy text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
        "Salvar produto"
      ] }) })
    ] }, product.id)) }),
    tab === "orders" && canOrders && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
      orders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl border bg-card p-8 text-center text-muted-foreground", children: "Nenhum pedido recebido ainda." }),
      orders.map((order) => {
        const isEditing = editingOrders[order.id] ?? false;
        const isSaving = savingOrderId === order.id;
        const isGeneratingPrescription = generatingPrescriptionId === order.id;
        const isPrescriptionBusy = prescriptionActionId === order.id;
        const isSaved = savedOrderId === order.id;
        const isExpanded = expandedOrders[order.id] ?? false;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-3xl border bg-card overflow-hidden ${order.status === "nao_finalizado" ? "border-red-400 bg-red-50" : order.status === "cancelado" ? "border-gray-400 bg-gray-50" : order.status === "aguardando_pagamento" ? "border-yellow-400 bg-yellow-50" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setExpandedOrders((prev) => ({
            ...prev,
            [order.id]: !isExpanded
          })), className: "w-full text-left p-5 md:p-6 hover:bg-secondary/30 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-[220px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-gold", children: "Pedido" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-navy mt-1", children: order.customer_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: formatDateTime(order.created_at) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-secondary/70 px-4 py-2 text-navy", children: getOrderFormulas(order) || "Sem itens" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full px-4 py-2 font-medium ${order.status === "nao_finalizado" ? "bg-red-100 text-red-700" : order.status === "cancelado" ? "bg-gray-100 text-gray-700" : order.status === "aguardando_pagamento" ? "bg-yellow-100 text-yellow-800" : CONFIRMED_STATUSES.includes(order.status) ? "bg-green-100 text-green-700" : "bg-secondary text-navy"}`, children: getStatusLabel(order.status) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-lg text-navy", children: formatBRL(order.total) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border px-3 py-2 text-navy", children: isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" }) })
            ] })
          ] }) }),
          isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-5 md:px-6 md:pb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4 border-t pt-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                order.status === "nao_finalizado" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-red-100 border border-red-300 px-4 py-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-red-700", children: "Pedido não finalizado pelo cliente" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600 mt-1", children: "O cliente iniciou o pedido, mas não concluiu o pagamento/finalização." })
                ] }),
                order.status === "aguardando_pagamento" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-yellow-100 border border-yellow-300 px-4 py-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-yellow-800", children: "Pedido aguardando pagamento" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-yellow-700 mt-1", children: "O pedido ainda não deve ser considerado como venda confirmada." })
                ] }),
                order.status === "cancelado" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-gray-100 border border-gray-300 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-gray-700", children: "Pedido cancelado" }) }),
                isSaved && !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-700", children: "Pedido salvo e relatório atualizado." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-stretch gap-2 w-full sm:w-[280px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: order.status, disabled: !isEditing, onChange: (e) => updateOrder(order.id, "status", e.target.value), className: "border rounded-xl px-4 py-3 bg-white disabled:bg-secondary/60", children: STATUS_OPTIONS.map((status) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: status.value, children: status.label }, status.value)) }),
                !isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setEditingOrders((prev) => ({
                  ...prev,
                  [order.id]: true
                })), className: "rounded-xl border border-navy/20 bg-white px-4 py-2 text-sm font-medium text-navy hover:bg-secondary flex items-center justify-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }),
                  "Editar pedido"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: isSaving, onClick: () => saveOrder(order), className: "rounded-xl bg-navy px-4 py-3 text-sm font-medium text-white flex items-center justify-center gap-2 disabled:opacity-50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
                  isSaving ? "Salvando..." : "Salvar alterações"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => markOrderNotFinalized(order), className: "rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100", children: "Cliente desistiu / não finalizou" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => cancelOrder(order), className: "rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100", children: "Cancelar pedido" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-4 gap-4 mt-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(InfoCard, { label: "Telefone", value: order.customer_phone }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InfoCard, { label: "CPF", value: order.customer_cpf }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InfoCard, { label: "Pagamento", value: order.payment_method }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InfoCard, { label: "Região", value: order.region })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-5 gap-4 mt-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(EditField, { label: "PCP", value: order.pharmacy_order_number ?? "", disabled: !isEditing, onChange: (v) => updateOrder(order.id, "pharmacy_order_number", v) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(EditField, { label: "Rastreio", value: order.tracking_code ?? "", disabled: !isEditing, onChange: (v) => updateOrder(order.id, "tracking_code", v) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(EditField, { label: "Responsável", value: order.responsible_name ?? "", disabled: !isEditing, onChange: (v) => updateOrder(order.id, "responsible_name", v) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(EditField, { type: "date", label: "Inclusão no sistema", value: formatDate(order.system_inclusion_date), disabled: !isEditing, onChange: (v) => updateOrder(order.id, "system_inclusion_date", v) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(EditField, { type: "date", label: "Data de entrega", value: formatDate(order.delivery_date), disabled: !isEditing, onChange: (v) => updateOrder(order.id, "delivery_date", v) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-2xl border p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-navy mb-3", children: "Itens do pedido" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: (order.order_items ?? []).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4 text-sm border-b last:border-b-0 pb-2 last:pb-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  item.quantity,
                  "x ",
                  item.product_name
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: formatBRL(getItemTotal(item)) })
              ] }, item.id)) })
            ] }),
            (order.prescription_pdf_path || isGeneratingPrescription || PRESCRIPTION_STATUSES.includes(order.status)) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-2xl border p-4 bg-secondary/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-navy mb-3", children: "Prescrição" }),
              isGeneratingPrescription ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                "Gerando prescrição..."
              ] }) : order.prescription_pdf_path ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", disabled: isPrescriptionBusy, onClick: () => viewPrescription(order), className: "px-5 py-3 rounded-2xl bg-navy text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }),
                  "Visualizar Prescrição"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", disabled: isPrescriptionBusy, onClick: () => printPrescription(order), className: "px-5 py-3 rounded-2xl border bg-card text-navy text-sm font-medium flex items-center gap-2 disabled:opacity-50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4" }),
                  "Imprimir"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", disabled: isPrescriptionBusy, onClick: () => downloadPrescription(order), className: "px-5 py-3 rounded-2xl border bg-card text-navy text-sm font-medium flex items-center gap-2 disabled:opacity-50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
                  "Baixar PDF"
                ] })
              ] }) : PRESCRIPTION_STATUSES.includes(order.status) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "A prescrição é gerada ao salvar como Pago ou Manipulando. Se não apareceu, clique abaixo para tentar novamente." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", disabled: isGeneratingPrescription || isPrescriptionBusy, onClick: () => ensurePrescriptionForOrder(order, {
                  downloadOnFailure: true
                }), className: "px-5 py-3 rounded-2xl bg-navy text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }),
                  "Gerar prescrição agora"
                ] })
              ] }) : null,
              prescriptionErrors[order.id] ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-red-600", children: prescriptionErrors[order.id] }) : null,
              order.prescription_pdf_filename ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-xs text-muted-foreground", children: [
                "Arquivo: ",
                order.prescription_pdf_filename
              ] }) : null
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex flex-wrap items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
                isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: isSaving, onClick: () => saveOrder(order), className: "px-6 py-3 rounded-2xl bg-navy text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
                  isSaving ? "Salvando..." : "Salvar alterações"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => markOrderNotFinalized(order), className: "px-6 py-3 rounded-2xl border border-red-300 bg-red-50 text-red-700 font-medium", children: "Descartar como não finalizado" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => deleteOrder(order), className: "px-6 py-3 rounded-2xl border border-gray-300 text-gray-700 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
                  "Excluir"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-end gap-4 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal: " }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatBRL(order.subtotal) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Desconto: " }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatBRL(order.discount) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total: " }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-lg text-navy", children: formatBRL(order.total) })
                ] })
              ] })
            ] })
          ] })
        ] }, order.id);
      })
    ] }),
    tab === "reports" && canReports && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-5 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoCard, { label: "Pedidos recebidos", value: String(orders.length) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoCard, { label: "Pedidos confirmados", value: String(pedidosConfirmados.length) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoCard, { label: "Não finalizados", value: String(pedidosNaoFinalizados.length) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoCard, { label: "Total confirmado", value: formatBRL(totalConfirmado) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoCard, { label: "Conversão", value: orders.length ? `${Math.round(pedidosConfirmados.length / orders.length * 100)}%` : "0%" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RankingCard, { title: "Fórmulas mais solicitadas", rows: formulasSolicitadas }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RankingCard, { title: "Fórmulas mais vendidas", rows: formulasVendidas }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border bg-card p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-navy mb-4", children: "Maior faturamento" }),
          formulasFaturamento.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Sem dados ainda." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: formulasFaturamento.slice(0, 5).map(([name, data], index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-navy", children: [
                index + 1,
                ". ",
                name
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
                data.quantidade,
                " venda(s)"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-navy", children: formatBRL(data.faturamento) })
          ] }, name)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border bg-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex items-center justify-between gap-4 border-b", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-navy", children: "Planilha de acompanhamento" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Controle de pedidos, PCP, rastreio, responsável e entrega." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: exportCsv, className: "flex items-center gap-2 px-5 py-3 rounded-2xl bg-gold text-navy font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
            "Exportar Excel"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-secondary/70 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "PCP" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "Cliente" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "Fórmulas" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "Rastreio" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "Responsável" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "Inclusão" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "Entrega" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: reportRows.map((row, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: row.pcp || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 font-medium text-navy", children: row.cliente }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 min-w-[220px]", children: row.formulas || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: formatBRL(row.total) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: row.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: row.rastreio || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: row.responsavel || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: row.dataInclusaoSistema || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: row.dataEntrega || "-" })
          ] }, index)) })
        ] }) })
      ] })
    ] }),
    tab === "faqs" && canFaqs && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6", children: [
      faqs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl border bg-card p-8 text-center text-muted-foreground", children: "Nenhuma dúvida cadastrada ainda." }),
      faqs.map((faq) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border bg-card p-6 md:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-gold", children: "Dúvida frequente" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-navy mt-1", children: faq.question || "Nova dúvida" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateFaq(faq.id, "active", !faq.active), className: `px-4 py-2 rounded-xl flex items-center gap-2 ${faq.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`, children: faq.active ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }),
              "Ativa"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }),
              "Oculta"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deleteFaq(faq.id), className: "px-4 py-2 rounded-xl bg-red-100 text-red-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-2 block", children: "Pergunta" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: faq.question, onChange: (e) => updateFaq(faq.id, "question", e.target.value), className: "border rounded-2xl px-4 py-3 w-full" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-2 block", children: "Resposta" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: faq.answer, onChange: (e) => updateFaq(faq.id, "answer", e.target.value), className: "border rounded-2xl px-4 py-3 min-h-[140px] w-full" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-2 block", children: "Ordem de exibição" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: faq.sort_order, onChange: (e) => updateFaq(faq.id, "sort_order", Number(e.target.value)), className: "border rounded-2xl px-4 py-3 w-full md:w-56" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => saveFaq(faq), className: "px-6 py-3 rounded-2xl bg-navy text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
          "Salvar dúvida"
        ] }) })
      ] }, faq.id))
    ] }),
    tab === "users" && canUsers && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border bg-card p-6 md:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-gold", children: "Novo usuário" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-navy mt-1", children: "Criar acesso administrativo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "Vendedores terão acesso apenas a Produtos e Pedidos. Admin master tem acesso total." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-[1fr_1fr_220px] gap-4 mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(EditField, { label: "E-mail", value: newUser.email, onChange: (v) => setNewUser((prev) => ({
            ...prev,
            email: v
          })) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(EditField, { label: "Senha temporária", type: "password", value: newUser.password, onChange: (v) => setNewUser((prev) => ({
            ...prev,
            password: v
          })) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Tipo de usuário" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: newUser.role, onChange: (e) => setNewUser((prev) => ({
              ...prev,
              role: e.target.value
            })), className: "mt-1 w-full border rounded-xl px-4 py-3 bg-white", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "vendedor", children: "Vendedor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "admin_master", children: "Admin master" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: createAdminUser, disabled: creatingUser, className: "px-6 py-3 rounded-2xl bg-navy text-white flex items-center gap-2 disabled:opacity-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
          creatingUser ? "Criando..." : "Criar usuário"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border bg-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-navy", children: "Usuários cadastrados" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Controle de acessos do painel administrativo." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-secondary/70 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "E-mail" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "Tipo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "Produtos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "Pedidos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "Relatórios" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "Dúvidas" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "Usuários" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "Ações" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: users.map((user) => {
            const master = user.role === "admin_master";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 font-medium text-navy", children: user.email || user.id }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: master ? "Admin master" : "Vendedor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: master || user.can_products ? "Sim" : "Não" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: master || user.can_orders ? "Sim" : "Não" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: master || user.can_reports ? "Sim" : "Não" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: master || user.can_faqs ? "Sim" : "Não" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: master || user.can_users ? "Sim" : "Não" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: user.id !== currentProfile?.id ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeUserAccess(user), className: "rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100", children: "Remover acesso" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Você" }) })
            ] }, user.id);
          }) })
        ] }) })
      ] })
    ] })
  ] }) });
}
function InfoCard({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-secondary/60 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-navy break-words", children: value || "-" })
  ] });
}
function EditField({
  label,
  value,
  onChange,
  type = "text",
  disabled = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value, disabled, onChange: (e) => onChange(e.target.value), className: "mt-1 w-full border rounded-xl px-4 py-3 disabled:bg-secondary/60" })
  ] });
}
function RankingCard({
  title,
  rows
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border bg-card p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-navy mb-4", children: title }),
    rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Sem dados ainda." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: rows.map(([name, count], index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        index + 1,
        ". ",
        name
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: count })
    ] }, name)) })
  ] });
}
export {
  AdminPage as component
};
