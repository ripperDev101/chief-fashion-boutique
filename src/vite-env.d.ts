/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_PROJECT_ID: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_OZOW_SITE_CODE?: string;
  readonly VITE_OZOW_SECRET_KEY?: string;
  readonly VITE_OZOW_IS_TEST?: 'true' | 'false';
  readonly VITE_OZOW_TEST_AMOUNT?: string;
  readonly VITE_OZOW_COUNTRY_CODE?: string;
  readonly VITE_OZOW_CURRENCY_CODE?: string;
  readonly VITE_OZOW_SUCCESS_URL?: string;
  readonly VITE_OZOW_CANCEL_URL?: string;
  readonly VITE_OZOW_ERROR_URL?: string;
  readonly VITE_OZOW_NOTIFY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
