// Utility functions for input sanitization to prevent XSS and other injection attacks

/**
 * Sanitizes HTML input by escaping dangerous characters
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeHtml = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitizes URL input to prevent open redirect and SSRF
 * @param {string} url - The URL to sanitize
 * @returns {string} - Sanitized URL or null if invalid
 */
export const sanitizeUrl = (url) => {
  if (typeof url !== 'string') return null;

  try {
    const parsedUrl = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return null;
    }
    // Prevent localhost and private IP access
    const hostname = parsedUrl.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' ||
        hostname.startsWith('192.168.') || hostname.startsWith('10.') ||
        hostname.startsWith('172.')) {
      return null;
    }
    return parsedUrl.toString();
  } catch {
    return null;
  }
};

/**
 * Sanitizes user input for database queries (basic)
 * @param {string} input - The input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/['";\\]/g, '');
};