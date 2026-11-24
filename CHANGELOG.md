# Changelog

## 1.0.4

- **Security:** all values from the card configuration (names, icons, colours, titles) are now escaped or validated before they are put into the card's markup. Unsafe colour and icon values are ignored, names containing HTML are shown as plain text.
- Views (`views`): tabs in one card, each with its own settings, `show` / `hide` to show only parts (for example only solar or one zone), `default_view`
- Layout assistant (`layout_assistant`): drag the circles, positions are remembered per user and view, `positions` for a permanent layout; the canvas grows so moved circles are never cut off
- Time travel (`time_travel`): slider to show the values of an earlier time (history)
- Zone frames (`zone_frames`, per zone `frame`), circles without connection line (`no_link`)
- Custom icons and images (`custom_icons`, `my:name`, image URLs), floating value labels on lines (`line_labels`, per circle `line_label`)
- CO2 chip in the info line (`info.co2_entity`, `co2_factor`)
- Several dots per line (`flow_dots`), line gradient, square line corners, fill level, more weather effects
- Particle markers: `flow_marker: spark | drop | particles`
- Visual editor reorganised into sections, Safari fixes for number positions and gradients

## 1.0.3

- Design themes (`theme`) and 15 backgrounds: presets, custom colour, gradient or image
- Animated backgrounds (drifting colours, stars), automatic day/night background, weather background
- Circle styles (flat, glass, neon), circle shapes (circle, square, hexagon), size (global and per circle)
- Compact mode (off / auto / on)
- Sparklines (mini history curve in the circles)
- Line styles (dashed, dotted, flowing dashes, neon), arrow and diamond markers
- Numbers count smoothly to new values (`number_animation`)
- Status entries: smoke, gas, CO, water, motion, presence, light, switch, temperature, humidity and any entity, with warn/alert thresholds or text states
- Zoom in fullscreen now fills the whole screen instead of being clipped
- Visual editor has all new options

## 1.0.2

- First public release via HACS custom repository
