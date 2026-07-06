import crypto from 'crypto-js';

const OZOW_SITE_CODE = import.meta.env.VITE_OZOW_SITE_CODE;
const OZOW_SECRET_KEY = import.meta.env.VITE_OZOW_SECRET_KEY;
const OZOW_IS_TEST = import.meta.env.VITE_OZOW_IS_TEST !== 'false';
const OZOW_TEST_AMOUNT = import.meta.env.VITE_OZOW_TEST_AMOUNT || '0.01';
const OZOW_COUNTRY_CODE = import.meta.env.VITE_OZOW_COUNTRY_CODE || 'ZA';
const OZOW_CURRENCY_CODE = import.meta.env.VITE_OZOW_CURRENCY_CODE || 'ZAR';
const SUCCESS_URL_OVERRIDE = import.meta.env.VITE_OZOW_SUCCESS_URL;
const CANCEL_URL_OVERRIDE = import.meta.env.VITE_OZOW_CANCEL_URL;
const ERROR_URL_OVERRIDE = import.meta.env.VITE_OZOW_ERROR_URL;
const NOTIFY_URL_OVERRIDE = import.meta.env.VITE_OZOW_NOTIFY_URL;

const OZOW_PAYMENT_URL = 'https://pay.ozow.com';

const ensureOzowConfig = () => {
  if (!OZOW_SITE_CODE || !OZOW_SECRET_KEY) {
    throw new Error('Ozow is not configured. Set VITE_OZOW_SITE_CODE and VITE_OZOW_SECRET_KEY.');
  }
};

const isLocalCallbackHost = (baseUrl: string) => {
  try {
    const { hostname } = new URL(baseUrl);
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  } catch {
    return false;
  }
};

const buildCallbackUrl = (
  overrideUrl: string | undefined,
  fallbackUrl: string,
  useEmptyLocalCallback: boolean
) => {
  if (overrideUrl !== undefined) {
    return overrideUrl;
  }

  return useEmptyLocalCallback ? '' : fallbackUrl;
};

export interface OzowPaymentData {
  SiteCode: string;
  CountryCode: string;
  CurrencyCode: string;
  Amount: string;
  TransactionReference: string;
  BankReference: string;
  Optional1: string;
  Optional2: string;
  Optional3: string;
  Optional4: string;
  Optional5: string;
  Customer: string;
  CancelUrl: string;
  ErrorUrl: string;
  SuccessUrl: string;
  NotifyUrl: string;
  IsTest: string;
}

export interface OzowCheckoutRequest {
  actionUrl: string;
  fields: Record<string, string>;
}

const OZOW_HASH_FIELD_ORDER: Array<keyof OzowPaymentData> = [
  'SiteCode',
  'CountryCode',
  'CurrencyCode',
  'Amount',
  'TransactionReference',
  'BankReference',
  'Optional1',
  'Optional2',
  'Optional3',
  'Optional4',
  'Optional5',
  'Customer',
  'CancelUrl',
  'ErrorUrl',
  'SuccessUrl',
  'NotifyUrl',
  'IsTest',
];

export const generateOzowHashCheck = (data: OzowPaymentData): string => {
  ensureOzowConfig();

  const hashString = `${OZOW_HASH_FIELD_ORDER.map((key) => data[key] || '').join('')}${OZOW_SECRET_KEY}`;
  return crypto.SHA512(hashString.toLowerCase()).toString();
};

const buildOzowPaymentData = (
  orderId: string,
  amount: number,
  customerName: string,
  customerEmail: string,
  baseUrl: string
): OzowPaymentData => {
  ensureOzowConfig();
  const useEmptyLocalCallback = isLocalCallbackHost(baseUrl);

  return {
    SiteCode: OZOW_SITE_CODE,
    CountryCode: OZOW_COUNTRY_CODE,
    CurrencyCode: OZOW_CURRENCY_CODE,
    Amount: OZOW_IS_TEST ? OZOW_TEST_AMOUNT : amount.toFixed(2),
    TransactionReference: orderId,
    BankReference: `CF-${orderId.slice(0, 8)}`,
    Optional1: orderId,
    Optional2: '',
    Optional3: '',
    Optional4: '',
    Optional5: '',
    Customer: customerName || customerEmail,
    CancelUrl: buildCallbackUrl(
      CANCEL_URL_OVERRIDE,
      `${baseUrl}/checkout?payment=cancelled&orderId=${orderId}`,
      useEmptyLocalCallback
    ),
    ErrorUrl: buildCallbackUrl(
      ERROR_URL_OVERRIDE,
      `${baseUrl}/checkout?payment=error&orderId=${orderId}`,
      useEmptyLocalCallback
    ),
    SuccessUrl: buildCallbackUrl(
      SUCCESS_URL_OVERRIDE,
      `${baseUrl}/order-confirmation?payment=success&orderId=${orderId}`,
      useEmptyLocalCallback
    ),
    NotifyUrl: NOTIFY_URL_OVERRIDE || '',
    IsTest: OZOW_IS_TEST ? 'true' : 'false',
  };
};

export const createOzowCheckoutRequest = (
  orderId: string,
  amount: number,
  customerName: string,
  customerEmail: string,
  baseUrl: string
): OzowCheckoutRequest => {
  const paymentData = buildOzowPaymentData(orderId, amount, customerName, customerEmail, baseUrl);
  const hashCheck = generateOzowHashCheck(paymentData);

  return {
    actionUrl: OZOW_PAYMENT_URL,
    fields: {
      ...paymentData,
      HashCheck: hashCheck,
    },
  };
};
