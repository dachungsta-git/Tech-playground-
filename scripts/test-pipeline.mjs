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
  location: {hash:"#pipeline"},
  performance: {now:()=>0},
  devicePixelRatio: 1,
  requestAnimationFrame: fn => {pendingFrame = fn; return 1;},
  setTimeout: fn => {timers.set(++nextTimer,fn); return nextTimer;},
  clearTimeout: id => timers.delete(id),
  cancelAnimationFrame: () => {pendingFrame = null;}
});
get("demo-search").value = "";
vm.runInContext(source,context);
const click = id => get("pipeline-"+id).listeners.click();
const state = () => JSON.parse(vm.runInContext("JSON.stringify(pipelineLab)",context));
function choose(id,value) {get("pipeline-"+id).listeners.change({target:{value}});}
const steps = n => {for(let i=0;i<n;i++) click("step");};
assert.equal(body.dataset.lesson,"pipeline");
assert.equal(get("pipeline-workbench").hidden,false);
assert.equal(get("standard-workbench").hidden,true);
assert.equal(state().cycle,0);
steps(3);
assert.deepEqual(state().unit,[2,1,0]);
assert.equal(state().r0,3);
steps(1);
assert.deepEqual(state().history.at(-1).flushed,[true,true,false]);
assert.match(get("pipeline-status-title").textContent,/flushed/);
assert.equal(state().discarded,2);
assert.equal(state().r0,3);
assert.equal(state().out,0);
steps(5);
assert.equal(state().done,true);
assert.equal(state().retired,5);
assert.equal(state().out,8);
assert.equal(state().cycle,9);
steps(1);
assert.equal(state().cycle,9);
choose("prediction","taken");
steps(7);
assert.equal(state().done,true);
assert.equal(state().out,8);
assert.equal(state().discarded,0);
assert.equal(state().cycle,7);
choose("prediction","wait");
steps(9);
assert.equal(state().done,true);
assert.equal(state().out,8);
assert.equal(state().discarded,0);
assert.equal(state().cycle,9);
choose("mode","serial");
assert.equal(get("pipeline-prediction").disabled,true);
steps(15);
assert.equal(state().done,true);
assert.equal(state().out,8);
assert.equal(state().discarded,0);
assert.equal(state().cycle,15);
click("reset");
assert.equal(state().cycle,0);
assert.equal(state().mode,"serial");
click("run");
assert.equal(state().cycle,1);
assert.equal(timers.size,1);
click("run");
assert.equal(timers.size,0);
click("run");
context.location.hash="#cpu";
navigation.hashchange();
assert.equal(timers.size,0);
assert.equal(get("pipeline-workbench").hidden,true);
get("demo-search").value="branch prediction";
get("demo-search").listeners.input();
assert.equal(get("demo-count").textContent,"1 demo");
console.log("Pipeline smoke: overlap, actual flush, correct prediction, waiting, serial, commit safety, timers, navigation, and search.");
