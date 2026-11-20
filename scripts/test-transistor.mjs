import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../web/app.js", import.meta.url),"utf8");
const elements = new Map();
const paint = [];
const paintContext = new Proxy(
  {fillText(text,x,y) { paint.push([text,x,y]); }},
  {get(target,key) { return target[key] ?? (() => {}); }}
);
function el() {
  return {
    children: [], dataset: {}, attributes: {}, style: {setProperty() {}}, listeners: {},
    getContext() { return paintContext; },
    setAttribute(name,value) { this.attributes[name] = String(value); },
    replaceChildren(...nodes) { this.children = nodes; },
    append(...nodes) { this.children.push(...nodes); },
    prepend(node) { this.children.unshift(node); },
    addEventListener(type,fn) { this.listeners[type] = fn; },
    get firstElementChild() { return this.children[0] ?? (this.children[0] = el()); }
  };
}
const get = id => {
  if (!elements.has(id)) elements.set(id,el());
  return elements.get(id);
};
const body = {dataset:{}};
let pendingFrame = null;
const context = vm.createContext({
  document: {getElementById:get, createElement:el, createTextNode:text=>({text}), body},
  window: {addEventListener() {}},
  matchMedia: query => ({matches:query.includes("max-width"),addEventListener() {}}),
  history: {},
  location: {hash:"#transistors"},
  performance: {now:()=>0},
  devicePixelRatio: 1,
  requestAnimationFrame: fn => {pendingFrame = fn; return 1;},
  cancelAnimationFrame: () => {pendingFrame = null;}
});
get("demo-search").value = "";
vm.runInContext(source,context);
assert.equal(body.dataset.lesson,"transistor");
assert.equal(get("demo-count").textContent,"11 demos");
assert.equal(get("simulation").width,440);
assert.equal(get("result-value").textContent,"0.00 mA");
assert.match(get("result-note").textContent,/below the 1\.2 V threshold/);
assert.ok(paint.some(([text])=>text==="Oxide insulator"));
assert.ok(pendingFrame);
get("flight-motion").listeners.click();
assert.equal(pendingFrame,null);
assert.equal(get("flight-motion").textContent,"Play motion");

const slider = key => get("settings").children
  .flatMap(field=>field.children).find(node=>node.name === key);
function change(key,value) {
  const input = slider(key);
  input.value = String(value);
  input.listeners.input();
}
change("gate",1.2);
assert.match(get("result-note").textContent,/At the 1\.2 V threshold/);
assert.equal(vm.runInContext('transistorModel({gate:1.3,drain:0.1}).region',context),"saturation");
assert.equal(vm.runInContext('transistorModel({gate:1.3,drain:0}).region',context),"linear");
change("gate",2.5);
assert.equal(get("result-value").textContent,"1.44 mA");
assert.ok(paint.some(([text])=>text==="←  Conventional current"));
get("advanced-toggle").listeners.click();
assert.match(get("advanced-live").textContent,/1\.44 mA \(linear\)/);
change("drain",2);
assert.equal(get("result-value").textContent,"1.69 mA");
assert.match(get("advanced-live").textContent,/saturation/);
change("drain",0);
assert.equal(get("result-value").textContent,"0.00 mA");
assert.match(get("result-note").textContent,/Channel formed, but no net flow/);
get("reset").listeners.click();
assert.equal(Number(slider("gate").value),0.8);
assert.equal(Number(slider("drain").value),0.8);
get("demo-search").value = "MOSFET";
get("demo-search").listeners.input();
assert.equal(get("demo-count").textContent,"1 demo");
assert.equal(get("demo-list").children[0].dataset.lesson,"transistor");
console.log("Transistor smoke test: catalog, narrow canvas, cutoff, threshold, both on regions, zero bias, pause, reset, Advanced mode, search.");
