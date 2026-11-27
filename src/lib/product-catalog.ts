export type StorefrontProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number | null;
  description: string;
  images: string[];
};

export type StorefrontProductPage = {
  products: StorefrontProduct[];
  nextPage: number | null;
};

export function formatProductPrice(amount: number) {
  return `৳${amount.toLocaleString("bn-BD")}`;
}
