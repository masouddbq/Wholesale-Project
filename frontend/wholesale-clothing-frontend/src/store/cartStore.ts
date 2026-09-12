import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  productId: string;
  name: string;
  slug: string;
  image?: string;
  price: number;

  variantId: string;
  size: string;
  color: string;
  sku: string;

  quantity: number;
  minimumOrderQuantity: number;
  stock: number;
};

type CartState = {
  items: CartItem[];

  addItem: (item: CartItem) => void;
  removeItem: (
    productId: string,
    variantId: string
  ) => void;
  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number
  ) => void;
  clearCart: () => void;
};

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) =>
              cartItem.productId === item.productId &&
              cartItem.variantId === item.variantId
          );

          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.productId === item.productId &&
                cartItem.variantId === item.variantId
                  ? {
                      ...cartItem,
                      quantity: Math.min(
                        cartItem.quantity +
                          item.quantity,
                        cartItem.stock
                      ),
                    }
                  : cartItem
              ),
            };
          }

          return {
            items: [...state.items, item],
          };
        }),

      removeItem: (
        productId,
        variantId
      ) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.variantId === variantId
              )
          ),
        })),

      updateQuantity: (
        productId,
        variantId,
        quantity
      ) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (
              item.productId !== productId ||
              item.variantId !== variantId
            ) {
              return item;
            }

            const safeQuantity = Math.max(
              item.minimumOrderQuantity,
              Math.min(quantity, item.stock)
            );

            return {
              ...item,
              quantity: safeQuantity,
            };
          }),
        })),

      clearCart: () =>
        set({
          items: [],
        }),
    }),
    {
      name: "wholesale-cart",
    }
  )
);

export default useCartStore;