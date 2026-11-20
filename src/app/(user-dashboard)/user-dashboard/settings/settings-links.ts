import { KeyRound, UserRound } from "lucide-react";

export const settingsLinks = [
  {
    href: "/user-dashboard/settings/personal-information",
    label: "ব্যক্তিগত তথ্য",
    description: "আপনার অ্যাকাউন্টের যোগাযোগের তথ্য ও রেফারেল কোড দেখুন।",
    icon: UserRound,
  },
  {
    href: "/user-dashboard/settings/change-password",
    label: "পাসওয়ার্ড পরিবর্তন",
    description: "অ্যাকাউন্টের বর্তমান পাসওয়ার্ড দিয়ে নতুন পাসওয়ার্ড সেট করুন।",
    icon: KeyRound,
  },
];
