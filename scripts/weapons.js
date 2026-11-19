"use strict";
(() => {
  const weaponGroups = [
    {
      type: "Swords",
      weapons: [
        {
          name: "Katana",
          canonName: "Katana",
          rarity: "Common",
          cost: "250 Beli",
          location: "Starter Shop / Weapon Dealers",
          damage: "Low",
          image: "../assets/weapons/katana.png",
          description: "A basic sword for beginners.",
          abilities: [
            "M1 Combo - Basic sword slashes",
            "Air Slash - Projectile attack",
          ],
        },
        {
          name: "Longsword",
          canonName: "Longsword",
          rarity: "Uncommon",
          cost: "1,500 Beli",
          location: "Weapon Shops",
          damage: "Medium",
          image: "../assets/weapons/longsword.png",
          description: "A versatile long blade with balanced stats.",
          abilities: [
            "Heavy Slash - Powerful vertical slash",
            "Horizontal Slash - Wide sweep",
          ],
        },
        {
          name: "Cutlass",
          canonName: "Cutlass",
          rarity: "Uncommon",
          cost: "1,000 Beli",
          location: "Weapon Shops",
          damage: "Medium",
          image: "../assets/weapons/cutlass.png",
          description: "A curved sword with good damage.",
          abilities: [
            "Curved Slash - Wider attack arc",
            "Spinning Slash - 360 slash",
          ],
        },
        {
          name: "Broadsword",
          canonName: "Broadsword",
          rarity: "Rare",
          cost: "5,000 Beli",
          location: "Colosseum / Advanced Shops",
          damage: "High",
          image: "../assets/weapons/broadsword.png",
          description: "A large sword with tremendous power.",
          abilities: [
            "Heavy Strike - Powerful attack",
            "Cleave - Large area attack",
          ],
        },
        {
          name: "Pole",
          canonName: "Bo Staff",
          rarity: "Common",
          cost: "250 Beli",
          location: "Starter Shop",
          damage: "Low",
          image: "../assets/weapons/pole.png",
          description: "A wooden staff for combat.",
          abilities: [
            "Staff Strike - Basic staff attack",
            "Spinning Attack - 360-degree spin",
          ],
        },
        {
          name: "Bisento",
          canonName: "Bisento",
          rarity: "Rare",
          cost: "7,500 Beli",
          location: "Advanced Weapon Shops",
          damage: "High",
          image: "../assets/weapons/bisento.png",
          description: "A legendary halberd with great reach.",
          abilities: [
            "Heavy Swing - Powerful sweeps",
            "Piercing Thrust - Armor-piercing strike",
          ],
        },
        {
          name: "Trident",
          canonName: "Trident",
          rarity: "Rare",
          cost: "6,000 Beli",
          location: "Colosseum / Advanced Areas",
          damage: "High",
          image: "../assets/weapons/trident.png",
          description: "A three-pronged spear of great power.",
          abilities: [
            "Triple Strike - Three simultaneous hits",
            "Thrust Attack - Forward jab",
          ],
        },
        {
          name: "Yama",
          canonName: "Yama",
          rarity: "Legendary",
          cost: "50,000 Beli",
          location: "Boss Drops / Rare Chests",
          damage: "Very High",
          image: "../assets/weapons/yama.png",
          description: "One of the most powerful swords in the game.",
          abilities: [
            "Godly Slash - Ultimate slash attack",
            "Void Rend - Devastating area attack",
          ],
        },
      ],
    },
    {
      type: "Guns",
      weapons: [
        {
          name: "Flintlock",
          canonName: "Flintlock Pistol",
          rarity: "Common",
          cost: "300 Beli",
          location: "Gun Dealers / Weapon Shops",
          damage: "Low",
          image: "../assets/weapons/flintlock.png",
          description: "Classic single-shot pistol.",
          abilities: [
            "Single Shot - Basic bullet",
            "Aimed Shot - More accurate shot",
          ],
        },
        {
          name: "Double Flintlock",
          canonName: "Dual Flintlock",
          rarity: "Uncommon",
          cost: "1,500 Beli",
          location: "Gun Shops",
          damage: "Medium",
          image: "../assets/weapons/double-flintlock.png",
          description: "Two pistols for double the firepower.",
          abilities: [
            "Dual Shot - Fire both pistols",
            "Rapid Fire - Quick succession shots",
          ],
        },
        {
          name: "Musket",
          canonName: "Musket",
          rarity: "Uncommon",
          cost: "2,000 Beli",
          location: "Advanced Gun Shops",
          damage: "Medium-High",
          image: "../assets/weapons/musket.png",
          description: "Long-range rifle with great accuracy.",
          abilities: [
            "Aimed Shot - Precise bullet",
            "Charged Shot - Hold for more damage",
          ],
        },
        {
          name: "Refined Flintlock",
          canonName: "Refined Flintlock",
          rarity: "Rare",
          cost: "5,000 Beli",
          location: "Colosseum / Secret Gun Masters",
          damage: "High",
          image: "../assets/weapons/refined-flintlock.png",
          description: "An expertly crafted pistol with enhanced damage.",
          abilities: [
            "Energy Shot - Projectile with energy",
            "Burst Fire - Multiple rapid shots",
          ],
        },
        {
          name: "Shotgun",
          canonName: "Shotgun",
          rarity: "Rare",
          cost: "7,500 Beli",
          location: "Advanced Weapon Shops",
          damage: "High",
          image: "../assets/weapons/shotgun.png",
          description: "Close-range spread gun with massive damage.",
          abilities: [
            "Buckshot - Spread pattern shots",
            "Knockback Wave - Pushes enemies back",
          ],
        },
      ],
    },
  ];

  const list = document.querySelector("#weapons-list");
  const navigation = document.querySelector("#weapon-type-nav");

  if (!list || !navigation) {
    throw new Error("Weapons tracker controls are missing.");
  }

  const weaponList = list;
  const weaponNavigation = navigation;
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

  function renderWeaponTypeButtons() {
    const buttons = weaponGroups.map((group) => {
      const button = document.createElement("button");
      button.textContent = group.type;
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => selectWeaponType(group.type));
      return button;
    });

    weaponNavigation.append(...buttons);
  }

  function selectWeaponType(typeName) {
    const buttons = weaponNavigation.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.textContent === typeName ? "true" : "false");
    });
    changingSection = true;
    renderWeapons(typeName);
  }

  async function renderWeapons(typeName) {
    const group = weaponGroups.find((g) => g.type === typeName);

    if (!group) return;

    weaponList.innerHTML = "";

    const groupDiv = document.createElement("div");
    groupDiv.className = "weapon-group";

    const title = document.createElement("h2");
    title.textContent = group.type;
    groupDiv.appendChild(title);

    const ul = document.createElement("ul");
    const items = [title];

    group.weapons.forEach((weapon) => {
      const li = document.createElement("li");
      li.className = "weapon-row";

      const header = document.createElement("div");
      header.className = "weapon-row-header";

      const headerLeft = document.createElement("div");
      headerLeft.className = "weapon-row-header-left";

      const chevron = document.createElement("div");
      chevron.className = "weapon-row-chevron";
      chevron.textContent = "▶";

      const label = document.createElement("label");
      label.innerHTML = `<strong>${weapon.name}</strong> - ${weapon.canonName}`;

      headerLeft.appendChild(chevron);
      headerLeft.appendChild(label);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.setAttribute("aria-label", `Obtained ${weapon.name}`);
      checkbox.addEventListener("click", (e) => e.stopPropagation());

      header.appendChild(headerLeft);
      header.appendChild(checkbox);

      const details = document.createElement("div");
      details.className = "weapon-row-details";

      const imageContainer = document.createElement("div");
      imageContainer.className = "weapon-image-container";
      const img = document.createElement("img");
      img.src = weapon.image;
      img.alt = weapon.name;
      img.onerror = () => {
        imageContainer.textContent = "[Image unavailable]";
      };
      imageContainer.appendChild(img);
      details.appendChild(imageContainer);

      const descP = document.createElement("p");
      descP.innerHTML = `<strong>Description:</strong> ${weapon.description}`;
      details.appendChild(descP);

      const costP = document.createElement("p");
      costP.innerHTML = `<strong>Cost:</strong> ${weapon.cost}`;
      details.appendChild(costP);

      const locationP = document.createElement("p");
      locationP.innerHTML = `<strong>Location:</strong> ${weapon.location}`;
      details.appendChild(locationP);

      const damageP = document.createElement("p");
      damageP.innerHTML = `<strong>Damage:</strong> ${weapon.damage}`;
      details.appendChild(damageP);

      const abilitiesP = document.createElement("p");
      abilitiesP.innerHTML = "<strong>Abilities:</strong>";
      details.appendChild(abilitiesP);

      const abilitiesList = document.createElement("ul");
      weapon.abilities.forEach((ability) => {
        const abilityLi = document.createElement("li");
        abilityLi.textContent = ability;
        abilitiesList.appendChild(abilityLi);
      });
      details.appendChild(abilitiesList);

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
    weaponList.appendChild(groupDiv);
    activeSection = items;
    await animateItems(items, true);
    changingSection = false;
  }

  renderWeaponTypeButtons();
  selectWeaponType("Swords");
})();
