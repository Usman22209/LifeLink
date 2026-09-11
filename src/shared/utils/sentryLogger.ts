import * as Sentry from "@sentry/react-native";
import { Platform } from "react-native";

export interface SentryErrorContext {
  feature?: string;
  action?: string;
  additionalData?: Record<string, any>;
}

/**
 * Mask email for user privacy in error tracking (e.g., "us***@gmail.com")
 */
function maskEmail(email?: string): string | undefined {
  if (!email || !email.includes("@")) return undefined;
  try {
    const [user, domain] = email.split("@");
    if (!domain) return "***";
    const maskedUser =
      user.length <= 2 ? user[0] + "***" : user.slice(0, 2) + "***" + user.slice(-1);
    return `${maskedUser}@${domain}`;
  } catch {
    return "***";
  }
}

/**
 * Capture non-fatal backend failures and broken functionality in Sentry
 */
export const captureBackendError = (
  error: any,
  context: SentryErrorContext = {}
) => {
  try {
    const status = error?.response?.status;
    const statusText = error?.response?.statusText;
    const endpoint = error?.config?.url || error?.request?._url;
    const method = error?.config?.method?.toUpperCase() || "UNKNOWN";
    const responseData = error?.response?.data;
    const errorMessage =
      responseData?.message ||
      responseData?.error ||
      error?.message ||
      "Unknown backend error";

    // Add breadcrumb for trail analysis
    Sentry.addBreadcrumb({
      category: context.feature || "api",
      message: `${method} ${endpoint || "unknown"} failed with status ${status || "NETWORK_ERROR"}: ${errorMessage}`,
      level: "error",
      data: {
        status,
        endpoint,
        responseData,
      },
    });

    const isServerIssue =
      !status || // Network failure / timeout / connection refused
      status >= 500 || // 500, 502, 503, 504
      status === 404 || // Endpoint missing or misconfigured
      status === 408; // Timeout

    const errorToCapture =
      error instanceof Error
        ? error
        : new Error(`Backend Error [${status || "NETWORK"}]: ${errorMessage}`);

    Sentry.captureException(errorToCapture, {
      tags: {
        feature: context.feature || "api",
        action: context.action || "request",
        status_code: String(status || "NETWORK_ERROR"),
        is_server_issue: String(isServerIssue),
        platform: Platform.OS,
      },
      extra: {
        method,
        endpoint,
        status,
        statusText,
        responseBody: responseData,
        errorMessage,
        ...context.additionalData,
      },
    });

    console.log(
      `🚨 [Sentry] Logged non-fatal backend issue: ${method} ${endpoint || ""} (${status || "NET_ERR"}): ${errorMessage}`
    );
  } catch (sentryErr) {
    console.error("Failed to log error to Sentry:", sentryErr);
  }
};

/**
 * Specifically log login failures (5xx, network errors, unexpected "something went wrong" issues)
 */
export const captureLoginFailure = (
  error: any,
  meta?: { email?: string; loginMethod?: "email" | "google" }
) => {
  try {
    const status = error?.response?.status;
    const responseData = error?.response?.data;
    const responseMessage =
      responseData?.message ||
      error?.message ||
      "Unknown login error";

    const isBackendIssue =
      !status ||
      status >= 500 ||
      status === 404 ||
      status === 408 ||
      String(responseMessage).toLowerCase().includes("something went wrong") ||
      String(responseMessage).toLowerCase().includes("internal server error") ||
      String(responseMessage).toLowerCase().includes("network error") ||
      String(responseMessage).toLowerCase().includes("failed to fetch");

    // Mask user email for privacy in Sentry logs
    const maskedEmail = maskEmail(meta?.email);

    // Create a meaningful error instance
    const errorToLog =
      error instanceof Error
        ? error
        : new Error(`Login Failed [${status || "NET_ERR"}]: ${responseMessage}`);

    Sentry.captureException(errorToLog, {
      tags: {
        feature: "auth",
        action: "login",
        login_method: meta?.loginMethod || "email",
        status_code: String(status || "NETWORK_ERROR"),
        is_backend_issue: String(isBackendIssue),
        platform: Platform.OS,
      },
      extra: {
        loginMethod: meta?.loginMethod || "email",
        emailAttempted: maskedEmail,
        status,
        responseMessage,
        responseBody: responseData,
        endpoint: error?.config?.url,
      },
    });

    console.log(
      `🔒 [Sentry] Logged login failure (${meta?.loginMethod || "email"}, status: ${status || "NET_ERR"}): ${responseMessage}`
    );
  } catch (sentryErr) {
    console.error("Failed to log login failure to Sentry:", sentryErr);
  }
};
