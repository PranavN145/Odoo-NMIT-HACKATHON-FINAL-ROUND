# Skyline Student Association — Design System

> A minimal, smooth, and consistent interface system for the Skyline Student Association platform.

## 1. Design principles

- **Clarity first:** prioritize readable content and obvious actions.
- **Quiet surfaces:** use light backgrounds, subtle borders, and restrained shadows.
- **Consistent rhythm:** follow an 8px spacing scale.
- **Purposeful color:** reserve bright blue for primary actions, focus states, and active navigation.
- **No decorative noise:** avoid unnecessary gradients, glass effects, oversized rounded cards, and gratuitous animation.
- **Accessible by default:** maintain readable contrast, visible focus states, and clear error messages.

## 2. Color palette

| Token | Hex | Name | Intended use |
|---|---|---|---|
| `color.navy` | `#13293D` | Deep Space Blue | Primary text, dark navigation, primary buttons |
| `color.blue` | `#006494` | Baltic Blue | Secondary actions, supporting surfaces |
| `color.cerulean` | `#247BA0` | Cerulean | Secondary emphasis, charts, supporting accents |
| `color.accent` | `#1B98E0` | Blue Bell | Primary CTA, links, active and focused states |
| `color.canvas` | `#E8F1F2` | Alice Blue | App background and pale surfaces |

### Color usage

- Use `#13293D` for headings, high-emphasis text, and dark surfaces.
- Use `#006494` and `#247BA0` sparingly for secondary emphasis.
- Use `#1B98E0` for primary actions, selected navigation, links, and focus rings.
- Use `#E8F1F2` for the page canvas and low-emphasis surfaces.
- For cards, use white or near-white surfaces with a subtle border.
- Do not use every palette color at equal intensity in the same view.
- Check text contrast before using pale blue backgrounds or muted text.

## 3. Typography

**Typeface:** Inter, with a system sans-serif fallback.

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
  "Segoe UI", sans-serif;
```

| Style | Size / line height | Weight | Usage |
|---|---:|---|---|
| H1 | 40 / 48 px | 700 | Page title; use only when the page needs a strong title |
| H2 | 32 / 40 px | 600 | Major page heading |
| H3 | 24 / 32 px | 600 | Section heading |
| H4 | 18 / 28 px | 500 | Card or subsection heading |
| Body | 16 / 24 px | 400 | Default body copy |
| Small | 14 / 20 px | 400 | Secondary information |
| Caption | 12 / 16 px | 500 | Labels, timestamps, helper text |

### Typography rules

- Use sentence case for headings and labels.
- Prefer short, descriptive headings over marketing copy.
- Keep body text at 16px where space allows; do not use tiny text for important information.
- Use muted text only for supporting content, never for critical instructions or statuses.
- Use tabular numerals for totals, prices, and other values that need quick comparison.

## 4. Layout and spacing

Use an **8px base spacing system**. Keep layouts aligned to a consistent content grid.

| Token | Value | Typical use |
|---|---:|---|
| `space.1` | 4px | Tight icon-to-label spacing |
| `space.2` | 8px | Compact gaps |
| `space.3` | 12px | Related inline elements |
| `space.4` | 16px | Default component spacing |
| `space.6` | 24px | Card padding and section gaps |
| `space.8` | 32px | Major grouping |
| `space.12` | 48px | Large section separation |

### Layout rules

- Use a clear page container and consistent horizontal gutters.
- Align cards, tables, and section headings to the same grid.
- Prefer whitespace and alignment over divider-heavy layouts.
- Use a fixed or collapsible sidebar only when navigation genuinely needs it.
- On smaller screens, collapse multi-column layouts into a single column.
- Keep important actions visible without making every action look primary.

## 5. Shape, borders, and elevation

- **Small controls:** 6–8px radius.
- **Cards and panels:** 10–12px radius.
- **Large containers:** 14–16px radius only when the layout benefits from grouping.
- **Borders:** 1px solid `#D8E4E8` or a similarly subtle neutral.
- **Shadows:** use only for floating elements such as menus and dialogs; keep them soft and restrained.
- Avoid putting every element inside a card. Use cards for content that needs separation, not as a default wrapper.

## 6. Buttons

### Primary button
- Background: `#13293D`
- Text: white
- Use for the main action in a section or form.

### Accent button
- Background: `#1B98E0`
- Text: white
- Use when a bright action needs extra emphasis.

### Secondary / outline button
- Background: transparent or white
- Border: `#13293D`
- Text: `#13293D`

### Ghost button
- Background: transparent
- Text: `#006494`
- No visible border until hover, if needed.

### Interaction states

- **Hover:** slightly darken the background or add a subtle surface change.
- **Focus:** show a clearly visible 2px focus ring using `#1B98E0`, with sufficient offset.
- **Active:** use a pressed shade; do not rely on animation alone.
- **Disabled:** reduce emphasis and prevent interaction; maintain legible text.

Buttons should have concise labels that describe the result, such as **Create event**, **Save changes**, or **View members**.

## 7. Form fields

- Use a visible label above each field.
- Placeholder text is an example, not a replacement for a label.
- Default border: `#D8E4E8`.
- Focus border: `#1B98E0`, with a visible focus ring.
- Error border and message: accessible red with a clear explanation.
- Disabled fields should look inactive but remain readable.
- Keep input heights consistent, generally 40–44px.
- Align field widths and labels across a form.

## 8. Navigation

- Use `#13293D` for the brand mark, sidebar, or high-emphasis navigation areas.
- Use `#1B98E0` to identify the active page, with a text or shape cue in addition to color.
- Keep navigation labels short and familiar.
- Show the Skyline Student Association name beside the logo where space permits. In the manager header, use the logo alone on the left if that is the chosen layout.
- Place account actions and notifications together on the right.
- Avoid showing too many top-level links at once; group secondary destinations under **More** when appropriate.

## 9. Cards and data displays

Use cards when they help users scan distinct pieces of information.

- Keep card backgrounds white or near-white.
- Use a subtle border before adding a shadow.
- Make the primary value or title the strongest element.
- Place supporting context close to its value.
- Keep actions in predictable locations.
- Avoid decorative charts, fake trends, or invented metrics.
- Use charts only when they help answer a real question.
- Use consistent formatting for counts, dates, prices, and statuses.

Example metric card:

```text
Total members
248
Updated today
```

The example is a layout illustration only; replace the values with real application data.

## 10. Alerts and status

Use clear text and a restrained semantic color treatment.

- **Success:** confirm what completed and, when useful, what happens next.
- **Information:** provide useful context without interrupting the workflow.
- **Warning:** explain the risk and the action the user can take.
- **Error:** state what failed and how to recover.
- **Status:** pair color with a label or icon; never communicate status through color alone.

Avoid using bright colored backgrounds for large areas. A pale tint, concise message, and optional dismiss action are usually enough.

## 11. Icons and motion

- Use one consistent icon family and stroke weight.
- Prefer familiar, simple icons over custom illustrations for routine actions.
- Keep icons aligned to their text and sized consistently, usually 16–20px.
- Use motion only to communicate a state change or provide feedback.
- Keep transitions short and subtle, typically 150–220ms.
- Respect `prefers-reduced-motion`.
- Avoid parallax, bouncing controls, glowing borders, and animations that delay routine work.

## 12. Responsive behavior

- **Desktop:** use the available width for a clear main content area; avoid excessive full-width text.
- **Tablet:** reduce column count and preserve comfortable touch targets.
- **Mobile:** stack content, collapse secondary navigation, and keep primary actions easy to reach.
- Tables should remain usable on small screens through responsive columns, horizontal scrolling, or a deliberate card alternative.
- Aim for touch targets around 44px where practical.

## 13. Accessibility checklist

- [ ] Text and interactive controls meet WCAG contrast expectations.
- [ ] Every form field has a persistent label.
- [ ] Keyboard focus is visible and not hidden by sticky UI.
- [ ] Buttons and links have clear accessible names.
- [ ] Errors explain both the problem and the next step.
- [ ] Statuses do not rely on color alone.
- [ ] Layout works at zoom and on narrow screens.
- [ ] Reduced-motion preferences are respected.

## 14. CSS tokens

```css
:root {
  /* Brand palette */
  --color-navy: #13293D;
  --color-blue: #006494;
  --color-cerulean: #247BA0;
  --color-accent: #1B98E0;
  --color-canvas: #E8F1F2;

  /* Surfaces and borders */
  --color-surface: #FFFFFF;
  --color-border: #D8E4E8;
  --color-text: #13293D;
  --color-text-muted: #5F7485;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;

  /* Shape and motion */
  --radius-control: 8px;
  --radius-card: 12px;
  --radius-panel: 16px;
  --transition-fast: 180ms ease;
}
```

## 15. Final direction

Build a practical product interface, not a showcase of effects. Prioritize clear hierarchy, dependable spacing, restrained color, useful data, and predictable interactions. Every visual element should help users understand where they are, what matters, or what to do next.
