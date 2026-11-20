import assert from "node:assert/strict";
import test from "node:test";
import {fixture, origin} from "./fixture.mjs";

function post(body, headers = {}) {
  return {method: "POST", headers: {"Content-Type": "application/json", Origin: origin, ...headers}, body};
}

test("serves the real page, script and styles and supports HEAD", async t => {
  const app = fixture();
  t.after(app.close);
  for (const [path, type] of [["/", "text/html"], ["/app.js", "text/javascript"], ["/style.css", "text/css"]]) {
    const response = await app.fetch(path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), new RegExp(type));
    assert.ok((await response.text()).length > 0);
  }
  const page = await app.fetch("/index.html");
  assert.match(await page.text(), /<title>Tech Playground/);
  const head = await app.fetch("/", {method: "HEAD"});
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
  assert.equal((await app.fetch("/missing")).status, 404);
});

test("normalizes and aggregates explicit suggestions in SQLite; has no public read endpoint", async t => {
  const app = fixture();
  t.after(app.close);
  for (const topic of ["  Ｓolar   Panels ", "solar panels", "heat pumps"]) {
    const response = await app.fetch("/api/suggestions", post(JSON.stringify({topic})));
    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), {ok: true});
  }
  const rows = app.rows();
  assert.deepEqual(rows.map(({topic, request_count}) => [topic, request_count]), [["heat pumps", 1], ["solar panels", 2]]);
  assert.ok(rows.every(row => Number.isFinite(Date.parse(row.last_requested_at))));
  const read = await app.fetch("/api/suggestions");
  assert.equal(read.status, 405);
  assert.deepEqual(await read.json(), {ok: false});
});

test("rejects invalid suggestions without recording anything", async t => {
  const app = fixture();
  t.after(app.close);
  for (const body of ["{", JSON.stringify({topic: 17}), JSON.stringify({topic: "a"}), JSON.stringify({topic: "a".repeat(81)}), JSON.stringify({topic: "a".repeat(769)}), JSON.stringify({topic: "https://example.test"}), JSON.stringify({topic: "me@example.test"}), JSON.stringify({topic: "call 12345678"})]) {
    assert.equal((await app.fetch("/api/suggestions", post(body))).status, 400);
  }
  const valid = JSON.stringify({topic: "solar panels"});
  assert.equal((await app.fetch("/api/suggestions", post(valid, {Origin: "https://other.test"}))).status, 403);
  assert.equal((await app.fetch("/api/suggestions", post(valid, {"Content-Type": "text/plain"}))).status, 415);
  assert.deepEqual(app.rows(), []);
});

test("returns a retryable failure rather than success when storage fails", async t => {
  const app = fixture();
  t.after(app.close);
  const response = await app.fetch("/api/suggestions", post(JSON.stringify({topic: "solar panels"})), {
    prepare: () => ({bind: () => ({run() { throw new Error("Storage unavailable"); }})}),
  });
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {ok: false});
  assert.deepEqual(app.rows(), []);
});
