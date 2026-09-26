import assert from "node:assert/strict";
import { test } from "node:test";
import { libraryPath, parseTaskSpec, prepareRun, taskSlug, type TaskSpec } from "./tasks.ts";

const sample = {
  name: "Desk check",
  summary: "Looks up one page.",
  capability: "Reads a public page and says what changed.",
  supports: ["One https URL"],
  needs: ["A URL"],
  trigger: { kind: "input", detail: "Runs when the URL is filled." },
  inputs: [{ name: "page", type: "url", required: true, description: "Page to read." }],
  outputs: [{ name: "note", description: "What the page says." }],
  onError: "If the page cannot be read, say so.",
  script: "Read {{page}} and summarize it in three lines.",
  skills: ["research", "write", "specify"],
};

function specFrom(raw: unknown, id = "t1"): TaskSpec {
  const result = parseTaskSpec(typeof raw === "string" ? raw : JSON.stringify(raw), id);
  if ("error" in result) throw new Error(result.error);
  return result.spec;
}

test("task slugs stay inside the library folder", () => {
  assert.equal(libraryPath(taskSlug("Weekend in a city")), "library/weekend-in-a-city.json");
  assert.equal(libraryPath("../secret"), null);
  assert.equal(libraryPath("board-cost"), "library/board-cost.json");
});

test("parseTaskSpec reads a fenced spec and drops the specify skill", () => {
  const spec = specFrom("```json\n" + JSON.stringify(sample) + "\n```");
  assert.equal(spec.name, "Desk check");
  assert.deepEqual(spec.skills, ["research", "write"]);
  assert.equal(spec.origin, "draft");
  assert.equal(spec.inputs[0]?.type, "url");
});

test("parseTaskSpec rejects a script with no error step", () => {
  const result = parseTaskSpec(JSON.stringify({ ...sample, onError: "  " }));
  assert.deepEqual(result, { error: "The spec needs an error step." });
});

test("prepareRun blocks a missing required input and a bad number", () => {
  const lumber = specFrom({
    ...sample,
    trigger: { kind: "input", detail: "Filled inputs." },
    inputs: [{ name: "count", type: "number", required: true, description: "How many." }],
    script: "Count is {{count}}.",
  });
  assert.equal("error" in prepareRun(lumber, { count: "" }), true);
  const bad = prepareRun(lumber, { count: "many" });
  assert.equal("error" in bad && bad.error, "count has to be a number.");
});

test("prepareRun refuses an unarmed trigger and fills the script", () => {
  const manual = specFrom(sample);
  const clock = { ...manual, trigger: { kind: "schedule" as const, detail: "Every Monday." } };
  const blocked = prepareRun(clock, { page: "https://example.com" });
  assert.equal("error" in blocked, true);
  if ("error" in blocked) assert.match(blocked.error, /not armed/);
  const ready = prepareRun(manual, { page: "https://example.com/a" });
  assert.equal("job" in ready, true);
  if ("job" in ready) {
    assert.match(ready.job, /https:\/\/example\.com\/a/);
    assert.match(ready.job, /If a step fails/);
  }
});
