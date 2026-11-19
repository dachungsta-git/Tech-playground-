import {expect, test as base} from "@playwright/test";
import {fixture, origin} from "./fixture.mjs";

const output = page => page.locator("#result-value");
const control = (page, name) => page.getByRole("slider", {name});
const demoButtons = page => page.locator("#demo-list").getByRole("button");
const open = (page, slug = "") => page.goto(origin + "/" + (slug ? "#" + slug : ""));

const test = base.extend({
  app: [async ({page}, use) => {
    const app = fixture();
    await page.route(origin + "/**", async route => {
      const request = route.request();
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

test("all four canvases animate, Pause freezes pixels, and reduced-motion preference is respected", async ({page}) => {
  test.setTimeout(45_000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  const frame = () => page.locator("#simulation").evaluate(canvas => canvas.toDataURL());
  for (const name of ["Wi-Fi", "GPS", "Noise cancellation", "Airplane wings"]) {
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
  await expect(page.locator("#demo-count")).toHaveText("4 demos");
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

test("the demo library remains usable at phone width", async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await open(page);
  await page.getByRole("searchbox", {name: "Find a demo"}).fill("airfoil");
  await page.getByRole("button", {name: "Airplane wings", exact: true}).click();
  await expect(control(page, "Angle of attack")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
