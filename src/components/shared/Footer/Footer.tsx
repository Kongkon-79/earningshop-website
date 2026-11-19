import Image from "next/image";
import Link from "next/link";

const platformLinks = [
  { label: "কীভাবে কাজ করে", href: "/#how-it-works" },
  { label: "প্যাকেজ", href: "/#packages" },
  { label: "প্রোডাক্ট", href: "/#products" },
  { label: "লগইন", href: "/login" },
];

const focusStyle =
  "rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700";

const linkStyle = `inline-flex min-h-11 items-center text-sm underline-offset-4 hover:text-teal-800 hover:underline ${focusStyle}`;

export default function Footer() {
  return (
    <footer
      lang="bn"
      className="border-t border-teal-900/10 bg-[#f7f7ef] font-sans text-slate-700"
    >
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-6 lg:grid-cols-[2fr_1fr_1fr] lg:gap-x-8">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className={`inline-flex items-center gap-3 ${focusStyle}`}>
              <Image
                src="/assets/images/logo.png"
                alt="Earningshop Limited"
                width={715}
                height={349}
                sizes="144px"
                className="h-auto w-36"
              />
            </Link>
            <p className="mt-2 max-w-sm text-sm leading-relaxed">
              রেফারেল, কাজ ও শপিংয়ের জন্য একটি প্ল্যাটফর্ম। অ্যাডমিন যাচাইয়ের পর
              প্রতিটি লেনদেন ম্যানুয়ালি সম্পন্ন হয়।
            </p>
          </div>

          <nav aria-label="প্ল্যাটফর্ম" className="min-w-0">
            <h2 className="mb-1 font-semibold text-teal-800">প্ল্যাটফর্ম</h2>
            <ul>
              {platformLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={linkStyle}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="footer-policies" className="min-w-0">
            <h2 id="footer-policies" className="mb-3 font-semibold text-teal-800">
              নীতিমালা
            </h2>
            <ul className="space-y-3 text-sm leading-relaxed">
              <li>উত্তোলনে ৭% সার্ভিস চার্জ</li>
              <li>পেমেন্ট অ্যাডমিন ম্যানুয়ালি যাচাই করেন</li>
            </ul>
          </section>
        </div>

        <p className="mt-6 border-t border-slate-200 pt-4 text-center text-sm leading-relaxed text-slate-600">
          © {new Date().getFullYear()} আর্নিংশপ লিমিটেড। সর্বস্বত্ব সংরক্ষিত।
        </p>
      </div>
    </footer>
  );
}
