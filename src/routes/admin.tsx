import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { COMPLETE_PROTOCOL_PRICE, getDiscount } from "@/lib/formulas";
import { generatePrescriptionPdf } from "@/lib/generatePrescriptionPdf";
import { blobToBase64, downloadBlob, printBlob } from "@/lib/pdf-utils";
import {
  Plus,
  Trash2,
  Save,
  LogOut,
  Eye,
  EyeOff,
  Upload,
  Package,
  ShoppingBag,
  FileSpreadsheet,
  Download,
  Pencil,
  Printer,
  Loader2,
  FileText,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type Tab = "products" | "orders" | "reports" | "faqs" | "users";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  benefits: string[];
  formula: string[];
  posology: string;
  active: boolean;
  sort_order: number;
};

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price?: number;
  unit_price?: number;
  total_price?: number;
};

type Order = {
  id: string;
  customer_name: string;
  customer_cpf: string;
  customer_phone: string;
  customer_email: string | null;
  payment_method: string;
  region: string;
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  created_at: string;
  pharmacy_order_number: string | null;
  tracking_code: string | null;
  responsible_name: string | null;
  system_inclusion_date: string | null;
  delivery_date: string | null;
  prescription_pdf_path: string | null;
  prescription_pdf_filename: string | null;
  order_items?: OrderItem[];
};

type AdminProfile = {
  id: string;
  email: string | null;
  role: string | null;
  can_products: boolean | null;
  can_orders: boolean | null;
  can_reports: boolean | null;
  can_faqs: boolean | null;
  can_users: boolean | null;
};

type FAQ = {
  id: string;
  question: string;
  answer: string;
  active: boolean;
  sort_order: number;
  created_at?: string;
};

type NewUserForm = {
  email: string;
  password: string;
  role: "vendedor" | "admin_master";
};

const STATUS_OPTIONS = [
  { value: "novo", label: "Novo" },
  { value: "em_atendimento", label: "Em atendimento" },
  { value: "aguardando_pagamento", label: "Aguardando pagamento" },
  { value: "nao_finalizado", label: "Não finalizado" },
  { value: "pago", label: "Pago" },
  { value: "manipulando", label: "Manipulando" },
  { value: "enviado", label: "Enviado" },
  { value: "entregue", label: "Entregue" },
  { value: "cancelado", label: "Cancelado" },
];

const CONFIRMED_STATUSES = ["pago", "manipulando", "enviado", "entregue"];
const NOT_FINALIZED_STATUSES = ["nao_finalizado", "cancelado", "aguardando_pagamento"];
const PRESCRIPTION_STATUSES = ["pago", "manipulando"];

function emptyProduct(): Product {
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
    sort_order: 999,
  };
}

function emptyFaq(): FAQ {
  return {
    id: crypto.randomUUID(),
    question: "",
    answer: "",
    active: true,
    sort_order: 999,
  };
}

const formatBRL = (value: number) =>
  Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("pt-BR");
};

const formatDate = (value?: string | null) => {
  if (!value) return "";
  return value.slice(0, 10);
};

function escapeCsv(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function getOrderFormulas(order: Order) {
  return (order.order_items ?? [])
    .map((item) => `${item.quantity || 1}x ${item.product_name}`)
    .join(" | ");
}

function getStatusLabel(status: string) {
  return STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

function getOrderItemsCount(order: Order) {
  return (order.order_items ?? []).reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );
}

function getItemTotal(item: OrderItem) {
  return Number(
    item.total_price ??
      (item.unit_price ? item.unit_price * (item.quantity || 1) : item.price ?? 0)
  );
}
function getAvailableProductsForOrder(order: Order, catalog: Product[]) {
  const existingProductIds = new Set(
    (order.order_items ?? []).map((item) => item.product_id)
  );

  return catalog.filter(
    (product) => product.active && !existingProductIds.has(product.id)
  );
}

function recalculateOrderTotals(order: Order) {
  const subtotal = (order.order_items ?? []).reduce(
    (sum, item) => sum + getItemTotal(item),
    0
  );
  const count = getOrderItemsCount(order);
  const isComplete = count >= 7;
  const discountRate = getDiscount(count);
  const formulaTotal = isComplete
    ? COMPLETE_PROTOCOL_PRICE
    : subtotal * (1 - discountRate);
  const savings = subtotal - formulaTotal;
  const previousFormulaTotal =
    Number(order.subtotal || 0) - Number(order.discount || 0);
  const extras = Number(order.total || 0) - previousFormulaTotal;

  return {
    subtotal,
    discount: savings,
    total: formulaTotal + extras,
  };
}


function buildPrescriptionFormulas(order: Order, productsById: Map<string, Product>) {
  return (order.order_items ?? []).map((item) => {
    const product = productsById.get(item.product_id);
    return {
      name: item.product_name,
      composition: product?.formula?.filter(Boolean) ?? [],
      posology: product?.posology?.trim() || "—",
    };
  });
}

async function getAdminAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) {
    throw new Error("Sessão expirada. Faça login novamente.");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [users, setUsers] = useState<AdminProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<AdminProfile | null>(null);
  const [newUser, setNewUser] = useState<NewUserForm>({
    email: "",
    password: "",
    role: "vendedor",
  });
  const [creatingUser, setCreatingUser] = useState(false);
  const [editingOrders, setEditingOrders] = useState<Record<string, boolean>>({});
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);
  const [savedOrderId, setSavedOrderId] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [selectedProductByOrder, setSelectedProductByOrder] = useState<
    Record<string, string>
  >({});
  const [addingProductOrderId, setAddingProductOrderId] = useState<string | null>(
    null
  );
  const [generatingPrescriptionId, setGeneratingPrescriptionId] = useState<string | null>(
    null,
  );
  const [prescriptionActionId, setPrescriptionActionId] = useState<string | null>(null);
  const [prescriptionErrors, setPrescriptionErrors] = useState<Record<string, string>>({});

  const productsById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const isMaster = currentProfile?.role === "admin_master";
  const canProducts = isMaster || currentProfile?.can_products === true;
  const canOrders = isMaster || currentProfile?.can_orders === true;
  const canReports = isMaster || currentProfile?.can_reports === true;
  const canFaqs = isMaster || currentProfile?.can_faqs === true;
  const canUsers = isMaster || currentProfile?.can_users === true;

  useEffect(() => {
    init();
  }, []);

  async function init() {
    await checkAdmin();
  }

  async function checkAdmin() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      if (!user) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, role, can_products, can_orders, can_reports, can_faqs, can_users")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error(error);
        setAuthorized(false);
        setLoading(false);
        return;
      }

      const profile = data as AdminProfile | null;
      const hasAccess =
        profile?.role === "admin_master" ||
        profile?.can_products === true ||
        profile?.can_orders === true ||
        profile?.can_reports === true ||
        profile?.can_faqs === true ||
        profile?.can_users === true;

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
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("sort_order");

    if (data) {
      setProducts(data as Product[]);
    }
  }

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setOrders(data as Order[]);
    }
  }


  async function loadFaqs() {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setFaqs(data as FAQ[]);
    }
  }

  async function loadUsers() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, role, can_products, can_orders, can_reports, can_faqs, can_users")
      .order("email", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setUsers(data as AdminProfile[]);
    }
  }

  async function saveProduct(product: Product) {
    const cleaned = {
      ...product,
      benefits: product.benefits.filter(Boolean),
      formula: product.formula.filter(Boolean),
    };

    const { error } = await supabase.from("products").upsert(cleaned);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    alert("Produto salvo!");
    await loadProducts();
  }

  async function deleteProduct(id: string) {
    const confirmed = confirm("Deseja excluir este produto?");
    if (!confirmed) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadProducts();
  }


  async function saveFaq(faq: FAQ) {
    const cleaned = {
      id: faq.id,
      question: faq.question.trim(),
      answer: faq.answer.trim(),
      active: faq.active,
      sort_order: Number(faq.sort_order || 0),
    };

    if (!cleaned.question || !cleaned.answer) {
      alert("Preencha a pergunta e a resposta.");
      return;
    }

    const { error } = await supabase.from("faqs").upsert(cleaned);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Dúvida salva!");
    await loadFaqs();
  }

  async function deleteFaq(id: string) {
    const confirmed = confirm("Deseja excluir esta dúvida frequente?");
    if (!confirmed) return;

    const { error } = await supabase.from("faqs").delete().eq("id", id);

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

    const { data, error } = await supabase.functions.invoke("create-admin-user", {
      body: {
        email: newUser.email.trim(),
        password: newUser.password,
        role: newUser.role,
      },
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
    setNewUser({ email: "", password: "", role: "vendedor" });
    await loadUsers();
  }

  async function removeUserAccess(user: AdminProfile) {
    if (user.id === currentProfile?.id) {
      alert("Você não pode remover seu próprio acesso.");
      return;
    }

    const confirmed = confirm(`Remover acesso de ${user.email}?`);
    if (!confirmed) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        role: "bloqueado",
        can_products: false,
        can_orders: false,
        can_reports: false,
        can_faqs: false,
        can_users: false,
      })
      .eq("id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Acesso removido.");
    await loadUsers();
  }

  async function addProductToOrder(order: Order) {
    const productId = selectedProductByOrder[order.id];

    if (!productId) {
      alert("Selecione um produto para adicionar.");
      return;
    }

    const product = products.find((current) => current.id === productId);

    if (!product) {
      alert("Produto não encontrado.");
      return;
    }

    const alreadyAdded = (order.order_items ?? []).some(
      (item) => item.product_id === product.id
    );

    if (alreadyAdded) {
      alert("Este produto já está no pedido.");
      return;
    }

    setAddingProductOrderId(order.id);

    const unitPrice = Number(product.price);

    const { data: insertedItem, error: itemError } = await supabase
      .from("order_items")
      .insert({
        order_id: order.id,
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        price: unitPrice,
        unit_price: unitPrice,
        total_price: unitPrice,
      })
      .select("*")
      .single();

    if (itemError || !insertedItem) {
      setAddingProductOrderId(null);
      alert(itemError?.message ?? "Erro ao adicionar produto.");
      return;
    }

    const updatedOrder: Order = {
      ...order,
      order_items: [...(order.order_items ?? []), insertedItem as OrderItem],
    };
    const totals = recalculateOrderTotals(updatedOrder);
    const hadPrescription = Boolean(order.prescription_pdf_path);

    const orderUpdatePayload: Record<string, unknown> = { ...totals };
    if (hadPrescription) {
      orderUpdatePayload.prescription_pdf_path = null;
      orderUpdatePayload.prescription_pdf_filename = null;
    }

    const { error: orderError } = await supabase
      .from("orders")
      .update(orderUpdatePayload)
      .eq("id", order.id);

    setAddingProductOrderId(null);

    if (orderError) {
      alert(orderError.message);
      await loadOrders();
      return;
    }

    const refreshedOrder: Order = {
      ...updatedOrder,
      ...totals,
      ...(hadPrescription
        ? { prescription_pdf_path: null, prescription_pdf_filename: null }
        : {}),
    };

    setOrders((prev) =>
      prev.map((current) =>
        current.id === order.id ? refreshedOrder : current
      )
    );

    setSelectedProductByOrder((prev) => ({
      ...prev,
      [order.id]: "",
    }));

    if (
      hadPrescription &&
      PRESCRIPTION_STATUSES.includes(refreshedOrder.status)
    ) {
      await ensurePrescriptionForOrder(refreshedOrder, { downloadOnFailure: false });
      alert("Produto adicionado e prescrição atualizada.");
    } else {
      alert("Produto adicionado ao pedido.");
    }
  }

  async function fetchPrescriptionSignedUrl(orderId: string) {
    const headers = await getAdminAuthHeaders();
    const res = await fetch(
      `/api/admin/orders/prescription-url?order_id=${encodeURIComponent(orderId)}`,
      { headers },
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "Não foi possível obter a prescrição.");
    }
    return data as { url: string; filename: string };
  }

  async function refreshOrder(orderId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .maybeSingle();

    if (error) {
      console.error(error);
      return null;
    }

    if (data) {
      setOrders((prev) =>
        prev.map((current) => (current.id === orderId ? (data as Order) : current)),
      );
      return data as Order;
    }

    return null;
  }

  async function ensurePrescriptionForOrder(order: Order, opts?: { downloadOnFailure?: boolean }) {
    if (order.prescription_pdf_path) return order;
    if (!PRESCRIPTION_STATUSES.includes(order.status)) return order;
    if (!(order.order_items ?? []).length) {
      const message = "Este pedido não possui itens. Não é possível gerar a prescrição.";
      setPrescriptionErrors((prev) => ({ ...prev, [order.id]: message }));
      alert(message);
      return order;
    }

    setGeneratingPrescriptionId(order.id);
    setPrescriptionErrors((prev) => {
      const next = { ...prev };
      delete next[order.id];
      return next;
    });

    try {
      const formulas = buildPrescriptionFormulas(order, productsById);
      const { blob, filename } = await generatePrescriptionPdf({
        orderId: order.id,
        pharmacyOrderNumber: order.pharmacy_order_number,
        patientName: order.customer_name,
        patientCpf: order.customer_cpf,
        formulas,
      });

      const headers = await getAdminAuthHeaders();
      const res = await fetch("/api/admin/orders/prescription", {
        method: "POST",
        headers,
        body: JSON.stringify({
          order_id: order.id,
          pdf_base64: await blobToBase64(blob),
          pdf_filename: filename,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message =
          data.error ||
          "Falha ao salvar a prescrição no servidor. Verifique Supabase e migration.";
        setPrescriptionErrors((prev) => ({ ...prev, [order.id]: message }));
        if (opts?.downloadOnFailure) {
          downloadBlob(blob, filename);
        }
        throw new Error(message);
      }

      const refreshed = await refreshOrder(order.id);
      return refreshed ?? {
        ...order,
        prescription_pdf_path: data.prescription_pdf_path,
        prescription_pdf_filename: data.prescription_pdf_filename,
      };
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao gerar a prescrição. O pedido foi salvo normalmente.";
      setPrescriptionErrors((prev) => ({ ...prev, [order.id]: message }));
      alert(message);
      return order;
    } finally {
      setGeneratingPrescriptionId(null);
    }
  }

  async function viewPrescription(order: Order) {
    if (!order.prescription_pdf_path) return;
    setPrescriptionActionId(order.id);
    try {
      const { url } = await fetchPrescriptionSignedUrl(order.id);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao abrir prescrição.");
    } finally {
      setPrescriptionActionId(null);
    }
  }

  async function downloadPrescription(order: Order) {
    if (!order.prescription_pdf_path) return;
    setPrescriptionActionId(order.id);
    try {
      const { url, filename } = await fetchPrescriptionSignedUrl(order.id);
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

  async function printPrescription(order: Order) {
    if (!order.prescription_pdf_path) return;
    setPrescriptionActionId(order.id);
    try {
      const { url } = await fetchPrescriptionSignedUrl(order.id);
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

  async function saveOrder(order: Order, successMessage = "Pedido atualizado!") {
    setSavingOrderId(order.id);
    setSavedOrderId(null);

    const payload = {
      status: order.status,
      pharmacy_order_number: order.pharmacy_order_number || null,
      tracking_code: order.tracking_code || null,
      responsible_name: order.responsible_name || null,
      system_inclusion_date: order.system_inclusion_date || null,
      delivery_date: order.delivery_date || null,
    };

    const { error } = await supabase
      .from("orders")
      .update(payload)
      .eq("id", order.id);

    setSavingOrderId(null);

    if (error) {
      alert(error.message);
      return false;
    }

    setOrders((prev) =>
      prev.map((current) =>
        current.id === order.id
          ? {
              ...current,
              ...payload,
            }
          : current
      )
    );

    setEditingOrders((prev) => ({
      ...prev,
      [order.id]: false,
    }));

    setSavedOrderId(order.id);

    const updatedOrder = { ...order, ...payload };

    if (
      PRESCRIPTION_STATUSES.includes(updatedOrder.status) &&
      !updatedOrder.prescription_pdf_path
    ) {
      await ensurePrescriptionForOrder(updatedOrder, { downloadOnFailure: true });
    }

    await loadOrders();
    alert(successMessage);
    return true;
  }

  async function markOrderNotFinalized(order: Order) {
    const confirmed = confirm(
      "Marcar este pedido como não finalizado? Use esta opção quando o cliente desistiu ou não concluiu o pedido pelo WhatsApp."
    );

    if (!confirmed) return;

    await saveOrder(
      {
        ...order,
        status: "nao_finalizado",
        delivery_date: null,
      },
      "Pedido marcado como não finalizado."
    );
  }

  async function cancelOrder(order: Order) {
    const confirmed = confirm("Cancelar este pedido?");
    if (!confirmed) return;

    await saveOrder(
      {
        ...order,
        status: "cancelado",
        delivery_date: null,
      },
      "Pedido cancelado."
    );
  }

  async function deleteOrder(order: Order) {
    const confirmed = confirm(
      "Excluir este pedido definitivamente? Esta ação remove o pedido do painel e dos relatórios."
    );

    if (!confirmed) return;

    const { error } = await supabase.from("orders").delete().eq("id", order.id);

    if (error) {
      alert(error.message);
      return;
    }

    setOrders((prev) => prev.filter((current) => current.id !== order.id));
    alert("Pedido excluído.");
  }

  function updateProduct(id: string, field: keyof Product, value: any) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              [field]: value,
            }
          : p
      )
    );
  }


  function updateFaq(id: string, field: keyof FAQ, value: any) {
    setFaqs((prev) =>
      prev.map((faq) =>
        faq.id === id
          ? {
              ...faq,
              [field]: value,
            }
          : faq
      )
    );
  }

  function updateOrder(id: string, field: keyof Order, value: any) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              [field]: value,
            }
          : order
      )
    );
  }

  const reportRows = useMemo(() => {
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
      dataPedido: order.created_at,
    }));
  }, [orders]);

  const pedidosConfirmados = orders.filter((order) =>
    CONFIRMED_STATUSES.includes(order.status)
  );

  const pedidosNaoFinalizados = orders.filter((order) =>
    NOT_FINALIZED_STATUSES.includes(order.status)
  );

  const totalSolicitado = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const totalConfirmado = pedidosConfirmados.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const totalNaoFinalizado = pedidosNaoFinalizados.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const formulasSolicitadas = useMemo(() => {
    const map = new Map<string, number>();

    orders.forEach((order) => {
      (order.order_items ?? []).forEach((item) => {
        map.set(
          item.product_name,
          (map.get(item.product_name) ?? 0) + (item.quantity || 1)
        );
      });
    });

    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [orders]);

  const formulasVendidas = useMemo(() => {
    const map = new Map<string, number>();

    pedidosConfirmados.forEach((order) => {
      (order.order_items ?? []).forEach((item) => {
        map.set(
          item.product_name,
          (map.get(item.product_name) ?? 0) + (item.quantity || 1)
        );
      });
    });

    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [pedidosConfirmados]);

  const formulasFaturamento = useMemo(() => {
    const map = new Map<
      string,
      {
        quantidade: number;
        faturamento: number;
      }
    >();

    pedidosConfirmados.forEach((order) => {
      (order.order_items ?? []).forEach((item) => {
        const current = map.get(item.product_name) ?? {
          quantidade: 0,
          faturamento: 0,
        };

        map.set(item.product_name, {
          quantidade: current.quantidade + (item.quantity || 1),
          faturamento: current.faturamento + getItemTotal(item),
        });
      });
    });

    return [...map.entries()].sort(
      (a, b) => b[1].faturamento - a[1].faturamento
    );
  }, [pedidosConfirmados]);

  function exportCsv() {
    const pedidosHeader = [
      "PCP",
      "Cliente",
      "Telefone",
      "CPF",
      "Fórmulas solicitadas",
      "Quantidade de itens",
      "Subtotal",
      "Desconto",
      "Valor total",
      "Status",
      "Rastreio",
      "Responsável",
      "Pagamento",
      "Região",
      "Data da inclusão no sistema",
      "Data de entrega",
      "Data do pedido no site",
    ];

    const pedidosRows = orders.map((order) => [
      order.pharmacy_order_number ?? "",
      order.customer_name,
      order.customer_phone,
      order.customer_cpf,
      getOrderFormulas(order),
      getOrderItemsCount(order),
      Number(order.subtotal || 0).toFixed(2).replace(".", ","),
      Number(order.discount || 0).toFixed(2).replace(".", ","),
      Number(order.total || 0).toFixed(2).replace(".", ","),
      getStatusLabel(order.status),
      order.tracking_code ?? "",
      order.responsible_name ?? "",
      order.payment_method,
      order.region,
      order.system_inclusion_date ?? "",
      order.delivery_date ?? "",
      formatDateTime(order.created_at),
    ]);

    const formulasHeader = [
      "Fórmula",
      "Quantidade vendida",
      "Faturamento confirmado",
    ];

    const formulasRows = formulasFaturamento.map(([name, data]) => [
      name,
      data.quantidade,
      data.faturamento.toFixed(2).replace(".", ","),
    ]);

    const resumoHeader = ["Indicador", "Valor"];
    const resumoRows = [
      ["Pedidos recebidos", orders.length],
      ["Pedidos confirmados", pedidosConfirmados.length],
      ["Pedidos não finalizados/cancelados/aguardando", pedidosNaoFinalizados.length],
      ["Total solicitado", totalSolicitado.toFixed(2).replace(".", ",")],
      ["Total confirmado", totalConfirmado.toFixed(2).replace(".", ",")],
      ["Total não finalizado", totalNaoFinalizado.toFixed(2).replace(".", ",")],
      [
        "Conversão",
        orders.length
          ? `${Math.round((pedidosConfirmados.length / orders.length) * 100)}%`
          : "0%",
      ],
    ];

    const csv = [
      ["RELATÓRIO DE PEDIDOS"],
      pedidosHeader,
      ...pedidosRows,
      [],
      ["RESUMO"],
      resumoHeader,
      ...resumoRows,
      [],
      ["FÓRMULAS MAIS VENDIDAS / FATURAMENTO"],
      formulasHeader,
      ...formulasRows,
    ]
      .map((line) => line.map(escapeCsv).join(";"))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
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
        <div><small>Conversão</small><strong>${orders.length ? Math.round((pedidosConfirmados.length / orders.length) * 100) : 0}%</strong></div>
      </div>
    `;

    const formulasHtml = formulasFaturamento.length
      ? formulasFaturamento
          .map(
            ([name, data], index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${name}</td>
                <td>${data.quantidade}</td>
                <td>${formatBRL(data.faturamento)}</td>
              </tr>
            `
          )
          .join("")
      : `<tr><td colspan="4">Sem dados de vendas confirmadas.</td></tr>`;

    const pedidosHtml = orders
      .map(
        (order) => `
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
        `
      )
      .join("");

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
          <p>Gerado em ${new Date().toLocaleString("pt-BR")}</p>
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gold">
              Painel administrativo
            </p>

            <h1 className="text-4xl font-display text-navy">
              {tab === "products"
                ? "Produtos"
                : tab === "orders"
                  ? "Pedidos"
                  : tab === "reports"
                    ? "Relatórios"
                    : tab === "faqs"
                      ? "Dúvidas frequentes"
                      : "Usuários"}
            </h1>
          </div>

          <div className="flex gap-3">
            {tab === "products" && canProducts && (
              <button
                onClick={() => setProducts((prev) => [...prev, emptyProduct()])}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gold text-navy font-medium"
              >
                <Plus className="h-4 w-4" />
                Novo produto
              </button>
            )}

            {tab === "faqs" && canFaqs && (
              <button
                onClick={() => setFaqs((prev) => [...prev, emptyFaq()])}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gold text-navy font-medium"
              >
                <Plus className="h-4 w-4" />
                Nova dúvida
              </button>
            )}

            {tab === "reports" && canReports && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={exportCsv}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gold text-navy font-medium"
                >
                  <Download className="h-4 w-4" />
                  Exportar Excel
                </button>

                <button
                  onClick={exportPdf}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl border bg-card text-navy font-medium"
                >
                  <Printer className="h-4 w-4" />
                  Exportar PDF
                </button>
              </div>
            )}

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/login";
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl border"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {canProducts && (
            <button
              onClick={() => setTab("products")}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl border ${
                tab === "products" ? "bg-navy text-white" : "bg-card"
              }`}
            >
              <Package className="h-4 w-4" />
              Produtos
            </button>
          )}

          {canOrders && (
            <button
              onClick={() => setTab("orders")}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl border ${
                tab === "orders" ? "bg-navy text-white" : "bg-card"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              Pedidos
            </button>
          )}

          {canReports && (
            <button
              onClick={() => setTab("reports")}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl border ${
                tab === "reports" ? "bg-navy text-white" : "bg-card"
              }`}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Relatórios
            </button>
          )}

          {canFaqs && (
            <button
              onClick={() => setTab("faqs")}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl border ${
                tab === "faqs" ? "bg-navy text-white" : "bg-card"
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              Dúvidas
            </button>
          )}

          {canUsers && (
            <button
              onClick={() => setTab("users")}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl border ${
                tab === "users" ? "bg-navy text-white" : "bg-card"
              }`}
            >
              <Users className="h-4 w-4" />
              Usuários
            </button>
          )}
        </div>

        {tab === "products" && canProducts && (
          <div className="grid gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-3xl border bg-card p-6 md:p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl text-navy">
                    {product.name || "Novo produto"}
                  </h2>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        updateProduct(product.id, "active", !product.active)
                      }
                      className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                        product.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.active ? (
                        <>
                          <Eye className="h-4 w-4" />
                          Ativo
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Oculto
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="px-4 py-2 rounded-xl bg-red-100 text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Nome do produto
                    </label>

                    <input
                      value={product.name}
                      onChange={(e) =>
                        updateProduct(product.id, "name", e.target.value)
                      }
                      className="border rounded-2xl px-4 py-3 w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Preço
                    </label>

                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) =>
                        updateProduct(
                          product.id,
                          "price",
                          Number(e.target.value)
                        )
                      }
                      className="border rounded-2xl px-4 py-3 w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Ordem de exibição
                    </label>

                    <input
                      type="number"
                      value={product.sort_order}
                      onChange={(e) =>
                        updateProduct(
                          product.id,
                          "sort_order",
                          Number(e.target.value)
                        )
                      }
                      className="border rounded-2xl px-4 py-3 w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Imagem do produto
                    </label>

                    <div className="flex flex-col gap-3">
                      <label className="border rounded-2xl px-4 py-3 cursor-pointer flex items-center gap-2 hover:bg-accent transition">
                        <Upload className="h-4 w-4" />
                        Enviar imagem

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const fileName = `${Date.now()}-${file.name}`;

                            const { error: uploadError } =
                              await supabase.storage
                                .from("product-images")
                                .upload(fileName, file);

                            if (uploadError) {
                              alert(uploadError.message);
                              return;
                            }

                            const {
                              data: { publicUrl },
                            } = supabase.storage
                              .from("product-images")
                              .getPublicUrl(fileName);

                            updateProduct(product.id, "image_url", publicUrl);
                          }}
                        />
                      </label>

                      <input
                        value={product.image_url}
                        onChange={(e) =>
                          updateProduct(product.id, "image_url", e.target.value)
                        }
                        className="border rounded-2xl px-4 py-3 w-full"
                        placeholder="URL da imagem"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-2 block">
                      Descrição
                    </label>

                    <textarea
                      value={product.description}
                      onChange={(e) =>
                        updateProduct(
                          product.id,
                          "description",
                          e.target.value
                        )
                      }
                      className="border rounded-2xl px-4 py-3 min-h-[120px] w-full"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-2 block">
                      Posologia
                    </label>

                    <textarea
                      value={product.posology}
                      onChange={(e) =>
                        updateProduct(product.id, "posology", e.target.value)
                      }
                      className="border rounded-2xl px-4 py-3 w-full"
                    />
                  </div>
                </div>

                {product.image_url && (
                  <div className="mt-6">
                    <img
                      src={product.image_url}
                      alt=""
                      className="h-64 w-full object-cover rounded-2xl border"
                    />
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <h3 className="font-medium mb-3 text-navy">Benefícios</h3>

                    <div className="space-y-2">
                      {product.benefits.map((benefit, index) => (
                        <input
                          key={index}
                          value={benefit}
                          onChange={(e) => {
                            const updated = [...product.benefits];
                            updated[index] = e.target.value;
                            updateProduct(product.id, "benefits", updated);
                          }}
                          className="border rounded-xl px-4 py-3 w-full"
                          placeholder="Benefício"
                        />
                      ))}

                      <button
                        onClick={() =>
                          updateProduct(product.id, "benefits", [
                            ...product.benefits,
                            "",
                          ])
                        }
                        className="text-sm text-gold"
                      >
                        + adicionar benefício
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3 text-navy">
                      Composição / Fórmula
                    </h3>

                    <div className="space-y-2">
                      {product.formula.map((formula, index) => (
                        <input
                          key={index}
                          value={formula}
                          onChange={(e) => {
                            const updated = [...product.formula];
                            updated[index] = e.target.value;
                            updateProduct(product.id, "formula", updated);
                          }}
                          className="border rounded-xl px-4 py-3 w-full"
                          placeholder="Composição"
                        />
                      ))}

                      <button
                        onClick={() =>
                          updateProduct(product.id, "formula", [
                            ...product.formula,
                            "",
                          ])
                        }
                        className="text-sm text-gold"
                      >
                        + adicionar composição
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => saveProduct(product)}
                    className="px-6 py-3 rounded-2xl bg-navy text-white flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Salvar produto
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "orders" && canOrders && (
          <div className="grid gap-4">
            {orders.length === 0 && (
              <div className="rounded-3xl border bg-card p-8 text-center text-muted-foreground">
                Nenhum pedido recebido ainda.
              </div>
            )}

            {orders.map((order) => {
              const isEditing = editingOrders[order.id] ?? false;
              const isSaving = savingOrderId === order.id;
              const isGeneratingPrescription = generatingPrescriptionId === order.id;
              const isPrescriptionBusy = prescriptionActionId === order.id;
              const isSaved = savedOrderId === order.id;
              const isExpanded = expandedOrders[order.id] ?? false;
              const availableProducts = getAvailableProductsForOrder(order, products);
              const isAddingProduct = addingProductOrderId === order.id;
              const selectedProductId = selectedProductByOrder[order.id] ?? "";

              return (
                <div
                  key={order.id}
                  className={`rounded-3xl border bg-card overflow-hidden ${
                    order.status === "nao_finalizado"
                      ? "border-red-400 bg-red-50"
                      : order.status === "cancelado"
                        ? "border-gray-400 bg-gray-50"
                        : order.status === "aguardando_pagamento"
                          ? "border-yellow-400 bg-yellow-50"
                          : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedOrders((prev) => ({
                        ...prev,
                        [order.id]: !isExpanded,
                      }))
                    }
                    className="w-full text-left p-5 md:p-6 hover:bg-secondary/30 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="min-w-[220px]">
                        <p className="text-xs uppercase tracking-[0.25em] text-gold">
                          Pedido
                        </p>

                        <h2 className="font-display text-2xl text-navy mt-1">
                          {order.customer_name}
                        </h2>

                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDateTime(order.created_at)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="rounded-full bg-secondary/70 px-4 py-2 text-navy">
                          {getOrderFormulas(order) || "Sem itens"}
                        </span>

                        <span
                          className={`rounded-full px-4 py-2 font-medium ${
                            order.status === "nao_finalizado"
                              ? "bg-red-100 text-red-700"
                              : order.status === "cancelado"
                                ? "bg-gray-100 text-gray-700"
                                : order.status === "aguardando_pagamento"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : CONFIRMED_STATUSES.includes(order.status)
                                    ? "bg-green-100 text-green-700"
                                    : "bg-secondary text-navy"
                          }`}
                        >
                          {getStatusLabel(order.status)}
                        </span>

                        <strong className="text-lg text-navy">
                          {formatBRL(order.total)}
                        </strong>

                        <span className="rounded-full border px-3 py-2 text-navy">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 md:px-6 md:pb-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 border-t pt-5">
                        <div className="space-y-3">
                          {order.status === "nao_finalizado" && (
                            <div className="rounded-2xl bg-red-100 border border-red-300 px-4 py-3">
                              <p className="font-semibold text-red-700">
                                Pedido não finalizado pelo cliente
                              </p>
                              <p className="text-sm text-red-600 mt-1">
                                O cliente iniciou o pedido, mas não concluiu o pagamento/finalização.
                              </p>
                            </div>
                          )}

                          {order.status === "aguardando_pagamento" && (
                            <div className="rounded-2xl bg-yellow-100 border border-yellow-300 px-4 py-3">
                              <p className="font-semibold text-yellow-800">
                                Pedido aguardando pagamento
                              </p>
                              <p className="text-sm text-yellow-700 mt-1">
                                O pedido ainda não deve ser considerado como venda confirmada.
                              </p>
                            </div>
                          )}

                          {order.status === "cancelado" && (
                            <div className="rounded-2xl bg-gray-100 border border-gray-300 px-4 py-3">
                              <p className="font-semibold text-gray-700">
                                Pedido cancelado
                              </p>
                            </div>
                          )}

                          {isSaved && !isEditing && (
                            <div className="rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                              Pedido salvo e relatório atualizado.
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-stretch gap-2 w-full sm:w-[280px]">
                          <select
                            value={order.status}
                            disabled={!isEditing}
                            onChange={(e) =>
                              updateOrder(order.id, "status", e.target.value)
                            }
                            className="border rounded-xl px-4 py-3 bg-white disabled:bg-secondary/60"
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>

                          {!isEditing ? (
                            <button
                              type="button"
                              onClick={() =>
                                setEditingOrders((prev) => ({
                                  ...prev,
                                  [order.id]: true,
                                }))
                              }
                              className="rounded-xl border border-navy/20 bg-white px-4 py-2 text-sm font-medium text-navy hover:bg-secondary flex items-center justify-center gap-2"
                            >
                              <Pencil className="h-4 w-4" />
                              Editar pedido
                            </button>
                          ) : (
                            <button
                              disabled={isSaving}
                              onClick={() => saveOrder(order)}
                              className="rounded-xl bg-navy px-4 py-3 text-sm font-medium text-white flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              <Save className="h-4 w-4" />
                              {isSaving ? "Salvando..." : "Salvar alterações"}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => markOrderNotFinalized(order)}
                            className="rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                          >
                            Cliente desistiu / não finalizou
                          </button>

                          <button
                            type="button"
                            onClick={() => cancelOrder(order)}
                            className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                          >
                            Cancelar pedido
                          </button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 mt-5">
                        <InfoCard label="Telefone" value={order.customer_phone} />
                        <InfoCard label="CPF" value={order.customer_cpf} />
                        <InfoCard label="Pagamento" value={order.payment_method} />
                        <InfoCard label="Região" value={order.region} />
                      </div>

                      <div className="grid md:grid-cols-5 gap-4 mt-5">
                        <EditField
                          label="PCP"
                          value={order.pharmacy_order_number ?? ""}
                          disabled={!isEditing}
                          onChange={(v) =>
                            updateOrder(order.id, "pharmacy_order_number", v)
                          }
                        />

                        <EditField
                          label="Rastreio"
                          value={order.tracking_code ?? ""}
                          disabled={!isEditing}
                          onChange={(v) => updateOrder(order.id, "tracking_code", v)}
                        />

                        <EditField
                          label="Responsável"
                          value={order.responsible_name ?? ""}
                          disabled={!isEditing}
                          onChange={(v) =>
                            updateOrder(order.id, "responsible_name", v)
                          }
                        />

                        <EditField
                          type="date"
                          label="Inclusão no sistema"
                          value={formatDate(order.system_inclusion_date)}
                          disabled={!isEditing}
                          onChange={(v) =>
                            updateOrder(order.id, "system_inclusion_date", v)
                          }
                        />

                        <EditField
                          type="date"
                          label="Data de entrega"
                          value={formatDate(order.delivery_date)}
                          disabled={!isEditing}
                          onChange={(v) => updateOrder(order.id, "delivery_date", v)}
                        />
                      </div>

                      <div className="mt-5 rounded-2xl border p-4">
                        <p className="font-medium text-navy mb-3">Itens do pedido</p>

                        <div className="space-y-2">
                          {(order.order_items ?? []).map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between gap-4 text-sm border-b last:border-b-0 pb-2 last:pb-0"
                            >
                              <span>
                                {item.quantity}x {item.product_name}
                              </span>

                              <span className="font-medium">
                                {formatBRL(getItemTotal(item))}
                              </span>
                            </div>
                          ))}

                          {(order.order_items ?? []).length === 0 && (
                            <p className="text-sm text-muted-foreground">
                              Nenhum item neste pedido.
                            </p>
                          )}
                        </div>

                        {isEditing && (
                          <div className="mt-4 flex flex-wrap items-end gap-3 border-t pt-4">
                            <div className="flex-1 min-w-[220px]">
                              <label className="block text-xs text-muted-foreground mb-1">
                                Adicionar produto
                              </label>

                              <select
                                value={selectedProductId}
                                onChange={(e) =>
                                  setSelectedProductByOrder((prev) => ({
                                    ...prev,
                                    [order.id]: e.target.value,
                                  }))
                                }
                                disabled={isAddingProduct || availableProducts.length === 0}
                                className="w-full border rounded-xl px-4 py-3 bg-white disabled:bg-secondary/60"
                              >
                                <option value="">
                                  {availableProducts.length === 0
                                    ? "Todos os produtos já foram adicionados"
                                    : "Selecione um produto"}
                                </option>

                                {availableProducts.map((product) => (
                                  <option key={product.id} value={product.id}>
                                    {product.name} — {formatBRL(product.price)}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <button
                              type="button"
                              disabled={
                                !selectedProductId ||
                                isAddingProduct ||
                                availableProducts.length === 0
                              }
                              onClick={() => addProductToOrder(order)}
                              className="rounded-xl bg-navy px-4 py-3 text-sm font-medium text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="h-4 w-4" />
                              {isAddingProduct ? "Adicionando..." : "Adicionar produto"}
                            </button>
                          </div>
                        )}
                      </div>

                      {(order.prescription_pdf_path ||
                        isGeneratingPrescription ||
                        PRESCRIPTION_STATUSES.includes(order.status)) && (
                        <div className="mt-5 rounded-2xl border p-4 bg-secondary/20">
                          <p className="font-medium text-navy mb-3">
                            Prescrição
                          </p>

                          {isGeneratingPrescription ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Gerando prescrição...
                            </div>
                          ) : order.prescription_pdf_path ? (
                            <div className="flex flex-wrap gap-3">
                              <button
                                type="button"
                                disabled={isPrescriptionBusy}
                                onClick={() => viewPrescription(order)}
                                className="px-5 py-3 rounded-2xl bg-navy text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                              >
                                <Eye className="h-4 w-4" />
                                Visualizar Prescrição
                              </button>

                              <button
                                type="button"
                                disabled={isPrescriptionBusy}
                                onClick={() => printPrescription(order)}
                                className="px-5 py-3 rounded-2xl border bg-card text-navy text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                              >
                                <Printer className="h-4 w-4" />
                                Imprimir
                              </button>

                              <button
                                type="button"
                                disabled={isPrescriptionBusy}
                                onClick={() => downloadPrescription(order)}
                                className="px-5 py-3 rounded-2xl border bg-card text-navy text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                              >
                                <Download className="h-4 w-4" />
                                Baixar PDF
                              </button>
                            </div>
                          ) : PRESCRIPTION_STATUSES.includes(order.status) ? (
                            <div className="space-y-3">
                              <p className="text-sm text-muted-foreground">
                                A prescrição é gerada ao salvar como Pago ou Manipulando.
                                Se não apareceu, clique abaixo para tentar novamente.
                              </p>
                              <button
                                type="button"
                                disabled={isGeneratingPrescription || isPrescriptionBusy}
                                onClick={() => ensurePrescriptionForOrder(order, { downloadOnFailure: true })}
                                className="px-5 py-3 rounded-2xl bg-navy text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                              >
                                <FileText className="h-4 w-4" />
                                Gerar prescrição agora
                              </button>
                            </div>
                          ) : null}

                          {prescriptionErrors[order.id] ? (
                            <p className="mt-3 text-sm text-red-600">
                              {prescriptionErrors[order.id]}
                            </p>
                          ) : null}

                          {order.prescription_pdf_filename ? (
                            <p className="mt-3 text-xs text-muted-foreground">
                              Arquivo: {order.prescription_pdf_filename}
                            </p>
                          ) : null}
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-3">
                          {isEditing && (
                            <button
                              disabled={isSaving}
                              onClick={() => saveOrder(order)}
                              className="px-6 py-3 rounded-2xl bg-navy text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Save className="h-4 w-4" />
                              {isSaving ? "Salvando..." : "Salvar alterações"}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => markOrderNotFinalized(order)}
                            className="px-6 py-3 rounded-2xl border border-red-300 bg-red-50 text-red-700 font-medium"
                          >
                            Descartar como não finalizado
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteOrder(order)}
                            className="px-6 py-3 rounded-2xl border border-gray-300 text-gray-700 flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Excluir
                          </button>
                        </div>

                        <div className="flex flex-wrap justify-end gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Subtotal: </span>
                            <strong>{formatBRL(order.subtotal)}</strong>
                          </div>

                          <div>
                            <span className="text-muted-foreground">Desconto: </span>
                            <strong>{formatBRL(order.discount)}</strong>
                          </div>

                          <div>
                            <span className="text-muted-foreground">Total: </span>
                            <strong className="text-lg text-navy">
                              {formatBRL(order.total)}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === "reports" && canReports && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-5 gap-4">
              <InfoCard label="Pedidos recebidos" value={String(orders.length)} />
              <InfoCard label="Pedidos confirmados" value={String(pedidosConfirmados.length)} />
              <InfoCard label="Não finalizados" value={String(pedidosNaoFinalizados.length)} />
              <InfoCard label="Total confirmado" value={formatBRL(totalConfirmado)} />
              <InfoCard
                label="Conversão"
                value={
                  orders.length
                    ? `${Math.round((pedidosConfirmados.length / orders.length) * 100)}%`
                    : "0%"
                }
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <RankingCard title="Fórmulas mais solicitadas" rows={formulasSolicitadas} />
              <RankingCard title="Fórmulas mais vendidas" rows={formulasVendidas} />

              <div className="rounded-3xl border bg-card p-6">
                <h2 className="font-display text-2xl text-navy mb-4">
                  Maior faturamento
                </h2>

                {formulasFaturamento.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sem dados ainda.</p>
                ) : (
                  <div className="space-y-4">
                    {formulasFaturamento.slice(0, 5).map(([name, data], index) => (
                      <div
                        key={name}
                        className="flex items-center justify-between gap-4 text-sm"
                      >
                        <div>
                          <p className="font-medium text-navy">
                            {index + 1}. {name}
                          </p>

                          <p className="text-muted-foreground">
                            {data.quantidade} venda(s)
                          </p>
                        </div>

                        <strong className="text-navy">
                          {formatBRL(data.faturamento)}
                        </strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border bg-card overflow-hidden">
              <div className="p-5 flex items-center justify-between gap-4 border-b">
                <div>
                  <h2 className="font-display text-2xl text-navy">
                    Planilha de acompanhamento
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Controle de pedidos, PCP, rastreio, responsável e entrega.
                  </p>
                </div>

                <button
                  onClick={exportCsv}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gold text-navy font-medium"
                >
                  <Download className="h-4 w-4" />
                  Exportar Excel
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/70 text-left">
                    <tr>
                      <th className="p-4">PCP</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Fórmulas</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Rastreio</th>
                      <th className="p-4">Responsável</th>
                      <th className="p-4">Inclusão</th>
                      <th className="p-4">Entrega</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reportRows.map((row, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-4">{row.pcp || "-"}</td>
                        <td className="p-4 font-medium text-navy">{row.cliente}</td>
                        <td className="p-4 min-w-[220px]">{row.formulas || "-"}</td>
                        <td className="p-4">{formatBRL(row.total)}</td>
                        <td className="p-4">{row.status}</td>
                        <td className="p-4">{row.rastreio || "-"}</td>
                        <td className="p-4">{row.responsavel || "-"}</td>
                        <td className="p-4">{row.dataInclusaoSistema || "-"}</td>
                        <td className="p-4">{row.dataEntrega || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}


        {tab === "faqs" && canFaqs && (
          <div className="grid gap-6">
            {faqs.length === 0 && (
              <div className="rounded-3xl border bg-card p-8 text-center text-muted-foreground">
                Nenhuma dúvida cadastrada ainda.
              </div>
            )}

            {faqs.map((faq) => (
              <div key={faq.id} className="rounded-3xl border bg-card p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-gold">
                      Dúvida frequente
                    </p>
                    <h2 className="font-display text-2xl text-navy mt-1">
                      {faq.question || "Nova dúvida"}
                    </h2>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateFaq(faq.id, "active", !faq.active)}
                      className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                        faq.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {faq.active ? (
                        <>
                          <Eye className="h-4 w-4" />
                          Ativa
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Oculta
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => deleteFaq(faq.id)}
                      className="px-4 py-2 rounded-xl bg-red-100 text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Pergunta
                    </label>
                    <input
                      value={faq.question}
                      onChange={(e) => updateFaq(faq.id, "question", e.target.value)}
                      className="border rounded-2xl px-4 py-3 w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Resposta
                    </label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(faq.id, "answer", e.target.value)}
                      className="border rounded-2xl px-4 py-3 min-h-[140px] w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Ordem de exibição
                    </label>
                    <input
                      type="number"
                      value={faq.sort_order}
                      onChange={(e) => updateFaq(faq.id, "sort_order", Number(e.target.value))}
                      className="border rounded-2xl px-4 py-3 w-full md:w-56"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => saveFaq(faq)}
                    className="px-6 py-3 rounded-2xl bg-navy text-white flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Salvar dúvida
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "users" && canUsers && (
          <div className="space-y-8">
            <div className="rounded-3xl border bg-card p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.25em] text-gold">
                Novo usuário
              </p>
              <h2 className="font-display text-2xl text-navy mt-1">
                Criar acesso administrativo
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Vendedores terão acesso apenas a Produtos e Pedidos. Admin master tem acesso total.
              </p>

              <div className="grid md:grid-cols-[1fr_1fr_220px] gap-4 mt-6">
                <EditField
                  label="E-mail"
                  value={newUser.email}
                  onChange={(v) => setNewUser((prev) => ({ ...prev, email: v }))}
                />

                <EditField
                  label="Senha temporária"
                  type="password"
                  value={newUser.password}
                  onChange={(v) => setNewUser((prev) => ({ ...prev, password: v }))}
                />

                <label className="block">
                  <span className="text-xs text-muted-foreground">Tipo de usuário</span>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        role: e.target.value as NewUserForm["role"],
                      }))
                    }
                    className="mt-1 w-full border rounded-xl px-4 py-3 bg-white"
                  >
                    <option value="vendedor">Vendedor</option>
                    <option value="admin_master">Admin master</option>
                  </select>
                </label>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={createAdminUser}
                  disabled={creatingUser}
                  className="px-6 py-3 rounded-2xl bg-navy text-white flex items-center gap-2 disabled:opacity-50"
                >
                  <Users className="h-4 w-4" />
                  {creatingUser ? "Criando..." : "Criar usuário"}
                </button>
              </div>
            </div>

            <div className="rounded-3xl border bg-card overflow-hidden">
              <div className="p-5 border-b">
                <h2 className="font-display text-2xl text-navy">Usuários cadastrados</h2>
                <p className="text-sm text-muted-foreground">
                  Controle de acessos do painel administrativo.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/70 text-left">
                    <tr>
                      <th className="p-4">E-mail</th>
                      <th className="p-4">Tipo</th>
                      <th className="p-4">Produtos</th>
                      <th className="p-4">Pedidos</th>
                      <th className="p-4">Relatórios</th>
                      <th className="p-4">Dúvidas</th>
                      <th className="p-4">Usuários</th>
                      <th className="p-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      const master = user.role === "admin_master";
                      return (
                        <tr key={user.id} className="border-t">
                          <td className="p-4 font-medium text-navy">{user.email || user.id}</td>
                          <td className="p-4">{master ? "Admin master" : "Vendedor"}</td>
                          <td className="p-4">{master || user.can_products ? "Sim" : "Não"}</td>
                          <td className="p-4">{master || user.can_orders ? "Sim" : "Não"}</td>
                          <td className="p-4">{master || user.can_reports ? "Sim" : "Não"}</td>
                          <td className="p-4">{master || user.can_faqs ? "Sim" : "Não"}</td>
                          <td className="p-4">{master || user.can_users ? "Sim" : "Não"}</td>
                          <td className="p-4">
                            {user.id !== currentProfile?.id ? (
                              <button
                                type="button"
                                onClick={() => removeUserAccess(user)}
                                className="rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                              >
                                Remover acesso
                              </button>
                            ) : (
                              <span className="text-muted-foreground">Você</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-secondary/60 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-navy break-words">{value || "-"}</p>
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border rounded-xl px-4 py-3 disabled:bg-secondary/60"
      />
    </label>
  );
}

function RankingCard({
  title,
  rows,
}: {
  title: string;
  rows: Array<[string, number]>;
}) {
  return (
    <div className="rounded-3xl border bg-card p-6">
      <h2 className="font-display text-2xl text-navy mb-4">{title}</h2>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem dados ainda.</p>
      ) : (
        <div className="space-y-3">
          {rows.map(([name, count], index) => (
            <div key={name} className="flex justify-between gap-4 text-sm">
              <span>
                {index + 1}. {name}
              </span>
              <strong>{count}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
