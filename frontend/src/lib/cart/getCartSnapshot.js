export function getCartSnapshot(cartRes) {
  // Backend shape: { success, message, data: { items, subtotal, deliveryCharges, totalAmount, ... } }
  // Legacy shape (older frontend code): items array directly
  if (Array.isArray(cartRes)) {
    const items = cartRes;
    return {
      items,
      deliveryCharges: 0,
      hasOutOfStock: false,
      subtotal: null,
      totalAmount: null,
    };
  }

  if (!cartRes || typeof cartRes !== "object") {
    return {
      items: [],
      deliveryCharges: 0,
      hasOutOfStock: false,
      subtotal: null,
      totalAmount: null,
    };
  }

  const data =
    cartRes.data && typeof cartRes.data === "object" ? cartRes.data : cartRes;

  const items = Array.isArray(data.items) ? data.items : [];
  const deliveryCharges =
    typeof data.deliveryCharges === "number" ? data.deliveryCharges : 0;
  const hasOutOfStock = Boolean(data.hasOutOfStock);
  const subtotal = typeof data.subtotal === "number" ? data.subtotal : null;
  const totalAmount =
    typeof data.totalAmount === "number" ? data.totalAmount : null;

  return { items, deliveryCharges, hasOutOfStock, subtotal, totalAmount };
}

