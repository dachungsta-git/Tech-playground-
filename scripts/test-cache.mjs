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
  location: {hash:"#cache"},
  performance: {now:()=>0},
  devicePixelRatio: 1,
  requestAnimationFrame: fn => {pendingFrame = fn; return 1;},
  setTimeout: fn => {timers.set(++nextTimer,fn); return nextTimer;},
  clearTimeout: id => timers.delete(id),
  cancelAnimationFrame: () => {pendingFrame = null;}
});
get("demo-search").value="";
vm.runInContext(source,context);
const getCache=id=>get("cache-"+id);
const click=id=>getCache(id).listeners.click();
const state=()=>JSON.parse(vm.runInContext("JSON.stringify(cacheLab)",context));
const pump=()=>{
  const [id,fn]=[...timers.entries()][0];
  timers.delete(id);
  fn();
};
const alter=(id,value)=>getCache(id).listeners.change({target:{value}});
const finish=()=>{for(let i=0;i<8;i++) click("step");};
assert.equal(body.dataset.lesson,"cache");
assert.equal(getCache("workbench").hidden,false);
assert.equal(get("standard-workbench").hidden,true);
assert.equal(getCache("rate").textContent,"—");
assert.deepEqual(state().lines,[null,null]);
assert.equal(getCache("pass-1").children.length,4);
click("step");
assert.equal(getCache("workbench").dataset.path,"miss");
assert.equal(getCache("wire-near").children.length,1);
assert.equal(getCache("wire-far").children.length,1);
assert.equal(state().lines[0].value,3);
assert.equal(getCache("lines").children[0].dataset.active,"true");
assert.equal(getCache("ram").children[0].dataset.active,"true");
assert.equal(getCache("pass-1").children[0].dataset.result,"miss");
assert.equal(getCache("ticks").textContent,"8");
click("step");click("step");
assert.equal(getCache("workbench").dataset.path,"hit");
assert.equal(getCache("ticks").textContent,"17");
assert.equal(getCache("pass-1").children[2].dataset.result,"hit");
finish();
assert.equal(state().records.length,8);
assert.equal(getCache("step").disabled,true);
assert.equal(getCache("run").disabled,true);
assert.equal(getCache("hits").textContent,"6");
assert.equal(getCache("misses").textContent,"2");
assert.equal(getCache("rate").textContent,"100%");
assert.equal(getCache("ticks").textContent,"22");
get("advanced-toggle").listeners.click();
assert.match(get("advanced-live").textContent,/2\.75 model ticks per read/);

alter("pattern","conflict");
assert.deepEqual(state().lines,[null,null]);
finish();
assert.equal(getCache("hits").textContent,"0");
assert.equal(getCache("misses").textContent,"8");
assert.equal(getCache("rate").textContent,"0%");
assert.equal(getCache("ticks").textContent,"64");
assert.deepEqual(state().lines,[{address:2,tag:1,value:8},null]);
assert.deepEqual(state().records.map(r=>r.evicted),[null,0,2,0,2,0,2,0]);
assert.match(getCache("note").textContent,/evicted address 0/);

alter("size","4");
assert.equal(state().records.length,0);
assert.deepEqual(state().lines,[null,null,null,null]);
assert.equal(state().pattern,"conflict");
click("run");
assert.equal(getCache("run").textContent,"Pause");
assert.equal(getCache("step").disabled,true);
pump();
click("run");
assert.equal(timers.size,0);
assert.equal(state().records.length,2);
click("run");
while(timers.size) pump();
assert.equal(getCache("hits").textContent,"6");
assert.equal(getCache("rate").textContent,"100%");

click("reset");
assert.equal(state().size,4);
assert.equal(state().pattern,"conflict");
reducedMotion=true;
click("step");
assert.equal(getCache("wire-near").children.length,0);
assert.equal(getCache("workbench").dataset.path,"miss");
click("run");
context.location.hash="#memory";
navigation.hashchange();
assert.equal(timers.size,0);
assert.equal(getCache("workbench").hidden,true);
get("demo-search").value="direct mapped";
get("demo-search").listeners.input();
assert.equal(get("demo-count").textContent,"1 demo");
assert.equal(get("demo-list").children[0].dataset.lesson,"cache");
console.log("Cache smoke: cold/warm traces; conflicts, tags and eviction; cache size; latency; autoplay, pause and reset; reduced motion, Advanced, and search.");
