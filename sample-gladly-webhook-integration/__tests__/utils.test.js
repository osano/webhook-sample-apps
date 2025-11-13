import { describe, it, expect } from "@jest/globals";
import { parseRequestBody } from "../utils.js";

describe("utils.js", () => {
  describe("parseRequestBody", () => {
    it("should parse the request body", () => {
      const requestBody = {
        email: "test@test.com",
        actionItemId: 1,
        requestedAction: "SUMMARIZE",
      };

      const parsedRequestBody = parseRequestBody(JSON.stringify(requestBody));

      expect(parsedRequestBody).toEqual(requestBody);
    });

    it("should return an empty object if the request body is invalid", () => {
      const requestBody = "invalid";

      const parsedRequestBody = parseRequestBody(requestBody);

      expect(parsedRequestBody).toEqual({});
    });
  });
});
