"use strict";
(() => {
  const racesData = [
    {
      name: "Human",
      canonName: "Human",
      obtain: "Possible starting race; also available from race rerolls with Tort (3,000 Fragments) or the shop",
      versions: [
        {
          version: 1,
          description: "Starting form",
          stats: "Balanced stats",
          how_to_obtain: "Default at start",
        },
        {
          version: 2,
          description: "Upgraded form",
          stats: "Improved stats",
          how_to_obtain: "Alchemist's flower quest (Lv 850), Colosseum quest, $500,000",
        },
        {
          version: 3,
          description: "Advanced form",
          stats: "High power",
          how_to_obtain: "V2 required, Level 1000, Defeat Diamond/Jeremy/Orbitus, $2,000,000",
        },
        {
          version: 4,
          description: "Awakened form with gears",
          stats: "Maximum power with abilities",
          how_to_obtain: "V3 required, Blue Gear, Full Moon Trial (3+ races), Trial of Strength",
          gears: [
            {
              name: "Awakening",
              type: "Yellow",
              description: "Unlocked by completing Trial of Strength",
            },
            {
              name: "Limit Break",
              type: "Blue",
              limit: "Up to 2",
              tier1: "Builds rage to increase power",
              tier2: "Extends rage duration and raises its limit",
            },
            {
              name: "Psycho",
              type: "Red",
              limit: "Up to 2",
              tier1: "Adds Flash Step charges, brief invisibility, and speed",
              tier2: "Increases invisibility duration and damage during invisibility",
            },
            {
              name: "Final",
              type: "Yellow",
              description: "Improves awakening duration and energy gain",
            },
          ],
        },
      ],
    },
    {
      name: "Cyborg",
      canonName: "Cyborg",
      obtain: "Rare starting race; also available from race rerolls with Tort (3,000 Fragments) or the shop",
      versions: [
        {
          version: 1,
          description: "Starting form",
          stats: "Balanced stats with tech enhancements",
          how_to_obtain: "Possible at start or reroll",
        },
        {
          version: 2,
          description: "Upgraded form",
          stats: "Improved tech stats",
          how_to_obtain: "V1 Cyborg, Level 850, $500,000",
        },
        {
          version: 3,
          description: "Advanced form",
          stats: "High power",
          how_to_obtain: "V2 required, Level 1000, Defeat naturally spawned Sea Beast, $2,000,000",
        },
        {
          version: 4,
          description: "Awakened form with gears",
          stats: "Maximum power with abilities",
          how_to_obtain: "V3 required, Blue Gear, Full Moon Trial (3+ races), Trial of Technology",
          gears: [
            {
              name: "Awakening",
              type: "Yellow",
              description: "Unlocked by completing Trial of Technology",
            },
            {
              name: "Overload",
              type: "Blue",
              limit: "Up to 2",
              tier1: "Charges energy to increase power and speed",
              tier2: "Increases energy gain and extends charge duration",
            },
            {
              name: "Energy Shield",
              type: "Red",
              limit: "Up to 2",
              tier1: "Creates protective barrier that absorbs damage",
              tier2: "Increases barrier durability and reflects damage",
            },
            {
              name: "Final",
              type: "Yellow",
              description: "Improves awakening duration and energy gain",
            },
          ],
        },
      ],
    },
    {
      name: "Fishman",
      canonName: "Fishman",
      obtain: "Possible starting race; also available from race rerolls with Tort (3,000 Fragments) or the shop",
      versions: [
        {
          version: 1,
          description: "Starting form",
          stats: "Balanced stats with water affinity",
          how_to_obtain: "Default at start or reroll",
        },
        {
          version: 2,
          description: "Upgraded form",
          stats: "Improved stats",
          how_to_obtain: "Alchemist's flower quest (Lv 850), Colosseum quest, $500,000",
        },
        {
          version: 3,
          description: "Advanced form",
          stats: "High power",
          how_to_obtain: "V2 required, Level 1000, Defeat naturally spawned Sea Beast, $2,000,000",
        },
        {
          version: 4,
          description: "Awakened form with gears",
          stats: "Maximum power with abilities",
          how_to_obtain: "V3 required, Blue Gear, Full Moon Trial (3+ races), Trial of Water",
          gears: [
            {
              name: "Awakening",
              type: "Yellow",
              description: "Unlocked by completing Trial of Water",
            },
            {
              name: "Tidal Wave",
              type: "Blue",
              limit: "Up to 2",
              tier1: "Creates water waves for crowd control and damage",
              tier2: "Increases wave size and damage output",
            },
            {
              name: "Adaptation",
              type: "Red",
              limit: "Up to 2",
              tier1: "Adapts to environmental conditions for defense",
              tier2: "Increases adaptation effectiveness and duration",
            },
            {
              name: "Final",
              type: "Yellow",
              description: "Improves awakening duration and energy gain",
            },
          ],
        },
      ],
    },
    {
      name: "Elf",
      canonName: "Sky Islander",
      obtain: "Rare starting race; also available from race rerolls with Tort (3,000 Fragments) or the shop",
      versions: [
        {
          version: 1,
          description: "Starting form",
          stats: "Balanced stats with mystical affinity",
          how_to_obtain: "Possible at start or reroll",
        },
        {
          version: 2,
          description: "Upgraded form",
          stats: "Improved mystical stats",
          how_to_obtain: "V1 Elf, Level 850, $500,000",
        },
        {
          version: 3,
          description: "Advanced form",
          stats: "High power",
          how_to_obtain: "V2 required, Level 1000, Defeat Diamond/Jeremy/Orbitus, $2,000,000",
        },
        {
          version: 4,
          description: "Awakened form with gears",
          stats: "Maximum power with abilities",
          how_to_obtain: "V3 required, Blue Gear, Full Moon Trial (3+ races), Trial of Magic",
          gears: [
            {
              name: "Awakening",
              type: "Yellow",
              description: "Unlocked by completing Trial of Magic",
            },
            {
              name: "Mystic Burst",
              type: "Blue",
              limit: "Up to 2",
              tier1: "Releases mystical energy for area damage",
              tier2: "Increases burst radius and energy efficiency",
            },
            {
              name: "Mana Shield",
              type: "Red",
              limit: "Up to 2",
              tier1: "Uses mana to protect from damage",
              tier2: "Increases mana efficiency and shield strength",
            },
            {
              name: "Final",
              type: "Yellow",
              description: "Improves awakening duration and energy gain",
            },
          ],
        },
      ],
    },
    {
      name: "Giant",
      canonName: "Giant",
      obtain: "Rare starting race; also available from race rerolls with Tort (3,000 Fragments) or the shop",
      versions: [
        {
          version: 1,
          description: "Starting form",
          stats: "High defense and melee damage",
          how_to_obtain: "Possible at start or reroll",
        },
        {
          version: 2,
          description: "Upgraded form",
          stats: "Improved defense",
          how_to_obtain: "V1 Giant, Level 850, $500,000",
        },
        {
          version: 3,
          description: "Advanced form",
          stats: "Very high power",
          how_to_obtain: "V2 required, Level 1000, Defeat Diamond/Jeremy/Orbitus, $2,000,000",
        },
        {
          version: 4,
          description: "Awakened form with gears",
          stats: "Maximum power with abilities",
          how_to_obtain: "V3 required, Blue Gear, Full Moon Trial (3+ races), Trial of Strength",
          gears: [
            {
              name: "Awakening",
              type: "Yellow",
              description: "Unlocked by completing Trial of Strength",
            },
            {
              name: "Colossus",
              type: "Blue",
              limit: "Up to 2",
              tier1: "Increases size and damage output",
              tier2: "Extends growth duration and increases knockback",
            },
            {
              name: "Fortitude",
              type: "Red",
              limit: "Up to 2",
              tier1: "Hardens body to reduce incoming damage",
              tier2: "Increases damage reduction and duration",
            },
            {
              name: "Final",
              type: "Yellow",
              description: "Improves awakening duration and energy gain",
            },
          ],
        },
      ],
    },
    {
      name: "Angel",
      canonName: "Celestial Being",
      obtain: "Very rare starting race; also available from race rerolls with Tort (3,000 Fragments) or the shop",
      versions: [
        {
          version: 1,
          description: "Starting form",
          stats: "Balanced with flight capabilities",
          how_to_obtain: "Possible at start or reroll",
        },
        {
          version: 2,
          description: "Upgraded form",
          stats: "Improved speed and flight",
          how_to_obtain: "V1 Angel, Level 850, $500,000",
        },
        {
          version: 3,
          description: "Advanced form",
          stats: "High power",
          how_to_obtain: "V2 required, Level 1000, Defeat naturally spawned Sea Beast, $2,000,000",
        },
        {
          version: 4,
          description: "Awakened form with gears",
          stats: "Maximum power with abilities",
          how_to_obtain: "V3 required, Blue Gear, Full Moon Trial (3+ races), Trial of Speed",
          gears: [
            {
              name: "Awakening",
              type: "Yellow",
              description: "Unlocked by completing Trial of Speed",
            },
            {
              name: "Wings of Light",
              type: "Blue",
              limit: "Up to 2",
              tier1: "Enhances flight speed and maneuverability",
              tier2: "Increases acceleration and air control",
            },
            {
              name: "Divine Protection",
              type: "Red",
              limit: "Up to 2",
              tier1: "Creates divine aura for defense and healing",
              tier2: "Increases healing effectiveness and aura radius",
            },
            {
              name: "Final",
              type: "Yellow",
              description: "Improves awakening duration and energy gain",
            },
          ],
        },
      ],
    },
    {
      name: "Demon",
      canonName: "Demon",
      obtain: "Very rare starting race; also available from race rerolls with Tort (3,000 Fragments) or the shop",
      versions: [
        {
          version: 1,
          description: "Starting form",
          stats: "Balanced with dark power",
          how_to_obtain: "Possible at start or reroll",
        },
        {
          version: 2,
          description: "Upgraded form",
          stats: "Improved dark stats",
          how_to_obtain: "V1 Demon, Level 850, $500,000",
        },
        {
          version: 3,
          description: "Advanced form",
          stats: "High power",
          how_to_obtain: "V2 required, Level 1000, Defeat Diamond/Jeremy/Orbitus, $2,000,000",
        },
        {
          version: 4,
          description: "Awakened form with gears",
          stats: "Maximum power with abilities",
          how_to_obtain: "V3 required, Blue Gear, Full Moon Trial (3+ races), Trial of Darkness",
          gears: [
            {
              name: "Awakening",
              type: "Yellow",
              description: "Unlocked by completing Trial of Darkness",
            },
            {
              name: "Shadow Inferno",
              type: "Blue",
              limit: "Up to 2",
              tier1: "Unleashes dark fire for massive damage",
              tier2: "Increases damage and flame radius",
            },
            {
              name: "Demonic Pact",
              type: "Red",
              limit: "Up to 2",
              tier1: "Trades health for increased power and speed",
              tier2: "Improves power multiplier and reduces health cost",
            },
            {
              name: "Final",
              type: "Yellow",
              description: "Improves awakening duration and energy gain",
            },
          ],
        },
      ],
    },
    {
      name: "Draco",
      canonName: "Dragon Humanoid",
      obtain: "Requires awakening another race to V4; available from race rerolls with Tort (3,000 Fragments) or the shop",
      versions: [
        {
          version: 1,
          description: "Starting form",
          stats: "Balanced with dragon affinity",
          how_to_obtain: "Unlock by awakening any race to V4, then reroll or shop",
        },
        {
          version: 2,
          description: "Upgraded form",
          stats: "Improved dragon stats",
          how_to_obtain: "V1 Draco, Level 850, $500,000",
        },
        {
          version: 3,
          description: "Advanced form",
          stats: "Very high power",
          how_to_obtain: "V2 required, Level 1000, Defeat naturally spawned Sea Beast, $2,000,000",
        },
        {
          version: 4,
          description: "Awakened form with gears",
          stats: "Maximum power with dragon abilities",
          how_to_obtain: "V3 required, Blue Gear NOT required, Full Moon Trial (1 race only), Trial of Dragons",
          gears: [
            {
              name: "Awakening",
              type: "Yellow",
              description: "Unlocked by completing Trial of Dragons",
            },
            {
              name: "Dragon's Roar",
              type: "Blue",
              limit: "Up to 4",
              tier1: "Unleashes draconic roar for crowd control",
              tier2: "Increases roar damage and knockback",
            },
            {
              name: "Dragon Scales",
              type: "Red",
              limit: "Up to 4",
              tier1: "Hardens scales for exceptional defense",
              tier2: "Increases defense multiplier and reflect damage",
            },
            {
              name: "Final",
              type: "Yellow",
              description: "Improves awakening duration and energy gain",
            },
          ],
        },
      ],
    },
  ];

  const list = document.querySelector("#races-list");

  if (!list) {
    throw new Error("Races tracker controls are missing.");
  }

  const raceList = list;
  let activeSection = null;

  async function animateItems(items, entering) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const visible = { opacity: 1, transform: "translateY(0)" };
    const hidden = { opacity: 0, transform: "translateY(-0.5rem)" };

    const animations = items.map((item, index) =>
      item.animate(entering ? [hidden, visible] : [visible, hidden], {
        duration: entering ? 180 : 140,
        delay: (entering ? index : items.length - 1 - index) * 22,
        easing: entering ? "cubic-bezier(0.16, 1, 0.3, 1)" : "ease-in",
        fill: "both",
      })
    );

    await Promise.all(animations.map((animation) => animation.finished));
    animations.forEach((animation) => animation.cancel());
  }

  async function animateDetailsContent(details, entering) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(details.children);
    const visible = { opacity: 1, transform: "translateY(0)" };
    const hidden = { opacity: 0, transform: "translateY(-0.5rem)" };

    const animations = items.map((item, index) =>
      item.animate(entering ? [hidden, visible] : [visible, hidden], {
        duration: entering ? 180 : 140,
        delay: (entering ? index : items.length - 1 - index) * 22,
        easing: entering ? "cubic-bezier(0.16, 1, 0.3, 1)" : "ease-in",
        fill: "both",
      })
    );

    await Promise.all(animations.map((animation) => animation.finished));
    animations.forEach((animation) => animation.cancel());
  }

  function renderRaces() {
    raceList.innerHTML = "";

    const ul = document.createElement("ul");
    const items = [];

    racesData.forEach((race) => {
      const li = document.createElement("li");
      li.className = "race-row";

      const header = document.createElement("div");
      header.className = "race-row-header";

      const headerLeft = document.createElement("div");
      headerLeft.className = "race-row-header-left";

      const chevron = document.createElement("div");
      chevron.className = "race-row-chevron";
      chevron.textContent = "▶";

      const label = document.createElement("label");
      label.innerHTML = `<strong>${race.name}</strong> - ${race.canonName}`;

      headerLeft.appendChild(chevron);
      headerLeft.appendChild(label);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.setAttribute("aria-label", `Obtained ${race.name}`);
      checkbox.addEventListener("click", (e) => e.stopPropagation());

      header.appendChild(headerLeft);
      header.appendChild(checkbox);

      const details = document.createElement("div");
      details.className = "race-row-details";

      const tabsContainer = document.createElement("div");
      tabsContainer.className = "race-tabs";

      const infoBtn = document.createElement("button");
      infoBtn.className = "race-tab-btn active";
      infoBtn.textContent = "Info";
      infoBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        infoBtn.classList.add("active");
        gearsBtn.classList.remove("active");
        infoContent.classList.add("active");
        gearsContent.classList.remove("active");
      });
      tabsContainer.appendChild(infoBtn);

      const gearsBtn = document.createElement("button");
      gearsBtn.className = "race-tab-btn";
      gearsBtn.textContent = "Gears";
      gearsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        gearsBtn.classList.add("active");
        infoBtn.classList.remove("active");
        gearsContent.classList.add("active");
        infoContent.classList.remove("active");
      });
      tabsContainer.appendChild(gearsBtn);

      details.appendChild(tabsContainer);

      const infoContent = document.createElement("div");
      infoContent.className = "race-tab-content active";

      const obtainP = document.createElement("p");
      obtainP.innerHTML = `<strong>How to Obtain:</strong> ${race.obtain}`;
      infoContent.appendChild(obtainP);

      race.versions.forEach((version) => {
        const versionDiv = document.createElement("div");
        versionDiv.className = "race-version";

        const versionHeader = document.createElement("div");
        versionHeader.className = "version-header";
        versionHeader.innerHTML = `<strong>Version ${version.version}</strong>`;
        versionDiv.appendChild(versionHeader);

        const versionContent = document.createElement("div");
        versionContent.className = "version-content";

        const descP = document.createElement("p");
        descP.innerHTML = `<strong>Description:</strong> ${version.description}`;
        versionContent.appendChild(descP);

        const statsP = document.createElement("p");
        statsP.innerHTML = `<strong>Stats:</strong> ${version.stats}`;
        versionContent.appendChild(statsP);

        const obtainVP = document.createElement("p");
        obtainVP.innerHTML = `<strong>How to Obtain:</strong> ${version.how_to_obtain}`;
        versionContent.appendChild(obtainVP);

        versionDiv.appendChild(versionContent);
        infoContent.appendChild(versionDiv);
      });

      details.appendChild(infoContent);

      const gearsContent = document.createElement("div");
      gearsContent.className = "race-tab-content";

      race.versions.forEach((version) => {
        if (version.gears && version.gears.length > 0) {
          const versionDiv = document.createElement("div");
          versionDiv.className = "race-version";

          const versionHeader = document.createElement("div");
          versionHeader.className = "version-header";
          versionHeader.innerHTML = `<strong>Version ${version.version} Gears</strong>`;
          versionDiv.appendChild(versionHeader);

          const graphContainer = document.createElement("div");
          graphContainer.className = "gear-graph-container";
          const graphScroll = document.createElement("div");
          graphScroll.className = "race-gear-scroll";
          const graph = document.createElement("div");
          graph.className = "race-gear-graph";
          graph.setAttribute("role", "group");
          graph.setAttribute("aria-label", `${race.name} gear selection`);

          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute("viewBox", "0 0 640 480");
          svg.setAttribute("preserveAspectRatio", "none");
          svg.setAttribute("aria-hidden", "true");
          svg.classList.add("gear-links");
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", "M120 80 L320 240 L520 80 M320 240 L120 400 L320 400");
          path.setAttribute("stroke", "#82b4a3");
          path.setAttribute("stroke-width", "3");
          path.setAttribute("fill", "none");
          path.setAttribute("stroke-linecap", "round");
          path.setAttribute("stroke-linejoin", "round");
          svg.appendChild(path);
          graph.appendChild(svg);

          const gearNodes = {};
          const gearChecks = {};
          const gearData = [
            { slot: "I", label: "Awakening", position: "awakening", checkbox: true },
            { slot: "II", label: "Gear II", position: "two" },
            { slot: "III", label: "Gear III", position: "three" },
            { slot: "IV", label: "Gear IV", position: "four" },
            { slot: "Final", label: "Final gear", position: "final", checkbox: true },
          ];
          gearData.forEach((data) => {
            const wrapper = document.createElement("div");
            wrapper.className = `race-gear-position race-gear-${data.position}`;
            const node = document.createElement(data.checkbox ? "label" : "button");
            node.className = `race-gear-node ${data.checkbox ? "race-gear-gold" : "race-gear-ability"}`;
            if (data.checkbox) {
              const input = document.createElement("input");
              input.type = "checkbox";
              input.setAttribute("aria-label", `${race.name} ${data.label} obtained`);
              gearChecks[data.slot] = input;
              node.appendChild(input);
            } else {
              node.type = "button";
              node.setAttribute("aria-label", `Choose ${race.name} ${data.label}`);
              node.setAttribute("aria-expanded", "false");
              gearNodes[data.slot] = node;
            }
            const text = document.createElement("span");
            text.textContent = data.slot;
            node.appendChild(text);
            wrapper.appendChild(node);
            graph.appendChild(wrapper);
          });
          graphScroll.appendChild(graph);
          graphContainer.appendChild(graphScroll);

          // Gear choice area - details for each slot
          const choiceArea = document.createElement("div");
          choiceArea.className = "gear-choices";
          choiceArea.hidden = true;
          choiceArea.style.width = "100%";
          choiceArea.style.maxWidth = "1200px";
          choiceArea.style.padding = "1.5rem";
          choiceArea.style.backgroundColor = "rgba(13, 42, 47, 0.7)";
          choiceArea.style.borderRadius = "0.3rem";
          choiceArea.style.border = "1px solid #4d8991";
          choiceArea.style.marginTop = "2rem";

          const blueGear = version.gears.find(g => g.type === "Blue");
          const redGear = version.gears.find(g => g.type === "Red");
          const slotDetailsByGear = {};
          const sequenceStatus = document.createElement("p");
          sequenceStatus.className = "race-gear-sequence-status";
          sequenceStatus.id = `${race.name.toLowerCase()}-gear-sequence-${version.version}`;
          sequenceStatus.setAttribute("role", "status");
          graphContainer.appendChild(sequenceStatus);

          function updateGearSequence() {
            const slots = ["II", "III", "IV"];
            let unlocked = gearChecks.I.checked;
            let missing = unlocked ? null : "Awakening (I)";
            slots.forEach((gear) => {
              const node = gearNodes[gear];
              node.disabled = !unlocked;
              if (!unlocked && !slotDetailsByGear[gear].hidden) {
                slotDetailsByGear[gear].hidden = true;
                choiceArea.hidden = true;
                node.setAttribute("aria-expanded", "false");
              }
              if (unlocked && (!node.dataset.color || node.dataset.color === "none")) {
                missing = `Gear ${gear}`;
                unlocked = false;
              }
            });
            gearChecks.Final.disabled = !unlocked;
            sequenceStatus.textContent = missing
              ? `Complete ${missing} to unlock the next gear. Later selections are preserved.`
              : "All gear slots are unlocked.";
          }

          gearChecks.I.addEventListener("change", updateGearSequence);
          gearChecks.Final.setAttribute("aria-describedby", sequenceStatus.id);

          // Ability gears details
          ["II", "III", "IV"].forEach((gear, idx) => {
            const slotDetails = document.createElement("div");
            slotDetails.className = "gear-detail-section";
            slotDetails.hidden = true;
            slotDetailsByGear[gear] = slotDetails;
            slotDetails.id = `${race.name.toLowerCase()}-gear-choices-${idx + 2}`;
            const gearNode = gearNodes[gear];
            gearNode.setAttribute("aria-controls", slotDetails.id);
            gearNode.setAttribute("aria-describedby", sequenceStatus.id);
            gearNode.addEventListener("click", () => {
              const opening = slotDetails.hidden;
              choiceArea.querySelectorAll(".gear-detail-section").forEach((section) => {
                section.hidden = true;
              });
              Object.values(gearNodes).forEach((node) => node.setAttribute("aria-expanded", "false"));
              slotDetails.hidden = !opening;
              choiceArea.hidden = !opening;
              gearNode.setAttribute("aria-expanded", String(opening));
            });
            slotDetails.style.marginBottom = "1rem";
            slotDetails.style.padding = "1rem";
            slotDetails.style.border = "1px solid #3a6a74";
            slotDetails.style.borderRadius = "0.3rem";
            slotDetails.style.backgroundColor = "rgba(10, 20, 24, 0.5)";

            const detailHeader = document.createElement("div");
            detailHeader.style.fontWeight = "700";
            detailHeader.style.color = "#f4ca7a";
            detailHeader.style.marginBottom = "0.75rem";
            detailHeader.style.fontSize = "1rem";
            detailHeader.textContent = `Slot ${gear}`;
            slotDetails.appendChild(detailHeader);

            const optionConfigs = [
              { value: "none", label: "Empty", border: "#4d8991" },
              {
                value: "blue",
                label: blueGear?.name || "Blue Gear",
                border: "#8ed3ec",
                tier1: blueGear?.tier1,
                tier2: blueGear?.tier2,
              },
              {
                value: "red",
                label: redGear?.name || "Red Gear",
                border: "#f2a59a",
                tier1: redGear?.tier1,
                tier2: redGear?.tier2,
              },
            ];

            optionConfigs.forEach((config) => {
              const optionDiv = document.createElement("div");
              optionDiv.style.marginBottom = "0.75rem";
              optionDiv.style.padding = "0.75rem";
              optionDiv.style.borderLeft = `3px solid ${config.border}`;
              optionDiv.style.backgroundColor = "rgba(13, 42, 47, 0.3)";
              optionDiv.style.cursor = "pointer";
              optionDiv.style.borderRadius = "0.3rem";
              optionDiv.style.transition = "all 0.2s ease";

              const label = document.createElement("label");
              label.style.display = "flex";
              label.style.alignItems = "center";
              label.style.cursor = "pointer";
              label.style.marginBottom = "0.5rem";

              const input = document.createElement("input");
              input.type = "radio";
              input.name = `${race.name.toLowerCase()}-gear-${version.version}-slot-${idx + 2}`;
              input.value = config.value;
              input.checked = config.value === "none";
              input.style.marginRight = "0.5rem";
              input.style.cursor = "pointer";
              input.addEventListener("change", () => {
                gearNode.dataset.color = input.value;
                updateGearSequence();
              });

              const labelText = document.createElement("span");
              labelText.style.fontWeight = "600";
              labelText.style.color = "#ffe1a0";
              labelText.textContent = config.label;

              label.appendChild(input);
              label.appendChild(labelText);
              optionDiv.appendChild(label);

              if (config.tier1 || config.tier2) {
                const tier1P = document.createElement("p");
                tier1P.style.margin = "0.4rem 0 0.2rem 1.5rem";
                tier1P.style.fontSize = "0.85rem";
                tier1P.style.color = "#c9e4de";
                tier1P.innerHTML = `<strong>Tier 1:</strong> ${config.tier1}`;
                optionDiv.appendChild(tier1P);

                const tier2P = document.createElement("p");
                tier2P.style.margin = "0.2rem 0 0 1.5rem";
                tier2P.style.fontSize = "0.85rem";
                tier2P.style.color = "#c9e4de";
                tier2P.innerHTML = `<strong>Tier 2:</strong> ${config.tier2}`;
                optionDiv.appendChild(tier2P);
              }

              optionDiv.addEventListener("mouseenter", () => {
                optionDiv.style.backgroundColor = "rgba(22, 78, 88, 0.5)";
              });

              optionDiv.addEventListener("mouseleave", () => {
                optionDiv.style.backgroundColor = "rgba(13, 42, 47, 0.3)";
              });

              slotDetails.appendChild(optionDiv);
            });

            choiceArea.appendChild(slotDetails);
          });

          graphContainer.appendChild(choiceArea);
          updateGearSequence();
          versionDiv.appendChild(graphContainer);
          gearsContent.appendChild(versionDiv);
        }
      });

      details.appendChild(gearsContent);

      li.appendChild(header);
      li.appendChild(details);

      header.addEventListener("click", async (e) => {
        e.preventDefault();
        const isExpanding = !li.classList.contains("expanded");
        li.classList.toggle("expanded");

        if (isExpanding) {
          await animateDetailsContent(details, true);
        }
      });

      ul.appendChild(li);
      items.push(li);
    });

    raceList.appendChild(ul);
    activeSection = items;
    animateItems(items, true);
  }

  renderRaces();
})();
