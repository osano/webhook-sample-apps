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

/**
 * Calculates exponential backoff delay with jitter to avoid thundering herd
 * @param {number} attempt - Current retry attempt (0-indexed)
 * @param {number} baseDelayMs - Base delay in milliseconds
 * @param {number} maxDelayMs - Maximum delay in milliseconds
 * @returns {number} - Delay in milliseconds
 */
const calculateBackoffDelay = (
  attempt,
  baseDelayMs = 1000,
  maxDelayMs = 30000
) => {
  const exponentialDelay = Math.min(
    baseDelayMs * Math.pow(2, attempt),
    maxDelayMs
  );
  // Add jitter: random value between 0 and 50% of the exponential delay
  const jitter = Math.random() * (exponentialDelay * 0.5);
  return Math.floor(exponentialDelay + jitter);
};

/**
 * Fetches with exponential backoff
 * If the response is a 429, the function will wait for the calculated delay and retry
 * If the maximum number of attempts is reached, the function will throw the error
 * @param {...any} args - The arguments to pass to the fetch function
 * @returns {Promise<Response>} - The response from the fetch function
 */
export const fetchWithExponentialBackoff = async (...args) => {
  const BACKOFF_MAX_ATTEMPTS = 5;

  let attempt = 0;
  while (attempt < BACKOFF_MAX_ATTEMPTS) {
    const response = await fetch(...args);

    if (response.status === 429) {
      const delay = calculateBackoffDelay(attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
      attempt++;
      continue;
    }

    return response;
  }

  throw new Error(
    "Unable to fetch data. Maximum number of fetch attempts reached."
  );
};
