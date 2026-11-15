# BloxFruits Tracker

## Saving checkboxes

Checkboxes with a unique `id` are saved automatically in the current browser.
For example:

```html
<label><input type="checkbox" id="fruit-collected" /> Fruit collected</label>
```

Include the compiled script on each page with checkboxes, using a path relative
to that page (for a page inside `pages/`, use `../scripts/scripts.js`):

```html
<script defer src="../scripts/scripts.js"></script>
```

Checkbox IDs must be unique within a page. Progress is separate for each page
and browser; clearing browser storage removes it. It does not sync across devices.

The source is `src/scripts.ts`. After changing it, run `npm install` once, then
`npm run build` to update `scripts/scripts.js` before deploying the site.