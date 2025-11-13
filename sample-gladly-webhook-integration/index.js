import { summarizeData, deleteData } from "./services/integration.js";
import { parseRequestBody } from "./utils.js";

/**
 * Lambda handler for the sample app that handles the webhook payload and performs the requested action
 * @param {Object} event - The event object
 * @returns {Promise<{statusCode: number, body: string}>} - The response object
 */
export const handler = async (event) => {
  try {
    const parsedBody = parseRequestBody(event.body);
    const { email, actionItemId, requestedAction } = parsedBody;

    // Validate the request body to make sure it has the required fields
    if (!email || !actionItemId || !requestedAction) {
      console.warn("Missing required fields", parsedBody);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // Handle the requested action (SUMMARIZE, DELETE, etc.)
    switch (requestedAction) {
      case "SUMMARIZE":
        await summarizeData(actionItemId, email);
        break;
      case "DELETE":
        await deleteData(actionItemId, email);
        break;
      default:
        console.warn("Unsupported requested action", requestedAction);
    }

    return { statusCode: 200 };
  } catch (error) {
    console.error("Error in lambda handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
