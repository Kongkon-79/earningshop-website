"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, RefreshCw, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { editableProfileFields, profileFieldsSchema, type AccountProfile, type ProfileFields } from "@/lib/personal-profile";
import ProfilePictureEditor from "./profile-picture-editor";

const inputClass = "min-h-11 min-w-0 rounded-xl border-slate-300 bg-white text-base text-slate-900 focus-visible:ring-teal-700";
const outlineButton = "min-h-11 rounded-xl border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus-visible:ring-teal-700";
const saveError = "প্রোফাইল সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।";
const profileInputs = [
  { name: "fullName", label: "পূর্ণ নাম", type: "text", autoComplete: "name", placeholder: "আপনার পূর্ণ নাম", maxLength: 120 },
  { name: "phoneNumber", label: "ফোন নম্বর", type: "tel", autoComplete: "tel", placeholder: "০১XXXXXXXXX", maxLength: 40 },
  { name: "dateOfBirth", label: "জন্মতারিখ", type: "date", autoComplete: "bday", placeholder: undefined, maxLength: undefined },
] as const;

export function ProfileLoadError({ expired }: { expired: boolean }) {
  const router = useRouter();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <p role="alert" className="text-slate-700">
        {expired ? "সেশন শেষ হয়েছে। প্রোফাইল দেখতে আবার লগইন করুন।" : "প্রোফাইলের তথ্য লোড করা যায়নি।"}
      </p>
      {expired ? (
        <Button asChild variant="outline" className={`${outlineButton} mt-3`}>
          <Link href="/login?callbackUrl=%2Fuser-dashboard%2Fsettings%2Fpersonal-information">লগইন করুন</Link>
        </Button>
      ) : (
        <Button type="button" variant="outline" className={`${outlineButton} mt-3`} onClick={() => router.refresh()}>
          <RefreshCw aria-hidden="true" />
          আবার চেষ্টা করুন
        </Button>
      )}
    </section>
  );
}

export default function PersonalInformationForm({ initialProfile }: { initialProfile: AccountProfile }) {
  const router = useRouter();
  const { update, status } = useSession();
  const [profile, setProfile] = useState(initialProfile);
  const [saved, setSaved] = useState(false);
  const [refreshSession, setRefreshSession] = useState(false);
  const form = useForm<ProfileFields>({
    resolver: zodResolver(profileFieldsSchema),
    defaultValues: editableProfileFields(initialProfile),
  });
  const { dirtyFields, errors, isDirty, isSubmitting } = form.formState;

  useEffect(() => {
    if (!refreshSession || status === "loading") return;

    setRefreshSession(false);
    void update({ refreshProfile: true }).catch(() => null).finally(() => router.refresh());
  }, [refreshSession, router, status, update]);

  async function onSubmit(values: ProfileFields) {
    setSaved(false);
    const changes = Object.fromEntries(Object.entries(values).filter(([key]) => dirtyFields[key as keyof ProfileFields]));
    if (Object.keys(changes).length === 0) return;

    try {
      const response = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      const result: { success?: boolean; message?: string; profile?: AccountProfile } | null = await response.json().catch(() => null);
      if (!response.ok || !result?.success || !result.profile) {
        form.setError("root", { message: result?.message || saveError });
        return;
      }

      setProfile(result.profile);
      form.reset(editableProfileFields(result.profile));
      setSaved(true);
      if (dirtyFields.fullName || dirtyFields.phoneNumber) {
        setRefreshSession(true);
      } else {
        router.refresh();
      }
    } catch {
      form.setError("root", { message: saveError });
    }
  }

  return (
    <section aria-labelledby="profile-details-title" className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <ProfilePictureEditor fullName={profile.fullName} initialPicture={initialProfile.profilePicture} />

      <Form {...form}>
        <form noValidate aria-busy={isSubmitting} className="p-4 sm:p-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2">
            {profileInputs.map(({ name, label, ...inputProps }) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem className="min-w-0 space-y-1.5">
                    <FormLabel>{label}{name === "fullName" && <span aria-hidden="true" className="ml-1 text-teal-800">*</span>}</FormLabel>
                    <FormControl>
                      <Input {...inputProps} {...field} required={name === "fullName"} readOnly={isSubmitting} className={inputClass} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="min-w-0 space-y-1.5">
                  <FormLabel>লিঙ্গ</FormLabel>
                  <FormControl>
                    <select {...field} disabled={isSubmitting} className={`${inputClass} w-full border px-3 focus-visible:outline-none focus-visible:ring-1`}>
                      <option value="">উল্লেখ করা হয়নি</option>
                      <option value="male">পুরুষ</option>
                      <option value="female">নারী</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="min-w-0 space-y-1.5 sm:col-span-2">
                  <FormLabel>ঠিকানা</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      autoComplete="street-address"
                      rows={2}
                      maxLength={500}
                      readOnly={isSubmitting}
                      placeholder="বাসা, রোড, এলাকা ও জেলা"
                      className={inputClass}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {errors.root?.message && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">{errors.root.message}</p>}
          {saved && !isDirty && (
            <p role="status" className="mt-4 flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900">
              <CheckCircle2 aria-hidden="true" className="size-4 shrink-0" />
              পরিবর্তন সংরক্ষণ হয়েছে।
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <Button type="submit" disabled={!isDirty || isSubmitting} className="min-h-11 rounded-xl bg-teal-900 px-4 font-semibold text-white hover:bg-teal-800 focus-visible:ring-teal-700">
              <Save aria-hidden="true" />
              {isSubmitting ? "সংরক্ষণ হচ্ছে…" : "সংরক্ষণ করুন"}
            </Button>
            {isDirty && (
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className={outlineButton}
                onClick={() => { form.reset(editableProfileFields(profile)); setSaved(false); }}
              >
                বাতিল করুন
              </Button>
            )}
          </div>
        </form>
      </Form>

      <dl className="grid gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 sm:gap-4 sm:p-6">
        <div className="min-w-0">
          <dt className="text-sm font-medium text-slate-600">ইমেইল</dt>
          <dd className="mt-1 font-semibold [overflow-wrap:anywhere]" dir="ltr">{profile.email}</dd>
          <dd className="mt-1.5 inline-flex rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-700">
            {profile.emailVerified ? "যাচাই সম্পন্ন" : "যাচাই হয়নি"}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-sm font-medium text-slate-600">রেফারেল কোড</dt>
          <dd className="mt-1 font-semibold [overflow-wrap:anywhere]" dir="ltr">
            {profile.referralCode ? <code>{profile.referralCode}</code> : "এখনও নেই"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
