import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import letterhead from "@/assets/prescription/letterhead.jpg";
import {
  buildPrescriptionFilename,
  getOrderNumberLabel,
  getProtocolName,
} from "@/lib/prescriptionFilename";
import { escapeHtml, imageToDataUrl } from "@/lib/pdf-utils";

const stampModules = import.meta.glob<{ default: string }>(
  "@/assets/prescription/nutritionist-stamp.{png,jpg,jpeg,webp,svg}",
  { eager: true },
);
const nutritionistStampUrl: string | null =
  Object.values(stampModules)[0]?.default ?? null;

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

const NUTRITIONIST = { name: "Larah Nóbrega", crn: "CRN 6197CE" };

const PAGE_WIDTH_PX = 794;
const PAGE_HEIGHT_PX = 1123;
const PAGE_TOP_PADDING_PX = 190;
const PAGE_BOTTOM_PADDING_PX = 130;
const PAGE_HORIZONTAL_PADDING_PX = 64;
const USABLE_HEIGHT_PX =
  PAGE_HEIGHT_PX - PAGE_TOP_PADDING_PX - PAGE_BOTTOM_PADDING_PX;

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

function buildStyles(letterheadDataUrl: string): string {
  return `
    #prescription-root, #prescription-root * { box-sizing: border-box; }
    #prescription-root {
      font-family: "Book Antiqua", "Palatino Linotype", Palatino, Georgia, serif;
      font-size: 11.5pt;
      line-height: 1.4;
      color: #1a1a1a;
    }
    .page {
      position: relative;
      width: ${PAGE_WIDTH_PX}px;
      height: ${PAGE_HEIGHT_PX}px;
      background-image: url('${letterheadDataUrl}');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-color: #ffffff;
      padding: ${PAGE_TOP_PADDING_PX}px ${PAGE_HORIZONTAL_PADDING_PX}px ${PAGE_BOTTOM_PADDING_PX}px ${PAGE_HORIZONTAL_PADDING_PX}px;
      -webkit-print-color-adjust: exact;
      overflow: hidden;
    }
    .page-inner {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .meta {
      text-align: right;
      font-size: 10.5pt;
      color: #444;
      margin-bottom: 12px;
    }
    .title {
      text-align: center;
      margin-bottom: 16px;
    }
    .title h1 {
      font-size: 14pt;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin: 0 0 4px;
    }
    .title p {
      margin: 0;
      font-size: 11.5pt;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 24px;
      margin-bottom: 14px;
      border: 1px solid #c8b88a;
      padding: 12px 16px;
      background: #ffffff;
    }
    .info-grid .label {
      font-size: 9.5pt;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #666;
      margin: 0;
    }
    .info-grid .value {
      margin: 2px 0 6px;
      font-size: 11.5pt;
      font-weight: 700;
    }
    .section-title {
      font-size: 11.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 6px 0 8px;
      border-bottom: 1px solid #c8b88a;
      padding-bottom: 4px;
    }
    .formulas {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .formula {
      background: #ffffff;
      border: 1px solid #ddd;
      padding: 10px 14px;
    }
    .formula h3 {
      margin: 0 0 6px;
      font-size: 11.5pt;
      font-weight: 700;
    }
    .formula .label {
      margin: 4px 0 2px;
      font-size: 10pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .formula .composition {
      margin: 0 0 4px;
      padding-left: 18px;
      font-size: 11pt;
    }
    .formula .composition li { margin: 0; }
    .formula .body {
      margin: 0;
      font-size: 11pt;
    }
    .signature {
      margin-top: auto;
      padding-top: 18px;
      text-align: center;
    }
    .nutritionist-stamp {
      width: 220px;
      max-width: 100%;
      height: auto;
      object-fit: contain;
    }
    .sig-line {
      width: 280px;
      margin: 0 auto 6px;
      border-top: 1px solid #1a1a1a;
    }
    .sig-name {
      font-size: 11.5pt;
      font-weight: 700;
    }
    .sig-role {
      font-size: 10.5pt;
      color: #555;
    }
    .page-counter {
      position: absolute;
      bottom: 8px;
      right: ${PAGE_HORIZONTAL_PADDING_PX}px;
      font-size: 9pt;
      color: #888;
    }
  `;
}

function buildFormulaHtml(f: PrescriptionFormula, index: number): string {
  return `
    <section class="formula">
      <h3>${String(index + 1).padStart(2, "0")}. ${escapeHtml(f.name)}</h3>
      <p class="label">Composição</p>
      <ul class="composition">
        ${(f.composition.length ? f.composition : ["—"])
          .map((c) => `<li>${escapeHtml(c)}</li>`)
          .join("")}
      </ul>
      <p class="label">Posologia</p>
      <p class="body">${escapeHtml(f.posology || "—")}</p>
    </section>`;
}

function buildHeaderHtml(input: PrescriptionPdfInput): string {
  const orderNumber = getOrderNumberLabel(input.pharmacyOrderNumber, input.orderId);
  const protocolName = getProtocolName(
    input.formulas.length,
    input.formulas.map((f) => f.name),
  );

  return `
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
    <p class="section-title">Fórmulas prescritas</p>`;
}

function buildContinuationHeaderHtml(): string {
  return `<p class="section-title">Fórmulas prescritas (continuação)</p>`;
}

function buildSignatureHtml(stampDataUrl: string | null): string {
  const inner = stampDataUrl
    ? `<img class="nutritionist-stamp" src="${stampDataUrl}" alt="Carimbo Larah Nóbrega" />`
    : `
        <div class="sig-line"></div>
        <div class="sig-name">${escapeHtml(NUTRITIONIST.name)}</div>
        <div class="sig-role">Nutricionista · ${escapeHtml(NUTRITIONIST.crn)}</div>
      `;
  return `<div class="signature">${inner}</div>`;
}

function buildPageHtml(opts: {
  headerHtml: string;
  formulasHtml: string;
  signatureHtml: string;
  pageNumber: number;
  totalPages: number;
}): string {
  const counter =
    opts.totalPages > 1
      ? `<div class="page-counter">Página ${opts.pageNumber} de ${opts.totalPages}</div>`
      : "";
  return `
    <article class="page">
      <div class="page-inner">
        ${opts.headerHtml}
        <div class="formulas">${opts.formulasHtml}</div>
        ${opts.signatureHtml}
      </div>
      ${counter}
    </article>`;
}

function measureFormulaHeights(
  input: PrescriptionPdfInput,
  letterheadDataUrl: string,
): { headerHeight: number; formulaHeights: number[]; signatureHeight: number; cleanup: () => void } {
  const measureContainer = document.createElement("div");
  measureContainer.id = "prescription-measure";
  measureContainer.style.cssText =
    "position:fixed;top:-20000px;left:0;width:" + PAGE_WIDTH_PX + "px;visibility:hidden;";

  const formulasHtml = input.formulas.map(buildFormulaHtml).join("");
  const signatureHtml = buildSignatureHtml(null);
  const headerHtml = buildHeaderHtml(input);

  measureContainer.innerHTML = `
    <div id="prescription-root">
      <style>${buildStyles(letterheadDataUrl)}</style>
      <article class="page" style="height:auto;min-height:0;">
        <div class="page-inner" style="height:auto;">
          ${headerHtml}
          <div class="formulas">${formulasHtml}</div>
          ${signatureHtml}
        </div>
      </article>
    </div>`;
  document.body.appendChild(measureContainer);

  const formulaElements = Array.from(
    measureContainer.querySelectorAll<HTMLElement>(".formula"),
  );
  const signatureElement = measureContainer.querySelector<HTMLElement>(".signature");
  const sectionTitleElement = measureContainer.querySelector<HTMLElement>(".section-title");

  let headerHeight = 0;
  if (sectionTitleElement) {
    const rect = sectionTitleElement.getBoundingClientRect();
    const pageEl = measureContainer.querySelector<HTMLElement>(".page");
    if (pageEl) {
      const pageRect = pageEl.getBoundingClientRect();
      headerHeight = rect.bottom - pageRect.top - PAGE_TOP_PADDING_PX + 4;
    }
  }

  const gap = 10;
  const formulaHeights = formulaElements.map((el) => el.offsetHeight + gap);
  const signatureHeight = signatureElement
    ? signatureElement.offsetHeight + 18
    : 200;

  return {
    headerHeight,
    formulaHeights,
    signatureHeight,
    cleanup: () => document.body.removeChild(measureContainer),
  };
}

type PageLayout = {
  isFirst: boolean;
  formulaIndices: number[];
};

function paginate(
  headerHeight: number,
  formulaHeights: number[],
  signatureHeight: number,
): PageLayout[] {
  const pages: PageLayout[] = [];
  const continuationHeaderHeight = 40;

  let current: PageLayout = { isFirst: true, formulaIndices: [] };
  let used = headerHeight;

  const availableWithoutSignature = USABLE_HEIGHT_PX;
  const availableWithSignature = USABLE_HEIGHT_PX - signatureHeight;

  for (let i = 0; i < formulaHeights.length; i++) {
    const isLastFormula = i === formulaHeights.length - 1;
    const limit = isLastFormula ? availableWithSignature : availableWithoutSignature;
    const fits = used + formulaHeights[i] <= limit;

    if (!fits && current.formulaIndices.length > 0) {
      pages.push(current);
      current = { isFirst: false, formulaIndices: [] };
      used = continuationHeaderHeight;
    }
    current.formulaIndices.push(i);
    used += formulaHeights[i];
  }

  pages.push(current);

  const lastPage = pages[pages.length - 1];
  const lastPageHeader = lastPage.isFirst ? headerHeight : continuationHeaderHeight;
  const lastPageFormulaHeight = lastPage.formulaIndices.reduce(
    (sum, idx) => sum + formulaHeights[idx],
    0,
  );

  if (lastPageHeader + lastPageFormulaHeight + signatureHeight > USABLE_HEIGHT_PX) {
    pages.push({ isFirst: false, formulaIndices: [] });
  }

  return pages;
}

function buildDocumentHtml(
  input: PrescriptionPdfInput,
  letterheadDataUrl: string,
  stampDataUrl: string | null,
  pages: PageLayout[],
): string {
  const headerHtml = buildHeaderHtml(input);
  const continuationHeaderHtml = buildContinuationHeaderHtml();
  const signatureHtml = buildSignatureHtml(stampDataUrl);

  const pagesHtml = pages
    .map((page, idx) => {
      const isLast = idx === pages.length - 1;
      const pageHeader = page.isFirst ? headerHtml : continuationHeaderHtml;
      const formulasHtml = page.formulaIndices
        .map((i) => buildFormulaHtml(input.formulas[i], i))
        .join("");
      const pageSignatureHtml = isLast ? signatureHtml : "";

      return buildPageHtml({
        headerHtml: pageHeader,
        formulasHtml,
        signatureHtml: pageSignatureHtml,
        pageNumber: idx + 1,
        totalPages: pages.length,
      });
    })
    .join("");

  return `
    <div id="prescription-root">
      <style>${buildStyles(letterheadDataUrl)}</style>
      ${pagesHtml}
    </div>`;
}

export async function generatePrescriptionPdf(
  input: PrescriptionPdfInput,
): Promise<{ blob: Blob; filename: string }> {
  const [letterheadDataUrl, stampDataUrl] = await Promise.all([
    imageToDataUrl(letterhead),
    nutritionistStampUrl
      ? imageToDataUrl(nutritionistStampUrl)
      : Promise.resolve<string | null>(null),
  ]);
  await ensurePrescriptionFontsLoaded();

  const measurement = measureFormulaHeights(input, letterheadDataUrl);
  let pages: PageLayout[];
  try {
    pages = paginate(
      measurement.headerHeight,
      measurement.formulaHeights,
      measurement.signatureHeight,
    );
  } finally {
    measurement.cleanup();
  }

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-10000px";
  container.style.left = "0";
  container.style.width = `${PAGE_WIDTH_PX}px`;
  container.style.background = "#fff";
  container.innerHTML = buildDocumentHtml(input, letterheadDataUrl, stampDataUrl, pages);
  document.body.appendChild(container);

  try {
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageWidthMm = 210;
    const pageHeightMm = 297;

    const pageElements = container.querySelectorAll<HTMLElement>(".page");
    for (let i = 0; i < pageElements.length; i++) {
      const canvas = await html2canvas(pageElements[i], {
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
