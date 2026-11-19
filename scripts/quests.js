"use strict";
(() => {
  const questGroups = [
    {
      sea: "Secret Quests",
      quests: [
        {
          name: "Superhuman Secret",
          npc: "Rob Lucci",
          level: "75+",
          rewards: "Superhuman Fighting Style",
          description: "Unlock the Superhuman fighting style by passing Rob Lucci's trials",
          objectives: ["Defeat Rob Lucci 3 times", "Survive intense combat tests", "Complete all trials"],
        },
        {
          name: "Dragon Talon Secret",
          npc: "Dragon Trainer",
          level: "75+",
          rewards: "Dragon Talon Fighting Style",
          description: "Master the Dragon Talon by training with the Dragon Trainer",
          objectives: ["Defeat Dragon Trainer", "Complete dragon trials", "Master the technique"],
        },
        {
          name: "Sharkman Secret",
          npc: "Sharkman",
          level: "75+",
          rewards: "Sharkman Karate Fighting Style",
          description: "Learn Sharkman Karate from the legendary Sharkman",
          objectives: ["Defeat Sharkman", "Complete Sharkman's trials", "Learn all techniques"],
        },
        {
          name: "God's Dimension Secret",
          npc: "Sky Island Ruler",
          level: "150+",
          rewards: "God Fruit spawn increase, rare items",
          description: "Prove yourself worthy in God's Dimension",
          objectives: ["Survive God's Dimension", "Defeat all guardians", "Collect divine artifacts"],
        },
        {
          name: "Dark Beast Hunt",
          npc: "Beast Master",
          level: "200+",
          rewards: "Dark Beast Hunting Key, rare loot",
          description: "Hunt down the dark beasts hidden in secret locations",
          objectives: ["Find hidden locations", "Defeat dark beasts", "Collect hunt tokens"],
        },
      ],
    },
    {
      sea: "Upgrade Quests",
      quests: [
        {
          name: "Race V1 Upgrade",
          npc: "Race Trainer",
          level: "Any",
          rewards: "Race V1 Form",
          description: "Upgrade your race to V1 form for increased stats",
          objectives: ["Collect 50 Fragments", "Complete race trials", "Reach upgrade threshold"],
        },
        {
          name: "Race V2 Upgrade",
          npc: "Advanced Race Trainer",
          level: "100+",
          rewards: "Race V2 Form",
          description: "Achieve V2 transformation with enhanced abilities",
          objectives: ["Collect 100 Fragments", "Complete advanced trials", "Defeat V2 guardian"],
        },
        {
          name: "Race V3 Upgrade",
          npc: "Ultimate Race Master",
          level: "250+",
          rewards: "Race V3 Form - Ultimate transformation",
          description: "Unlock the ultimate V3 form for your race",
          objectives: ["Collect 250 Fragments", "Complete V3 trials", "Defeat ultimate guardian"],
        },
        {
          name: "Weapon Upgrade - Yama",
          npc: "Weapon Master",
          level: "150+",
          rewards: "Yama Sword (Legendary weapon)",
          description: "Upgrade to the legendary Yama sword",
          objectives: ["Collect rare materials", "Complete weapon trials", "Defeat weapon guardian"],
        },
        {
          name: "Fruit Awakening Trial",
          npc: "Awakening Master",
          level: "200+",
          rewards: "Fruit Awakening ability",
          description: "Awaken your Devil Fruit for ultimate power",
          objectives: ["Complete awakening trials", "Collect awakening materials", "Master fruit control"],
        },
      ],
    },
  ];

  const list = document.querySelector("#quests-list");
  const navigation = document.querySelector("#quest-sea-nav");

  if (!list || !navigation) {
    throw new Error("Quests tracker controls are missing.");
  }

  const questList = list;
  const questNavigation = navigation;
  let activeSection = null;
  let changingSection = false;

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

  function renderSeaButtons() {
    const buttons = questGroups.map((group) => {
      const button = document.createElement("button");
      button.textContent = group.sea;
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => selectSea(group.sea));
      return button;
    });

    questNavigation.append(...buttons);
  }

  function selectSea(seaName) {
    const buttons = questNavigation.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.textContent === seaName ? "true" : "false");
    });
    changingSection = true;
    renderQuests(seaName);
  }

  async function renderQuests(seaName) {
    const group = questGroups.find((g) => g.sea === seaName);

    if (!group) return;

    questList.innerHTML = "";

    const groupDiv = document.createElement("div");
    groupDiv.className = "quest-group";

    const title = document.createElement("h2");
    title.textContent = group.sea;
    groupDiv.appendChild(title);

    const ul = document.createElement("ul");
    const items = [title];

    group.quests.forEach((quest) => {
      const li = document.createElement("li");
      li.className = "quest-row";

      const header = document.createElement("div");
      header.className = "quest-row-header";

      const headerLeft = document.createElement("div");
      headerLeft.className = "quest-row-header-left";

      const chevron = document.createElement("div");
      chevron.className = "quest-row-chevron";
      chevron.textContent = "▶";

      const label = document.createElement("label");
      label.innerHTML = `<strong>${quest.name}</strong> (Lvl ${quest.level})`;

      headerLeft.appendChild(chevron);
      headerLeft.appendChild(label);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.setAttribute("aria-label", `Completed ${quest.name}`);
      checkbox.addEventListener("click", (e) => e.stopPropagation());

      header.appendChild(headerLeft);
      header.appendChild(checkbox);

      const details = document.createElement("div");
      details.className = "quest-row-details";

      const npcP = document.createElement("p");
      npcP.innerHTML = `<strong>NPC:</strong> ${quest.npc}`;
      details.appendChild(npcP);

      const descP = document.createElement("p");
      descP.innerHTML = `<strong>Description:</strong> ${quest.description}`;
      details.appendChild(descP);

      const rewardsP = document.createElement("p");
      rewardsP.innerHTML = `<strong>Rewards:</strong> ${quest.rewards}`;
      details.appendChild(rewardsP);

      const objectivesP = document.createElement("p");
      objectivesP.innerHTML = "<strong>Objectives:</strong>";
      details.appendChild(objectivesP);

      const objectivesList = document.createElement("ul");
      quest.objectives.forEach((objective) => {
        const objectiveLi = document.createElement("li");
        objectiveLi.textContent = objective;
        objectivesList.appendChild(objectiveLi);
      });
      details.appendChild(objectivesList);

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

    groupDiv.appendChild(ul);
    questList.appendChild(groupDiv);
    activeSection = items;
    await animateItems(items, true);
    changingSection = false;
  }

  renderSeaButtons();
  selectSea("Secret Quests");
})();
