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

  focus() {}
}

function openPage(values = new Map()) {
  const elements = {
    "#fruit-storages": new Element("number"),
    "#fruit-name": new Element("text"),
    "#fruit-quantity": new Element("number"),
    "#add-fruit": new Element("button"),
    "#extra-fruits": new Element(),
    "#fruit-save-error": new Element(),
    "#fruit-limit-warning": new Element(),
  };
  for (const id of ["fruit-storages", "fruit-name", "fruit-quantity"]) {
    elements[`#${id}`].id = id;
  }

  const document = {
    querySelector: (selector) => elements[selector],
    querySelectorAll: () => [
      elements["#fruit-storages"],
      elements["#fruit-name"],
      elements["#fruit-quantity"],
    ],
    createElement: () => new Element(),
  };
  const localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const context = vm.createContext({
    document, localStorage, location: { pathname: "/pages/fruits.html" }, Event, console,
  });
  for (const filename of ["scripts.js", "fruits.js"]) {
    vm.runInContext(readFileSync(path.join(__dirname, "../scripts", filename), "utf8"), context);
  }
  return elements;
}

function changeInput(element, value) {
  element.value = value;
  element.dispatchEvent(new Event("input"));
}

test("editing storage preserves both existing and added fruit quantities", () => {
  const values = new Map();
  let page = openPage(values);
  changeInput(page["#fruit-storages"], "12");
  changeInput(page["#fruit-quantity"], "10");
  page["#add-fruit"].dispatchEvent(new Event("click"));
  const extraQuantity = page["#extra-fruits"].children[0].children[1];
  changeInput(extraQuantity, "11");

  changeInput(page["#fruit-storages"], "1");
  assert.equal(page["#fruit-quantity"].value, "10");
  assert.equal(extraQuantity.value, "11");
  assert.match(page["#fruit-limit-warning"].textContent, /exceed/);

  page = openPage(values);
  assert.equal(page["#fruit-quantity"].value, "10");
  assert.equal(page["#extra-fruits"].children[0].children[1].value, "11");
  assert.match(page["#fruit-limit-warning"].textContent, /exceed/);

  changeInput(page["#fruit-storages"], "15");
  assert.equal(page["#fruit-limit-warning"].textContent, "");
  assert.equal(page["#fruit-quantity"].value, "10");
  assert.equal(page["#extra-fruits"].children[0].children[1].value, "11");
});

test("editing quantities still enforces the current storage limit", () => {
  const values = new Map();
  let page = openPage(values);
  changeInput(page["#fruit-storages"], "3");
  changeInput(page["#fruit-quantity"], "9");
  page["#add-fruit"].dispatchEvent(new Event("click"));
  changeInput(page["#extra-fruits"].children[0].children[1], "8");
  page = openPage(values);
  assert.equal(page["#fruit-quantity"].value, "3");
  assert.equal(page["#extra-fruits"].children[0].children[1].value, "3");
});
