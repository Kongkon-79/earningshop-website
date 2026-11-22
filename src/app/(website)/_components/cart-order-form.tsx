"use client";

import { FileText, MapPin, Truck, Wallet } from "lucide-react";
import Image from "next/image";
import { useId, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatProductPrice } from "@/lib/product-catalog";

type DeliveryFields = {
  fullName: string;
  phone: string;
  address: string;
  note: string;
};

const paymentMethods = [
  { id: "bkash", label: "বিকাশ", logo: "/assets/images/payment-methods/bkash.png" },
  { id: "nagad", label: "নগদ", logo: "/assets/images/payment-methods/nagad.png" },
  { id: "rocket", label: "রকেট", logo: "/assets/images/payment-methods/rocket.png" },
  { id: "cash", label: "ক্যাশ অন ডেলিভারি", logo: null },
] as const;

const inputClass = "min-h-11 rounded-xl border-slate-300 bg-white px-3 text-base focus-visible:ring-teal-700";
const labelClass = "mb-1.5 block text-sm font-semibold text-slate-800";
const sectionTitle = "mb-3 flex items-center gap-2 font-semibold text-slate-900";

function OrderField({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={labelClass}>{label}</label>
      {children}
      {error && <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  );
}

function isValidPhone(value: string) {
  const digits = value.replace(/[০-৯]/g, (digit) => String("০১২৩৪৫৬৭৮৯".indexOf(digit))).replace(/[\s()-]/g, "");
  return /^(?:\+?88)?01[0-9]{9}$/.test(digits);
}

export default function CartOrderForm({ summary, total, onBack }: {
  summary: ReactNode;
  total: number;
  onBack: () => void;
}) {
  const id = useId();
  const [paymentMethod, setPaymentMethod] = useState<(typeof paymentMethods)[number]["id"]>("cash");
  const [showNotice, setShowNotice] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<DeliveryFields>();
  const payment = paymentMethods.find((method) => method.id === paymentMethod);
  const fullName = `${id}-name`;
  const phone = `${id}-phone`;
  const address = `${id}-address`;

  return (
    <form className="flex min-h-0 flex-col" noValidate onSubmit={handleSubmit(() => setShowNotice(true))}>
      <div className="min-h-0 space-y-5 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
        {summary}

        <section aria-labelledby={`${id}-delivery-title`}>
          <h3 id={`${id}-delivery-title`} className={sectionTitle}>
            <MapPin aria-hidden="true" className="size-4 text-teal-800" />
            ডেলিভারি তথ্য
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <OrderField id={fullName} label="পূর্ণ নাম" error={errors.fullName?.message}>
              <Input
                id={fullName}
                autoComplete="name"
                placeholder="আপনার নাম"
                required
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? `${fullName}-error` : undefined}
                className={inputClass}
                {...register("fullName", { validate: (value) => Boolean(value.trim()) || "আপনার পূর্ণ নাম লিখুন।" })}
              />
            </OrderField>
            <OrderField id={phone} label="মোবাইল নম্বর" error={errors.phone?.message}>
              <Input
                id={phone}
                type="tel"
                autoComplete="tel"
                placeholder="০১XXXXXXXXX"
                required
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? `${phone}-error` : undefined}
                className={inputClass}
                {...register("phone", { validate: (value) => isValidPhone(value) || "সঠিক মোবাইল নম্বর লিখুন।" })}
              />
            </OrderField>
            <div className="sm:col-span-2">
              <OrderField id={address} label="সম্পূর্ণ ঠিকানা" error={errors.address?.message}>
                <Textarea
                  id={address}
                  autoComplete="street-address"
                  placeholder="বাসা, রোড, এলাকা, থানা ও জেলা"
                  rows={2}
                  required
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={errors.address ? `${address}-error` : undefined}
                  className={inputClass}
                  {...register("address", { validate: (value) => Boolean(value.trim()) || "ডেলিভারির সম্পূর্ণ ঠিকানা লিখুন।" })}
                />
              </OrderField>
            </div>
          </div>
        </section>

        <fieldset className="min-w-0">
          <legend className="mb-3 font-semibold text-slate-900">
            <span className="flex items-center gap-2">
              <Wallet aria-hidden="true" className="size-4 text-teal-800" />
              পেমেন্ট পদ্ধতি
            </span>
          </legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {paymentMethods.map(({ id, label, logo }) => (
              <label key={id} className="relative flex cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={id}
                  checked={paymentMethod === id}
                  onChange={() => setPaymentMethod(id)}
                  className="peer sr-only"
                />
                <span className="flex min-h-16 w-full flex-col items-center justify-center gap-1 rounded-xl border border-slate-300 bg-white p-2 text-center text-sm font-semibold leading-snug text-slate-700 transition-colors hover:border-teal-500 peer-checked:border-teal-700 peer-checked:bg-teal-50 peer-checked:text-teal-900 peer-checked:ring-1 peer-checked:ring-teal-700 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-teal-700">
                  <span className="grid size-7 shrink-0 place-items-center">
                    {logo ? (
                      <Image src={logo} alt="" width={28} height={28} unoptimized className="size-7 rounded-md object-contain" />
                    ) : (
                      <Truck aria-hidden="true" className="size-5" />
                    )}
                  </span>
                  {label}
                </span>
              </label>
            ))}
          </div>
          {paymentMethod !== "cash" && (
            <div className="mt-3 space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p role="status" className="text-sm leading-relaxed text-amber-950">
                {payment?.label} পেমেন্টের নম্বর এখনো যোগ করা হয়নি।
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <OrderField id={`${id}-sender`} label="পেমেন্ট পাঠানোর নম্বর">
                  <Input id={`${id}-sender`} type="tel" placeholder="যে নম্বর থেকে পাঠাবেন" disabled className={inputClass} />
                </OrderField>
                <OrderField id={`${id}-transaction`} label="ট্রানজ্যাকশন আইডি">
                  <Input id={`${id}-transaction`} placeholder="লেনদেনের আইডি" disabled className={inputClass} />
                </OrderField>
              </div>
            </div>
          )}
        </fieldset>

        <div>
          <label htmlFor={`${id}-note`} className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <FileText aria-hidden="true" className="size-4 text-teal-800" />
            নোট (ঐচ্ছিক)
          </label>
          <Textarea
            id={`${id}-note`}
            placeholder="ডেলিভারি সম্পর্কে কিছু জানাতে চাইলে লিখুন"
            rows={2}
            className={inputClass}
            {...register("note")}
          />
        </div>
      </div>

      <footer className="shrink-0 space-y-2 border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
        {showNotice && (
          <p role="status" className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950">
            অর্ডার জমা দেওয়ার সেবা এখনো চালু হয়নি।
          </p>
        )}
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-2">
          <button
            type="button"
            className="min-h-11 rounded-xl border border-slate-300 px-3 text-sm font-semibold hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:px-4"
            onClick={onBack}
          >
            কার্টে ফিরুন
          </button>
          <button
            type="submit"
            className="min-h-11 rounded-xl bg-teal-900 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:px-4"
          >
            অর্ডার নিশ্চিত করুন · {formatProductPrice(total)}
          </button>
        </div>
      </footer>
    </form>
  );
}
