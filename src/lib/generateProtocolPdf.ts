import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import letterhead from "@/assets/seca/letterhead.jpg";
import type { Formula } from "@/lib/formulas";

export type ProtocolPdfInput = {
  patientName: string;
  patientCpf: string;
  patientPhone: string;
  patientEmail?: string;
  formulas: Formula[];
  nutritionist?: { name: string; crn: string };
};

function todayLong(): string {
  const months = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
  ];
  const d = new Date();
  return `Fortaleza – CE, ${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

function objectiveFor(formulas: Formula[]): string {
  const ids = new Set(formulas.map((f) => f.id));
  const goals: string[] = [];
  if (ids.has("termogenico")) goals.push("estímulo do metabolismo e queima de gordura");
  if (ids.has("boca-fechada")) goals.push("controle do apetite e da compulsão alimentar");
  if (ids.has("basico")) goals.push("suporte imunológico e equilíbrio nutricional");
  if (ids.has("sono")) goals.push("melhora da qualidade do sono e recuperação noturna");
  if (ids.has("cabelo")) goals.push("fortalecimento de cabelos, pele e unhas");
  if (ids.has("lipedema-manha") || ids.has("lipedema-noite"))
    goals.push("redução do inchaço, suporte circulatório e ação anti-inflamatória");
  const base =
    "Este plano personalizado de suplementação tem como finalidade promover ";
  if (goals.length === 0)
    return base + "o bem-estar integral, o equilíbrio metabólico e a saúde geral da paciente.";
  if (goals.length === 1) return base + goals[0] + ".";
  return (
    base +
    goals.slice(0, -1).join(", ") +
    " e " +
    goals[goals.length - 1] +
    ", de forma integrada à rotina da paciente."
  );
}

function buildHtml(input: ProtocolPdfInput, letterheadDataUrl: string): string {
  const nutri = input.nutritionist ?? { name: "Larah Nóbrega", crn: "CRN 6197CE" };
  const formulasHtml = input.formulas
    .map(
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
    )
    .join("");

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
        ${
          input.patientEmail
            ? `<div><div class="label">E-mail</div><div class="value">${escapeHtml(input.patientEmail)}</div></div>`
            : ""
        }
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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function imageToDataUrl(src: string): Promise<string> {
  const res = await fetch(src);
  const blob = await res.blob();
  return await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

async function ensurePoppinsLoaded(): Promise<void> {
  try {
    // @ts-ignore
    if (document.fonts && document.fonts.load) {
      await Promise.all([
        // @ts-ignore
        document.fonts.load("400 12px Poppins"),
        // @ts-ignore
        document.fonts.load("600 14px Poppins"),
      ]);
    }
  } catch {
    /* noop */
  }
}

export async function generateProtocolPdf(
  input: ProtocolPdfInput
): Promise<{ blob: Blob; filename: string }> {
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

    const pages = container.querySelectorAll<HTMLElement>(".page");
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, 0, pageWidthMm, pageHeightMm, undefined, "FAST");
    }

    const safeName = input.patientName.replace(/[^a-zA-Z0-9-_ ]/g, "").trim().replace(/\s+/g, "_");
    const filename = `Protocolo_Seca_Tudo_${safeName || "Paciente"}.pdf`;
    const blob = pdf.output("blob");
    return { blob, filename };
  } finally {
    document.body.removeChild(container);
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function printBlob(blob: Blob) {
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
        /* noop */
      }
    }, 200);
  };
  document.body.appendChild(iframe);
  setTimeout(() => {
    iframe.remove();
    URL.revokeObjectURL(url);
  }, 60_000);
}
