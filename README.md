# Sana, Portfolio

A simple, elegant one-page portfolio. Static site, no backend, no database. Dark red + beige editorial theme with a dark mode toggle, scattered cherry decorations, and a cherry-red mouse trail.

## Structure

```
index.html    All content and markup
styles.css    Theme, layout, responsive rules
main.js       Scroll reveal, sticky nav, dark mode toggle, mouse trail
vercel.json   Vercel config (clean URLs + security headers)
assets/       Images (your photo + cherry graphic)
```

## Images (required)

Drop two files into the `assets/` folder with these exact names:

- `assets/sana.jpg` : your photo (used in the About section).
- `assets/cherry.png` : the pair-of-cherries PNG with a transparent background (scattered around the page as decoration).

If a filename differs, either rename the file or update the `src` in `index.html`.

## Edit your content

Everything is plain HTML. Open `index.html` and update the text directly.

- **Hero / About:** change the headline and bio paragraphs.
- **Achievements:** each entry is an `.ach-item` with a `.ach-item__year`, `.ach-item__head`, and `.ach-item__sub`. Add, remove, or reorder them. Strongest items go on top.
- **App link:** find the `id="appLink"` anchor in the "My App" section and replace `href="#"` with your real app URL. Update the description too.
- **Contact:** email and social links (Instagram, LinkedIn, GitHub) are already wired in.

### Change the accent color

In `styles.css`, edit the `--red`, `--red-bright`, and `--red-deep` variables under `:root`. The dark-mode variants live under `[data-theme="dark"]`.

### Adjust the cherries

Positions and sizes are set per cherry under the `.cherry--1` ... `.cherry--6` rules in `styles.css`. Move, resize, or remove any of them.

### Adjust the mouse trail

The trail logic lives at the bottom of `main.js`. Tweak the `colors` array, particle size (`r`), or lifespan (`p.life -= 0.025`). It auto-disables on touch devices and when the user prefers reduced motion.

## Run locally

No build step. Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 5173
# then open http://localhost:5173
```

## Deploy to Vercel

**Option A, drag and drop:** go to [vercel.com/new](https://vercel.com/new), drag this folder in, deploy.

**Option B, CLI:**

```bash
npm i -g vercel
vercel          # preview deploy
vercel --prod   # production deploy
```

**Option C, Git:** push this folder to a GitHub repo, then "Import Project" on Vercel. It auto-deploys on every push.

No framework or build settings needed. Vercel serves these static files as-is.
