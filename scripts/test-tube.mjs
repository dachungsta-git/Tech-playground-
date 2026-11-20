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
let pendingFrame = null;
const context = vm.createContext({
  document: {getElementById:get, createElement:el, createTextNode:text=>({text}), body},
  window: {addEventListener() {}},
  matchMedia: query => ({matches:query.includes("max-width") || query.includes("reduced-motion"),addEventListener() {}}),
  history: {pushState(_a,_b,hash){context.location.hash=hash;}},
  location: {hash:"#vacuum-tubes"},
  performance: {now:()=>0},
  devicePixelRatio: 1,
  requestAnimationFrame: fn => {pendingFrame = fn; return 1;},
  cancelAnimationFrame: () => {pendingFrame = null;}
});
get("demo-search").value = "";
vm.runInContext(source,context);
assert.equal(body.dataset.lesson,"tube");
assert.equal(get("demo-count").textContent,"11 demos");
assert.equal(get("simulation").width,440);
assert.equal(get("flight-motion").hidden,true);
assert.equal(pendingFrame,null);
assert.equal(get("result-value").textContent,"3.20 mA");
assert.ok(paint.some(([label])=>label==="Control grid"));
assert.ok(paint.some(([label])=>label==="Electrons →"));
const control=key=>get("settings").children.flatMap(field=>field.children).find(node=>node.name===key);
function change(key,value) {
  const input=control(key);
  input.value=String(value);
  input.listeners.input();
}
function heater(value) {
  const input=control("heater");
  input.checked=value;
  input.listeners.change();
}
assert.equal(control("heater").type,"checkbox");
assert.equal(control("heater").checked,true);
heater(false);
assert.equal(get("result-value").textContent,"0.00 mA");
assert.match(get("result-note").textContent,/cold cathode/);
heater(true);
change("grid",-6);
assert.match(get("result-note").textContent,/Cutoff/);
assert.equal(get("result-value").textContent,"0.00 mA");
change("plate",160);
assert.equal(get("result-value").textContent,"1.13 mA");
change("grid",-5);
assert.equal(get("result-value").textContent,"2.08 mA");
change("plate",0);
assert.match(get("result-note").textContent,/no positive voltage/);
assert.equal(get("result-value").textContent,"0.00 mA");
get("advanced-toggle").listeners.click();
assert.match(get("advanced-model").textContent,/\^\(3\/2\)/);
assert.match(get("advanced-limit").textContent,/not fitted to a real tube/);
get("reset").listeners.click();
assert.equal(control("heater").checked,true);
assert.equal(get("result-value").textContent,"3.20 mA");
assert.match(get("advanced-live").textContent,/4\.00 V.*3\.20 mA/);
assert.equal(get("device-comparison").hidden,false);
assert.equal(get("tube-to-transistor").hidden,false);
assert.equal(get("transistor-to-tube").hidden,true);
get("tube-to-transistor").listeners.click({button:0,preventDefault(){}});
assert.equal(body.dataset.lesson,"transistor");
assert.equal(context.location.hash,"#transistors");
assert.equal(get("lesson-title").focused,true);
assert.equal(get("tube-to-transistor").hidden,true);
assert.equal(get("transistor-to-tube").hidden,false);
get("transistor-to-tube").listeners.click({button:0,preventDefault(){}});
assert.equal(body.dataset.lesson,"tube");
assert.equal(context.location.hash,"#vacuum-tubes");
get("demo-search").value="thermionic emission";
get("demo-search").listeners.input();
assert.equal(get("demo-count").textContent,"1 demo");
assert.equal(get("demo-list").children[0].dataset.lesson,"tube");
console.log("Tube smoke: 11 demos, heater, cutoff/recovery, plot labels, Advanced, reduced motion, reset, search, and reciprocal transistor links.");
