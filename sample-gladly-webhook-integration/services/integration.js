import {
  getCustomerProfiles,
  getConversations,
  closeConversation,
  deleteCustomerProfile,
} from "./gladly.js";
import { attachSummaryToActionItem, markActionItemCompleted } from "./osano.js";

const CLOSED_CONVERSATION_STATUS = "CLOSED";

export const summarizeData = async (actionItemId, email) => {
  // Search for the requester's data in Gladly by email
  const customerProfiles = await getCustomerProfiles(email);
  if (!customerProfiles.length) {
    // If no customer profiles are found, mark the action item as completed and return
    console.info("No customer profiles found for requester");
    await markActionItemCompleted(
      actionItemId,
      "No customer profiles found for requester"
    );
    return;
  }

  // Attach the summary file to the action item using the Osano Action Items API
  const fileContent = JSON.stringify(customerProfiles);
  await attachSummaryToActionItem(actionItemId, fileContent);

  // Mark the action item as completed using the Osano Action Items API
  await markActionItemCompleted(
    actionItemId,
    "Customer profiles found for requester and summarized successfully"
  );
};

export const deleteData = async (actionItemId, email) => {
  // Search for the requester's data in Gladly by email
  const customerProfiles = await getCustomerProfiles(email);
  if (!customerProfiles.length) {
    // If no customer profiles are found, mark the action item as completed and return
    console.info("No customer profiles found for requester");
    await markActionItemCompleted(
      actionItemId,
      "No customer profiles found for requester"
    );
    return;
  }

  // Delete the customer profiles one by one
  const deletedCustomerProfiles = [];
  for (const customerProfile of customerProfiles) {
    const conversations = await getConversations(customerProfile.id);
    // All open conversations MUST be closed before deleting the customer profile
    for (const conversation of conversations) {
      if (conversation.status === CLOSED_CONVERSATION_STATUS) {
        continue;
      }
      await closeConversation(conversation.id);
    }

    // Delete the customer profile using the Gladly API
    await deleteCustomerProfile(customerProfile.id);
    deletedCustomerProfiles.push(customerProfile.id);
  }

  // Attach the summary file to the action item using the Osano Action Items API
  const fileContent = JSON.stringify(deletedCustomerProfiles);
  await attachSummaryToActionItem(actionItemId, fileContent);

  // Mark the action item as completed using the Osano Action Items API
  await markActionItemCompleted(
    actionItemId,
    "Requester was found and deleted successfully"
  );
};
