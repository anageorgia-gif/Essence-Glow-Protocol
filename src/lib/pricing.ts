// Server-safe pricing source of truth. Do NOT import images here.
// The backend uses these to recompute totals — frontend cannot be trusted.

export const FORMULA_PRICES: Record<string, { name: string; price: number }> = {
  "termogenico": { name: "Termogênico Seca Tudo", price: 121 },
  "boca-fechada": { name: "Boca Fechada", price: 143 },
  "basico": { name: "Básico Bem Feito", price: 188 },
  "sono": { name: "Sono da Beleza", price: 135 },
  "cabelo": { name: "Cabelo, Pele e Unha", price: 245 },
  "lipedema-manha": { name: "Lipedema Manhã", price: 135 },
  "lipedema-noite": { name: "Lipedema Noite", price: 304 },
};

export const ECOBAG_PRICE = 70;
export const TOTAL_FORMULAS = Object.keys(FORMULA_PRICES).length; // 7

export type CheckoutComputation = {
  validIds: string[];
  invalidIds: string[];
  itemsCount: number;
  isComplete: boolean;
  subtotal: number;
  ecobag: {
    eligibleHalfOff: boolean;
    free: boolean;
    included: boolean;
    price: number;
  };
  total: number;
  lineItems: Array<{ id: string; name: string; price: number }>;
};

/**
 * Server-side checkout computation. The ONLY source of truth for totals and
 * ecobag eligibility. Never trust client-provided pricing.
 *
 * Rules:
 * - Ecobag is FREE when the patient buys the complete protocol (all formulas).
 * - Ecobag is 50% OFF when the patient buys 4+ formulas AND opts in.
 * - Otherwise ecobag is not included.
 */
export function computeCheckout(input: {
  formulaIds: string[];
  wantsEcobag: boolean;
}): CheckoutComputation {
  // De-duplicate and validate ids server-side
  const unique = Array.from(new Set(input.formulaIds));
  const validIds = unique.filter((id) => id in FORMULA_PRICES);
  const invalidIds = unique.filter((id) => !(id in FORMULA_PRICES));

  const lineItems = validIds.map((id) => ({
    id,
    name: FORMULA_PRICES[id].name,
    price: FORMULA_PRICES[id].price,
  }));

  const subtotal = lineItems.reduce((s, li) => s + li.price, 0);
  const itemsCount = lineItems.length;
  const isComplete = itemsCount >= TOTAL_FORMULAS;

  const eligibleHalfOff = !isComplete && itemsCount >= 4;
  const free = isComplete;
  const included = free || (eligibleHalfOff && input.wantsEcobag === true);
  const ecobagPrice = free ? 0 : included ? ECOBAG_PRICE * 0.5 : 0;

  return {
    validIds,
    invalidIds,
    itemsCount,
    isComplete,
    subtotal,
    ecobag: { eligibleHalfOff, free, included, price: ecobagPrice },
    total: subtotal + ecobagPrice,
    lineItems,
  };
}
