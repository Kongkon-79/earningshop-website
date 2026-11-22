import { z } from "zod";

export const profileGenderSchema = z.enum(["male", "female"]);

export const profileFieldsSchema = z.strictObject({
  fullName: z.string().trim().min(1, "পূর্ণ নাম লিখুন।").max(120, "নাম ১২০ অক্ষরের মধ্যে লিখুন।"),
  phoneNumber: z.string().trim().max(40, "ফোন নম্বর যাচাই করুন।"),
  gender: profileGenderSchema.or(z.literal("")),
  dateOfBirth: z.iso.date("সঠিক জন্মতারিখ দিন।").or(z.literal("")),
  address: z.string().trim().max(500, "ঠিকানা ৫০০ অক্ষরের মধ্যে লিখুন।"),
});

export const profileUpdateSchema = profileFieldsSchema.partial().refine((fields) => Object.keys(fields).length > 0);

export type ProfileFields = z.infer<typeof profileFieldsSchema>;
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;

export type AccountProfile = ProfileFields & {
  id: string;
  email: string;
  emailVerified: boolean;
  referralCode: string;
  profilePicture: string;
};

export function editableProfileFields({ fullName, phoneNumber, gender, dateOfBirth, address }: AccountProfile): ProfileFields {
  return { fullName, phoneNumber, gender, dateOfBirth, address };
}
