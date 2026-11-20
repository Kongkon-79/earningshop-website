import { Banknote, BriefcaseBusiness, CirclePlay, GitBranch, LayoutDashboard, Package, Settings, Share2, ShoppingBag, Wallet } from "lucide-react";

export const settingsHref = "/user-dashboard/settings";

export const dashboardLinks = [
  { href: "/user-dashboard", label: "ড্যাশবোর্ড ওভারভিউ", icon: LayoutDashboard },
  {
    href: "/user-dashboard/referral",
    label: "রেফারেল",
    icon: Share2,
    description: "আপনার রেফারেল লিংক কপি বা শেয়ার করুন।",
  },
  { href: "/user-dashboard/generation", label: "জেনারেশন ট্রি", icon: GitBranch },
  { href: "/user-dashboard/balance", label: "ব্যালেন্স", icon: Wallet },
  {
    href: "/user-dashboard/works",
    label: "কাজ",
    description: "টাস্ক নিন, স্ক্রিনশট জমা দিন। অ্যাডমিন যাচাইয়ের পর রিওয়ার্ড যোগ হবে।",
    icon: BriefcaseBusiness,
  },
  {
    href: "/user-dashboard/videos",
    label: "ভিডিও",
    title: "ট্রেনিং ভিডিও",
    description: "কাজ করার নিয়ম ও গাইড ভিডিওগুলো দেখে নিন।",
    icon: CirclePlay,
  },
  { href: "/user-dashboard/packages", label: "প্যাকেজ", icon: Package },
  { href: "/user-dashboard/withdraw", label: "উইথড্র", icon: Banknote },
  {
    href: "/user-dashboard/products",
    label: "প্রোডাক্ট",
    description: "পছন্দের বেবি প্রোডাক্ট বেছে নিন, দাম দেখুন ও কার্টে যোগ করুন।",
    icon: ShoppingBag,
  },
  { href: settingsHref, label: "সেটিংস", icon: Settings },
];
