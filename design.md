# Kautilyan - Visual Design System

Design reference for **video production**, motion graphics, thumbnails, and social content. Values are extracted from the live website (`css/site.css`, page-specific CSS) so motion assets stay visually consistent with the site.

---

## Brand aesthetic (in one line)

**Dark, premium operations-tech:** deep navy-black canvas, warm amber-to-violet gradient accents, soft atmospheric glows, glassy cards with gradient borders - confident and precise, not playful or corporate-blue.

### Mood keywords

| Use | Avoid |
|-----|--------|
| Operational, intelligent, governed | Generic “AI blue” (#00BFFF stacks) |
| Warm accent on cool dark base | Flat white backgrounds |
| Evidence, workflow, proof | Stock-photo corporate smiles |
| Subtle motion, purposeful reveals | Bouncy cartoon easing |

---

## Color palette

### Core backgrounds

| Token | Hex | Use |
|-------|-----|-----|
| `--bg` | `#080810` | Page / video canvas |
| `--bg-card` | `#0F0F1C` | Cards, panels |
| `--bg-card-2` | `#141428` | Elevated surfaces |
| Nav / modal base | `#12121f` → `#0a0a14` | Overlays, modals |

### Text

| Token | Hex | Use |
|-------|-----|-----|
| `--text` | `#E8E8F0` | Primary body & headlines |
| `--text-muted` | `#7A7A9A` | Supporting copy |
| `--text-dim` | `#555570` | Captions, disclaimers |
| White @ 72% | `rgba(255,255,255,0.72)` | Hero subcopy |
| White @ 35% | `rgba(255,255,255,0.35)` | Section labels |
| White @ 40% | `rgba(255,255,255,0.4)` | Trust lines, fine print |

### Accent colors

| Name | Hex | RGB | Semantic use |
|------|-----|-----|----------------|
| **Amber** | `#F0A030` | 240, 160, 48 | Primary highlight, CTAs, “good” state, labels |
| **Coral** | `#E05545` | 224, 85, 69 | Pain, chaos, “before”, risk, leakage |
| **Violet** | `#8B5CF6` | 139, 92, 246 | AI / future / “after”, glow, depth |
| **Green** | `#34D399` | 52, 211, 153 | Success, toast, Stage 0 / free tier |

### Borders

| State | Value |
|-------|--------|
| Default | `rgba(255,255,255,0.07)` |
| Hover / emphasis | `rgba(255,255,255,0.14)` |
| Card inner | `rgba(255,255,255,0.08)` |
| Coral accent | `rgba(224,85,69,0.2)` – `0.4` |
| Amber accent | `rgba(240,160,48,0.25)` – `0.35` |
| Violet accent | `rgba(139,92,246,0.25)` – `0.3` |

---

## Gradients (signature look)

**Angle:** `120deg` everywhere (amber → coral → violet, left-to-right).

### Primary brand gradient

```css
linear-gradient(120deg, #F0A030, #E05545, #8B5CF6)
```

**Video / design apps:**  
- After Effects / Premiere: Linear gradient, angle **120°**, stops: `#F0A030` (0%) → `#E05545` (~50%) → `#8B5CF6` (100%)
- Figma: same stops on a 120° linear fill

### Subtle fill (backgrounds)

```css
linear-gradient(120deg,
  rgba(240,160,48,0.15),
  rgba(224,85,69,0.15),
  rgba(139,92,246,0.15))
```

### Edge / border gradient (stronger)

```css
linear-gradient(120deg,
  rgba(240,160,48,0.45),
  rgba(224,85,69,0.4),
  rgba(139,92,246,0.45))
```

### Card surface gradient

```css
linear-gradient(165deg, rgba(18,18,32,0.92) 0%, #0F0F1C 100%)
```

### Platform / hero card border

```css
/* Fill */
linear-gradient(165deg, #12121f 0%, #080810 100%)
/* Border */
linear-gradient(120deg,
  rgba(240,160,48,0.35),
  rgba(224,85,69,0.25),
  rgba(139,92,246,0.35))
```

### Horizontal progress / connector

```css
linear-gradient(90deg, rgba(240,160,48,0.4), rgba(139,92,246,0.5))
```

### Trace / fill animation (diagnosis UI)

```css
linear-gradient(90deg, rgba(240,160,48,0.08), rgba(139,92,246,0.12))
```

### Gradient text

Apply primary gradient as fill, clip to text:

```css
background: linear-gradient(120deg, #F0A030, #E05545, #8B5CF6);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

---

## Atmospheric backgrounds

### Fixed orbs (depth)

Large blurred circles, `filter: blur(120px)`, low opacity:

| Orb | Color | Position | Opacity |
|-----|-------|----------|---------|
| 1 | Amber `#F0A030` | Top-left | 0.18 |
| 2 | Violet `#8B5CF6` | Bottom-right | 0.18 |
| 3 | Coral `#E05545` | Mid viewport | 0.08 |

**Video tip:** Animate orb position slowly (20–40s loop) or use a subtle scale pulse (1 → 1.05). Keep blur heavy so edges never read as hard circles.

### Section radial washes

Layer these over `#080810` at **6–8% opacity**:

```css
/* Hero / top */
radial-gradient(ellipse 90% 55% at 50% -10%, rgba(240,160,48,0.07), transparent 52%)
radial-gradient(ellipse 50% 40% at 100% 40%, rgba(139,92,246,0.06), transparent 50%)

/* Pain / “before” */
radial-gradient(ellipse 70% 50% at 0% 20%, rgba(224,85,69,0.06), transparent 45%)

/* Trust / bottom */
radial-gradient(ellipse 60% 45% at 50% 100%, rgba(139,92,246,0.07), transparent 50%)

/* Pricing-style */
radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.08), transparent 50%)
radial-gradient(ellipse 55% 45% at 0% 80%, rgba(240,160,48,0.06), transparent 45%)
```

### Alt section tint

`rgba(255,255,255,0.02)` full-width band - subtle lift between sections.

---

## Typography

### Font families

| Role | Family | Weights | Source |
|------|--------|---------|--------|
| **Display** | Bricolage Grotesque | 600, 700 | Google Fonts |
| **Body** | Inter | 400, 500, 600 | Google Fonts |
| **Mono** (UI chrome) | JetBrains Mono | 400, 500 | Google Fonts |

### Type scale (web → video)

| Style | Font | Size | Weight | Letter-spacing | Line-height |
|-------|------|------|--------|----------------|-------------|
| Hero headline | Bricolage | 32–52px (clamp) | 700 | -0.02em | 1.14 |
| Section headline | Bricolage | 28–48px | 700 | -0.02em | 1.15 |
| Display LG | Bricolage | ~30–49px | 700 | -0.025em | 1.08 |
| Card title | Bricolage | 16–22px | 700 | -0.02em | 1.25 |
| Body / lead | Inter | 15–18px | 400 | 0 | 1.65 |
| UI / tabs | Inter | 13–15px | 600 | 0.04em (caps) | 1.45 |
| Section label | Inter | 11px | 600 | **0.1em** | - |
| Fine print | Inter | 12px | 500 | 0.02em | - |

### Section labels

- Uppercase, `11px`, `letter-spacing: 0.1em`
- Color: `rgba(255,255,255,0.35)`
- Examples: `WHERE WE START`, `THE METHOD`, `USE CASES`

### Logo wordmark

- **KAUTILYAN** - Bricolage Grotesque, bold, tracked slightly tight
- Icon: K in a **gradient-filled** square (`border-radius` ~10px)

---

## Spacing & layout

| Token | Value |
|-------|-------|
| Max content width | `1180px` |
| Section padding | `96px` vertical, `64px` horizontal (desktop) |
| Section gap | `120px` |
| Nav height | `92px` |
| Container side padding | `24px` |
| Card radius `--radius` | `14px` |
| Small radius `--radius-sm` | `8px` |
| Pill / tab radius | `999px` |
| Button radius | `8px` |

### Video safe zones

- **Title safe:** 10% margin from edges (for 16:9 and 9:16)
- **Lower third:** reserve ~15% bottom on mobile-style crops for captions / CTA
- Match site: generous whitespace; don’t crowd gradient text against edges

---

## Shadows & glow

### Primary CTA glow

```css
box-shadow:
  0 8px 28px rgba(240, 160, 48, 0.18),
  0 12px 42px rgba(139, 92, 246, 0.14);
```

### CTA hover

```css
box-shadow:
  0 12px 36px rgba(224, 85, 69, 0.22),
  0 16px 52px rgba(139, 92, 246, 0.18);
```

### Card depth

```css
box-shadow: 0 24px 48px rgba(0, 0, 0, 0.35);
```

### Gradient glow (cards)

```css
--gradient-glow: 0 0 48px rgba(240, 160, 48, 0.08), 0 0 80px rgba(139, 92, 246, 0.06);
```

### Focus ring

`2px solid #F0A030`, `outline-offset: 3px`

---

## Components (for motion recreations)

### Primary button

- Fill: brand gradient `120deg`
- Text: `#FFFFFF`, Inter **700**, `15px`
- Padding: `14px 24px`, radius `8px`
- Border: `1px solid rgba(255,255,255,0.08)`
- Hover: `translateY(-2px)`, opacity `0.94`, stronger glow

### Secondary / ghost button

- Fill: `#080810` with **gradient border** (padding-box trick)
- Text: `rgba(255,255,255,0.88)` → white on hover
- Subtle violet glow: `0 0 28px rgba(139,92,246,0.08)`

### Hero eyebrow badge

- Pill shape, gradient border on dark fill `rgba(15,15,28,0.9)`
- **6px dot** before text: gradient fill, **pulse** animation (see below)
- Font: Inter 600, `12px` (0.75rem)

### Tabs (pills)

| State | Background | Border | Text |
|-------|------------|--------|------|
| Default | `rgba(12,12,22,0.8)` | `rgba(255,255,255,0.12)` | muted |
| Active | brand gradient | transparent | white + violet shadow |
| Hover | same | `rgba(255,255,255,0.25)` | white |

### Cards (general)

- Background: `165deg` card gradient or `rgba(12,12,22,0.7–0.95)`
- Border: `1px solid rgba(255,255,255,0.08)`
- Hover / selected: gradient border + `box-shadow: 0 0 32–40px rgba(139,92,246,0.08–0.12)`
- Optional top accent: `2px` height brand gradient at `opacity: 0.5`

### “Messy situation” box (use cases)

- Left border: `3px solid rgba(224,85,69,0.6)`
- Background: `rgba(224,85,69,0.06)`
- Label: coral tint `#f0a090`, uppercase micro type

### Proof metric pill

- Gradient border on dark inner fill
- Label: amber, uppercase `0.65rem`, tracking `0.06em`

### Before / after columns

| Column | Background | Border |
|--------|------------|--------|
| Before | `165deg` dark + coral wash | `rgba(224,85,69,0.2)` |
| After | `165deg` dark + violet wash | `rgba(139,92,246,0.25)` + violet glow |

### Chaos flow nodes (homepage diagram)

- Dashed coral border, slight **tilt** (-4°, 3°, -2°)
- “Good” node: amber fill + glow `0 0 20px rgba(240,160,48,0.35)`
- Broken connector: repeating coral dashes
- Fixed connector: amber → violet horizontal gradient

### Phase stepper (How It Works)

- Rail: `2px`, `rgba(255,255,255,0.1)`
- Fill: brand gradient, width animates `0.5s ease`
- Step circle: `44px`, gradient when active/done + `0 0 24px rgba(139,92,246,0.3)`

### SLOPE letter tiles

- Letter box: `40×40px`, gradient fill, radius `10px`
- Card expand: gradient border on hover/open, `0.25s ease`

---

## Motion & animation

### Easing reference

| Name | Curve | Used for |
|------|-------|----------|
| Standard UI | `ease` / `0.2s ease` | Links, tabs, colors |
| Smooth UI | `0.22s ease` | Buttons |
| Card / panel | `0.25s ease` | Cards, borders, drains |
| Nav / modal | `0.3s ease` | Navbar, sticky CTA, sticky bar |
| Phase rail | `0.5s ease` | Stepper progress width |
| Scroll reveal | `0.6s` (opacity + transform) | Section fade-up |
| Expand detail | `0.35s ease` | Accordion / drain detail height |

### fade-up (scroll reveal)

**In:** `opacity: 0`, `translateY(30px)`  
**Out:** `opacity: 1`, `translateY(0)`  
**Duration:** `0.6s` both properties  
**Stagger:** `0.1s`, `0.2s`, `0.3s` per element (classes `fade-up-delay-1/2/3`)

**Video equivalent:**  
- Opacity 0→100% over 18 frames @ 30fps (0.6s)  
- Position Y +30px → 0 with ease-out (not bounce)

### pulse (hero badge dot)

```css
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.4; transform: scale(0.8); }
}
/* animation: pulse 2s infinite; */
```

### traceFill (progress wash)

```css
@keyframes traceFill {
  0%, 100% { width: 15%; }
  50%      { width: 100%; }
}
/* animation: traceFill 8s ease-in-out infinite; */
```

### Modal

- Overlay: `rgba(4,4,10,0.85)` + `backdrop-filter: blur(8px)`
- Panel fade: `opacity 0.25s ease`
- Panel bg: `linear-gradient(165deg, #12121f, #0a0a14)`

### Sticky CTA

- Hidden: `opacity 0`, `translateY(12px)` (desktop pill) or `translateY(100%)` (mobile bar)
- Visible: `opacity 1`, `translateY(0)`, `0.3s ease`

### Reduced motion

Respect `prefers-reduced-motion`: no pulse, no fade-up transform, static orbs.

---

## Video production guide

### Recommended formats

| Use | Aspect | Resolution | Notes |
|-----|--------|------------|-------|
| YouTube / web hero | 16:9 | 1920×1080 or 4K | Match orb + gradient bg |
| LinkedIn / feed | 1:1 or 4:5 | 1080×1080 / 1080×1350 | Center headline; simplify orbs |
| Stories / Reels | 9:16 | 1080×1920 | Stack headline + one visual metaphor |
| Lower-thirds | 16:9 | Safe title area 80% width | Amber label + white headline |

### Background recipe (After Effects / Resolve)

1. Solid `#080810`
2. Add 2–3 elliptical solids (amber, violet, coral) → heavy Gaussian blur (≈120px equivalent)
3. Optional: slow drift (position) 3–5% over 30s
4. Add section radial gradients at 6–8% opacity if scene feels flat
5. Vignette: very subtle (don’t crush blacks)

### Text animation patterns

| Pattern | Spec |
|---------|------|
| Headline enter | fade-up: 30px ↑, 0.6s, ease-out |
| Label first | Label 0.1s before headline |
| Gradient headline | Animate opacity on gradient fill, or wipe mask left→right over 0.8s |
| Bullet list | Stagger 0.08–0.1s per line, same fade-up |
| Tab switch | Cross-dissolve panels 0.2s; active pill = gradient fill |
| CTA end card | Primary button + optional pulse on dot only |

### Icon & UI chrome style

- Prefer **simple line icons** or minimal emoji-style (site uses emoji in places: 📊 🛒 ✓)
- UI mockups: dark chrome bar, JetBrains Mono `0.68rem` headers, traffic-light dots (amber / coral / green) with soft outer glow rings

### Semantic color in storytelling

| Story beat | Dominant accent |
|------------|-----------------|
| Problem / chaos / leakage | Coral `#E05545` |
| Human judgment / urgency | Amber `#F0A030` |
| AI / solution / governed automation | Violet `#8B5CF6` |
| Proof / success / guarantee | Green `#34D399` |
| Full brand moment | Full 120° gradient |

### Audio / pacing (optional)

- Cut rhythm: allow **0.6s** beats after headline reveals (matches fade-up)
- Avoid fast MTV cuts; align with “operating brief” tone - deliberate, clear

---

## Copy & tone (for on-screen text)

- Short labels: **ALL CAPS**, wide tracking (`0.1em`)
- Headlines: sentence case, Bricolage, tight tracking
- CTAs: action + arrow → e.g. `Book Free Diagnosis →`
- Principle line: amber, `13px`, often above rule: `One workflow. One metric. Proof before scale.`

---

## Quick reference - hex swatch

```
#080810  Background
#0F0F1C  Card
#E8E8F0  Text
#7A7A9A  Muted
#F0A030  Amber
#E05545  Coral
#8B5CF6  Violet
#34D399  Green
```

**Brand gradient:** `#F0A030` → `#E05545` → `#8B5CF6` @ **120°**

---

## File map (website source)

| Asset | Path |
|-------|------|
| Shared tokens & components | `css/site.css` |
| How It Works specifics | `css/how-it-works.css` |
| Use Cases specifics | `css/use-cases.css` |
| Homepage (inline duplicate of tokens) | `index.html` `<style>` |
| Content copy | `kautilyan_final_website_content.md` |

---

*Last synced with website build - May 2026. Update this doc when CSS variables change.*
