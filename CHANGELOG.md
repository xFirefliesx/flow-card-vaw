# Changelog

## 1.2.3

Positions across devices

- Fix: positions saved on one device were lost as soon as a second device saved. Each device pushed its whole local store to Home Assistant, so the last writer wiped the other one's layouts. A save now re-reads the stored state and writes only its own entries into it
- Positions are picked up while the card stays open: at most every 15 seconds, and immediately when the window is focused again. A change made on the phone shows up on the desktop without `Ctrl+F5`
- Resetting a layout reaches the other devices too now; it leaves a delete marker instead of only dropping the entry locally

Layout assistant

- New: `Rückgängig` takes back the last single step - one circle, one frame, one line corner - instead of discarding the whole arrangement. Up to forty steps; a tap that moves nothing does not use one up
- New: `für hochkant übernehmen` copies the current arrangement to the other orientation. Positions stay stored per orientation, the button is the shortcut when both should look alike
- New: the dashed zone frame can be dragged on its own and resized at its four corners; the circles inside stay where they are. Stored as `zf_<zone>` with `x`, `y`, `w`, `h`, where `w`/`h` are changes against the automatic box, so the frame keeps following the circles
- New: every line carries two handles, one on each of its right-angle corners. Dragging a corner sets that bend, and the side a line leaves or enters a circle on follows from where its corner sits - put the first corner below the circle and the line leaves downwards. The anchor point slides along the circle's edge with it. Stored as `ln_<line>` with `c1: [x, y]` and `c2: [x, y]`
- Fix: the card jumped and rescaled several times a second while something was dragged, visible as a crawling grid. The canvas now keeps exactly the size it had before the drag and is measured again only on release
- Fix: opening or closing the assistant, and switching views, dropped the card out of full screen. Full screen is requested on the card element itself now, not on the `ha-card` inside it that is rebuilt on every redraw

Lines

- Lines leave a circle from the middle of its side, evenly spread around that middle, 18px apart where the circle is big enough. They used to be counted separately upwards and downwards, which left the bundle off-centre, and the gap shrank with every additional line
- Fix: lines crossed each other on the way to the devices. The one heading furthest out turns closest to the circle now and the middle ones turn last, so no line has to cross another's vertical run

Other

- Fix: in full screen the card is opaque even when its background is set to transparent. The dashboard and other cards used to show through, including their time-travel bars
- Fix: the time-travel label no longer changes the slider's width when it switches from "Jetzt" to a date, so the slider stops jumping out from under the pointer. It also holds still while the slider is being dragged
- Fix: icons of status circles drifted below their circles when a dragged status circle reached past the lower edge of the card

## 1.2.2

- `layout` can now be set per window orientation: `layout: {v: vertical, h: horizontal}` picks the vertical build-down layout while the window is portrait and the horizontal one while it is landscape. `portrait`/`hochkant` and `landscape`/`quer` work as key names too
- A missing side falls back to the obvious default (portrait vertical, landscape horizontal); a plain `layout: vertical` or `layout: horizontal` keeps working unchanged
- Rotating the device switches the layout right away, without a reload, and loads the positions the layout assistant already stores separately per orientation
- Visual editor: Layout has a third choice, “Je nach Ausrichtung des Fensters”, plus one select each for portrait and landscape
- Views can now show or hide the status entries too: `status` works in `show` and `hide` like the other parts, and `status_circles` (the circles at the bottom) and `status_chips` (the chips in the header and info line) address the two halves on their own. Note that a view with a `show` list that does not name any of them no longer shows the status entries
- Fix: the `rest` circle stayed visible in views that hide the devices (`show: [grid, solar, battery]` or `hide: [devices]`), showing the whole house consumption. It now follows the devices, and `rest` can be named in `show`/`hide` to control it on its own
- Layout per view (tab): a view can set `layout` itself, as a single word or as the `{v, h}` object, and it overrides the card. The visual editor now has those three fields on every view as well, so e.g. the “Alles” tab can follow the orientation while “Geräte” stays vertical

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
