import test from "node:test";
import assert from "node:assert/strict";
import { normalizeAssessment } from "../services/synthesizeTrustVerdict.js";

const assessment = (overrides = {}) => ({
  verdict: "Verified",
  confidence: "high",
  summary: "Several substantive reviews support the listing.",
  reasoning: "Positive review evidence was supplied and no credible warnings appeared.",
  evidence: ["Several reviews include positive, specific experiences."],
  warnings: [],
  reportedDetails: {},
  ...overrides,
});

test("keeps a positive verdict when optional sources failed, lowering confidence instead", () => {
  const result = normalizeAssessment(assessment(), {
    sourceErrors: ["Google reviews"],
    searchResults: [],
  });

  assert.equal(result.verdict, "Verified");
  assert.equal(result.confidence, "medium");
});

test("requires a visible warning for Red Flag and does not treat missing data as a warning", () => {
  const result = normalizeAssessment(
    assessment({ verdict: "Red Flag", evidence: [], warnings: [] }),
    { sourceErrors: ["Google reviews"], searchResults: [] }
  );

  assert.equal(result.verdict, "Caution");
  assert.deepEqual(result.warnings, []);
});

test("does not keep Verified when the model reports a warning", () => {
  const result = normalizeAssessment(
    assessment({ warnings: ["A review reports a billing dispute."] }),
    { sourceErrors: [], searchResults: [] }
  );

  assert.equal(result.verdict, "Caution");
});

test("does not allow Verified without positive evidence", () => {
  const result = normalizeAssessment(
    assessment({ evidence: [] }),
    { sourceErrors: [], searchResults: [] }
  );

  assert.equal(result.verdict, "Not enough data");
  assert.equal(result.confidence, "low");
});

test("limits confidence to low when there is not enough listing-specific evidence", () => {
  const result = normalizeAssessment(
    assessment({ verdict: "Not enough data", confidence: "high" }),
    { sourceErrors: [], searchResults: [] }
  );

  assert.equal(result.verdict, "Not enough data");
  assert.equal(result.confidence, "low");
});
