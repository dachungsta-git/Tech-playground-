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
  },
  transistor: {
    title: "How does a transistor switch on?",
    summary: "Raise the gate voltage to form a channel in the silicon, then change the drain voltage to drive current through it.",
    image: "Cross-section of an n-channel MOSFET. An oxide layer insulates the gate above a channel between the source on the left and the drain on the right.",
    accent: "#ffd18b",
    legend: [["Gate and electric field", "#ffd18b"], ["Electrons and channel", "#7ff0dc"], ["Conventional current", "#ffa6cb"]],
    controls: [
      {key: "gate", label: "Gate voltage", min: 0, max: 3.3, initial: 0.8, step: 0.1, unit: " V"},
      {key: "drain", label: "Drain voltage", min: 0, max: 2, initial: 0.8, step: 0.1, unit: " V"}
    ],
    result: "Drain current (model)",
    explanations: [
      ["The gate acts without touching", "A thin oxide insulates the gate. A positive gate voltage creates an electric field that attracts electrons toward the silicon surface without sending them through the oxide."],
      ["The channel forms above threshold", "This nMOS transistor is normally off. Above the example threshold of 1.2 V, mobile electrons form a channel under the gate. Try 2.5 V to make it conduct strongly."],
      ["The drain voltage drives the flow", "Set the drain voltage to zero: the channel can still exist, but there is no net current. With a positive drain voltage, electrons move toward the drain. Conventional current points the opposite way."]
    ]
  },
  tube: {
    title: "How does a vacuum tube control current?",
    summary: "Heat the cathode to release electrons. Change the grid voltage and watch how many make it to the plate.",
    image: "Cutaway of a triode vacuum tube showing the heater and cathode on the left, a control grid in the middle, and the plate on the right. Moving dots represent electrons traveling toward the plate.",
    accent: "#ffb58d",
    legend: [["Heated cathode", "#ffb58d"], ["Control grid", "#d7b1ff"], ["Electrons", "#81f5e0"], ["Plate (anode)", "#f6d98e"]],
    controls: [
      {key: "heater", label: "Cathode heater", initial: true, kind: "toggle"},
      {key: "grid", label: "Grid voltage", min: -12, max: 0, initial: -2, step: 0.5, unit: " V"},
      {key: "plate", label: "Plate voltage", min: 0, max: 200, initial: 120, step: 5, unit: " V"}
    ],
    result: "Plate current (model)",
    explanations: [
      ["Heat frees electrons", "The heater warms a separate cathode surface. Some electrons have enough thermal energy to leave it, a process called thermionic emission. The glass envelope holds a vacuum so they can cross without colliding with air."],
      ["The grid regulates the flow", "The positive plate attracts electrons. A more negative grid repels them; make it negative enough and the plate current drops to zero in this model. Try −6 V with a 120 V plate, then raise the plate voltage."],
      ["A small change can control a larger current", "Change the grid by half a volt and compare the current. With a load and external power supply, this control can amplify a signal. This demo models steady current, not a complete amplifier."]
    ]
  },
  cpu: {
    title: "How does a CPU run a program?",
    summary: "Watch a tiny computer fetch, decode, and execute the instructions that turn 3 + 5 into 8.",
    result: "Program status",
    image: "",
    controls: [],
    legend: [],
    explanations: [
      ["Fetch finds the next instruction", "The program counter (PC) holds the next instruction address. The CPU copies that instruction from memory into its instruction register and advances the counter."],
      ["Decode tells the hardware what to do", "The control unit interprets the instruction. A load asks for a value from memory, an add tells the ALU to add register values, and a store writes a value back to memory."],
      ["Execute moves or changes a value", "Registers hold values close to the ALU. After the ALU adds 3 and 5, the result goes into R2. A separate store instruction copies it to memory."]
    ]
  },
  alu: {
    title: "Inside the ALU: how do bits add up?",
    summary: "Open up the CPU’s arithmetic logic unit (ALU). Four tiny adders turn 0011 + 0101 into 1000.",
    result: "", image: "", controls: [], legend: [],
    explanations: [
      ["Each stage adds three bits", "A full adder combines one bit from A, one from B, and any carry arriving from the previous place. Its two outputs are a sum bit and a carry to the next place."],
      ["A carry ripples to the next place", "Start with the 1s place. Two ones add to binary 10: write 0 in this place and send 1 along. Each later place uses the same rule."],
      ["Two flags, two interpretations", "Carry out means an unsigned result did not fit in four bits. Signed overflow means a two’s-complement result did not fit within −8 to +7. The same wires deliver both flags."]
    ]
  },
  memory: {
    title: "Why does a CPU need registers and memory?",
    summary: "Move a value from RAM into a register, change the register, and write the result back only when you choose.",
    result: "", image: "", controls: [], legend: [],
    explanations: [
      ["Registers keep active values close", "An ALU needs inputs and somewhere to put its answer. Registers give the CPU a small, fast place for values it is using right now."],
      ["A load makes a copy", "LOAD copies the value at a RAM address into a register. Both then hold equal values, but they remain independent."],
      ["A store writes back to memory", "ADD 5 updates only the chosen register. STORE copies its current value into the selected RAM slot, replacing whatever was there."]
    ]
  },
  cache: {
    title: "Why does a CPU use a cache?",
    summary: "Watch a small, fast cache remember RAM data. Change the address pattern to find a case where it keeps forgetting.",
    result: "", image: "", controls: [], legend: [],
    explanations: [
      ["A hit saves a trip to RAM", "If the requested address is already in the cache, the CPU can use its cached copy. Repeated reads are often faster once the cache has warmed up."],
      ["A miss fetches a copy", "If the cache has no matching copy, data comes from RAM. The cache saves it on the way back so the next read has a chance to hit."],
      ["Two addresses can fight over one line", "In this direct-mapped model, address 0 and address 2 both map to line 0 when there are two lines. Try Conflict, then increase the size to four and compare the second pass."]
    ]
  },
  pipeline: {
    title: "How does a CPU work ahead?",
    summary: "Overlap instructions, guess where a branch goes, and see what happens when that guess is wrong.",
    image: "Three-stage pipeline timeline", legend: [], controls: [], result: "",
    explanations: [
      ["Overlap improves throughput", "Fetch, decode, and execute can work on different instructions in the same cycle. An instruction still needs all three stages, but the CPU can finish instructions more frequently."],
      ["A branch changes what comes next", "This program branches if R0 is positive. The loaded 3 makes the branch taken, but the CPU can start fetching from a guessed route before the condition is evaluated."],
      ["Wrong-path work gets thrown away", "If the guess was wrong, younger instructions in fetch and decode are flushed and the CPU starts fetching from the correct address. Those discarded instructions never change this model’s registers or RAM."]
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
  {id:"wing", slug:"wings", name:"Airplane wings", icon:"✈", keywords:"flight aviation plane airfoil lift stall aerodynamics angle", draw:drawWing, read:wingReading, extras:"airfoil-inset", refresh:state => updateAirfoil(state.angle)},
  {id:"transistor", slug:"transistors", name:"Transistors", icon:"⊣", keywords:"MOSFET nMOS FET silicon electronics chip semiconductor gate switch CMOS source drain circuits", draw:drawTransistor, read:transistorReading},
  {id:"tube", slug:"vacuum-tubes", name:"Vacuum tube triode", icon:"◍", keywords:"electron valve thermionic emission vacuum tube cathode control grid plate anode amplifier historical electronics", draw:drawTube, read:tubeReading},
  {id:"cpu", slug:"cpu", name:"CPU Lab", icon:"▦", keywords:"processor central processing unit computer fetch decode execute instruction register datapath arithmetic logic ALU assembly", draw:() => {}, read:() => ({value:"",description:""})},
  {id:"alu", slug:"alu", name:"Inside the ALU", icon:"⊕", keywords:"CPU Lab binary addition adder ripple carry logic gates arithmetic signed overflow two complement full adder", draw:() => {}, read:() => ({value:"",description:""})},
  {id:"memory", slug:"memory", name:"Registers & memory", icon:"▤", keywords:"CPU Lab RAM random access register file load store address memory hierarchy datapath", draw:() => {}, read:() => ({value:"",description:""})},
  {id:"cache", slug:"cache", name:"CPU cache", icon:"▥", keywords:"CPU Lab cache l1 l2 direct mapped hit miss data spatial temporal locality eviction conflict ram memory hierarchy", draw:() => {}, read:() => ({value:"",description:""})},
  {id:"pipeline", slug:"pipeline", name:"Pipelines & branches", icon:"▧", keywords:"CPU Lab instruction pipeline pipelining branch prediction speculation flush throughput latency", draw:() => {}, read:() => ({value:"",description:""})}
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
  if (active === "cpu" && key !== "cpu") stopCpu();
  if (active === "alu" && key !== "alu") stopAlu();
  if (active === "cache" && key !== "cache") stopCache();
  if (active === "pipeline" && key !== "pipeline") stopPipeline();
  active = key;
  document.getElementById("standard-workbench").hidden = key === "cpu" || key === "alu" || key === "memory" || key === "cache" || key === "pipeline";
  document.getElementById("pipeline-workbench").hidden = key !== "pipeline";
  document.getElementById("cache-workbench").hidden = key !== "cache";
  document.getElementById("memory-workbench").hidden = key !== "memory";
  document.getElementById("alu-workbench").hidden = key !== "alu";
  document.getElementById("cpu-workbench").hidden = key !== "cpu";
  document.getElementById("device-comparison").hidden = key !== "tube" && key !== "transistor";
  document.getElementById("tube-to-transistor").hidden = key !== "tube";
  document.getElementById("transistor-to-tube").hidden = key !== "transistor";
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
    if (control.kind === "toggle") {
      field.className += " setting-toggle";
      Object.assign(input, {id:"control-"+control.key,name:control.key,type:"checkbox",checked:states[key][control.key]});
      label.htmlFor = input.id;
      const stateLabel = element("span",input.checked ? "On" : "Off");
      stateLabel.className = "toggle-state";
      stateLabel.setAttribute("aria-hidden","true");
      input.addEventListener("change",() => {
        states[key][control.key] = input.checked;
        stateLabel.textContent = input.checked ? "On" : "Off";
        update();
      });
      field.append(label,stateLabel,input);
      return field;
    }
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
  },
  transistor: {
    equation: "Vₒᵥ = VGS − VT (gate overdrive)",
    science: "The gate, oxide, and silicon act like a capacitor. A positive gate voltage can invert the p-type surface, making it electron-rich. When VDS reaches the overdrive, the channel pinches off near the drain, but current continues across the high-field region.",
    model: "Cutoff: ID = 0 for Vₒᵥ ≤ 0. Linear: ID = k(Vₒᵥ VDS − VDS²/2) for 0 ≤ VDS < Vₒᵥ. Saturation: ID = kVₒᵥ²/2 for VDS ≥ Vₒᵥ > 0.",
    live: state => {
      const {current, region, overdrive} = transistorModel(state);
      return `VGS = ${state.gate.toFixed(1)} V, VDS = ${state.drain.toFixed(1)} V, Vₒᵥ = ${overdrive.toFixed(1)} V → ${current.toFixed(2)} mA (${region})`;
    },
    limit: "This ideal long-channel model fixes the source and body at 0 V, VT at 1.2 V, and k at 2 mA/V². It ignores subthreshold leakage, channel-length modulation, and switching transients. The drawing is not to scale.",
    source: ["MIT OpenCourseWare: MOSFET drain-current model", "https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/resources/mit6_012f09_lec11_gradual/"]
  },
  tube: {
    equation: "Effective drive = Vgk + Vpk / μ",
    science: "Voltages are relative to the cathode. The plate attracts electrons; the grid sits closer to the cathode and strongly influences the electric field. In this model, lowering the grid by 1 V offsets a 20 V increase at the plate.",
    model: "Ip = K × max(0, effective drive)^(3/2), with heater on and Vpk > 0",
    live: state => {
      const {drive,current} = tubeModel(state);
      return "Drive = "+drive.toFixed(2)+" V · Plate current = "+current.toFixed(2)+" mA";
    },
    limit: "Illustrative parameters: μ = 20 and K = 0.4 mA/V^(3/2). This simplified space-charge model assumes instantaneous heating and sharp cutoff; it is not fitted to a real tube. It omits grid current, heater warm-up, and leakage. Positive grid bias is not simulated.",
    source: ["Norman Koren: triode equations and model limitations", "https://normankoren.com/Audio/Tubemodspice_article.html"]
  },
  cpu: {
    equation: "Fetch: IR ← Program[PC]; PC ← PC + 1",
    science: "The program counter (PC) selects an instruction. The instruction register (IR) holds it. The operation bits drive control signals that tell registers, memory, and the ALU what to do.",
    model: "8-bit toy encoding: 2 opcode bits + 6 operand bits",
    live: () => {
      const ir = cpuMachine.ir;
      return "Model ticks: " + cpuMachine.ticks + " · PC: " + cpuMachine.pc +
        " · IR: " + (ir === null ? "—" : cpuBits(cpuProgram[ir].word, 8).replace(/^(.{2})/, "$1 ")) +
        " · R2: " + cpuBits(cpuMachine.regs[2], 8);
    },
    limit: "One tick here means one teaching phase, not a real clock cycle. Program addresses count words. Our toy 8-bit encoding uses 00 LOAD, 01 ADD, 10 STORE, 11 HALT; LOAD and STORE use a 2-bit register and 4-bit data address, while ADD uses three 2-bit register fields. Data is unsigned; arithmetic wraps at 256. Real CPUs may overlap steps, use caches, or execute multiple instructions at once.",
    source: ["MIT OpenCourseWare: building a CPU datapath", "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c13/c13s1/"]
  },
  alu: {
    equation: "S = A ⊕ B ⊕ Cin;  Cout = (A ∧ B) ∨ ((A ⊕ B) ∧ Cin)",
    science: "⊕ means XOR, ∧ means AND, and ∨ means OR. A full adder generates a carry when both input bits are 1. When exactly one is 1, it propagates the incoming carry.",
    model: "Unsigned carry = C₄; signed overflow = C₃ ⊕ C₄",
    live: () => {
      if (!aluMachine.index) return "Step once to inspect a full adder’s actual inputs and outputs.";
      const r = aluModel(aluMachine.a,aluMachine.b).rows[aluMachine.index-1];
      return "Bit " + r.i + ": A=" + r.a + ", B=" + r.b + ", Cin=" + r.cin + " → S=" + r.sum + ", Cout=" + r.cout;
    },
    limit: "This four-bit ripple-carry adder visualizes only ADD. Chapter 1’s toy CPU uses eight bits. A full ALU also selects other operations, and real CPUs can compute carries in parallel instead of waiting for a ripple. The demo steps are not physical clock cycles.",
    source: ["MIT OpenCourseWare: addition and ALUs", "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c8/c8s1/"]
  },
  memory: {
    equation: "LOAD: R[r] ← RAM[a]     STORE: RAM[a] ← R[r]",
    science: "An address says where; a data signal carries the value; control tells the hardware to read or write. Registers live in the CPU datapath, so the ALU does not need to access main memory every time it uses a value.",
    model: "8-bit values: 0…255; two registers; three displayed RAM addresses",
    live: () => {
      const s = memoryLab;
      return "R"+s.reg+" = "+s.regs[s.reg]+" ("+cpuBits(s.regs[s.reg],8)+") · RAM["+s.dest+"] = "+
        s.ram[s.dest]+" ("+cpuBits(s.ram[s.dest],8)+")";
    },
    limit: "ADD uses the immediate operand 5 encoded in the teaching operation, not a read from RAM. Addition wraps modulo 256. One click commits one modeled operation; the moving pulse shows direction, not actual latency. Real processors use wider registers, calculate addresses, and usually read and write through caches and load/store buffers.",
    source: ["MIT OpenCourseWare: register files and the memory hierarchy", "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c14/c14s1/"]
  },
  cache: {
    equation: "line = address mod line count; tag = floor(address / line count)",
    science: "A direct-mapped cache checks just one line. A valid line with a matching tag is a hit; an empty line or a different tag is a miss. A miss copies the addressed data into that line, replacing an older tag if present.",
    model: "Average model access time = (1 × hits + 8 × misses) / reads",
    live: () => {
      const s = cacheLab;
      const n = s.records.length;
      return n ? "Average: " + (s.ticks/n).toFixed(2) + " model ticks per read ("+s.ticks+" / "+n+")." : "Step once to measure the model cost.";
    },
    limit: "Every cache line holds one data word. The 1 and 8 tick costs are illustrative total costs, not real latencies; every miss includes the lookup and the simulated RAM trip. Real processors may use several levels of cache, larger blocks, and multiple places to store a block.",
    source: ["MIT OpenCourseWare: caches and the memory hierarchy", "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c14/c14s1/"]
  },
  pipeline: {
    equation: "No overlap: 3N cycles · Ideal overlap: N + 2 cycles",
    science: "Pipelining increases throughput, not the three-cycle latency of one instruction in this model. Once the pipeline is full, up to one instruction finishes each cycle.",
    model: "Fetch → Decode → Execute/commit · branch resolves in Execute",
    live: () => "Model cycles: "+pipelineLab.cycle+" · instructions completed: "+pipelineLab.retired+
      " · discarded instructions: "+pipelineLab.discarded,
    limit: "The five committed instructions take 15 cycles without overlap and 7 cycles with a correct prediction. Waiting or a wrong guess takes 9 cycles here. The demo pairs execution with retirement, assumes single-cycle stages and no data, memory, or structural stalls, and uses fixed guesses. Real processors have more stages, hazards, and adaptive predictors.",
    source: ["MIT OpenCourseWare: Pipelining the Beta", "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c15/c15s1/"]
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

const transistorThreshold = 1.2;
const transistorK = 2;
function transistorModel({gate, drain}) {
  const overdrive = gate - transistorThreshold;
  if (overdrive <= 0) return {overdrive, current: 0, region: "cutoff"};
  const effectiveVds = Math.min(overdrive, drain);
  const current = transistorK * effectiveVds * (overdrive - effectiveVds / 2);
  // The slider uses tenths of a volt; tolerate binary rounding exactly at pinch-off.
  return {overdrive, current, region: drain + 1e-9 >= overdrive ? "saturation" : "linear"};
}

function transistorReading(state) {
  const {current, region} = transistorModel(state);
  const description = region === "cutoff" ? state.gate === transistorThreshold ?
    "At the 1.2 V threshold. Raise the gate another step to start conducting." :
    "Off. The gate voltage is below the 1.2 V threshold; no conducting channel is shown." :
    state.drain === 0 ? "Channel formed, but no net flow. Raise the drain voltage to move electrons." :
    region === "saturation" ? "On. The channel narrows near the drain, but electrons still reach it." :
    "On. Electrons move from source to drain; conventional current points back toward the source.";
  const value = current > 0 && current < 0.01 ? "<0.01 mA" : current.toFixed(2) + " mA";
  return {amount: current, maximum: transistorModel({gate:3.3,drain:2}).current, value, description};
}

const tubeMu = 20;
const tubeK = 0.4;
function tubeModel({heater,grid,plate}) {
  const drive = grid + plate / tubeMu;
  const current = heater && plate > 0 ? tubeK * Math.pow(Math.max(0,drive),1.5) : 0;
  return {drive,current};
}
function tubeReading(state) {
  const {current} = tubeModel(state);
  const value = current > 0 && current < 0.01 ? "<0.01 mA" : current.toFixed(2) + " mA";
  const description = !state.heater ? "Heater off. The cold cathode does not supply electrons in this model." :
    state.plate === 0 ? "The cathode emits electrons, but the plate has no positive voltage to draw a net current." :
    current === 0 ? "Cutoff. The negative grid stops net flow to the plate. Raise the grid voltage toward 0 V or increase the plate voltage." :
    "Electrons pass through gaps in the grid and reach the plate. Make the grid more negative to reduce plate current.";
  return {amount:current,maximum:tubeModel({heater:true,grid:0,plate:200}).current,value,description};
}

function update() {
  if (active === "cpu" || active === "alu" || active === "memory" || active === "cache" || active === "pipeline") {
    cancelAnimationFrame(animationFrame);
    lastFrame = null;
    if (active === "cpu") renderCpu();
    else if (active === "alu") renderAlu();
    else if (active === "memory") renderMemory();
    else if (active === "cache") renderCache();
    else renderPipeline();
    updateAdvanced();
    return;
  }
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

function drawTransistor(time) {
  const {gate, drain} = states.transistor;
  const {overdrive, current, region} = transistorModel({gate, drain});
  const isOn = region !== "cutoff";
  const flow = Math.sqrt(current / 4.4);
  const widthScale = width / 440;
  const heightScale = height / 262;
  const ink = "#e7eaff", muted = "#b7bcdd", amber = "#ffd18b", mint = "#7ff0dc", pink = "#ffa6cb";
  const sx = 109, dx = 331, y = 147;
  ctx.save();
  ctx.scale(widthScale, heightScale);

  // Electrical contacts, above the surface of the silicon.
  for (const [x, title, volts, color] of [[76, "Source", "0.0 V", ink], [220, "Gate", gate.toFixed(1) + " V", amber], [364, "Drain", drain.toFixed(1) + " V", ink]]) {
    label(title, x, 28, color);
    label(volts, x, 47, muted);
  }

  box(27, 141, 386, 64, "#22294d", "#666e9a", 10);
  box(44, 142, 72, 28, "#3d416e", "#929bd2", 3);
  box(324, 142, 72, 28, "#3d416e", "#929bd2", 3);
  label("n+", 80, 162, ink);
  label("n+", 360, 162, ink);
  label("p-type silicon", 220, 192, muted);

  // Metal gate and insulating oxide. The short animated lines depict field strength, not crossing charges.
  line(76, 56, 76, 140, "#929bd2", 3);
  line(364, 56, 364, 140, "#929bd2", 3);
  line(220, 56, 220, 85, amber, 3);
  box(138, 85, 164, 29, "#513d32", amber, 5);
  box(117, 126, 206, 14, "#735c73", "#e0c2d9", 3);
  label("Oxide insulator", 220, 137, ink);
  for (let i = 0; i < 5; i++) {
    const phase = (1 + Math.sin(time / 520 + i * 0.7)) / 2;
    const x = 156 + i * 32;
    if (gate > 0) {
      ctx.globalAlpha = Math.min(0.95, gate / 2) * (0.55 + phase * 0.45);
      label("+", x, 105, amber);
      line(x, 115, x, 125, amber, 1.4);
      ctx.globalAlpha = 1;
    }
  }

  if (isOn) {
    const atSource = 3 + 10 * Math.min(1, overdrive / 2.1);
    const pinch = region === "saturation" ? 14 : 0;
    const atDrain = region === "saturation" ? 1 : Math.max(2, atSource - 7 * drain / overdrive);
    ctx.beginPath();
    ctx.moveTo(sx, y - 4);
    ctx.lineTo(dx - pinch, y - 4);
    ctx.lineTo(dx - pinch, y + atDrain);
    ctx.lineTo(sx, y + atSource);
    ctx.closePath();
    ctx.fillStyle = "#39776f";
    ctx.fill();
    line(sx, y - 3, dx - pinch, y - 3, mint, 1.5);
    if (pinch) {
      ctx.setLineDash([2, 3]);
      line(dx - pinch, y - 3, dx, y - 3, mint, 1.3);
      ctx.setLineDash([]);
    }
    if (current > 0) {
      const dots = Math.ceil(2 + 8 * flow);
      for (let i = 0; i < dots; i++) {
        const t = (i / dots + time * (0.00022 + flow * 0.0007)) % 1;
        circle(sx + (dx - sx) * t, y + 1, 2.3, mint, true);
      }
    } else {
      for (let i = 1; i < 8; i++) circle(sx + i * (dx - sx) / 8, y + 1, 2.1, mint, true);
    }
  } else {
    ctx.setLineDash([3, 5]);
    line(sx + 15, y + 1, dx - 15, y + 1, "#737aab", 1.2);
    ctx.setLineDash([]);
    label("No channel", 220, 172, muted);
  }

  if (current > 0) {
    label("Electrons  →", 116, 228, mint);
    label("←  Conventional current", 310, 228, pink);
  } else {
    label(isOn ? "Channel formed · no net flow" : gate === transistorThreshold ? "At threshold · 1.2 V" : "Off · below 1.2 V threshold", 220, 228, isOn ? mint : amber);
  }
  ctx.restore();
}

function drawTube(time) {
  const state = states.tube;
  const {current} = tubeModel(state);
  const ratio = current/tubeModel({heater:true,grid:0,plate:200}).current;
  const warm = "#ffb58d", grid = "#d7b1ff", mint = "#81f5e0", gold = "#f6d98e", muted = "#bbc1d8";
  ctx.save();
  ctx.scale(width/440,height/262);

  // Cutaway of the envelope; the 2-D cross section is illustrative, not a physical trajectory.
  box(31,60,378,147,"#172232","#536d87",32);
  label("GLASS ENVELOPE · VACUUM INSIDE",220,198,"#8d9ab3");
  for (const [x,title,value,color] of [
    [98,"Cathode",state.heater?"Heater on":"Heater off",warm],
    [211,"Control grid",state.grid.toFixed(1)+" V",grid],
    [340,"Plate (anode)",state.plate+" V",gold]
  ]) {
    label(title,x,22,color);
    label(value,x,41,muted);
    line(x,47,x,78,color,1.5);
  }
  line(98,78,98,179,state.heater?warm:"#667289",8);
  line(340,78,340,179,state.plate>0?gold:"#667289",8);
  line(211,78,211,179,"#665280",1);
  for (let y=86;y<=176;y+=15) circle(211,y,3.8,grid,true);

  // Separate heater element behind the cathode.
  ctx.save();
  if (state.heater) {ctx.shadowColor=warm;ctx.shadowBlur=11;}
  ctx.beginPath();ctx.moveTo(70,165);
  for (let i=0;i<=7;i++) ctx.lineTo(i%2?82:70,155-i*9.5);
  ctx.strokeStyle=state.heater?"#ff8f70":"#626a7b";ctx.lineWidth=2.8;ctx.stroke();
  ctx.restore();

  if (current > 0) {
    const density=3+Math.round(26*Math.sqrt(ratio));
    const speed=.00036+.00075*Math.sqrt(ratio);
    for (let i=0;i<density;i++) {
      const t=(i*.61803398875+time*speed)%1;
      const band=i%6;
      const y=93+band*15+Math.sin(t*3.14)*(band-2.5)*.75;
      ctx.globalAlpha=.62+.35*Math.sin(t*Math.PI);
      circle(105+229*t,y,2.5,mint,true);
    }
    ctx.globalAlpha=1;
    label("Electrons →",118,228,mint);
    label("← Conventional current",302,228,gold);
  } else if (state.heater) {
    for (let i=0;i<10;i++) {
      const t=(i*.618+time*.00048)%1;
      ctx.globalAlpha=.35+.4*Math.sin(t*Math.PI);
      circle(106+24*Math.sin(Math.PI*t),83+i*9,2.1,mint,true);
    }
    ctx.globalAlpha=1;
    label(state.plate===0?"No positive plate voltage":"Grid cutoff · no plate current",220,228,grid);
  } else {
    label("Heater off · no electron emission",220,228,muted);
  }
  ctx.restore();
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

// The lesson uses a simplified, word-addressed CPU with separate program and data views.
const cpuProgram = [
  {op:"LOAD", dst:0, addr:0, word:0b00000000, text:"LOAD R0, [A]"},
  {op:"LOAD", dst:1, addr:1, word:0b00010001, text:"LOAD R1, [B]"},
  {op:"ADD", dst:2, x:0, y:1, word:0b01100001, text:"ADD R2, R0, R1"},
  {op:"STORE", src:2, addr:2, word:0b10100010, text:"STORE [OUT], R2"},
  {op:"HALT", word:0b11000000, text:"HALT"}
];
const cpuAddresses = ["A","B","OUT"];
const cpuBits = (value, width) => value.toString(2).padStart(width,"0");
const initialCpu = () => ({
  pc:0, ir:null, next:"fetch", stage:null, regs:[0,0,0], memory:[3,5,null],
  alu:"Waiting for ADD", ticks:0, halted:false, path:"", blocks:[],
  title:"Ready to fetch", detail:"Press Step to fetch the first LOAD, or Run to watch all three phases repeat."
});
function tickCpu(previous) {
  if (previous.halted) return previous;
  const s = {...previous, regs:[...previous.regs], memory:[...previous.memory],
    ticks:previous.ticks+1, stage:previous.next, path:"", blocks:[]};
  if (s.stage === "fetch") {
    s.ir = s.pc++;
    s.next = "decode";
    s.path = "in";
    s.blocks = ["control"];
    s.title = "Fetch · instruction " + (s.ir + 1) + " of " + cpuProgram.length;
    s.detail = "Read " + cpuProgram[s.ir].text + " from program address " + s.ir +
      " into the instruction register. The PC advances to " + s.pc + ".";
  } else {
    const op = cpuProgram[s.ir];
    if (s.stage === "decode") {
      s.next = "execute";
      s.blocks = ["control"];
      s.title = "Decode · " + op.op;
      s.detail = {
        LOAD:"The control unit selects a memory read and a write to register R" + op.dst + ".",
        ADD:"The control unit selects addition and tells the ALU to use R0 and R1.",
        STORE:"The control unit selects a register read and a write to data memory.",
        HALT:"The control unit recognizes that the program is finished."
      }[op.op];
    } else {
      s.next = "fetch";
      s.title = "Execute · " + op.op;
      if (op.op === "LOAD") {
        s.regs[op.dst] = s.memory[op.addr];
        s.path = "in";
        s.blocks = ["register"];
        s.detail = "Copy " + s.memory[op.addr] + " from [" + cpuAddresses[op.addr] + "] into R" + op.dst + ".";
      } else if (op.op === "ADD") {
        const x = s.regs[op.x], y = s.regs[op.y];
        s.regs[op.dst] = (x + y) & 255;
        s.alu = x + " + " + y + " = " + s.regs[op.dst];
        s.blocks = ["register","alu"];
        s.detail = "The ALU adds " + x + " and " + y + ", then writes " + s.regs[op.dst] + " into R" + op.dst + ".";
      } else if (op.op === "STORE") {
        s.memory[op.addr] = s.regs[op.src];
        s.path = "out";
        s.blocks = ["register"];
        s.detail = "Copy " + s.regs[op.src] + " from R" + op.src + " into memory [" + cpuAddresses[op.addr] + "].";
      } else {
        s.halted = true;
        s.blocks = ["control"];
        s.title = "Halted · program complete";
        s.detail = "Memory [OUT] now holds " + s.memory[2] + ". Reset to run the program again.";
      }
    }
  }
  return s;
}
let cpuMachine = initialCpu();
let cpuTimer = null;
function stopCpu() {
  if (cpuTimer !== null) clearTimeout(cpuTimer);
  cpuTimer = null;
}
function takeCpuStep() {
  if (active !== "cpu") return;
  cpuMachine = tickCpu(cpuMachine);
  if (cpuMachine.halted) stopCpu();
  update();
}
function autoCpu() {
  takeCpuStep();
  if (cpuMachine.halted || active !== "cpu") return;
  cpuTimer = setTimeout(autoCpu, 1050);
}
function cpuPairs(id, pairs) {
  document.getElementById(id).replaceChildren(...pairs.map(([key,value]) => {
    const row = element("div");
    row.append(element("dt",key),element("dd",String(value)));
    return row;
  }));
}
function renderCpu() {
  const s = cpuMachine;
  document.getElementById("cpu-status-title").textContent = s.title;
  document.getElementById("cpu-status-note").textContent = s.detail;
  for (const stage of ["fetch","decode","execute"]) {
    const item = document.getElementById("cpu-stage-"+stage);
    item.setAttribute("aria-current", stage === s.stage ? "step" : "false");
  }
  for (const block of ["control","register","alu"]) {
    document.getElementById("cpu-"+block+"-block").dataset.active = String(s.blocks.includes(block));
  }
  const workbench = document.getElementById("cpu-workbench");
  workbench.dataset.path = s.path;
  if (workbench.dataset.tick !== String(s.ticks)) {
    workbench.dataset.tick = String(s.ticks);
    document.getElementById("cpu-bridge").replaceChildren(element("span"));
  }
  document.getElementById("cpu-step").disabled = s.halted || cpuTimer !== null;
  const run = document.getElementById("cpu-run");
  run.disabled = s.halted;
  run.textContent = cpuTimer === null ? "Run" : "Pause";
  document.getElementById("cpu-program").replaceChildren(...cpuProgram.map((entry,index) => {
    const row = element("li");
    row.append(element("span",String(index)),element("code",entry.text));
    row.setAttribute("aria-current",s.ir === index ? "step" : "false");
    return row;
  }));
  cpuPairs("cpu-data",s.memory.map((value,index) => [cpuAddresses[index],value ?? "—"]));
  cpuPairs("cpu-control-values",[["PC",s.pc],["IR",s.ir === null ? "—" : cpuProgram[s.ir].text]]);
  cpuPairs("cpu-registers",s.regs.map((value,index) => ["R"+index,value]));
  document.getElementById("cpu-alu").textContent = s.alu;
}
document.getElementById("cpu-step").addEventListener("click",takeCpuStep);
document.getElementById("cpu-run").addEventListener("click",() => {
  if (cpuMachine.halted) return;
  if (cpuTimer !== null) {
    stopCpu();
    renderCpu();
  } else {
    cpuTimer = setTimeout(autoCpu, 1050);
    takeCpuStep();
  }
});
document.getElementById("cpu-reset").addEventListener("click",() => {
  stopCpu();
  cpuMachine = initialCpu();
  update();
});

// Four full adders operate from the least-significant bit upward.
const aluWidth = 4;
const aluSigned = value => value >= 8 ? value - 16 : value;
const aluBits = value => value.toString(2).padStart(aluWidth,"0");
function aluModel(a,b) {
  const rows = [];
  let cin = 0, stored = 0;
  for (let i=0; i<aluWidth; i++) {
    const ai = (a >> i) & 1, bi = (b >> i) & 1;
    const sum = ai ^ bi ^ cin;
    const cout = (ai & bi) | ((ai ^ bi) & cin);
    rows.push({i,a:ai,b:bi,cin,sum,cout});
    stored |= sum << i;
    cin = cout;
  }
  return {rows,stored,carry:cin,overflow:rows[3].cin ^ cin};
}
let aluMachine = {a:3,b:5,index:0};
let aluTimer = null;
let aluCells = null;
function stopAlu() {
  if (aluTimer !== null) clearTimeout(aluTimer);
  aluTimer = null;
}
function setAlu(a,b) {
  stopAlu();
  aluMachine = {a,b,index:0};
  update();
}
function takeAluStep() {
  if (active !== "alu" || aluMachine.index >= aluWidth) return;
  aluMachine.index++;
  if (aluMachine.index === aluWidth) stopAlu();
  update();
}
function autoAlu() {
  takeAluStep();
  if (active === "alu" && aluMachine.index < aluWidth) aluTimer = setTimeout(autoAlu,1000);
}
function makeAluCells() {
  const cells = [];
  for (let i=0; i<aluWidth; i++) {
    const card = element("li");
    card.className = "alu-cell";
    card.append(element("h4",(1<<i)+"s place"));
    const buttons = element("div");
    buttons.className = "alu-bit-buttons";
    const inputs = {};
    for (const key of ["a","b"]) {
      const button = element("button");
      button.type = "button";
      button.className = "mode-button alu-bit";
      button.setAttribute("aria-label",key.toUpperCase()+" bit "+i+" ("+(1<<i)+"s place)");
      button.addEventListener("click",() => {
        setAlu(aluMachine.a ^ (key==="a" ? 1<<i : 0),aluMachine.b ^ (key==="b" ? 1<<i : 0));
      });
      inputs[key] = button;
      buttons.append(button);
    }
    card.append(buttons);
    const outputs = element("dl");
    outputs.className = "cpu-values alu-values";
    const fields = {};
    for (const [field,label] of [["cin","Carry in"],["sum","Sum bit"],["cout","Carry out"]]) {
      const row = element("div");
      fields[field] = element("dd","—");
      row.append(element("dt",label),fields[field]);
      outputs.append(row);
    }
    card.append(outputs);
    const connector = element("span");
    connector.className = "alu-connector";
    connector.setAttribute("aria-hidden","true");
    if (i<aluWidth-1) card.append(connector);
    cells.push({card,inputs,fields,connector});
  }
  document.getElementById("alu-chain").replaceChildren(...cells.map(c=>c.card));
  return cells;
}
function renderAlu() {
  const {a,b,index} = aluMachine;
  const {rows,stored,carry,overflow} = aluModel(a,b);
  const finished = index === aluWidth;
  const latest = index ? rows[index-1] : null;
  const get = id => document.getElementById("alu-"+id);
  get("number-a").textContent = aluBits(a)+" ("+a+")";
  get("number-b").textContent = aluBits(b)+" ("+b+")";
  get("step").disabled = finished || aluTimer !== null;
  get("run").textContent = aluTimer === null ? (finished ? "Run again" : "Run") : "Pause";
  get("status-title").textContent = finished ? "Complete · "+a+" + "+b+" = "+(a+b) :
    index ? "Bit "+latest.i+" complete · "+index+" of "+aluWidth : "Ready at the 1s place";
  get("status-note").textContent = !latest ? "The first carry in is always 0. Use Step to solve one bit or Run to follow the ripple." :
    latest.a+" + "+latest.b+" + "+latest.cin+" (carry in) writes "+latest.sum+
      (finished ? " and produces a final carry of "+latest.cout+"." : " and sends "+latest.cout+" to the next place.");
  aluCells ??= makeAluCells();
  for (const row of rows) {
    const {card,inputs,fields,connector} = aluCells[row.i];
    const done = row.i < index;
    const current = row.i === index-1;
    card.dataset.active = String(current);
    card.dataset.done = String(done);
    for (const key of ["a","b"]) {
      inputs[key].textContent = key.toUpperCase()+" "+row[key];
      inputs[key].setAttribute("aria-pressed",String(row[key]===1));
    }
    for (const key of ["cin","sum","cout"]) {
      fields[key].textContent = done || (key==="cin" && row.i===index) ? String(row[key]) : "—";
    }
    const pulse = current && row.cout===1;
    if (connector.dataset.pulse !== String(pulse)) {
      connector.dataset.pulse = String(pulse);
      connector.replaceChildren(element("i"));
    }
    connector.dataset.carried = String(done && row.cout===1);
  }
  get("sum").textContent = finished ? aluBits(stored)+" ("+stored+")" : "—";
  get("carry").textContent = finished ? String(carry) : "—";
  get("overflow").textContent = finished ? (overflow ? "Yes" : "No") : "—";
  get("flags-note").textContent = finished ?
    (carry ? "Unsigned: "+(a+b)+" exceeds 15. The extra 1 is carried out. " : "Unsigned: "+(a+b)+" fits in four bits. ")+
    "Signed: "+aluSigned(a)+" + ("+aluSigned(b)+") = "+(aluSigned(a)+aluSigned(b))+
    (overflow ? " is outside −8 to +7; the stored bits read as "+aluSigned(stored)+"." : " fits within −8 to +7.") :
    "Flags appear after the final bit. The values in parentheses above are unsigned.";
}
document.getElementById("alu-step").addEventListener("click",takeAluStep);
document.getElementById("alu-run").addEventListener("click",() => {
  if (aluTimer !== null) {
    stopAlu();
    renderAlu();
  } else {
    if (aluMachine.index === aluWidth) aluMachine.index = 0;
    aluTimer = setTimeout(autoAlu,1000);
    takeAluStep();
  }
});
document.getElementById("alu-reset").addEventListener("click",() => setAlu(3,5));
document.getElementById("alu-example-carry").addEventListener("click",() => setAlu(15,1));
document.getElementById("alu-example-overflow").addEventListener("click",() => setAlu(7,1));

const memoryAddress = ["[A]","[B]","[OUT]"];
const initialMemory = () => ({regs:[0,0],ram:[3,5,0],reg:0,source:0,dest:2,steps:0,op:"",from:null,to:null,alu:"Waiting for ADD 5",
  title:"Ready · LOAD [A] into R0",detail:"RAM already holds 3 and 5. Start by copying the 3 to the CPU."});
let memoryLab = initialMemory();
function memoryOperation(previous,op) {
  const s = {...previous, regs:[...previous.regs], ram:[...previous.ram], steps:previous.steps+1, op};
  const register = "R"+s.reg;
  if (op === "load") {
    const address = memoryAddress[s.source], value = s.ram[s.source];
    s.regs[s.reg] = value;
    s.from = address;
    s.to = register;
    s.title = "LOAD · "+address+" → "+register;
    s.detail = "Copied "+value+" into "+register+". The value in RAM "+address+" is unchanged.";
  } else if (op === "add") {
    const before = s.regs[s.reg], after = (before+5)&255;
    s.regs[s.reg] = after;
    s.from = s.to = register;
    s.alu = before+" + 5 = "+after;
    if (before+5>255) s.alu += " (wrapped to 8 bits)";
    s.title = "ADD 5 · "+register+" → ALU → "+register;
    s.detail = register+" now holds "+after+". The ALU worked inside the CPU, so no RAM slot changed.";
  } else if (op === "store") {
    const address = memoryAddress[s.dest], value = s.regs[s.reg], old = s.ram[s.dest];
    s.ram[s.dest] = value;
    s.from = register;
    s.to = address;
    s.title = "STORE · "+register+" → "+address;
    s.detail = "Wrote "+value+" to RAM "+address+" (was "+old+"). "+register+" still holds "+value+".";
  }
  return s;
}
function renderMemory() {
  const s = memoryLab;
  const get = id => document.getElementById("memory-"+id);
  get("status-title").textContent = s.title;
  get("status-note").textContent = s.detail;
  get("source").value = String(s.source);
  get("register").value = String(s.reg);
  get("destination").value = String(s.dest);
  const removeMotion = reduceMotion.matches;
  const b = get("workbench");
  b.dataset.path = s.op === "load" ? "in" : s.op === "store" ? "out" : "";
  if (b.dataset.step !== String(s.steps)) {
    b.dataset.step = String(s.steps);
    get("bridge").replaceChildren(...(b.dataset.path && !removeMotion ? [element("span")] : []));
  }
  cpuPairs("memory-ram-values",s.ram.map((value,i) => [memoryAddress[i]+" · "+i,value]));
  cpuPairs("memory-reg-values",s.regs.map((value,i) => ["R"+i,value]));
  function flagRows(id,names) {
    [...get(id).children].forEach((row,i) => {
      row.dataset.from = String(names[i]===s.from);
      row.dataset.to = String(names[i]===s.to);
    });
  }
  flagRows("ram-values",memoryAddress);
  flagRows("reg-values",["R0","R1"]);
  get("alu-block").dataset.active = String(s.op==="add");
  get("alu-result").textContent = s.alu;
}
for (const [id,key] of [["source","source"],["register","reg"],["destination","dest"]]) {
  const control = document.getElementById("memory-"+id);
  control.addEventListener("change",() => {
    const value=Number(control.value), max=key==="reg" ? 1 : 2;
    if (Number.isInteger(value) && value>=0 && value<=max) {
      memoryLab = {...memoryLab, [key]:value};
      updateAdvanced();
    }
  });
}
for (const op of ["load","add","store"]) {
  document.getElementById("memory-"+op).addEventListener("click",() => {
    memoryLab = memoryOperation(memoryLab,op);
    update();
  });
}
document.getElementById("memory-reset").addEventListener("click",() => {
  memoryLab = initialMemory();
  update();
});

// Model a read-only, direct-mapped cache. Addresses and lines each hold one word.
const cacheWords = [3,5,8,13];
const cachePatterns = {reuse:[0,1,0,1], conflict:[0,2,0,2]};
const initialCache = (pattern="reuse",size=2) => ({
  pattern,size,lines:Array(size).fill(null),records:[],hits:0,misses:0,ticks:0
});
let cacheLab = initialCache();
let cacheTimer = null;
function cacheAccess(previous) {
  const n = previous.records.length, pattern = cachePatterns[previous.pattern];
  if (n >= pattern.length*2) return previous;
  const address = pattern[n%pattern.length], line = address%previous.size, tag = Math.floor(address/previous.size);
  const prior = previous.lines[line], hit = prior !== null && prior.tag === tag;
  const value = hit ? prior.value : cacheWords[address];
  const evicted = !hit && prior !== null ? prior.address : null;
  const lines = [...previous.lines];
  if (!hit) lines[line] = {address,tag,value};
  return {...previous,lines,hit,records:[...previous.records,{address,line,tag,value,hit,evicted}],
    hits:previous.hits+Number(hit),misses:previous.misses+Number(!hit),ticks:previous.ticks+(hit?1:8)};
}
function stopCache() {
  if (cacheTimer !== null) clearTimeout(cacheTimer);
  cacheTimer = null;
}
function cacheStep() {
  if (active !== "cache") return;
  cacheLab = cacheAccess(cacheLab);
  if (cacheLab.records.length===8) stopCache();
  update();
}
function cacheAuto() {
  cacheStep();
  if (active === "cache" && cacheLab.records.length<8) cacheTimer=setTimeout(cacheAuto,1150);
}
function cacheRestart(pattern=cacheLab.pattern,size=cacheLab.size) {
  stopCache();
  cacheLab=initialCache(pattern,size);
  update();
}
function renderCache() {
  const get=id=>document.getElementById("cache-"+id);
  const s=cacheLab, n=s.records.length, latest=s.records[n-1], pass2=s.records.slice(4);
  const finished = n===8;
  get("pattern").value=s.pattern;
  get("size").value=String(s.size);
  get("step").disabled=finished || cacheTimer!==null;
  get("run").disabled=finished;
  get("run").textContent=cacheTimer===null ? "Run" : "Pause";
  get("hits").textContent=String(s.hits);
  get("misses").textContent=String(s.misses);
  get("rate").textContent=pass2.length ? Math.round(100*pass2.filter(r=>r.hit).length/pass2.length)+"%" : "—";
  get("ticks").textContent=String(s.ticks);
  get("cpu-value").textContent=latest ? "Received "+latest.value : "Waiting to read";
  get("title").textContent=latest ?
    (latest.hit?"HIT":"MISS")+" · Address "+latest.address+(finished?" · Two passes complete":"") :
    "Ready · Cache is empty";
  get("note").textContent=latest ?
    (latest.hit?"Line "+latest.line+" already held this address. The CPU got "+latest.value+" from cache (1 model tick).":
      "RAM returned "+latest.value+". Line "+latest.line+(latest.evicted===null?" was empty.":" evicted address "+latest.evicted+".")+" This read cost 8 model ticks.") :
    "Step through the reads or Run both passes. Changing either option starts with an empty cache.";
  const workbench=get("workbench");
  workbench.dataset.path=latest ? (latest.hit?"hit":"miss") : "";
  if (workbench.dataset.access!==String(n)) {
    workbench.dataset.access=String(n);
    // A fresh, one-shot pulse represents the returned data, not simulated time.
    const wires=[get("wire-near"),get("wire-far")];
    for (const wire of wires) wire.replaceChildren(...(latest && !reduceMotion.matches?[element("span")]:[]));
  }
  cpuPairs("cache-lines",s.lines.map((entry,index)=>["Line "+index,entry ? "@"+entry.address+" = "+entry.value : "Empty"]));
  cpuPairs("cache-ram",cacheWords.map((value,index)=>["@"+index,value]));
  [...get("lines").children].forEach((row,index)=>row.dataset.active=String(latest?.line===index));
  [...get("ram").children].forEach((row,index)=>row.dataset.active=String(latest && !latest.hit && latest.address===index));
  for (let pass=0;pass<2;pass++) {
    get("pass-"+(pass+1)).replaceChildren(...cachePatterns[s.pattern].map((address,i)=>{
      const index=pass*4+i, record=s.records[index], item=element("li");
      item.append(element("span","@"+address),element("small",record?(record.hit?"Hit":"Miss"):"Pending"));
      item.dataset.result=record?(record.hit?"hit":"miss"):"pending";
      if (n>0 && index===n-1) item.setAttribute("aria-current","step");
      return item;
    }));
  }
}
document.getElementById("cache-step").addEventListener("click",cacheStep);
document.getElementById("cache-reset").addEventListener("click",()=>cacheRestart());
document.getElementById("cache-run").addEventListener("click",()=>{
  if (cacheTimer!==null) { stopCache(); renderCache(); }
  else if (cacheLab.records.length<8) { cacheTimer=setTimeout(cacheAuto,1150); cacheStep(); }
});
document.getElementById("cache-pattern").addEventListener("change",event=>{
  if (Object.hasOwn(cachePatterns,event.target.value)) cacheRestart(event.target.value);
});
document.getElementById("cache-size").addEventListener("change",event=>{
  const size=Number(event.target.value);
  if (size===2 || size===4) cacheRestart(cacheLab.pattern,size);
});

const pipelineOps = [
  {label:"LOAD [A]", note:"R0 gets 3 from RAM."},
  {label:"BRANCH if R0 > 0"},
  {label:"ADD 99", note:"Fall-through adds 99."},
  {label:"STORE [OUT]", note:"Fall-through writes its result."},
  {label:"ADD 5", note:"The target adds 5 to R0."},
  {label:"STORE [OUT]", note:"RAM [OUT] gets the result."},
  {label:"FINISH", note:"The program is complete."}
];
// The fall-through route terminates after its STORE. The taken route ends at FINISH.
const pipelineStages = ["Fetch","Decode","Execute"];
function pipelineInitial(mode="overlap", prediction="fall") {
  return {mode,prediction,cycle:0,unit:[null,null,null],pc:0,history:[],retired:0,discarded:0,
    r0:0,out:0,done:false,title:"Ready to fetch",note:"Step to see how work moves through the three stages."};
}
let pipelineLab = pipelineInitial();
let pipelineTimer = null;
function pipelineCycle(previous) {
  if (previous.done) return previous;
  const [f,d] = previous.unit;
  const s = {...previous,cycle:previous.cycle+1,title:"",note:""};
  const serial = s.mode === "serial";
  const e = d;
  let fetch = !serial || (f === null && d === null);
  if (s.pc === null) fetch = false;
  const newFetch = fetch ? s.pc : null;
  if (fetch) {
    if (s.pc === 1) s.pc = serial || s.prediction === "wait" ? null : s.prediction === "taken" ? 4 : 2;
    else if (s.pc === 3 || s.pc === 6) s.pc = null;
    else s.pc++;
  }
  const displayed = [newFetch,f,e];
  s.unit = [...displayed];
  const flushed = [false,false,false];
  if (e !== null) {
    s.retired++;
    s.title = pipelineOps[e].label + " finished";
    s.note = pipelineOps[e].note;
    if (e === 0) s.r0 = 3;
    if (e === 2) s.r0 += 99;
    if (e === 4) s.r0 += 5;
    if (e === 3 || e === 5) s.out = s.r0;
    if (e === 3 || e === 6) s.done = true;
    if (e === 1) {
      const taken = s.r0 > 0;
      const target = taken ? 4 : 2;
      const waited = serial || s.prediction === "wait";
      const right = s.prediction === (taken ? "taken" : "fall");
      if (waited) {
        s.pc = target;
        s.title = "Branch taken · fetch can resume";
        s.note = "R0 is positive. No speculative instructions were started.";
      } else if (!right) {
        flushed[0] = displayed[0] !== null;
        flushed[1] = displayed[1] !== null;
        s.discarded += Number(flushed[0])+Number(flushed[1]);
        s.unit[0] = s.unit[1] = null;
        s.pc = target;
        s.title = "Wrong guess · pipeline flushed";
        s.note = "R0 is positive. The younger ADD 99 and STORE were discarded. R0 and RAM [OUT] stay unchanged.";
      } else {
        s.title = "Correct guess · keep going";
        s.note = "R0 is positive and the CPU guessed taken, so the in-flight instructions can continue.";
      }
    }
  } else if (newFetch === null && f === null) {
    s.title = "Waiting for work";
    s.note = "There is nothing to execute this cycle.";
  } else {
    s.title = newFetch === null ? "Instruction decoding" : pipelineOps[newFetch].label+" fetched";
    s.note = "Fetch gets the instruction. Decode works out what it means.";
  }
  s.history = [...previous.history,{cycle:s.cycle,stages:displayed,flushed}];
  return s;
}
function stopPipeline() {
  if (pipelineTimer !== null) clearTimeout(pipelineTimer);
  pipelineTimer = null;
}
function pipelineCell(id,flushed) {
  return id === null ? "—" : pipelineOps[id].label+(flushed ? " · FLUSHED" : "");
}
function renderPipeline() {
  const s = pipelineLab;
  const get = id => document.getElementById("pipeline-"+id);
  get("mode").value = s.mode;
  get("prediction").value = s.prediction;
  get("prediction").disabled = s.mode === "serial";
  get("status-title").textContent = s.title;
  get("status-note").textContent = s.note;
  get("step").disabled = s.done || pipelineTimer !== null;
  get("run").disabled = s.done;
  get("run").textContent = pipelineTimer === null ? "Run" : "Pause";
  const row = s.history[s.history.length-1];
  get("stages").replaceChildren(...pipelineStages.map((name,i) => {
    const card = element("div");
    const id = row?.stages[i] ?? null;
    card.dataset.state = row?.flushed[i] ? "flushed" : id === null ? "empty" : "active";
    card.append(element("h4",name),element("p",pipelineCell(id,row?.flushed[i])));
    return card;
  }));
  cpuPairs("pipeline-counts", [["Cycles",s.cycle],["Completed",s.retired],["Flushed",s.discarded],["Committed R0",s.r0],["RAM [OUT]",s.out]]);
  get("history").replaceChildren(...[...s.history].reverse().map(r => {
    const tr = element("tr");
    const th = element("th",r.cycle);
    th.setAttribute("scope","row");
    tr.append(th,...r.stages.map((id,i) => {
      const td = element("td",pipelineCell(id,r.flushed[i]));
      if (r.flushed[i]) td.dataset.state = "flushed";
      return td;
    }));
    return tr;
  }));
}
function pipelineTick() {
  pipelineLab = pipelineCycle(pipelineLab);
  if (pipelineLab.done) stopPipeline();
  update();
}
function autoPipeline() {
  pipelineTick();
  if (!pipelineLab.done && active === "pipeline") pipelineTimer = setTimeout(autoPipeline,850);
}
function resetPipeline(mode,prediction) {
  stopPipeline();
  pipelineLab = pipelineInitial(mode,prediction);
  update();
}
document.getElementById("pipeline-step").addEventListener("click",pipelineTick);
document.getElementById("pipeline-run").addEventListener("click",() => {
  if (pipelineTimer !== null) { stopPipeline(); update(); return; }
  if (pipelineLab.done) return;
  pipelineTimer = setTimeout(autoPipeline,850);
  pipelineTick();
});
document.getElementById("pipeline-reset").addEventListener("click",() => resetPipeline(pipelineLab.mode,pipelineLab.prediction));
document.getElementById("pipeline-mode").addEventListener("change",event => resetPipeline(event.target.value,pipelineLab.prediction));
document.getElementById("pipeline-prediction").addEventListener("change",event => resetPipeline(pipelineLab.mode,event.target.value));

// Move focus to the new lesson after explicit in-series navigation.
const cpuChapterLinks = {
  "cpu-roadmap-alu":"alu",
  "cpu-go-memory":"memory",
  "cpu-go-cache":"cache",
  "cpu-go-pipeline":"pipeline",
  "alu-go-cpu":"cpu",
  "alu-go-memory":"memory",
  "alu-go-cache":"cache",
  "alu-go-pipeline":"pipeline",
  "memory-go-cpu":"cpu",
  "memory-go-alu":"alu",
  "memory-go-cache":"cache",
  "memory-go-pipeline":"pipeline",
  "cache-go-cpu":"cpu",
  "cache-go-alu":"alu",
  "cache-go-memory":"memory",
  "cache-go-pipeline":"pipeline",
  "pipeline-go-cpu":"cpu",
  "pipeline-go-alu":"alu",
  "pipeline-go-memory":"memory",
  "pipeline-go-cache":"cache",
  "cpu-go-alu":"alu",
  "tube-to-transistor":"transistor",
  "transistor-to-tube":"tube"
};
for (const [id,key] of Object.entries(cpuChapterLinks)) {
  document.getElementById(id).addEventListener("click",event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0) return;
    event.preventDefault();
    const hash = "#" + byId[key].slug;
    if (location.hash !== hash) history.pushState(null,"",hash);
    selectLesson(key);
    const heading = document.getElementById("lesson-title");
    heading.focus({preventScroll:true});
    heading.scrollIntoView({block:"nearest"});
  });
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
