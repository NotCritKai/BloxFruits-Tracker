"use strict";
(() => {
  const fightingStyleGroups = [
    {
      sea: "First Sea (Starter)",
      styles: [
        {
          name: "Melee",
          canonName: "Basic Martial Arts",
          cost: "Free",
          location: "Available from the beginning",
          moves: [
            "Basic Punch (M1) - Basic melee attack",
            "Charge Punch (Hold M1) - Charge attack for increased damage",
            "Uppercut (Jump + M1) - Upward punch",
          ],
        },
        {
          name: "Karate",
          canonName: "Fishman Karate",
          cost: "$3,000 or 300 Fragments",
          location: "Island South (Training Dummy Area)",
          moves: [
            "Combo (M1) - Quick sequence of kicks and punches",
            "Flash Step (MMB) - Dash forward",
            "Leg Sweep (Shift + M1) - Low sweep attack",
            "Rising Kick (Jump + M1) - Upward kick",
          ],
        },
        {
          name: "Bazooka",
          canonName: "Cyborg Combat",
          cost: "$3,000 or 300 Fragments",
          location: "Island South (Training Dummy Area)",
          moves: [
            "Rocket Punch (M1) - Launches explosive projectile",
            "Heavy Charge (Hold M1) - Charge for increased damage",
            "Rocket Storm (Shift + M1 in air) - Multiple rockets",
          ],
        },
      ],
    },
    {
      sea: "Second Sea",
      styles: [
        {
          name: "Superhuman",
          canonName: "Rokushiki",
          cost: "$3,000,000",
          location: "Fajita Island (Colosseum Area)",
          moves: [
            "Speed Burst (M1) - Fast successive strikes",
            "Shave (MMB) - Dash ability for quick evasion",
            "Spiked Tackle (Shift + M1) - Tackle attack that knocks down enemies",
            "Devastating Kick (E or Click+Hold) - Powerful kick with great knockback",
          ],
        },
        {
          name: "Sharkman Karate",
          canonName: "Sharkman Karate",
          cost: "$1,000,000 or $500,000",
          location: "Fajita Island (Colosseum Area) - Sharkman Quest",
          moves: [
            "Shark Bite (M1) - Quick bite attack",
            "Shark Dash (MMB) - Quick evasion dash",
            "Shark Bombardment (Shift + M1) - Multiple projectile attack",
            "Shark Tornado (E or Space) - Spinning attack",
          ],
        },
      ],
    },
    {
      sea: "Third Sea",
      styles: [
        {
          name: "Electric Claw",
          cost: "$3,000,000 and 5,000 Fragments",
          location: "Previous Hero, Floating Turtle. Requires 400 mastery in Electric and completion of his timed quest.",
          moves: [
            "Electric Rampage (Z, 110 mastery) - Electrified slashes followed by a dash",
            "Lightning Thrust (X, 220 mastery) - A forward thrust ending in an electrical explosion",
            "Thunderclap and Flash (C, 330 mastery) - A rapid series of dashes and a slam",
          ],
        },
        {
          name: "Dragon Talon",
          canonName: "Dragon Claw",
          cost: "$3,000,000 and 5,000 Fragments",
          location: "Uzoth, Dragon Dojo on Hydra Island. Requires 400 mastery in Dragon Breath and giving Uzoth Fire Essence.",
          moves: [
            "Talon Lighter (Z, 125 mastery) - A burning grab and kick",
            "Ember Annihilation (X, 250 mastery) - Launches a fiery dragon projectile",
            "Infernal Vortex (C, 350 mastery) - A fiery vortex that carries and blasts enemies",
          ],
        },
        {
          name: "Godhuman",
          canonName: "Rokushiki",
          cost: "$5,000,000 and 5,000 Fragments",
          location: "Ancient Monk, Floating Turtle. Requires 400 mastery in Superhuman, Death Step, Sharkman Karate, Electric Claw and Dragon Talon, plus 20 Fish Tails, 20 Magma Ore, 10 Mystic Droplets and 10 Dragon Scales.",
          moves: [
            "Soaring Beast (Z, 125 mastery) - Rushes an enemy with a flurry of strikes",
            "Heaven and Earth (X, 250 mastery) - An attack with tap and held variants",
            "Sixth Realm Gun (C, 350 mastery) - A fast, powerful strike with tap and held variants",
          ],
        },
        {
          name: "Sanguine Art",
          cost: "$5,000,000 and 5,000 Fragments",
          location: "Shafi, Tiki Outpost. Requires a Leviathan Heart, 2 Dark Fragments, 20 Demonic Wisps and 20 Vampire Fangs.",
          moves: [
            "Bloodbane Drain (Z, 125 mastery) - Grabs an enemy and drains health",
            "Scarlet Tear (X, 250 mastery) - A series of slashes followed by an explosion",
            "Devourer of Worlds (C, 350 mastery) - Summons dark energy and tracking projectiles",
          ],
        },
      ],
    },
  ];

  const list = document.querySelector("#fighting-styles-list");
  const navigation = document.querySelector("#sea-nav");

  if (!list || !navigation) {
    throw new Error("Fighting styles tracker controls are missing.");
  }

  const seaList = list;
  const seaNavigation = navigation;
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
    const buttons = fightingStyleGroups.map((group) => {
      const button = document.createElement("button");
      button.textContent = group.sea;
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => selectSea(group.sea));
      return button;
    });

    seaNavigation.append(...buttons);
  }

  function selectSea(seaName) {
    const buttons = seaNavigation.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.textContent === seaName ? "true" : "false");
    });
    changingSection = true;
    renderStyles(seaName);
  }

  async function renderStyles(seaName) {
    const group = fightingStyleGroups.find((g) => g.sea === seaName);

    if (!group) return;

    seaList.innerHTML = "";

    const groupDiv = document.createElement("div");
    groupDiv.className = "style-group";

    const title = document.createElement("h2");
    title.textContent = group.sea;
    groupDiv.appendChild(title);

    const ul = document.createElement("ul");
    const items = [title];

    group.styles.forEach((style) => {
      const li = document.createElement("li");
      li.className = "style-row";

      const header = document.createElement("div");
      header.className = "style-row-header";

      const headerLeft = document.createElement("div");
      headerLeft.className = "style-row-header-left";

      const chevron = document.createElement("div");
      chevron.className = "style-row-chevron";
      chevron.textContent = "▶";

      const label = document.createElement("label");
      label.innerHTML = `<strong>${style.name}</strong>${style.canonName ? ` - ${style.canonName}` : ""}`;

      headerLeft.appendChild(chevron);
      headerLeft.appendChild(label);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.setAttribute("aria-label", `Obtained ${style.name}`);
      checkbox.addEventListener("click", (e) => e.stopPropagation());

      header.appendChild(headerLeft);
      header.appendChild(checkbox);

      const details = document.createElement("div");
      details.className = "style-row-details";

      const costP = document.createElement("p");
      costP.innerHTML = `<strong>Cost:</strong> ${style.cost}`;
      details.appendChild(costP);

      const locationP = document.createElement("p");
      locationP.innerHTML = `<strong>Location:</strong> ${style.location}`;
      details.appendChild(locationP);

      const movesP = document.createElement("p");
      movesP.innerHTML = "<strong>Moves:</strong>";
      details.appendChild(movesP);

      const movesList = document.createElement("ul");
      style.moves.forEach((move) => {
        const moveLi = document.createElement("li");
        moveLi.textContent = move;
        movesList.appendChild(moveLi);
      });
      details.appendChild(movesList);

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
    seaList.appendChild(groupDiv);
    activeSection = items;
    await animateItems(items, true);
    changingSection = false;
  }

  renderSeaButtons();
  selectSea("First Sea (Starter)");
})();
