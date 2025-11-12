import { attachSummaryToActionItem, markActionItemCompleted } from "./osano.js";
import { getUserByEmail, deleteUser } from "./repo.js";

export const summarizeData = async (actionItemId, email) => {
  // Search for the requester's data in your database by email
  const user = getUserByEmail(email);
  if (!user) {
    // If no user is found, mark the action item as completed and return
    console.info("No user found for requester");
    await markActionItemCompleted(actionItemId);
    return;
  }

  // Attach the summary file to the action item using the Osano Action Items API
  const fileContent = JSON.stringify(user);
  await attachSummaryToActionItem(actionItemId, fileContent);

  // Mark the action item as completed using the Osano Action Items API
  await markActionItemCompleted(actionItemId);
};

export const deleteData = async (actionItemId, email) => {
  // Search for the requester's data in your database by email
  const user = getUserByEmail(email);
  if (!user) {
    // If no user is found, mark the action item as completed and return
    console.info("No user found for requester");
    await markActionItemCompleted(actionItemId);
    return;
  }

  // Delete the user from your database
  deleteUser(user.id);

  // Attach the summary file to the action item using the Osano Action Items API
  const fileContent = JSON.stringify(user);
  await attachSummaryToActionItem(actionItemId, fileContent);

  // Mark the action item as completed using the Osano Action Items API
  await markActionItemCompleted(actionItemId);
};
