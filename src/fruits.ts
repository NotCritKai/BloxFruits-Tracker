(() => {
  const storage = document.querySelector<HTMLInputElement>("#fruit-storages");
  const firstQuantity = document.querySelector<HTMLInputElement>("#fruit-quantity");
  const addButton = document.querySelector<HTMLButtonElement>("#add-fruit");
  const container = document.querySelector<HTMLDivElement>("#extra-fruits");
  const errorMessage = document.querySelector<HTMLParagraphElement>("#fruit-save-error");
  const limitWarning = document.querySelector<HTMLParagraphElement>("#fruit-limit-warning");

  if (!storage || !firstQuantity || !addButton || !container || !errorMessage || !limitWarning) {
    throw new Error("Fruit tracker controls are missing.");
  }

  const storageInput = storage;
  const initialQuantity = firstQuantity;
  const button = addButton;
  const fruitContainer = container;
  const errorDisplay = errorMessage;
  const warningDisplay = limitWarning;
  const key = `bloxfruits-tracker:${location.pathname}:extra-fruits`;
  const rows: { name: HTMLInputElement; quantity: HTMLInputElement }[] = [];
  let canSave = true;

  function saveRows(): void {
    if (!canSave) return;

    try {
      localStorage.setItem(key, JSON.stringify(rows.map(({ name, quantity }) => ({
        name: name.value,
        quantity: quantity.value,
      }))));
      errorDisplay.textContent = "";
    } catch (error) {
      console.error("Could not save extra fruits.", error);
      errorDisplay.textContent = "Could not save extra fruits. Check your browser storage and try again.";
    }
  }

  function updateLimits(): void {
    const max = storageInput.valueAsNumber;
    const valid = Number.isInteger(max) && max >= 1;
    button.disabled = !valid;
    let exceeded = false;

    for (const quantity of [initialQuantity, ...rows.map((row) => row.quantity)]) {
      quantity.disabled = !valid;
      if (valid) {
        quantity.max = String(max);
        if (quantity.valueAsNumber > max) {
          exceeded = true;
          quantity.setAttribute("aria-invalid", "true");
        } else {
          quantity.removeAttribute("aria-invalid");
        }
      } else {
        quantity.removeAttribute("max");
        quantity.removeAttribute("aria-invalid");
      }
    }

    warningDisplay.textContent = exceeded
      ? "Some fruit quantities exceed your storage limit. Reduce them or increase storage."
      : "";
  }

  function limitEditedQuantity(quantity: HTMLInputElement): void {
    const max = storageInput.valueAsNumber;
    if (Number.isInteger(max) && max >= 1 && quantity.valueAsNumber > max) {
      quantity.value = String(max);
      if (quantity === initialQuantity) {
        quantity.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
    updateLimits();
  }

  function addRow(nameValue = "", quantityValue = ""): void {
    const row = document.createElement("div");
    const name = document.createElement("input");
    name.type = "text";
    name.placeholder = "Fruit Name";
    name.setAttribute("aria-label", "Fruit name");
    name.value = nameValue;

    const quantity = document.createElement("input");
    quantity.type = "number";
    quantity.min = "1";
    quantity.placeholder = "Quantity";
    quantity.setAttribute("aria-label", "Fruit quantity");
    quantity.setAttribute("aria-describedby", "fruit-limit-warning");
    quantity.value = quantityValue;

    name.addEventListener("input", saveRows);
    name.addEventListener("change", saveRows);
    quantity.addEventListener("input", () => {
      limitEditedQuantity(quantity);
      saveRows();
    });
    quantity.addEventListener("change", saveRows);
    rows.push({ name, quantity });
    row.append(name, quantity);
    fruitContainer.append(row);
  }

  function isSavedRow(value: unknown): value is { name: string; quantity: string } {
    return typeof value === "object" && value !== null &&
      "name" in value && typeof value.name === "string" &&
      "quantity" in value && typeof value.quantity === "string";
  }

  try {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      const data: unknown = JSON.parse(saved);
      if (!Array.isArray(data) || !data.every(isSavedRow)) {
        throw new Error("Saved fruit rows have an invalid format.");
      }
      data.forEach((row) => addRow(row.name, row.quantity));
    }
  } catch (error) {
    canSave = false;
    console.error("Could not restore extra fruits.", error);
    errorDisplay.textContent = "Could not load saved fruits. New fruit rows will not be saved.";
  }

  storageInput.addEventListener("input", updateLimits);
  storageInput.addEventListener("change", updateLimits);
  initialQuantity.addEventListener("input", () => limitEditedQuantity(initialQuantity));
  button.addEventListener("click", () => {
    addRow();
    updateLimits();
    saveRows();
    rows[rows.length - 1].name.focus();
  });
  updateLimits();
})();
