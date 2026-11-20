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
    focus() { this.focused=true; },
    scrollIntoView() {},
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
let reducedMotion = false;
let pendingFrame = null;
const context = vm.createContext({
  document: {getElementById:get, createElement:el, createTextNode:text=>({text}), body},
  window: {addEventListener(name,fn) {navigation[name]=fn;}},
  matchMedia: query => ({get matches(){return query.includes("max-width") || (query.includes("reduced-motion") && reducedMotion);},addEventListener() {}}),
  history: {pushState(_a,_b,hash) { context.location.hash = hash; }},
  location: {hash:"#memory"},
  performance: {now:()=>0},
  devicePixelRatio: 1,
  requestAnimationFrame: fn => {pendingFrame = fn; return 1;},
  setTimeout: fn => {timers.set(++nextTimer,fn); return nextTimer;},
  clearTimeout: id => timers.delete(id),
  cancelAnimationFrame: () => {pendingFrame = null;}
});
get("demo-search").value = "";
vm.runInContext(source,context);
const click = id => get("memory-"+id).listeners.click();
const state = () => JSON.parse(vm.runInContext("JSON.stringify(memoryLab)",context));
const text = id => get("memory-"+id).textContent;
function select(id,value) {
  const node = get("memory-"+id);
  node.value = String(value);
  node.listeners.change();
}
assert.equal(body.dataset.lesson,"memory");
assert.equal(get("demo-count").textContent,"11 demos");
assert.equal(get("standard-workbench").hidden,true);
assert.equal(get("memory-workbench").hidden,false);
assert.equal(get("cpu-workbench").hidden,true);
assert.equal(get("alu-workbench").hidden,true);
assert.deepEqual(state().ram,[3,5,0]);
assert.deepEqual(state().regs,[0,0]);

click("load");
assert.match(text("status-title"),/LOAD.*\[A\].*R0/);
assert.deepEqual(state().regs,[3,0]);
assert.deepEqual(state().ram,[3,5,0]);
assert.equal(get("memory-workbench").dataset.path,"in");
assert.equal(get("memory-ram-values").children[0].dataset.from,"true");
assert.equal(get("memory-reg-values").children[0].dataset.to,"true");
assert.equal(get("memory-bridge").children.length,1);

click("add");
assert.deepEqual(state().regs,[8,0]);
assert.deepEqual(state().ram,[3,5,0]);
assert.equal(get("memory-workbench").dataset.path,"");
assert.equal(get("memory-alu-block").dataset.active,"true");
assert.equal(text("alu-result"),"3 + 5 = 8");

click("store");
assert.deepEqual(state().ram,[3,5,8]);
assert.deepEqual(state().regs,[8,0]);
assert.equal(get("memory-workbench").dataset.path,"out");
assert.equal(get("memory-ram-values").children[2].dataset.to,"true");
get("advanced-toggle").listeners.click();
assert.match(get("advanced-live").textContent,/R0 = 8 \(00001000\).*RAM\[2\] = 8/);

click("reset");
assert.deepEqual(state().ram,[3,5,0]);
assert.deepEqual(state().regs,[0,0]);
assert.equal(get("memory-workbench").dataset.path,"");
assert.equal(get("memory-bridge").children.length,0);
select("source",1); select("destination",0); select("register",1);
assert.deepEqual(state().ram,[3,5,0]);
assert.deepEqual(state().regs,[0,0]);
click("load");
assert.deepEqual(state().regs,[0,5]);
click("add");
assert.deepEqual(state().regs,[0,10]);
assert.deepEqual(state().ram,[3,5,0]);
click("store");
assert.deepEqual(state().ram,[10,5,0]);
assert.equal(get("memory-ram-values").children[0].dataset.to,"true");

click("reset");
reducedMotion = true;
click("load");
assert.equal(get("memory-workbench").dataset.path,"in");
assert.equal(get("memory-bridge").children.length,0);
assert.equal(vm.runInContext("memoryOperation({...initialMemory(),regs:[253,0]},'add').regs[0]",context),2);
get("memory-go-alu").listeners.click({button:0,preventDefault(){}});
assert.equal(body.dataset.lesson,"alu");
assert.equal(get("lesson-title").focused,true);
get("alu-go-memory").listeners.click({button:0,preventDefault(){}});
assert.equal(body.dataset.lesson,"memory");
get("demo-search").value="register file";
get("demo-search").listeners.input();
assert.equal(get("demo-count").textContent,"1 demo");
assert.equal(get("demo-list").children[0].dataset.lesson,"memory");
console.log("Memory lab smoke: LOAD, register-only ADD, explicit STORE, direction, reduced motion, address/register selection, reset, wrap, Advanced, navigation, and search.");
