import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface OzowCheckoutItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface OzowShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OzowCheckoutRequest {
  actionUrl: string;
  fields: Record<string, string>;
}

/**
 * Requests a signed Ozow payment form from the ozow-checkout edge function.
 * The order (including shipping details) is stored server-side and the payment
 * amount and hash are computed server-side; the private key never reaches the
 * browser.
 */
export const createOzowCheckoutRequest = async (
  orderId: string,
  items: OzowCheckoutItem[],
  shippingAddress: OzowShippingAddress,
  baseUrl: string
): Promise<OzowCheckoutRequest> => {
  const { data, error } = await supabase.functions.invoke('ozow-checkout', {
    body: {
      orderId,
      items,
      customerName: shippingAddress.fullName,
      customerEmail: shippingAddress.email,
      shippingAddress,
      baseUrl,
    },
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