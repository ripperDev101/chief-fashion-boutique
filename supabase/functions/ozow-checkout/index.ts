// Supabase Edge Function: ozow-checkout
// Builds an Ozow payment request server-side so the private key never reaches the browser.
// The amount is recomputed from product prices in the database — clients cannot tamper with it.

import { createClient } from "npm:@supabase/supabase-js@2";

const OZOW_PAYMENT_URL = "https://pay.ozow.com";
const FREE_SHIPPING_THRESHOLD = 1500;
const SHIPPING_FEE = 100;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface CheckoutItem {
  productId: string;
  quantity: number;
}

interface CheckoutRequest {
  orderId: string;
  items: CheckoutItem[];
  customerName: string;
  customerEmail: string;
  baseUrl: string;
}

const HASH_FIELD_ORDER = [
  "SiteCode",
  "CountryCode",
  "CurrencyCode",
  "Amount",
  "TransactionReference",
  "BankReference",
  "Optional1",
  "Optional2",
  "Optional3",
  "Optional4",
  "Optional5",
  "Customer",
  "CancelUrl",
  "ErrorUrl",
  "SuccessUrl",
  "NotifyUrl",
  "IsTest",
] as const;

const sha512Hex = async (input: string): Promise<string> => {
  const digest = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(input),
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    .test(value);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const siteCode = Deno.env.get("OZOW_SITE_CODE");
    const privateKey = Deno.env.get("OZOW_PRIVATE_KEY");
    const isTest = Deno.env.get("OZOW_IS_TEST") !== "false";
    const testAmount = Deno.env.get("OZOW_TEST_AMOUNT") || "0.01";

    if (!siteCode || !privateKey) {
      return new Response(JSON.stringify({ error: "Ozow not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as CheckoutRequest;
    const { orderId, items, customerName, customerEmail, baseUrl } = body;

    if (!orderId || !isUuid(orderId)) {
      throw new Error("Invalid order reference");
    }
    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      throw new Error("Invalid items");
    }
    for (const item of items) {
      if (
        !item.productId || !isUuid(item.productId) ||
        !Number.isInteger(item.quantity) || item.quantity < 1 ||
        item.quantity > 50
      ) {
        throw new Error("Invalid item");
      }
    }

    let origin: string;
    try {
      origin = new URL(baseUrl).origin;
    } catch {
      throw new Error("Invalid base URL");
    }

    // Recompute the total from database prices — never trust client-side amounts.
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const productIds = [...new Set(items.map((i) => i.productId))];
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, price, stock")
      .in("id", productIds);

    if (productsError) throw productsError;
    if (!products || products.length !== productIds.length) {
      throw new Error("One or more products no longer exist");
    }

    const priceById = new Map(products.map((p) => [p.id, Number(p.price)]));
    let subtotal = 0;
    for (const item of items) {
      subtotal += priceById.get(item.productId)! * item.quantity;
    }
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;

    const notifyUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/ozow-notify`;

    const fields: Record<string, string> = {
      SiteCode: siteCode,
      CountryCode: "ZA",
      CurrencyCode: "ZAR",
      Amount: isTest ? testAmount : total.toFixed(2),
      TransactionReference: orderId,
      BankReference: `CF-${orderId.slice(0, 8)}`,
      Optional1: orderId,
      Optional2: "",
      Optional3: "",
      Optional4: "",
      Optional5: "",
      Customer: (customerName || customerEmail || "").slice(0, 100),
      CancelUrl: `${origin}/checkout?payment=cancelled&orderId=${orderId}`,
      ErrorUrl: `${origin}/checkout?payment=error&orderId=${orderId}`,
      SuccessUrl:
        `${origin}/order-confirmation?payment=success&orderId=${orderId}`,
      NotifyUrl: notifyUrl,
      IsTest: isTest ? "true" : "false",
    };

    const hashInput = HASH_FIELD_ORDER.map((key) => fields[key] ?? "").join("") +
      privateKey;
    fields.HashCheck = await sha512Hex(hashInput.toLowerCase());

    return new Response(
      JSON.stringify({
        actionUrl: OZOW_PAYMENT_URL,
        fields,
        total: fields.Amount,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
