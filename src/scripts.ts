const inputIds = new Set<string>();
const savedInputs: HTMLInputElement[] = [];
const excludedTypes = new Set(["button", "file", "hidden", "image", "password", "reset", "submit"]);

document.querySelectorAll<HTMLInputElement>("input").forEach((input) => {
  if (excludedTypes.has(input.type)) {
    return;
  }

  if (!input.id) {
    console.warn("Input state cannot be saved without an id.", input);
    return;
  }

  if (inputIds.has(input.id)) {
    console.warn(`Input state cannot be saved for duplicate id "${input.id}".`, input);
    return;
  }
  inputIds.add(input.id);
  savedInputs.push(input);

  const key = `bloxfruits-tracker:${location.pathname}:${input.id}`;

  try {
    const savedState = localStorage.getItem(key);
    if (savedState !== null) {
      if (input.type === "checkbox" || input.type === "radio") {
        if (savedState === "true" || savedState === "false") {
          input.checked = savedState === "true";
        }
      } else {
        input.value = savedState;
      }
    }
  } catch (error) {
    console.error(`Could not restore input "${input.id}".`, error);
  }
});

function saveInput(input: HTMLInputElement): void {
  const key = `bloxfruits-tracker:${location.pathname}:${input.id}`;
  const value = input.type === "checkbox" || input.type === "radio"
    ? String(input.checked)
    : input.value;

  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Could not save input "${input.id}".`, error);
  }
}

savedInputs.forEach((input) => {
  if (input.type === "radio") {
    input.addEventListener("change", () => {
      savedInputs
        .filter((other) => other.type === "radio" && (
          other === input || (input.name !== "" && other.name === input.name && other.form === input.form)
        ))
        .forEach(saveInput);
    });
  } else if (input.type === "checkbox") {
    input.addEventListener("change", () => saveInput(input));
  } else {
    input.addEventListener("input", () => saveInput(input));
    input.addEventListener("change", () => saveInput(input));
  }
});
