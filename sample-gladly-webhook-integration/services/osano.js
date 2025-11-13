const OSANO_API_URL = "https://api.osano.com";

const headers = {
  "Content-Type": "application/json",
  "x-osano-api-key": process.env.OSANO_API_KEY,
};

/**
 * Attaches a summary to the action item using the Osano Action Items API
 * @param {number} actionItemId - The ID of the action item
 * @param {string} fileContent - The content of the file to attach to the action item
 * @returns {Promise<Object>} - The response string if the summary was attached to the action item
 * @throws {Error} - If the summary was not attached to the action item
 */
export const attachSummaryToActionItem = async (actionItemId, fileContent) => {
  const response = await fetch(
    `${OSANO_API_URL}/v1/subject-rights/action-items/${actionItemId}/summaries`,
    {
      method: "POST",
      body: fileContent,
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to attach summary to action item: HTTP ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};

/**
 * Marks the action item as completed using the Osano Action Items API
 * @param {number} actionItemId - The ID of the action item
 * @param {string} internalNotes - The internal notes to add to the action item
 * @returns {Promise<Object>} - The response string if the action item was marked as completed
 * @throws {Error} - If the action item was not marked as completed
 */
export const markActionItemCompleted = async (actionItemId, internalNotes) => {
  const response = await fetch(
    `${OSANO_API_URL}/v1/subject-rights/action-items/${actionItemId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status: "COMPLETED",
        ...(internalNotes && { internalNotes }),
      }),
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to mark action item as completed: HTTP ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};
