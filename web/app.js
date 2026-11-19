"use strict";

const lessons = {
  wifi: {
    title: "How does Wi-Fi reach you?",
    summary: "Watch pulses spread from the router. Add walls and see how the signal fades.",
    image: "Signal waves spread from a router toward your device, with any walls shown between them.",
    accent: "#dafb77",
    legend: [["Router & signal", "#dafb77"], ["Your device", "#ecedff"], ["Walls", "#a7a0c1"]],
    controls: [
      {key: "distance", label: "Distance from router", min: 1, max: 20, initial: 8, unit: " m"},
      {key: "walls", label: "Walls in the way", min: 0, max: 3, initial: 0, unit: ""}
    ],
    result: "Signal strength",
    explanations: [
      ["The router sends radio waves", "Your router encodes data in radio waves that spread through the space around it."],
      ["Distance weakens the signal", "The energy spreads over a larger area as it travels. Your device receives less of it as you move away."],
      ["Walls absorb and reflect waves", "A wall can reduce the signal that makes it through. The amount depends on its material, thickness, and the Wi-Fi frequency."]
    ]
  },
  gps: {
    title: "How does GPS find you?",
    summary: "Watch satellites send timing signals. Add more to narrow down where your receiver could be.",
    image: "A top-down map shows distance rings around the visible satellites and their intersections.",
    accent: "#c2b1ff",
    legend: [["Visible satellite & distance ring", "#c2b1ff"], ["Possible location", "#ecedff"]],
    controls: [
      {key: "satellites", label: "Visible satellites", min: 1, max: 3, initial: 2, unit: ""}
    ],
    result: "Possible locations",
    explanations: [
      ["Satellites send timestamps", "The receiver uses each signal’s travel time to estimate how far away the satellite is."],
      ["Distances narrow the search", "In this flat model, one distance gives a ring of possible locations, two rings can cross twice, and a third can resolve which crossing fits."],
      ["Real GPS works in 3D", "A typical GPS fix uses at least four satellites to estimate three position coordinates and correct the receiver’s clock error."]
    ]
  },
  sound: {
    title: "How do headphones cancel noise?",
    summary: "Watch the waves travel in slow motion. Change the second wave to make the combined sound quieter.",
    image: "Three traces show incoming noise, a wave from the headphones, and the sum of the two.",
    accent: "#ffa6cb",
    legend: [["Incoming noise", "#c2b1ff"], ["Headphone wave", "#76e5ea"], ["Combined sound", "#ffa6cb"]],
    controls: [
      {key: "phase", label: "Phase shift", min: 0, max: 360, initial: 90, step: 5, unit: "°"},
      {key: "volume", label: "Headphone wave level", min: 0, max: 100, initial: 100, step: 5, unit: "%"}
    ],
    result: "Remaining wave amplitude",
    explanations: [
      ["A microphone picks up noise", "Active noise-canceling headphones use microphones to measure sounds around you or inside the ear cup."],
      ["The headphones make a second wave", "When the waves match in size and are half a cycle apart, each peak meets a trough. Their pressures add up to zero in this model."],
      ["Real noise is more complicated", "Steady sounds like an engine hum are often easier to cancel. Actual headphones adjust for many frequencies and changing conditions."]
    ]
  },
  wing: {
    title: "How does a wing make lift?",
    summary: "Tilt the wing into the oncoming air. Can you find the angle that makes the most lift?",
    image: "A jet tilts against a fixed airflow reference above a graph of lift against angle of attack.",
    accent: "#7ce5f2",
    legend: [["Lift and lift curve", "#7ce5f2"], ["Oncoming air", "#c2b1ff"], ["Stall region", "#ffae86"]],
    controls: [{key: "angle", label: "Angle of attack", min: 0, max: 26, initial: 5, unit: "°"}],
    result: "Lift relative to this wing’s peak",
    explanations: [
      ["The angle is measured against the air", "Angle of attack is the angle between the wing’s chord (a straight line from front to back) and the oncoming airflow. It is not the airplane’s pitch relative to the horizon."],
      ["More angle, more lift. Up to a point.", "The wing changes the pressure around it and deflects air downward. At the same airspeed, increasing the angle usually increases lift up to a peak. A curved wing can produce lift even at 0°."],
      ["Too much angle causes a stall", "Beyond a critical angle, airflow separates over much of the upper surface and lift drops. This model uses 15° as an example, not a universal stall angle. It holds airspeed constant."]
    ]
  }
};

const canvas = document.getElementById("simulation");
const ctx = canvas.getContext("2d");
const settings = document.getElementById("settings");
const legend = document.getElementById("legend");
const explanation = document.getElementById("explanation-grid");
const result = document.getElementById("result-value");
const note = document.getElementById("result-note");
const meter = document.getElementById("meter");
const advancedToggle = document.getElementById("advanced-toggle");
const advancedPanel = document.getElementById("advanced-panel");
let advanced = false;
const flightMotion = document.getElementById("flight-motion");
let motionPaused = false;
let lastFrame = null;

const motionEnabled = () => !motionPaused && !reduceMotion.matches;
// New demos register once here; navigation, search, motion, and direct links share the registry.
const catalog = [
  {id:"wifi", slug:"wifi", name:"Wi-Fi", icon:"◉", keywords:"wireless router radio signal internet walls networking", draw:drawWifi, read:wifiReading},
  {id:"gps", slug:"gps", name:"GPS", icon:"⌖", keywords:"satellite signals trilateration navigation location maps", draw:drawGps, read:gpsReading},
  {id:"sound", slug:"noise-cancellation", name:"Noise cancellation", icon:"∿", keywords:"sound audio headphones acoustics waves interference phase", draw:drawSound, read:soundReading},
  {id:"wing", slug:"wings", name:"Airplane wings", icon:"✈", keywords:"flight aviation plane airfoil lift stall aerodynamics angle", draw:drawWing, read:wingReading, extras:"airfoil-inset", refresh:state => updateAirfoil(state.angle)}
];
const byId = Object.fromEntries(catalog.map(item => [item.id, item]));
const motionTimes = Object.fromEntries(catalog.map(({id}) => [id, 0]));
const search = document.getElementById("demo-search");
const demoList = document.getElementById("demo-list");
const empty = document.getElementById("demo-empty");
const suggest = document.getElementById("suggest-demo");
const suggestStatus = document.getElementById("suggest-status");
const suggested = new Set();
let pendingTopic = null;
const mobile = matchMedia("(max-width: 470px)");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const states = Object.fromEntries(Object.entries(lessons).map(([key, lesson]) => [key, defaults(lesson)]));

let active = "wifi";
let width = 680;
let height = 360;
let animationFrame = 0;

function defaults(lesson) {
  return Object.fromEntries(lesson.controls.map(control => [control.key, control.initial]));
}

function element(tag, content) {
  const node = document.createElement(tag);
  if (content !== undefined) node.textContent = content;
  return node;
}

function selectLesson(key) {
  active = key;
  const lesson = lessons[key];
  document.body.dataset.lesson = key;
  for (const topic of demoList.children) topic.setAttribute("aria-pressed", topic.dataset.lesson === key);
  document.getElementById("lesson-title").textContent = lesson.title;
  document.getElementById("lesson-summary").textContent = lesson.summary;
  document.getElementById("result-name").textContent = lesson.result;
  canvas.setAttribute("aria-label", lesson.image);

  legend.replaceChildren(...lesson.legend.map(([name, color]) => {
    const item = element("span", name);
    const marker = element("i");
    marker.style.setProperty("--swatch", color);
    item.prepend(marker);
    return item;
  }));

  explanation.replaceChildren(...lesson.explanations.map(([heading, text]) => {
    const item = element("article");
    item.append(element("h3", heading), element("p", text));
    return item;
  }));

  settings.replaceChildren(...lesson.controls.map(control => {
    const field = element("div");
    field.className = "setting";
    const label = element("label", control.label);
    const input = element("input");
    Object.assign(input, {
      id: "control-" + control.key, name: control.key, type: "range", min: control.min,
      max: control.max, step: control.step ?? 1, value: states[key][control.key]
    });
    label.htmlFor = input.id;
    const value = element("output");
    value.setAttribute("aria-hidden", "true");
    function refresh() {
      const formatted = input.value + control.unit;
      value.textContent = formatted;
      input.setAttribute("aria-valuetext", formatted);
    }
    input.addEventListener("input", () => {
      states[key][control.key] = Number(input.value);
      refresh();
      update();
    });
    refresh();
    field.append(label, value, input);
    return field;
  }));

  update();
}

function wifiScore(distance, walls) {
  return 100 * (distance ** -.48) * (.67 ** walls);
}

function combinedAmplitude(phase, level) {
  return Math.hypot(1 + level * Math.cos(phase), level * Math.sin(phase));
}

const advancedLessons = {
  wifi: {
    equation: "Free space: Pᵣ ∝ 1/d² (fixed frequency and antennas)",
    science: "Doubling distance in free space cuts received power to a quarter, about 6 dB lower. Indoors, walls absorb and reflect some of the signal, and reflected paths can interfere.",
    model: "Score = 100 × (d / 1 m)^(−0.48) × 0.67^w",
    live: ({distance, walls}) => `d = ${distance} m, w = ${walls} → ${wifiScore(distance,walls).toFixed(1)}% on the demo scale`,
    limit: "The distance exponent and per-wall multiplier are illustrative, not measured Wi-Fi power or a prediction of connection speed. The animations slow down radio waves so you can see them.",
    source: ["ITU: Free-space attenuation", "https://www.itu.int/rec/R-REC-P.525/en"]
  },
  gps: {
    equation: "Range ≈ c × travel time; pseudorange ≈ range + c × receiver clock bias",
    science: "Radio signals travel at about 300,000 km/s, so a 1 ns timing error corresponds to about 30 cm. A typical GPS fix estimates x, y, z and receiver clock bias using at least four satellite measurements.",
    model: "(x − xᵢ)² + (y − yᵢ)² = rᵢ² for each satellite i",
    live: ({satellites:n}) => `${n} distance constraint${n===1?"":"s"} → ${["one circle of possibilities","two crossings","one matching crossing"][n-1]}`,
    limit: "The flat map assumes exact distances and no clock error. Each circle shows positions at the same distance from a satellite; the moving dots are a timing illustration, not actual satellite motion.",
    source: ["GPS.gov: Trilateration", "https://www.gps.gov/trilateration"]
  },
  sound: {
    equation: "p_total = p_noise + p_headphones",
    science: "At the ear, sound pressures add. For two tones at the same frequency, an equal, opposite pressure wave cancels the first; headphones estimate and generate that second wave.",
    model: "A = √(1 + r² + 2r cos φ), with r = headphone amplitude ÷ noise amplitude",
    live: ({phase,volume}) => `φ = ${phase}°, r = ${(volume/100).toFixed(2)} → ${(100*combinedAmplitude(phase*Math.PI/180,volume/100)).toFixed(1)}% of the original amplitude`,
    limit: "This is one steady tone, not a percent change in perceived loudness. Real noise cancellation has to match many frequencies and account for delay.",
    source: ["OpenStax: Interference of waves", "https://openstax.org/books/university-physics-volume-1/pages/16-5-interference-of-waves"]
  },
  wing: {
    equation: "L = ½ ρ V² S Cₗ",
    science: "Lift L depends on air density ρ, airspeed V relative to the wing, wing area S, and the lift coefficient Cₗ. At fixed ρ, V and S, doubling Cₗ doubles lift. At fixed Cₗ, doubling V quadruples it.",
    model: "L / L_peak = 0.20 + 0.80α/15 through 15°; then 1 − 0.55[(α − 15)/11]^0.75",
    live: ({angle}) => `α = ${angle}° → ${(100*wingLift(angle)).toFixed(1)}% of peak lift`,
    limit: "The curve and 15° peak describe this example only. Real stall behavior depends on the wing and flow conditions, and stall usually leaves some lift.",
    source: ["NASA Glenn: The lift equation", "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/lift-equation/"]
  }
};

function updateAdvanced(state) {
  advancedToggle.setAttribute("aria-expanded", String(advanced));
  advancedToggle.textContent = advanced ? "Hide advanced mode" : "Advanced mode";
  advancedPanel.hidden = !advanced;
  if (!advanced) return;
  const a = advancedLessons[active];
  for (const [id, content] of Object.entries({equation: a.equation, science: a.science,
      model: a.model, live: a.live(state), limit: a.limit})) {
    document.getElementById("advanced-" + id).textContent = content;
  }
  const source = document.getElementById("advanced-source");
  source.textContent = a.source[0];
  source.href = a.source[1];
}

function percentReading(amount, description, maximum) {
  return {amount, value:amount+"%", description, maximum};
}

function wifiReading({distance,walls}) {
  const amount = Math.round(wifiScore(distance,walls));
  return percentReading(amount, amount >= 55 ? "A strong signal in this model." : amount >= 25 ?
    "Less signal reaches your device." : "Only a small fraction of the signal reaches your device.");
}

function gpsReading({satellites}) {
  const [value, description] = [
    ["A whole ring", "One distance gives you a circle of possibilities."],
    ["Two crossings", "Either crossing fits both distance measurements."],
    ["One location", "Only one crossing fits all three distances."]
  ][satellites - 1];
  return {value, description};
}

function wingReading({angle}) {
  return percentReading(Math.round(wingLift(angle)*100), angle > 15 ?
    "Stalled in this model. Separated airflow reduces lift, but lift does not go to zero." :
    angle === 15 ? "Peak lift at 15° in this model. Try increasing the angle one more step." :
    "Airspeed is fixed. Increase the angle to build lift.");
}

function soundReading({phase,volume}) {
  const amount = Math.round(100*combinedAmplitude(phase*Math.PI/180,volume/100));
  return percentReading(amount, amount === 0 ? "The matching waves cancel each other." : amount < 100 ?
    "The waves partly cancel, so the sound gets quieter." : amount === 100 ?
    "The combined wave is as large as the incoming noise." : "The waves reinforce each other, making the sound louder.", 200);
}

function update() {
  const state = states[active];
  const current = byId[active];
  const {amount, value, description, maximum = 100} = current.read(state);
  meter.hidden = amount === undefined;
  for (const item of catalog) if (item.extras) document.getElementById(item.extras).hidden = item !== current;
  current.refresh?.(state);
  flightMotion.hidden = reduceMotion.matches;
  flightMotion.textContent = motionPaused ? "Play motion" : "Pause motion";

  updateAdvanced(state);
  result.textContent = value;
  note.textContent = description;
  if (amount !== undefined) meter.firstElementChild.style.width = 100 * amount / maximum + "%";
  cancelAnimationFrame(animationFrame);
  lastFrame = null;
  draw(performance.now());
}

function resize() {
  width = mobile.matches ? 440 : 680;
  height = mobile.matches ? 262 : 360;
  const density = Math.max(1, Math.min(3, devicePixelRatio || 1));
  canvas.width = width * density;
  canvas.height = height * density;
  ctx.setTransform(density, 0, 0, density, 0, 0);
  update();
}

function circle(x, y, radius, color, fill = false, thickness = 1) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.lineWidth = thickness;
  ctx[fill ? "fillStyle" : "strokeStyle"] = color;
  if (fill) ctx.fill();
  else ctx.stroke();
}

function line(x, y, endX, endY, color, thickness = 1) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.stroke();
}

function box(x, y, w, h, color, border, radius = 7) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fillStyle = color;
  ctx.fill();
  if (border) {
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = border;
    ctx.stroke();
  }
}

function label(content, x, y, color = "#c3c6dc", align = "center") {
  ctx.font = "600 15px system-ui";
  ctx.textAlign = align;
  ctx.fillStyle = color;
  ctx.fillText(content, x, y);
}

function drawWifi(time) {
  const {distance, walls} = states.wifi;
  const accent = lessons.wifi.accent;
  const centerX = width * .16;
  const centerY = height * .49;
  const deviceX = centerX + 106 + (distance - 1) / 19 * (width - centerX - 157);
  const totalDistance = deviceX - centerX;
  const wallPositions = Array.from({length: walls}, (_, i) => centerX + 29 + (totalDistance - 56) * (i + 1) / (walls + 1));

  const boundaries = [0, ...wallPositions, width];
  for (let section = 0; section < boundaries.length - 1; section += 1) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(boundaries[section], 0, boundaries[section + 1] - boundaries[section], height);
    ctx.clip();
    for (let radius = 20 + (time * .052) % 33; radius < width; radius += 33) {
      const opacity = Math.max(.08, .51 - radius / 920) * Math.pow(.59, section) * Math.min(1, (radius - 20) / 25);
      circle(centerX, centerY, radius, "rgba(218,251,119," + opacity + ")");
    }
    ctx.restore();
  }

  ctx.setLineDash([4, 5]);
  line(centerX, centerY, deviceX, centerY, "#989b77");
  ctx.setLineDash([]);
  const progress = (time % 1900) / 1900;
  const dotX = centerX + totalDistance * progress;
  const crossed = wallPositions.filter(x => dotX > x).length;
  const strength = Math.max(.16, Math.pow(.67, crossed) * (1 - progress * .30));
  circle(dotX, centerY, 4.5, `rgba(218,251,119,${strength})`, true);

  for (const x of wallPositions) {
    box(x - 5, centerY - 62, 10, 124, "#6c6587", "#a8a0c0", 3);
    for (let y = centerY - 53; y < centerY + 62; y += 13) line(x - 4, y, x + 4, y, "#9790af");
  }

  box(centerX - 24, centerY - 22, 48, 44, "#191e25", accent, 11);
  for (const radius of [6, 11, 16]) {
    ctx.beginPath();
    ctx.arc(centerX, centerY + 8, radius, -Math.PI * .77, -Math.PI * .23);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  circle(centerX, centerY + 8, 2.1, accent, true);
  label("Router", centerX, centerY + 44, accent);

  box(deviceX - 15, centerY - 24, 30, 48, "#252839", "#ecedff", 7);
  line(deviceX - 3, centerY + 16, deviceX + 3, centerY + 16, "#ecedff", 2);
  label("Device", deviceX, centerY + 44, "#ecedff");
}

function drawGps(time) {
  const accent = lessons.gps.accent;
  const count = states.gps.satellites;
  const sites = [[.31, .47], [.69, .47], [.54, .21]].map(([x, y]) => [width * x, height * y]);
  const target = [width * .51, height * .70];
  const alternate = [target[0], height * .94 - target[1]];
  const colors = ["#c2b1ff", "#aa8eff", "#e1d8ff"];

  sites.slice(0, count).forEach(([x, y], index) => {
    const radius = Math.hypot(x - target[0], y - target[1]);
    circle(x, y, radius, colors[index], false, 1.45);
    const phase = ((time + index * 490) % 1900) / 1900;
    circle(x, y, 18 + phase * 31, `rgba(194,177,255,${(1 - phase) * .65})`, false, 2);
    if (count === 3) {
      ctx.setLineDash([4, 6]);
      line(x, y, target[0], target[1], "#61577f");
      ctx.setLineDash([]);
      circle(x + (target[0] - x) * phase, y + (target[1] - y) * phase, 3.6, colors[index], true);
    }
  });

  sites.forEach(([x, y], index) => {
    const color = index < count ? colors[index] : "#707388";
    box(x - 14, y - 13, 28, 26, "#202138", color, 6);
    line(x - 7, y, x + 7, y, color, 2);
    line(x, y - 6, x, y + 6, color, 2);
    label("S" + (index + 1), x, y - 23, color);
  });

  if (count > 1) {
    const points = count === 2 ? [target, alternate] : [target];
    points.forEach(([x, y]) => {
      circle(x, y, 10, accent);
      circle(x, y, 5, "#f1eeff", true);
    });
    label(count === 3 ? "Location fix" : "Possible location", target[0], target[1] + 30, "#ecedff");
  }
}

function drawSound(time) {
  const {phase, volume} = states.sound;
  const angle = phase * Math.PI / 180;
  const level = volume / 100;
  const rows = [
    {name: "Incoming noise", color: "#c2b1ff", getWave: t => Math.sin(t)},
    {name: "Headphone wave", color: "#76e5ea", getWave: t => level * Math.sin(t + angle)},
    {name: "Combined sound", color: "#ffa6cb", getWave: t => Math.sin(t) + level * Math.sin(t + angle)}
  ];

  rows.forEach(({name, color, getWave}, index) => {
    const center = height * (.23 + index * .29);
    label(name, 20, center - height * .105, color, "left");
    line(20, center, width - 20, center, "#3d4057");
    ctx.beginPath();
    for (let x = 20; x <= width - 20; x += 2) {
      const t = (x - 20) / (width - 40) * Math.PI * 8 - (time % 7600) * Math.PI / 950;
      const y = center - getWave(t) * height * .063;
      if (x === 20) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();
  });
}

function updateAirfoil(angle) {
  const radians = angle * Math.PI / 180;
  const pivotX = 138, pivotY = 85, radius = 111;
  const endX = pivotX + radius * Math.cos(radians);
  const endY = pivotY - radius * Math.sin(radians);
  document.getElementById("foil-profile").setAttribute("transform", `rotate(${-angle} ${pivotX} ${pivotY})`);
  document.getElementById("foil-angle-arc").setAttribute("d", angle === 0 ? "" :
    `M ${pivotX + radius} ${pivotY} A ${radius} ${radius} 0 0 0 ${endX} ${endY}`);
  const label = document.getElementById("foil-angle-label");
  label.textContent = angle + "°";
  label.setAttribute("x", pivotX + 132 * Math.cos(radians * .5));
  label.setAttribute("y", pivotY - 132 * Math.sin(radians * .5) - 7);
  document.getElementById("airfoil-caption").textContent = "Wing cross-section at " + angle + " degrees to the oncoming air.";
}

function wingLift(angle) {
  return angle <= 15 ? .20 + .80 * angle / 15 : 1 - .55 * ((angle - 15) / 11) ** .75;
}

function drawWing(time) {
  const {angle} = states.wing;
  const lift = wingLift(angle);
  const cyan = lessons.wing.accent;
  const air = "#c2b1ff";
  const warm = "#ffae86";
  const centerX = width * .48, centerY = height * .315;
  const span = Math.min(240, width * .44);
  const rad = angle * Math.PI / 180;
  const stalled = angle > 15;
  const horizon = height * .49;
  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, "#0e1b37");
  sky.addColorStop(1, "#294669");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, horizon);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, width, horizon);
  ctx.clip();
  for (let i = 0; i < 8; i++) {
    const band = width + 160;
    const distance = time * (.009 + i % 3 * .008);
    const x = ((i * band / 7 - distance) % band + band) % band - 80;
    const y = horizon * (.24 + (i % 4) * .21);
    const cloud = 22 + i % 3 * 11;
    ctx.fillStyle = i % 2 ? "#819aba35" : "#bcd7f34a";
    ctx.beginPath();
    ctx.ellipse(x, y, cloud, 7, 0, 0, Math.PI * 2);
    ctx.ellipse(x + cloud * .18, y - 4, cloud * .38, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  function arrow(x, y, tipX, tipY, color) {
    line(x, y, tipX, tipY, color, 2);
    const a = Math.atan2(tipY - y, tipX - x);
    for (const delta of [-.55, .55]) {
      line(tipX, tipY, tipX - 8 * Math.cos(a + delta), tipY - 8 * Math.sin(a + delta), color, 2);
    }
  }
  const flowX = width * .92;
  label("Airflow", flowX, centerY - 13, air, "right");
  arrow(flowX, centerY, width * .75, centerY, air);
  ctx.setLineDash([4, 4]);
  line(centerX - span * .57, centerY, centerX + span * .61, centerY, "#a0b2ce");
  ctx.setLineDash([]);
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(-rad);
  ctx.scale(span / 220, span / 220);

  // Far wing, tail, and swept near wing frame the fuselage.
  function shape(points, fill) {
    ctx.beginPath();
    points.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }
  shape([[35,-4],[-22,-28],[-52,-30],[-17,-3]], "#81aedd");
  shape([[-67,-5],[-95,-35],[-109,-35],[-99,1]], "#63baca");
  ctx.beginPath();
  ctx.moveTo(-110, 2);
  ctx.quadraticCurveTo(-96, -9, -60, -10);
  ctx.lineTo(73,-10);
  ctx.quadraticCurveTo(101,-10,109,0);
  ctx.quadraticCurveTo(99,11,74,12);
  ctx.lineTo(-67,10);
  ctx.quadraticCurveTo(-99,8,-110,2);
  ctx.fillStyle = "#e6f2ff";
  ctx.fill();
  shape([[101,-4],[89,-8],[77,-8],[80,-2]], "#233f65");
  for (let x = -57; x <= 65; x += 10) {
    box(x,-5,4,4,"#49658e",null,1);
  }
  shape([[35,3],[-23,35],[-53,36],[-19,4]], "#76c5e1");
  box(-9,12,31,11,"#d6edff","#376089",5);
  line(-85,2,69,2,"#5193b8");
  ctx.restore();

  const arrowX = width * .19;
  const arrowTop = centerY - height * (.055 + .17 * lift);
  arrow(arrowX, centerY, arrowX, arrowTop, cyan);
  label("Lift", arrowX - 10, arrowTop + 5, cyan, "right");
  if (stalled) {
    const wake = centerX - span * .35;
    ctx.beginPath();
    ctx.moveTo(wake, centerY + 6);
    ctx.bezierCurveTo(wake - 10,centerY - 2,wake - 26,centerY + 21,wake - 49,centerY + 13);
    ctx.strokeStyle = warm;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  label(stalled ? "STALL · SEPARATED FLOW" : "FIXED AIRSPEED", width * .06, horizon - 8, stalled ? warm : "#e6efff", "left");

  const left = width * .10, right = width * .92;
  const top = height * .57, base = height - 35;
  const graphX = a => left + (right - left) * a / 26;
  const graphY = l => base - (base - top) * l;
  ctx.fillStyle = "rgba(255, 174, 134, .08)";
  ctx.fillRect(graphX(15), top, right - graphX(15), base - top);
  line(left, top, left, base, "#646a85");
  line(left, base, right, base, "#646a85");
  label("Relative lift", left, top - 10, "#c3c6dc", "left");
  label("Stall region", right - 4, top - 10, warm, "right");
  [0, 5, 10, 15, 20, 26].forEach(a => label(a + "°", graphX(a), base + 17));
  label("Angle of attack", (left + right) / 2, height - 3);
  ctx.beginPath();
  for (let i = 0; i <= 104; i++) {
    const a = i / 4;
    if (i === 0) ctx.moveTo(graphX(a), graphY(wingLift(a)));
    else ctx.lineTo(graphX(a), graphY(wingLift(a)));
  }
  ctx.strokeStyle = cyan;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  circle(graphX(angle), graphY(lift), 6, stalled ? warm : "#f5f5f8", true);
}

function draw(time) {
  const playing = motionEnabled();
  if (playing && lastFrame !== null) motionTimes[active] += Math.min(40, Math.max(0, time - lastFrame));
  lastFrame = time;
  const elapsed = motionTimes[active];
  ctx.clearRect(0, 0, width, height);
  byId[active].draw(elapsed);
  if (playing) animationFrame = requestAnimationFrame(draw);
}

advancedToggle.addEventListener("click", () => {
  advanced = !advanced;
  updateAdvanced(states[active]);
});
flightMotion.addEventListener("click", () => {
  motionPaused = !motionPaused;
  update();
});

const normalizeTopic = text => text.normalize("NFKC").toLowerCase().trim().replace(/\s+/g, " ");
const searchable = text => normalizeTopic(text).replace(/[^\p{L}\p{N}]+/gu," ").trim();
const matchesFor = query => {
  const words = searchable(query).split(" ").filter(Boolean);
  return catalog.filter(({id,name,keywords}) => {
    const haystack = searchable([name,keywords,lessons[id].title,lessons[id].summary].join(" "));
    return words.every(word => haystack.includes(word));
  });
};
function filterCatalog() {
  const query = normalizeTopic(search.value);
  const matches = matchesFor(query);
  demoList.replaceChildren(...matches.map(item => {
    const button = element("button");
    const icon = element("span", item.icon);
    icon.setAttribute("aria-hidden","true");
    button.className = "topic";
    button.type = "button";
    button.dataset.lesson = item.id;
    button.setAttribute("aria-pressed", String(active === item.id));
    button.append(icon, document.createTextNode(item.name));
    button.addEventListener("click", () => {
      if (location.hash !== "#"+item.slug) history.pushState(null, "", "#"+item.slug);
      selectLesson(item.id);
      document.getElementById("lesson-title").focus({preventScroll:true});
      document.getElementById("lesson-title").scrollIntoView({block:"nearest"});
    });
    return button;
  }));
  document.getElementById("demo-count").textContent = matches.length+" demo"+(matches.length===1?"":"s");
  empty.hidden = matches.length > 0;
  suggest.disabled = !query || pendingTopic !== null || suggested.has(query);
  suggestStatus.textContent = suggested.has(query) ? "Suggestion recorded. Thanks!" : "";
}
search.addEventListener("input", filterCatalog);
suggest.addEventListener("click", async () => {
  const query = normalizeTopic(search.value);
  if (pendingTopic || !query || suggested.has(query) || matchesFor(query).length) return;
  pendingTopic = query;
  suggest.disabled = true;
  suggestStatus.textContent = "Sending…";
  let status;
  try {
    const response = await fetch("/api/suggestions", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({topic:query})});
    if (response.ok) suggested.add(query);
    else status = response.status === 400 ? "Use a short topic with no links, email addresses, or personal details." : "Couldn’t save the suggestion. Try again in a moment.";
  } catch {
    status = "Couldn’t save the suggestion. Try again in a moment.";
  } finally {
    pendingTopic = null;
    filterCatalog();
    if (status && normalizeTopic(search.value) === query) suggestStatus.textContent = status;
  }
});
function lessonFromHash() {
  return catalog.find(item => "#"+item.slug === location.hash)?.id ?? "wifi";
}
window.addEventListener("hashchange", () => selectLesson(lessonFromHash()));
document.getElementById("reset").addEventListener("click", () => {
  states[active] = defaults(lessons[active]);
  selectLesson(active);
});
settings.addEventListener("submit", event => event.preventDefault());
mobile.addEventListener("change", resize);
reduceMotion.addEventListener("change", update);

filterCatalog();
selectLesson(lessonFromHash());
resize();
