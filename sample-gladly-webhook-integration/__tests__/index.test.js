import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { handler } from "../index.js";
import * as integrationService from "../services/integration.js";

describe("index.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a 200 status code when the requested action is SUMMARIZE", async () => {
    const request = {
      body: JSON.stringify({
        email: "test@test.com",
        actionItemId: 1,
        requestedAction: "SUMMARIZE",
      }),
    };

    const summarizeDataSpy = jest
      .spyOn(integrationService, "summarizeData")
      .mockResolvedValue(undefined);

    const result = await handler(request);

    expect(result.statusCode).toBe(200);
    expect(summarizeDataSpy).toHaveBeenCalledWith(1, "test@test.com");
  });

  it("should return a 200 status code when the requested action is DELETE", async () => {
    const request = {
      body: JSON.stringify({
        email: "test@test.com",
        actionItemId: 1,
        requestedAction: "DELETE",
      }),
    };

    const deleteDataSpy = jest
      .spyOn(integrationService, "deleteData")
      .mockResolvedValue(undefined);

    const result = await handler(request);

    expect(result.statusCode).toBe(200);
    expect(deleteDataSpy).toHaveBeenCalledWith(1, "test@test.com");
  });

  it("should return a 200 status code when the requested action is unknown", async () => {
    const request = {
      body: JSON.stringify({
        email: "test@test.com",
        actionItemId: 1,
        requestedAction: "UNKNOWN",
      }),
    };

    const result = await handler(request);

    expect(result.statusCode).toBe(200);
  });

  it.each([
    ["email", { actionItemId: 1, requestedAction: "SUMMARIZE" }],
    ["actionItemId", { email: "test@test.com", requestedAction: "SUMMARIZE" }],
    ["requestedAction", { email: "test@test.com", actionItemId: 1 }],
  ])(
    "should return a 400 status code if the request is missing the %s in the request body",
    async (missingField, requestBody) => {
      const request = {
        body: JSON.stringify(requestBody),
      };

      const result = await handler(request);

      expect(result.statusCode).toBe(400);
      expect(result.body).toBe(
        JSON.stringify({
          error: "Missing required fields",
        })
      );
    }
  );

  it("should return a 500 status code when the integration service throws an error", async () => {
    const request = {
      body: JSON.stringify({
        email: "test@test.com",
        actionItemId: 1,
        requestedAction: "SUMMARIZE",
      }),
    };

    const summarizeDataSpy = jest
      .spyOn(integrationService, "summarizeData")
      .mockRejectedValue(new Error("API error"));

    const result = await handler(request);

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(
      JSON.stringify({ error: "Internal server error" })
    );
    expect(summarizeDataSpy).toHaveBeenCalledWith(1, "test@test.com");
  });
});
