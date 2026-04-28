import { fetchWithExponentialBackoff } from "../utils.js";

const GLADLY_API_URL = `https://${process.env.GLADLY_ORGANIZATION_ID}.gladly.com/api`;
const GLADLY_LIMITED_DATA_HEADER = "Gladly-Limited-Data";

const authenticatedFetch = (url, options) => {
  const basicAuthCredentials = Buffer.from(
    `${process.env.GLADLY_AGENT_EMAIL}:${process.env.GLADLY_API_KEY}`
  ).toString("base64");
  return fetchWithExponentialBackoff(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuthCredentials}`,
    },
  });
};

/**
 * Gets the customer profiles for a given email
 * NOTE: Gladly API returns a max of 50 customer profiles
 * @param {string} email - The email of the requester
 * @returns {Promise<Object[]>} - The customer profiles returned from the Gladly API
 * @throws {Error} - If the customer profiles were not returned from the Gladly API
 */
export const getCustomerProfiles = async (email) => {
  const response = await authenticatedFetch(
    `${GLADLY_API_URL}/v1/customer-profiles?email=${encodeURIComponent(email)}`,
    { method: "GET" }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to get customer profiles for email ${email} via Gladly API: HTTP ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};

/**
 * Gets the conversations for a given customer profile
 * NOTE: Gladly API returns a max of 100 conversations
 * @param {string} customerProfileId - The ID of the customer profile
 * @returns {Promise<Object[]>} - The conversations returned from the Gladly API
 * @throws {Error} - If the customer profile conversations were not returned from the Gladly API
 */
export const getConversations = async (customerProfileId) => {
  const response = await authenticatedFetch(
    `${GLADLY_API_URL}/v1/customers/${customerProfileId}/conversations`,
    { method: "GET" }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to get customer profile conversations for customer profile ${customerProfileId} via Gladly API: HTTP ${response.status}: ${response.statusText}`
    );
  }

  // The Gladly-Limited-Data header flag in the response will indicate if the customer has more conversations than returned.
  // If set, the customer will need to be manually processed.
  if (response.headers.get(GLADLY_LIMITED_DATA_HEADER)) {
    throw new Error(
      "Customer has more conversations than returned. Manual processing required."
    );
  }

  return response.json();
};

/**
 * Closes a conversation by ID for a given customer profile
 * @param {string} conversationId - The ID of the conversation
 * @returns {Promise<Object>} - The response from the Gladly API
 * @throws {Error} - If the customer profile conversation was not closed
 */
export const closeConversation = async (conversationId) => {
  const response = await authenticatedFetch(
    `${GLADLY_API_URL}/v1/conversations/${conversationId}`,
    { method: "PATCH", body: JSON.stringify({ status: "CLOSED", force: true }) }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to close customer profile conversation via Gladly API: HTTP ${response.status}: ${response.statusText}`
    );
  }

  return {};
};

/**
 * Deletes a customer profile by ID
 * @param {string} customerProfileId - The ID of the customer profile
 * @returns {Promise<Object>} - The response from the Gladly API
 * @throws {Error} - If the customer profile was not deleted
 */
export const deleteCustomerProfile = async (customerProfileId) => {
  const response = await authenticatedFetch(
    `${GLADLY_API_URL}/v1/customer-profiles/${customerProfileId}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to delete customer profile via Gladly API: HTTP ${response.status}: ${response.statusText}`
    );
  }

  return {};
};
