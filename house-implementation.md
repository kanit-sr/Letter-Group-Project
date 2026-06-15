# House Customization — Implementation Plan (v2: image/layer editor)

Goal: move beyond the current procedural SVG house (fixed roof shapes + colors) to a
**layered image editor** — users compose a house from image assets (base, roof, door,
windows, garden, decorations), and can move / scale / rotate / recolor / stack layers,
"like Photoshop." Optionally upload their own images.

This is additive: the existing v1 fields (`roofColor`, `roofShape`, …) keep working, and v2
houses store a `design` layer-stack alongside them.

---

## 1. Approach options

| Option | What it is | Pros | Cons |
|---|---|---|---|
| **A. Curated layer packs** | We provide a library of pre-cut PNG/SVG parts (roofs, doors, gardens…); user picks + arranges + recolors. | Consistent look, fast, no moderation, easy map rendering | We must produce/curate the art |
| **B. Freeform canvas (full Photoshop-lite)** | Upload any image; full layers, transform, filters, masking. | Max freedom, matches the "Pinterest + Photoshop" idea | Heavy to build, moderation + copyright risk, messy results |
| **C. Hybrid (recommended)** | Curated packs **+** user image upload, both as layers on one canvas with transform/recolor. | Best of both; structured but expressive | Medium build effort |

**Recommendation: C (Hybrid).** Build the layer engine once; feed it both a curated asset
catalog and user uploads. Start with curated packs (Phase H2), add uploads later (Phase H5).

> ✅ **Decided:** Approach **C (Hybrid)**. Built-in art sourced from **CC0 libraries**
> (Kenney.nl, OpenGameArt, itch.io CC0) for the starter pack; user uploads come in Phase H5.
>
> ⚠️ **About Pinterest images:** most images on Pinterest are copyrighted — fine to *reference*
> for art direction, not to ship as built-in assets. For built-in packs use CC0/licensed art
> (e.g. Kenney.nl, OpenGameArt, itch.io CC0) or original art. The *upload* feature lets each
> user bring their own image and owns that responsibility. Keep this split clear.

---

## 2. Data model

Add a `design` object to the `House` model (keep v1 fields for backward-compat):

```js
// House.design
{
  version: 2,
  canvas: { width: 600, height: 600, background: "#cfe9f2" },
  layers: [
    {
      id: "lyr_1",
      type: "asset",          // "asset" | "upload" | "text"
      assetId: "roof_gable_01", // for type "asset"
      src: "https://res.cloudinary.com/.../roof_gable_01.png", // resolved URL
      x: 120, y: 60,          // top-left on canvas
      width: 360, height: 180,
      rotation: 0,            // degrees
      scaleX: 1, scaleY: 1,
      flipX: false, flipY: false,
      opacity: 1,
      tint: "#9e3b2e",        // optional recolor (null = original)
      z: 2                    // stacking order
    }
  ],
  thumbnailUrl: "https://res.cloudinary.com/.../house_<id>.png" // flattened snapshot for the map
}
```

- **Backward compatibility:** if `design` is absent or `version < 2`, render the v1 procedural
  house (current `HouseView`). New saves write `design`.
- Reuse the existing `PUT /api/v1/houses/me` endpoint; extend the validator to accept `design`.

### Validation (backend)
- Cap layer count (e.g. ≤ 40) and canvas size.
- `tint` must be a hex; numbers (`x/y/width/height/rotation/scale/opacity`) range-checked.
- `type: "asset"` → `assetId` must exist in the catalog (resolve `src` server-side, don't trust
  client URLs).
- `type: "upload"` → `src` must be a Cloudinary URL under our account/folder.

---

## 3. Asset catalog

A server-owned catalog of parts, grouped by category. Stored as a JSON config
(`backend/src/config/houseAssets.js`) and served via `GET /api/v1/assets`.

```js
{
  categories: ["base", "roof", "wall", "door", "window", "garden", "decoration"],
  assets: [
    { id: "roof_gable_01", category: "roof", name: "Gable roof",
      url: ".../roof_gable_01.png", thumbUrl: ".../roof_gable_01_thumb.png",
      defaultW: 360, defaultH: 180, recolorable: true, anchor: "top" },
    // …
  ]
}
```

- Host assets on **Cloudinary** (already in the stack/env). Upload script puts files in a
  `letter-village/house-assets/` folder; the catalog references public URLs.
- `recolorable: true` assets should be authored as **white/greyscale masks** so a `tint`
  multiply produces clean colors.

---

## 4. Editor UI (frontend)

A dedicated **House Editor** route (`/my-house/edit`) using a canvas library.

**Library choice:** **`react-konva`** (React bindings for Konva). Gives draggable nodes, a
`Transformer` (resize/rotate handles), z-ordering, and `stage.toDataURL()` for snapshots.
(Alternative: `fabric.js` — also fine; react-konva fits the React component model better.)

**Layout:**
```
┌───────────────┬───────────────────────────┬──────────────┐
│ Asset library │        Canvas (Stage)      │ Layers + props│
│ (tabs by cat) │   drag/scale/rotate parts  │  - reorder    │
│  [roofs]      │                            │  - opacity    │
│  [doors] …    │     [ Transformer ]        │  - tint       │
│  + Upload     │                            │  - flip/delete│
└───────────────┴───────────────────────────┴──────────────┘
        [ Save ]  [ Reset ]  [ Undo / Redo ]
```

**Interactions:**
- Click an asset → adds a layer at canvas center.
- Select layer → Transformer handles for move/scale/rotate; props panel for opacity/tint/flip.
- Layers panel: drag to reorder (z), toggle visibility, delete.
- Recolor: color picker sets `tint`; apply as Konva `filters` (RGBA/Multiply) or an offscreen
  tinted copy.
- Undo/redo: keep a history stack of `design` snapshots.
- **Save:** `PUT /houses/me` with `design`; also `stage.toDataURL()` → upload flattened PNG to
  Cloudinary → store as `design.thumbnailUrl`.

---

## 5. Rendering elsewhere

- **Village map & neighbor view:** show `design.thumbnailUrl` (a flat PNG) — one `<img>`, fast,
  no canvas needed for many houses. Fall back to the live layer render or v1 `HouseView` if no
  thumbnail.
- **`HouseView` component:** branch on `design?.version >= 2`:
  - v2 → render layers (read-only Konva stage, or absolutely-positioned `<img>` for previews).
  - else → current procedural SVG.

---

## 6. Image uploads (user's own images)

- Frontend: file input → `POST /api/v1/uploads/image` (multipart) → backend streams to Cloudinary
  → returns secure URL → added as an `upload` layer.
- Backend: `multer` (memory storage) + Cloudinary SDK; restrict mime types + size (e.g. ≤ 5 MB);
  store under `letter-village/user-uploads/<userId>/`.
- Optional later: background removal (Cloudinary `e_background_removal`) so uploaded photos drop
  cleanly onto the house.

---

## 7. Phasing & checklist

### Phase H1 — Data + compatibility ✅

- [x] Add `design` to `House` model; extend `validateHouse.js` to accept/validate it
      (`validateDesign`: version, per-house canvas bounds, ≤40 layers, asset-id whitelist,
      numeric clamping, hex tints). `design: null` resets to v1.
- [x] `HouseView` branches on `design.version` (falls back to v1 procedural house).

### Phase H2 — Asset catalog + parts ✅

- [x] `config/houseAssets.js` catalog (15 parts) + `GET /api/v1/assets`.
- [x] Starter art authored as **bundled SVG generators** in `frontend/src/utils/houseParts.js`
      (recolorable via a `color` param) — no Cloudinary/binaries needed; ids mirror the backend
      catalog so the same art renders in the editor and read-only views.
      *(Swapping in CC0 raster packs later = host files + point catalog `url` at them.)*

### Phase H3 — Editor MVP (react-konva) ✅

- [x] `/my-house/edit` route; Konva Stage + add/select/move/scale/rotate (Transformer);
      part library grouped by category; click-empty to deselect.
- [x] Wire Save → `PUT /houses/me` with `design`; "Reset to classic" sends `design: null`.

### Phase H4 — Polish editor (partial)

- [x] Recolor (tint), opacity, flip, z-reorder (forward/back), delete.
- [x] Undo/redo (`hooks/useHistory.js`; toolbar buttons + Ctrl/Cmd+Z / Ctrl+Shift+Z / Ctrl+Y).
- [ ] Snapshot thumbnail for the map (currently the map re-renders layers live via `HouseView`;
      a flattened snapshot would scale better for large villages).

### Phase H5 — User uploads

> **Decided approach (small friends project): client-side file upload, no upload server.**
> A "Pinterest URL" can't be drawn to canvas cross-origin (CORS taint) and is fragile/ToS-risky,
> so users **save the image then upload the file**. Read it in the browser, **downscale to
> ~512px + compress** on a `<canvas>`, and store it as a `type: "upload"` layer whose `src` is a
> data-URL inside `design`. Since `design` is already served to everyone viewing the house,
> friends see the image with no CDN. Keep each house under MongoDB's 16 MB doc limit via the
> downscale. Upgrade path: add `POST /uploads` → Cloudinary and store URLs instead.

- [x] Editor: "Upload image" file input → client downscale (~512px) + compress
      (`utils/compressImage.js`) → adds a `type: "upload"` data-URL layer (movable/scalable/
      rotatable like any part).
- [x] Backend `validateDesign`: allows `type: "upload"` with a `data:image/*` src capped at
      ~0.8 MB; rejects remote/non-data URLs.
- [x] `HouseView` + editor resolve layers via `layerSrc()` (asset → SVG, upload → stored src).
- [ ] (Later/optional) server upload endpoint + Cloudinary; background removal.

### Phase H6 — Nice-to-haves
- [ ] Templates / presets ("starter cottage") users can tweak.
- [ ] Snap-to-grid / alignment guides.
- [ ] Seasonal decoration packs.

---

## 8. New dependencies

- **Frontend:** `react-konva`, `konva`. (Upload UI needs none beyond fetch.)
- **Backend:** `cloudinary`, `multer` (for uploads in H5).

## 9. Decisions & open questions

**Decided:**

- ✅ Approach **C (Hybrid)** — curated parts + user uploads on one layer engine.
- ✅ Built-in art from **CC0 libraries** (Kenney.nl, OpenGameArt, itch.io CC0).
- ✅ Order: curated packs first (H2–H4), user uploads later (H5).

**Also decided:**

- ✅ **Per-house canvas size** — each house stores its own `canvas.width/height`. The map renders
  the flattened `thumbnailUrl`, so varying sizes don't break layout (constrain the thumbnail box
  with CSS `object-fit: contain`). Consider min/max bounds in validation to keep things sane.
- ✅ **No upload moderation for now** — revisit when/if uploaded images become public-facing (H5).

**Still open:**

- *(none right now)*
