const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

class Input {
  constructor(id, type) {
    this.id = id;
    this.type = type;
    this.value = "";
    this.checked = false;
    this.attributes = {};
    this.listeners = {};
  }

  get valueAsNumber() {
    return this.value === "" ? NaN : Number(this.value);
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  addEventListener(type, listener, capture = false) {
    const listeners = this.listeners[type] ?? [];
    if (capture) listeners.unshift(listener);
    else listeners.push(listener);
    this.listeners[type] = listeners;
  }

  dispatch(type) {
    for (const listener of this.listeners[type] ?? []) listener();
  }
}

function openPage(values = new Map()) {
  const gear = new Input("blue-gear", "checkbox");
  const unlocked = new Input("human-unlocked", "checkbox");
  const human = new Input("human-stage", "number");
  const shark = new Input("shark-stage", "number");
  const draco = new Input("draco-stage", "number");
  const selector = new Input("gear-race", "select-one");
  const warning = { textContent: "" };
  const panels = Object.fromEntries(["human", "shark", "draco"].map((race) => {
    const blue = new Input(`${race}-blue-gears`, "number");
    const red = new Input(`${race}-red-gears`, "number");
    const final = new Input(`${race}-final-gear`, "checkbox");
    blue.value = red.value = "0";
    const fields = { disabled: true };
    const lock = { textContent: "" };
    const warning = { textContent: "" };
    const element = {
      dataset: { race },
      hidden: true,
      querySelector: (query) => ({
        fieldset: fields, ".gear-lock": lock, ".gear-warning": warning,
        ".gear-blue": blue, ".gear-red": red,
      })[query],
    };
    return [race, { blue, red, final, fields, lock, warning, element }];
  }));
  const inputs = [
    gear, unlocked, human, shark, draco,
    ...Object.values(panels).flatMap(({ blue, red, final }) => [blue, red, final]),
  ];
  const document = {
    querySelector: (selector) => ({
      "#blue-gear": gear,
      "#race-limit-warning": warning,
      "#gear-race": raceSelector,
    })[selector],
    querySelectorAll: (selector) => ({
      input: inputs,
      ".race-stage": [human, shark, draco],
      ".gear-panel": Object.values(panels).map((panel) => panel.element),
    })[selector],
  };
  const raceSelector = selector;
  const localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const context = vm.createContext({
    document, localStorage, location: { pathname: "/pages/races.html" }, console,
  });
  for (const filename of ["scripts.js", "races.js"]) {
    vm.runInContext(readFileSync(path.join(__dirname, "../scripts", filename), "utf8"), context);
  }
  return { gear, unlocked, human, shark, draco, selector, panels, warning };
}

test("versions are limited to whole numbers and version 4 requires Blue Gear", () => {
  const values = new Map();
  let page = openPage(values);
  assert.equal(page.human.max, "3");
  page.human.value = "4";
  page.human.dispatch("input");
  assert.equal(page.human.value, "3");
  assert.match(page.warning.textContent, /1 to 3/);
  assert.equal(values.get("bloxfruits-tracker:/pages/races.html:human-stage"), "3");
  page.human.value = "0";
  page.human.dispatch("input");
  assert.equal(page.human.value, "1");
  page.human.value = "2.5";
  page.human.dispatch("input");
  assert.equal(page.human.value, "2");

  page.gear.checked = true;
  page.gear.dispatch("change");
  page.unlocked.checked = true;
  page.unlocked.dispatch("change");
  page.human.value = "4";
  page.human.dispatch("input");
  page = openPage(values);
  assert.equal(page.gear.checked, true);
  assert.equal(page.unlocked.checked, true);
  assert.equal(page.human.value, "4");
  assert.equal(page.human.max, "4");
});

test("removing Blue Gear preserves version 4 and shows a warning", () => {
  const values = new Map();
  let page = openPage(values);
  page.gear.checked = true;
  page.gear.dispatch("change");
  page.human.value = "4";
  page.human.dispatch("input");
  page.gear.checked = false;
  page.gear.dispatch("change");
  assert.equal(page.human.value, "4");
  assert.equal(page.human.attributes["aria-invalid"], "true");
  assert.match(page.warning.textContent, /preserved/);

  page = openPage(values);
  assert.equal(page.human.value, "4");
  assert.equal(page.human.max, "3");
  assert.match(page.warning.textContent, /preserved/);
  page.gear.checked = true;
  page.gear.dispatch("change");
  assert.equal(page.human.value, "4");
  assert.equal(page.human.attributes["aria-invalid"], undefined);
  assert.equal(page.warning.textContent, "");
});

test("gear choices are gated, limited and saved separately for each race", () => {
  const values = new Map();
  let page = openPage(values);
  page.selector.value = "human";
  page.selector.dispatch("change");
  assert.equal(page.panels.human.element.hidden, false);
  assert.equal(page.panels.human.fields.disabled, true);

  page.gear.checked = true;
  page.gear.dispatch("change");
  page.human.value = "4";
  page.human.dispatch("input");
  assert.equal(page.panels.human.fields.disabled, false);
  page.panels.human.blue.value = "2";
  page.panels.human.blue.dispatch("input");
  page.panels.human.red.value = "2";
  page.panels.human.red.dispatch("input");
  assert.equal(page.panels.human.red.value, "1");
  assert.match(page.panels.human.warning.textContent, /three ability gears/);
  page.panels.human.final.checked = true;
  page.panels.human.final.dispatch("change");
  page.human.value = "3";
  page.human.dispatch("input");
  assert.equal(page.panels.human.fields.disabled, true);

  page = openPage(values);
  page.selector.value = "human";
  page.selector.dispatch("change");
  assert.equal(page.panels.human.fields.disabled, true);
  assert.equal(page.panels.human.blue.value, "2");
  assert.equal(page.panels.human.red.value, "1");
  assert.equal(page.panels.human.final.checked, true);
  assert.equal(page.panels.shark.blue.value, "0");
  page.human.value = "4";
  page.human.dispatch("input");
  assert.equal(page.panels.human.fields.disabled, false);
  page.gear.checked = false;
  page.gear.dispatch("change");
  assert.equal(page.panels.human.fields.disabled, true);
  assert.equal(page.panels.human.blue.value, "2");
  page.gear.checked = true;
  page.gear.dispatch("change");
  assert.equal(page.panels.human.fields.disabled, false);
});

test("Draco can reach V4 and track embers without Mirage Blue Gear", () => {
  const page = openPage();
  page.selector.value = "draco";
  page.selector.dispatch("change");
  assert.equal(page.draco.max, "4");
  page.draco.value = "4";
  page.draco.dispatch("input");
  assert.equal(page.draco.value, "4");
  assert.equal(page.panels.draco.fields.disabled, false);
  assert.equal(page.warning.textContent, "");
});
