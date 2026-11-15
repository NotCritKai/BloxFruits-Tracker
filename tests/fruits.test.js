const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

class Element extends EventTarget {
  constructor(type = "") {
    super();
    this.type = type;
    this.id = "";
    this.value = "";
    this.disabled = false;
    this.hidden = false;
    this.textContent = "";
    this.children = [];
    this.attributes = {};
  }

  get valueAsNumber() {
    return this.value === "" ? NaN : Number(this.value);
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  removeAttribute(name) {
    delete this.attributes[name];
    if (name === "max") this.max = "";
  }

  append(...children) {
    this.children.push(...children);
  }
}

const prefix = "bloxfruits-tracker:/pages/fruits.html:";

function openPage(values = new Map(), animate = () => ({ finished: Promise.resolve(), cancel() {} })) {
  const elements = {
    "#fruit-storages": new Element("number"),
    "#fruit-list": new Element(),
    "#rarity-nav": new Element(),
    "#fruit-save-error": new Element(),
    "#fruit-limit-warning": new Element(),
  };
  elements["#fruit-storages"].id = "fruit-storages";
  const document = {
    querySelector: (selector) => elements[selector],
    querySelectorAll: () => [elements["#fruit-storages"]],
    createElement: () => Object.assign(new Element(), { animate }),
  };
  const localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const context = vm.createContext({
    document, localStorage, location: { pathname: "/pages/fruits.html" }, Event, console,
    matchMedia: () => ({ matches: false }),
  });
  for (const filename of ["scripts.js", "fruits.js"]) {
    vm.runInContext(readFileSync(path.join(__dirname, "../scripts", filename), "utf8"), context);
  }
  return elements;
}

function changeInput(element, value, event = "input") {
  element.value = value;
  element.dispatchEvent(new Event(event));
}

function fruit(page, name) {
  const rows = page["#fruit-list"].children.flatMap((section) => section.children[1].children);
  const row = rows.find((item) => item.children[0].textContent === name);
  assert.ok(row, `Missing fruit: ${name}`);
  return row.children[1];
}

test("quantities start at zero and persist within the storage limit", () => {
  const values = new Map();
  let page = openPage(values);
  assert.equal(page["#fruit-list"].children.reduce((count, section) => count + section.children[1].children.length, 0), 42);
  assert.equal(fruit(page, "Dragon").value, "0");
  assert.equal(fruit(page, "Dragon").disabled, true);

  changeInput(page["#fruit-storages"], "3");
  changeInput(fruit(page, "Dragon"), "9");
  assert.equal(fruit(page, "Dragon").value, "3");
  changeInput(fruit(page, "Ice"), "-1");
  assert.equal(fruit(page, "Ice").value, "0");
  changeInput(fruit(page, "Magma"), "2");
  page = openPage(values);
  assert.equal(fruit(page, "Dragon").value, "3");
  assert.equal(fruit(page, "Magma").value, "2");
  changeInput(fruit(page, "Magma"), "", "change");
  assert.equal(fruit(page, "Magma").value, "0");
  assert.equal(fruit(openPage(values), "Magma").value, "0");
});

test("fruits are grouped by rarity in dealer order", () => {
  const page = openPage();
  const groups = page["#fruit-list"].children.map((section) => ({
    rarity: section.children[0].textContent,
    fruits: section.children[1].children.map((row) => row.children[0].textContent),
  }));
  assert.deepEqual(groups, [
    { rarity: "Common", fruits: ["Rocket", "Spin", "Blade", "Spring", "Bomb", "Smoke", "Spike"] },
    { rarity: "Uncommon", fruits: ["Flame", "Ice", "Sand", "Dark", "Eagle", "Diamond"] },
    { rarity: "Rare", fruits: ["Light", "Rubber", "Ghost", "Magma"] },
    { rarity: "Legendary", fruits: ["Quake", "Buddha", "Love", "Creation", "Spider", "Sound", "Phoenix", "Portal", "Lightning", "Pain", "Blizzard"] },
    { rarity: "Mythical", fruits: ["Gravity", "Mammoth", "T-Rex", "Dough", "Shadow", "Venom", "Gas", "Spirit", "Tiger", "Yeti", "Magnet", "Kitsune", "Control", "Dragon"] },
  ]);
});

test("rarity selection waits for retreat before revealing the latest choice", async () => {
  const animations = [];
  const page = openPage(new Map(), (frames, options) => {
    let finish;
    const finished = new Promise((resolve) => { finish = resolve; });
    animations.push({ frames, options, finish });
    return { finished, cancel() {} };
  });
  const buttons = page["#rarity-nav"].children;
  const groups = page["#fruit-list"].children;
  assert.deepEqual(buttons.map((button) => button.textContent), groups.map((group) => group.children[0].textContent));
  assert.ok(groups.every((group) => group.hidden));

  buttons[0].dispatchEvent(new Event("click"));
  assert.equal(groups[0].hidden, false);
  assert.ok(groups.slice(1).every((group) => group.hidden));
  assert.ok(animations[0].options.delay < animations[7].options.delay);
  buttons[1].dispatchEvent(new Event("click"));
  animations.splice(0).forEach((animation) => animation.finish());
  await new Promise(setImmediate);
  assert.equal(groups[0].hidden, false);
  assert.equal(groups[1].hidden, true);
  assert.ok(animations[0].options.delay > animations[7].options.delay);

  buttons[2].dispatchEvent(new Event("click"));
  animations.splice(0).forEach((animation) => animation.finish());
  await new Promise(setImmediate);
  assert.equal(groups[0].hidden, true);
  assert.equal(groups[1].hidden, true);
  assert.equal(groups[2].hidden, false);
  assert.equal(buttons[2].attributes["aria-pressed"], "true");
  animations.splice(0).forEach((animation) => animation.finish());
});

test("switching rarities keeps entered quantities", async () => {
  const page = openPage();
  const buttons = page["#rarity-nav"].children;
  changeInput(page["#fruit-storages"], "3");
  buttons[0].dispatchEvent(new Event("click"));
  await new Promise(setImmediate);
  changeInput(fruit(page, "Rocket"), "2");
  buttons[1].dispatchEvent(new Event("click"));
  await new Promise(setImmediate);
  buttons[0].dispatchEvent(new Event("click"));
  await new Promise(setImmediate);
  assert.equal(fruit(page, "Rocket").value, "2");
  assert.equal(page["#fruit-list"].children[0].hidden, false);
});

test("changing storage preserves saved quantities and warns when over the limit", () => {
  const values = new Map();
  let page = openPage(values);
  changeInput(page["#fruit-storages"], "12");
  changeInput(fruit(page, "Dragon"), "10");
  changeInput(fruit(page, "Ice"), "11");
  changeInput(page["#fruit-storages"], "1");
  assert.equal(fruit(page, "Dragon").value, "10");
  assert.equal(fruit(page, "Ice").value, "11");
  assert.match(page["#fruit-limit-warning"].textContent, /exceed/);

  page = openPage(values);
  assert.equal(fruit(page, "Dragon").value, "10");
  assert.equal(fruit(page, "Ice").value, "11");
  changeInput(page["#fruit-storages"], "15");
  assert.equal(page["#fruit-limit-warning"].textContent, "");
});

test("earlier entries are imported only when they match uniquely", () => {
  const oldRows = JSON.stringify([
    { name: "Ice", quantity: "2" },
    { name: "ice fruit", quantity: "3" },
    { name: "T Rex", quantity: "5" },
    { name: "Unknown", quantity: "6" },
  ]);
  const values = new Map([
    [`${prefix}fruit-name`, "Dragon Fruit"],
    [`${prefix}fruit-quantity`, "4"],
    [`${prefix}extra-fruits`, oldRows],
  ]);
  const page = openPage(values);
  assert.equal(fruit(page, "Dragon").value, "4");
  assert.equal(fruit(page, "T-Rex").value, "5");
  assert.equal(fruit(page, "Ice").value, "0");
  const legacy = [
    { name: "Unknown", quantity: "6" },
    { name: "Ice", quantity: "2" },
    { name: "ice fruit", quantity: "3" },
  ];
  assert.deepEqual(JSON.parse(values.get(`${prefix}fruit-inventory`)).legacy, legacy);
  assert.equal(values.get(`${prefix}fruit-name`), "Dragon Fruit");
  assert.equal(values.get(`${prefix}fruit-quantity`), "4");
  assert.equal(values.get(`${prefix}extra-fruits`), oldRows);
  changeInput(page["#fruit-storages"], "10");
  changeInput(fruit(page, "Dragon"), "6");
  assert.deepEqual(JSON.parse(values.get(`${prefix}fruit-inventory`)).legacy, legacy);
  assert.equal(fruit(openPage(values), "Dragon").value, "6");
});

test("invalid saved inventory is reported and never overwritten", () => {
  const values = new Map([[`${prefix}fruit-inventory`, "{invalid"]]);
  const page = openPage(values);
  assert.match(page["#fruit-save-error"].textContent, /will not be saved/);
  changeInput(page["#fruit-storages"], "3");
  changeInput(fruit(page, "Dragon"), "2");
  assert.equal(values.get(`${prefix}fruit-inventory`), "{invalid");
});
