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
  removeItem: (productId: string, variantId: string) => void;

  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number
  ) => void;

  clearCart: () => void;

  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
};

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      hasHydrated: false,

      setHasHydrated: (value) =>
        set({
          hasHydrated: value,
        }),

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) =>
              cartItem.productId === item.productId &&
              cartItem.variantId === item.variantId
          );

          if (existingItem) {
            return {
              items: state.items.map((cartItem) => {
                if (
                  cartItem.productId === item.productId &&
                  cartItem.variantId === item.variantId
                ) {
                  const newQuantity =
                    cartItem.quantity + item.quantity;

                  return {
                    ...cartItem,
                    quantity: Math.min(
                      newQuantity,
                      cartItem.stock
                    ),
                  };
                }

                return cartItem;
              }),
            };
          }

          return {
            items: [...state.items, item],
          };
        }),

      removeItem: (productId, variantId) =>
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
              item.productId === productId &&
              item.variantId === variantId
            ) {
              const minQuantity =
                item.minimumOrderQuantity;

              const maxQuantity = item.stock;

              const safeQuantity = Math.max(
                minQuantity,
                Math.min(quantity, maxQuantity)
              );

              return {
                ...item,
                quantity: safeQuantity,
              };
            }

            return item;
          }),
        })),

      clearCart: () =>
        set({
          items: [],
        }),
    }),

    {
      name: "wholesale-cart",

      /*
       * فقط items را در localStorage ذخیره کن.
       * hasHydrated وضعیت موقتی برنامه است.
       */
      partialize: (state) => ({
        items: state.items,
      }),

      /*
       * بعد از اینکه Zustand اطلاعات localStorage
       * را خواند، hydration را تمام‌شده اعلام کن.
       */
      onRehydrateStorage: () => {
        return (state) => {
          state?.setHasHydrated(true);
        };
      },
    }
  )
);

export default useCartStore;
