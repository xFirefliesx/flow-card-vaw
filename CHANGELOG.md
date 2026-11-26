# Changelog

## 1.2.2 (dev)

- `layout` can now be set per window orientation: `layout: {v: vertical, h: horizontal}` picks the vertical build-down layout while the window is portrait and the horizontal one while it is landscape. `portrait`/`hochkant` and `landscape`/`quer` work as key names too
- A missing side falls back to the obvious default (portrait vertical, landscape horizontal); a plain `layout: vertical` or `layout: horizontal` keeps working unchanged
- Rotating the device switches the layout right away, without a reload, and loads the positions the layout assistant already stores separately per orientation
- Visual editor: Layout has a third choice, “Je nach Ausrichtung des Fensters”, plus one select each for portrait and landscape

## 1.2.1

- Layout assistant: circle positions are stored separately for portrait and landscape. Moving a circle in one orientation no longer changes the other, and rotating the device loads the matching layout without a reload
- Positions saved so far keep working: they are the starting point for both orientations until a circle is moved in that orientation for the first time

## 1.1.1

- Layout assistant: the small circles (solar panels, batteries, phases L1-L3, peak, sub-devices) can now be dragged one by one, with grid snapping and alignment guides; the canvas grows or shifts so nothing is cut off. Status circles are movable too, all the way to the top
- Layout assistant: grid (10 units) and pink alignment guides that snap to the centre of other circles, switchable with the grid button
- Per-circle diameter slider (`size`, 0.5 to 1.6) for main circles, zones, devices, sub-devices, phases, panels, batteries and status circles
- Font size per circle (`font_size`, 0.5 to 2.5) or following the circle size (`font_follow_size: true`)
- Collection circle `rest` (house consumption minus all zones and devices, never negative)
- Fix: header and info line of status entries were empty after a redraw (view switch, layout assistant, time travel)
- Fix: status chips in the header no longer hide under the time travel and layout buttons
- Visual editor re-ordered by topic (card, views, layout and time travel, data, appearance); every option is still there

## 1.1.0

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
