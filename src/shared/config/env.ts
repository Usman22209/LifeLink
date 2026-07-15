import {
  APP_FLAVOR,
  WEB_CLIENT_ID,
  ONESIGNAL_APP_ID,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SENTRY_DSN,
  MAP_API_KEY,
} from "@env";

interface EnvConfig {
  APP_FLAVOR: string;
  WEB_CLIENT_ID: string;
  ONESIGNAL_APP_ID: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SENTRY_DSN?: string;
  MAP_API_KEY?: string;
}

const ENV: EnvConfig = {
  APP_FLAVOR,
  WEB_CLIENT_ID,
  ONESIGNAL_APP_ID,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SENTRY_DSN,
  MAP_API_KEY,
};

export default ENV;
