# Flow Card (W / A / V)

A Home Assistant dashboard card in the style of the Energy distribution card, but with **power (W), current (A) and voltage (V)** on every circle.

![Flow Card](screenshot.png)

*Screenshot rendered with test data.*

Love the Work that i did?
<a href="https://www.buymeacoffee.com/xFirefliesx">
  <img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee" height="120">
</a>
## Features

- Grid, solar, battery, house, zones and devices as circles with animated flow dots
- Power, current, voltage, temperature, state of charge, frequency, phases (L1/L2/L3)
- 15-minute peak (Spitze) and meter readings (import/export)
- Several batteries and several solar strings as small child circles
- Horizontal and vertical layout, fullscreen button, zoom and pan
- Title, date and time sensors
- Status of garage door, windows, doors and locks (header pills, info line, badge on a circle, independent circles at the bottom), warning after a configurable time
- Switch button per device circle and per status entry (toggle lights, open/close the garage door, lock/unlock)
- Calm mode (dimmed display at night), limit colours, gradients, glow and pulse effects - each option can be switched off
- Visual editor (every option) and YAML

## Installation

### HACS (recommended)

1. HACS → three dots → **Custom repositories**
2. Repository: `https://github.com/xFirefliesx/flow-card-vaw`, category **Dashboard**
3. Download **Flow Card (W / A / V)**, then reload the browser.

HACS adds the resource automatically. If you use YAML dashboards, add it yourself:

```yaml
resources:
  - url: /hacsfiles/flow-card-vaw/flow-card-vaw.js
    type: module
```

### Manual

1. Copy `flow-card-vaw.js` to `/config/www/`.
2. Settings → Dashboards → Resources → add `/local/flow-card-vaw.js` as **JavaScript module** (add `?v=2`, `?v=3` ... after updates to bypass the browser cache).

## Minimal configuration

```yaml
type: custom:flow-card-vaw
grid:
  power: sensor.grid_power        # positive = import, negative = export
  current: sensor.grid_current
  voltage: sensor.grid_voltage
solar:
  power: sensor.pv_power
battery:
  power: sensor.battery_power     # positive = discharging
  soc: sensor.battery_soc
home:
  power: sensor.house_power
```

Almost everything can be set in the visual editor. All options with comments are documented in [CONFIGURATION.md](CONFIGURATION.md) (in German).

### Status entries (garage door, windows, locks)

```yaml
status:
  - name: Garage door
    entity: cover.garage
    kind: garage
    show: [header, info, circles]
    warn_after: 600        # seconds open before it turns red and blinks
    switch: true           # small button to open/close
  - name: Front door
    entity: lock.front_door
    kind: lock
    show: [info, circles]
    switch: true
    switch_confirm: true   # ask before locking/unlocking
```

State texts such as `on/off`, `open/closed`, `opening/closing`, `locked/unlocked` and German texts (`geöffnet`, `geschlossen`, `öffnet`, `schließt`) are recognised. Use `open_states` / `closed_states` for your own texts.

### Zoom

Ctrl + mouse wheel (mouse wheel alone in fullscreen), pinch on touch screens, drag to pan, or use the + / − buttons at the bottom right. Disable with `zoom: false`, limit with `zoom_max: 4`.

## Troubleshooting

- **Card not found / old version after update**: reload the browser with Ctrl+Shift+R or clear the app's frontend cache. The card version is shown at the top of the visual editor.
- **Switch buttons do nothing**: the entity must be controllable (`switch`, `light`, `cover`, `lock`, `button`, `scene`, `script`, ...) and available.

## Deutsch

Eine Energiefluss-Karte für Home Assistant mit Leistung (W), Strom (A) und Spannung (V) an jedem Kreis. Installation über HACS als benutzerdefiniertes Repository (Kategorie *Dashboard*) oder manuell (siehe oben). Die vollständige, kommentierte Konfiguration steht in [CONFIGURATION.md](CONFIGURATION.md); fast alles lässt sich im visuellen Editor einstellen.

## License

MIT
