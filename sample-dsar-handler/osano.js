/**
 * Attaches a summary to the action item using the Osano Action Items API
 * @param {number} actionItemId - The ID of the action item
 * @param {string} fileContent - The content of the file to attach to the action item
 * @returns {Promise<Object[]>} - The response object if the summary was attached to the action item
 * @throws {Error} - If the summary was not attached to the action item
 */
export const attachSummaryToActionItem = async (actionItemId, fileContent) => {
  const response = await fetch(
    `https://api.osano.com/v1/subject-rights/action-items/${actionItemId}/summaries`,
    {
      method: "POST",
      body: fileContent,
      headers: {
        "Content-Type": "application/json",
        "x-osano-api-key": `${process.env.OSANO_API_KEY}`,
      },
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
 * @returns {Promise<Object>} - The response object if the action item was marked as completed
 * @throws {Error} - If the action item was not marked as completed
 */
export const markActionItemCompleted = async (actionItemId) => {
  const response = await fetch(
    `https://api.osano.com/v1/subject-rights/action-items/${actionItemId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status: "COMPLETED",
      }),
      headers: {
        "Content-Type": "application/json",
        "x-osano-api-key": `${process.env.OSANO_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to mark action item as completed: HTTP ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};
