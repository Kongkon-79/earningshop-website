import { Banknote, ClipboardList, ShieldCheck, UserPlus } from "lucide-react";
import { Reveal } from "./website-motion";

const steps = [
  {
    icon: UserPlus,
    title: "রেজিস্ট্রেশন",
    description: "ইমেইল দিয়ে অ্যাকাউন্ট খুলুন। এরপর আপনার রেফারেল কোড ও লিংক পাবেন।",
  },
  {
    icon: ClipboardList,
    title: "কাজ সম্পন্ন করুন",
    description: "ওয়ার্ক সেকশন থেকে কাজ নিন। কাজ শেষ করে স্ক্রিনশট আপলোড করে জমা দিন।",
  },
  {
    icon: ShieldCheck,
    title: "অ্যাডমিন যাচাই",
    description: "অ্যাডমিন আপনার জমা দেওয়া কাজ যাচাই করে অনুমোদন বা প্রত্যাখ্যান করবেন।",
  },
  {
    icon: Banknote,
    title: "উত্তোলনের অনুরোধ",
    description: "ব্যালেন্স থেকে টাকা উত্তোলনের অনুরোধ দিন। অ্যাডমিন ম্যানুয়ালি পেমেন্ট সম্পন্ন করবেন।",
  },
];

const stepNumbers = ["১", "২", "৩", "৪"];

export default function HowToWorks() {
  return (
    <section
      id="how-it-works"
      lang="bn"
      aria-labelledby="how-it-works-title"
      className="scroll-mt-24 bg-white font-sans text-slate-900"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <Reveal as="header">
          <p className="text-sm font-semibold text-teal-800">প্রক্রিয়া</p>
          <h2 id="how-it-works-title" className="mt-2 text-balance text-2xl font-bold leading-snug sm:text-3xl lg:text-4xl">
            কীভাবে কাজ করে
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-700">
            অ্যাকাউন্ট খোলা থেকে টাকা উত্তোলন পর্যন্ত চারটি ধাপ। প্রতিটি ধাপে
            আপনার কাজ বা পেমেন্টের বর্তমান অবস্থা দেখতে পারবেন।
          </p>
        </Reveal>

        <ol role="list" className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:mt-8">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <Reveal as="li" key={title} delay={index * 0.04} className="min-w-0 rounded-2xl border border-teal-900/10 bg-[#faf9f4] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-900">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span aria-hidden="true" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-teal-800">
                  ধাপ {stepNumbers[index]}
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold leading-snug">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">{description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
