import {
  APP_FLAVOR,
  WEB_CLIENT_ID,
  ONESIGNAL_APP_ID,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SENTRY_DSN,
} from "@env";

interface EnvConfig {
  APP_FLAVOR: string;
  WEB_CLIENT_ID: string;
  ONESIGNAL_APP_ID: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SENTRY_DSN?: string;
}

const ENV: EnvConfig = {
  APP_FLAVOR,
  WEB_CLIENT_ID,
  ONESIGNAL_APP_ID,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SENTRY_DSN,
};

export default ENV;
