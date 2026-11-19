import { Briefcase, CirclePlay, GitBranch, Link2, ShoppingBag, Wallet } from "lucide-react";

const benefits = [
  {
    icon: Link2,
    title: "রেফারেল লিংক ও কোড",
    description: "লিংক কপি করে বন্ধুদের সঙ্গে শেয়ার করুন। আপনার রেফারে কারা যোগ দিয়েছেন, তা দেখুন।",
  },
  {
    icon: Briefcase,
    title: "ওয়ার্ক টাস্ক",
    description: "অ্যাডমিনের দেওয়া কাজ, রিওয়ার্ড ও নির্দেশনা দেখুন। কাজ শেষ করে স্ক্রিনশট জমা দিন।",
  },
  {
    icon: CirclePlay,
    title: "ট্রেনিং ভিডিও",
    description: "কাজ শেখার জন্য প্রয়োজনীয় ভিডিও গাইড এক জায়গায় পাবেন।",
  },
  {
    icon: GitBranch,
    title: "জেনারেশন ট্রি",
    description: "আপনার রেফারেল নেটওয়ার্কের সদস্যরা কোন জেনারেশনে আছেন, তা দেখুন।",
  },
  {
    icon: Wallet,
    title: "ব্যালেন্স ও লেজার",
    description: "প্রতিটি আয় ও ব্যয়ের সময় এবং কারণসহ লেনদেনের হিসাব দেখুন।",
  },
  {
    icon: ShoppingBag,
    title: "বেবি প্রোডাক্ট",
    description: "ক্যাটালগ থেকে পছন্দের প্রোডাক্টের জন্য অর্ডারের অনুরোধ পাঠান।",
  },
];

export default function Benefits() {
  return (
    <section
      id="features"
      lang="bn"
      aria-labelledby="benefits-title"
      className="scroll-mt-24 border-y border-teal-900/5 bg-[#f4f7f2] font-sans text-slate-900"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid items-end gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] lg:gap-8">
          <div>
            <p className="text-sm font-semibold text-teal-800">সুবিধা</p>
            <h2 id="benefits-title" className="mt-2 text-balance text-2xl font-bold leading-snug sm:text-3xl lg:text-4xl">
              আপনার ড্যাশবোর্ডে যা যা আছে
            </h2>
          </div>
          <p className="max-w-xl leading-relaxed text-slate-700">
            মোবাইল থেকেই কাজ, রেফারেল ও আয়ের হিসাব দেখুন।
          </p>
        </div>

        <ul role="list" className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:mt-8">
          {benefits.map(({ icon: Icon, title, description }) => (
            <li key={title} className="min-w-0 rounded-2xl border border-teal-900/10 bg-white p-4 shadow-sm sm:p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-900">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <h3 className="mt-3 text-base font-bold leading-snug">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
