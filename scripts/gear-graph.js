"use strict";
(() => {
    const panels = document.querySelectorAll(".gear-panel");
    if (panels.length === 0)
        throw new Error("Gear graph panels are missing.");
    panels.forEach((panel) => {
        const race = panel.dataset.race;
        const fields = panel.querySelector("fieldset");
        const blue = panel.querySelector(".gear-blue");
        const red = panel.querySelector(".gear-red");
        const finalGear = fields?.querySelector('input[type="checkbox"]');
        const finalLabel = finalGear?.closest("label");
        const blueLabel = blue?.closest("label");
        const redLabel = red?.closest("label");
        const blueDescription = blueLabel?.nextElementSibling;
        const redDescription = redLabel?.nextElementSibling;
        const warning = panel.querySelector(".gear-warning");
        if (!race || !fields || !blue || !red || !finalGear || !finalLabel || !blueLabel || !redLabel ||
            !(blueDescription instanceof HTMLElement) || blueDescription.tagName !== "P" ||
            !(redDescription instanceof HTMLElement) || redDescription.tagName !== "P" || !warning) {
            throw new Error(`Gear graph controls are missing for ${race}.`);
        }
        function tierDescriptions(description) {
            const first = description.querySelector('[data-tier="1"]')?.textContent?.trim();
            const second = description.querySelector('[data-tier="2"]')?.textContent?.trim();
            if (!first || !second)
                throw new Error(`Gear tier descriptions are missing for ${race}.`);
            return [first, second];
        }
        const descriptions = {
            blue: tierDescriptions(blueDescription),
            red: tierDescriptions(redDescription),
        };
        const blueInput = blue;
        const redInput = red;
        const finalInput = finalGear;
        const blueCountLabel = blueLabel;
        const redCountLabel = redLabel;
        const blueAbilityDescription = blueDescription;
        const redAbilityDescription = redDescription;
        const warningDisplay = warning;
        const blueName = blueLabel.textContent?.trim() ?? "Blue gear";
        const redName = redLabel.textContent?.trim() ?? "Red gear";
        for (const label of [blueLabel, redLabel, blueDescription, redDescription]) {
            label.hidden = true;
        }
        const graph = document.createElement("div");
        graph.className = "gear-graph";
        graph.setAttribute("role", "group");
        graph.setAttribute("aria-label", `${race === "draco" ? "Ember" : "Gear"} selection graph`);
        const lines = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        lines.setAttribute("viewBox", "0 0 300 260");
        lines.setAttribute("preserveAspectRatio", "none");
        lines.setAttribute("aria-hidden", "true");
        lines.classList.add("gear-links");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M50 43 L150 130 L250 43 M150 130 L50 217 L150 217");
        lines.append(path);
        graph.append(lines);
        const awakening = document.createElement("div");
        awakening.className = "gear-node gear-awakening";
        awakening.textContent = "I - V4";
        graph.append(awakening);
        finalLabel.classList.add("gear-node", "gear-final");
        graph.append(finalLabel);
        const choiceArea = document.createElement("div");
        choiceArea.className = "gear-choices";
        choiceArea.hidden = true;
        const sequenceStatus = document.createElement("p");
        sequenceStatus.className = "gear-sequence-status";
        sequenceStatus.id = `${race}-gear-sequence`;
        sequenceStatus.setAttribute("role", "status");
        finalInput.setAttribute("aria-describedby", sequenceStatus.id);
        const prefix = `bloxfruits-tracker:${location.pathname}:`;
        const slots = ["II", "III", "IV"].map((roman, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = `gear-node gear-slot gear-slot-${index + 2}`;
            button.setAttribute("aria-expanded", "false");
            button.setAttribute("aria-describedby", sequenceStatus.id);
            const choices = document.createElement("fieldset");
            choices.className = "gear-choice-group";
            choices.id = `${race}-gear-choices-${index + 2}`;
            choices.hidden = true;
            button.setAttribute("aria-controls", choices.id);
            const legend = document.createElement("legend");
            legend.textContent = `Choose ${race === "draco" ? "ember" : "gear"} ${roman}`;
            choices.append(legend);
            const limits = [];
            const details = [];
            const options = [
                ["none", "Empty"],
                ["blue", blueName],
                ["red", redName],
            ].map(([value, name]) => {
                const option = document.createElement("div");
                option.className = "gear-option";
                const label = document.createElement("label");
                const input = document.createElement("input");
                input.type = "radio";
                input.name = `${race}-gear-slot-${index + 2}`;
                input.id = `${input.name}-${value}`;
                input.value = value;
                input.checked = value === "none";
                label.append(input, document.createTextNode(` ${name}`));
                option.append(label);
                if (value !== "none") {
                    const detail = document.createElement("p");
                    detail.className = "gear-option-description";
                    detail.id = `${input.id}-description`;
                    detail.textContent = descriptions[value][0];
                    const limit = document.createElement("p");
                    limit.className = "gear-option-limit";
                    limit.id = `${input.id}-limit`;
                    limit.textContent = "Already selected twice in other slots.";
                    limit.hidden = true;
                    input.setAttribute("aria-describedby", `${detail.id} ${limit.id}`);
                    option.append(detail, limit);
                    details.push(detail);
                    limits.push(limit);
                }
                choices.append(option);
                return input;
            });
            button.addEventListener("click", () => {
                const opening = choices.hidden;
                choiceArea.hidden = !opening;
                for (const slot of slots) {
                    slot.choices.hidden = true;
                    slot.button.setAttribute("aria-expanded", "false");
                }
                choices.hidden = !opening;
                button.setAttribute("aria-expanded", String(opening));
            });
            graph.append(button);
            choiceArea.append(choices);
            return { button, choices, options, limits, details, roman };
        });
        fields.insertBefore(graph, fields.children[1] ?? null);
        graph.after(sequenceStatus);
        sequenceStatus.after(choiceArea);
        const trials = document.createElement("fieldset");
        trials.className = "race-trials";
        const trialsLegend = document.createElement("legend");
        trialsLegend.textContent = "Completed V4 trials";
        trials.append(trialsLegend);
        for (let trial = 1; trial <= 5; trial++) {
            const label = document.createElement("label");
            const input = document.createElement("input");
            input.type = "checkbox";
            input.id = `${race}-trial-${trial}`;
            label.append(input, document.createTextNode(` Trial ${trial}`));
            trials.append(label);
        }
        fields.after(trials);
        const training = document.createElement("section");
        training.className = "race-training";
        const trainingHeading = document.createElement("h4");
        trainingHeading.textContent = "V4 training";
        const trainingIntro = document.createElement("p");
        trainingIntro.textContent = "Enter progress; mark an upgrade paid when complete. Trials and gear choices are tracked separately.";
        const fragmentTotal = document.createElement("p");
        fragmentTotal.className = "training-fragments";
        fragmentTotal.setAttribute("role", "status");
        training.append(trainingHeading, trainingIntro, fragmentTotal);
        const trainingValidators = [];
        const gearWord = race === "draco" ? "ember" : "gear";
        const gearTitle = race === "draco" ? "Ember" : "Gear";
        const trainingSets = [
            { title: `${gearTitle} II`, unit: "minutes", amounts: [3], costs: [1000] },
            { title: `${gearTitle} III`, unit: "minutes", amounts: [5], costs: [1500] },
            { title: `${gearTitle} IV`, unit: "full activations", amounts: [3, 4, 5], costs: [2000, 2250, 2500] },
            { title: `Final ${gearWord} & duration`, unit: "full activations", amounts: [5, 6, 7, 8, 9], costs: [3000, 3250, 3500, 3750, 4000] },
        ];
        const trainingGroups = trainingSets.map((set, setIndex) => {
            const group = document.createElement("details");
            group.className = "training-group";
            const summary = document.createElement("summary");
            const title = document.createElement("span");
            title.textContent = set.title;
            const remaining = document.createElement("span");
            remaining.className = "training-remaining";
            summary.append(title, document.createTextNode(" "), remaining);
            group.append(summary);
            const levels = set.amounts.map((amount, levelIndex) => {
                const row = document.createElement("div");
                row.className = "training-level";
                const label = document.createElement("label");
                label.className = "training-progress";
                const input = document.createElement("input");
                input.type = "number";
                input.id = `${race}-training-${setIndex + 1}-${levelIndex + 1}`;
                input.min = "0";
                input.max = String(amount);
                input.step = set.unit === "minutes" ? "any" : "1";
                input.value = "0";
                input.setAttribute("aria-label", `${set.title}, level ${levelIndex + 1}: completed ${set.unit}`);
                const hint = document.createElement("span");
                hint.textContent = `Level ${levelIndex + 1}: ${amount} ${set.unit}`;
                const error = document.createElement("span");
                error.id = `${input.id}-error`;
                error.className = "training-error";
                error.setAttribute("role", "status");
                input.setAttribute("aria-describedby", error.id);
                function validate() {
                    const value = input.valueAsNumber;
                    const invalid = input.value !== "" && (!Number.isFinite(value) || value < 0 ||
                        value > amount || (set.unit !== "minutes" && !Number.isInteger(value)));
                    if (invalid) {
                        input.setAttribute("aria-invalid", "true");
                        error.textContent = `Enter ${set.unit === "minutes" ? "a number" : "a whole number"} from 0 to ${amount}.`;
                    }
                    else {
                        input.removeAttribute("aria-invalid");
                        error.textContent = "";
                    }
                }
                const updateProgress = () => {
                    validate();
                    updateTraining();
                };
                input.addEventListener("input", updateProgress);
                input.addEventListener("change", updateProgress);
                trainingValidators.push(validate);
                label.append(hint, input);
                const paidLabel = document.createElement("label");
                paidLabel.className = "training-paid";
                const paid = document.createElement("input");
                paid.type = "checkbox";
                paid.id = `${input.id}-paid`;
                paid.setAttribute("aria-label", `${set.title}, level ${levelIndex + 1}: ${set.costs[levelIndex].toLocaleString("en-US")} Fragments paid`);
                paid.addEventListener("change", updateTraining);
                paidLabel.append(paid, document.createTextNode(` Paid ${set.costs[levelIndex].toLocaleString("en-US")}`));
                row.append(label, paidLabel, error);
                group.append(row);
                return { input, paid, amount, cost: set.costs[levelIndex] };
            });
            training.append(group);
            return { set, remaining, levels };
        });
        function updateTraining() {
            let fragments = 0;
            for (const { set, remaining, levels } of trainingGroups) {
                let total = 0;
                let valid = true;
                for (const { input, paid, amount, cost } of levels) {
                    if (!paid.checked)
                        fragments += cost;
                    const value = input.valueAsNumber;
                    if ((input.value === "" && !paid.checked) ||
                        (input.value !== "" && (!Number.isFinite(value) || value < 0 ||
                            value > amount || (set.unit !== "minutes" && !Number.isInteger(value))))) {
                        valid = false;
                    }
                    else if (!paid.checked) {
                        total += amount - value;
                    }
                }
                remaining.textContent = valid
                    ? `${total.toLocaleString("en-US", { maximumFractionDigits: 10 })} ${set.unit} left`
                    : "Check progress";
            }
            fragmentTotal.textContent = `${fragments.toLocaleString("en-US")} Fragments remaining`;
        }
        const trainingNote = document.createElement("p");
        trainingNote.textContent = "For full activations, let the V4 bar run out naturally. Requirements can change; confirm progress with the in-game NPC. ";
        const trainingSource = document.createElement("a");
        trainingSource.href = "https://blox-fruits.fandom.com/wiki/Ancient_One";
        trainingSource.textContent = "Training source";
        trainingNote.append(trainingSource);
        training.append(trainingNote);
        choiceArea.after(training);
        function updateGraph() {
            const selected = slots.map((slot) => slot.options.find((input) => input.checked)?.value ?? "none");
            const missing = selected.findIndex((color) => color === "none");
            const itemName = race === "draco" ? "ember" : "gear";
            sequenceStatus.hidden = needsRecovery;
            sequenceStatus.textContent = missing < 0 ? "" :
                `Choose ${itemName} ${slots[missing].roman} to unlock later ${race === "draco" ? "embers" : "gears"}. Later selections are preserved.`;
            finalInput.disabled = missing >= 0;
            for (const [index, slot] of slots.entries()) {
                const value = selected[index];
                const name = value === "blue" ? blueName : value === "red" ? redName : "Empty";
                slot.button.textContent = `${slot.roman} - ${value === "none" ? "Empty" : value === "blue" ? "Blue" : "Red"}`;
                slot.button.setAttribute("aria-label", `${race === "draco" ? "Ember" : "Gear"} ${slot.roman}: ${name}`);
                slot.button.dataset.color = value;
                slot.button.disabled = selected.slice(0, index).includes("none");
                if (slot.button.disabled && !slot.choices.hidden) {
                    slot.choices.hidden = true;
                    choiceArea.hidden = true;
                    slot.button.setAttribute("aria-expanded", "false");
                }
                const others = selected.filter((_, otherIndex) => otherIndex !== index);
                slot.options[1].disabled = others.filter((color) => color === "blue").length >= 2;
                slot.options[2].disabled = others.filter((color) => color === "red").length >= 2;
                slot.limits[0].hidden = !slot.options[1].disabled;
                slot.limits[1].hidden = !slot.options[2].disabled;
                ["blue", "red"].forEach((color, colorIndex) => {
                    const option = slot.options[colorIndex + 1];
                    const detail = slot.details[colorIndex];
                    detail.textContent = descriptions[color][selected.slice(0, index).includes(color) ? 1 : 0];
                    detail.hidden = option.disabled;
                    option.setAttribute("aria-describedby", option.disabled ? slot.limits[colorIndex].id : detail.id);
                });
            }
        }
        function saveCounts() {
            const colors = slots.map((slot) => slot.options.find((input) => input.checked)?.value);
            const changes = [
                { input: blueInput, value: colors.filter((color) => color === "blue").length },
                { input: redInput, value: colors.filter((color) => color === "red").length },
            ].sort((a, b) => (a.value - a.input.valueAsNumber) - (b.value - b.input.valueAsNumber));
            for (const { input, value } of changes) {
                input.value = String(value);
                input.dispatchEvent(new Event("input", { bubbles: true }));
            }
        }
        for (const slot of slots) {
            for (const input of slot.options) {
                input.addEventListener("change", () => {
                    updateGraph();
                    saveCounts();
                });
            }
        }
        let needsRecovery = false;
        function migrateCounts() {
            const blueCount = blueInput.value === "" ? 0 : blueInput.valueAsNumber;
            const redCount = redInput.value === "" ? 0 : redInput.valueAsNumber;
            if (!Number.isInteger(blueCount) || !Number.isInteger(redCount) ||
                blueCount < 0 || redCount < 0 || blueCount > 2 || redCount > 2 ||
                blueCount + redCount > 3) {
                needsRecovery = true;
                graph.hidden = true;
                blueCountLabel.hidden = false;
                redCountLabel.hidden = false;
                blueAbilityDescription.hidden = false;
                redAbilityDescription.hidden = false;
                warningDisplay.textContent = "Saved gear counts exceed the allowed limits. Adjust them before using the graph.";
                return;
            }
            needsRecovery = false;
            graph.hidden = false;
            blueCountLabel.hidden = true;
            redCountLabel.hidden = true;
            blueAbilityDescription.hidden = true;
            redAbilityDescription.hidden = true;
            const previous = [
                ...Array(blueCount).fill("blue"),
                ...Array(redCount).fill("red"),
            ];
            slots.forEach((slot, index) => {
                const input = slot.options.find((option) => option.value === (previous[index] ?? "none"));
                if (input)
                    input.checked = true;
            });
            slots.forEach((slot) => {
                slot.options.find((input) => input.checked)?.dispatchEvent(new Event("change", { bubbles: true }));
            });
            updateGraph();
        }
        for (const input of [blueInput, redInput]) {
            input.addEventListener("change", () => {
                if (needsRecovery)
                    migrateCounts();
            });
        }
        document.addEventListener("DOMContentLoaded", () => {
            trainingValidators.forEach((validate) => validate());
            updateTraining();
            try {
                const savedSlots = slots.some((slot) => slot.options.some((input) => localStorage.getItem(prefix + input.id) !== null));
                if (!savedSlots && (blueInput.valueAsNumber !== 0 || redInput.valueAsNumber !== 0)) {
                    migrateCounts();
                }
                else if (savedSlots) {
                    saveCounts();
                }
                updateGraph();
            }
            catch (error) {
                console.error("Could not restore gear selections.", error);
                warning.textContent = "Could not load gear selections. Check your browser storage.";
                updateGraph();
            }
        });
    });
})();
