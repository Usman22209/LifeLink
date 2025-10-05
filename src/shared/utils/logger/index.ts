const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  green: '\x1b[32m',
  gray: '\x1b[90m',
  white: '\x1b[37m',
  bracket: '\x1b[36m',
  brace: '\x1b[36m',
  key: '\x1b[33m',
  string: '\x1b[32m',
  number: '\x1b[35m',
  boolean: '\x1b[31m',
  null: '\x1b[31m',
};

const config = {
  logLevel: __DEV__ ? 'debug' : 'error',
  colors: __DEV__,
};

type LogLevel = 'error' | 'warn' | 'info' | 'debug';
type LogFunction = (message: any, data?: any) => void;

type Logger = {
  error: (error: unknown, context?: string) => void;
  warn: LogFunction;
  info: LogFunction;
  debug: LogFunction;
  data: (data: unknown, label?: string) => void;
};

const shouldLog = (level: LogLevel): boolean => {
  const levels: LogLevel[] = ['error', 'warn', 'info', 'debug'];
  return levels.indexOf(level) <= levels.indexOf(config.logLevel as LogLevel);
};

const colorizeValue = (value: any, level = 1): string => {
  if (!config.colors) return JSON.stringify(value, null, 2);

  const indent = (l: number) => '  '.repeat(l);
  const color = COLORS.reset;

  if (Array.isArray(value)) {
    const items = value
      .map(item => `${indent(level)}${colorizeValue(item, level + 1)}`)
      .join(`,\n`);
    return `${COLORS.bracket}[\n${items}\n${indent(level - 1)}]${color}`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
      .map(
        ([k, v]) =>
          `${indent(level)}${COLORS.key}"${k}"${COLORS.reset}: ${colorizeValue(v, level + 1)}`,
      )
      .join(`,\n`);
    return `${COLORS.brace}{\n${entries}\n${indent(level - 1)}}${color}`;
  }

  if (typeof value === 'string') return `${COLORS.string}"${value}"${color}`;
  if (typeof value === 'number') return `${COLORS.number}${value}${color}`;
  if (typeof value === 'boolean') return `${COLORS.boolean}${value}${color}`;
  if (value === null) return `${COLORS.null}null${color}`;

  return value;
};

const formatLog = (
  icon: string,
  color: string,
  type: string,
  label: string,
  content: string,
): string => {
  const logPrefix = config.colors ? `${COLORS.gray}LOG${COLORS.reset}` : 'LOG';
  const styledIcon = config.colors ? `${color}${icon}` : icon;
  const styledType = config.colors ? `${color}[${type}]` : `[${type}]`;
  const styledLabel = config.colors ? `${COLORS.white}${label}` : label;
  const styledContent = config.colors
    ? content
    : content.replace(/\x1b\[\d+m/g, '');

  return `${logPrefix} ${styledIcon} ${styledType} ${styledLabel}\n${styledContent}`;
};

export const logger: Logger = {
  error: (error: unknown, context = 'Error') => {
    if (!shouldLog('error')) return;
    const message =
      error instanceof Error ? error.stack || error.message : String(error);
    console.log(formatLog('❌', COLORS.red, 'ERROR', context, message));
  },

  warn: (message, data = {}) => {
    if (!shouldLog('warn')) return;
    console.log(
      formatLog('⚠️', COLORS.yellow, 'WARN', message, colorizeValue(data)),
    );
  },

  info: (message, data = {}) => {
    if (!shouldLog('info')) return;
    console.log(
      formatLog('ℹ️', COLORS.cyan, 'INFO', message, colorizeValue(data)),
    );
  },

  debug: (message, data = {}) => {
    if (!shouldLog('debug')) return;
    console.log(
      formatLog('🐛', COLORS.magenta, 'DEBUG', message, colorizeValue(data)),
    );
  },

  data: (data: unknown, label = 'Data') => {
    if (!shouldLog('debug')) return;

    const isArray = Array.isArray(data);
    const isObject = typeof data === 'object' && data !== null && !isArray;
    const type = isArray ? 'ARRAY' : isObject ? 'OBJECT' : 'UNKNOWN';
    const icon = isArray ? '📋' : isObject ? '📦' : '❓';

    let content;
    try {
      content = colorizeValue(data);
    } catch (error) {
      content = `Error stringifying data: ${error instanceof Error ? error.message : String(error)}`;
    }

    console.log(formatLog(icon, COLORS.green, type, label, content));
  },
};
