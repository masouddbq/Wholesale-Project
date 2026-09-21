"use client";

import { useState } from "react";
import useCartStore from "@/store/cartStore";

type Variant = {
  _id: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
};

type ProductVariantSelectorProps = {
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string;
  price: number;
  variants: Variant[];
  minimumOrderQuantity: number;
};

export default function ProductVariantSelector({
  productId,
  productName,
  productSlug,
  productImage,
  price,
  variants,
  minimumOrderQuantity,
}: ProductVariantSelectorProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(minimumOrderQuantity);

  const addItem = useCartStore((state) => state.addItem);

  const sizes = Array.from(new Set(variants.map((variant) => variant.size)));

  const colors = Array.from(new Set(variants.map((variant) => variant.color)));

  const selectedVariant = variants.find(
    (variant) =>
      variant.size === selectedSize && variant.color === selectedColor,
  );

  const isSizeAvailable = (size: string) => {
    return variants.some(
      (variant) =>
        variant.size === size &&
        (!selectedColor || variant.color === selectedColor) &&
        variant.stock >= minimumOrderQuantity,
    );
  };

  const isColorAvailable = (color: string) => {
    return variants.some(
      (variant) =>
        variant.color === color &&
        (!selectedSize || variant.size === selectedSize) &&
        variant.stock >= minimumOrderQuantity,
    );
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);

    const matchingVariant = variants.find(
      (variant) =>
        variant.size === size &&
        (!selectedColor || variant.color === selectedColor) &&
        variant.stock >= minimumOrderQuantity,
    );

    if (!matchingVariant) {
      setSelectedColor("");
    }

    setQuantity(minimumOrderQuantity);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);

    const matchingVariant = variants.find(
      (variant) =>
        variant.color === color &&
        (!selectedSize || variant.size === selectedSize) &&
        variant.stock >= minimumOrderQuantity,
    );

    if (!matchingVariant) {
      setSelectedSize("");
    }

    setQuantity(minimumOrderQuantity);
  };

  const handleQuantityChange = (value: number) => {
    if (value < minimumOrderQuantity) {
      setQuantity(minimumOrderQuantity);
      return;
    }

    if (selectedVariant && value > selectedVariant.stock) {
      setQuantity(selectedVariant.stock);
      return;
    }

    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      return;
    }

    addItem({
      productId,
      name: productName,
      slug: productSlug,
      image: productImage,
      price,

      variantId: selectedVariant._id,
      size: selectedVariant.size,
      color: selectedVariant.color,
      sku: selectedVariant.sku,

      quantity,
      minimumOrderQuantity,
      stock: selectedVariant.stock,
    });
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Size */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">سایز</h3>

        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const available = isSizeAvailable(size);

            return (
              <button
                key={size}
                type="button"
                disabled={!available}
                onClick={() => handleSizeChange(size)}
                className={`rounded-lg border px-5 py-2.5 text-sm transition ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : available
                      ? "border-neutral-300 bg-white hover:border-black"
                      : "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400 line-through"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">رنگ</h3>

        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const available = isColorAvailable(color);

            return (
              <button
                key={color}
                type="button"
                disabled={!available}
                onClick={() => handleColorChange(color)}
                className={`rounded-lg border px-5 py-2.5 text-sm transition ${
                  selectedColor === color
                    ? "border-black bg-black text-white"
                    : available
                      ? "border-neutral-300 bg-white hover:border-black"
                      : "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400 line-through"
                }`}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Variant */}
      {selectedVariant && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-neutral-500">موجودی</p>

              <p className="mt-1 font-semibold">{selectedVariant.stock} عدد</p>
            </div>

            <div>
              <p className="text-neutral-500">SKU</p>

              <p className="mt-1 font-semibold">{selectedVariant.sku}</p>
            </div>

            <div>
              <p className="text-neutral-500">حداقل سفارش</p>

              <p className="mt-1 font-semibold">{minimumOrderQuantity} عدد</p>
            </div>
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">تعداد</h3>

        <div className="flex w-fit items-center overflow-hidden rounded-lg border border-neutral-300">
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity - 1)}
            className="flex h-11 w-11 items-center justify-center text-lg transition hover:bg-neutral-100"
          >
            −
          </button>

          <span className="flex h-11 min-w-14 items-center justify-center border-x border-neutral-300 px-3 font-semibold">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={
              selectedVariant ? quantity >= selectedVariant.stock : false
            }
            className="flex h-11 w-11 items-center justify-center text-lg transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      {/* Add To Cart */}
      <button
        type="button"
        disabled={
          !selectedVariant || selectedVariant.stock < minimumOrderQuantity
        }
        onClick={handleAddToCart}
        className="btn-primary-glow w-full rounded-xl bg-black px-6 py-4 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        افزودن به سبد خرید
      </button>
    </div>
  );
}
