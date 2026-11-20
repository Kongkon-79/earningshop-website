export type CatalogProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  summary: string;
};

const diapers: CatalogProduct = {
  id: "diapers",
  name: "বেবি ডায়াপার",
  category: "ডায়াপার",
  price: 650,
  description: "শিশুর দৈনন্দিন ব্যবহারের জন্য ডিসপোজেবল ডায়াপার।",
  summary: "সফট কটন বেবি ডায়াপার — ৫০ পিস প্যাক।",
};

const feedingBottle: CatalogProduct = {
  id: "feeding-bottle",
  name: "বেবি ফিডিং বোতল",
  category: "ফিডিং",
  price: 320,
  description: "দুধ খাওয়ানোর জন্য ঢাকনাসহ স্বচ্ছ ফিডিং বোতল।",
  summary: "BPA-ফ্রি ফিডিং বোতল, ২৫০ মিলি।",
};

const bodysuit: CatalogProduct = {
  id: "bodysuit",
  name: "বেবি বডি সেট",
  category: "পোশাক",
  price: 450,
  description: "শিশুর প্রতিদিনের ব্যবহারের জন্য কটন বডিস্যুট সেট।",
  summary: "নরম কটনের শিশুদের বডি সেট।",
};

const blanket: CatalogProduct = {
  id: "blanket",
  name: "বেবি ব্ল্যাঙ্কেট",
  category: "কম্বল",
  price: 550,
  description: "শিশুর ব্যবহারের জন্য হালকা ও উষ্ণ কম্বল।",
  summary: "হালকা ও উষ্ণ শিশু কম্বল।",
};

export const storefrontProducts = [diapers, feedingBottle, bodysuit];
export const dashboardProducts = [feedingBottle, bodysuit, diapers, blanket];

export function formatProductPrice(amount: number) {
  return `৳${amount.toLocaleString("bn-BD")}`;
}
