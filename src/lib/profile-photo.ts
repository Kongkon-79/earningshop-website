export const profilePhotoMaxBytes = 4 * 1024 * 1024;
export const profilePhotoSizeMessage = "ছবির সাইজ ৪ এমবির মধ্যে রাখুন।";
export const profilePhotoFormatMessage = "JPG, PNG বা WebP ছবি বেছে নিন।";
export const profilePhotoTypes = ["image/jpeg", "image/png", "image/webp"];

export function validateProfilePhoto(file: Pick<File, "size" | "type">) {
  if (file.size > profilePhotoMaxBytes) return profilePhotoSizeMessage;
  if (!file.size || !profilePhotoTypes.includes(file.type)) return profilePhotoFormatMessage;
  return null;
}
