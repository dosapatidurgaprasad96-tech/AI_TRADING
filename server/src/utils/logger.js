/**
 * Basic logger utility (can be replaced with Winston/Pino later)
 */
const logger = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`),
};

module.exports = logger;
