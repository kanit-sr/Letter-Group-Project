# Website UI Redesign — Brief & Working Doc

A doc to **read and edit**. Fill in the blanks, tick the boxes, and tweak the tokens.
When you're happy, hand it back and I'll implement it in `frontend/src/index.css` (theme tokens
+ component styles) and the page components.

> How the styling works today: one global stylesheet `frontend/src/index.css` drives everything
> via CSS variables (`:root { --paper, --ink, ... }`) plus component classes (`.card`, `.nav`,
> `.letter`, …). Pages are plain React in `frontend/src/pages/*`. So a redesign is mostly:
> (1) change the tokens, (2) restyle the component classes, (3) adjust a few page layouts.
> Current theme = **paper / stationery** (aged paper, ink/kraft, Playfair + Caveat fonts).

---

## 1. Goals — why redesign? (edit this)

What's not working / what you want more of. Examples — keep what fits, delete the rest:

- [x] Looks dated / too plain
- [x] Want it more fun / playful
- [x] Hard to read or navigate
- [x] Doesn't feel like a "village"
- [x] Want it to work better on phones
- [ ] _Your words: I love all of you!

**One sentence, the vibe I want:** Cozy and feel like home

---

## 2. Direction — pick ONE (or describe your own)

Tick one. (We did "paper/stationery" last time — feel free to move away from it.)

- [x] **A — Cozy game / cartoon**: rounded, chunky, bright. Stardew/Animal-Crossing energy.
- [ ] **B — Clean modern / minimal**: lots of whitespace, neutral + 1 accent, subtle shadows.
- [ ] **C — Paper / stationery (current)**: refine what we have rather than replace it.
- [ ] **D — Dark / dreamy night village**: indigo, glowing windows, soft gradients, stars.
- [ ] **E — Retro / pixel**: pixel font, hard edges, tile borders, 8-bit palette.
- [ ] **F — Your own**: _______________________________________________________

**Reference links / screenshots I like** (paste URLs — for *inspiration*, not copying):

1. https://openwhenletters.app/
2. _____________________________________

---

## 3. Design tokens — edit the values

These map 1:1 to CSS variables in `index.css`. Change hex codes / fonts here; I'll wire them up.

### Colors

> Filled by Claude for the **cozy "feels like home"** mood (warm cream + honey + coral, with a
> soft leaf-green for the village). Edit any hex you don't like.

| Token | Use | Value |
|---|---|---|
| `--bg` | page background | `#fff3e2` (warm cream) |
| `--surface` | cards / panels | `#fffefb` (soft white) |
| `--ink` | main text | `#4f4136` (warm cocoa) |
| `--ink-soft` | muted text | `#a08f7d` (taupe) |
| `--primary` | main brand / nav | `#f2a65a` (honey) |
| `--accent` | buttons / highlights | `#e8765a` (coral) |
| `--leaf` | village / nature accent | `#8bbf73` (sage green) |
| `--border` | lines / card edges | `#f0ddc2` (soft sand) |
| `--danger` | errors / delete | `#d65a4f` (clay red) |

### Typography

- **Headings font:** **Quicksand** (rounded but calm — toned down from Baloo 2, which read too cartoony)
- **Body font:** **Nunito** (soft, very readable)
- **Accent/handwriting font (letters):** **Caveat** (kept — handwritten mail)
- Fonts loaded from Google Fonts in `frontend/public/index.html`.

### Shape & feel

> Adjusted after first pass felt "too cartoony": **desaturated** palette (muted clay/tan/sage
> instead of bright honey/coral), **softer flat shadows** (dropped the chunky 3D button offset),
> **thinner 1.5px borders**, slightly **less rounded** (14px). Cozy-home, not kids-cartoon.

- **Corner roundness:** [x] slightly rounded (~14px)
- **Shadows:** [x] soft (flat, subtle — not playful 3D)
- **Density:** [x] airy (lots of space)
- **Buttons:** [x] pill (flat with a soft shadow, slight press)

---

## 4. Components — notes / wishes (optional)

Per element — *filled by Claude to match the cozy direction*:

- **Top nav** (`NavBar`): warm honey bar with a soft rounded bottom edge; chunky brand + house
  icon; links as soft pill chips; coral logout.
- **Buttons**: chunky **pills** with a soft drop-shadow that "presses down" on click.
- **Cards / panels** (`.card`): big rounded corners (~18px), soft warm shadow, gentle sand border;
  no more paper grain / dashed envelope.
- **Forms / inputs**: rounded, soft cream fill, coral focus ring; friendly placeholders.
- **Letters** (`.letter`): rounded note cards, handwriting body (Caveat), a little colored corner
  tab; unread gets a coral dot + soft highlight (drop the postage-stamp/postmark motifs).
- **House cards** (`.house-plot`): rounded tiles on a sky→grass gradient, soft hover bounce,
  name in the chunky heading font.

---

## 5. Pages — layout wishes (optional)

Current pages: `Login`, `Register`, `Village` (map), `MyHouse`, `HouseEditor`, `NeighborHouse`,
`Mailbox`. Note anything per page; otherwise I keep the current structure and just restyle.

*Filled by Claude — restyle now, bigger structural ideas noted as later:*

- **Login / Register**: warm centered card, friendly welcome line + house icon; cozy "come home" feel.
- **Village (map)**: page gets a sky→grass gradient so the grid reads like a neighborhood; rounded
  house tiles. (A *real* map with paths between houses = a later, bigger task — noted.)
- **My House**: keep layout; restyle the customization panel as a cozy card.
- **House Editor**: keep layout; restyle panels/buttons to match (no functional change).
- **Mailbox**: cute rounded letter cards; tabs become pill toggles.
- **Landing / home before login?**: not now — the styled Login is the entry. (Full welcome page = later.)

---

## 6. Things to keep (don't break these)

- [x] The SVG-icon approach (no emoji) — already a preference.
- [x] The house customization look (procedural + the v2 layer editor art).
- [x] *Anything else: all the villagers + features stay; this is presentation only.*

---

## 7. Scope & priority (edit)

- [x] Full reskin (all pages + tokens) — biggest change
- [ ] Just the theme/tokens (colors + fonts), keep layouts
- [ ] Just specific pages: ______________________________________________
- Add light/dark mode toggle? [ ] yes  [x] no (can add later)
- Mobile/responsive pass included? [x] yes  [ ] no  ← you wanted phone support

---

## 8. How we'll do it (for reference — no edits needed)

1. You fill in §1–§7 above.
2. I update the **tokens** in `index.css` `:root` → instant global recolor/refont.
3. I restyle the **component classes** (`.nav`, `.card`, `.letter`, `.house-plot`, buttons,
   inputs, tabs…) to match the chosen direction.
4. I adjust **page layouts** only where you asked.
5. Verify it compiles and looks right; iterate on anything off.

Nothing here changes backend or features — it's presentation only. Reversible (it's just CSS).
