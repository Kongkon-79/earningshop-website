import { z } from "zod";

export const deliveryZones = {
  inside_dhaka: "ঢাকার ভেতরে",
  outside_dhaka: "ঢাকার বাইরে",
} as const;

export const maxCartLines = 100;
export const maxCartQuantity = 1000;

const mobilePaymentMethods = z.enum(["bkash", "nagad", "rocket"]);
const paymentMethod = z.enum(["cod", ...mobilePaymentMethods.options]);
const deliveryZone = z.enum(["inside_dhaka", "outside_dhaka"]);
const phoneNumber = z.string().regex(/^(?:\+?88)?01[0-9]{9}$/);

export function normalizeCheckoutPhone(value: string) {
  return value.replace(/[০-৯]/g, (digit) => String("০১২৩৪৫৬৭৮৯".indexOf(digit))).replace(/[\s()-]/g, "");
}

export function isCheckoutPhone(value: string) {
  return phoneNumber.safeParse(normalizeCheckoutPhone(value)).success;
}

const items = z.array(z.object({
  productId: z.string().regex(/^[0-9a-f]{24}$/i),
  quantity: z.number().int().min(1).max(maxCartQuantity),
})).min(1).max(maxCartLines);

export const checkoutInput = z.object({
  items,
  customerName: z.string().trim().min(1),
  phoneNumber,
  deliveryAddress: z.string().trim().min(1),
  deliveryZone,
  paymentMethod,
  senderPhone: phoneNumber.optional(),
  transactionId: z.string().trim().min(1).optional(),
}).refine((input) => input.paymentMethod === "cod" || Boolean(input.senderPhone && input.transactionId));

export const checkoutOptions = z.object({
  deliveryCharges: z.object({
    inside_dhaka: z.number().nonnegative(),
    outside_dhaka: z.number().nonnegative(),
    currency: z.literal("BDT"),
  }),
  paymentMethods: z.array(z.discriminatedUnion("method", [
    z.object({ method: z.literal("cod"), number: z.null() }),
    z.object({ method: mobilePaymentMethods, number: z.string().trim().min(1) }),
  ])).refine((methods) => methods.some(({ method }) => method === "cod")),
});

export const checkoutReceipt = z.object({
  _id: z.string().min(1),
  totalPrice: z.number().nonnegative(),
});

export type CheckoutInput = z.infer<typeof checkoutInput>;
export type CheckoutOptions = z.infer<typeof checkoutOptions>;
export type CheckoutReceipt = z.infer<typeof checkoutReceipt>;
