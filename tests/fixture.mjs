import {readFileSync} from "node:fs";
import {DatabaseSync} from "node:sqlite";
import {makeWorker} from "../worker/index.mjs";

const migration = readFileSync(new URL("../drizzle/0000_demo_suggestions.sql", import.meta.url), "utf8");
const files = [
  ["/", "index.html", "text/html"],
  ["/style.css", "style.css", "text/css"],
  ["/app.js", "app.js", "text/javascript"],
];
const assets = Object.fromEntries(files.map(([path, file, type]) => [path, {
  content: readFileSync(new URL("../web/" + file, import.meta.url), "utf8"),
  type: type + "; charset=utf-8",
}]));

export const origin = "https://tech-playground.test";
export function fixture() {
  const db = new DatabaseSync(":memory:");
  db.exec(migration);
  const DB = {
    prepare(sql) {
      const statement = db.prepare(sql);
      return {bind: (...args) => ({run: () => statement.run(...args)})};
    },
  };
  const worker = makeWorker(assets);
  return {
    fetch: (path, options, binding = DB) => worker.fetch(new Request(origin + path, options), {DB: binding}),
    rows: () => db.prepare("SELECT * FROM demo_suggestions ORDER BY topic").all().map(row => ({...row})),
    close: () => db.close(),
  };
}
