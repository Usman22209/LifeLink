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
      user.length <= 2
        ? user[0] + "***"
        : user.slice(0, 2) + "***" + user.slice(-1);
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
  context: SentryErrorContext = {},
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

    // Clean endpoint for Sentry grouping (e.g., "blood-requests/feed")
    const cleanEndpoint = endpoint
      ? String(endpoint)
          .replace(/^https?:\/\/[^\/]+\/?/, "")
          .split("?")[0]
      : "unknown";

    const titleMessage = status
      ? `[${method} ${cleanEndpoint}] HTTP ${status}: ${errorMessage}`
      : `[${method} ${cleanEndpoint}] Network Error: ${
          error?.code === "ECONNABORTED"
            ? "Request Timeout (10s)"
            : errorMessage
        }`;

    const errorToCapture = new Error(titleMessage);
    errorToCapture.name = status
      ? `ApiError_${status}`
      : error?.code === "ECONNABORTED"
        ? "ApiTimeoutError"
        : "NetworkConnectionError";

    // Preserve original stack trace if available
    if (error instanceof Error && error.stack) {
      errorToCapture.stack = error.stack;
    }

    Sentry.captureException(errorToCapture, {
      fingerprint: [method, cleanEndpoint, String(status || "NETWORK_ERROR")],
      tags: {
        feature: context.feature || "api",
        action: context.action || "request",
        endpoint: cleanEndpoint,
        http_method: method,
        status_code: String(status || "NETWORK_ERROR"),
        is_server_issue: String(isServerIssue),
        platform: Platform.OS,
      },
      extra: {
        method,
        fullUrl: endpoint,
        endpoint: cleanEndpoint,
        status,
        statusText,
        responseBody: responseData,
        errorMessage,
        errorCode: error?.code,
        ...context.additionalData,
      },
    });

    console.log(
      `🚨 [Sentry] Logged non-fatal backend issue: ${method} ${endpoint || ""} (${status || "NET_ERR"}): ${errorMessage}`,
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
  meta?: { email?: string; loginMethod?: "email" | "google" },
) => {
  try {
    const status = error?.response?.status;
    const responseData = error?.response?.data;
    const responseMessage =
      responseData?.message || error?.message || "Unknown login error";

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
        : new Error(
            `Login Failed [${status || "NET_ERR"}]: ${responseMessage}`,
          );

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
      `🔒 [Sentry] Logged login failure (${meta?.loginMethod || "email"}, status: ${status || "NET_ERR"}): ${responseMessage}`,
    );
  } catch (sentryErr) {
    console.error("Failed to log login failure to Sentry:", sentryErr);
  }
};

export const logScreenBreadcrumb = (
  screenName: string,
  action: string,
  data?: Record<string, any>,
) => {
  try {
    Sentry.addBreadcrumb({
      category: "screen.action",
      message: `[${screenName}] ${action}`,
      level: "info",
      data,
    });
  } catch (err) {
    console.warn("Failed to add Sentry breadcrumb:", err);
  }
};

export const captureScreenStuck = (
  screenName: string,
  action: string,
  durationMs: number,
  context?: Record<string, any>,
) => {
  try {
    const seconds = Math.round(durationMs / 1000);
    const title = `[ScreenHang] ${screenName} remained stuck in "${action}" for > ${seconds}s`;
    const err = new Error(title);
    err.name = "ScreenStuckTimeoutError";

    Sentry.captureException(err, {
      level: "warning",
      fingerprint: ["ScreenStuck", screenName, action],
      tags: {
        feature: "screen_watchdog",
        stuck_screen: screenName,
        stuck_action: action,
        hang_detected: "true",
        platform: Platform.OS,
      },
      extra: {
        screenName,
        action,
        durationMs,
        durationSeconds: seconds,
        ...context,
      },
    });

    console.warn(`⏳ [Sentry] Logged screen hang alert: ${title}`);
  } catch (err) {
    console.error("Failed to capture screen stuck error in Sentry:", err);
  }
};

import { useEffect, useRef } from "react";
import NetInfo from "@react-native-community/netinfo";

export const useScreenHangWatchdog = (
  screenName: string,
  isBusy: boolean,
  options?: {
    timeoutMs?: number;
    actionName?: string;
    context?: Record<string, any>;
  },
) => {
  const actionName = options?.actionName || "loading";
  const timeoutMs = options?.timeoutMs ?? 12000;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const hasFiredRef = useRef<boolean>(false);

  useEffect(() => {
    if (isBusy) {
      startTimeRef.current = Date.now();
      hasFiredRef.current = false;
      logScreenBreadcrumb(
        screenName,
        `Started ${actionName}`,
        options?.context,
      );

      timerRef.current = setTimeout(() => {
        hasFiredRef.current = true;
        const elapsed = Date.now() - startTimeRef.current;
        captureScreenStuck(screenName, actionName, elapsed, options?.context);
      }, timeoutMs);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (startTimeRef.current > 0) {
        const elapsed = Date.now() - startTimeRef.current;
        if (!hasFiredRef.current) {
          logScreenBreadcrumb(
            screenName,
            `Finished ${actionName} in ${elapsed}ms`,
          );
        }
        startTimeRef.current = 0;
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isBusy, screenName, actionName, timeoutMs]);
};

export const initNetworkSentryTracking = () => {
  try {
    NetInfo.addEventListener((state) => {
      Sentry.addBreadcrumb({
        category: "network.connectivity",
        message: `Network ${state.isConnected ? "Connected" : "Disconnected"} (${state.type}, internetReachable: ${state.isInternetReachable ?? "unknown"})`,
        level: state.isConnected ? "info" : "warning",
        data: {
          isConnected: state.isConnected,
          isInternetReachable: state.isInternetReachable,
          type: state.type,
        },
      });
    });
  } catch (err) {
    console.warn("Failed to initialize network tracking for Sentry:", err);
  }
};
