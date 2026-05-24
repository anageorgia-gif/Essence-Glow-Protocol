import termogenicoImg from "@/assets/seca/termogenico.jpg";
import bocaImg from "@/assets/seca/boca-fechada.jpg";
import basicoImg from "@/assets/seca/basico.jpg";
import sonoImg from "@/assets/seca/sono.jpg";
import cabeloImg from "@/assets/seca/cabelo.jpg";
import lipManhaImg from "@/assets/seca/lipedema-manha.jpg";
import lipNoiteImg from "@/assets/seca/lipedema-noite.jpg";

export type Formula = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  benefits: string[];
  posology: string;
  formula: string[];
};

export const FORMULAS: Formula[] = [
  {
    id: "termogenico",
    name: "Termogênico Seca Tudo",
    price: 121,
    image: termogenicoImg,
    description:
      "Estimula o metabolismo e aumenta o gasto energético, contribuindo para a queima de gordura e mais disposição ao longo do dia.",
    benefits: ["Auxilia na queima de gordura", "Mais disposição", "Estímulo metabólico"],
    posology: "1 cápsula pela manhã + 1 no início da tarde (evitar à noite).",
    formula: [
      "Cafeína Anidra — 150 mg",
      "Chá Verde — 200 mg",
      "Citrus Aurantium — 100 mg",
      "Gengibre — 100 mg",
      "Piperina — 5 mg",
    ],
  },
  {
    id: "boca-fechada",
    name: "Boca Fechada",
    price: 143,
    image: bocaImg,
    description:
      "Auxilia no controle do apetite e da compulsão alimentar, ajudando na saciedade e no equilíbrio da ingestão ao longo do dia.",
    benefits: ["Controle do apetite", "Saciedade", "Auxílio contra compulsão alimentar"],
    posology: "Antes do almoço e jantar.",
    formula: [
      "Psyllium — 300 mg",
      "Gymnema Sylvestre — 150 mg",
      "Picolinato de Cromo — 200 mcg",
      "5-HTP — 50 mg",
      "Garcinia Cambogia — 300 mg",
    ],
  },
  {
    id: "basico",
    name: "Básico Bem Feito",
    price: 188,
    image: basicoImg,
    description:
      "Suporte completo para a imunidade e o funcionamento do organismo, contribuindo para energia, recuperação e equilíbrio nutricional.",
    benefits: ["Imunidade", "Energia", "Equilíbrio nutricional"],
    posology: "1 sachê ao dia, após o café da manhã, diluído em 200 mL de água.",
    formula: [
      "Vitamina D3 — 2000 UI",
      "Vitamina C — 500 mg",
      "Zinco quelato — 15 mg",
      "Curcumina — 150 mg",
      "Betaglucana — 250 mg",
      "Glutamina — 2,5 g",
    ],
  },
  {
    id: "sono",
    name: "Sono da Beleza",
    price: 135,
    image: sonoImg,
    description:
      "Promove relaxamento e melhora da qualidade do sono, favorecendo recuperação do corpo, equilíbrio hormonal e bem-estar.",
    benefits: ["Relaxamento", "Qualidade do sono", "Recuperação do organismo"],
    posology: "1 dose antes de dormir.",
    formula: [
      "Triptofano — 300 mg",
      "Magnésio Treonato — 200 mg",
      "Melatonina — 0,21 mg",
      "Inositol — 500 mg",
      "Passiflora — 150 mg",
    ],
  },
  {
    id: "cabelo",
    name: "Cabelo, Pele e Unha",
    price: 245,
    image: cabeloImg,
    description:
      "Fortalece fios e unhas, melhora a elasticidade da pele e contribui para uma aparência mais saudável.",
    benefits: ["Fortalecimento dos fios", "Saúde da pele", "Fortalecimento das unhas"],
    posology: "1 dose ao dia.",
    formula: [
      "Biotina — 5 mg",
      "Zinco Quelato — 15 mg",
      "Vitamina C — 250 mg",
      "Selênio Quelato — 50 mcg",
      "Exsynutriment — 150 mg",
      "L-Cistina — 200 mg",
    ],
  },
  {
    id: "lipedema-manha",
    name: "Lipedema Manhã",
    price: 135,
    image: lipManhaImg,
    description:
      "Comece o dia com mais leveza, ajudando na circulação e reduzindo o inchaço ao longo da rotina.",
    benefits: ["Circulação", "Redução do inchaço", "Sensação de leveza"],
    posology: "1 dose ao acordar.",
    formula: [
      "Diosmina — 450 mg",
      "Hesperidina — 50 mg",
      "Pycnogenol — 100 mg",
      "Centella Asiatica — 150 mg",
      "Rutina — 100 mg",
    ],
  },
  {
    id: "lipedema-noite",
    name: "Lipedema Noite",
    price: 304,
    image: lipNoiteImg,
    description:
      "Trabalha enquanto você descansa, auxiliando na redução da inflamação e na melhora da aparência da pele.",
    benefits: ["Auxílio anti-inflamatório", "Melhora da aparência da pele", "Recuperação noturna"],
    posology: "1 dose antes de dormir.",
    formula: [
      "Dimpless — 40 mg",
      "Curcuvail — 100 mg",
      "Resveratrol — 100 mg",
      "Astaxantina — 4 mg",
      "Piperina — 5 mg",
    ],
  },
];

export function getDiscount(count: number): number {
  if (count >= 7) return 0.3;
  if (count >= 3) return 0.2;
  if (count >= 2) return 0.1;
  return 0;
}

export function nextThreshold(count: number): { needed: number; nextLabel: string } | null {
  if (count < 2) return { needed: 2 - count, nextLabel: "10% OFF" };
  if (count < 3) return { needed: 3 - count, nextLabel: "20% OFF" };
  if (count < 7) return { needed: 7 - count, nextLabel: "30% OFF — protocolo completo" };
  return null;
}

export const COMPLETE_PROTOCOL_PRICE = 889.9;
export const WHATSAPP_NUMBER = "5585992232371";
