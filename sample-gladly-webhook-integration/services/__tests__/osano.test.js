import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { attachSummaryToActionItem, markActionItemCompleted } from "../osano.js";

describe("osano.js", () => {
  const responseBody = JSON.stringify({
    status: "error",
    message: "Action item 1 not found",
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

  describe("attachSummaryToActionItem", () => {
    it("should include the response body in the error when the request fails", async () => {
      await expect(attachSummaryToActionItem(1, "{}")).rejects.toThrow(
        `Failed to attach summary to action item 1: HTTP 404 - Not Found: ${responseBody}`
      );
    });
  });

  describe("markActionItemCompleted", () => {
    it("should include the response body in the error when the request fails", async () => {
      await expect(markActionItemCompleted(1, "notes")).rejects.toThrow(
        `Failed to mark action item 1 as completed: HTTP 404 - Not Found: ${responseBody}`
      );
    });
  });
});
