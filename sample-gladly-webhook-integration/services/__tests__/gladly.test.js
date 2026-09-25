import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import {
  getCustomerProfiles,
  getConversations,
  closeConversation,
  deleteCustomerProfile,
} from "../gladly.js";

describe("gladly.js", () => {
  const responseBody = JSON.stringify({
    errors: [{ code: "not_exist", detail: "does not exist" }],
  });

  beforeEach(() => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(
        new Response(responseBody, { status: 404, statusText: "Not Found" })
      );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getCustomerProfiles", () => {
    it("should include the response body in the error when the request fails", async () => {
      await expect(getCustomerProfiles("test@test.com")).rejects.toThrow(
        `Failed to get customer profiles via Gladly API: HTTP 404 - Not Found: ${responseBody}`
      );
    });
  });

  describe("getConversations", () => {
    it("should include the response body in the error when the request fails", async () => {
      await expect(getConversations("profile-1")).rejects.toThrow(
        `Failed to get customer profile conversations for customer profile profile-1 via Gladly API: HTTP 404 - Not Found: ${responseBody}`
      );
    });

    it("should return the conversations when the Gladly-Limited-Data header is false", async () => {
      const conversations = [{ id: "conv-1", status: "OPEN" }];
      global.fetch.mockResolvedValue(
        new Response(JSON.stringify(conversations), {
          status: 200,
          headers: { "Gladly-Limited-Data": false },
        })
      );

      await expect(getConversations("profile-1")).resolves.toEqual(
        conversations
      );
    });

    it("should throw when the Gladly-Limited-Data header is true", async () => {
      global.fetch.mockResolvedValue(
        new Response("[]", {
          status: 200,
          headers: { "Gladly-Limited-Data": true },
        })
      );

      await expect(getConversations("profile-1")).rejects.toThrow(
        "Customer profile-1 has more conversations than returned (Gladly-Limited-Data: true). Manual processing required."
      );
    });
  });

  describe("closeConversation", () => {
    it("should send a forced CLOSED status in the request body", async () => {
      global.fetch.mockResolvedValue(new Response(null, { status: 204 }));

      await closeConversation("conv-1");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/v1\/conversations\/conv-1$/),
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ status: { value: "CLOSED", force: true } }),
        })
      );
    });

    it("should include the response body in the error when the request fails", async () => {
      await expect(closeConversation("conv-1")).rejects.toThrow(
        `Failed to close customer profile conversation conv-1 via Gladly API: HTTP 404 - Not Found: ${responseBody}`
      );
    });
  });

  describe("deleteCustomerProfile", () => {
    it("should include the response body in the error when the request fails", async () => {
      await expect(deleteCustomerProfile("profile-1")).rejects.toThrow(
        `Failed to delete customer profile profile-1 via Gladly API: HTTP 404 - Not Found: ${responseBody}`
      );
    });
  });
});
