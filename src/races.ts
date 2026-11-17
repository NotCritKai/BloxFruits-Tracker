(() => {
  const gear = document.querySelector<HTMLInputElement>("#blue-gear");
  const warning = document.querySelector<HTMLParagraphElement>("#race-limit-warning");
  const stages = document.querySelectorAll<HTMLInputElement>(".race-stage");
  if (!gear || !warning || stages.length === 0) {
    throw new Error("Race tracker controls are missing.");
  }

  const gearInput = gear;
  const warningDisplay = warning;

  function maxForStage(stage: HTMLInputElement): number {
    return gearInput.checked || stage.id === "draco-stage" ? 4 : 3;
  }

  function updateLimits(message = ""): void {
    let exceeded = false;
    stages.forEach((stage) => {
      const max = maxForStage(stage);
      stage.max = String(max);
      stage.placeholder = `1-${max}`;
      if (stage.valueAsNumber > max) {
        stage.setAttribute("aria-invalid", "true");
        exceeded = true;
      } else {
        stage.removeAttribute("aria-invalid");
      }
    });
    warningDisplay.textContent = exceeded
      ? "Version 4 requires Blue Gear. Your saved version is preserved."
      : message;
  }

  function limitStage(stage: HTMLInputElement): void {
    let message = "";
    if (stage.value !== "") {
      const max = maxForStage(stage);
      const value = stage.valueAsNumber;
      const limited = Math.min(max, Math.max(1, Math.floor(value)));
      if (value !== limited) {
        message = `Enter a whole version from 1 to ${max}.`;
      }
      stage.value = String(limited);
    }
    updateLimits(message);
  }

  stages.forEach((stage) => {
    stage.addEventListener("input", () => limitStage(stage), true);
    stage.addEventListener("change", () => limitStage(stage), true);
  });
  gearInput.addEventListener("change", () => updateLimits());
  updateLimits();

  const selector = document.querySelector<HTMLSelectElement>("#gear-race");
  const panelElements = document.querySelectorAll<HTMLElement>(".gear-panel");
  if (!selector || panelElements.length === 0) {
    throw new Error("Gear tracker controls are missing.");
  }

  const raceSelector = selector;
  const panels = Array.from(panelElements, (element) => {
    const stage = Array.from(stages).find((input) => input.id === `${element.dataset.race}-stage`);
    const fields = element.querySelector<HTMLFieldSetElement>("fieldset");
    const lock = element.querySelector<HTMLParagraphElement>(".gear-lock");
    const warning = element.querySelector<HTMLParagraphElement>(".gear-warning");
    const blue = element.querySelector<HTMLInputElement>(".gear-blue");
    const red = element.querySelector<HTMLInputElement>(".gear-red");
    if (!stage || !fields || !lock || !warning || !blue || !red) {
      throw new Error(`Gear tracker controls are missing for ${element.dataset.race}.`);
    }
    return { element, stage, fields, lock, warning, blue, red };
  });

  function updatePanels(): void {
    panels.forEach((panel) => {
      panel.element.hidden = panel.element.dataset.race !== raceSelector.value;
      const eligible = panel.stage.valueAsNumber === 4 && maxForStage(panel.stage) === 4;
      panel.fields.disabled = !eligible;
      panel.lock.textContent = eligible ? "" : panel.stage.id === "draco-stage"
        ? "Set Draco to version 4 to edit its embers. Saved selections are preserved."
        : "Version 4 and Blue Gear are required to edit these gears. Saved selections are preserved.";
    });
  }

  panels.forEach((panel) => {
    function count(input: HTMLInputElement): number {
      return input.value === "" ? 0 : input.valueAsNumber;
    }

    function updateCounts(message = ""): void {
      const blue = count(panel.blue);
      const red = count(panel.red);
      panel.blue.max = String(Math.max(0, Math.min(2, 3 - red)));
      panel.red.max = String(Math.max(0, Math.min(2, 3 - blue)));
      const invalid = !Number.isInteger(blue) || !Number.isInteger(red) ||
        blue < 0 || red < 0 || blue > 2 || red > 2 || blue + red > 3;
      panel.warning.textContent = invalid
        ? "Saved gear counts exceed the allowed limits. Adjust them to continue."
        : message;
    }

    function limitCount(input: HTMLInputElement, other: HTMLInputElement, finish: boolean): void {
      if (input.value === "" && !finish) {
        updateCounts();
        return;
      }
      const value = input.value === "" ? 0 : input.valueAsNumber;
      const max = Math.max(0, Math.min(2, 3 - count(other)));
      const limited = Math.min(max, Math.max(0, Math.floor(value)));
      input.value = String(limited);
      updateCounts(value === limited ? "" : "Choose up to two of each color and three ability gears total.");
    }

    for (const [input, other] of [[panel.blue, panel.red], [panel.red, panel.blue]]) {
      // Normalize before the shared input-saving listener runs.
      input.addEventListener("input", () => limitCount(input, other, false), true);
      input.addEventListener("change", () => limitCount(input, other, true), true);
    }
    updateCounts();
    panel.stage.addEventListener("input", updatePanels);
    panel.stage.addEventListener("change", updatePanels);
  });
  raceSelector.addEventListener("change", updatePanels);
  gearInput.addEventListener("change", updatePanels);
  updatePanels();
})();
