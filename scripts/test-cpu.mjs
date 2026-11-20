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
const navigation = {};
const timers = new Map();
let nextTimer = 0;
let pendingFrame = null;
const context = vm.createContext({
  document: {getElementById:get, createElement:el, createTextNode:text=>({text}), body},
  window: {addEventListener(name,fn) {navigation[name]=fn;}},
  matchMedia: query => ({matches:query.includes("max-width"),addEventListener() {}}),
  history: {},
  location: {hash:"#cpu"},
  performance: {now:()=>0},
  devicePixelRatio: 1,
  requestAnimationFrame: fn => {pendingFrame = fn; return 1;},
  setTimeout: fn => {timers.set(++nextTimer,fn); return nextTimer;},
  clearTimeout: id => timers.delete(id),
  cancelAnimationFrame: () => {pendingFrame = null;}
});
get("demo-search").value = "";
vm.runInContext(source,context);
const click = id => get(id).listeners.click();
const model = () => JSON.parse(vm.runInContext("JSON.stringify(cpuMachine)",context));
const pump = () => {
  const [id,fn] = [...timers.entries()][0];
  timers.delete(id);
  fn();
};
assert.equal(body.dataset.lesson,"cpu");
assert.equal(get("demo-count").textContent,"11 demos");
assert.equal(get("standard-workbench").hidden,true);
assert.equal(get("cpu-workbench").hidden,false);
assert.equal(pendingFrame,null);
assert.equal(model().ir,null);
assert.equal(model().pc,0);
assert.deepEqual(model().memory,[3,5,null]);
assert.equal(model().alu,"Waiting for ADD");
click("cpu-step");
assert.equal(model().pc,1);
assert.equal(model().ir,0);
assert.equal(get("cpu-stage-fetch").attributes["aria-current"],"step");
assert.equal(get("cpu-control-block").dataset.active,"true");
assert.equal(get("cpu-workbench").dataset.path,"in");
assert.deepEqual(model().regs,[0,0,0]);
click("cpu-step");
assert.equal(model().stage,"decode");
assert.deepEqual(model().regs,[0,0,0]);
click("cpu-step");
assert.deepEqual(model().regs,[3,0,0]);
assert.equal(get("cpu-register-block").dataset.active,"true");
for (let i=0;i<6;i++) click("cpu-step");
assert.deepEqual(model().regs,[3,5,8]);
assert.equal(model().memory[2],null);
assert.equal(model().alu,"3 + 5 = 8");
assert.equal(get("cpu-alu-block").dataset.active,"true");
click("advanced-toggle");
assert.match(get("advanced-live").textContent,/Model ticks: 9.*IR: 01 100001.*R2: 00001000/);
for (let i=0;i<3;i++) click("cpu-step");
assert.equal(model().memory[2],8);
assert.equal(get("cpu-workbench").dataset.path,"out");
for (let i=0;i<3;i++) click("cpu-step");
assert.equal(model().halted,true);
assert.equal(model().ticks,15);
assert.equal(get("cpu-step").disabled,true);
click("cpu-step");
assert.equal(model().ticks,15);
click("cpu-reset");
assert.equal(model().ticks,0);
assert.deepEqual(model().memory,[3,5,null]);
click("cpu-run");
assert.equal(get("cpu-run").textContent,"Pause");
assert.equal(model().ticks,1);
pump();
assert.equal(model().ticks,2);
click("cpu-run");
assert.equal(timers.size,0);
assert.equal(get("cpu-run").textContent,"Run");
click("cpu-run");
while (timers.size) pump();
assert.equal(model().halted,true);
assert.equal(model().ticks,15);
assert.equal(model().memory[2],8);
click("cpu-reset");
click("cpu-run");
context.location.hash="#transistors";
navigation.hashchange();
assert.equal(timers.size,0);
assert.equal(get("cpu-workbench").hidden,true);
assert.equal(get("standard-workbench").hidden,false);
assert.ok(pendingFrame);
get("demo-search").value="processor";
get("demo-search").listeners.input();
assert.equal(get("demo-count").textContent,"1 demo");
assert.equal(get("demo-list").children[0].dataset.lesson,"cpu");
console.log("CPU Lab smoke: catalog, direct link, fetch/decode/execute, 8-bit encoding, ADD and STORE, HALT, run/pause/reset and navigation.");
