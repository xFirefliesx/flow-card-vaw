# Konfiguration (Referenz)

Alle Optionen mit Kommentaren. Fast alles lässt sich auch im visuellen Editor einstellen.

```yaml
flow-card-vaw – Energiefluss-Karte mit Leistung (W), Strom (A) und Spannung (V)

Installation (HACS): HACS > Dashboard > Repository suchen/hinzufügen > "Flow Card (W / A / V)" herunterladen,
  Browser neu laden. HACS trägt die Ressource selbst ein.
Installation (manuell): Datei nach /config/www/flow-card-vaw.js kopieren und unter
  Einstellungen > Dashboards > Ressourcen die URL /local/flow-card-vaw.js (JavaScript-Modul) eintragen.

Linien (wie im Original): Netz–Haus, Solar–Haus, Solar–Netz, Solar–Batterie,
Batterie–Haus, Batterie–Netz. Flussrichtungen der Punkte:
  Netzbezug   → nur ins Haus
  Solar       → Haus, dann Batterie, dann Netz
  Batterie    → Haus, dann Netz
Optional (Kartenebene): grid_to_battery: true  → Netzbezug darf auch die Batterie laden

type: custom:flow-card-vaw
grid:
  power: sensor.netz_leistung        # EIN Sensor: positiv = Bezug, negativ = Einspeisung
  # ODER getrennt:
  # import_power: sensor.netz_bezug
  # export_power: sensor.netz_einspeisung
  current: sensor.netz_strom
  voltage: sensor.netz_spannung
  secondary: sensor.irgendwas
solar:
  power: sensor.pv_leistung
  current: sensor.pv_strom
  voltage: sensor.pv_spannung
battery:
  power: sensor.batt_leistung        # EIN Sensor: positiv = Entladen (invert: true zum Umkehren)
  # ODER getrennt:
  # discharge_power: sensor.batt_ausgang   # Ausgangsleistung (Entladen)
  # charge_power: sensor.batt_eingang      # Eingangsleistung (Laden)
  current: sensor.batt_strom
  voltage: sensor.batt_spannung
  soc: sensor.batt_soc                # Ladestand als kleiner Kreis unter der Batterie (bzw. darüber im senkrechten Layout)
  soc_in_circle: true                 # optional: Ladestand stattdessen oben IM Batterie-Kreis
  children:                           # mehrere einzelne Batterien (bis 10) als kleine Kreise
    - sensor.batt1_soc                # kurz: nur der Ladestand
    - soc: sensor.batt2_soc
      name: Akku 2                    # optional
      power: sensor.batt2_leistung    # optional, positiv = Entladen (invert: true dreht um)
      temperature: sensor.batt2_temp  # optional (auch current, voltage, color)
home:                                # optional, sonst Summe aus Netz+Solar+Batterie
  power: sensor.haus_leistung
devices:
  - name: Kühlschrank
    icon: mdi:fridge
    power: sensor.kuehlschrank_power
    current: sensor.kuehlschrank_current
    voltage: sensor.kuehlschrank_voltage
    secondary: sensor.kuehlschrank_temperatur

Layout:
  layout: vertical      # baut sich nach unten auf: oben Solar | Netz | Batterie,
                        # darunter das Haus, darunter Zonen bzw. Geräte
                        # (ohne die Zeile: wie bisher waagrecht)

  Layout je Ausrichtung des Fensters (hochkant/quer) statt eines festen Layouts:
  layout:
    v: vertical         # Fenster hochkant (Höhe größer als Breite), z. B. am Handy
    h: horizontal       # Fenster quer, z. B. am PC oder Tablet
                        # Statt v/h gehen auch portrait/hochkant bzw. landscape/quer.
                        # Fehlt eine Seite, gilt der naheliegende Standard:
                        # hochkant senkrecht, quer waagrecht.
                        # Beim Drehen wechselt die Karte sofort, ohne Neuladen; der
                        # Layout-Assistent speichert die Positionen ohnehin getrennt
                        # je Ausrichtung.

Zonen (z. B. Stockwerke) vom Haus, mit eigenen Geräten (bis 6 Zonen, je bis 8 Geräte):
  zones:
    - name: 1. Stock
      icon: mdi:home-floor-1
      power: sensor.stock1_leistung   # optional – ohne power wird die Summe der Geräte gezeigt
      current: sensor.stock1_strom    # optional (wie bei allen Kreisen auch voltage, secondary, Farben)
      devices:
        - name: Kühlschrank
          icon: mdi:fridge
          power: sensor.kuehlschrank_power
          current: sensor.kuehlschrank_current
          voltage: sensor.kuehlschrank_voltage
    - name: 2. Stock
      devices: [...]
  Netz: Phasen und Frequenz
    grid:
      frequency: sensor.netzfrequenz          # zeigt "50.01 Hz" im Kreis (geht bei jedem Kreis)
      phases:                                 # bis 6 kleine Kreise (L1, L2, L3 …)
        - power: sensor.netz_l1_leistung      # optional, positiv = Bezug; ohne Gesamtsensor wird die Summe genutzt
          current: sensor.netz_l1_strom
          voltage: sensor.netz_l1_spannung
          name: L1                            # optional, sonst L1, L2, ...
        - { current: sensor.netz_l2_strom, voltage: sensor.netz_l2_spannung }
  Untergeräte (max. 6) als kleine Kreise unter einem Gerät (bei Geräten in Zonen und direkt am Haus):
    devices:
      - name: Schreibtisch
        power: sensor.schreibtisch_leistung   # optional – ohne power wird die Summe der Untergeräte gezeigt
        children:
          - name: Server
            power: sensor.server_leistung
            current: sensor.server_strom      # optional, ebenso voltage, temperature, color
          - sensor.monitore_leistung          # kurz: nur die Leistung
      Die Untergeräte erben die Farbe des Geräts (oder color: setzen) und werden bei ~0 W wie Geräte ausgegraut.
  Phasen (L1/L2/L3 …, max. 6) als kleine Kreise über einer Zone (im senkrechten Layout links daneben):
    - name: Wohnung
      phases:
        - power: sensor.wohnung_l1_leistung   # Name wird automatisch L1, L2, ... (oder name: setzen)
          current: sensor.wohnung_l1_strom    # optional, ebenso voltage, temperature, color
        - power: sensor.wohnung_l2_leistung
        - sensor.wohnung_l3_leistung          # kurz: nur die Leistung
      Ohne eigenen power-Sensor der Zone wird die Summe der Phasen als Zonenleistung gezeigt.
  Ein normales "devices:" neben "zones:" erscheint als zusätzliche Zone "Sonstige"
  (Name änderbar mit devices_name: ...). Ohne "zones:" bleibt alles wie bisher.

Einzelne Solar-Panels (bis 10) als kleine Kreise über dem Solar-Kreis:
  solar:
    power: sensor.pv_gesamt          # optional – ohne power wird die Summe der Panels gezeigt
    children:
      - sensor.panel_1_leistung      # kurz: nur die Leistung
      - power: sensor.panel_2_leistung
        name: Süd 2                  # optional, steht über dem Kreis
        current: sensor.panel_2_strom    # optional
        voltage: sensor.panel_2_spannung # optional
        color: "#ffa000"             # optional (Standard: Solarfarbe)

Anzeige im Kreis (bei JEDEM Kreis, auch Panels, Zonen, Geräte):
  power:       Leistung (immer)
  current:     Strom   – wird NUR angezeigt, wenn eingetragen
  voltage:     Spannung – wird NUR angezeigt, wenn eingetragen
  temperature: Temperatur in °C – wird NUR angezeigt, wenn eingetragen
               (°F und K werden umgerechnet)
               temperature: sensor.x
               temperature: {entity: sensor.x, decimals: 0}   # Standard: 1 Nachkommastelle

Haus-Ring: Um das Haus liegt ein Ring, dessen Abschnitte (in der Farbe der Zonen bzw. Geräte
direkt am Haus) zeigen, wie viel Prozent des Hausverbrauchs jede Gruppe verbraucht.
Standardmäßig an; ausschalten mit  home: {ring: false}

Zählerstände unter dem Netz-Kreis (zwei kleine Zeilen):
  grid:
    meter:
      import: sensor.zaehlerstand_bezug        # kWh (Wh und MWh werden umgerechnet)
      export: sensor.zaehlerstand_einspeisung  # optional
      decimals: 1                              # optional, Standard 1
      import_name: Bezug                       # optional
      export_name: Einspeisung                 # optional

15-Minuten-Spitze (Netzentgelte) – Ring um den Netz-Kreis + kleiner Kreis mit dem Monatsmaximum:
  grid:
    peak:
      max: sensor.leistungsspitze_monat    # Monatsmaximum (W oder kW)
      live: sensor.viertelstunde_live      # laufende Viertelstunde, aktualisiert sich ständig
      last: sensor.viertelstunde_letzte    # optional: zuletzt abgeschlossene Viertelstunde
      warn_at: 90                          # optional: Warnfarbe ab x % vom Maximum (Standard 90)
      name: Spitze 15 min                  # optional, Beschriftung des kleinen Kreises
      ok_color: "#43a047"                  # optional (Standard grün)
      warn_color: "#fbc02d"                # optional (Standard gelb)
      alert_color: "#e53935"               # optional (Standard rot, blinkt bei neuem Maximum)
  Der Ring füllt sich mit live / max. Ab warn_at wird er gelb, ab 100 % (neues Maximum) rot und blinkt.

Status von Garagentor, Fenstern, Türen, Schlössern (cover, binary_sensor, lock):
  status:
    - name: Garagentor
      entity: cover.garagentor           # oder binary_sensor mit device_class garage_door/door/window
      show: [header, info]               # header = Kopfzeile, info = Infozeile, circles = Kreis unten (je Sensor)
      at: Garage / Keller                # optional: Abzeichen am Kreis mit diesem Namen
      warn_after: 600                    # optional: nach 600 Sekunden (= 10 min) offen rot und blinkend
      open_states: [Geöffnet]            # optional: eigene Zustandstexte, die "offen" bedeuten (Standard erkennt on/open/offen/geöffnet/öffnet/schließt ...)
      closed_states: [Geschlossen]       # optional: eigene Zustandstexte für "zu"
      switch: true                       # optional: kleiner Schalter-Knopf (true = der Sensor selbst, oder z. B. switch.garage_relais)
      switch_confirm: true               # optional: beim Knopf vorher nachfragen
      toggle: true                       # optional: Antippen öffnet/schließt (Schloss: auf-/zusperren)
      confirm: true                      # optional: vorher nachfragen
    - name: Fenster
      entities: [binary_sensor.fenster_wz, binary_sensor.fenster_sz, binary_sensor.fenster_kueche]
      show: [header, circles]            # Kopfzeile: "Fenster: 2 von 5 offen", unten ein Kreis pro Fenster
      at: Wohnung                        # Abzeichen mit Zähler an der Zone "Wohnung"
      hide_closed: true                  # Abzeichen nur, wenn etwas offen ist
  Weitere Optionen je Eintrag: kind (garage|window|door|lock), invert (Sensor "on" = zu), icon, icon_open,
  open_text, closed_text, open_color, closed_color, alert_color. Ohne show: nur Kopfzeile.
  Offen = orange, nach warn_after rot und blinkend, zu = grün. Antippen öffnet den Verlauf des Sensors.

Ruhemodus (z. B. nachts oder für ein Wandtablet):
  calm:
    always: false         # true = immer ruhig
    entity: input_boolean.nacht   # optional: ruhig, solange der Sensor "on" ist (sun.sun: unter dem Horizont)
    from: "22:00"         # optional: ruhig von ... bis ... (auch über Mitternacht)
    to: "06:00"
    dots: slow            # slow (Standard) | off | normal
    dim: 0.75             # Helligkeit der Karte im Ruhemodus (0.2 bis 1)
    follow_system: false  # true = auch ruhig, wenn das Gerät "Animationen reduzieren" eingestellt hat
  Im Ruhemodus: Punkte langsamer oder aus, kein Leuchten/Pulsieren, Karte gedimmt.

Schalter am Kreis (bei Geräten, Zonen und Untergeräten): kleiner Ein/Aus-Knopf oben rechts am Kreis
  devices:
    - name: Herd
      power: sensor.herd_leistung
      switch: switch.herd          # schaltet per homeassistant.toggle (Taste/Szene/Skript: drücken/starten)
      switch_confirm: true         # optional: vorher nachfragen

Optik (alles einzeln abschaltbar, Standard: an):
  line_width: true        # Linien werden mit der Leistung dicker
  line_width_max: 6       # maximale Linienstärke (Standard 6)
  glow: true              # aktive Kreise leuchten leicht in ihrer Farbe
  pulse: true             # starke Verbraucher pulsieren
  pulse_above_w: 1000     # ab dieser Leistung (W) pulsiert ein Gerät
  gradient: true          # leichter Farbverlauf und Schatten in den Kreisen
  number_scale: 1         # Größe der Zahlen in den Kreisen (0.5 bis 1.6)
  tap_action: true        # Antippen eines Kreises öffnet den Verlauf des Sensors
  limit_colors: true      # Kreis/Wert wird rot, wenn ein Grenzwert verletzt wird
  zoom: true              # Zoomen: Strg + Mausrad (im Vollbild nur Mausrad), Pinch am Handy, Ziehen zum Verschieben, Knöpfe + / − unten
  zoom_max: 4             # maximaler Zoom (Standard 4)
  limits:                 # Grenzwerte (alle optional)
    voltage_min: 207      # Standard 207 V
    voltage_max: 253      # Standard 253 V
    current_max: 16       # Strom-Grenze in A (Standard: keine), pro Kreis auch mit current_max
    frequency_min: 49.8   # Standard 49.8 Hz
    frequency_max: 50.2   # Standard 50.2 Hz
    color: "#e53935"
  battery:
    soc_icon: true        # Batterie-Icon passt sich dem Ladestand an (nicht, wenn du ein icon einträgst)
    soc_ring: true        # Ring um die Batterie (und die kleinen Akku-Kreise) mit dem Ladestand
    capacity: 10          # Kapazität in kWh (Zahl oder Sensor), für info.battery_time
  solar:
    max_power: 6000       # installierte Leistung in W -> Ring zeigt die Auslastung
  grid:
    price: sensor.strompreis   # Preis-Sensor (Chip in der Infozeile)
    price_low: 0.15            # bis hier grün
    price_high: 0.30           # ab hier rot (dazwischen gelb)
    price_circle: true         # Rand des Netz-Kreises nach Preis färben
  info:                   # Infozeile unter der Karte
    autarky: true         # Autarkie in % (live)
    self_consumption: true  # Eigenverbrauch in % (live)
    battery_time: true    # Akku reicht noch ... / voll in ... (braucht battery.capacity)
    items:                # weitere Werte, z. B. Tageswerte
      - name: Solar heute
        entity: sensor.solar_energie_heute
        icon: mdi:solar-power
        decimals: 1

Kopfzeile links oben (alles optional):
  title: Energie Zuhause      # frei änderbarer Titel
  date: sensor.date           # Sensor mit dem Datum (z. B. sensor.date, ISO-Format) -> "Do., 19.11.2026"
  time: sensor.time           # Sensor mit der Uhrzeit (z. B. sensor.time oder ein Zeitstempel) -> "10:37"
  time_seconds: false         # true = Uhrzeit mit Sekunden

Karten-Optionen (ganz oben in der YAML):
  fullscreen_button: true # Vollbild-Knopf unten rechts (false = ausblenden). Esc beendet das Vollbild
  dim_idle: true          # Geräte/Zonen mit ~0 W werden ausgegraut (false = aus)
  idle_below: 1           # ab welcher Leistung (W) ein Gerät als "aus" gilt
  idle_opacity: 0.4       # wie stark ausgegraut (0 = unsichtbar, 1 = normal)
  speed_max_w: 3000       # bei dieser Leistung laufen die Punkte am schnellsten
                          # (Geschwindigkeit steigt mit der Leistung, logarithmisch)

Beliebige weitere Sensoren im Kreis (bei JEDEM Kreis, z. B. Haus; bis zu 4 Zeilen):
  home:
    power: sensor.haus_leistung
    temperature: sensor.haus_temperatur
    extra:
      - sensor.luftfeuchte                          # einfach: Wert + Einheit des Sensors
      - {entity: sensor.co2, name: CO2}             # mit Namen davor
      - {entity: sensor.x, unit: kWh, decimals: 1}  # Einheit/Nachkommastellen überschreiben

Farben (bei JEDEM Kreis möglich, Farbcode wie '#ff9800' oder 'red'):
  color:        Kreisrand (und Standard für alles andere)
  icon_color:   Icon
  line_color:   Linien/Punkte dieses Kreises
  text_color:   Zahlen (W, A, V)
  Richtungsabhängige Kreisfarbe (nur grid und battery, sonst gilt color):
    grid:    import_color (Bezug)      / export_color (Einspeisung)
    battery: discharge_color (Entladen) / charge_color (Laden)
  Der Kreisrand wechselt je nach Richtung die Farbe, im Ruhezustand gilt color.
  export_color / charge_color färben auch die zweite Zeile im Kreis (Standard grün).
  label_pos:    top | bottom – Position von Name und secondary (Solar: top)

secondary (bei JEDEM Kreis möglich) – kleine Zusatzzeile unter dem Namen:
  secondary: sensor.x
  secondary: {entity: sensor.x, name: Temp, unit: °C, decimals: 1}
  secondary:
    - sensor.x
    - {entity: sensor.y, name: Tag, unit: kWh}
Status: Rauchmelder, Temperaturen, beliebige Entitäten (zusätzlich zu Garage/Fenster/Tür/Schloss):
  kind: smoke | gas | co | water | problem | motion | presence | light | switch | temperature | humidity | sensor
        (leer = automatisch aus der device_class; "sensor" = beliebiger Messwert oder Text)
  Alarm-Arten (Rauch, Gas, CO, Wasser, Störung): "an" = Alarm (rot, blinkend), sonst grün.
  Messwerte (Temperatur, Luftfeuchte, beliebige Zahlen):
    warn_above: 25      # orange über diesem Wert
    warn_below: 10      # orange unter diesem Wert
    alert_above: 30     # rot und blinkend über diesem Wert
    alert_below: 5      # rot und blinkend unter diesem Wert
    unit: °C            # optional, Einheit überschreiben
    decimals: 1         # optional, Nachkommastellen
  Texte (z. B. Heizung):
    warn_states: [heizen]       # orange bei diesen Zuständen
    alert_states: [störung]     # rot bei diesen Zuständen
  Beispiel:
    status:
      - name: Rauchmelder
        entities: [binary_sensor.rauch_flur, binary_sensor.rauch_kueche]
        show: [header, circles]
      - name: Wohnzimmer
        entity: sensor.wohnzimmer_temperatur
        warn_above: 25
        alert_above: 30
      - name: Heizung
        entity: sensor.heizung_status
        kind: sensor
        warn_states: [heizen]
        icon: mdi:radiator

Design-Vorlage (setzt Hintergrund, Kreisstil, Animation und Form auf einmal; eigene Einstellungen haben Vorrang):
  theme: neon_night      # neon_night | glass_aurora | minimal_light | hex_tech | cozy_sunset | ocean_calm | blueprint

Hintergrund (Karte):
  background: midnight   # default (Design von Home Assistant) | transparent | dark | black | light |
                         # midnight | aurora | sunset | ocean | forest | grid | dots | color | gradient | image
  background_color: "#1b2838"                  # bei background: color
  background_gradient: "linear-gradient(160deg, #222, #446)"   # bei background: gradient (CSS)
  background_image: /local/bild.jpg            # bei background: image
  background_blur: 6     # Unschärfe des Bildes in px (0 bis 30)
  background_dim: 0.35   # Abdunkeln des Bildes (0 bis 0.9)
  background_text: auto  # auto | light | dark – Schriftfarbe auf dem Hintergrund
  background_animation: none   # none | drift (wandernde Farbflächen) | stars (funkelnde Sterne)
  Tag/Nacht-Automatik:
    background_night: midnight        # Hintergrund bei Nacht (Vorlage; none = kein Wechsel)
    background_night_entity: sun.sun  # Standard sun.sun (Nacht = unter dem Horizont); bei anderen Entitäten bedeutet "on" Nacht
  Wetter-Hintergrund:
    background_weather: weather.home  # Regen, Schnee, Wolken, Nebel, Blitze, Sonne (clear-night = Sterne)
  Animationen pausieren im Ruhemodus und laufen nicht, wenn das Gerät "Animationen reduzieren" eingestellt hat.

Kreise:
  circle_style: default  # default | flat (ohne Verlauf/Schatten) | glass (halbtransparent) | neon (dünner Ring, starkes Leuchten)
  node_shape: circle     # circle | square (abgerundetes Viereck) | hexagon (Sechseck); gilt auch für Ringe und Status-Kreise
  node_size: 1           # Größe aller Kreise (0.6 bis 1.4)
  home: {size: 1.2}      # Größe eines einzelnen Hauptkreises (grid, solar, battery, home, Geräte; 0.5 bis 1.6)
  compact: off           # off | auto (bei Karten unter 440 px Breite) | on – kleinere Abstände und Schrift, ohne Datum/Zoom-Knöpfe
  sparkline: true        # kleiner Verlauf der letzten Stunden hinter dem Messwert (große Kreise)
  sparkline_hours: 6     # Zeitraum 1 bis 48 Stunden, braucht Recorder-Daten (Historie), Update alle 10 Minuten
  grid: {sparkline: false}      # pro Kreis abschalten (oder true, um ihn bei kleinen Kreisen zu erzwingen)

Linien:
  line_style: solid      # solid | dashed | dotted | flow (animierte Striche) | neon (leuchtende Linien)
  flow_marker: dot       # dot | arrow (Pfeil in Flussrichtung) | diamond (Raute)

Zahlen:
  number_animation: false   # true = Zahlen zählen sanft zum neuen Wert (bei gleicher Einheit)

Neu in 1.1.0:

Ansichten (Tabs, ab 2 Einträgen sichtbar):
  default_view: Live     # Name oder Nummer der Startansicht
  views:
    - name: Live
      icon: mdi:flash
    - name: Solar
      icon: mdi:solar-power
      show: [solar]       # nur diese Teile zeigen: grid, solar, battery, devices, zones oder ein Zonen-Name (das Haus bleibt)
      # hide: [battery]   # oder bestimmte Teile ausblenden
      compact: "on"       # jede andere Karten-Option kann pro Ansicht überschrieben werden, null entfernt sie
      positions: {solar: {x: 40, y: 20}}

Layout-Assistent:
  layout_assistant: true  # Knopf oben rechts; Kreise ziehen, Positionen bleiben pro Benutzer und Ansicht gespeichert
  layout_id: wohnhaus     # optional, wenn mehrere Karten den gleichen Titel haben
  positions:              # dauerhaft für alle (Assistent danach ausschalten); Verschiebung in Pixeln
    solar: {x: -120, y: 40}

Zeitreise:
  time_travel: true       # Uhr-Knopf oben rechts, Regler zeigt die Werte eines früheren Zeitpunkts (braucht Recorder-Daten)
  time_travel_hours: 24   # 1 bis 168

Zonen und Kreise:
  zone_frames: true       # Rahmen um jede Zone samt Geräten; pro Zone mit frame: false abschaltbar
  zones:
    - name: Wallbox
      no_link: true       # keine Verbindungslinie, steht allein
      line_label: true    # Wert an den Linien dieses Kreises

Linien:
  line_labels: true       # Wert-Labels an allen Linien, oder eine Liste von Linien-Namen
  flow_dots: auto         # 1 | 2 | 3 | auto (mehr Punkte bei mehr Leistung)
  flow_marker: particles  # dot | arrow | diamond | spark (Funken) | drop (Tropfen) | particles (Funken bei Solar/Batterie, sonst Tropfen)
  line_gradient: true     # Farbverlauf von der Quelle zum Ziel
  line_corners: round     # round | square

Eigene Icons und Bilder:
  custom_icons:
    wallbox: /local/icons/wallbox.svg
    pv: {url: /local/icons/pv.png, tint: true}   # tint: mit der Icon-Farbe einfärben (einfarbige Bilder)
  solar: {icon: my:pv}    # oder direkt eine Bild-URL; Icon-Angaben mit Leerzeichen, Anführungszeichen oder < > werden ignoriert

Infozeile:
  info:
    co2_entity: sensor.solar_ertrag_heute
    co2_factor: 0.2       # kg pro kWh
    co2_name: CO₂ gespart

Neu in 1.1.1:

Größe und Schrift pro Kreis:
  solar: {size: 1.3, font_size: 1.2}   # size = Durchmesser (0.5 bis 1.6), font_size = Schriftgröße (0.5 bis 2.5)
  font_follow_size: true               # Schrift wächst mit der Kreisgröße (font_size überschreibt das pro Kreis)
  # size und font_size gibt es bei grid, solar, battery, home, zones, devices, children, phases und status

Sammelkreis Rest:
  rest: true             # Hausverbrauch minus alle Zonen und Geräte (nie negativ)
  # oder: rest: {name: Sonstiges, icon: "mdi:dots-horizontal-circle-outline", color: "#9e9e9e", size: 1.2, no_link: false}

Layout-Assistent (zusätzlich):
  # Raster (10) und Hilfslinien über die Leiste unten; jeder kleine Kreis ist einzeln verschiebbar
  positions:
    solar_c0: {x: -40, y: 20}   # Panel 1 von Solar (solar_c0, solar_c1 ...)
    gph_1: {x: 0, y: 30}        # Phase 2 am Netz (gph_0, gph_1 ...)
    bat_c0: {x: 10, y: 0}       # Batterie 1
    st_0_0: {x: 0, y: -200}     # Status-Kreis (Eintrag 0, Sensor 0)

Sicherheit: Farben dürfen nur Namen, #hex, rgb()/hsl()/var() und Verläufe enthalten, andere Werte werden ignoriert.
```
