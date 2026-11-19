const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

class Element extends EventTarget {
  constructor(tag, inputs) {
    super();
    this.tag = tag;
    this.inputs = inputs;
    this.children = [];
    this.attributes = {};
    this.dataset = {};
    this.style = {};
    this.className = "";
    this.hidden = false;
    this.disabled = false;
    this._checked = false;
    this.classList = {
      add: (name) => { this.className += ` ${name}`; },
      remove: () => {},
      contains: (name) => this.className.split(" ").includes(name),
      toggle: () => {},
    };
    if (tag === "input") inputs.push(this);
  }

  set checked(value) {
    if (value && this.type === "radio") {
      this.inputs.filter((input) => input !== this && input.type === "radio" && input.name === this.name)
        .forEach((input) => { input._checked = false; });
    }
    this._checked = value;
  }
  get checked() { return this._checked; }
  set innerHTML(value) { this.html = value; this.children = []; }
  setAttribute(name, value) { this.attributes[name] = value; }
  appendChild(child) { this.children.push(child); }
  descendants() { return this.children.flatMap((child) => [child, ...child.descendants()]); }
  querySelectorAll(selector) {
    return this.descendants().filter((child) => child.className.split(" ").includes(selector.slice(1)));
  }
}

function openPage() {
  const inputs = [];
  const list = new Element("ul", inputs);
  const document = {
    querySelector: () => list,
    createElement: (tag) => new Element(tag, inputs),
    createElementNS: (_, tag) => new Element(tag, inputs),
  };
  vm.runInNewContext(readFileSync(path.join(__dirname, "../scripts/races.js"), "utf8"), {
    document, matchMedia: () => ({ matches: true }),
  });
  return list;
}

test("race gear slots unlock in order and preserve later choices", () => {
  const list = openPage();
  const human = list.children[0].children[0];
  const all = human.descendants();
  const input = (label) => all.find((element) => element.attributes["aria-label"] === label);
  const awakening = input("Human Awakening obtained");
  const final = input("Human Final gear obtained");
  const slots = ["II", "III", "IV"].map((roman) => input(`Choose Human Gear ${roman}`));
  const choose = (slot, color) => {
    const option = all.find((element) => element.name === `human-gear-4-slot-${slot}` && element.value === color);
    option.checked = true;
    option.dispatchEvent(new Event("change"));
  };
  const changeAwakening = (checked) => {
    awakening.checked = checked;
    awakening.dispatchEvent(new Event("change"));
  };

  assert.deepEqual(slots.map((slot) => slot.disabled), [true, true, true]);
  assert.equal(final.disabled, true);
  changeAwakening(true);
  assert.deepEqual(slots.map((slot) => slot.disabled), [false, true, true]);
  choose(2, "blue");
  assert.deepEqual(slots.map((slot) => slot.disabled), [false, false, true]);
  choose(3, "red");
  choose(4, "blue");
  assert.equal(final.disabled, false);
  final.checked = true;
  slots[2].dispatchEvent(new Event("click"));
  const choices = all.find((element) => element.id === "human-gear-choices-4");
  assert.equal(choices.hidden, false);

  choose(2, "none");
  assert.deepEqual(slots.map((slot) => slot.disabled), [false, true, true]);
  assert.equal(choices.hidden, true);
  assert.equal(final.disabled, true);
  assert.equal(final.checked, true);
  choose(2, "red");
  assert.deepEqual(slots.map((slot) => slot.disabled), [false, false, false]);
  assert.equal(final.disabled, false);
  assert.equal(slots[1].dataset.color, "red");

  changeAwakening(false);
  assert.deepEqual(slots.map((slot) => slot.disabled), [true, true, true]);
  changeAwakening(true);
  assert.equal(final.disabled, false);

  const cyborg = list.children[0].children[1].descendants();
  assert.equal(cyborg.find((element) => element.attributes["aria-label"] === "Choose Cyborg Gear II").disabled, true);
});
