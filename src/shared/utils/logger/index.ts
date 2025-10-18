const COLORS = {
  red: "color: #ff8787;",
  orange: "color: #ffd380;",
  blue: "color: #74c0fc;",
  purple: "color: #dab6fc;",
  green: "color: #69db7c;",
};

const config = {
  logLevel: __DEV__ ? "debug" : "error",
  colors: true,
};

type LogLevel = "error" | "warn" | "info" | "debug";
type LogFunction = (message: any, data?: any) => void;

type Logger = {
  error: (error: unknown) => void;
  warn: LogFunction;
  info: LogFunction;
  debug: LogFunction;
  data: (data: unknown) => void;
};

const shouldLog = (level: LogLevel): boolean => {
  const levels: LogLevel[] = ["error", "warn", "info", "debug"];
  return levels.indexOf(level) <= levels.indexOf(config.logLevel as LogLevel);
};

const colorizeValue = (value: any): string => {
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
};

const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
};

const formatLog = (color: string, type: string, content: string) => {
  return [`%c[${type}] ${content}`, color];
};

export const logger: Logger = {
  error: (error: unknown): void => {
    if (!shouldLog("error")) return;
    const message = error instanceof Error ? error.stack || error.message : String(error);
    originalConsole.log(...formatLog(COLORS.red, "ERROR", message));
  },

  warn: (message: any, data: any = {}): void => {
    if (!shouldLog("warn")) return;
    originalConsole.log(...formatLog(COLORS.orange, "WARN", `${message}\n${colorizeValue(data)}`));
  },

  info: (message: any, data: any = {}): void => {
    if (!shouldLog("info")) return;
    originalConsole.log(...formatLog(COLORS.blue, "INFO", `${message}\n${colorizeValue(data)}`));
  },

  debug: (message: any, data: any = {}): void => {
    if (!shouldLog("debug")) return;
    originalConsole.log(...formatLog(COLORS.purple, "DEBUG", `${message}\n${colorizeValue(data)}`));
  },

  data: (data: unknown): void => {
    if (!shouldLog("debug")) return;
    originalConsole.log(...formatLog(COLORS.green, "DATA", colorizeValue(data)));
  },
};
