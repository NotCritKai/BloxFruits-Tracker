# BloxFruits Tracker

## Creating a page

Copy `pages/template.html` to a new `.html` file in `pages/`, then change its
title, heading, and content. It includes the shared styles, input-saving script,
and navigation. Add page-specific styles or scripts only when needed. The Codes
page is currently empty.

## Saving inputs

Inputs with a unique `id` are saved automatically in the current browser.
For example:

```html
<label><input type="checkbox" id="fruit-collected" /> Fruit collected</label>
<label>Fruit storages <input type="number" id="fruit-storages" min="1" /></label>
```

Include the compiled script on each page with inputs, using a path relative
to that page (for a page inside `pages/`, use `../scripts/scripts.js`):

```html
<script defer src="../scripts/scripts.js"></script>
```

Input IDs must be unique within a page. Progress is separate for each page
and browser; clearing browser storage removes it. It does not sync across devices.
Password, file, hidden, and button-like inputs are not saved: files cannot be
restored by a web page, and passwords and hidden values may contain secrets.
Do not enter sensitive information in saved inputs; browser storage is not secure.

The source is `src/scripts.ts`. After changing it, run `npm install` once, then
`npm run build` to update `scripts/scripts.js` before deploying the site.
The fruit list is managed by `src/fruits.ts` and saved in the same browser.
Choose a rarity to show its fruits; switching rarities preserves their quantities.
Run the build after changing it to update `scripts/fruits.js`. Lowering the
storage limit preserves existing quantities and warns when they exceed the
new limit. Earlier entries are imported when their names match uniquely;
unmatched or duplicate entries remain in browser storage.

The races page saves unlocked races, versions, Blue Gear status, and each
race's V4 gear selections. Select a gear in the graph to choose its color.
Choose gears in order; clearing an earlier gear locks later selections without
deleting them. Each choice shows only its next tier based on earlier selections.
The per-race V4 training tracker saves progress for each training level;
amounts follow the [Ancient One guide](https://blox-fruits.fandom.com/wiki/Ancient_One)
and can differ from other community guides. Each training section shows the
remaining amount; mark paid upgrades to calculate the remaining Fragment cost.
Paid upgrades count as completed training without changing saved progress.
Trial completion is tracked separately for each race. Complete each in-game
upgrade before starting the next level.
Version 4 requires Blue Gear except for Draco,
which has its own trial. Removing Blue Gear preserves existing version 4
entries and gear selections, and displays a warning.

Race obtainment, gear colors, and ability summaries are based on the
[race](https://bloxfruitswiki.org/wiki/races/),
[gear](https://bloxfruitswiki.org/wiki/race-awakening/gears/),
[awakening](https://bloxfruitswiki.org/wiki/race-awakening/),
and [Draco trial](https://bloxfruitswiki.org/wiki/trial-of-flames/) guides,
checked November 15, 2026.

Fruit names, rarities, and dealer-price order are based on the
[Blox Fruits Wiki](https://bloxfruitswiki.org/wiki/blox-fruits/) and
[fruit list](https://progameguides.com/roblox/all-fruits-in-roblox-blox-fruits/),
checked November 15, 2026.