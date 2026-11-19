const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

class Element extends EventTarget {
  constructor() {
    super();
    this.children = [];
    this.attributes = {};
    this.textContent = "";
    const classes = new Set();
    this.classList = {
      contains: (name) => classes.has(name),
      toggle: (name) => classes.has(name) ? classes.delete(name) : classes.add(name),
    };
  }

  set innerHTML(value) {
    this.html = value;
    this.children = [];
  }

  setAttribute(name, value) { this.attributes[name] = value; }
  appendChild(child) { this.children.push(child); }
  append(...children) { this.children.push(...children); }
  querySelectorAll(selector) { return selector === "button" ? this.children : []; }
}

test("Third Sea lists its styles and their expandable details", () => {
  const list = new Element();
  const nav = new Element();
  const document = {
    querySelector: (selector) => selector === "#sea-nav" ? nav : list,
    createElement: () => new Element(),
  };
  vm.runInNewContext(readFileSync(path.join(__dirname, "../scripts/fighting-styles.js"), "utf8"), {
    document, matchMedia: () => ({ matches: true }),
  });

  assert.deepEqual(nav.children.map((button) => button.textContent), [
    "First Sea (Starter)", "Second Sea", "Third Sea",
  ]);
  nav.children[2].dispatchEvent(new Event("click"));
  const group = list.children[0];
  assert.equal(group.children[0].textContent, "Third Sea");
  assert.equal(nav.children[2].attributes["aria-pressed"], "true");
  const rows = group.children[1].children;
  assert.deepEqual(rows.map((row) => row.children[0].children[0].children[1].html), [
    "<strong>Electric Claw</strong>",
    "<strong>Dragon Talon</strong> - Dragon Claw",
    "<strong>Godhuman</strong> - Rokushiki",
    "<strong>Sanguine Art</strong>",
  ]);
  rows[1].children[0].dispatchEvent(new Event("click", { cancelable: true }));
  assert.equal(rows[1].classList.contains("expanded"), true);
  assert.match(rows[1].children[1].children[1].html, /Uzoth/);
  assert.match(rows[1].children[1].children[3].children[0].textContent, /Talon Lighter/);

  nav.children[1].dispatchEvent(new Event("click"));
  assert.equal(list.children[0].children[0].textContent, "Second Sea");
  assert.equal(list.children[0].children[1].children.some((row) =>
    row.children[0].children[0].children[1].html.includes("Dragon Talon")), false);
});

test("fighting styles page has no stray text after the HTML document", () => {
  const html = readFileSync(path.join(__dirname, "../pages/fighting-styles.html"), "utf8");
  assert.match(html, /<\/html>\s*$/);
});
