const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function openPage(values, race = "human") {
  const inputs = [];
  const document = new EventTarget();

  class Element extends EventTarget {
    constructor(tag) {
      super();
      this.tag = tag;
      this.children = [];
      this.dataset = {};
      this.attributes = {};
      this.classList = { add: () => {} };
      this.value = "";
      this.type = "";
      this.name = "";
      this.id = "";
      this._checked = false;
      this.hidden = false;
      this.textContent = "";
    }

    get checked() { return this._checked; }
    set checked(value) {
      if (value && this.type === "radio") {
        inputs.filter((input) => input !== this && input.type === "radio" && input.name === this.name)
          .forEach((input) => { input._checked = false; });
      }
      this._checked = value;
    }
    get valueAsNumber() { return this.value === "" ? NaN : Number(this.value); }
    get tagName() { return this.tag.toUpperCase(); }
    get nextElementSibling() {
      const siblings = this.parentElement?.children ?? [];
      return siblings[siblings.indexOf(this) + 1] ?? null;
    }
    setAttribute(name, value) { this.attributes[name] = value; }
    removeAttribute(name) { delete this.attributes[name]; }
    append(...children) {
      for (const child of children) {
        if (child.parentElement) child.parentElement.children = child.parentElement.children.filter((item) => item !== child);
        child.parentElement = this;
        this.children.push(child);
      }
    }
    insertBefore(child, reference) {
      child.parentElement = this;
      const index = this.children.indexOf(reference);
      this.children.splice(index < 0 ? this.children.length : index, 0, child);
    }
    before(child) { this.parentElement.insertBefore(child, this); }
    after(child) {
      const siblings = this.parentElement.children;
      this.parentElement.insertBefore(child, siblings[siblings.indexOf(this) + 1] ?? null);
    }
    closest(tag) { return this.parentElement?.tag === tag ? this.parentElement : null; }
    querySelector(selector) {
      return this.children.flatMap((child) => [child, ...child.descendants()]).find((child) =>
        selector === "fieldset" ? child.tag === "fieldset" :
          selector === 'input[type="checkbox"]' ? child.tag === "input" && child.type === "checkbox" :
            selector === '[data-tier="1"]' ? child.dataset.tier === "1" :
              selector === '[data-tier="2"]' ? child.dataset.tier === "2" :
            child.className === selector.slice(1)) ?? null;
    }
    descendants() { return this.children.flatMap((child) => [child, ...child.descendants()]); }
  }

  document.createElement = (tag) => {
    const element = new Element(tag);
    if (tag === "input") inputs.push(element);
    return element;
  };
  document.createElementNS = (_namespace, tag) => document.createElement(tag);
  document.createTextNode = (text) => Object.assign(new Element("text"), { textContent: text });

  const panel = document.createElement("section");
  panel.dataset.race = race;
  const fields = document.createElement("fieldset");
  const blueLabel = document.createElement("label");
  const redLabel = document.createElement("label");
  const finalLabel = document.createElement("label");
  const blue = document.createElement("input");
  const red = document.createElement("input");
  const final = document.createElement("input");
  Object.assign(blue, { id: `${race}-blue-gears`, type: "number", value: "0", className: "gear-blue" });
  Object.assign(red, { id: `${race}-red-gears`, type: "number", value: "0", className: "gear-red" });
  Object.assign(final, { id: `${race}-final-gear`, type: "checkbox" });
  blueLabel.textContent = "Blue - Limit Break";
  redLabel.textContent = "Red - Psycho";
  blueLabel.append(blue);
  redLabel.append(red);
  finalLabel.append(final);
  const warning = Object.assign(document.createElement("p"), { className: "gear-warning" });
  const blueDescription = document.createElement("p");
  const redDescription = document.createElement("p");
  for (const [description, color] of [[blueDescription, "Blue"], [redDescription, "Red"]]) {
    for (const tier of ["1", "2"]) {
      const span = document.createElement("span");
      span.dataset.tier = tier;
      span.textContent = `${color} tier ${tier} effects`;
      description.append(span);
    }
  }
  fields.append(document.createElement("legend"), blueLabel, blueDescription, redLabel, redDescription, finalLabel, warning);
  panel.append(fields);
  document.querySelectorAll = (selector) => selector === ".gear-panel" ? [panel] : inputs;
  const localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const context = vm.createContext({
    document, localStorage, location: { pathname: "/pages/races.html" }, Event, HTMLElement: Element, console,
  });
  for (const filename of ["gear-graph.js", "scripts.js"]) {
    vm.runInContext(readFileSync(path.join(__dirname, "../scripts", filename), "utf8"), context);
  }
  document.dispatchEvent(new Event("DOMContentLoaded"));
  return { inputs, panel, blue, red, blueDescription, redDescription };
}

test("the gear graph migrates counts, limits colors, and saves each slot", () => {
  const prefix = "bloxfruits-tracker:/pages/races.html:";
  const values = new Map([
    [`${prefix}human-blue-gears`, "2"],
    [`${prefix}human-red-gears`, "1"],
  ]);
  let page = openPage(values);
  const input = (id) => page.inputs.find((item) => item.id === id);
  assert.equal(input("human-gear-slot-2-blue").checked, true);
  assert.equal(input("human-gear-slot-3-blue").checked, true);
  assert.equal(input("human-gear-slot-4-red").checked, true);
  assert.equal(input("human-gear-slot-4-blue").disabled, true);
  assert.equal(input("human-gear-slot-4-blue").parentElement.parentElement.querySelector(".gear-option-limit").hidden, false);
  assert.equal(input("human-gear-slot-4-blue").parentElement.parentElement.querySelector(".gear-option-description").hidden, true);

  input("human-gear-slot-2-red").checked = true;
  input("human-gear-slot-2-red").dispatchEvent(new Event("change"));
  assert.equal(page.blue.value, "1");
  assert.equal(page.red.value, "2");
  const blueOption = input("human-gear-slot-4-blue").parentElement.parentElement;
  assert.equal(blueOption.querySelector(".gear-option-description").hidden, false);
  assert.equal(blueOption.querySelector(".gear-option-description").textContent, "Blue tier 2 effects");
  assert.equal(blueOption.querySelector(".gear-option-limit").hidden, true);
  page = openPage(values);
  assert.equal(input("human-gear-slot-2-red").checked, true);
  assert.equal(input("human-gear-slot-3-blue").checked, true);
  assert.equal(input("human-gear-slot-4-red").checked, true);
});

test("invalid saved counts remain editable until they can be migrated", () => {
  const prefix = "bloxfruits-tracker:/pages/races.html:";
  const values = new Map([
    [`${prefix}human-blue-gears`, "3"],
    [`${prefix}human-red-gears`, "1"],
  ]);
  const page = openPage(values);
  assert.equal(page.blue.value, "3");
  assert.equal(page.blue.parentElement.hidden, false);
  assert.equal(page.blueDescription.hidden, false);
  assert.equal(page.panel.querySelector(".gear-sequence-status").hidden, true);
  assert.match(page.panel.querySelector(".gear-warning").textContent, /Adjust/);
  assert.equal(values.get(`${prefix}human-blue-gears`), "3");

  page.blue.value = "2";
  page.blue.dispatchEvent(new Event("change"));
  assert.equal(page.blue.parentElement.hidden, true);
  assert.equal(page.blueDescription.hidden, true);
  assert.equal(page.panel.querySelector(".gear-sequence-status").hidden, false);
  assert.equal(page.inputs.find((input) => input.id === "human-gear-slot-2-blue").checked, true);
  assert.equal(page.inputs.find((input) => input.id === "human-gear-slot-4-red").checked, true);
});

test("each gear choice shows its ability description when opened", () => {
  const page = openPage(new Map());
  const graph = page.panel.querySelector(".gear-graph");
  const choices = page.panel.querySelector(".gear-choices");
  const firstSlot = graph.querySelector(".gear-node gear-slot gear-slot-2");
  firstSlot.dispatchEvent(new Event("click"));
  assert.equal(choices.hidden, false);
  const blue = page.inputs.find((input) => input.id === "human-gear-slot-2-blue");
  const red = page.inputs.find((input) => input.id === "human-gear-slot-2-red");
  for (const [input, text] of [[blue, "Blue tier 1 effects"], [red, "Red tier 1 effects"]]) {
    const detail = input.parentElement.parentElement.querySelector(".gear-option-description");
    assert.equal(detail.textContent, text);
    assert.match(input.attributes["aria-describedby"], new RegExp(detail.id));
  }
  assert.equal(page.blueDescription.hidden, true);
  assert.equal(page.redDescription.hidden, true);
});

test("gears unlock in order and later selections survive clearing an earlier gear", () => {
  const values = new Map();
  let page = openPage(values);
  const input = (id) => page.inputs.find((item) => item.id === `human-${id}`);
  const slot = (number) => page.panel.querySelector(`.gear-node gear-slot gear-slot-${number}`);
  const select = (number, color) => {
    input(`gear-slot-${number}-${color}`).checked = true;
    input(`gear-slot-${number}-${color}`).dispatchEvent(new Event("change"));
  };
  assert.equal(slot(2).disabled, false);
  assert.equal(slot(3).disabled, true);
  assert.equal(slot(4).disabled, true);
  assert.equal(input("final-gear").disabled, true);

  select(2, "blue");
  assert.equal(slot(3).disabled, false);
  assert.equal(slot(4).disabled, true);
  const blueDetail = input("gear-slot-3-blue").parentElement.parentElement.querySelector(".gear-option-description");
  const redDetail = input("gear-slot-3-red").parentElement.parentElement.querySelector(".gear-option-description");
  assert.equal(blueDetail.textContent, "Blue tier 2 effects");
  assert.equal(redDetail.textContent, "Red tier 1 effects");
  select(3, "red");
  select(4, "blue");
  assert.equal(input("final-gear").disabled, false);
  input("final-gear").checked = true;
  input("final-gear").dispatchEvent(new Event("change"));

  select(2, "none");
  assert.equal(slot(3).disabled, true);
  assert.equal(slot(4).disabled, true);
  assert.equal(input("final-gear").disabled, true);
  assert.equal(input("gear-slot-3-red").checked, true);
  page = openPage(values);
  assert.equal(slot(3).disabled, true);
  assert.equal(input("gear-slot-4-blue").checked, true);
  assert.equal(input("final-gear").checked, true);
  select(2, "red");
  assert.equal(slot(3).disabled, false);
  assert.equal(slot(4).disabled, false);
  assert.equal(input("final-gear").disabled, false);
  assert.equal(redDetail.textContent, "Red tier 1 effects");
  const restoredRedDetail = input("gear-slot-3-red").parentElement.parentElement.querySelector(".gear-option-description");
  assert.equal(restoredRedDetail.textContent, "Red tier 2 effects");
});

test("training progress persists and invalid values are reported", () => {
  const values = new Map();
  let page = openPage(values);
  let input = page.inputs.find((item) => item.id === "human-training-3-2");
  input.value = "2";
  input.dispatchEvent(new Event("input"));

  page = openPage(values);
  input = page.inputs.find((item) => item.id === "human-training-3-2");
  assert.equal(input.value, "2");
  input.value = "4.5";
  input.dispatchEvent(new Event("input"));
  assert.equal(input.attributes["aria-invalid"], "true");
  assert.match(input.parentElement.parentElement.querySelector(".training-error").textContent, /whole number from 0 to 4/);
  input.value = "4";
  input.dispatchEvent(new Event("input"));
  assert.equal(input.attributes["aria-invalid"], undefined);
});

test("training remaining and unpaid fragments update independently per race", () => {
  const values = new Map();
  let page = openPage(values);
  const input = (id) => page.inputs.find((item) => item.id === `human-${id}`);
  const remaining = () => page.panel.descendants().filter((element) => element.className === "training-remaining");
  const fragments = () => page.panel.querySelector(".training-fragments").textContent;
  assert.equal(remaining()[0].textContent, "3 minutes left");
  assert.equal(remaining()[2].textContent, "12 full activations left");
  assert.equal(fragments(), "26,750 Fragments remaining");

  input("training-1-1").value = "0.5";
  input("training-1-1").dispatchEvent(new Event("input"));
  input("training-3-2").value = "2";
  input("training-3-2").dispatchEvent(new Event("input"));
  assert.equal(remaining()[0].textContent, "2.5 minutes left");
  assert.equal(remaining()[2].textContent, "10 full activations left");
  input("training-1-1-paid").checked = true;
  input("training-1-1-paid").dispatchEvent(new Event("change"));
  input("training-3-2-paid").checked = true;
  input("training-3-2-paid").dispatchEvent(new Event("change"));
  assert.equal(fragments(), "23,500 Fragments remaining");
  assert.equal(remaining()[0].textContent, "0 minutes left");
  assert.equal(remaining()[2].textContent, "8 full activations left");

  input("training-3-2").value = "5";
  input("training-3-2").dispatchEvent(new Event("input"));
  assert.equal(remaining()[2].textContent, "Check progress");
  assert.equal(fragments(), "23,500 Fragments remaining");
  input("training-3-2").value = "";
  input("training-3-2").dispatchEvent(new Event("input"));
  assert.equal(remaining()[2].textContent, "8 full activations left");
  input("training-3-2-paid").checked = false;
  input("training-3-2-paid").dispatchEvent(new Event("change"));
  assert.equal(remaining()[2].textContent, "Check progress");
  input("training-3-2-paid").checked = true;
  input("training-3-2-paid").dispatchEvent(new Event("change"));
  input("training-3-2").value = "2";
  input("training-3-2").dispatchEvent(new Event("input"));

  page = openPage(values);
  assert.equal(remaining()[0].textContent, "0 minutes left");
  assert.equal(remaining()[2].textContent, "8 full activations left");
  assert.equal(fragments(), "23,500 Fragments remaining");
  const draco = openPage(values, "draco");
  assert.equal(draco.panel.querySelector(".training-fragments").textContent, "26,750 Fragments remaining");
});

test("trial completion is saved independently for each race", () => {
  const values = new Map();
  let page = openPage(values);
  const trial = page.inputs.find((input) => input.id === "human-trial-1");
  trial.checked = true;
  trial.dispatchEvent(new Event("change"));
  page = openPage(values);
  assert.equal(page.inputs.find((input) => input.id === "human-trial-1").checked, true);
  assert.equal(page.inputs.find((input) => input.id === "human-trial-2").checked, false);
  const draco = openPage(values, "draco");
  assert.equal(draco.inputs.find((input) => input.id === "draco-trial-1").checked, false);
});
