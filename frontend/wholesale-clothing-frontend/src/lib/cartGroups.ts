import type { CartItem } from "@/store/cartStore";

export type CartColorGroup = {
  color: string;
  sizes: string[];
  sizeLines: Array<{ size: string; quantity: number }>;
  packCount: number;
  pieceCount: number;
};

export type GroupedCartProduct = {
  productId: string;
  name: string;
  slug: string;
  image?: string;
  price: number;
  quantity: number;
  minimumOrderQuantity: number;
  stock: number;
  variantCount: number;
  colors: CartColorGroup[];
  items: CartItem[];
};

export const groupCartItemsByProduct = (
  items: CartItem[],
): GroupedCartProduct[] => {
  const groups: GroupedCartProduct[] = [];
  const indexByProduct = new Map<string, number>();

  items.forEach((item) => {
    const existingIndex = indexByProduct.get(item.productId);

    if (existingIndex === undefined) {
      indexByProduct.set(item.productId, groups.length);
      groups.push({
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        minimumOrderQuantity: item.minimumOrderQuantity,
        stock: item.stock,
        variantCount: 1,
        colors: [
          {
            color: item.color,
            sizes: [item.size],
            sizeLines: [{ size: item.size, quantity: item.quantity }],
            packCount: item.quantity,
            pieceCount: item.quantity,
          },
        ],
        items: [item],
      });
      return;
    }

    const group = groups[existingIndex];
    group.items.push(item);
    group.variantCount += 1;
    group.stock = Math.min(group.stock, item.stock);
    group.minimumOrderQuantity = Math.max(
      group.minimumOrderQuantity,
      item.minimumOrderQuantity,
    );
    group.quantity = Math.min(group.quantity, item.quantity);

    const colorGroup = group.colors.find((entry) => entry.color === item.color);
    if (colorGroup) {
      if (!colorGroup.sizes.includes(item.size)) {
        colorGroup.sizes.push(item.size);
      }
      const sizeLine = colorGroup.sizeLines.find((line) => line.size === item.size);
      if (sizeLine) {
        sizeLine.quantity += item.quantity;
      } else {
        colorGroup.sizeLines.push({ size: item.size, quantity: item.quantity });
      }
      colorGroup.pieceCount += item.quantity;
      colorGroup.packCount = Math.max(colorGroup.packCount, item.quantity);
    } else {
      group.colors.push({
        color: item.color,
        sizes: [item.size],
        sizeLines: [{ size: item.size, quantity: item.quantity }],
        packCount: item.quantity,
        pieceCount: item.quantity,
      });
    }
  });

  return groups;
};

export const groupedProductTotal = (group: GroupedCartProduct) =>
  group.items.reduce((total, item) => total + item.price * item.quantity, 0);

export const groupedPieceCount = (group: GroupedCartProduct) =>
  group.items.reduce((total, item) => total + item.quantity, 0);

export type OrderDisplayItem = {
  product: string | { _id?: string };
  name: string;
  image?: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
};

const productKey = (product: OrderDisplayItem["product"]) => {
  if (product && typeof product === "object") {
    return String(product._id || "");
  }

  return String(product || "");
};

export const groupOrderItemsByProduct = (
  items: OrderDisplayItem[],
): GroupedCartProduct[] =>
  groupCartItemsByProduct(
    items.map((item, index) => ({
      productId: productKey(item.product) || `line-${index}`,
      name: item.name,
      slug: "",
      image: item.image,
      price: item.price,
      variantId: `${productKey(item.product)}-${item.size || ""}-${item.color || ""}-${index}`,
      size: item.size || "",
      color: item.color || "",
      sku: "",
      quantity: item.quantity,
      minimumOrderQuantity: 1,
      stock: item.quantity,
    })),
  );
