const COMPLETE_PROTOCOL_ITEM_COUNT = 7;

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

export function getPatientFirstName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return "Paciente";
  return trimmed.split(/\s+/)[0] ?? "Paciente";
}

export function getProtocolName(itemCount: number, itemNames: string[]): string {
  if (itemCount >= COMPLETE_PROTOCOL_ITEM_COUNT) {
    return "Protocolo Seca Tudo";
  }
  if (itemNames.length === 1) {
    return itemNames[0];
  }
  return "Protocolo Personalizado Seca Tudo";
}

export function getOrderNumberLabel(
  pharmacyOrderNumber: string | null | undefined,
  orderId: string,
): string {
  const pcp = pharmacyOrderNumber?.trim();
  if (pcp) return pcp;
  return `PED-${orderId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function buildPrescriptionFilename(opts: {
  pharmacyOrderNumber: string | null | undefined;
  orderId: string;
  patientName: string;
  itemCount: number;
  itemNames: string[];
}): string {
  const orderNumber = getOrderNumberLabel(opts.pharmacyOrderNumber, opts.orderId);
  const firstName = slugify(getPatientFirstName(opts.patientName)) || "Paciente";
  const protocol = slugify(getProtocolName(opts.itemCount, opts.itemNames)) || "Protocolo";
  return `${orderNumber}-${firstName}-${protocol}.pdf`;
}
