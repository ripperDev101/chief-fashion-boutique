import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface OzowCheckoutItem {
  productId: string;
  quantity: number;
}

export interface OzowCheckoutRequest {
  actionUrl: string;
  fields: Record<string, string>;
}

/**
 * Requests a signed Ozow payment form from the ozow-checkout edge function.
 * The payment amount and hash are computed server-side; the private key never
 * reaches the browser.
 */
export const createOzowCheckoutRequest = async (
  orderId: string,
  items: OzowCheckoutItem[],
  customerName: string,
  customerEmail: string,
  baseUrl: string
): Promise<OzowCheckoutRequest> => {
  const { data, error } = await supabase.functions.invoke('ozow-checkout', {
    body: { orderId, items, customerName, customerEmail, baseUrl },
  });

  if (error) {
    let message = 'Could not start the payment. Please try again.';
    if (error instanceof FunctionsHttpError) {
      try {
        const body = await error.context.json();
        if (body?.error) message = body.error;
      } catch {
        // keep generic message
      }
    }
    throw new Error(message);
  }
  if (data?.error) {
    throw new Error(data.error);
  }
  if (!data?.actionUrl || !data?.fields) {
    throw new Error('Unexpected payment response. Please try again.');
  }

  return { actionUrl: data.actionUrl, fields: data.fields };
};