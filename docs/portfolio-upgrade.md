# Mission portfolio

A complete redesign of the portfolio around a monochrome mission-through-space aesthetic. The main site, software archive and engineering case studies share navigation, typography, a star field, motion settings and a mission status bar. It remains a static site, with no build step or runtime dependencies.

![Mission landing](preview.jpg)

![Engineering missions](engineering-preview.jpg)

## Pages

- `/`: portrait-led landing, interactive orbital sculpture, engineering projects, featured software, interactive discipline console, open source, creative gallery and contact.
- `/work.html`: software archive. Ten project entries plus the featured FoE-SemApp make eleven software projects. Category filters operate on the ten-entry index.
- `/engineering/illuminating-margins.html`: a simple case study with the A+ result, project summary, team-photo placeholder, report area, and the original interactive overview in an expandable iframe. A separate link opens the overview in a new tab.
- `/pro/monolyft/`: the user's complete case study, reframed in the shared mission shell. Its text, prototype photographs, results and working spring demo are retained. The homepage records its Y1S1 grade A.
- `/pro/asg-sus.html`: the original interactive overview, retained unchanged.

## Asset handoff

Edit `mission-config.js` after adding the assets:

```js
window.MISSION_ASSETS = Object.freeze({
  semAppImage: '/img/semapp-screenshot.png',
  illuminatingReport: '/reports/illuminating-margins.pdf',
  illuminatingTeamImage: '/img/illuminating-team.jpg',
});
```

These example paths are instructions, not files included in this change. Keep a value `null` until its actual file is added. The project report PDF was not found in the repository or the available file search. The site shows an honest “coming soon” label instead of a broken download link. Once configured, the real download anchor is displayed with the `download` attribute, and the pending notice disappears. The team image and SemApp screenshot likewise replace their placeholders automatically.

## Interaction and accessibility

- The particle sculpture morphs between an orbit, a spherical core and a helix, with drag rotation and click disturbance. Orbital paths and tracked satellites give it spatial context.
- The portrait fades horizontally toward the scene on desktop; mobile uses a vertical fade beneath the name. The source photograph is unchanged.
- Engineering cards expose day/night solar and spring-release previews through keyboard-operable buttons.
- The discipline console switches between engineering, development and design content.
- Software filters announce their result count. Native dialog semantics provide creative preview focus handling, Escape and focus return.
- Contact supports copying the email address, with a readable fallback if clipboard access fails.
- Motion respects the system preference, can be paused, and keeps that choice for the browser session. Background-tab animation stops; the sculpture skips rendering outside the viewport. Rendering is capped near 30 FPS and 1.6 device pixel ratio, with fewer stars and particles on small screens.
- The main content remains readable without JavaScript. Mobile navigation keeps background content inert while open.

## Validation

JavaScript syntax; local routes, assets and cross-page anchors; unique IDs and no nested links. Browser checks cover desktop and 390px embedded mobile layouts, sculpture forms and pause, engineering controls, discipline switching, archive filters (10 total / 3 experiments), creative dialog open/Escape, the embedded overview and expand control, MonoLyft's original spring demo, mobile menu navigation, loaded images and horizontal overflow.

The report PDF, team photo and actual SemApp screenshot still need to be supplied. The academic grades are supplied by the user. The Illuminating summary describes the proposal and avoids presenting estimated benefits in the older interactive map as measured project outcomes.
