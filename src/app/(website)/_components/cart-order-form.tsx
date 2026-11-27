"use client";

import { useQuery } from "@tanstack/react-query";
import { MapPin, Truck, Wallet } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  checkoutOptions,
  checkoutReceipt,
  deliveryZones,
  isCheckoutPhone,
  normalizeCheckoutPhone,
  type CheckoutInput,
  type CheckoutReceipt,
} from "@/lib/checkout";
import { formatProductPrice } from "@/lib/product-catalog";

type DeliveryFields = {
  fullName: string;
  phone: string;
  address: string;
  deliveryZone: CheckoutInput["deliveryZone"] | "";
  senderPhone: string;
  transactionId: string;
};

type CartOrderFormProps = {
  summary: ReactNode;
  items: Array<{ id: string; quantity: number }>;
  total: number;
  onBack: () => void;
  onBusyChange: (busy: boolean) => void;
  onCompleted: (receipt: CheckoutReceipt) => void;
};

const payments = {
  bkash: { label: "বিকাশ", logo: "/assets/images/payment-methods/bkash.png" },
  nagad: { label: "নগদ", logo: "/assets/images/payment-methods/nagad.png" },
  rocket: { label: "রকেট", logo: "/assets/images/payment-methods/rocket.png" },
  cod: { label: "ক্যাশ অন ডেলিভারি", logo: null },
} as const;

const inputClass = "min-h-11 rounded-xl border-slate-300 bg-white px-3 text-base focus-visible:ring-teal-700";
const sectionTitle = "mb-3 flex items-center gap-2 font-semibold text-slate-900";
const backClass = "min-h-11 rounded-xl border border-slate-300 px-3 text-sm font-semibold hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:opacity-60";
const submitClass = "min-h-11 rounded-xl bg-teal-900 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-60";
const unavailable = "চেকআউটের তথ্য পাওয়া যায়নি। আবার চেষ্টা করুন।";
const unclearOrder = "অর্ডারের ফল নিশ্চিত করা যায়নি। আবার জমা দেওয়ার আগে অর্ডারের অবস্থা যাচাই করুন।";

function OrderField({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-800">{label}</label>
      {children}
      {error && <p id={id + "-error"} role="alert" className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  );
}

function responseMessage(data: unknown, fallback: string) {
  if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
    return data.message;
  }
  return fallback;
}

async function loadOptions(signal: AbortSignal) {
  const response = await fetch("/api/orders", { cache: "no-store", signal });
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) throw new Error(responseMessage(data, unavailable));
  const parsed = checkoutOptions.safeParse(data);
  if (!parsed.success) throw new Error(unavailable);
  return parsed.data;
}

export default function CartOrderForm(props: CartOrderFormProps) {
  const { data: session, status } = useSession();
  const user = session?.user;
  if (status === "authenticated" && user?.role === "user") {
    return <CheckoutForm {...props} fullName={user.fullName ?? ""} phone={user.phoneNumber ?? ""} />;
  }

  return (
    <div className="min-h-0 space-y-3 overflow-y-auto p-4 sm:p-6">
      {props.summary}
      {status === "loading" ? (
        <p role="status" className="text-sm text-slate-700">অ্যাকাউন্টের তথ্য লোড হচ্ছে…</p>
      ) : (
        <>
          <p className="text-sm text-slate-700">অর্ডার করতে ইউজার অ্যাকাউন্টে লগইন করুন।</p>
          <Link href="/login?callbackUrl=%2Fuser-dashboard%2Fproducts" className={submitClass + " inline-flex items-center"}>লগইন করুন</Link>
        </>
      )}
    </div>
  );
}

function CheckoutForm({ summary, items, total, fullName, phone, onBack, onBusyChange, onCompleted }: CartOrderFormProps & { fullName: string; phone: string }) {
  const id = useId();
  const [paymentMethod, setPaymentMethod] = useState<CheckoutInput["paymentMethod"]>("cod");
  const [orderError, setOrderError] = useState("");
  const submitting = useRef(false);
  const { data: options, error: optionsError, isFetching, refetch } = useQuery({
    queryKey: ["checkout-options"],
    queryFn: ({ signal }) => loadOptions(signal),
    retry: false,
  });
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<DeliveryFields>({
    defaultValues: { fullName, phone, address: "", deliveryZone: "", senderPhone: "", transactionId: "" },
  });
  const zone = watch("deliveryZone");
  const deliveryCharge = options && zone ? options.deliveryCharges[zone] : undefined;
  const payable = deliveryCharge === undefined ? undefined : Math.round((total + deliveryCharge) * 100) / 100;
  const selectedPayment = options?.paymentMethods.find(({ method }) => method === paymentMethod);

  async function submit(fields: DeliveryFields) {
    if (submitting.current || !fields.deliveryZone || !selectedPayment || optionsError || !items.length) return;
    submitting.current = true;
    onBusyChange(true);
    setOrderError("");
    try {
      const body: CheckoutInput = {
        items: items.map(({ id, quantity }) => ({ productId: id, quantity })),
        customerName: fields.fullName.trim(),
        phoneNumber: normalizeCheckoutPhone(fields.phone),
        deliveryAddress: fields.address.trim(),
        deliveryZone: fields.deliveryZone,
        paymentMethod,
        ...(paymentMethod !== "cod" ? {
          senderPhone: normalizeCheckoutPhone(fields.senderPhone),
          transactionId: fields.transactionId.trim(),
        } : {}),
      };
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setOrderError(responseMessage(data, unclearOrder));
        return;
      }
      const receipt = checkoutReceipt.safeParse(data);
      if (!receipt.success) {
        setOrderError(unclearOrder);
        return;
      }
      onCompleted(receipt.data);
    } catch {
      setOrderError(unclearOrder);
    } finally {
      submitting.current = false;
      onBusyChange(false);
    }
  }

  const nameId = id + "-name";
  const phoneId = id + "-phone";
  const addressId = id + "-address";
  const zoneId = id + "-zone";
  const senderId = id + "-sender";
  const transactionId = id + "-transaction";

  return (
    <form className="flex min-h-0 flex-col" aria-busy={isSubmitting} noValidate onSubmit={handleSubmit(submit)}>
      <div className="min-h-0 space-y-5 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
        {summary}
        {optionsError ? (
          <div role="alert" className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
            <p>{optionsError.message || unavailable}</p>
            <button type="button" className={backClass + " bg-white"} disabled={isFetching} onClick={() => void refetch()}>
              {isFetching ? "লোড হচ্ছে…" : "আবার চেষ্টা করুন"}
            </button>
          </div>
        ) : !options ? (
          <p role="status" className="text-sm text-slate-700">ডেলিভারি চার্জ ও পেমেন্ট পদ্ধতি লোড হচ্ছে…</p>
        ) : (
          <fieldset disabled={isSubmitting} className="min-w-0 space-y-5">
            <section aria-labelledby={id + "-delivery"}>
              <h3 id={id + "-delivery"} className={sectionTitle}>
                <MapPin aria-hidden="true" className="size-4 text-teal-800" />
                ডেলিভারি তথ্য
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <OrderField id={nameId} label="পূর্ণ নাম" error={errors.fullName?.message}>
                  <Input id={nameId} className={inputClass} autoComplete="name" placeholder="আপনার নাম" required
                    aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? nameId + "-error" : undefined}
                    {...register("fullName", { validate: (value) => Boolean(value.trim()) || "আপনার পূর্ণ নাম লিখুন।" })}
                  />
                </OrderField>
                <OrderField id={phoneId} label="মোবাইল নম্বর" error={errors.phone?.message}>
                  <Input id={phoneId} className={inputClass} type="tel" autoComplete="tel" placeholder="০১XXXXXXXXX" required
                    aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? phoneId + "-error" : undefined}
                    {...register("phone", { validate: (value) => isCheckoutPhone(value) || "সঠিক মোবাইল নম্বর লিখুন।" })}
                  />
                </OrderField>
                <div className="sm:col-span-2">
                  <OrderField id={addressId} label="সম্পূর্ণ ঠিকানা" error={errors.address?.message}>
                    <Textarea id={addressId} className={inputClass} autoComplete="street-address" placeholder="বাসা, রোড, এলাকা, থানা ও জেলা" rows={2} required
                      aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? addressId + "-error" : undefined}
                      {...register("address", { validate: (value) => Boolean(value.trim()) || "ডেলিভারির সম্পূর্ণ ঠিকানা লিখুন।" })}
                    />
                  </OrderField>
                </div>
                <div className="sm:col-span-2">
                  <OrderField id={zoneId} label="ডেলিভারি এলাকা" error={errors.deliveryZone?.message}>
                    <select id={zoneId} className={inputClass + " w-full rounded-xl border border-slate-300"} required
                      aria-invalid={Boolean(errors.deliveryZone)} aria-describedby={errors.deliveryZone ? zoneId + "-error" : undefined}
                      {...register("deliveryZone", { required: "ডেলিভারি এলাকা বেছে নিন।" })}
                    >
                      <option value="">এলাকা বেছে নিন</option>
                      {Object.entries(deliveryZones).map(([key, label]) => (
                        <option key={key} value={key}>{label} · {formatProductPrice(options.deliveryCharges[key as keyof typeof deliveryZones])}</option>
                      ))}
                    </select>
                  </OrderField>
                </div>
              </div>
            </section>

            <fieldset className="min-w-0">
              <legend className={sectionTitle}>
                <span className="flex items-center gap-2"><Wallet aria-hidden="true" className="size-4 text-teal-800" /> পেমেন্ট পদ্ধতি</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {options.paymentMethods.map(({ method }) => {
                  const { label, logo } = payments[method];
                  return (
                    <label key={method} className="relative flex min-w-[7rem] flex-1 cursor-pointer">
                      <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)} className="peer sr-only"
                      />
                      <span className="flex min-h-16 w-full flex-col items-center justify-center gap-1 rounded-xl border border-slate-300 bg-white p-2 text-center text-sm font-semibold leading-snug text-slate-700 hover:border-teal-500 peer-checked:border-teal-700 peer-checked:bg-teal-50 peer-checked:text-teal-900 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-teal-700">
                        {logo ? <Image src={logo} alt="" width={28} height={28} unoptimized className="size-7 rounded-md object-contain" /> : <Truck aria-hidden="true" className="size-6" />}
                        {label}
                      </span>
                    </label>
                  );
                })}
              </div>
              {selectedPayment?.number && (
                <div className="mt-3 space-y-3 rounded-xl border border-teal-100 bg-teal-50 p-3">
                  <p className="text-sm text-teal-950">
                    {payable !== undefined ? formatProductPrice(payable) + " পাঠান " : "ডেলিভারি এলাকা বেছে নিয়ে মোট টাকা দেখুন। পেমেন্ট নম্বর "}
                    <bdi className="font-semibold">{selectedPayment.number}</bdi>
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <OrderField id={senderId} label="যে নম্বর থেকে পাঠিয়েছেন" error={errors.senderPhone?.message}>
                      <Input id={senderId} className={inputClass} type="tel" placeholder="০১XXXXXXXXX" required
                        aria-invalid={Boolean(errors.senderPhone)} aria-describedby={errors.senderPhone ? senderId + "-error" : undefined}
                        {...register("senderPhone", { validate: (value) => paymentMethod === "cod" || isCheckoutPhone(value) || "পেমেন্ট পাঠানোর নম্বর লিখুন।" })}
                      />
                    </OrderField>
                    <OrderField id={transactionId} label="ট্রানজ্যাকশন আইডি" error={errors.transactionId?.message}>
                      <Input id={transactionId} className={inputClass} placeholder="লেনদেনের আইডি" required
                        aria-invalid={Boolean(errors.transactionId)} aria-describedby={errors.transactionId ? transactionId + "-error" : undefined}
                        {...register("transactionId", { validate: (value) => paymentMethod === "cod" || Boolean(value.trim()) || "ট্রানজ্যাকশন আইডি লিখুন।" })}
                      />
                    </OrderField>
                  </div>
                </div>
              )}
            </fieldset>
          </fieldset>
        )}
      </div>

      <footer className="shrink-0 space-y-2 border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
        {deliveryCharge !== undefined && <p className="flex justify-between gap-2 text-sm text-slate-700"><span>ডেলিভারি চার্জ</span><span>{formatProductPrice(deliveryCharge)}</span></p>}
        {orderError && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{orderError}</p>}
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-2">
          <button type="button" className={backClass} disabled={isSubmitting} onClick={onBack}>কার্টে ফিরুন</button>
          <button type="submit" className={submitClass} disabled={isSubmitting || !selectedPayment || Boolean(optionsError) || !items.length}>
            {isSubmitting ? "অর্ডার জমা হচ্ছে…" : "অর্ডার নিশ্চিত করুন" + (payable === undefined ? "" : " · " + formatProductPrice(payable))}
          </button>
        </div>
      </footer>
    </form>
  );
}
