(() => {
  const fruitGroups = [
    { rarity: "Common", fruits: ["Rocket", "Spin", "Blade", "Spring", "Bomb", "Smoke", "Spike"] },
    { rarity: "Uncommon", fruits: ["Flame", "Ice", "Sand", "Dark", "Eagle", "Diamond"] },
    { rarity: "Rare", fruits: ["Light", "Rubber", "Ghost", "Magma"] },
    {
      rarity: "Legendary",
      fruits: ["Quake", "Buddha", "Love", "Creation", "Spider", "Sound", "Phoenix", "Portal", "Lightning", "Pain", "Blizzard"],
    },
    {
      rarity: "Mythical",
      fruits: ["Gravity", "Mammoth", "T-Rex", "Dough", "Shadow", "Venom", "Gas", "Spirit", "Tiger", "Yeti", "Magnet", "Kitsune", "Control", "Dragon"],
    },
  ];
  const fruitNames = fruitGroups.flatMap((group) => group.fruits);

  type LegacyRow = { name: string; quantity: string };
  type Inventory = { version: 1; quantities: Record<string, number>; legacy: LegacyRow[] };

  const storage = document.querySelector<HTMLInputElement>("#fruit-storages");
  const list = document.querySelector<HTMLDivElement>("#fruit-list");
  const navigation = document.querySelector<HTMLElement>("#rarity-nav");
  const errorMessage = document.querySelector<HTMLParagraphElement>("#fruit-save-error");
  const limitWarning = document.querySelector<HTMLParagraphElement>("#fruit-limit-warning");
  if (!storage || !list || !navigation || !errorMessage || !limitWarning) {
    throw new Error("Fruit tracker controls are missing.");
  }

  const storageInput = storage;
  const fruitList = list;
  const rarityNavigation = navigation;
  const errorDisplay = errorMessage;
  const warningDisplay = limitWarning;
  const prefix = `bloxfruits-tracker:${location.pathname}:`;
  const key = `${prefix}fruit-inventory`;
  const inputs = new Map<string, HTMLInputElement>();
  let inventory: Inventory = { version: 1, quantities: {}, legacy: [] };
  let canSave = true;

  function isLegacyRow(value: unknown): value is LegacyRow {
    return typeof value === "object" && value !== null &&
      "name" in value && typeof value.name === "string" &&
      "quantity" in value && typeof value.quantity === "string";
  }

  function isInventory(value: unknown): value is Inventory {
    if (typeof value !== "object" || value === null ||
      !("version" in value) || value.version !== 1 ||
      !("quantities" in value) || typeof value.quantities !== "object" ||
      value.quantities === null || Array.isArray(value.quantities) ||
      !("legacy" in value) || !Array.isArray(value.legacy)) {
      return false;
    }
    return Object.values(value.quantities).every(
      (count) => typeof count === "number" && Number.isSafeInteger(count) && count >= 0,
    ) && value.legacy.every(isLegacyRow);
  }

  function saveInventory(): void {
    if (!canSave) return;
    try {
      localStorage.setItem(key, JSON.stringify(inventory));
      errorDisplay.textContent = "";
    } catch (error) {
      console.error("Could not save fruit quantities.", error);
      errorDisplay.textContent = "Could not save fruit quantities. Check your browser storage and try again.";
    }
  }

  function migrateLegacy(): void {
    const firstName = localStorage.getItem(`${prefix}fruit-name`);
    const firstQuantity = localStorage.getItem(`${prefix}fruit-quantity`);
    const extra = localStorage.getItem(`${prefix}extra-fruits`);
    if (firstName === null && firstQuantity === null && extra === null) return;

    const rows: LegacyRow[] = [{ name: firstName ?? "", quantity: firstQuantity ?? "" }];
    if (extra !== null) {
      const data: unknown = JSON.parse(extra);
      if (!Array.isArray(data) || !data.every(isLegacyRow)) {
        throw new Error("Earlier fruit entries have an invalid format.");
      }
      rows.push(...data);
    }

    const normalize = (name: string) => name.trim().replace(/\s+fruit$/i, "").toLowerCase().replace(/[\s-]+/g, "");
    const names = new Map(fruitNames.map((name) => [normalize(name), name]));
    const matches = new Map<string, { row: LegacyRow; count: number }[]>();

    for (const row of rows) {
      if (!row.name.trim() && !row.quantity.trim()) continue;
      const name = names.get(normalize(row.name));
      const count = row.quantity.trim() === "" ? 0 : Number(row.quantity);
      if (!name || !Number.isSafeInteger(count) || count < 0) {
        inventory.legacy.push(row);
        continue;
      }
      const group = matches.get(name) ?? [];
      group.push({ row, count });
      matches.set(name, group);
    }

    for (const [name, group] of matches) {
      if (group.length === 1) {
        inventory.quantities[name] = group[0].count;
      } else {
        inventory.legacy.push(...group.map(({ row }) => row));
      }
    }
    saveInventory();
  }

  try {
    const saved = localStorage.getItem(key);
    if (saved === null) {
      migrateLegacy();
    } else {
      const data: unknown = JSON.parse(saved);
      if (!isInventory(data)) throw new Error("Saved fruit inventory has an invalid format.");
      inventory = data;
    }
  } catch (error) {
    canSave = false;
    console.error("Could not restore fruit quantities.", error);
    errorDisplay.textContent = "Could not load saved fruits. Changes will not be saved.";
  }

  function updateLimits(): void {
    const max = storageInput.valueAsNumber;
    const valid = Number.isSafeInteger(max) && max >= 1;
    let exceeded = false;
    for (const input of inputs.values()) {
      input.disabled = !valid;
      if (valid) {
        input.max = String(max);
        if (input.valueAsNumber > max) {
          exceeded = true;
          input.setAttribute("aria-invalid", "true");
        } else {
          input.removeAttribute("aria-invalid");
        }
      } else {
        input.removeAttribute("max");
        input.removeAttribute("aria-invalid");
      }
    }
    warningDisplay.textContent = exceeded
      ? "Some fruit quantities exceed your storage limit. Reduce them or increase storage."
      : "";
  }

  function addFruit(name: string, groupList: HTMLUListElement): HTMLLIElement {
    const row = document.createElement("li");
    row.className = "fruit-row";
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.id = `fruit-${name.toLowerCase()}`;
    input.type = "number";
    input.min = "0";
    input.step = "1";
    input.value = String(inventory.quantities[name] ?? 0);
    input.setAttribute("aria-describedby", "fruit-limit-warning");
    label.htmlFor = input.id;
    label.textContent = name;

    const saveQuantity = (finishEditing: boolean) => {
      const max = storageInput.valueAsNumber;
      if (!Number.isSafeInteger(max) || max < 1) return;
      if (input.value === "" && !finishEditing) return;
      const value = input.valueAsNumber;
      const count = Number.isFinite(value) ? Math.min(max, Math.max(0, Math.floor(value))) : 0;
      input.value = String(count);
      inventory.quantities[name] = count;
      saveInventory();
      updateLimits();
    };
    input.addEventListener("input", () => saveQuantity(false));
    input.addEventListener("change", () => saveQuantity(true));
    inputs.set(name, input);
    row.append(label, input);
    groupList.append(row);
    return row;
  }

  type RaritySection = { section: HTMLElement; items: HTMLElement[]; button: HTMLButtonElement };
  const sections: RaritySection[] = [];
  let activeSection: RaritySection | null = null;
  let requestedSection: RaritySection | null = null;
  let changingSection = false;

  async function animateSection(group: RaritySection, entering: boolean): Promise<void> {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const visible = { opacity: 1, transform: "translateY(0)" };
    const hidden = { opacity: 0, transform: "translateY(-0.5rem)" };
    const animations = group.items.map((item, index) => item.animate(
      entering ? [hidden, visible] : [visible, hidden],
      {
        duration: entering ? 180 : 140,
        delay: (entering ? index : group.items.length - 1 - index) * 22,
        easing: entering ? "cubic-bezier(0.16, 1, 0.3, 1)" : "ease-in",
        fill: "both",
      },
    ));
    await Promise.all(animations.map((animation) => animation.finished));
    animations.forEach((animation) => animation.cancel());
  }

  async function showRequestedSection(): Promise<void> {
    changingSection = true;
    while (activeSection !== requestedSection) {
      if (activeSection) {
        await animateSection(activeSection, false);
        activeSection.section.hidden = true;
        activeSection = null;
      }
      if (requestedSection) {
        activeSection = requestedSection;
        activeSection.section.hidden = false;
        await animateSection(activeSection, true);
      }
    }
    changingSection = false;
  }

  for (const group of fruitGroups) {
    const section = document.createElement("section");
    section.className = "fruit-group";
    section.id = `rarity-${group.rarity.toLowerCase()}`;
    section.hidden = true;
    const heading = document.createElement("h2");
    heading.id = `${section.id}-heading`;
    heading.textContent = group.rarity;
    section.setAttribute("aria-labelledby", heading.id);
    const groupList = document.createElement("ul");
    const items: HTMLElement[] = [heading];
    for (const name of group.fruits) {
      items.push(addFruit(name, groupList));
    }
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = group.rarity;
    button.setAttribute("aria-controls", section.id);
    button.setAttribute("aria-pressed", "false");
    const raritySection = { section, items, button };
    sections.push(raritySection);
    button.addEventListener("click", () => {
      requestedSection = raritySection;
      for (const item of sections) {
        item.button.setAttribute("aria-pressed", String(item === requestedSection));
      }
      if (!changingSection) void showRequestedSection();
    });
    section.append(heading, groupList);
    fruitList.append(section);
    rarityNavigation.append(button);
  }

  if (inventory.legacy.length > 0) {
    console.warn("Some earlier fruit entries could not be imported and remain in browser storage.");
  }

  storageInput.addEventListener("input", updateLimits);
  storageInput.addEventListener("change", updateLimits);
  updateLimits();
})();
