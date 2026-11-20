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
let pendingFrame = null;
const context = vm.createContext({
  document: {getElementById:get, createElement:el, createTextNode:text=>({text}), body},
  window: {addEventListener(name,fn) {navigation[name]=fn;}},
  matchMedia: query => ({matches:query.includes("max-width"),addEventListener() {}}),
  history: {pushState(_a,_b,hash) { context.location.hash = hash; }},
  location: {hash:"#alu"},
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
const cards = () => get("alu-chain").children;
const pump = () => {
  const [id,fn] = [...timers.entries()][0];
  timers.delete(id);
  fn();
};
const settle = () => { for (let i=0;i<4;i++) click("alu-step"); };
assert.equal(body.dataset.lesson,"alu");
assert.equal(get("alu-workbench").hidden,false);
assert.equal(get("cpu-workbench").hidden,true);
assert.equal(get("standard-workbench").hidden,true);
assert.equal(get("demo-count").textContent,"11 demos");
assert.equal(cards().length,4);
assert.equal(get("alu-number-a").textContent,"0011 (3)");
assert.equal(get("alu-number-b").textContent,"0101 (5)");
assert.equal(get("alu-sum").textContent,"—");
const firstA = cards()[0].children[1].children[0];
assert.equal(firstA.attributes["aria-pressed"],"true");
assert.equal(firstA.attributes["aria-label"],"A bit 0 (1s place)");
firstA.listeners.click();
assert.equal(get("alu-number-a").textContent,"0010 (2)");
assert.equal(cards()[0].children[1].children[0],firstA);
assert.equal(firstA.attributes["aria-pressed"],"false");

click("alu-reset");
click("alu-step");
assert.equal(cards()[0].dataset.active,"true");
assert.equal(cards()[0].children[3].dataset.pulse,"true");
assert.equal(cards()[1].children[2].children[0].children[1].textContent,"1");
click("advanced-toggle");
assert.match(get("advanced-live").textContent,/Bit 0: A=1, B=1, Cin=0 → S=0, Cout=1/);
for (let i=0;i<3;i++) click("alu-step");
assert.equal(get("alu-sum").textContent,"1000 (8)");
assert.equal(get("alu-carry").textContent,"0");
assert.equal(get("alu-overflow").textContent,"Yes");
assert.match(get("alu-flags-note").textContent,/stored bits read as -8/);
assert.equal(get("alu-step").disabled,true);

click("alu-example-carry");
settle();
assert.equal(get("alu-sum").textContent,"0000 (0)");
assert.equal(get("alu-carry").textContent,"1");
assert.equal(get("alu-overflow").textContent,"No");
click("alu-example-overflow");
settle();
assert.equal(get("alu-sum").textContent,"1000 (8)");
assert.equal(get("alu-carry").textContent,"0");
assert.equal(get("alu-overflow").textContent,"Yes");

click("alu-run");
assert.equal(get("alu-run").textContent,"Pause");
pump();
click("alu-run");
assert.equal(timers.size,0);
assert.equal(get("alu-run").textContent,"Run");
click("alu-run");
while(timers.size) pump();
assert.equal(get("alu-sum").textContent,"1000 (8)");
click("alu-run");
assert.equal(timers.size,1);
let prevented = false;
get("alu-go-cpu").listeners.click({button:0,preventDefault(){prevented=true;}});
assert.equal(prevented,true);
assert.equal(body.dataset.lesson,"cpu");
assert.equal(get("lesson-title").focused,true);
assert.equal(timers.size,0);
get("cpu-go-alu").listeners.click({button:0,preventDefault(){}});
assert.equal(body.dataset.lesson,"alu");
get("demo-search").value="ripple carry";
get("demo-search").listeners.input();
assert.equal(get("demo-count").textContent,"1 demo");
assert.equal(get("demo-list").children[0].dataset.lesson,"alu");
assert.equal(vm.runInContext(`
  (() => {
    for(let a=0;a<16;a++) for(let b=0;b<16;b++) {
      const m=aluModel(a,b);
      const total=aluSigned(a)+aluSigned(b);
      if(m.stored!==((a+b)&15) || m.carry!==((a+b)>>4) || Boolean(m.overflow)!==(total < -8 || total > 7)) return false;
    }
    return true;
  })()
`,context),true);
console.log("ALU smoke: all 256 operand pairs, carry path, overflow and carry-only presets, focus, search, direct link, Advanced, run/pause/reset.");
