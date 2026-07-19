// Supabase Edge Function: ozow-notify
// Receives Ozow's server-to-server payment notification, verifies the hash,
// and updates the order status. This is the source of truth for payment state.

import { createClient } from "npm:@supabase/supabase-js@2";

const NOTIFY_HASH_FIELD_ORDER = [
  "SiteCode",
  "TransactionId",
  "TransactionReference",
  "Amount",
  "Status",
  "Optional1",
  "Optional2",
  "Optional3",
  "Optional4",
  "Optional5",
  "CurrencyCode",
  "IsTest",
  "StatusMessage",
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

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const privateKey = Deno.env.get("OZOW_PRIVATE_KEY");
    if (!privateKey) {
      return new Response("Not configured", { status: 500 });
    }

    const form = await req.formData();
    const data: Record<string, string> = {};
    for (const [key, value] of form.entries()) {
      data[key] = String(value);
    }

    const hashInput =
      NOTIFY_HASH_FIELD_ORDER.map((key) => data[key] ?? "").join("") +
      privateKey;
    const expectedHash = await sha512Hex(hashInput.toLowerCase());

    if (
      !data.Hash || expectedHash.toLowerCase() !== data.Hash.toLowerCase()
    ) {
      console.error("ozow-notify: hash mismatch", {
        reference: data.TransactionReference,
      });
      return new Response("Invalid hash", { status: 400 });
    }

    const orderId = data.TransactionReference;
    const status = (data.Status || "").toLowerCase();

    const statusMap: Record<string, string> = {
      complete: "paid",
      cancelled: "cancelled",
      error: "cancelled",
      abandoned: "cancelled",
    };
    const orderStatus = statusMap[status];

    if (orderId && orderStatus) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );

      // Only move forward from pending — never downgrade a paid order.
      const { error } = await supabase
        .from("orders")
        .update({ status: orderStatus })
        .eq("id", orderId)
        .eq("status", "pending");

      if (error) {
        console.error("ozow-notify: order update failed", error.message);
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error(
      "ozow-notify: error",
      error instanceof Error ? error.message : error,
    );
    return new Response("Error", { status: 500 });
  }
});
