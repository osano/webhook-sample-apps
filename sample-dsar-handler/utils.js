/**
 * Parses and validates the request body
 * @param {string} body - Raw request body string
 * @returns {Object} - Parsed body object
 */
export const parseRequestBody = (body) => {
  try {
    return JSON.parse(body || "{}");
  } catch (error) {
    console.warn("Error parsing request body:", error);
    return {};
  }
};
