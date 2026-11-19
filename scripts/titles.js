"use strict";
(() => {
  const titleGroups = [
    {
      category: "Level Based",
      titles: [
        {
          name: "New Player",
          meaning: "Starting title given to all new players",
          how_to_obtain: "Given at the start of the game",
          description: "A title for those just beginning their adventure",
        },
        {
          name: "Apprentice",
          meaning: "Beginning fighter",
          how_to_obtain: "Reach Level 50",
          description: "You're learning the ways of Blox Fruits",
        },
        {
          name: "Warrior",
          meaning: "Proof of your combat prowess",
          how_to_obtain: "Reach Level 100",
          description: "You've proven yourself in battle",
        },
        {
          name: "Veteran",
          meaning: "Experienced fighter",
          how_to_obtain: "Reach Level 250",
          description: "You have extensive combat experience",
        },
        {
          name: "Legendary",
          meaning: "Among the greatest fighters",
          how_to_obtain: "Reach Level 500",
          description: "Your name is known throughout the seas",
        },
      ],
    },
    {
      category: "Bounty Based",
      titles: [
        {
          name: "Pirate",
          meaning: "Have a bounty on your head",
          how_to_obtain: "Get any bounty amount",
          description: "You've become a wanted criminal",
        },
        {
          name: "Outlaw",
          meaning: "Significant bounty",
          how_to_obtain: "Reach 100,000 Bounty",
          description: "A serious threat to the authorities",
        },
        {
          name: "Pirate King",
          meaning: "Highest bounty holder",
          how_to_obtain: "Reach 1,000,000+ Bounty",
          description: "The most wanted pirate in the seas",
        },
      ],
    },
    {
      category: "Events & Codes",
      titles: [
        {
          name: "Big News",
          meaning: "Special event title",
          how_to_obtain: "Redeem code BIGNEWS",
          description: "Redeemable anytime, rewards given in 2nd Sea",
        },
      ],
    },
  ];

  const list = document.querySelector("#titles-list");
  const navigation = document.querySelector("#title-category-nav");

  if (!list || !navigation) {
    throw new Error("Titles tracker controls are missing.");
  }

  const titleList = list;
  const titleNavigation = navigation;
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

  function renderCategoryButtons() {
    const buttons = titleGroups.map((group) => {
      const button = document.createElement("button");
      button.textContent = group.category;
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => selectCategory(group.category));
      return button;
    });

    titleNavigation.append(...buttons);
  }

  function selectCategory(categoryName) {
    const buttons = titleNavigation.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.textContent === categoryName ? "true" : "false");
    });
    changingSection = true;
    renderTitles(categoryName);
  }

  async function renderTitles(categoryName) {
    const group = titleGroups.find((g) => g.category === categoryName);

    if (!group) return;

    titleList.innerHTML = "";

    const groupDiv = document.createElement("div");
    groupDiv.className = "title-group";

    const title = document.createElement("h2");
    title.textContent = group.category;
    groupDiv.appendChild(title);

    const ul = document.createElement("ul");
    const items = [title];

    group.titles.forEach((titleObj) => {
      const li = document.createElement("li");
      li.className = "title-row";

      const header = document.createElement("div");
      header.className = "title-row-header";

      const headerLeft = document.createElement("div");
      headerLeft.className = "title-row-header-left";

      const chevron = document.createElement("div");
      chevron.className = "title-row-chevron";
      chevron.textContent = "▶";

      const label = document.createElement("label");
      label.innerHTML = `<strong>${titleObj.name}</strong>`;

      headerLeft.appendChild(chevron);
      headerLeft.appendChild(label);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.setAttribute("aria-label", `Obtained ${titleObj.name}`);
      checkbox.addEventListener("click", (e) => e.stopPropagation());

      header.appendChild(headerLeft);
      header.appendChild(checkbox);

      const details = document.createElement("div");
      details.className = "title-row-details";

      const meaningP = document.createElement("p");
      meaningP.innerHTML = `<strong>Meaning:</strong> ${titleObj.meaning}`;
      details.appendChild(meaningP);

      const descP = document.createElement("p");
      descP.innerHTML = `<strong>Description:</strong> ${titleObj.description}`;
      details.appendChild(descP);

      const howP = document.createElement("p");
      howP.innerHTML = `<strong>How to Obtain:</strong> ${titleObj.how_to_obtain}`;
      details.appendChild(howP);

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
    titleList.appendChild(groupDiv);
    activeSection = items;
    await animateItems(items, true);
    changingSection = false;
  }

  renderCategoryButtons();
  selectCategory("Level Based");
})();
