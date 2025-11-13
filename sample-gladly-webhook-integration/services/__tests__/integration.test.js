import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { summarizeData, deleteData } from "../integration.js";
import * as gladlyApiClient from "../gladly.js";
import * as osanoApiClient from "../osano.js";

describe("integration.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("summarizeData", () => {
    it("should attach summary file and mark action item as completed when customer profiles are found", async () => {
      const email = "test@example.com";
      const actionItemId = 1;
      const mockCustomerProfiles = [
        { id: "profile-1", email: "test@example.com" },
        { id: "profile-2", email: "test@example.com" },
      ];

      const getCustomerProfilesSpy = jest
        .spyOn(gladlyApiClient, "getCustomerProfiles")
        .mockResolvedValue(mockCustomerProfiles);

      const attachSummaryToActionItemSpy = jest
        .spyOn(osanoApiClient, "attachSummaryToActionItem")
        .mockResolvedValue(undefined);

      const markActionItemCompletedSpy = jest
        .spyOn(osanoApiClient, "markActionItemCompleted")
        .mockResolvedValue(undefined);

      await summarizeData(actionItemId, email);

      expect(getCustomerProfilesSpy).toHaveBeenCalledWith(email);
      expect(attachSummaryToActionItemSpy).toHaveBeenCalledWith(
        actionItemId,
        JSON.stringify(mockCustomerProfiles)
      );
      expect(markActionItemCompletedSpy).toHaveBeenCalledWith(
        actionItemId,
        "Customer profiles found for requester and summarized successfully"
      );
    });

    it("should mark action item as completed when no customer profiles are found", async () => {
      const email = "test@example.com";
      const actionItemId = 1;

      const getCustomerProfilesSpy = jest
        .spyOn(gladlyApiClient, "getCustomerProfiles")
        .mockResolvedValue([]);

      const attachSummaryToActionItemSpy = jest
        .spyOn(osanoApiClient, "attachSummaryToActionItem")
        .mockResolvedValue(undefined);

      const markActionItemCompletedSpy = jest
        .spyOn(osanoApiClient, "markActionItemCompleted")
        .mockResolvedValue(undefined);

      await summarizeData(actionItemId, email);

      expect(getCustomerProfilesSpy).toHaveBeenCalledWith(email);
      expect(markActionItemCompletedSpy).toHaveBeenCalledWith(
        actionItemId,
        "No customer profiles found for requester"
      );
      expect(attachSummaryToActionItemSpy).not.toHaveBeenCalled();
      expect(markActionItemCompletedSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteData", () => {
    it("should handle when customer profiles are found", async () => {
      const email = "test@example.com";
      const actionItemId = 1;
      const customerProfiles = [{ id: "profile-1" }];

      const getCustomerProfilesSpy = jest
        .spyOn(gladlyApiClient, "getCustomerProfiles")
        .mockResolvedValue(customerProfiles);

      const getConversationsSpy = jest
        .spyOn(gladlyApiClient, "getConversations")
        .mockResolvedValue([{ id: "conv-1", status: "OPEN" }]);

      const closeConversationSpy = jest
        .spyOn(gladlyApiClient, "closeConversation")
        .mockResolvedValue(undefined);

      const deleteCustomerProfileSpy = jest
        .spyOn(gladlyApiClient, "deleteCustomerProfile")
        .mockResolvedValue(undefined);

      const attachSummaryToActionItemSpy = jest
        .spyOn(osanoApiClient, "attachSummaryToActionItem")
        .mockResolvedValue(undefined);

      const markActionItemCompletedSpy = jest
        .spyOn(osanoApiClient, "markActionItemCompleted")
        .mockResolvedValue(undefined);

      await deleteData(actionItemId, email);

      expect(getCustomerProfilesSpy).toHaveBeenCalledWith(email);
      expect(getConversationsSpy).toHaveBeenCalledWith("profile-1");
      expect(closeConversationSpy).toHaveBeenCalledWith("profile-1", "conv-1");
      expect(deleteCustomerProfileSpy).toHaveBeenCalledWith("profile-1");
      expect(attachSummaryToActionItemSpy).toHaveBeenCalledWith(
        actionItemId,
        JSON.stringify(["profile-1"])
      );
      expect(markActionItemCompletedSpy).toHaveBeenCalledWith(
        actionItemId,
        "Requester was found and deleted successfully"
      );
    });

    it("should handle when no customer profiles are found", async () => {
      const email = "test@example.com";
      const actionItemId = 1;

      const getCustomerProfilesSpy = jest
        .spyOn(gladlyApiClient, "getCustomerProfiles")
        .mockResolvedValue([]);

      const attachSummaryToActionItemSpy = jest
        .spyOn(osanoApiClient, "attachSummaryToActionItem")
        .mockResolvedValue(undefined);

      const markActionItemCompletedSpy = jest
        .spyOn(osanoApiClient, "markActionItemCompleted")
        .mockResolvedValue(undefined);

      await deleteData(actionItemId, email);

      expect(getCustomerProfilesSpy).toHaveBeenCalledWith(email);
      expect(markActionItemCompletedSpy).toHaveBeenCalledWith(
        actionItemId,
        "No customer profiles found for requester"
      );
      expect(attachSummaryToActionItemSpy).not.toHaveBeenCalled();
      expect(markActionItemCompletedSpy).toHaveBeenCalledTimes(1);
    });

    it("should delete customer profile with no conversations", async () => {
      const email = "test@example.com";
      const actionItemId = 1;

      const getCustomerProfilesSpy = jest
        .spyOn(gladlyApiClient, "getCustomerProfiles")
        .mockResolvedValue([{ id: "profile-1" }]);

      const getConversationsSpy = jest
        .spyOn(gladlyApiClient, "getConversations")
        .mockResolvedValue([]);

      const closeConversationSpy = jest.spyOn(
        gladlyApiClient,
        "closeConversation"
      );

      const deleteCustomerProfileSpy = jest
        .spyOn(gladlyApiClient, "deleteCustomerProfile")
        .mockResolvedValue(undefined);

      const attachSummaryToActionItemSpy = jest
        .spyOn(osanoApiClient, "attachSummaryToActionItem")
        .mockResolvedValue(undefined);

      const markActionItemCompletedSpy = jest
        .spyOn(osanoApiClient, "markActionItemCompleted")
        .mockResolvedValue(undefined);

      await deleteData(actionItemId, email);

      expect(getCustomerProfilesSpy).toHaveBeenCalledWith(email);
      expect(getConversationsSpy).toHaveBeenCalledWith("profile-1");
      expect(closeConversationSpy).not.toHaveBeenCalled();
      expect(deleteCustomerProfileSpy).toHaveBeenCalledWith("profile-1");
      expect(attachSummaryToActionItemSpy).toHaveBeenCalledWith(
        actionItemId,
        JSON.stringify(["profile-1"])
      );
      expect(markActionItemCompletedSpy).toHaveBeenCalledWith(
        actionItemId,
        "Requester was found and deleted successfully"
      );
    });

    it("should close open conversations before deleting profile", async () => {
      const email = "test@example.com";
      const actionItemId = 1;
      const conversations = [{ id: "conv-1", status: "OPEN" }];

      jest
        .spyOn(gladlyApiClient, "getCustomerProfiles")
        .mockResolvedValue([{ id: "profile-1" }]);

      const getConversationsSpy = jest
        .spyOn(gladlyApiClient, "getConversations")
        .mockResolvedValue(conversations);

      const closeConversationSpy = jest
        .spyOn(gladlyApiClient, "closeConversation")
        .mockResolvedValue(undefined);

      const deleteProfileSpy = jest
        .spyOn(gladlyApiClient, "deleteCustomerProfile")
        .mockResolvedValue(undefined);

      await deleteData(actionItemId, email);

      expect(getConversationsSpy).toHaveBeenCalledWith("profile-1");
      expect(closeConversationSpy).toHaveBeenCalledWith("profile-1", "conv-1");
      expect(deleteProfileSpy).toHaveBeenCalledWith("profile-1");
    });

    it("should skip closed conversations", async () => {
      const email = "test@example.com";
      const actionItemId = 1;
      const conversations = [
        { id: "conv-1", status: "CLOSED" },
        { id: "conv-2", status: "OPEN" },
        { id: "conv-3", status: "CLOSED" },
      ];

      jest
        .spyOn(gladlyApiClient, "getCustomerProfiles")
        .mockResolvedValue([{ id: "profile-1" }]);

      const getConversationsSpy = jest
        .spyOn(gladlyApiClient, "getConversations")
        .mockResolvedValue(conversations);

      const closeConversationSpy = jest
        .spyOn(gladlyApiClient, "closeConversation")
        .mockResolvedValue(undefined);

      const deleteProfileSpy = jest
        .spyOn(gladlyApiClient, "deleteCustomerProfile")
        .mockResolvedValue(undefined);

      await deleteData(actionItemId, email);

      expect(getConversationsSpy).toHaveBeenCalledWith("profile-1");
      expect(closeConversationSpy).toHaveBeenCalledTimes(1);
      expect(closeConversationSpy).toHaveBeenCalledWith("profile-1", "conv-2");
      expect(deleteProfileSpy).toHaveBeenCalledWith("profile-1");
    });
  });
});
