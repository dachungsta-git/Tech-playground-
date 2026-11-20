import {expect, test as base} from "@playwright/test";
import {fixture, origin} from "./fixture.mjs";

const output = page => page.locator("#result-value");
const control = (page, name) => page.getByRole("slider", {name});
const demoButtons = page => page.locator("#demo-list").getByRole("button");
const open = (page, slug = "") => page.goto(origin + "/" + (slug ? "#" + slug : ""));

const test = base.extend({
  app: [async ({page}, use) => {
    const app = fixture();
    await page.route("**/*", async route => {
      const request = route.request();
      if (new URL(request.url()).origin !== origin) return route.abort();
      const response = await app.fetch(new URL(request.url()).pathname, {
        method: request.method(),
        headers: await request.allHeaders(),
        body: request.postDataBuffer() ?? undefined,
      });
      await route.fulfill({
        status: response.status,
        headers: Object.fromEntries(response.headers),
        body: Buffer.from(await response.arrayBuffer()),
      });
    });
    try {
      await use(app);
    } finally {
      await page.unrouteAll({behavior: "wait"});
      app.close();
    }
  }, {auto: true}],
});

test("Wi-Fi weakens with distance and walls, Advanced values update, and Reset restores inputs", async ({page}) => {
  await open(page);
  const distance = control(page, "Distance from router");
  const walls = control(page, "Walls in the way");
  const initial = await output(page).innerText();
  await distance.press("End");
  await expect(distance).toHaveValue("20");
  const far = Number.parseInt(await output(page).innerText(), 10);
  expect(far).toBeLessThan(Number.parseInt(initial, 10));
  await page.getByRole("button", {name: "Advanced mode"}).click();
  await expect(page.locator("#advanced-panel")).toBeVisible();
  await walls.press("End");
  expect(Number.parseInt(await output(page).innerText(), 10)).toBeLessThan(far);
  await expect(page.locator("#advanced-live")).toContainText("d = 20 m, w = 3");
  await page.getByRole("button", {name: "Reset"}).click();
  await expect(distance).toHaveValue("8");
  await expect(walls).toHaveValue("0");
  await expect(output(page)).toHaveText(initial);
  await page.getByRole("button", {name: "Hide advanced mode"}).click();
  await expect(page.locator("#advanced-panel")).toBeHidden();
});

test("GPS narrows a ring to two crossings and one location", async ({page}) => {
  await open(page, "gps");
  const satellites = control(page, "Visible satellites");
  await expect(satellites).toHaveValue("2");
  await expect(output(page)).toHaveText("Two crossings");
  await satellites.press("Home");
  await expect(output(page)).toHaveText("A whole ring");
  await satellites.press("End");
  await expect(output(page)).toHaveText("One location");
});

test("opposing equal sound waves cancel while in-phase waves reinforce", async ({page}) => {
  await open(page, "noise-cancellation");
  const phase = control(page, "Phase shift");
  const volume = control(page, "Headphone wave level");
  await phase.press("Home");
  await expect(output(page)).toHaveText("200%");
  for (let i = 0; i < 36; i++) await phase.press("ArrowRight");
  await expect(phase).toHaveAttribute("aria-valuetext", "180°");
  await expect(output(page)).toHaveText("0%");
  await volume.press("Home");
  await expect(output(page)).toHaveText("100%");
});

test("wing lift peaks and drops at stall, with the close-up synchronized", async ({page}) => {
  await open(page, "wings");
  const angle = control(page, "Angle of attack");
  await expect(page.getByRole("heading", {name: "Wing close-up"})).toBeVisible();
  for (let i = 0; i < 10; i++) await angle.press("ArrowRight");
  await expect(output(page)).toHaveText("100%");
  await expect(page.locator("#foil-profile")).toHaveAttribute("transform", "rotate(-15 138 85)");
  await angle.press("End");
  await expect(output(page)).toHaveText("45%");
  await expect(page.locator("#result-note")).toContainText("Stalled");
  await expect(page.locator("#foil-angle-label")).toHaveText("26°");
  await page.getByRole("button", {name: "GPS", exact: true}).click();
  await expect(page.locator("#airfoil-inset")).toBeHidden();
});

test("all six canvases animate, Pause freezes pixels, and reduced-motion preference is respected", async ({page}) => {
  test.setTimeout(45_000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  const frame = () => page.locator("#simulation").evaluate(canvas => canvas.toDataURL());
  for (const name of ["Wi-Fi", "GPS", "Noise cancellation", "Airplane wings", "Transistors", "Vacuum tube triode"]) {
    if (name === "Wi-Fi") await open(page);
    else await demoButtons(page).filter({hasText: name}).click();
    const first = await frame();
    await expect.poll(frame).not.toBe(first);
    await page.getByRole("button", {name: "Pause motion"}).click();
    const still = await frame();
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    expect(await frame()).toBe(still);
    await page.getByRole("button", {name: "Play motion"}).click();
    await expect.poll(frame).not.toBe(still);
  }
  await page.emulateMedia({reducedMotion: "reduce"});
  await expect(page.getByRole("button", {name: /motion/})).toBeHidden();
  expect(errors).toEqual([]);
});

test("catalog filters normalized keywords, keeps selection, and supports history and direct links", async ({page}) => {
  await open(page);
  const search = page.getByRole("searchbox", {name: "Find a demo"});
  for (const name of ["Wi-Fi", "GPS", "Noise cancellation", "Airplane wings"]) await expect(page.getByRole("button", {name, exact: true})).toBeVisible();
  await expect(page.locator("#demo-count")).toHaveText("11 demos");
  await search.fill("  ＳＡＴＥＬＬＩＴＥ   navigation ");
  await expect(page.locator("#demo-count")).toHaveText("1 demo");
  await expect(demoButtons(page)).toHaveCount(1);
  await demoButtons(page).first().click();
  await expect(page).toHaveURL(/#gps$/);
  await expect(demoButtons(page).first()).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", {name: "How does GPS find you?"})).toBeFocused();
  await search.clear();
  await page.getByRole("button", {name: "Airplane wings", exact: true}).click();
  await expect(page).toHaveURL(/#wings$/);
  await page.goBack();
  await expect(page.getByRole("heading", {name: "How does GPS find you?"})).toBeVisible();
  await page.goForward();
  await expect(page.getByRole("heading", {name: "How does a wing make lift?"})).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", {name: "Airplane wings", exact: true})).toHaveAttribute("aria-pressed", "true");
  await open(page, "unknown-demo");
  await expect(page.getByRole("heading", {name: "How does Wi-Fi reach you?"})).toBeVisible();
});

test("a failed search sends nothing until a visitor submits, then de-duplicates normalized topics", async ({page, app}) => {
  const posts = [];
  page.on("request", request => {
    if (request.url().endsWith("/api/suggestions")) posts.push(request.postDataJSON());
  });
  await open(page);
  const search = page.getByRole("searchbox", {name: "Find a demo"});
  const submit = page.getByRole("button", {name: "Suggest this demo"});
  await search.fill(" Ｓolar    Panels ");
  await expect(page.locator("#demo-count")).toHaveText("0 demos");
  await expect(submit).toBeVisible();
  expect(posts).toEqual([]);
  expect(app.rows()).toEqual([]);
  await submit.click();
  await expect(page.locator("#suggest-status")).toHaveText("Suggestion recorded. Thanks!");
  await expect(submit).toBeDisabled();
  expect(posts).toEqual([{topic: "solar panels"}]);
  expect(app.rows()[0]).toMatchObject({topic: "solar panels", request_count: 1});
  await search.fill("SOLAR panels");
  await expect(submit).toBeDisabled();
  await search.fill("router");
  await expect(submit).toBeHidden();
  await expect(page.locator("#demo-count")).toHaveText("1 demo");
});

test("suggestion validation explains the problem and allows a corrected retry", async ({page, app}) => {
  await open(page);
  const search = page.getByRole("searchbox", {name: "Find a demo"});
  const submit = page.getByRole("button", {name: "Suggest this demo"});
  await search.fill("https://example.test");
  await submit.click();
  await expect(page.locator("#suggest-status")).toContainText("Use a short topic");
  await expect(submit).toBeEnabled();
  expect(app.rows()).toEqual([]);
  await search.fill("how glass is made");
  await submit.click();
  await expect(page.locator("#suggest-status")).toHaveText("Suggestion recorded. Thanks!");
});

test("a transient suggestion storage failure lets the visitor retry the same topic", async ({page, app}) => {
  const fetch = app.fetch;
  let submissions = 0;
  app.fetch = (path, options) => {
    if (path === "/api/suggestions" && options.method === "POST" && ++submissions === 1) {
      return fetch(path, options, {prepare() { throw new Error("Temporary storage failure"); }});
    }
    return fetch(path, options);
  };

  await open(page);
  const search = page.getByRole("searchbox", {name: "Find a demo"});
  const submit = page.getByRole("button", {name: "Suggest this demo"});
  await search.fill("how paper is made");
  await submit.click();
  await expect(page.locator("#suggest-status")).toContainText("Try again");
  await expect(search).toHaveValue("how paper is made");
  await expect(submit).toBeEnabled();
  expect(app.rows()).toEqual([]);

  await submit.click();
  await expect(page.locator("#suggest-status")).toHaveText("Suggestion recorded. Thanks!");
  await expect(submit).toBeDisabled();
  expect(submissions).toBe(2);
  expect(app.rows()).toMatchObject([{topic: "how paper is made", request_count: 1}]);
});

test("the demo library remains usable at phone width", async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await open(page);
  await page.getByRole("searchbox", {name: "Find a demo"}).fill("airfoil");
  await page.getByRole("button", {name: "Airplane wings", exact: true}).click();
  await expect(control(page, "Angle of attack")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test("seven newer demos can be found and opened without offering a suggestion", async ({page}) => {
  await open(page);
  const search = page.getByRole("searchbox", {name: "Find a demo"});
  for (const [query, name, slug] of [
    ["mosfet", "Transistors", "transistors"],
    ["processor", "CPU Lab", "cpu"],
    ["ripple carry", "Inside the ALU", "alu"],
    ["register file", "Registers & memory", "memory"],
    ["direct mapped", "CPU cache", "cache"],
    ["branch prediction", "Pipelines & branches", "pipeline"],
    ["thermionic emission", "Vacuum tube triode", "vacuum-tubes"],
  ]) {
    await search.fill(query);
    await expect(demoButtons(page)).toHaveCount(1);
    await expect(page.getByRole("button", {name: "Suggest this demo"})).toBeHidden();
    await page.getByRole("button", {name, exact: true}).click();
    await expect(page).toHaveURL(new RegExp("#" + slug + "$"));
  }
});

test("a transistor needs a channel and drain voltage to conduct; reset switches it off", async ({page}) => {
  await open(page, "transistors");
  const gate = control(page, "Gate voltage");
  const drain = control(page, "Drain voltage");
  await expect(output(page)).toHaveText("0.00 mA");
  await gate.press("End");
  await expect(output(page)).toHaveText("2.72 mA");
  await drain.press("Home");
  await expect(gate).toHaveValue("3.3");
  await expect(output(page)).toHaveText("0.00 mA");
  await page.getByRole("button", {name: "Reset", exact: true}).click();
  await expect(gate).toHaveValue("0.8");
  await expect(drain).toHaveValue("0.8");
  await expect(output(page)).toHaveText("0.00 mA");
});

test("CPU fetch, decode and execute writes 8 to output memory, halts, and resets", async ({page}) => {
  await open(page, "cpu");
  const step = page.getByRole("button", {name: "Step", exact: true});
  const reset = page.getByRole("button", {name: "Reset", exact: true});
  const memoryOut = page.locator("#cpu-data div").filter({has: page.locator("dt", {hasText: /^OUT$/})}).locator("dd");
  await expect(memoryOut).toHaveText("—");
  for (const phase of ["fetch", "decode", "execute"]) {
    await step.click();
    await expect(page.locator("#cpu-stage-" + phase)).toHaveAttribute("aria-current", "step");
  }
  for (let i = 3; i < 15; i++) await step.click();
  await expect(memoryOut).toHaveText("8");
  await expect(step).toBeDisabled();
  await page.getByRole("button", {name: "Advanced mode"}).click();
  await expect(page.locator("#advanced-live")).toContainText("Model ticks: 15");
  await reset.click();
  await expect(memoryOut).toHaveText("—");
  await expect(step).toBeEnabled();
  await expect(page.locator("#advanced-live")).toContainText("Model ticks: 0");
});

const rowValue = (page, container, label) => page.locator(container + " > div")
  .filter({has: page.locator("dt", {hasText: label})}).locator("dd");
const stepMany = async (page, selector, count) => {
  for (let i=0; i<count; i++) await page.locator(selector).click();
};

test("all five CPU chapters link to each other and support Back at phone width", async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  const pageErrors=[];
  page.on("pageerror",e=>pageErrors.push(e.message));
  await open(page,"cpu");
  for (const [from,to,title] of [["cpu","alu","Inside the ALU"],["alu","memory","Registers & memory"],
      ["memory","cache","Cache"],["cache","pipeline","Pipelines & branches"],["pipeline","cpu","The whole CPU"]]) {
    const link=page.locator("#"+from+"-workbench .cpu-roadmap").getByRole("link",{name:new RegExp(title)});
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(new RegExp("#"+to+"$"));
    await expect(page.locator("#lesson-title")).toBeFocused();
    await expect(page.locator("#"+to+"-workbench")).toBeVisible();
    await expect(page.locator("#"+from+"-workbench")).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  }
  await page.goBack();
  await expect(page.locator("#pipeline-workbench")).toBeVisible();
  await page.goForward();
  await expect(page.locator("#cpu-workbench")).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test("ALU traces the carry and separates unsigned carry from signed overflow", async ({page}) => {
  await open(page,"alu");
  const bit=page.getByRole("button",{name:"A bit 0 (1s place)"});
  await expect(bit).toHaveAttribute("aria-pressed","true");
  await bit.press("Space");
  await expect(bit).toHaveAttribute("aria-pressed","false");
  await expect(bit).toBeFocused();
  await page.locator("#alu-reset").click();
  await page.locator("#alu-step").click();
  await expect(page.locator(".alu-connector[data-pulse=true]")).toHaveCount(1);
  await stepMany(page,"#alu-step",3);
  await expect(page.locator("#alu-sum")).toHaveText("1000 (8)");
  await expect(page.locator("#alu-overflow")).toHaveText("Yes");
  await expect(page.locator("#alu-carry")).toHaveText("0");
  await page.locator("#alu-example-carry").click();
  await stepMany(page,"#alu-step",4);
  await expect(page.locator("#alu-carry")).toHaveText("1");
  await expect(page.locator("#alu-overflow")).toHaveText("No");
});

test("LOAD and STORE move data while ADD changes only the chosen register", async ({page}) => {
  await open(page,"memory");
  const r1=rowValue(page,"#memory-reg-values",/^R1$/);
  const ramA=rowValue(page,"#memory-ram-values",/^\[A\]/);
  await page.locator("#memory-source").selectOption("1");
  await page.locator("#memory-register").selectOption("1");
  await page.locator("#memory-destination").selectOption("0");
  await page.locator("#memory-load").click();
  await expect(r1).toHaveText("5");
  await expect(page.locator("#memory-workbench")).toHaveAttribute("data-path","in");
  await page.locator("#memory-add").click();
  await expect(r1).toHaveText("10");
  await expect(ramA).toHaveText("3");
  await page.locator("#memory-store").click();
  await expect(ramA).toHaveText("10");
  await expect(page.locator("#memory-workbench")).toHaveAttribute("data-path","out");
  await page.locator("#memory-reset").click();
  await expect(ramA).toHaveText("3");
  await expect(r1).toHaveText("0");
});

test("cache warm-up, two-line conflicts and four-line recovery stay distinct", async ({page}) => {
  await page.emulateMedia({reducedMotion:"reduce"});
  await open(page,"cache");
  await page.locator("#cache-step").click();
  await expect(page.locator("#cache-workbench")).toHaveAttribute("data-path","miss");
  await expect(page.locator("#cache-wire-near span")).toHaveCount(0);
  await stepMany(page,"#cache-step",7);
  await expect(page.locator("#cache-hits")).toHaveText("6");
  await expect(page.locator("#cache-rate")).toHaveText("100%");
  await page.locator("#cache-pattern").selectOption("conflict");
  await stepMany(page,"#cache-step",8);
  await expect(page.locator("#cache-note")).toContainText("evicted address");
  await expect(page.locator("#cache-misses")).toHaveText("8");
  await expect(page.locator("#cache-rate")).toHaveText("0%");
  await page.locator("#cache-size").selectOption("4");
  await stepMany(page,"#cache-step",8);
  await expect(page.locator("#cache-hits")).toHaveText("6");
  await expect(page.locator("#cache-ticks")).toHaveText("22");
});

test("pipeline discards the wrong path, commits the same value with a correct guess and can run serially", async ({page}) => {
  await open(page,"pipeline");
  const discarded=rowValue(page,"#pipeline-counts",/^Flushed$/);
  const outputRam=rowValue(page,"#pipeline-counts",/^RAM \[OUT\]$/);
  const cycle=rowValue(page,"#pipeline-counts",/^Cycles$/);
  await stepMany(page,"#pipeline-step",4);
  await expect(discarded).toHaveText("2");
  await expect(outputRam).toHaveText("0");
  await expect(page.locator("#pipeline-stages [data-state=flushed]")).toHaveCount(2);
  await stepMany(page,"#pipeline-step",5);
  await expect(outputRam).toHaveText("8");
  await expect(cycle).toHaveText("9");
  await page.locator("#pipeline-prediction").selectOption("taken");
  await stepMany(page,"#pipeline-step",7);
  await expect(discarded).toHaveText("0");
  await expect(outputRam).toHaveText("8");
  await expect(cycle).toHaveText("7");
  await page.locator("#pipeline-mode").selectOption("serial");
  await expect(page.locator("#pipeline-prediction")).toBeDisabled();
  await stepMany(page,"#pipeline-step",15);
  await expect(outputRam).toHaveText("8");
  await expect(cycle).toHaveText("15");
});

test("tube heater, grid and plate voltages affect current and compare with the MOSFET", async ({page}) => {
  await open(page,"vacuum-tubes");
  const heater=page.getByRole("checkbox",{name:"Cathode heater"});
  const grid=control(page,"Grid voltage");
  const plate=control(page,"Plate voltage");
  await expect(output(page)).toHaveText("3.20 mA");
  await heater.uncheck();
  await expect(output(page)).toHaveText("0.00 mA");
  await heater.check();
  for(let i=0;i<8;i++) await grid.press("ArrowLeft");
  await expect(grid).toHaveValue("-6");
  await expect(output(page)).toHaveText("0.00 mA");
  await expect(page.locator("#result-note")).toContainText("Cutoff");
  for(let i=0;i<8;i++) await plate.press("ArrowRight");
  await expect(plate).toHaveValue("160");
  await expect(output(page)).toHaveText("1.13 mA");
  await page.getByRole("button",{name:"Advanced mode"}).click();
  await expect(page.locator("#advanced-live")).toContainText("Drive = 2.00 V");
  await page.getByRole("button",{name:"Reset",exact:true}).click();
  await expect(output(page)).toHaveText("3.20 mA");
  await page.getByRole("link",{name:/Try controlling a transistor/}).click();
  await expect(page).toHaveURL(/#transistors$/);
  await expect(heater).toHaveCount(0);
  await expect(control(page,"Gate voltage")).toBeVisible();
  await page.getByRole("link",{name:/Try controlling a vacuum tube/}).click();
  await expect(page).toHaveURL(/#vacuum-tubes$/);
  await expect(heater).toBeChecked();
});
