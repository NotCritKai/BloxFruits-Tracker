"use strict";
const checkboxIds = new Set();
document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    if (!checkbox.id) {
        console.warn("Checkbox state cannot be saved without an id.", checkbox);
        return;
    }
    if (checkboxIds.has(checkbox.id)) {
        console.warn(`Checkbox state cannot be saved for duplicate id "${checkbox.id}".`, checkbox);
        return;
    }
    checkboxIds.add(checkbox.id);
    const key = `bloxfruits-tracker:${location.pathname}:${checkbox.id}`;
    try {
        const savedState = localStorage.getItem(key);
        if (savedState === "true" || savedState === "false") {
            checkbox.checked = savedState === "true";
        }
    }
    catch (error) {
        console.error(`Could not restore checkbox "${checkbox.id}".`, error);
    }
    checkbox.addEventListener("change", () => {
        try {
            localStorage.setItem(key, String(checkbox.checked));
        }
        catch (error) {
            console.error(`Could not save checkbox "${checkbox.id}".`, error);
        }
    });
});
