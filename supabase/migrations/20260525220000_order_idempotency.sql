-- Prevent duplicate checkout orders from double-submit and retries.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS idempotency_key uuid;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_idempotency_key
  ON public.orders (idempotency_key)
  WHERE idempotency_key IS NOT NULL;

-- Link protocol submissions to admin orders (one pedido per order).
ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS order_id uuid REFERENCES public.orders (id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_pedidos_order_id
  ON public.pedidos (order_id)
  WHERE order_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.create_order_idempotent(
  p_idempotency_key uuid,
  p_customer_name text,
  p_customer_cpf text,
  p_customer_phone text,
  p_customer_email text,
  p_payment_method text,
  p_region text,
  p_subtotal numeric,
  p_discount numeric,
  p_total numeric,
  p_items jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id uuid;
  v_item jsonb;
BEGIN
  SELECT id INTO v_order_id
  FROM orders
  WHERE idempotency_key = p_idempotency_key;

  IF FOUND THEN
    IF NOT EXISTS (SELECT 1 FROM order_items WHERE order_id = v_order_id)
       AND jsonb_array_length(p_items) > 0 THEN
      FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
      LOOP
        INSERT INTO order_items (
          order_id,
          product_id,
          product_name,
          quantity,
          price,
          unit_price,
          total_price
        ) VALUES (
          v_order_id,
          v_item->>'product_id',
          v_item->>'product_name',
          COALESCE((v_item->>'quantity')::int, 1),
          (v_item->>'price')::numeric,
          (v_item->>'unit_price')::numeric,
          (v_item->>'total_price')::numeric
        );
      END LOOP;
    END IF;

    RETURN v_order_id;
  END IF;

  INSERT INTO orders (
    customer_name,
    customer_cpf,
    customer_phone,
    customer_email,
    payment_method,
    region,
    subtotal,
    discount,
    total,
    status,
    idempotency_key
  ) VALUES (
    p_customer_name,
    p_customer_cpf,
    p_customer_phone,
    NULLIF(p_customer_email, ''),
    p_payment_method,
    p_region,
    p_subtotal,
    p_discount,
    p_total,
    'novo',
    p_idempotency_key
  )
  RETURNING id INTO v_order_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO order_items (
      order_id,
      product_id,
      product_name,
      quantity,
      price,
      unit_price,
      total_price
    ) VALUES (
      v_order_id,
      v_item->>'product_id',
      v_item->>'product_name',
      COALESCE((v_item->>'quantity')::int, 1),
      (v_item->>'price')::numeric,
      (v_item->>'unit_price')::numeric,
      (v_item->>'total_price')::numeric
    );
  END LOOP;

  RETURN v_order_id;
EXCEPTION
  WHEN unique_violation THEN
    SELECT id INTO v_order_id
    FROM orders
    WHERE idempotency_key = p_idempotency_key;

    IF NOT FOUND THEN
      RAISE;
    END IF;

    RETURN v_order_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_order_idempotent(uuid, text, text, text, text, text, text, numeric, numeric, numeric, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order_idempotent(uuid, text, text, text, text, text, text, numeric, numeric, numeric, jsonb) TO service_role;
