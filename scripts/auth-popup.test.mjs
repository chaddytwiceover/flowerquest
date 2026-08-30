import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const popupServerPath = path.resolve("src/lib/auth/popup.server.ts");
const popupServerContent = fs.readFileSync(popupServerPath, "utf-8");

// Extract the inline script content inside <script>...</script> (excluding the application/json script)
const scriptMatch = popupServerContent.match(/<script>\s*([\s\S]*?)\s*<\/script>/);
assert.ok(scriptMatch, "Should find completionHtml inline script");
const inlineScript = scriptMatch[1];

function runPopupScript(textContentContent) {
  let postedMessage = null;
  let postedOrigin = null;
  let closed = false;

  const mockDocument = {
    getElementById(id) {
      if (id === "grok-auth-popup-msg") {
        return { textContent: textContentContent };
      }
      return null;
    },
  };

  const mockWindow = {
    location: { origin: "https://example.grok-sandbox.com" },
    opener: {
      postMessage(msg, origin) {
        postedMessage = msg;
        postedOrigin = origin;
      },
    },
    close() {
      closed = true;
    },
  };

  const context = vm.createContext({
    document: mockDocument,
    window: mockWindow,
    JSON,
    Array,
    Object,
  });

  vm.runInContext(inlineScript, context);

  // Convert vm context object to host context object for clean assertion matching
  const hostPostedMessage = postedMessage ? JSON.parse(JSON.stringify(postedMessage)) : null;

  return { postedMessage: hostPostedMessage, postedOrigin, closed };
}

test("auth popup script - valid token payload", () => {
  const result = runPopupScript(
    JSON.stringify({ source: "grok-auth-popup", token: "secret_session_token" }),
  );
  assert.deepEqual(result.postedMessage, {
    source: "grok-auth-popup",
    token: "secret_session_token",
  });
  assert.equal(result.postedOrigin, "https://example.grok-sandbox.com");
  assert.equal(result.closed, true);
});

test("auth popup script - valid error payload", () => {
  const result = runPopupScript(
    JSON.stringify({
      source: "grok-auth-popup",
      token: null,
      error: "oauth_init_failed",
    }),
  );
  assert.deepEqual(result.postedMessage, {
    source: "grok-auth-popup",
    token: null,
    error: "oauth_init_failed",
  });
  assert.equal(result.closed, true);
});

test("auth popup script - rejects wrong source", () => {
  const result = runPopupScript(
    JSON.stringify({ source: "malicious-source", token: "stolen_token" }),
  );
  assert.deepEqual(result.postedMessage, {
    source: "grok-auth-popup",
    token: null,
  });
});

test("auth popup script - rejects invalid token type", () => {
  const result = runPopupScript(JSON.stringify({ source: "grok-auth-popup", token: 12345 }));
  assert.deepEqual(result.postedMessage, {
    source: "grok-auth-popup",
    token: null,
  });
});

test("auth popup script - rejects array JSON", () => {
  const result = runPopupScript(JSON.stringify(["grok-auth-popup", "token"]));
  assert.deepEqual(result.postedMessage, {
    source: "grok-auth-popup",
    token: null,
  });
});

test("auth popup script - rejects primitive JSON", () => {
  const result = runPopupScript(JSON.stringify("some random string"));
  assert.deepEqual(result.postedMessage, {
    source: "grok-auth-popup",
    token: null,
  });
});

test("auth popup script - strips unexpected extra properties", () => {
  const result = runPopupScript(
    JSON.stringify({
      source: "grok-auth-popup",
      token: "valid_token",
      extraProp: "should_be_removed",
    }),
  );
  assert.deepEqual(result.postedMessage, {
    source: "grok-auth-popup",
    token: "valid_token",
  });
  assert.equal(result.postedMessage.extraProp, undefined);
});

test("auth popup script - handles malformed JSON gracefully", () => {
  const result = runPopupScript("{ invalid json ...}");
  assert.deepEqual(result.postedMessage, {
    source: "grok-auth-popup",
    token: null,
  });
});
