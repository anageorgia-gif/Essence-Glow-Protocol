import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import letterhead from "@/assets/prescription/letterhead.jpg";
import nutritionistStamp from "@/assets/prescription/nutritionist-stamp.png";
import {
  buildPrescriptionFilename,
  getOrderNumberLabel,
  getProtocolName,
} from "@/lib/prescriptionFilename";
import { escapeHtml, imageToDataUrl } from "@/lib/pdf-utils";

export type PrescriptionFormula = {
  name: string;
  composition: string[];
  posology: string;
};

export type PrescriptionPdfInput = {
  orderId: string;
  pharmacyOrderNumber: string | null;
  patientName: string;
  patientCpf: string;
  formulas: PrescriptionFormula[];
};

function todayLong(): string {
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
    "dezembro",
  ];
  const d = new Date();
  return `Fortaleza – CE, ${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

async function ensurePrescriptionFontsLoaded(): Promise<void> {
  try {
    if (document.fonts?.load) {
      await Promise.all([
        document.fonts.load('400 12pt "Book Antiqua"'),
        document.fonts.load('700 12pt "Book Antiqua"'),
        document.fonts.load('400 12pt "Palatino Linotype"'),
      ]);
    }
  } catch {
    /* noop */
  }
}

function buildHtml(
  input: PrescriptionPdfInput,
  letterheadDataUrl: string,
  stampDataUrl: string,
): string {
  const orderNumber = getOrderNumberLabel(input.pharmacyOrderNumber, input.orderId);
  const itemNames = input.formulas.map((f) => f.name);
  const protocolName = getProtocolName(input.formulas.length, itemNames);

  const formulasHtml = input.formulas
    .map(
      (f, i) => `
        <section class="formula">
          <h3>${String(i + 1).padStart(2, "0")}. ${escapeHtml(f.name)}</h3>
          <p class="label">Composição</p>
          <ul class="composition">
            ${(f.composition.length ? f.composition : ["—"]).map((c) => `<li>${escapeHtml(c)}</li>`).join("")}
          </ul>
          <p class="label">Posologia</p>
          <p class="body">${escapeHtml(f.posology || "—")}</p>
        </section>`,
    )
    .join("");

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
        width: 220px;
        max-width: 100%;
        height: auto;
        object-fit: contain;
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
        <img class="nutritionist-stamp" src="${stampDataUrl}" alt="Carimbo Larah Nóbrega" />
      </div>
    </article>
  </div>`;
}

export async function generatePrescriptionPdf(
  input: PrescriptionPdfInput,
): Promise<{ blob: Blob; filename: string }> {
  const [letterheadDataUrl, stampDataUrl] = await Promise.all([
    imageToDataUrl(letterhead),
    imageToDataUrl(nutritionistStamp),
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

    const itemNames = input.formulas.map((f) => f.name);
    const filename = buildPrescriptionFilename({
      pharmacyOrderNumber: input.pharmacyOrderNumber,
      orderId: input.orderId,
      patientName: input.patientName,
      itemCount: input.formulas.length,
      itemNames,
    });

    return { blob: pdf.output("blob"), filename };
  } finally {
    document.body.removeChild(container);
  }
}
