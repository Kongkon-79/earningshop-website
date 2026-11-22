import { NextResponse } from "next/server";
import { z } from "zod";
import { backendApiUrl } from "@/lib/backend-url";
import type { StorefrontProduct, StorefrontProductPage } from "@/lib/product-catalog";

const productResponse = z.object({
  success: z.literal(true),
  meta: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
  }),
  data: z.array(z.object({ status: z.string() }).passthrough()),
});

const activeProduct = z.object({
  _id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  discription: z.string().trim().nullish(),
  catagory: z.string().trim().nullish(),
  price: z.number().nonnegative(),
  image: z.array(z.unknown()).nullish(),
});

const webImage = z.url({ protocol: /^https?$/ });
const productsPerPage = 9;

function unavailable() {
  return NextResponse.json({ success: false }, { status: 502 });
}

export async function GET(request: Request) {
  const page = Number(new URL(request.url).searchParams.get("page") ?? 1);
  if (!Number.isSafeInteger(page) || page < 1) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  try {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(productsPerPage),
      status: "active",
    });
    const response = await fetch(backendApiUrl("/product", query), {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return unavailable();

    const { data, meta } = productResponse.parse(await response.json());
    if (meta.page !== page) return unavailable();

    const products: StorefrontProduct[] = data.filter(({ status }) => status === "active").map((record) => {
      const product = activeProduct.parse(record);
      const images = new Set<string>();
      for (const image of product.image ?? []) {
        const parsed = webImage.safeParse(image);
        if (parsed.success) images.add(parsed.data);
      }

      return {
        id: product._id,
        name: product.name,
        category: product.catagory ?? "",
        description: product.discription ?? "",
        price: product.price,
        images: Array.from(images),
      };
    });

    return NextResponse.json({
      products,
      nextPage: meta.page * meta.limit < meta.total ? page + 1 : null,
    } satisfies StorefrontProductPage);
  } catch {
    return unavailable();
  }
}
