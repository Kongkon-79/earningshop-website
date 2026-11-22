import { z } from "zod";
import { backendApiUrl } from "./backend-url";
import { profileGenderSchema, type AccountProfile, type ProfileUpdate } from "./personal-profile";

const profileResponse = z.object({
  success: z.literal(true),
  data: z.object({
    _id: z.string(),
    fullName: z.string(),
    email: z.string(),
    emailVerified: z.boolean().optional(),
    phoneNumber: z.string().nullish(),
    gender: profileGenderSchema.nullish(),
    dateOfBirth: z.string().nullish(),
    address: z.string().nullish(),
    referralCode: z.string().nullish(),
    profilePicture: z.string().nullish(),
  }),
});

export class BackendProfileError extends Error {
  constructor(public readonly status: number) {
    super("Backend profile request failed");
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

async function requestProfile(accessToken: string, body?: string | FormData): Promise<AccountProfile> {
  const response = await fetch(backendApiUrl("/user/profile"), {
    method: body ? "PUT" : "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(typeof body === "string" ? { "Content-Type": "application/json" } : {}),
    },
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(body instanceof FormData ? 20000 : 8000),
  });

  if (!response.ok) throw new BackendProfileError(response.status);

  const { data } = profileResponse.parse(await response.json());
  return {
    id: data._id,
    fullName: data.fullName,
    email: data.email,
    emailVerified: data.emailVerified ?? false,
    phoneNumber: data.phoneNumber ?? "",
    gender: data.gender ?? "",
    dateOfBirth: data.dateOfBirth?.slice(0, 10) ?? "",
    address: data.address ?? "",
    referralCode: data.referralCode ?? "",
    profilePicture: z.url({ protocol: /^https?$/ }).safeParse(data.profilePicture).data ?? "",
  };
}

export function getAccountProfile(accessToken: string) {
  return requestProfile(accessToken);
}

export function updateAccountProfile(accessToken: string, fields: ProfileUpdate) {
  return requestProfile(accessToken, JSON.stringify({
    ...fields,
    gender: fields.gender === "" ? null : fields.gender,
    dateOfBirth: fields.dateOfBirth === "" ? null : fields.dateOfBirth,
  }));
}

export function updateAccountProfilePicture(accessToken: string, picture: File) {
  const body = new FormData();
  body.append("profilePicture", picture, picture.name);
  return requestProfile(accessToken, body);
}
