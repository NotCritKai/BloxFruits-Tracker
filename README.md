# BloxFruits Tracker

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

Fruit names, rarities, and dealer-price order are based on the
[Blox Fruits Wiki](https://bloxfruitswiki.org/wiki/blox-fruits/) and
[fruit list](https://progameguides.com/roblox/all-fruits-in-roblox-blox-fruits/),
checked November 15, 2026.