// Testversion der Flow Card - Kartentyp: custom:flow-card-vaw-dev
// Diese Datei wird von tools/build-dev.py erzeugt, Aenderungen bitte in flow-card-vaw.js machen.
(() => {
const ST_ICONS = {
  garage: ['mdi:garage', 'mdi:garage-open'],
  window: ['mdi:window-closed', 'mdi:window-open'],
  door: ['mdi:door-closed', 'mdi:door-open'],
  lock: ['mdi:lock', 'mdi:lock-open-variant'],
  smoke: ['mdi:smoke-detector-variant', 'mdi:smoke-detector-variant-alert'],
  gas: ['mdi:gas-cylinder', 'mdi:alert-circle'],
  co: ['mdi:molecule-co', 'mdi:alert-circle'],
  water: ['mdi:water-check', 'mdi:water-alert'],
  problem: ['mdi:check-circle-outline', 'mdi:alert-circle'],
  motion: ['mdi:motion-sensor-off', 'mdi:motion-sensor'],
  presence: ['mdi:account-off-outline', 'mdi:account-check'],
  light: ['mdi:lightbulb-outline', 'mdi:lightbulb-on'],
  switch: ['mdi:toggle-switch-off-outline', 'mdi:toggle-switch'],
  temperature: ['mdi:thermometer', 'mdi:thermometer'],
  humidity: ['mdi:water-percent', 'mdi:water-percent'],
  sensor: ['mdi:gauge', 'mdi:gauge'],
};
// w = Woerter [normal, aktiv], alarm = aktiv ist sofort Alarm (rot, blinkend), act = aktiv ist nur "an" (gelb), num = Messwert
const ST_META = {
  smoke: { w: ['OK', 'Alarm'], alarm: true },
  gas: { w: ['OK', 'Gas'], alarm: true },
  co: { w: ['OK', 'CO-Alarm'], alarm: true },
  water: { w: ['trocken', 'Wasser'], alarm: true },
  problem: { w: ['OK', 'St\u00f6rung'], alarm: true },
  motion: { w: ['ruhig', 'Bewegung'], act: true },
  presence: { w: ['abwesend', 'anwesend'], act: true },
  light: { w: ['aus', 'an'], act: true },
  switch: { w: ['aus', 'an'], act: true },
  temperature: { num: true, u: '\u00b0C', dec: 1 },
  humidity: { num: true, u: '%', dec: 0 },
  sensor: { num: true },
};
const PALETTE = ['#9c27b0', '#ff5722', '#03a9f4', '#cddc39', '#009688', '#795548'];
const VW = 620;
const VH = 410;

// Hintergruende: bg = CSS-Hintergrund, fill = Fuellfarbe der Kreise, text = helle/dunkle Schrift, plain = ohne Rand/Schatten
const VAW_BG = {
  transparent: { bg: 'transparent', fill: 'var(--primary-background-color, #111)', plain: true },
  dark: { bg: '#1c1f26', fill: '#1c1f26', text: 'light' },
  black: { bg: '#000000', fill: '#000000', text: 'light' },
  light: { bg: '#f4f6f8', fill: '#ffffff', text: 'dark' },
  midnight: { bg: 'linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #0b1220 100%)', fill: '#141d2f', text: 'light' },
  aurora: { bg: 'radial-gradient(120% 90% at 8% 0%, rgba(0, 255, 170, 0.26), transparent 55%), radial-gradient(100% 80% at 100% 12%, rgba(130, 90, 255, 0.32), transparent 58%), linear-gradient(180deg, #0a1020, #0b1a24)', fill: '#0d1626', text: 'light' },
  sunset: { bg: 'linear-gradient(160deg, #1f1147 0%, #5b2a6e 55%, #8a3b4f 100%)', fill: '#2a1636', text: 'light' },
  ocean: { bg: 'linear-gradient(160deg, #04202e 0%, #0b4a5f 60%, #0f6b73 100%)', fill: '#07303f', text: 'light' },
  forest: { bg: 'linear-gradient(160deg, #0d1f17 0%, #1d4a33 100%)', fill: '#11291e', text: 'light' },
  grid: { bg: 'linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px) 0 0 / 24px 24px, linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px) 0 0 / 24px 24px, #0e1621', fill: '#0e1621', text: 'light' },
  dots: { bg: 'radial-gradient(rgba(255, 255, 255, 0.10) 1.3px, transparent 1.6px) 0 0 / 20px 20px, #101820', fill: '#101820', text: 'light' },
};
const VAW_TEXT = { light: ['#f1f5f9', '#a9b4c4'], dark: ['#1f2933', '#52606d'] };
function vawParseColor(str) {
  const t = String(str || '').trim().toLowerCase();
  let m = t.match(/^#([0-9a-f]{3})$/);
  if (m) return m[1].split('').map((h) => parseInt(h + h, 16));
  m = t.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].substr(i, 2), 16));
  m = t.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  return null;
}

const vl0 = (x) => String(x).trim().toLowerCase();

class FlowCardVAW extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  setConfig(config) {
    if (!config) throw new Error('Keine Konfiguration');
    this._cfg0 = config;
    this._la = false;
    this._laTxt = false;
    this._ttOn = false;
    this._ttOver = null;
    this._ttMin = 0;
    if (this._realHass) this._hass = this._realHass;
    const vs = this._viewList();
    if (this._vi === undefined || this._vi >= vs.length) {
      let i = 0;
      const dv = config.default_view;
      if (typeof dv === 'number') i = dv;
      else if (typeof dv === 'string') {
        const j = vs.findIndex((v) => v.name === dv);
        if (j >= 0) i = j;
      }
      try {
        const sv = localStorage.getItem('flow-card-vaw-view:' + vs.map((v) => v.name).join('|'));
        if (sv !== null && Number(sv) < vs.length) i = Number(sv);
      } catch (e) { /* ignorieren */ }
      this._vi = Math.max(0, Math.min(Math.max(0, vs.length - 1), Math.floor(Number(i)) || 0));
    }
    this._applyCfg();
  }

  // Ausrichtung des Fensters: 'v' = hochkant, 'h' = quer. Die Positionen des
  // Layout-Assistenten werden je Ausrichtung getrennt gespeichert.
  _orient() {
    try {
      const w = window.innerWidth || 0;
      const h = window.innerHeight || 0;
      return w && h && w < h ? 'v' : 'h';
    } catch (e) {
      return 'h';
    }
  }

  // Layout: 'horizontal' oder 'vertical'. layout kann auch je Fenster-Ausrichtung
  // gesetzt werden: layout: {v: <hochkant>, h: <quer>}. Statt v/h gehen auch
  // portrait/hochkant bzw. landscape/quer. Fehlt eine Seite, gilt der naheliegende
  // Standard: hochkant senkrecht, quer waagrecht.
  _layout() {
    const c = this._c || {};
    const o = this._orient();
    const norm = (x) => {
      const t = String(x === undefined || x === null ? '' : x).trim().toLowerCase();
      if (t === 'vertical' || t === 'senkrecht') return 'vertical';
      if (t === 'horizontal' || t === 'waagrecht') return 'horizontal';
      return null;
    };
    const auto = () => (o === 'v' ? 'vertical' : 'horizontal');
    const l = c.layout;
    if (l && typeof l === 'object') {
      const side = o === 'v' ? [l.v, l.portrait, l.hochkant] : [l.h, l.landscape, l.quer];
      for (let i = 0; i < side.length; i++) {
        const n = norm(side[i]);
        if (n) return n;
      }
      return auto();
    }
    const t = String(l === undefined || l === null ? '' : l).trim().toLowerCase();
    if (t === 'orientation' || t === 'auto') return auto();
    return norm(l) || 'horizontal';
  }

  _posKeyBase() {
    const c0 = this._cfg0 || {};
    const v = this._viewList()[this._vi || 0];
    return String(c0.layout_id || c0.title || 'karte') + '|' + (v && v.name ? v.name : '');
  }

  _posKey(orient) {
    return this._posKeyBase() + '|' + (orient || this._orient());
  }

  _posStore() {
    if (!this._posObj) {
      try {
        this._posObj = JSON.parse(localStorage.getItem('flow-card-vaw-pos') || '{}') || {};
      } catch (e) {
        this._posObj = {};
      }
    }
    return this._posObj;
  }

  _posSave(clear) {
    const P = this._pos || {};
    const ks = Object.keys(P).filter((k) => P[k] && (P[k].x || P[k].y));
    const o = {};
    ks.forEach((k) => { o[k] = { x: P[k].x || 0, y: P[k].y || 0 }; });
    this._posWrite(this._posKey(), clear || !ks.length ? null : o);
  }

  // Anordnung der aktuellen Ausrichtung in die andere uebernehmen (hochkant <-> quer)
  _posCopyOther() {
    const P = this._pos || {};
    const ks = Object.keys(P).filter((k) => P[k] && (P[k].x || P[k].y));
    const o = {};
    ks.forEach((k) => { o[k] = { x: P[k].x || 0, y: P[k].y || 0 }; });
    this._posWrite(this._posKey(this._orient() === 'v' ? 'h' : 'v'), ks.length ? o : null);
    this._laFlip = true;
    try {
      clearTimeout(this._laFlipT);
      this._laFlipT = setTimeout(() => { this._laFlip = false; if (this._la && this.shadowRoot) this._render(); }, 1600);
    } catch (e) { /* ignorieren */ }
  }

  // Einen Eintrag sichern: null bleibt als Loeschvermerk stehen, damit auch das Zuruecksetzen
  // auf den anderen Geraeten ankommt
  _posWrite(key, val) {
    const st = this._posStore();
    st[key] = val || null;
    try { localStorage.setItem('flow-card-vaw-pos', JSON.stringify(st)); } catch (e) { /* ignorieren */ }
    this._posPend = this._posPend || {};
    this._posPend[key] = val ? JSON.parse(JSON.stringify(val)) : null;
    this._posPush();
  }

  // Vor dem Schreiben den Stand aus Home Assistant holen und nur die eigenen Eintraege
  // darueberlegen. Frueher schob jedes Geraet seinen ganzen lokalen Speicher hoch und
  // loeschte damit die Positionen der anderen Geraete.
  _posPush() {
    const h = this._realHass;
    if (!h || typeof h.callWS !== 'function' || this._posBusy) {
      if (this._posBusy) this._posAgain = true;
      return;
    }
    const pend = Object.assign({}, this._posPend || {});
    if (!Object.keys(pend).length) return;
    this._posBusy = true;
    Promise.resolve(h.callWS({ type: 'frontend/get_user_data', key: 'flow_card_vaw_positions' }))
      .catch(() => null)
      .then((r) => {
        const srv = r && r.value && typeof r.value === 'object' ? r.value : {};
        const out = Object.assign({}, srv);
        Object.keys(pend).forEach((k) => { out[k] = pend[k] || null; });
        this._posObj = Object.assign({}, out);
        try { localStorage.setItem('flow-card-vaw-pos', JSON.stringify(out)); } catch (e) { /* ignorieren */ }
        return h.callWS({ type: 'frontend/set_user_data', key: 'flow_card_vaw_positions', value: out });
      })
      .then(() => {
        const cur = this._posPend || {};
        Object.keys(pend).forEach((k) => {
          if (Object.prototype.hasOwnProperty.call(cur, k) && JSON.stringify(cur[k]) === JSON.stringify(pend[k])) delete cur[k];
        });
      })
      .catch(() => {})
      .then(() => {
        this._posBusy = false;
        if (this._posAgain) {
          this._posAgain = false;
          this._posPush();
        }
      });
  }

  // Positionen aus Home Assistant nachladen, auch waehrend die Karte offen ist: sonst sieht
  // ein zweites Geraet die Aenderung erst nach einem Neuladen der Seite
  _posLoadWs(force) {
    const h = this._realHass;
    if (!h || typeof h.callWS !== 'function' || !this._c || this._c.layout_assistant !== true) return;
    if (this._posBusy || this._drag) return;
    const now = Date.now();
    if (!force) {
      if (this._posGot && now - this._posGot < 15000) return;
      try { if (typeof document !== 'undefined' && document.hidden) return; } catch (e) { /* ignorieren */ }
    }
    this._posGot = now;
    Promise.resolve(h.callWS({ type: 'frontend/get_user_data', key: 'flow_card_vaw_positions' }))
      .then((r) => {
        const v = r && r.value;
        if (!v || typeof v !== 'object' || this._drag) return;
        const key = this._posKey();
        const before = JSON.stringify(this._posStore()[key] || null);
        const merged = Object.assign({}, this._posStore(), v);
        const pend = this._posPend || {};
        Object.keys(pend).forEach((k) => { merged[k] = pend[k] || null; });
        this._posObj = merged;
        try { localStorage.setItem('flow-card-vaw-pos', JSON.stringify(merged)); } catch (e) { /* ignorieren */ }
        if (JSON.stringify(merged[key] || null) !== before) this._applyCfg();
      })
      .catch(() => {});
  }

  _viewList() {
    const v = this._cfg0 && this._cfg0.views;
    return Array.isArray(v) ? v.filter((x) => x && typeof x === 'object').slice(0, 8) : [];
  }

  // Grundkonfiguration + Einstellungen der gew\u00e4hlten Ansicht (null entfernt einen Eintrag), dann Design-Vorlage
  _applyCfg() {
    // leere Werte (z. B. "icon: null" aus dem Editor) wie nicht vorhanden behandeln, damit die Standardwerte gelten
    const strip = (o) => {
      if (Array.isArray(o)) return o.map(strip);
      if (o && typeof o === 'object') {
        const r = {};
        Object.keys(o).forEach((k) => {
          if (o[k] !== null && o[k] !== '') r[k] = strip(o[k]);
        });
        return r;
      }
      return o;
    };
    const vs = this._viewList();
    this._views = vs;
    const base = Object.assign({}, this._cfg0);
    delete base.views;
    delete base.default_view;
    const v = vs[this._vi] || null;
    if (vs.length && v) {
      Object.keys(v).forEach((k) => {
        if (k === 'name' || k === 'icon' || k === 'show' || k === 'hide') return;
        if (v[k] === null) delete base[k];
        else base[k] = v[k];
      });
      // show: nur diese Teile zeigen (grid, solar, battery, devices, rest, status, status_circles, status_chips, zones oder Zonen-Namen); hide: diese ausblenden. Das Haus bleibt als Mitte immer sichtbar.
      const lst = (x) => (Array.isArray(x) ? x : typeof x === 'string' && x ? [x] : []).map((t) => String(t).trim().toLowerCase());
      const sh = lst(v.show);
      const hi = lst(v.hide);
      if (sh.length || hi.length) {
        const vis = (key, nm) => {
          const n = nm ? String(nm).trim().toLowerCase() : null;
          if (hi.includes(key) || (n && hi.includes(n))) return false;
          if (!sh.length) return true;
          return sh.includes(key) || !!(n && sh.includes(n));
        };
        ['grid', 'solar', 'battery', 'devices'].forEach((k) => { if (!vis(k)) delete base[k]; });
        // Sammelkreis "Rest" gehört zu den Geräten: ohne sie fällt er weg, außer er steht selbst in show
        if (base.rest !== undefined && !(sh.length && sh.includes('rest')) && (hi.includes('rest') || !vis('devices'))) delete base.rest;
        // Status: ganz (status) oder getrennt - nur die Kreise unten (status_circles), nur die Chips in Kopf- und Infozeile (status_chips)
        if (base.status !== undefined) {
          const named = (k) => sh.includes(k) || hi.includes(k);
          const stAll = vis('status');
          const stCirc = named('status_circles') ? vis('status_circles') : stAll;
          const stChip = named('status_chips') ? vis('status_chips') : stAll;
          if (!stCirc && !stChip) delete base.status;
          else if (!stCirc || !stChip) {
            const keep = (Array.isArray(base.status) ? base.status : [])
              .map((e) => {
                const o = typeof e === 'string' ? { entity: e } : { ...e };
                const pl = Array.isArray(o.show) ? o.show : o.show ? [o.show] : ['header'];
                o.show = pl.filter((x) => (String(x).trim().toLowerCase() === 'circles' ? stCirc : stChip));
                return o;
              })
              .filter((o) => o.show.length);
            if (keep.length) base.status = keep;
            else delete base.status;
          }
        }
        if (Array.isArray(base.zones)) {
          const zs = base.zones.filter((z) => z && vis('zones', z.name));
          if (zs.length) base.zones = zs;
          else delete base.zones;
        }
      }
    }
    const c0 = vawClean(strip(base));
    const T = VAW_THEMES[c0.theme];
    this._c = T ? Object.assign({}, T, c0) : c0;
    const p = this._c.positions;
    this._pos = {};
    if (p && typeof p === 'object') Object.keys(p).forEach((k) => { if (p[k] && typeof p[k] === 'object') this._pos[k] = { x: Number(p[k].x) || 0, y: Number(p[k].y) || 0 }; });
    // im Layout-Assistenten verschobene Positionen (pro Benutzer in Home Assistant und im Browser gespeichert) haben Vorrang
    if (this._c.layout_assistant === true) {
      const ps = this._posStore();
      // eigene Positionen der aktuellen Ausrichtung, sonst die alten gemeinsamen.
      // null ist ein Loeschvermerk (zurueckgesetzt) und faellt nicht auf die alten zurueck.
      const k0 = this._posKey();
      const sv = Object.prototype.hasOwnProperty.call(ps, k0) ? ps[k0] : ps[this._posKeyBase()];
      if (sv && typeof sv === 'object') Object.keys(sv).forEach((k) => { if (sv[k] && typeof sv[k] === 'object') this._pos[k] = { x: Number(sv[k].x) || 0, y: Number(sv[k].y) || 0 }; });
    }
    this._render();
  }

  // Visueller Editor in Home Assistant
  static getConfigElement() {
    return document.createElement('flow-card-vaw-dev-editor');
  }

  static getStubConfig() {
    return { grid: {}, solar: {}, battery: {}, home: {} };
  }

  getCardSize() {
    return 6;
  }

  // Sections-Ansicht: standardm\u00e4\u00dfig volle Breite (per grid_options in der YAML \u00e4nderbar)
  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: 'auto' };
  }

  connectedCallback() {
    this._onFsChange = () => {
      // Vollbild per Esc / Browser verlassen
      if (this._fs === 'native' && !(document.fullscreenElement || document.webkitFullscreenElement)) {
        this._fs = null;
        this._applyFs();
      }
    };
    this._onKey = (e) => {
      if (e.key === 'Escape' && this._fs === 'overlay') this._setFs(false);
    };
    document.addEventListener('fullscreenchange', this._onFsChange);
    document.addEventListener('webkitfullscreenchange', this._onFsChange);
    window.addEventListener('keydown', this._onKey);
    // beim Drehen die Positionen der anderen Ausrichtung laden
    this._orientNow = this._orient();
    this._onOrient = () => {
      const o = this._orient();
      if (o === this._orientNow) return;
      this._orientNow = o;
      if (this._c && !this._drag) this._applyCfg();
    };
    window.addEventListener('resize', this._onOrient);
    window.addEventListener('orientationchange', this._onOrient);
    // zurueck im Fenster: Positionen sofort nachsehen, falls ein anderes Geraet sie geaendert hat
    this._onVis = () => { try { this._posLoadWs(true); } catch (e) { /* ignorieren */ } };
    document.addEventListener('visibilitychange', this._onVis);
    window.addEventListener('focus', this._onVis);
    if (this.shadowRoot && this.shadowRoot.querySelector('ha-card')) this._applyLook();
    // Ruhemodus mit Zeitfenster: einmal pro Minute pr\u00fcfen
    this._tickN = 0;
    this._tick = setInterval(() => {
      this._tickN++;
      if (this._stLive) this._update(); // Status z\u00e4hlt Sekunden bzw. wartet auf warn_after
      else if (this._tickN % 60 === 0 && this._c && this._c.calm && (this._c.calm.from || this._c.calm.to)) this._update();
    }, 1000);
  }

  disconnectedCallback() {
    clearInterval(this._tick);
    if (this._ro) {
      this._ro.disconnect();
      this._ro = null;
    }
    document.removeEventListener('fullscreenchange', this._onFsChange);
    document.removeEventListener('webkitfullscreenchange', this._onFsChange);
    window.removeEventListener('keydown', this._onKey);
    window.removeEventListener('resize', this._onOrient);
    window.removeEventListener('orientationchange', this._onOrient);
    document.removeEventListener('visibilitychange', this._onVis);
    window.removeEventListener('focus', this._onVis);
    try { clearTimeout(this._laFlipT); } catch (e) { /* ignorieren */ }
    if (this._fs === 'native') {
      try {
        (document.exitFullscreen || document.webkitExitFullscreen || (() => {})).call(document);
      } catch (e) { /* ignorieren */ }
    }
    this._fs = null;
  }

  _toggleFs() {
    this._setFs(!this._fs);
  }

  // Vollbild: zuerst echtes Browser-Vollbild; wo das nicht geht (z. B. manche Apps/iPhone), Vollbild-Overlay in der Seite
  _setFs(on) {
    const card = this.shadowRoot.querySelector('ha-card');
    if (!card) return;
    if (!on) {
      const wasNative = this._fs === 'native';
      this._fs = null;
      if (wasNative && (document.fullscreenElement || document.webkitFullscreenElement)) {
        try {
          const r = (document.exitFullscreen || document.webkitExitFullscreen).call(document);
          if (r && r.catch) r.catch(() => {});
        } catch (e) { /* ignorieren */ }
      }
      this._applyFs();
      return;
    }
    const req = card.requestFullscreen || card.webkitRequestFullscreen;
    this._fs = 'overlay';
    this._applyFs();
    if (req) {
      try {
        const r = req.call(card);
        if (r && r.then) {
          r.then(() => {
            this._fs = 'native';
          }).catch(() => {
            this._fs = 'overlay';
          });
        } else {
          this._fs = 'native';
        }
      } catch (e) {
        this._fs = 'overlay';
      }
    }
  }

  _applyFs() {
    const card = this.shadowRoot && this.shadowRoot.querySelector('ha-card');
    if (!card) return;
    card.classList.toggle('fs', !!this._fs);
    const ic = this.shadowRoot.querySelector('.fsbtn ha-icon');
    if (ic) ic.setAttribute('icon', this._fs ? 'mdi:fullscreen-exit' : 'mdi:fullscreen');
  }

  set hass(hass) {
    this._realHass = hass;
    this._hass = this._ttOn && this._ttOver ? this._ttMake(hass) : hass;
    this._update();
    // noch nicht geschriebene Positionen nachholen (z. B. Verbindung war beim Ziehen kurz weg)
    try { if (this._posPend && Object.keys(this._posPend).length) this._posPush(); } catch (e) { /* ignorieren */ }
    try { this._posLoadWs(); } catch (e) { /* ignorieren */ }
  }

  // ---- Zeitreise: Zust\u00e4nde aller verwendeten Entit\u00e4ten zu einem fr\u00fcheren Zeitpunkt aus dem Verlauf holen ----
  _ttHours() {
    const h = Number(this._c && this._c.time_travel_hours);
    return h > 0 ? Math.min(168, Math.max(1, h)) : 24;
  }

  _ttEnts() {
    const h = this._realHass;
    const set = {};
    const walk = (o) => {
      if (typeof o === 'string') {
        if (/^[a-z0-9_]+\.[a-z0-9_]+$/.test(o) && !/^(sun|weather)\./.test(o) && h && h.states[o]) set[o] = 1;
      } else if (Array.isArray(o)) o.forEach(walk);
      else if (o && typeof o === 'object') Object.keys(o).forEach((k) => walk(o[k]));
    };
    walk(this._c);
    return Object.keys(set);
  }

  _ttMake(h) {
    const st = Object.assign({}, h.states);
    Object.keys(this._ttOver).forEach((id) => {
      const o = h.states[id];
      if (o) st[id] = Object.assign({}, o, { state: this._ttOver[id] });
    });
    return Object.assign({}, h, { states: st });
  }

  _ttApply() {
    const h = this._realHass;
    if (!h) return;
    this._hass = this._ttOver ? this._ttMake(h) : h;
    this._update();
  }

  _ttLabel(back) {
    if (back <= 0) return 'Jetzt';
    const lang = (this._realHass && this._realHass.locale && this._realHass.locale.language) || undefined;
    const d = new Date(Date.now() - back * 60000);
    return d.toLocaleString(lang, { weekday: 'short', hour: '2-digit', minute: '2-digit' }) + ' \u00b7 vor ' + this._fmtDur(back / 60);
  }

  _ttGo(back) {
    this._ttMin = back;
    clearTimeout(this._ttTm);
    const h = this._realHass;
    if (!h) return;
    if (back <= 0) {
      this._ttSeq = (this._ttSeq || 0) + 1;
      this._ttOver = null;
      this._ttApply();
      return;
    }
    this._ttTm = setTimeout(() => {
      const t = Date.now() - back * 60000;
      const ids = this._ttEnts();
      const seq = (this._ttSeq = (this._ttSeq || 0) + 1);
      if (!ids.length || typeof h.callWS !== 'function') return;
      h.callWS({ type: 'history/history_during_period', start_time: new Date(t).toISOString(), end_time: new Date(t + 60000).toISOString(), entity_ids: ids, include_start_time_state: true, significant_changes_only: false, minimal_response: true, no_attributes: true })
        .then((res) => {
          if (seq !== this._ttSeq || !this._ttOn) return;
          const over = {};
          ids.forEach((id) => {
            const it = res && res[id] && res[id][0];
            const v = it ? (it.s !== undefined ? it.s : it.state) : undefined;
            over[id] = v === undefined || v === null ? 'unavailable' : v;
          });
          this._ttOver = over;
          this._ttApply();
        })
        .catch(() => {});
    }, 300);
  }

  // eigene Icons und Bilder: "my:name" (aus custom_icons), Bild-URL oder "img:URL" statt mdi-Icon (URL mit #tint am Ende = mit Icon-Farbe einf\u00e4rben)
  _iconFix(root) {
    const m = this._c && this._c.custom_icons && typeof this._c.custom_icons === 'object' ? this._c.custom_icons : {};
    root.querySelectorAll('ha-icon[icon]').forEach((el) => {
      const ic = el.getAttribute('icon') || '';
      let url = null;
      let tint = false;
      if (ic.indexOf('my:') === 0) {
        const v = m[ic.slice(3)];
        if (v) {
          if (typeof v === 'string') url = v;
          else {
            url = v.url;
            tint = !!v.tint;
          }
        }
      } else if (/^(https?:\/\/|\/|data:image|img:)/i.test(ic) || /\.(png|jpe?g|svg|webp|gif)([?#].*)?$/i.test(ic)) url = ic.replace(/^img:/, '');
      if (!url) return;
      url = String(url);
      if (/#tint$/.test(url)) {
        tint = true;
        url = url.replace(/#tint$/, '');
      }
      const n = document.createElement(tint ? 'span' : 'img');
      n.className = 'ci' + (tint ? ' tint' : '') + (el.parentElement && el.parentElement.classList.contains('zi') ? '' : ' inl');
      if (el.id) n.id = el.id;
      n.setAttribute('icon', ic);
      n.style.cssText = el.style.cssText;
      if (tint) n.style.webkitMaskImage = n.style.maskImage = 'url("' + url.replace(/"/g, '%22') + '")';
      else {
        n.src = url;
        n.alt = '';
      }
      el.replaceWith(n);
    });
  }

  // Tag/Nacht: Nacht, wenn sun.sun unter dem Horizont steht (oder die gew\u00e4hlte Entit\u00e4t "on" ist)
  _isNight() {
    const c = this._c || {};
    if (!c.background_night || c.background_night === 'none') return false;
    const e = String(c.background_night_entity || 'sun.sun');
    const st = this._hass && this._hass.states[e];
    if (!st) return false;
    return e.indexOf('sun.') === 0 ? st.state === 'below_horizon' : st.state === 'on';
  }

  // Wetter-Zustand der gew\u00e4hlten weather-Entit\u00e4t (leer = kein Wetter-Hintergrund)
  _wxKey() {
    const e = this._c && this._c.background_weather;
    if (!e) return '';
    const st = this._hass && this._hass.states[String(e)];
    return st ? String(st.state) : '';
  }

  // Hintergrund: Vorlage (background, nachts background_night) oder eigene Farbe / Verlauf / Bild, dazu Animation
  _applyBg() {
    const card = this.shadowRoot && this.shadowRoot.querySelector('ha-card');
    const c = this._c || {};
    if (!card) return;
    card.querySelectorAll(':scope > .bgl, :scope > .bga, :scope > .bgw').forEach((n) => n.remove());
    ['background', 'box-shadow', 'border', '--card-background-color', '--primary-text-color', '--secondary-text-color'].forEach((p) => card.style.removeProperty(p));
    card.classList.remove('bgd');
    const night = this._isNight();
    this._bgNight = night;
    const kind = night ? String(c.background_night) : String(c.background || 'default');
    const num = (v, d, lo, hi) => (v !== undefined && v !== null && v !== '' && !isNaN(Number(v)) ? Math.max(lo, Math.min(hi, Number(v))) : d);
    let bg = null;
    let fill = null;
    let text = null;
    let plain = false;
    const P = VAW_BG[kind];
    if (P) {
      bg = P.bg;
      fill = P.fill;
      text = P.text || null;
      plain = !!P.plain;
    } else if (kind === 'color' && c.background_color) {
      bg = String(c.background_color);
      const rgb = vawParseColor(bg);
      if (rgb) {
        text = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255 > 0.55 ? 'dark' : 'light';
        fill = bg;
      }
    } else if (kind === 'gradient' && c.background_gradient) {
      bg = String(c.background_gradient);
      text = 'light';
      fill = '#111827';
    } else if (kind === 'image' && c.background_image) {
      bg = '#111827';
      text = 'light';
      fill = '#111827';
    }
    if (bg && (c.background_text === 'light' || c.background_text === 'dark') && !night) {
      text = c.background_text;
      if (kind === 'gradient' || kind === 'image') fill = text === 'dark' ? '#f3f4f6' : '#111827';
    }
    let lastLayer = null;
    if (bg) {
      card.classList.add('bgd');
      card.style.setProperty('background', bg);
      if (plain) {
        card.style.setProperty('box-shadow', 'none');
        card.style.setProperty('border', 'none');
      }
      if (fill) card.style.setProperty('--card-background-color', fill);
      if (text && VAW_TEXT[text]) {
        card.style.setProperty('--primary-text-color', VAW_TEXT[text][0]);
        card.style.setProperty('--secondary-text-color', VAW_TEXT[text][1]);
      }
      if (kind === 'image' && c.background_image) {
        const blur = num(c.background_blur, 0, 0, 30);
        const dim = num(c.background_dim, 0.35, 0, 0.9);
        const lay = document.createElement('div');
        lay.className = 'bgl' + (blur ? ' blur' : '');
        const img = document.createElement('i');
        img.style.backgroundImage = 'url("' + String(c.background_image).replace(/["\\\r\n]/g, '') + '")';
        if (blur) img.style.filter = 'blur(' + blur + 'px)';
        const shade = document.createElement('b');
        shade.style.background = 'rgba(0, 0, 0, ' + dim + ')';
        lay.appendChild(img);
        lay.appendChild(shade);
        card.insertBefore(lay, card.firstChild);
        lastLayer = lay;
      }
    }
    // Animation: wandernde Farbfl\u00e4chen oder funkelnde Sterne (im Ruhemodus angehalten)
    const wk = this._wxKey();
    this._wxShown = wk;
    let an = String(c.background_animation || 'none');
    if (wk === 'clear-night' && an === 'none') an = 'stars';
    if (an === 'drift' || an === 'stars') {
      card.classList.add('bgd');
      const L = document.createElement('div');
      L.className = 'bga ' + an + (text === 'dark' ? ' dk' : '');
      if (an === 'stars') {
        let seed = 7;
        const rnd = () => {
          seed = (seed * 16807) % 2147483647;
          return seed / 2147483647;
        };
        for (let k = 0; k < 48; k++) {
          const d = document.createElement('i');
          const z = (1 + rnd() * 1.8).toFixed(1);
          d.style.cssText = 'left:' + (rnd() * 100).toFixed(1) + '%;top:' + (rnd() * 100).toFixed(1) + '%;width:' + z + 'px;height:' + z + 'px;animation-delay:' + (rnd() * 6).toFixed(1) + 's;animation-duration:' + (2.5 + rnd() * 4).toFixed(1) + 's';
          L.appendChild(d);
        }
      }
      card.insertBefore(L, lastLayer ? lastLayer.nextSibling : card.firstChild);
    }
    // Wetter-Effekt: Regen, Schnee, Wolken, Nebel, Blitz, Sonne
    const KINDS = { rainy: ['rain'], pouring: ['rain', 'heavy'], hail: ['rain', 'hail'], lightning: ['cloud', 'flash', 'bolt'], 'lightning-rainy': ['rain', 'heavy', 'flash', 'bolt'], snowy: ['snow'], 'snowy-rainy': ['rain', 'snow'], fog: ['fog'], cloudy: ['cloud', 'cloud2'], partlycloudy: ['cloud', 'sun'], windy: ['cloud', 'fast', 'wind'], 'windy-variant': ['cloud', 'fast', 'wind'], sunny: ['sun', 'rays'], exceptional: ['fog'] };
    const kd0 = KINDS[wk];
    const prevWx = this._wxPrevState;
    if (wk !== prevWx) {
      if (/rainy|pouring/.test(prevWx || '') && /^(sunny|partlycloudy|cloudy)$/.test(wk)) this._rbUntil = Date.now() + 20 * 60000;
      this._wxPrevState = wk;
    }
    const rbOn = !!(this._rbUntil && Date.now() < this._rbUntil && (wk === 'sunny' || wk === 'partlycloudy'));
    this._rbOn = rbOn;
    const kd = kd0 ? (rbOn ? kd0.concat(['rainbow']) : kd0) : kd0;
    if (kd) {
      card.classList.add('bgd');
      const W = document.createElement('div');
      W.className = 'bgw ' + kd.join(' ') + (text === 'dark' ? ' dk' : '');
      const rnd = vawRnd(11);
      const add = (tag, cls, css) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        e.style.cssText = css;
        W.appendChild(e);
      };
      const has = (k) => kd.indexOf(k) >= 0;
      if (has('rain')) {
        const cnt = has('heavy') ? 90 : 55;
        for (let k = 0; k < cnt; k++) add('i', 'r', 'left:' + (rnd() * 100).toFixed(1) + '%;height:' + (10 + rnd() * 14).toFixed(0) + 'px;opacity:' + (0.35 + rnd() * 0.45).toFixed(2) + ';animation-duration:' + ((has('heavy') ? 0.45 : 0.75) + rnd() * 0.4).toFixed(2) + 's;animation-delay:-' + (rnd() * 2).toFixed(2) + 's');
      }
      if (has('snow')) {
        for (let k = 0; k < 45; k++) {
          const z = (2 + rnd() * 2.6).toFixed(1);
          add('i', 's', 'left:' + (rnd() * 100).toFixed(1) + '%;width:' + z + 'px;height:' + z + 'px;--dx:' + ((rnd() - 0.5) * 50).toFixed(0) + 'px;animation-duration:' + (7 + rnd() * 7).toFixed(1) + 's;animation-delay:-' + (rnd() * 12).toFixed(1) + 's');
        }
      }
      if (has('cloud')) {
        const cnt = has('cloud2') ? 6 : 3;
        for (let k = 0; k < cnt; k++) {
          const d = has('fast') ? 22 + rnd() * 14 : 70 + rnd() * 50;
          add('i', 'c', '--t:' + (rnd() * 50 - 10).toFixed(0) + '%;--w:' + (45 + rnd() * 35).toFixed(0) + '%;animation-duration:' + d.toFixed(0) + 's;animation-delay:-' + (rnd() * d).toFixed(0) + 's');
        }
      }
      if (has('fog')) {
        add('i', 'f', 'top:8%');
        add('i', 'f', 'top:48%;animation-delay:-14s');
      }
      if (has('sun')) add('i', 'sn', '');
      if (has('rays')) add('i', 'sr', '');
      if (has('rainbow')) add('i', 'rb', '');
      if (has('wind')) {
        for (let k = 0; k < 16; k++) add('i', 'wd', '--t:' + (rnd() * 96).toFixed(0) + '%;--w:' + (40 + rnd() * 90).toFixed(0) + 'px;--d:' + (1.1 + rnd() * 1.6).toFixed(2) + 's;animation-delay:-' + (rnd() * 3).toFixed(2) + 's;opacity:' + (0.5 + rnd() * 0.5).toFixed(2));
      }
      if (has('bolt')) add('b', 'bolt', '--l:' + (12 + rnd() * 70).toFixed(0) + '%');
      if (has('flash')) add('b', 'fl', '');
      card.insertBefore(W, lastLayer ? lastLayer.nextSibling : card.firstChild);
    }
  }

  // Kreisstil (flach, Glas, Neon) und kompakter Modus (aus / automatisch bei schmaler Karte / immer)
  _applyLook() {
    const card = this.shadowRoot && this.shadowRoot.querySelector('ha-card');
    const c = this._c || {};
    if (!card) return;
    const cs = String(c.circle_style || 'default');
    ['flat', 'glass', 'neon'].forEach((k) => card.classList.toggle('cs-' + k, cs === k));
    card.classList.toggle('lc-square', c.line_corners === 'square');
    const ls = String(c.line_style || 'solid');
    ['dashed', 'dotted', 'flow', 'neon'].forEach((k) => card.classList.toggle('ls-' + k, ls === k));
    if (this._ro) {
      this._ro.disconnect();
      this._ro = null;
    }
    const mode = c.compact === true ? 'on' : c.compact === undefined || c.compact === false ? 'off' : String(c.compact);
    if (mode === 'on' || mode === 'auto') {
      const apply = () => {
        const w = card.getBoundingClientRect().width;
        card.classList.toggle('compact', !card.classList.contains('fs') && (mode === 'on' || (w > 0 && w < 440)));
      };
      apply();
      if (typeof ResizeObserver !== 'undefined') {
        this._ro = new ResizeObserver(apply);
        this._ro.observe(card);
      }
    }
  }

  _render() {
    this._hsHtml = null;
    this._infoHtml = null;
    const c = this._c;
    // Optik-Optionen (alle einzeln abschaltbar)
    const optOn = (k) => c[k] !== false;
    const SH = ['square', 'hexagon'].includes(c.node_shape) ? c.node_shape : 'circle';
    const SZ = c.node_size !== undefined && c.node_size !== '' && !isNaN(Number(c.node_size)) ? Math.max(0.6, Math.min(1.4, Number(c.node_size))) : 1;
    const SPARK = c.sparkline === true;
    const OPT = {
      lineW: optOn('line_width'),
      numAnim: c.number_animation === true,
      ndot: c.flow_dots === 'auto' ? 3 : Math.max(1, Math.min(3, Number(c.flow_dots) || 1)),
      dotsAuto: c.flow_dots === 'auto',
      lgrad: c.line_gradient === true,
      fill: c.fill_level === true,
      mk: ['arrow', 'diamond', 'spark', 'drop', 'particles'].includes(c.flow_marker) ? c.flow_marker : 'dot',
      lineMax: Math.max(3, Number(c.line_width_max) || 6),
      glow: optOn('glow'),
      pulse: optOn('pulse'),
      pulseW: c.pulse_above_w !== undefined ? Number(c.pulse_above_w) : 1000,
      grad: optOn('gradient'),
      tap: optOn('tap_action'),
      lim: optOn('limit_colors'),
      zoom: optOn('zoom'),
      zmax: Math.max(1.5, Math.min(10, Number(c.zoom_max) || 4)),
      ns: c.number_scale !== undefined ? Math.max(0.5, Math.min(1.6, Number(c.number_scale) || 1)) : 1,
    };
    this._o = OPT;
    // Schriftgr\u00f6\u00dfe pro Kreis: font_size (Faktor) oder mit der Kreisgr\u00f6\u00dfe (font_follow_size)
    const FOL = c.font_follow_size === true;
    const fmOf = (cfg, sf) => {
      const m = cfg ? Number(cfg.font_size) : NaN;
      if (!isNaN(m) && m > 0) return Math.max(0.5, Math.min(2.5, m));
      return FOL ? Math.max(0.6, Math.min(1.8, sf || 1)) : 1;
    };
    const L0 = c.limits && typeof c.limits === 'object' ? c.limits : {};
    const numOr = (v, d) => (v !== undefined && v !== null && v !== '' && !isNaN(Number(v)) ? Number(v) : d);
    this._lim = {
      vmin: numOr(L0.voltage_min, 207),
      vmax: numOr(L0.voltage_max, 253),
      imax: numOr(L0.current_max, null),
      fmin: numOr(L0.frequency_min, 49.8),
      fmax: numOr(L0.frequency_max, 50.2),
      color: L0.color || '#e53935',
    };
    // Schalter am Kreis (switch: switch.xyz): kleiner Ein/Aus-Knopf oben rechts am Kreis
    this._sw = [];
    let swSvg = '';
    const swBtn = (key, o, x, y, r, col) => {
      const rr = r >= 40 ? 12.5 : r >= 30 ? 11 : 9;
      this._sw.push({ key, entity: o.switch, confirm: o.switch_confirm === true, name: o.name });
      const k = (rr / 11).toFixed(2);
      swSvg += `<g class="sw un" id="sw_${key}" data-sw="${key}" transform="translate(${(x + r * 0.74).toFixed(1)} ${(y - r * 0.68).toFixed(1)})" style="--sc:${vawEsc(col)}"><title>${vawEsc(o.name || 'Schalter')} schalten</title><circle r="${rr + 5}" fill="transparent"/><circle class="swb" r="${rr}"/><path class="swi" transform="scale(${k})" d="M-3.6,-3.8 A5.2,5.2 0 1 0 3.6,-3.8 M0,-6.2 V-0.8"/></g>`;
    };
    // Farbverl\u00e4ufe f\u00fcr die Kreise (eine Definition pro Farbe)
    const gradDefs = new Map();
    const gradId = (col) => {
      if (!gradDefs.has(col)) gradDefs.set(col, 'vg' + gradDefs.size);
      return gradDefs.get(col);
    };
    // Sammelkreis "Rest": Hausverbrauch minus alle Zonen und Ger\u00e4te (rest: true oder {name, icon, color, size, no_link})
    const restOn = c.rest === true || (c.rest && typeof c.rest === 'object');
    const restDev = restOn ? { name: 'Rest', icon: 'mdi:dots-horizontal-circle-outline', color: '#9e9e9e', ...(typeof c.rest === 'object' ? c.rest : {}), rest: true } : null;
    const devs = (c.devices || []).concat(restDev ? [restDev] : []);
    const kidsCfg = c.solar && Array.isArray(c.solar.children) ? c.solar.children.slice(0, 10) : [];
    // Z\u00e4hlerst\u00e4nde (kWh) unter dem Netz-Kreis: grid.meter {import, export}
    const gridMeter = c.grid && c.grid.meter && typeof c.grid.meter === 'object' ? c.grid.meter : null;
    this._gridMeter = gridMeter;
    // 15-Minuten-Spitze (Netzentgelte): grid.peak {max, live, last}
    const peakCfg = c.grid && c.grid.peak && typeof c.grid.peak === 'object' ? c.grid.peak : null;
    this._peakCfg = peakCfg;
    // Batterien als kleine Kreise: battery.soc (Gesamt) und/oder battery.children (einzelne Batterien)
    const bc = c.battery || {};
    const batKidsCfg = [];
    if (bc.soc && !bc.soc_in_circle) batKidsCfg.push({ soc: bc.soc });
    (Array.isArray(bc.children) ? bc.children : []).forEach((x) => batKidsCfg.push(typeof x === 'string' ? { soc: x } : { ...x }));
    batKidsCfg.splice(10);
    // Status (Tore, Fenster, Rauchmelder, Sensoren ...): status [{name, entity|entities, show, at, kind, warn_after, ...}]
    const stCfg = (Array.isArray(c.status) ? c.status : [])
      .slice(0, 12)
      .map((e) => {
        const o = typeof e === 'string' ? { entity: e } : { ...e };
        const ents = [];
        if (o.entity) ents.push({ entity: o.entity });
        (Array.isArray(o.entities) ? o.entities : []).forEach((x) => ents.push(typeof x === 'string' ? { entity: x } : { ...x }));
        o.ents = ents.filter((x) => x.entity).slice(0, 16);
        o.show = Array.isArray(o.show) ? o.show : o.show ? [o.show] : ['header'];
        return o;
      })
      .filter((o) => o.ents.length);
    this._st = stCfg;
    const batRingOn = !!c.battery && bc.soc_ring !== false && !!(bc.soc || batKidsCfg.length); // Ring mit dem Ladestand
    const solRingOn = !!(c.solar && c.solar.max_power); // Ring mit der Auslastung
    this._solMax = c.solar ? c.solar.max_power : null;
    // Netz: einzelne Phasen (L1/L2/L3) als kleine Kreise: grid.phases [{name, power, current, voltage}]
    const gridPhCfg = c.grid && Array.isArray(c.grid.phases)
      ? c.grid.phases.slice(0, 6).map((x, i) => {
        const o = typeof x === 'string' ? { power: x } : { ...x };
        if (o.name === undefined) o.name = 'L' + (i + 1);
        return o;
      })
      : [];
    // Zonen (z. B. Stockwerke) mit eigenen Ger\u00e4ten
    const groups = (Array.isArray(c.zones) ? c.zones.slice(0, 6) : []).map((z) => ({
      z,
      devs: (Array.isArray(z.devices) ? z.devices.slice(0, 8) : []).map((d) => (typeof d === 'string' ? { power: d } : d)),
    }));
    if (groups.length && devs.length) {
      groups.push({ z: { name: c.devices_name || 'Sonstige', icon: 'mdi:dots-horizontal-circle-outline' }, devs });
    }
    const vert = this._layout() === 'vertical';
    // Phasen (L1/L2/L3) als kleine Kreise \u00fcber einer Zone (im senkrechten Layout links daneben): zones[].phases (max. 6)
    const phasesOf = (z) => (Array.isArray(z.phases) ? z.phases.slice(0, 6) : []);
    const PH = 80; // Platz \u00fcber einer Zone mit Phasen (waagrechtes Layout)
    const anyPh = groups.some((g) => phasesOf(g.z).length);
    // senkrechtes Layout: Phasen-Kreise stehen als Spalte links neben der Zone
    const maxPh = Math.max(0, ...groups.map((g) => phasesOf(g.z).length));
    const phR = maxPh <= 3 ? 24 : 20;
    const phStep = 2 * phR + 6;
    const phTop = ((maxPh - 1) / 2) * phStep + phR; // so weit reicht die Spalte \u00fcber/unter die Zonenmitte
    const PHV = maxPh ? Math.max(0, Math.round(2 * phTop + 36 - 150)) : 0; // zus\u00e4tzlicher Abstand Haus -> Zonen
    const DYV = maxPh >= 4 ? 190 : 156; // senkrecht: Abstand Zone -> Ger\u00e4te (mehr bei vielen Phasen)
    const PHL = 70; // zus\u00e4tzliche Breite links einer Zone mit Phasen (senkrechtes Layout)
    const DS = 72; // Abstand der Ger\u00e4te untereinander
    // Unterger\u00e4te (devices[].children, max. 6) als kleine Kreise unter dem Ger\u00e4t
    const DKR = 22; // Radius
    const DKG = 2 * DKR + 6; // Abstand der Unterger\u00e4te in der Reihe
    const KDIST = 38; // Abstand Ger\u00e4tekante -> Mitte der Unterger\u00e4te
    const kidListOf = (d) => (Array.isArray(d.children) ? d.children.slice(0, 6).map((x) => (typeof x === 'string' ? { power: x } : { ...x })) : []);
    const devKidsN = (d) => kidListOf(d).length;
    const lblW = (d) => Math.ceil(7.6 * String(d.name || 'Ger\u00e4t').length);
    const anyDK = groups.some((g) => g.devs.some(devKidsN)) || devs.some(devKidsN);
    const b = c.battery;
    let yoff = 0;
    let VH = 410;
    let VW = 620;
    let bFour = !!(b && (b.charge_power || b.discharge_power));
    const batR = bFour ? 60 : 52; // gleich gro\u00df wie die anderen Kreise
    const nodes = [];
    let gridFan = 0.45; // Auff\u00e4cherung der Linien der Netz-Kreise (senkrecht)
    const add = (key, x, y, r, cfg, def) => {
      if (cfg) nodes.push({ key, x, y: y + yoff, r, cfg: { ...def, ...cfg } });
    };
    if (!vert) {
      // Phasen-Kreise stehen als Spalte links vom Netz-Kreis -> alles etwas nach rechts schieben
      const gx0 = peakCfg ? 80 : 70;
      const phNameW = Math.max(14, ...gridPhCfg.map((o) => Math.ceil(6.2 * String(o.name).length)));
      const ox = gridPhCfg.length ? Math.max(0, Math.ceil(155 + phNameW - gx0)) : 0;
      const blocks = [];
      // Ger\u00e4te mit Unterger\u00e4ten brauchen darunter mehr Platz
      const kExtraZ = (d) => (devKidsN(d) ? 78 : 0);
      const spanOf = (g) => g.devs.reduce((a, d, j) => (j < g.devs.length - 1 ? a + DS + kExtraZ(d) : a), 0); // Abstand erstes -> letztes Ger\u00e4t
      const tailOf = (g) => (g.devs.length && devKidsN(g.devs[g.devs.length - 1]) ? 74 : 0);
      const innerOf = (g) => Math.max(130, g.devs.length ? spanOf(g) + 72 + tailOf(g) : 0);
      const hOf = (g) => innerOf(g) + (phasesOf(g.z).length ? PH : 0);
      const total = groups.reduce((acc, g) => acc + hOf(g) + 10, -10);
      let cursor = 180 - total / 2;
      groups.forEach((g) => {
        const hgt = hOf(g);
        blocks.push({ top: cursor, hgt, ph: phasesOf(g.z).length ? PH : 0, inner: innerOf(g) });
        cursor += hgt + 10;
      });
      const yoffZ = groups.length ? Math.max(0, 20 - (180 - total / 2)) : 0;
      const bottomPre = groups.length ? 180 + total / 2 + 30 : 0;
      // Ger\u00e4te direkt am Haus (ohne Zonen): ab 4 Ger\u00e4ten kleiner und mit mehr Abstand, damit nichts \u00fcberlappt
      const dn = devs.length;
      const devR = dn <= 3 ? 42 : 34;
      const devSpan = Math.max(260, (dn - 1) * (2 * devR + 30)); // Platz f\u00fcr die Namen unter den Kreisen
      const dStep = dn > 1 ? devSpan / (dn - 1) : 0;
      const dExtra = (d) => (devKidsN(d) ? Math.max(0, 2 * devR + 112 - dStep) : 0); // mehr Abstand nach Ger\u00e4ten mit Unterger\u00e4ten
      const dSpanTot = dn > 1 ? devSpan + devs.slice(0, -1).reduce((a, d) => a + dExtra(d), 0) : 0;
      const dTail = dn && devKidsN(devs[dn - 1]) ? 76 : 0;
      const yoffD = !groups.length && dn > 1 ? Math.max(0, Math.ceil(dSpanTot / 2 + devR + 15 - 180)) : 0;
      const devBottom = !groups.length && dn >= 1 ? 180 + dSpanTot / 2 + devR + 30 + dTail : 0;
      const khD = Math.max(0, ...devs.map((d) => (devKidsN(d) * DKG) / 2));
      const devX = (khD ? Math.max(555, Math.round(2 * khD + 488 - devR)) : 555) + ox; // weiter rechts, wenn Unterger\u00e4te-Reihen breit sind
      yoff = Math.max(kidsCfg.length ? 88 : 0, yoffZ, yoffD) + (solRingOn ? 12 : 0); // Platz oben (Panels / Zonen / viele Ger\u00e4te / Auslastungs-Ring)
      VH = Math.max(410, bottomPre, devBottom) + yoff;
      // Zonen/Ger\u00e4te weiter nach rechts, wenn Phasen-Kreise \u00fcber den Zonen Platz brauchen (je mehr Phasen, desto mehr)
      const hsP = ((maxPh - 1) * phStep) / 2 + phR; // halbe Breite der Phasen-Reihe
      const ZX = (anyPh ? Math.max(525, Math.round(2 * hsP + 404)) : 525) + ox;
      const khZ = Math.max(0, ...groups.flatMap((g) => g.devs.map((d) => (devKidsN(d) * DKG) / 2)));
      const DX = Math.max(anyPh ? Math.max(650 + ox, Math.round(ZX + 2 * hsP + 36)) : 650 + ox, khZ ? Math.round(ZX + 2 * khZ + 64) : 0);
      // Breite: genug Platz rechts f\u00fcr den l\u00e4ngsten Ger\u00e4tenamen
      const maxDevLen = Math.max(0, ...groups.flatMap((g) => g.devs.map((d) => String(d.name || 'Ger\u00e4t').length)));
      const maxKidLbl = Math.max(0, ...devs.filter(devKidsN).map(lblW));
      VW = groups.length
        ? Math.max(anyPh ? DX + 135 : 780 + ox, Math.ceil(DX + 56 + 7.6 * maxDevLen), Math.ceil(DX + khZ + 10))
        : Math.max(620 + ox, khD ? Math.ceil(devX + devR + 12 + maxKidLbl + 10) : 0, Math.ceil(devX + khD + 10));
      add('grid', gx0 + ox, 180, 60, c.grid, { name: 'Netz', icon: 'mdi:transmission-tower', color: '#4c8dbe' });
      add('solar', 230 + ox, 85, 52, c.solar, { name: 'Solar', icon: 'mdi:solar-power', color: '#ff9800', label_pos: kidsCfg.length ? 'right' : 'top' });
      bFour = !!(b && (b.charge_power || b.discharge_power));
      add('battery', 230 + ox, 295, batR, b, { name: 'Batterie', icon: 'mdi:battery', color: '#e91e63', label_pos: batKidsCfg.length ? 'right' : 'bottom' });
      this._home = { key: 'home', x: 380 + ox, y: 180 + yoff, r: 56, cfg: { name: 'Haus', icon: 'mdi:home', color: '#1e88e5', ...(c.home || {}) } };
      nodes.push(this._home);
      if (!groups.length) {
        devs.forEach((d, i) => {
          const n = devs.length;
          const y = (n === 1 ? 180 : 180 - dSpanTot / 2 + i * dStep + devs.slice(0, i).reduce((a, dd) => a + dExtra(dd), 0)) + yoff;
          nodes.push({ key: 'd' + i, x: devX, y, r: devR, dev: true, devKids: kidListOf(d), cfg: { name: 'Ger\u00e4t', icon: 'mdi:flash', color: PALETTE[i % PALETTE.length], ...(devKidsN(d) ? { label_pos: 'right' } : {}), ...d } });
        });
      } else {
        groups.forEach((g, gi) => {
          const blk = blocks[gi];
          const kz = g.devs.length;
          const Sz = spanOf(g);
          const y0 = blk.top + blk.ph + (blk.inner - (kz ? Sz + 72 + tailOf(g) : 0)) / 2 + 36 + yoff; // Mitte des ersten Ger\u00e4ts
          const zy = kz ? y0 + Sz / 2 : blk.top + blk.ph + blk.inner / 2 + yoff;
          const zc = g.z.color || PALETTE[gi % PALETTE.length];
          const zcfg = { ...g.z };
          delete zcfg.devices;
          delete zcfg.phases;
          const zn = { key: 'z' + gi, x: ZX, y: zy, r: 44, dev: true, devNodes: [], phases: phasesOf(g.z), cfg: { name: 'Zone', icon: 'mdi:floor-plan', ...zcfg, color: zc } };
          nodes.push(zn);
          let dy = y0;
          g.devs.forEach((d, j) => {
            const dn = { key: 'z' + gi + 'd' + j, x: DX, y: dy, r: 32, dev: true, parent: zn, devKids: kidListOf(d), cfg: { name: 'Ger\u00e4t', icon: 'mdi:flash', label_pos: 'right', ...d, color: d.color || zc } };
            nodes.push(dn);
            zn.devNodes.push(dn);
            dy += DS + kExtraZ(d);
          });
        });
      }
    } else {
      // ---- Senkrechtes Layout: oben Solar | Netz | Batterie, darunter Haus, darunter Zonen/Ger\u00e4te ----
      // Breite eines Ger\u00e4ts samt Unterger\u00e4ten (Name rechts neben dem Kreis, Unterger\u00e4te darunter) und Lage des Kreises darin
      const slotOf = (d, base, r) => {
        const kn = devKidsN(d);
        if (!kn) return { w: base, off: base / 2 };
        const kw = kn * DKG;
        const a = Math.max(r + 4, kw / 2);
        return { w: Math.max(kw, a + r + 10 + lblW(d) + 6) + 4, off: a + 2 };
      };
      const sumSlots = (g) => g.devs.reduce((a, d) => a + slotOf(d, 92, 32).w, 0);
      const GWi = (g) => Math.max(150, sumSlots(g) + 10, Math.ceil(15 * String(g.z.name || 'Zone').length - 8)); // Breite der Zone mit ihren Ger\u00e4ten (und ihrem Namen)
      const GW = (g) => GWi(g) + (phasesOf(g.z).length ? PHL : 0); // Breite einer Zone mit ihren Ger\u00e4ten
      let contentW = 620;
      if (groups.length) contentW = Math.max(620, groups.reduce((acc, g) => acc + GW(g), 0) + 40);
      else if (devs.length) contentW = Math.max(620, devs.reduce((a, d) => a + slotOf(d, 100, 42).w, 0) + 40);
      VW = Math.max(contentW, kidsCfg.length || batKidsCfg.length ? 700 : 0); // Platz f\u00fcr die Namen links/rechts neben Solar und Batterie
      // Reihe \u00fcber dem Netz (Phasen + Spitze) ist breit: Solar und Batterie r\u00fccken nach au\u00dfen, damit ihre kleinen Kreise nicht ansto\u00dfen
      const nGP = gridPhCfg.length;
      const gridHalf = (nGP ? ((nGP - 1) * 50 + 44 + (peakCfg ? 14 + 66 : 0)) : peakCfg ? 66 : 0) / 2;
      const kHalfOf = (n) => { const r0 = n <= 6 ? 26 : 20; return ((n - 1) * (2 * r0 + 6)) / 2 + r0; };
      const sideSD = (n) => Math.max(190, n && gridHalf ? Math.ceil(gridHalf + kHalfOf(n) + 22) : 0);
      gridFan = Math.min(0.45, 46 / Math.max(1, gridHalf - 22));
      const SDs = sideSD(kidsCfg.length);
      const SDb = sideSD(batKidsCfg.length);
      if (kidsCfg.length || batKidsCfg.length) VW = Math.max(VW, 2 * (Math.max(SDs, SDb) + 160));
      const cx = VW / 2;
      yoff = Math.max(kidsCfg.length || batKidsCfg.length ? 88 : 0, peakCfg || gridPhCfg.length ? 100 : 0) + (solRingOn || batRingOn ? 12 : 0); // Platz oben f\u00fcr Panels / Batterien / Spitze / Phasen / Ringe
      const topY = 100;
      const homeY = gridMeter ? 340 : 300; // bei Z\u00e4hlerstand mehr Platz unter dem Netz-Kreis
      add('grid', cx, topY, 60, c.grid, { name: 'Netz', icon: 'mdi:transmission-tower', color: '#4c8dbe', label_pos: kidsCfg.length || peakCfg || gridMeter ? 'bottom' : 'top' });
      add('solar', cx - SDs, topY, 52, c.solar, { name: 'Solar', icon: 'mdi:solar-power', color: '#ff9800', label_pos: kidsCfg.length ? 'left' : 'top' });
      add('battery', cx + SDb, topY, batR, b, { name: 'Batterie', icon: 'mdi:battery', color: '#e91e63', label_pos: batKidsCfg.length ? 'right' : 'top' });
      this._home = { key: 'home', x: cx, y: homeY + yoff, r: 56, cfg: { name: 'Haus', icon: 'mdi:home', color: '#1e88e5', label_pos: 'right', ...(c.home || {}) } };
      nodes.push(this._home);
      const rowY = homeY + 150 + yoff + (anyPh ? PHV : 0);
      let bottom;
      if (!groups.length) {
        const n = devs.length;
        let sx = cx - devs.reduce((a, d) => a + slotOf(d, 100, 42).w, 0) / 2;
        devs.forEach((d, i) => {
          const sl = slotOf(d, 100, 42);
          nodes.push({ key: 'd' + i, x: sx + sl.off, y: rowY, r: 42, dev: true, devKids: kidListOf(d), cfg: { name: 'Ger\u00e4t', icon: 'mdi:flash', color: PALETTE[i % PALETTE.length], label_pos: devKidsN(d) ? 'right' : 'bottom', ...d } });
          sx += sl.w;
        });
        bottom = n ? homeY + 150 + 42 + (anyDK ? 118 : 45) : homeY + 56 + 45;
      } else {
        let curX = cx - groups.reduce((acc, g) => acc + GW(g), 0) / 2;
        groups.forEach((g, gi) => {
          const w = GW(g);
          const zx = curX + w - GWi(g) / 2;
          curX += w;
          const zc = g.z.color || PALETTE[gi % PALETTE.length];
          const zcfg = { ...g.z };
          delete zcfg.devices;
          delete zcfg.phases;
          const zn = { key: 'z' + gi, x: zx, y: rowY, r: 44, dev: true, devNodes: [], phases: phasesOf(g.z), cfg: { name: 'Zone', icon: 'mdi:floor-plan', ...zcfg, color: zc } };
          nodes.push(zn);
          let sx = zx - sumSlots(g) / 2;
          g.devs.forEach((d, j) => {
            const sl = slotOf(d, 92, 32);
            const dn = { key: 'z' + gi + 'd' + j, x: sx + sl.off, y: rowY + DYV, r: 32, dev: true, parent: zn, devKids: kidListOf(d), cfg: { name: 'Ger\u00e4t', icon: 'mdi:flash', label_pos: devKidsN(d) ? 'right' : 'bottom', ...d, color: d.color || zc } };
            sx += sl.w;
            nodes.push(dn);
            zn.devNodes.push(dn);
          });
        });
        bottom = homeY + 150 + DYV + 32 + (anyDK ? 118 : 45) + (anyPh ? PHV : 0);
      }
      VH = Math.max(bottom, 400) + yoff;
    }
    {
      const seen = new Set();
      let grow = 0;
      const szOf = (n) => {
        const k = n.cfg && n.cfg.size !== undefined && !isNaN(Number(n.cfg.size)) ? Math.max(0.5, Math.min(1.6, Number(n.cfg.size))) : 1;
        return SZ * k;
      };
      nodes.concat(this._home ? [this._home] : []).forEach((n) => {
        if (seen.has(n)) return;
        seen.add(n);
        const r0 = n.r;
        n.szf = szOf(n);
        n.r = Math.round(n.r * n.szf);
        if (n.key === 'solar' || n.key === 'battery') grow = Math.max(grow, n.r - r0);
        if (n.kidR) n.kidR = Math.round(n.kidR * SZ);
      });
      // gr\u00f6\u00dfere Kreise: oben mehr Platz, damit nichts abgeschnitten wird
      const gk = Math.max(0, SZ - 1) * 56;
      const dyT = Math.round(Math.max(0, grow) + gk);
      if (dyT > 0) {
        const seen2 = new Set();
        nodes.concat(this._home ? [this._home] : []).forEach((n) => {
          if (seen2.has(n)) return;
          seen2.add(n);
          n.y += dyT;
        });
        VH += dyT;
      }
    }
    nodes.forEach((n) => { n.four = n.key === 'grid' || (n.key === 'battery' && bFour); });
    this._nodes = nodes;

    const gridNode = nodes.find((n) => n.key === 'grid');
    if (gridNode && peakCfg) {
      gridNode.ring = true;
      gridNode.pad = 12; // Platz f\u00fcr den Ring
    }
    const batNode0 = nodes.find((n) => n.key === 'battery');
    if (batNode0 && batRingOn) {
      batNode0.capRing = 'soc';
      batNode0.pad = 12;
    }
    const solNode0 = nodes.find((n) => n.key === 'solar');
    if (solNode0 && solRingOn) {
      solNode0.capRing = 'solar';
      solNode0.pad = 12;
    }
    // Haus: \u00e4u\u00dferer Ring, aufgeteilt nach den Untergruppen (Zonen bzw. Ger\u00e4te direkt am Haus)
    const homeNode = nodes.find((n) => n.key === 'home');
    if (homeNode && !(c.home && c.home.ring === false)) {
      const grp = nodes.filter((n) => n.dev && !n.parent);
      if (grp.length) {
        homeNode.groups = grp;
        homeNode.pad = 12;
      }
    }

    // Positionen aus dem Layout-Assistenten (positions: Name: {x, y} = Verschiebung)
    {
      const P = this._pos || {};
      nodes.forEach((n) => {
        const q = P[n.key];
        if (q) {
          n.x += Number(q.x) || 0;
          n.y += Number(q.y) || 0;
          n._mv = true;
        }
      });
      // verschobene Kreise nie abschneiden: Zeichenfl\u00e4che erweitern und ggf. alles nach rechts/unten schieben
      const mvd = nodes.filter((n) => n._mv);
      if (mvd.length) {
        const rr = (n) => (n.r || 40);
        let x0 = Math.min(...mvd.map((n) => n.x - rr(n) - 70));
        let y0 = Math.min(...mvd.map((n) => n.y - rr(n) - 18));
        const x1 = Math.max(...mvd.map((n) => n.x + rr(n) + 70));
        const y1 = Math.max(...mvd.map((n) => n.y + rr(n) + 36));
        const dx = x0 < 0 ? -x0 : 0;
        const dy = y0 < 0 ? -y0 : 0;
        if (dx || dy) nodes.forEach((n) => { n.x += dx; n.y += dy; });
        VW = Math.max(VW + dx, x1 + dx);
        VH = Math.max(VH + dy, y1 + dy);
      }
    }
    {
      const S = this._kShift;
      if (S && (S.x || S.y)) {
        const seenS = new Set();
        nodes.concat(this._home ? [this._home] : []).forEach((n) => {
          if (seenS.has(n)) return;
          seenS.add(n);
          n.x += S.x;
          n.y += S.y;
        });
        VW += S.x;
        VH += S.y;
      }
    }
    // ---- Verbindungen ----
    const by = {};
    nodes.forEach((n) => { by[n.key] = n; });
    const links = [];
    const R = 36; // Kurvenradius der Linien
    const lc = (n) => n.cfg.line_color || n.cfg.color;
    const straight = (a, bb) => `M${a.x},${a.y} L${bb.x},${bb.y}`;
    const vv = (a, bb) => (Math.abs(a.x - bb.x) < 1 ? `M${a.x},${a.y} V${bb.y}` : `M${a.x},${a.y} L${bb.x},${bb.y}`);
    // senkrecht los, dann abgerundet in die Waagrechte
    const vh = (x1, y1, x2, y2) => {
      const sy = Math.sign(y2 - y1);
      const sx = Math.sign(x2 - x1);
      const r = Math.min(R, Math.abs(y2 - y1), Math.abs(x2 - x1));
      return `M${x1},${y1} V${y2 - sy * r} Q${x1},${y2} ${x1 + sx * r},${y2} H${x2}`;
    };
    // Haus -> Ger\u00e4t: waagrecht, abgerundet senkrecht, abgerundet waagrecht
    const dev = (a, bb) => {
      const dy = bb.y - a.y;
      if (Math.abs(dy) < 1) return `M${a.x},${a.y} H${bb.x}`;
      const xm = (a.x + a.r + bb.x - bb.r) / 2;
      const sg = Math.sign(dy);
      const r = Math.min(R, Math.abs(dy) / 2, xm - a.x);
      return `M${a.x},${a.y} H${xm - r} Q${xm},${a.y} ${xm},${a.y + sg * r} V${bb.y - sg * r} Q${xm},${bb.y} ${xm + r},${bb.y} H${bb.x}`;
    };
    // senkrechtes Layout: Haus -> Zone/Ger\u00e4t (senkrecht, abgerundet waagrecht, abgerundet senkrecht)
    const devV = (a, bb, ymFixed) => {
      const dx = bb.x - a.x;
      if (Math.abs(dx) < 1) return `M${a.x},${a.y} V${bb.y}`;
      const ym = ymFixed !== undefined ? ymFixed : (a.y + a.r + bb.y - bb.r) / 2;
      const sg = Math.sign(dx);
      const r = Math.min(R, Math.abs(dx) / 2, ym - a.y, bb.y - ym);
      return `M${a.x},${a.y} V${ym - r} Q${a.x},${ym} ${a.x + sg * r},${ym} H${bb.x - sg * r} Q${bb.x},${ym} ${bb.x},${ym + r} V${bb.y}`;
    };
    // Linien von einem Kreis (Haus/Zone) zu mehreren Kindern (Zonen/Ger\u00e4te), ohne dass sie sich \u00fcberlappen:
    // jede Linie startet an einem eigenen Punkt am Kreis, die Knicke sind gestaffelt (die weiteste Linie knickt zuerst ab)
    const fanPaths = (par, kids, vt, umFixed) => {
      const U = (o) => (vt ? o.y : o.x);
      const V = (o) => (vt ? o.x : o.y);
      const P = (u, v) => (vt ? `${v},${u}` : `${u},${v}`);
      const sorted = kids.slice().sort((a, b) => V(a) - V(b));
      const lo = sorted.filter((k) => V(k) - V(par) < -1).reverse(); // n\u00e4chste zuerst
      const hi = sorted.filter((k) => V(k) - V(par) > 1);
      const mid = sorted.filter((k) => Math.abs(V(k) - V(par)) <= 1);
      const hasMid = mid.length > 0;
      const side = Math.max(lo.length, hi.length, 1);
      const sp = Math.min(14, (par.r * 0.7) / (side + 0.5));
      const res = {};
      const place = (k, off, rank, cnt) => {
        const ua = U(par);
        const ub = U(k);
        const va = V(par) + off;
        const vb = V(k);
        const gap = ub - k.r - (ua + par.r);
        const stepU = Math.min(10, Math.max(3, (gap * 0.5) / side), 24 / Math.max(1, side - 1));
        const umBase = umFixed !== undefined ? umFixed : (ua + par.r + ub - k.r) / 2;
        const um = umBase + ((cnt - 1) / 2 - rank) * stepU;
        const dv = vb - va;
        if (Math.abs(dv) < 1) return `M${P(ua, va)} L${P(ub, vb)}`;
        const sg = Math.sign(dv);
        const r = Math.max(2, Math.min(R, Math.abs(dv) / 2, um - ua, ub - um));
        return `M${P(ua, va)} L${P(um - r, va)} Q${P(um, va)} ${P(um, va + sg * r)} L${P(um, vb - sg * r)} Q${P(um, vb)} ${P(um + r, vb)} L${P(ub, vb)}`;
      };
      lo.forEach((k, j) => { res[k.key] = place(k, -(j + (hasMid ? 1 : 0.5)) * sp, j, lo.length); });
      hi.forEach((k, j) => { res[k.key] = place(k, (j + (hasMid ? 1 : 0.5)) * sp, j, hi.length); });
      mid.forEach((k) => { res[k.key] = place(k, 0, 0, 1); });
      return res;
    };
    const fanLinks = () => {
      const groupsBy = new Map();
      nodes.filter((n) => n.dev && !(n.cfg && (n.cfg.no_link === true || n.cfg.connected === false))).forEach((n) => {
        const par = n.parent || this._home;
        if (!groupsBy.has(par)) groupsBy.set(par, []);
        groupsBy.get(par).push(n);
      });
      groupsBy.forEach((kids, par) => {
        // senkrecht: Linien zu den Ger\u00e4ten einer Zone knicken unterhalb der Phasen-Spalte ab (links neben der Zone)
        const nPh = par.phases ? par.phases.length : 0;
        const umF = vert && par !== this._home ? par.y + Math.max(par.r + 52, nPh ? ((nPh - 1) / 2) * phStep + phR + 14 + (kids.length > 4 ? 12 : 0) : 0) : undefined;
        const paths = fanPaths(par, kids, vert, umF);
        kids.forEach((n) => links.push({ id: n.key, a: par, b: n, d: paths[n.key], ca: lc(n), cb: lc(n) }));
      });
    };
    const L = (id, ka, kb, fn) => {
      if (by[ka] && by[kb]) links.push({ id, a: by[ka], b: by[kb], d: fn(by[ka], by[kb]), ca: lc(by[ka]), cb: lc(by[kb]) });
    };
    if (!vert) {
      L('grid_home', 'grid', 'home', straight);
      L('solar_home', 'solar', 'home', (a, bb) => vh(a.x + 14, a.y, bb.x, bb.y - 14));
      L('solar_grid', 'solar', 'grid', (a, bb) => vh(a.x - 14, a.y, bb.x, bb.y - 14));
      L('solar_battery', 'solar', 'battery', vv);
      L('battery_home', 'battery', 'home', (a, bb) => vh(a.x + 14, a.y, bb.x, bb.y + 14));
      L('battery_grid', 'battery', 'grid', (a, bb) => vh(a.x - 14, a.y, bb.x, bb.y + 14));
      fanLinks();
    } else {
      L('grid_home', 'grid', 'home', vv);
      L('solar_home', 'solar', 'home', (a, bb) => vh(a.x - 14, a.y, bb.x, bb.y - 14));
      L('battery_home', 'battery', 'home', (a, bb) => vh(a.x + 14, a.y, bb.x, bb.y - 14));
      L('solar_grid', 'solar', 'grid', straight);
      L('battery_grid', 'battery', 'grid', straight);
      L('solar_battery', 'solar', 'battery', (a, bb) => {
        const yb = a.y + 115 + (gridMeter ? 40 : 0);
        return `M${a.x + 14},${a.y} V${yb - R} Q${a.x + 14},${yb} ${a.x + 14 + R},${yb} H${bb.x - 14 - R} Q${bb.x - 14},${yb} ${bb.x - 14},${yb - R} V${bb.y}`;
      });
      fanLinks();
    }
    // ---- kleine Kreise: Solar-Panels (oben) und Batterien (oben bzw. im waagrechten Layout unten) ----
    let kidSvg = '';
    this._kids = [];
    this._kAbs = {};
    this._kidBox = null;
    this._peakKid = null;
    const makeKids = (parent, list, prefix, mode, main, opt = {}) => {
      if (!parent || !list.length) return;
      const k = list.length;
      const rB = Math.round((opt.r || parent.kidR || (main === 'm' ? 33 : k <= 6 ? 26 : 20)) * (parent.kidR ? 1 : SZ));
      const kd = opt.dist !== undefined ? opt.dist : parent.kidDist; // Abstand zum Elternkreis
      const gap = 2 * rB + 6;
      const tiny = rB < 22;
      const w = (k - 1) * gap;
      let x0 = Math.max(parent.x - w / 2 + (opt.shiftX || 0), rB + 4);
      x0 = Math.min(x0, Math.max(rB + 4, VW - rB - 4 - w));
      const below = mode === 'below';
      const padK = parent.pad || 0;
      const left = mode === 'left'; // Spalte links neben dem Kreis
      const cy0 = below ? parent.y + parent.r + (kd !== undefined ? kd : 64) + padK : parent.y - parent.r - (kd || 75) - padK;
      const kmax = Math.max(1, ...list.map((x) => (x && typeof x === 'object' && !isNaN(Number(x.size)) ? Math.min(1.6, Number(x.size)) : 1)));
      if (below) VH = Math.max(VH, cy0 + rB * kmax + 30 + (parent.mtail || 0));
      list.forEach((raw, i) => {
        const o = typeof raw === 'string' ? { [main === 's' ? 'soc' : 'power']: raw } : { ...raw };
        const id = prefix + i;
        const ksz = o.size !== undefined && !isNaN(Number(o.size)) ? Math.max(0.5, Math.min(1.6, Number(o.size))) : 1;
        const r = Math.round(rB * ksz);
        const pk = this._pos && this._pos[id];
        const cx = (left ? parent.x - parent.r - (kd || 22) - r : x0 + i * gap) + (pk ? Number(pk.x) || 0 : 0);
        const cy = (left ? parent.y + (i - (k - 1) / 2) * gap : cy0 + (below ? 0 : Math.max(0, r - rB))) + (pk ? Number(pk.y) || 0 : 0);
        this._kAbs[id] = { x: cx, y: cy, r };
        if (pk && (pk.x || pk.y)) {
          const kbx = this._kidBox || (this._kidBox = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 });
          kbx.x0 = Math.min(kbx.x0, cx - r - (left ? 70 : 40));
          kbx.x1 = Math.max(kbx.x1, cx + r + 40);
          kbx.y0 = Math.min(kbx.y0, cy - r - 16);
          kbx.y1 = Math.max(kbx.y1, cy + r + 20);
        }
        const FK = fmOf(o, ksz);
        if (main === 'm') this._peakKid = { cx, cy, r };
        {
          const kb = parent._kb || (parent._kb = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 });
          kb.x0 = Math.min(kb.x0, cx - r - 4);
          kb.x1 = Math.max(kb.x1, cx + r + 4);
          kb.y0 = Math.min(kb.y0, cy - r - 14);
          kb.y1 = Math.max(kb.y1, cy + r + 16);
        }
        const col = o.color || parent.cfg.color;
        let dpath;
        if (left) {
          const dya = Math.max(-parent.r * 0.7, Math.min(parent.r * 0.7, (cy - parent.y) * 0.3));
          const ey = parent.y + dya;
          const ex = parent.x - Math.sqrt(parent.r * parent.r - dya * dya);
          const mx = (cx + r + ex) / 2;
          dpath = `M${cx + r},${cy} C${mx},${cy} ${mx},${ey} ${ex},${ey}`;
        } else {
          const dxa = Math.max(-parent.r * 0.8, Math.min(parent.r * 0.8, (cx - parent.x) * (opt.fan || 0.2)));
          const ex = parent.x + dxa;
          const arc = Math.sqrt(parent.r * parent.r - dxa * dxa);
          const ey = below ? parent.y + arc : parent.y - arc;
          const mid = cy + (ey - cy) / 2;
          dpath = `M${cx},${cy} C${cx},${mid} ${ex},${mid} ${ex},${ey}`;
        }
        links.push({
          id,
          a: { key: id, cfg: { color: col } },
          b: parent,
          d: dpath,
          ca: col,
          cb: col,
        });
        // Phasen nur mit Strom/Spannung: keine leere Leistungszeile
        const kk = main === 's' ? ['s'] : main === 'm' ? ['m'] : o.power || !(o.current || o.voltage || o.temperature) ? ['p'] : [];
        if (main === 's' && o.power) kk.push('p');
        if (main === 'm') {
          if (o.live) kk.push('l');
          if (o.last) kk.push('z');
        }
        if (o.current) kk.push('a');
        if (o.voltage) kk.push('v');
        if (o.temperature) kk.push('t');
        if (o.switch && /^(z\d+)?d\d+c\d+$/.test(id)) swBtn(id, o, cx, cy, r, col);
        const socRing = main === 's' && batRingOn;
        const KC = vawRingLen(SH, r, 0);
        this._kids.push({ o, id, col, socRing, KC });
        const KN = kk.length;
        const lineH = (KN >= 4 ? (tiny ? 8 : 9.5) : tiny ? 9 : 10) * FK;
        const kfirst = cy + 4 - ((KN - 1) * lineH) / 2;
        const ktxt = kk
          .map((q, qi) => {
            const yy = kfirst + qi * lineH;
            if (qi === 0) return `<text id="k${q}_${id}" x="${cx}" y="${yy}" class="p" style="font-size:${(tiny ? 10 : 12) * FK}px">\u2013</text>`;
            return `<text id="k${q}_${id}" x="${cx}" y="${yy}" class="s" style="font-size:${(tiny ? 7.5 : 8.5) * FK}px">\u2013</text>`;
          })
          .join('\n            ');
        kidSvg += `
          <g class="kid" id="kg_${id}">
            ${vawShapeEl(SH, cx, cy, r, `id="kc_${id}" fill="var(--card-background-color, #fff)" stroke="${vawEsc(col)}" stroke-width="3"${socRing ? ' stroke-opacity="0.3"' : ''}`)}
            ${OPT.grad && main !== 'm' ? vawShapeEl(SH, cx, cy, r, `fill="url(#${gradId(col)})" pointer-events="none"`) : ''}
            ${socRing ? vawRingEl(SH, cx, cy, r, 0, `id="kr_${id}" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round" stroke-dasharray="0 ${KC.toFixed(1)}" opacity="0"`) : ''}
            ${ktxt}
            ${o.name ? (left ? `<text x="${cx - r - 5}" y="${cy + 3}" class="n" style="font-size:${9 * FK}px;text-anchor:end">${vawEsc(o.name)}</text>` : `<text x="${cx}" y="${below ? cy + r + 12 : cy - r - 5}" class="n" style="font-size:${9 * FK}px">${vawEsc(o.name)}</text>`) : ''}
          </g>`;
      });
    };
    makeKids(by.solar, kidsCfg, 'solar_c', 'above', 'p');
    makeKids(by.battery, batKidsCfg, 'bat_c', vert ? 'above' : 'below', 's');
    // senkrecht liegen Phasen und Spitze in einer Reihe \u00fcber dem Netz-Kreis (Spitze rechts neben den Phasen)
    let shiftPeak = 0;
    let shiftPh = 0;
    if (vert && by.grid && gridPhCfg.length && peakCfg) {
      const nP = gridPhCfg.length;
      const Wp = (nP - 1) * 50 + 44;
      const left0 = by.grid.x - (Wp + 14 + 66) / 2;
      shiftPeak = left0 + Wp + 14 + 33 - by.grid.x;
      shiftPh = left0 + 22 - (by.grid.x - ((nP - 1) * 50) / 2);
    }
    if (by.grid && gridPhCfg.length) {
      if (vert) makeKids(by.grid, gridPhCfg, 'gph_', 'above', 'p', { r: 22, dist: 75, shiftX: shiftPh, fan: gridFan });
      else makeKids(by.grid, gridPhCfg, 'gph_', 'left', 'p', { r: 22, dist: 22 + (by.grid.pad || 0) });
    }
    if (peakCfg) {
      const okC = peakCfg.ok_color || '#43a047';
      makeKids(by.grid, [{ ...peakCfg, color: okC, name: peakCfg.name || 'Spitze 15 min' }], 'peak_c', vert ? 'above' : 'below', 'm', { shiftX: shiftPeak, fan: gridFan });
    }
    // Phasen \u00fcber den Zonen: kleine Kreise (Standard: Strom flie\u00dft von der Zone zur Phase = Aufteilung der Zonenleistung)
    nodes.filter((n) => n.phases && n.phases.length).forEach((zn) => {
      zn.kidR = phR;
      zn.kidDist = vert ? 22 : 40;
      zn.phKids = [];
      const list = zn.phases.map((raw, i) => {
        const o = typeof raw === 'string' ? { power: raw } : { ...raw };
        if (o.name === undefined) o.name = 'L' + (i + 1);
        if (o.invert === undefined) o.invert = true;
        return o;
      });
      list.forEach((o, i) => zn.phKids.push(zn.key + 'p' + i));
      makeKids(zn, list, zn.key + 'p', vert ? 'left' : 'above', 'p');
    });
    // Unterger\u00e4te (kleine Kreise unter einem Ger\u00e4t); Punkte laufen standardm\u00e4\u00dfig vom Ger\u00e4t zum Unterger\u00e4t
    nodes.filter((n) => n.devKids && n.devKids.length).forEach((dn) => {
      dn.kidR = DKR;
      dn.kidDist = KDIST;
      const list = dn.devKids.map((o) => {
        const oo = { ...o };
        if (oo.invert === undefined) oo.invert = true;
        return oo;
      });
      dn.phKids = list.map((o, i) => dn.key + 'c' + i);
      makeKids(dn, list, dn.key + 'c', 'below', 'p');
    });
    // verschobene kleine Kreise nie abschneiden: links/oben alles verschieben (zweiter Durchlauf), rechts/unten erweitern
    {
      const S0 = this._kShift || { x: 0, y: 0 };
      const kb = this._kidBox;
      const needX = kb ? Math.max(0, -(kb.x0 - S0.x)) : 0;
      const needY = kb ? Math.max(0, -(kb.y0 - S0.y)) : 0;
      if ((needX !== S0.x || needY !== S0.y) && !this._kRe) {
        if (this._drag) {
          const ddx = needX - S0.x;
          const ddy = needY - S0.y;
          this._drag.sx += ddx;
          this._drag.sy += ddy;
          if (this._drag.bx !== null && this._drag.bx !== undefined) {
            this._drag.bx += ddx;
            this._drag.by += ddy;
          }
        }
        this._kShift = { x: needX, y: needY };
        this._kRe = true;
        try { return this._render(); } finally { this._kRe = false; }
      }
      if (kb) {
        VW = Math.max(VW, Math.ceil(kb.x1));
        VH = Math.max(VH, Math.ceil(kb.y1));
      }
    }
    // Unabh\u00e4ngige Status-Kreise unten: ein Kreis pro Sensor (nicht mit dem Diagramm verbunden)
    const stCirc = [];
    stCfg.forEach((o, i) => { if (o.show.includes('circles')) o.ents.forEach((e, j) => stCirc.push({ i, j })); });
    this._stCirc = stCirc;
    let stSvg = '';
    let stIcons = '';
    this._stAbsNew = {};
    if (stCirc.length) {
      const R2 = 24;
      const GX = 26;
      const szS = (q) => {
        const z = Number(stCfg[q.i] && stCfg[q.i].size);
        return isNaN(z) || !(z > 0) ? 1 : Math.max(0.5, Math.min(1.6, z));
      };
      const RM = Math.max(R2, ...stCirc.map((q) => Math.round(R2 * szS(q))));
      const perRow = Math.max(1, Math.floor((VW - 40) / (2 * RM + GX)));
      const rows = Math.ceil(stCirc.length / perRow);
      const y0 = VH + 6;
      const rowH = 82 + 2 * (RM - R2);
      VH = y0 + rows * rowH + 6;
      const stIconQ = [];
      stCirc.forEach((q, k) => {
        const row = Math.floor(k / perRow);
        const inRow = row === rows - 1 ? stCirc.length - row * perRow : perRow;
        const rs = Math.round(R2 * szS(q));
        const id = q.i + '_' + q.j;
        const pq = (this._pos && this._pos['st_' + id]) || null;
        // (Position wird unten f\u00fcr den Layout-Assistenten gemerkt)
        const cx = Math.max(rs + 4, Math.min(VW - rs - 4, VW / 2 + (k - row * perRow - (inRow - 1) / 2) * (2 * RM + GX) + (pq ? pq.x : 0)));
        const cy = Math.max(rs + 4, y0 + RM + 4 + row * rowH + (pq ? pq.y : 0));
        if (pq && cy + rs + 26 > VH) VH = cy + rs + 26;
        (this._stAbsNew = this._stAbsNew || {})['st_' + id] = { x: cx, y: cy, r: rs };
        stSvg += `<g class="stc" id="stc_${id}" data-st="${q.i}:${q.j}">${vawShapeEl(SH, cx, cy, rs, 'fill="var(--card-background-color, #fff)"')}${vawShapeEl(SH, cx, cy, rs, `id="stk_${id}" fill="none" stroke="#888" stroke-width="3"`)}<text id="stt_${id}" x="${cx}" y="${cy + 16}" class="s" style="font-size:${9 * fmOf(stCfg[q.i], szS(q))}px">\u2013</text><text id="stn_${id}" x="${cx}" y="${cy + rs + 14}" class="n" style="font-size:${10 * fmOf(stCfg[q.i], szS(q))}px"></text></g>`;
        const se = this._stSwEnt(stCfg[q.i], q.j);
        if (se) swBtn('st_' + id, { switch: se, switch_confirm: stCfg[q.i].switch_confirm, name: stCfg[q.i].ents.length === 1 && stCfg[q.i].name ? stCfg[q.i].name : stCfg[q.i].ents[q.j].name || stCfg[q.i].name }, cx, cy, rs, stCfg[q.i].open_color || '#fb8c00');
        stIconQ.push({ id, cx, cy, rs });
      });
      // Symbole erst nach der Schleife setzen: VH kann oben noch wachsen (verschobener Kreis haengt
      // nach unten ueber). Fruehere Symbole hingen sonst mit altem VH unter ihren Kreisen.
      stIconQ.forEach((o) => {
        stIcons += `<ha-icon id="sti_${o.id}" icon="mdi:door-closed" style="left:${(o.cx / VW) * 100}%;top:${((o.cy - 5) / VH) * 100}%;color:#888;--mdc-icon-size:${((18 * o.rs / R2 / VW) * 100).toFixed(3)}cqw"></ha-icon>`;
      });
    }
    if (c.line_corners === 'square') links.forEach((l) => { l.d = l.d.replace(/Q(-?[\d.]+),(-?[\d.]+) (-?[\d.]+),(-?[\d.]+)/g, 'L$1,$2 L$3,$4'); });
    // Positionen aller verschiebbaren Kreise merken (f\u00fcr Raster und Hilfslinien im Layout-Assistenten)
    this._abs = {};
    nodes.forEach((n) => { this._abs[n.key] = { x: n.x, y: n.y, r: n.r }; });
    Object.keys(this._stAbsNew || {}).forEach((k) => { this._abs[k] = this._stAbsNew[k]; });
    Object.keys(this._kAbs || {}).forEach((k) => { this._abs[k] = this._kAbs[k]; });
    // Rahmen um Zonen samt Ger\u00e4ten (zone_frames: true oder pro Zone frame: true/false)
    let frameSvg = '';
    nodes.filter((n) => /^z\d+$/.test(n.key)).forEach((zn) => {
      const on = zn.cfg && (zn.cfg.frame === true || (c.zone_frames === true && zn.cfg.frame !== false));
      if (!on) return;
      const grp = [zn].concat(nodes.filter((n) => n.key.indexOf(zn.key + 'd') === 0 && /^z\d+d\d+$/.test(n.key)));
      if (grp.length < 2) return;
      let x0 = 1e9;
      let y0 = 1e9;
      let x1 = -1e9;
      let y1 = -1e9;
      grp.forEach((n) => {
        const rr = n.r || 40;
        x0 = Math.min(x0, n.x - rr);
        x1 = Math.max(x1, n.x + rr + (n === zn ? 0 : 74));
        y0 = Math.min(y0, n.y - rr);
        y1 = Math.max(y1, n.y + rr + 16);
        if (n._kb) {
          x0 = Math.min(x0, n._kb.x0);
          x1 = Math.max(x1, n._kb.x1);
          y0 = Math.min(y0, n._kb.y0);
          y1 = Math.max(y1, n._kb.y1);
        }
      });
      const col = zn.cfg.color || '#888';
      const P = 8;
      frameSvg += `<rect class="zf" x="${(x0 - P).toFixed(1)}" y="${(y0 - P).toFixed(1)}" width="${(x1 - x0 + 2 * P).toFixed(1)}" height="${(y1 - y0 + 2 * P).toFixed(1)}" rx="20" fill="${col}" fill-opacity="0.07" stroke="${col}" stroke-opacity="0.4" stroke-width="1.5" stroke-dasharray="5 4" pointer-events="none"/>`;
    });
    // schwebende Wert-Labels an den Linien (line_labels: true / Liste von Linien-Namen, oder pro Kreis line_label: true/false)
    const llOn = (l) => {
      const f = [l.a.cfg && l.a.cfg.line_label, l.b.cfg && l.b.cfg.line_label];
      if (f.includes(false)) return false;
      if (f.includes(true)) return true;
      const g = c.line_labels;
      return g === true || (Array.isArray(g) && g.includes(l.id));
    };
    let llSvg = '';
    links.forEach((l) => {
      if (llOn(l)) {
        l._ll = true;
        llSvg += `<text class="ll" id="ll_${l.id}" text-anchor="middle" visibility="hidden">\u2013</text>`;
      }
    });
    // Raster und Hilfslinien (nur im Layout-Assistenten)
    let gridSvg = '';
    let guideSvg = '';
    if (this._la) {
      if (this._laGrid !== false) gridSvg = `<defs><pattern id="vawgrid" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="0.8" fill="#9e9e9e" opacity="0.55"/></pattern></defs><rect x="0" y="0" width="${VW}" height="${VH}" fill="url(#vawgrid)" pointer-events="none"/>`;
      (this._guides || []).forEach((g) => {
        guideSvg += `<line x1="${g[0]}" y1="${g[1]}" x2="${g[2]}" y2="${g[3]}" stroke="#ff4081" stroke-width="1.2" stroke-dasharray="4 3" pointer-events="none"/>`;
      });
    }
    this._links = links;

    let paths = '';
    let dots = '';
    let lgDefs = '';
    for (const l of links) {
      paths += `<path id="l_${l.id}" d="${l.d}" fill="none" stroke="${l.ca}" stroke-width="2" opacity="0.3"/>`;
      // Partikel nach Quelle: Funken bei Solar/Batterie, Tropfen sonst
      const mkk = OPT.mk === 'particles' ? (['solar', 'battery'].includes(l.a.key) || ['solar', 'battery'].includes(l.b.key) ? 'spark' : 'drop') : OPT.mk;
      l._mk = mkk;
      const part = mkk === 'spark' || mkk === 'drop';
      const mkEnd = mkk === 'dot' ? 'circle' : part ? 'g' : 'path';
      let mks = '';
      for (let i = 0; i < OPT.ndot; i++) {
        const sf = i ? '_' + i : '';
        const mkEl = mkk === 'dot' ? `<circle id="dot_${l.id}${sf}" r="4.5"` : part ? `<g id="dot_${l.id}${sf}"` : `<path id="dot_${l.id}${sf}" d="${vawMk(mkk, 5)}"`;
        const body = part ? `<g transform="scale(1.7)">${mkk === 'spark' ? vawSpark(i) : vawDrop()}</g>` : '';
        mks += `${mkEl} fill="${l.ca}" visibility="hidden"><animateMotion id="am_${l.id}${sf}" dur="3s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear"${mkk === 'dot' ? '' : ' rotate="auto"'}><mpath href="#p_${l.id}"/></animateMotion>${body}</${mkEnd}>`;
      }
      dots += `<path id="p_${l.id}" d="${l.d}" fill="none" stroke="none"/>${mks}`;
      if (OPT.lgrad) lgDefs += `<linearGradient id="lg_${l.id}" gradientUnits="userSpaceOnUse" x1="${l.a.x}" y1="${l.a.y}" x2="${l.b.x}" y2="${l.b.y}"><stop id="lgs0_${l.id}" offset="0" style="stop-color:${lc(l.a)}"/><stop id="lgs1_${l.id}" offset="1" style="stop-color:${lc(l.b)}"/></linearGradient>`;
    }

    // ---- Kreise ----
    let circles = '';
    let icons = '';
    for (const n of nodes) {
      const col = n.cfg.color;
      const s = n.dev ? (n.r <= 34 ? 0.7 : 0.85) : 1;
      const lbl = '';
      const hasSoc = n.key === 'battery' && !!n.cfg.soc && !!n.cfg.soc_in_circle;
      const ic = n.cfg.icon_color || col;
      const tc = n.cfg.text_color ? `fill:${n.cfg.text_color};` : '';
      const c2 = n.cfg.export_color || n.cfg.charge_color || '#43a047';
      const top = n.cfg.label_pos === 'top';
      const side = n.cfg.label_pos === 'right' ? 1 : n.cfg.label_pos === 'left' ? -1 : 0;
      const pad = n.pad || 0;
      let ringSvg = '';
      if (n.ring) {
        n.ringC = vawRingLen(SH, n.r, 9);
        ringSvg = `${vawRingEl(SH, n.x, n.y, n.r, 9, 'fill="none" stroke="#888" stroke-width="5" opacity="0.22"')}
          ${vawRingEl(SH, n.x, n.y, n.r, 9, `id="rg_${n.key}" fill="none" stroke="#43a047" stroke-width="5" stroke-linecap="round" stroke-dasharray="0 ${n.ringC}" opacity="0"`)}`;
      } else if (n.groups) {
        n.ringC = vawRingLen(SH, n.r, 9);
        ringSvg = `${vawRingEl(SH, n.x, n.y, n.r, 9, 'fill="none" stroke="#888" stroke-width="5" opacity="0.22"')}
          ${n.groups
            .map((g) => vawRingEl(SH, n.x, n.y, n.r, 9, `id="hs_${g.key}" fill="none" stroke="${vawEsc(g.cfg.color)}" stroke-width="5" stroke-dasharray="0 ${n.ringC}" opacity="0"`))
            .join('\n          ')}`;
      }
      if (n.dev && n.cfg.switch) swBtn(n.key, n.cfg, n.x, n.y, n.r, col);
      if (!ringSvg && n.capRing) {
        n.ringC = vawRingLen(SH, n.r, 9);
        ringSvg = `${vawRingEl(SH, n.x, n.y, n.r, 9, 'fill="none" stroke="#888" stroke-width="5" opacity="0.22"')}
          ${vawRingEl(SH, n.x, n.y, n.r, 9, `id="cg_${n.key}" fill="none" stroke="${n.capRing === 'solar' ? col : '#43a047'}" stroke-width="5" stroke-linecap="round" stroke-dasharray="0 ${n.ringC.toFixed(1)}" opacity="0"`)}`;
      }
      // unter dem Netz-Kreis l\u00e4uft eine Linie (senkrecht: zum Haus, waagrecht: zur Spitze) -> Name links neben die Linie
      const besideLine = n.key === 'grid' && !side && !top && (vert || !!peakCfg);
      // Zone mit Ger\u00e4ten (senkrecht): unter der Zone laufen die Linien zu den Ger\u00e4ten -> Name rechts daneben
      const zoneRight = vert && !!(n.devNodes && n.devNodes.length) && !side && !top;
      const lx = side ? n.x + side * (n.r + 10 + pad) : besideLine ? n.x - 8 : zoneRight ? n.x + 34 : n.x;
      const lan = side > 0 ? 'start' : side < 0 ? 'end' : besideLine ? 'end' : zoneRight ? 'start' : 'middle';
      const ny = side ? n.y + 2 : top ? n.y - n.r - 8 - pad : n.y + n.r + 17 + pad;
      const sy2 = side ? n.y + 17 : top ? n.y - n.r - 22 - pad : n.y + n.r + 32 + pad;
      // Z\u00e4hlerstand-Zeilen so platzieren, dass sie nicht \u00fcber Linien laufen:
      // waagrecht -> \u00fcber dem Netz-Kreis; senkrecht -> links/rechts neben der Linie
      let meterSvg = '';
      if (n.key === 'grid' && gridMeter) {
        meterSvg = [0, 1]
          .map((mi) => {
            let mx = lx;
            let my = sy2 + (top ? -1 : 1) * (14 + mi * 13);
            let man = lan;
            if (vert) {
              mx = n.x + (mi === 0 ? -8 : 8);
              man = mi === 0 ? 'end' : 'start';
              my = sy2 + 14;
            } else {
              // waagrecht: \u00fcber dem Netz-Kreis (bzw. \u00fcber dem Ring), dort l\u00e4uft keine Linie und es ist klar,
              // dass die Werte zum Z\u00e4hler und nicht zur 15-Minuten-Spitze geh\u00f6ren
              mx = n.x;
              my = n.y - n.r - 12 - (n.ring ? 12 : 0) - (1 - mi) * 13;
              man = 'middle';
            }
            return `<text id="mt_${mi}" x="${mx}" y="${my}" class="sec" style="text-anchor:${man};font-size:10.5px"></text>`;
          })
          .join('\n          ');
      }
      // Zeilen im Kreis: Leistung, dann nur das, was konfiguriert ist (current, voltage, temperature)
      const kinds = n.four ? ['in', 'out'] : ['p'];
      if (n.cfg.current) kinds.push('a');
      if (n.cfg.voltage) kinds.push('v');
      if (n.cfg.temperature) kinds.push('t');
      if (n.cfg.frequency) kinds.push('f');
      (Array.isArray(n.cfg.extra) ? n.cfg.extra.slice(0, 4) : []).forEach((_, xi) => kinds.push('x' + xi));
      n.lines = kinds;
      const N = kinds.length;
      const sc = n.four ? 1 : s;
      const FM = fmOf(n.cfg, n.szf);
      let step = (N <= 2 ? 17 : N === 3 ? 15 : N === 4 ? 13.5 : 12.5) * sc * FM;
      let first = n.y + 8 * sc * FM - ((N - 1) * step) / 2;
      let iconY = n.y - n.r * (n.r <= 34 ? 0.62 : 0.65);
      let socY = null;
      if (hasSoc) {
        socY = n.y - n.r + 24; // Ladestand ganz oben im Kreis
        iconY = socY + 16; // Icon darunter
        first = Math.max(first, socY + 40); // Werte unter dem Icon
        if (N > 1) step = Math.min(step, (n.y + n.r - 14 - first) / (N - 1));
      } else if (N >= 5) {
        // viele Zeilen: unter dem Icon beginnen und enger setzen, Kreis bleibt gleich gro\u00df
        first = Math.max(first, iconY + 22);
        step = Math.min(step, (n.y + n.r - 14 - first) / (N - 1));
      }
      const smallFs = Math.min(n.four ? 11 : 12 * s, Math.max(8, (step * 0.9) / FM)) * FM;
      const body = kinds
        .map((k, i) => {
          const yy = first + i * step;
          if (k === 'p' || k === 'in') return `<text x="${n.x}" y="${yy}" class="p" style="font-size:${(n.four ? 14 : 16 * s) * FM}px;${tc}">\u2013</text>`;
          if (k === 'out') return `<text x="${n.x}" y="${yy}" class="p" style="font-size:${14 * FM}px;fill:${c2}">\u2013</text>`;
          return `<text x="${n.x}" y="${yy}" class="s" style="font-size:${smallFs}px;${tc}">\u2013</text>`;
        })
        .join('\n           ');
      const isz = n.r <= 34 ? 14 : 20;
      icons += `<ha-icon id="i_${n.key}" icon="${vawEsc(n.cfg.icon)}" style="left:${(n.x / VW) * 100}%;top:${(iconY / VH) * 100}%;color:${vawEsc(ic)};--mdc-icon-size:${((isz / VW) * 100).toFixed(3)}cqw"></ha-icon>`;
      let fillSvg = '';
      if ((n.cfg.fill_level !== undefined ? n.cfg.fill_level === true : OPT.fill) && (n.key === 'battery' || n.key === 'solar')) {
        fillSvg = `<clipPath id="fc_${n.key}">${vawShapeEl(SH, n.x, n.y, n.r - 2, '')}</clipPath><rect id="fv_${n.key}" x="${n.x - n.r}" y="${n.y - n.r}" width="${2 * n.r}" height="${2 * n.r}" fill="${col}" fill-opacity="0.22" clip-path="url(#fc_${n.key})" pointer-events="none" style="transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(0);transition:transform 0.8s ease"/>`;
      }
      let sparkSvg = '';
      n.spE = null;
      if (n.cfg.sparkline !== undefined ? n.cfg.sparkline === true && n.r >= 26 : SPARK && n.r >= 40) {
        const se = vawSparkEnts(n);
        if (se.length) {
          n.spE = se;
          n.spG = { x: n.x - n.r * 0.75, y: n.y + n.r * 0.14, w: n.r * 1.5, h: n.r * 0.48 };
          sparkSvg = `<g class="spk" id="spk_${n.key}" pointer-events="none"><path class="spa" fill="${col}" fill-opacity="0.16" stroke="none"/><path class="spl" fill="none" stroke="${col}" stroke-opacity="0.6" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/></g>`;
        }
      }
      // fester Hintergrund au\u00dferhalb der Gruppe: beim Ausgrauen (opacity) scheinen sonst die Linien durch den Kreis
      circles += `
        ${vawShapeEl(SH, n.x, n.y, n.r, 'fill="var(--card-background-color, #fff)"')}
        <g class="node" id="g_${n.key}">
          ${ringSvg}
          ${vawShapeEl(SH, n.x, n.y, n.r, `id="c_${n.key}" fill="var(--card-background-color, #fff)" stroke="${col}" stroke-width="4" style="--gc:${col}"`)}
          ${OPT.grad ? vawShapeEl(SH, n.x, n.y, n.r, `fill="url(#${gradId(col)})" pointer-events="none"`) : ''}
          ${fillSvg}
          ${sparkSvg}
          ${body}
          ${hasSoc ? `<text id="soc_${n.key}" x="${n.x}" y="${socY}" class="p" style="font-size:${14 * FM}px;${tc}"></text>` : ''}
          <text x="${lx}" y="${ny}" class="n" style="text-anchor:${lan}${FM !== 1 ? ';font-size:' + 13 * FM + 'px' : ''}">${vawEsc(n.cfg.name === undefined || n.cfg.name === null ? '' : n.cfg.name)} ${lbl}</text>
          <text id="sec_${n.key}" x="${lx}" y="${sy2}" class="sec" style="text-anchor:${lan}${FM !== 1 ? ';font-size:' + 11 * FM + 'px' : ''}"></text>
          ${meterSvg}
        </g>`;
    }

    // Abzeichen am Kreis (status[].at = Name des Kreises, z. B. "Garage / Keller")
    this._stb = [];
    let stbSvg = '';
    let stbIcons = '';
    stCfg.forEach((o, i) => {
      if (!o.at) return;
      const nd = nodes.find((n) => String(n.cfg.name).toLowerCase() === String(o.at).toLowerCase() || n.key === o.at);
      if (!nd) return;
      const rb = nd.r >= 40 ? 13 : 11;
      const bx = nd.x - nd.r * 0.74;
      const by0 = nd.y - nd.r * 0.68;
      this._stb.push({ i });
      stbSvg += `<g class="stb" id="stb_${i}" data-st="${i}:-1"><circle cx="${bx.toFixed(1)}" cy="${by0.toFixed(1)}" r="${rb + 4}" fill="transparent"/><circle cx="${bx.toFixed(1)}" cy="${by0.toFixed(1)}" r="${rb}" fill="var(--card-background-color, #fff)"/><circle id="stbk_${i}" cx="${bx.toFixed(1)}" cy="${by0.toFixed(1)}" r="${rb}" fill="none" stroke="#888" stroke-width="2.5"/><g id="stbc_${i}" visibility="hidden"><circle cx="${(bx - rb * 0.75).toFixed(1)}" cy="${(by0 - rb * 0.75).toFixed(1)}" r="7" fill="#e53935"/><text id="stbn_${i}" x="${(bx - rb * 0.75).toFixed(1)}" y="${(by0 - rb * 0.75 + 3).toFixed(1)}" style="font-size:9px;font-weight:600;fill:#fff">0</text></g></g>`;
      stbIcons += `<ha-icon id="stbi_${i}" icon="mdi:door-closed" style="left:${(bx / VW) * 100}%;top:${(by0 / VH) * 100}%;color:#888;--mdc-icon-size:${(((rb + 1) / VW) * 100).toFixed(3)}cqw"></ha-icon>`;
    });
    // Kopfzeile links oben: Titel, darunter Datum und Uhrzeit
    const esc = vawEsc;
    const stHdr = stCfg.some((o) => o.show.includes('header'));
    const stInfo = stCfg.some((o) => o.show.includes('info'));
    const hdr = c.title || c.date || c.time || stHdr
      ? `<div class="hdr">${c.title || c.date || c.time ? `<div class="hl">${c.title ? `<div class="t">${esc(c.title)}</div>` : ''}${c.date || c.time ? '<div class="dt"><span class="hd"></span>' + (c.date && c.time ? ' \u00b7 ' : '') + '<span class="ht"></span></div>' : ''}</div>` : ''}${stHdr ? '<div class="hs"></div>' : ''}</div>`
      : '';
    const defsSvg = gradDefs.size || lgDefs
      ? '<defs>' + [...gradDefs].map(([gc, gi]) => `<radialGradient id="${gi}" cx="35%" cy="28%" r="80%"><stop offset="0" style="stop-color:${gc};stop-opacity:0.22"/><stop offset="1" style="stop-color:${gc};stop-opacity:0.03"/></radialGradient>`).join('') + lgDefs + '</defs>'
      : '';
    const I0 = c.info && typeof c.info === 'object' ? c.info : {};
    const infoOn = !!(stInfo || I0.autarky || I0.self_consumption || I0.battery_time || I0.co2_entity || I0.co2 || (Array.isArray(I0.items) && I0.items.length) || (c.grid && c.grid.price));
    this._infoOn = infoOn;
    const viewsL = this._views || [];
    const tabsHtml = viewsL.length > 1
      ? `<div class="tabs">${viewsL.map((v, i) => `<button class="tab${i === this._vi ? ' on' : ''}" data-vi="${i}">${v.icon ? `<ha-icon icon="${esc(v.icon)}"></ha-icon>` : ''}<span>${esc(v.name || 'Ansicht ' + (i + 1))}</span></button>`).join('')}</div>`
      : '';
    const laYaml = () => {
      const P = this._pos || {};
      const ks = Object.keys(P).filter((k) => P[k] && (P[k].x || P[k].y));
      const vn = viewsL.length > 1 && viewsL[this._vi] ? '# in Ansicht "' + (viewsL[this._vi].name || this._vi + 1) + '" (unter views) einfuegen\n' : '';
      return vn + (ks.length ? 'positions:\n' + ks.map((k) => `  ${k}: {x: ${P[k].x || 0}, y: ${P[k].y || 0}}`).join('\n') : 'positions: {}');
    };
    this._laYamlText = laYaml;
    // Positionen gelten je Fenster-Ausrichtung: Knopf, der sie in die andere uebernimmt
    const laOth = this._orient() === 'v' ? 'quer' : 'hochkant';
    const laHtml = (c.layout_assistant === true ? `<div class="labtn${this._la ? ' on' : ''}" data-act="la" title="Layout bearbeiten"><ha-icon icon="mdi:cursor-move"></ha-icon></div>` : '')
      + (this._la ? `${this._laTxt ? `<textarea class="lat" readonly>${esc(laYaml())}</textarea>` : ''}<div class="labar"><span>Kreise ziehen</span><button data-act="lagrid">Raster ${this._laGrid === false ? 'aus' : 'an'}</button><button data-act="laflip" title="Diese Anordnung auch f\u00fcr ${laOth} \u00fcbernehmen">${this._laFlip ? '\u00dcbernommen' : '\u2192 ' + laOth}</button><button data-act="lareset">Zur\u00fccksetzen</button><button data-act="lacopy">YAML</button><button data-act="ladone">Fertig</button></div>` : '');
    const ttHrs = this._ttHours();
    const ttHtml = c.time_travel === true
      ? (this._ttOn
        ? `<div class="ttbar"><input type="range" class="tts" min="0" max="${ttHrs * 60}" step="5" value="${ttHrs * 60 - (this._ttMin || 0)}"><span class="ttl">${this._ttLabel(this._ttMin || 0)}</span><button data-act="ttnow">Jetzt</button><div class="ttx" data-act="tt" title="Schlie\u00dfen"><ha-icon icon="mdi:close"></ha-icon></div></div>`
        : `<div class="ttbtn" data-act="tt" title="Zeitreise"><ha-icon icon="mdi:history"></ha-icon></div>`)
      : '';
    const extraH = (hdr ? 64 : 0) + (infoOn ? 46 : 0) + (tabsHtml ? 40 : 0);
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        ha-card { display: block; padding: 8px; position: relative; }
        ha-card.hasfs, ha-card.haszm { padding-bottom: 42px; }
        ha-card.hasfs.fs, ha-card.haszm.fs { padding-bottom: 0; }
        .wrap.zm { overflow: hidden; touch-action: pan-y; }
        .wrap.zm.zoomed { touch-action: none; cursor: grab; }
        .wrap.zm.zoomed.drag { cursor: grabbing; }
        .zi { position: relative; transform-origin: 0 0; }
        .zbtns { position: absolute; right: 46px; bottom: 5px; z-index: 3; display: flex; gap: 4px; }
        .zbtns.nofs { right: 8px; }
        .zb { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: rgba(127, 127, 127, 0.15); opacity: 0.6; user-select: none; }
        .zb:hover { opacity: 1; background: rgba(127, 127, 127, 0.3); }
        .zb ha-icon { position: static; transform: none; --mdc-icon-size: 22px; pointer-events: none; }
        .zb.zr { display: none; }
        .zbtns.zoomed .zb.zr { display: flex; }
        .wrap { position: relative; container-type: inline-size; margin: 0 auto; }
        .hdr { padding: 2px 8px 8px; line-height: 1.25; display: flex; justify-content: space-between; align-items: flex-start; gap: 8px 16px; flex-wrap: wrap; }
        .hs { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; margin-left: auto; }
        .sp { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px 4px 8px; border-radius: 20px; font-size: 13px; color: var(--primary-text-color); background: rgba(127, 127, 127, 0.15); border: 1px solid transparent; cursor: pointer; white-space: nowrap; }
        .sp ha-icon { position: static; transform: none; --mdc-icon-size: 20px; color: var(--sc); pointer-events: none; }
        .sp.open, .sp.alert { background: color-mix(in srgb, var(--sc) 16%, transparent); border-color: var(--sc); }
        .sp.alert { animation: vaw-pulse 1s ease-in-out infinite; }
        .sp.unknown { opacity: 0.6; }
        g.stc, g.stb { cursor: pointer; }
        .spw { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; margin-left: 2px; border-radius: 50%; background: rgba(127, 127, 127, 0.28); cursor: pointer; }
        .spw:hover { background: var(--sc, rgba(127, 127, 127, 0.5)); }
        .spw ha-icon { --mdc-icon-size: 15px; color: var(--primary-text-color); position: static; transform: none; pointer-events: none; }
        g.stc.alert, g.stb.alert { animation: vaw-pulse 1s ease-in-out infinite; }
        g.stc [id^="stk_"] { transition: stroke 0.4s; }
        .hdr .t { font-size: 18px; font-weight: 600; color: var(--primary-text-color); }
        .hdr .dt { font-size: 13px; color: var(--secondary-text-color); }
        ha-card.fs.hasx { flex-direction: column; }
        ha-card.fs.hasx .hdr { align-self: stretch; padding: 10px 16px 4px; }
        ha-card.fs.hasx .wrap { width: min(100vw, calc((100vh - var(--extra)) * var(--ar))); }
        .info { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 44px 0 8px; }
        ha-card.fs .info { align-self: flex-start; padding: 6px 16px 10px; }
        .chip { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 14px; font-size: 12.5px; background: rgba(127, 127, 127, 0.15); color: var(--primary-text-color); white-space: nowrap; }
        .chip[data-e] { cursor: pointer; }
        .chip ha-icon { position: static; transform: none; --mdc-icon-size: 16px; pointer-events: none; color: var(--secondary-text-color); }
        .chip .dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; }
        ha-card.grad g.node > [id^="c_"] { filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)); }
        ha-card.glow g.node.on > [id^="c_"] { filter: drop-shadow(0 0 6px var(--gc)); }
        g.node.pulse > [id^="c_"] { animation: vaw-glow 2.6s ease-in-out infinite; }
        @keyframes vaw-glow { 0%, 100% { filter: drop-shadow(0 0 2px var(--gc)); } 50% { filter: drop-shadow(0 0 11px var(--gc)); } }
        text.lim { fill: var(--vaw-lim, #e53935) !important; }
        .wrap { transition: opacity 0.8s; }
        ha-card.calm .wrap { opacity: var(--calm-dim, 0.75); }
        ha-card.calm g.node > [id^="c_"], ha-card.calm g.node.on > [id^="c_"], ha-card.calm g.node.pulse > [id^="c_"] { filter: none; animation: none; }
        g.sw { cursor: pointer; }
        g.sw .swb { fill: var(--card-background-color, #1c1c1c); stroke: var(--secondary-text-color); stroke-width: 2; transition: fill 0.25s, stroke 0.25s; }
        g.sw .swi { fill: none; stroke: var(--secondary-text-color); stroke-width: 2; stroke-linecap: round; transition: stroke 0.25s; }
        g.sw.on .swb { fill: var(--sc); stroke: var(--sc); }
        g.sw.on .swi { stroke: var(--card-background-color, #1c1c1c); }
        g.sw:hover .swb { stroke: var(--sc); }
        g.sw.un { opacity: 0.35; cursor: default; }
        ha-card.tap g.node, ha-card.tap g.kid { cursor: pointer; }
        [id^="cg_"], [id^="kr_"] { transition: stroke-dasharray 0.8s linear, stroke 0.4s; }
        ${OPT.ns !== 1 ? 'g.node .p { transform: scale(var(--ns)); }' : ''}
        .fsbtn { position: absolute; right: 8px; bottom: 5px; z-index: 3; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: rgba(127, 127, 127, 0.18); color: var(--secondary-text-color); opacity: 0.7; transition: opacity 0.2s, background 0.2s; -webkit-tap-highlight-color: transparent; }
        .fsbtn:hover { opacity: 1; background: rgba(127, 127, 127, 0.3); }
        .fsbtn ha-icon { position: static; transform: none; --mdc-icon-size: 22px; pointer-events: none; }
        ha-card.fs { position: fixed; inset: 0; z-index: 9999; width: 100vw; height: 100vh; border-radius: 0; padding: 0; display: flex; align-items: center; justify-content: center; overflow: auto; background: var(--card-background-color, #111); }
        ha-card.fs .wrap { width: min(100vw, calc(100vh * var(--ar))); }
        ha-card.fs.haszm { overflow: hidden; }
        ha-card.fs .wrap.zm { overflow: visible; }
        ha-card.fs .hdr, ha-card.fs .info { position: relative; z-index: 2; }
        svg { width: 100%; height: auto; display: block; }
        ha-icon { position: absolute; transform: translate(-50%, -50%); --mdc-icon-size: 20px; pointer-events: none; }
        text { text-anchor: middle; fill: var(--primary-text-color); font-family: var(--paper-font-body1_-_font-family, sans-serif); }
        .p { font-weight: 600; }
        .s { fill: var(--secondary-text-color); }
        .n { font-size: 13px; fill: var(--secondary-text-color); }
        .n, .sec { paint-order: stroke; stroke: var(--card-background-color, #1c1c1c); stroke-width: 4px; stroke-linejoin: round; }
        .sec { font-size: 11px; fill: var(--secondary-text-color); opacity: 0.85; }
        g.node, ha-icon { transition: opacity 0.4s; }
        [id^="hs_"] { transition: stroke-dasharray 0.8s linear, stroke-dashoffset 0.8s linear; }
        [id^="rg_"] { transition: stroke-dasharray 0.8s linear, stroke 0.4s; }
        @keyframes vaw-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .alert { animation: vaw-pulse 1s ease-in-out infinite; }
        ha-card.bgd { isolation: isolate; }
        .bgl { position: absolute; inset: 0; z-index: -1; border-radius: inherit; overflow: hidden; pointer-events: none; }
        .bgl i, .bgl b { position: absolute; inset: 0; }
        .bgl i { background-size: cover; background-position: center; background-repeat: no-repeat; }
        .bgl.blur i { inset: -30px; }
        .bga { position: absolute; inset: 0; z-index: -1; border-radius: inherit; overflow: hidden; pointer-events: none; }
        .bga.drift { background: radial-gradient(55% 45% at 20% 25%, rgba(110, 130, 255, 0.22), transparent 70%), radial-gradient(50% 55% at 80% 75%, rgba(0, 220, 170, 0.18), transparent 70%), radial-gradient(45% 40% at 70% 20%, rgba(255, 120, 200, 0.14), transparent 70%); background-size: 180% 180%; animation: vaw-drift 32s ease-in-out infinite alternate; }
        @keyframes vaw-drift { 0% { background-position: 0% 0%; } 100% { background-position: 100% 100%; } }
        .bga.stars i { position: absolute; border-radius: 50%; background: #fff; opacity: 0.15; animation: vaw-tw 4s ease-in-out infinite; }
        .bga.stars.dk i { background: #334155; }
        @keyframes vaw-tw { 0%, 100% { opacity: 0.1; transform: scale(0.8); } 50% { opacity: 0.95; transform: scale(1.25); } }
        ha-card.lc-square path[id^="l_"] { stroke-linejoin: miter; stroke-miterlimit: 10; }
        ha-card.ls-dashed path[id^="l_"] { stroke-dasharray: 9 7; }
        ha-card.ls-dotted path[id^="l_"] { stroke-dasharray: 0.1 7; stroke-linecap: round; }
        ha-card.ls-flow path[id^="l_"] { stroke-dasharray: 10 8; }
        ha-card.ls-flow path[id^="l_"].on { animation: vaw-dash 0.9s linear infinite; }
        ha-card.ls-flow path[id^="l_"].on.rev { animation-direction: reverse; }
        @keyframes vaw-dash { to { stroke-dashoffset: -18; } }
        ha-card.ls-neon path[id^="l_"].on { filter: drop-shadow(0 0 3px currentColor) drop-shadow(0 0 7px currentColor); }
        ha-card.calm path[id^="l_"] { animation: none !important; filter: none !important; }
        @media (prefers-reduced-motion: reduce) { ha-card.ls-flow path[id^="l_"].on { animation: none; } }
        ha-card.calm .bga, ha-card.calm .bga i, ha-card.calm .bgw i, ha-card.calm .bgw b { animation-play-state: paused; }
        .bgw { position: absolute; inset: 0; z-index: -1; border-radius: inherit; overflow: hidden; pointer-events: none; }
        .bgw i, .bgw b { position: absolute; display: block; }
        .bgw i.r { top: -12%; width: 1.6px; background: linear-gradient(transparent, rgba(190, 215, 255, 0.95)); animation: vaw-rain 0.9s linear infinite; }
        .bgw.dk i.r { background: linear-gradient(transparent, rgba(60, 100, 170, 0.75)); }
        .bgw.hail i.r { width: 3px; height: 3px !important; border-radius: 50%; background: #fff; }
        @keyframes vaw-rain { to { top: 108%; transform: translateX(-10px); } }
        .bgw i.s { top: -5%; border-radius: 50%; background: #fff; opacity: 0.8; animation: vaw-snow 10s linear infinite; }
        .bgw.dk i.s { background: #8fa3b8; }
        @keyframes vaw-snow { to { top: 105%; transform: translateX(var(--dx, 0px)); } }
        .bgw i.c { top: var(--t); left: -80%; width: var(--w); height: 38%; border-radius: 50%; background: radial-gradient(closest-side, rgba(255, 255, 255, 0.17), transparent); filter: blur(6px); animation: vaw-cloud 90s linear infinite; }
        .bgw.dk i.c { background: radial-gradient(closest-side, rgba(70, 90, 120, 0.2), transparent); }
        @keyframes vaw-cloud { to { left: 105%; } }
        .bgw i.f { left: -20%; width: 140%; height: 45%; background: linear-gradient(90deg, transparent, rgba(200, 210, 225, 0.2), transparent); filter: blur(10px); animation: vaw-fog 28s ease-in-out infinite alternate; }
        .bgw.dk i.f { background: linear-gradient(90deg, transparent, rgba(110, 125, 145, 0.25), transparent); }
        @keyframes vaw-fog { from { transform: translateX(-12%); } to { transform: translateX(12%); } }
        .bgw i.sn { right: -25%; top: -45%; width: 80%; height: 130%; background: radial-gradient(closest-side, rgba(255, 205, 90, 0.32), transparent); animation: vaw-sun 9s ease-in-out infinite alternate; }
        @keyframes vaw-sun { from { opacity: 0.55; transform: scale(0.95); } to { opacity: 1; transform: scale(1.05); } }
        .bgw i.wd { top: var(--t); left: -140px; width: var(--w); height: 2px; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent); animation: vaw-wind var(--d) linear infinite; }
        .bgw.dk i.wd { background: linear-gradient(90deg, transparent, rgba(60, 80, 110, 0.5), transparent); }
        @keyframes vaw-wind { to { left: 110%; } }
        .bgw i.sr { right: -45%; top: -95%; width: 130%; aspect-ratio: 1 / 1; background: repeating-conic-gradient(rgba(255, 215, 110, 0.16) 0deg 5deg, transparent 5deg 16deg); -webkit-mask-image: radial-gradient(closest-side, #000 15%, transparent 90%); mask-image: radial-gradient(closest-side, #000 15%, transparent 90%); animation: vaw-rays 120s linear infinite; }
        @keyframes vaw-rays { to { transform: rotate(360deg); } }
        .bgw i.rb { left: 50%; top: 14%; width: 92%; aspect-ratio: 2 / 1; transform: translateX(-50%); border-radius: 100% 100% 0 0; background: radial-gradient(circle at 50% 100%, transparent 56%, rgba(255, 60, 60, 0.26) 58%, rgba(255, 160, 0, 0.26) 61%, rgba(255, 235, 0, 0.24) 64%, rgba(60, 200, 60, 0.24) 67%, rgba(40, 130, 255, 0.26) 70%, rgba(140, 60, 220, 0.26) 73%, transparent 75%); animation: vaw-rb 5s ease both; }
        @keyframes vaw-rb { from { opacity: 0; } to { opacity: 1; } }
        .bgw b.bolt { top: 4%; left: var(--l); width: 56px; height: 60%; background: #fff; clip-path: polygon(58% 0, 18% 50%, 46% 50%, 28% 100%, 84% 38%, 54% 38%, 74% 0); opacity: 0; filter: drop-shadow(0 0 10px #cfe3ff); animation: vaw-bolt 8s infinite; }
        @keyframes vaw-bolt { 0%, 91.5%, 100% { opacity: 0; } 92% { opacity: 0.95; } 93.2% { opacity: 0; } 94% { opacity: 0.75; } 96% { opacity: 0; } }
        .bgw b.fl { inset: 0; background: #fff; opacity: 0; animation: vaw-fl 8s infinite; }
        @keyframes vaw-fl { 0%, 91%, 100% { opacity: 0; } 92% { opacity: 0.5; } 93% { opacity: 0.05; } 94% { opacity: 0.38; } 97% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .bgw i, .bgw b { animation: none; } }
        @media (prefers-reduced-motion: reduce) { .bga, .bga i { animation: none; } }
        ha-card.cs-flat g.node > [id^="c_"], ha-card.cs-flat.glow g.node.on > [id^="c_"] { filter: none; }
        ha-card.cs-flat g.node.pulse > [id^="c_"] { animation: none; }
        ha-card.cs-flat svg [fill^="url"] { display: none; }
        ha-card.cs-glass svg > [fill^="var("]:not([id]) { fill: color-mix(in srgb, var(--card-background-color, #1c1c1c) 38%, transparent); }
        ha-card.cs-glass g.node > [id^="c_"], ha-card.cs-glass [id^="kc_"] { fill: color-mix(in srgb, var(--card-background-color, #1c1c1c) 38%, transparent); stroke-width: 2.5; }
        ha-card.cs-glass g.node > [id^="c_"] { filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.28)); }
        ha-card.cs-neon g.node > [id^="c_"] { stroke-width: 2.5; filter: none; }
        ha-card.cs-neon g.node.on > [id^="c_"] { filter: drop-shadow(0 0 4px var(--gc)) drop-shadow(0 0 11px var(--gc)); }
        ha-card.cs-neon svg [fill^="url"] { display: none; }
        .tabs { display: flex; gap: 6px; padding: 2px 4px 8px; overflow-x: auto; scrollbar-width: none; position: relative; z-index: 2; }
        .tabs::-webkit-scrollbar { display: none; }
        .tab { display: inline-flex; align-items: center; gap: 5px; border: 0; border-radius: 16px; padding: 5px 13px; font: inherit; font-size: 13px; color: var(--primary-text-color); background: rgba(127, 127, 127, 0.18); cursor: pointer; white-space: nowrap; --mdc-icon-size: 16px; }
        .tab.on { background: var(--primary-color, #03a9f4); color: #fff; }
        .tab ha-icon { --mdc-icon-size: 16px; }
        ha-card.hastt { padding-bottom: 42px; }
        ha-card.hastt.fs { padding-bottom: 0; }
        ha-card.tton { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: -2px; }
        ha-card.hasla .ttbtn { right: 44px; }
        ha-card.hasla .hdr, ha-card.hastb .hdr { padding-right: 44px; }
        ha-card.hasla.hastb .hdr { padding-right: 80px; }
        .ttbtn { position: absolute; right: 8px; top: 8px; z-index: 6; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(127, 127, 127, 0.22); color: var(--primary-text-color); cursor: pointer; --mdc-icon-size: 18px; }
        .ttbar { position: absolute; left: 8px; right: 92px; bottom: 6px; z-index: 6; display: flex; align-items: center; gap: 8px; padding: 4px 8px; border-radius: 16px; background: var(--card-background-color, #1c1c1c); border: 1px solid rgba(127, 127, 127, 0.45); font-size: 12px; color: var(--primary-text-color); }
        .ttbar .tts { flex: 1; min-width: 60px; accent-color: var(--primary-color, #03a9f4); }
        .ttbar .ttl { white-space: nowrap; opacity: 0.85; }
        .ttbar button { border: 0; border-radius: 12px; padding: 4px 10px; background: var(--primary-color, #03a9f4); color: #fff; cursor: pointer; font: inherit; }
        .ttx { cursor: pointer; display: flex; --mdc-icon-size: 18px; }
        .tab ha-icon, .labtn ha-icon, .ttbtn ha-icon, .ttx ha-icon { position: static; transform: none; pointer-events: none; }
        .zf { transition: opacity 0.3s; }
        .ll { font-size: 10px; font-weight: 600; fill: var(--primary-text-color); paint-order: stroke; stroke: var(--card-background-color, #1c1c1c); stroke-width: 3.5px; stroke-linejoin: round; pointer-events: none; }
        .ci { position: absolute; transform: translate(-50%, -50%); width: var(--mdc-icon-size, 20px); height: var(--mdc-icon-size, 20px); object-fit: contain; pointer-events: none; display: block; transition: opacity 0.4s; }
        .ci.inl { position: static; transform: none; display: inline-block; flex: none; width: 18px; height: 18px; }
        .ci.tint { background: currentColor; -webkit-mask-size: contain; mask-size: contain; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-position: center; mask-position: center; }
        .labtn { position: absolute; top: 8px; right: 8px; z-index: 6; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(127, 127, 127, 0.22); color: var(--primary-text-color); cursor: pointer; --mdc-icon-size: 18px; }
        .labtn.on { background: var(--primary-color, #03a9f4); color: #fff; }
        .labar { position: absolute; left: 8px; right: 8px; bottom: 8px; z-index: 6; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; padding: 8px 10px; border-radius: 12px; background: var(--card-background-color, #1c1c1c); border: 1px solid rgba(127, 127, 127, 0.45); font-size: 13px; color: var(--primary-text-color); }
        .labar span { flex: 1; opacity: 0.8; }
        .labar button { border: 0; border-radius: 14px; padding: 6px 12px; background: var(--primary-color, #03a9f4); color: #fff; cursor: pointer; font: inherit; }
        .lat { position: absolute; left: 8px; right: 8px; bottom: 62px; z-index: 6; height: 96px; font: 12px monospace; padding: 6px; border-radius: 8px; border: 1px solid rgba(127, 127, 127, 0.5); background: var(--card-background-color, #1c1c1c); color: var(--primary-text-color); resize: none; }
        ha-card.la g.node, ha-card.la g.stc, ha-card.la g.kid { cursor: move; }
        ha-card.la g.sw { pointer-events: none; }
        ha-card.la .wrap { touch-action: none; }
        ha-card.la g.node > [id^="c_"] { stroke-dasharray: 7 5; }
        ha-card.la .bga, ha-card.la .bga i, ha-card.la .bgw i, ha-card.la .bgw b { animation: none !important; }
        ha-card.compact { padding: 4px; }
        ha-card.compact.hasfs, ha-card.compact.haszm { padding-bottom: 38px; }
        ha-card.compact .hdr { padding: 0 4px 4px; }
        ha-card.compact .hdr .t { font-size: 15px; }
        ha-card.compact .hdr .dt, ha-card.compact .sec, ha-card.compact .zbtns { display: none; }
        ha-card.compact .n { font-size: 15px; }
        ha-card.compact g.node .p, ha-card.compact g.kid .p { transform: scale(calc(var(--ns, 1) * 1.12)); }
        ha-card.compact .info { padding: 4px 40px 0 4px; gap: 4px; }
        ha-card.compact .chip { font-size: 11.5px; padding: 2px 8px; }
        ha-card.compact .sp { font-size: 12px; padding: 3px 9px 3px 6px; }
      </style>
      <ha-card class="${c.fullscreen_button === false ? '' : 'hasfs'}${OPT.zoom ? ' haszm' : ''}${hdr || infoOn ? ' hasx' : ''}${this._la ? ' la' : ''}${c.layout_assistant === true ? ' hasla' : ''}${c.time_travel === true ? ' hastb' : ''}${c.time_travel === true && this._ttOn ? ' hastt' : ''}${this._ttOn ? ' tton' : ''}${OPT.grad ? ' grad' : ''}${OPT.glow ? ' glow' : ''}${OPT.tap ? ' tap' : ''}" style="--ar:${(VW / VH).toFixed(4)};--extra:${extraH}px;--ns:${OPT.ns};--vaw-lim:${this._lim.color};--calm-dim:${c.calm && c.calm.dim !== undefined && !isNaN(Number(c.calm.dim)) ? Math.max(0.2, Math.min(1, Number(c.calm.dim))) : 0.75}">
        ${hdr}
        ${tabsHtml}
        <div class="wrap${OPT.zoom ? ' zm' : ''}">
          <div class="zi">
            <svg viewBox="0 0 ${VW} ${VH}">${defsSvg}${gridSvg}${frameSvg}${paths}${dots}${circles}${kidSvg}${llSvg}${stSvg}${swSvg}${stbSvg}${guideSvg}</svg>
            ${icons}${stIcons}${stbIcons}
          </div>
        </div>
        ${OPT.zoom ? `<div class="zbtns${c.fullscreen_button === false ? ' nofs' : ''}"><div class="zb zr" data-z="r" title="Zoom zur\u00fccksetzen"><ha-icon icon="mdi:fit-to-screen-outline"></ha-icon></div><div class="zb" data-z="-" title="Verkleinern"><ha-icon icon="mdi:magnify-minus-outline"></ha-icon></div><div class="zb" data-z="+" title="Vergr\u00f6\u00dfern"><ha-icon icon="mdi:magnify-plus-outline"></ha-icon></div></div>` : ''}
        ${infoOn ? '<div class="info"></div>' : ''}
        ${c.fullscreen_button === false ? '' : '<div class="fsbtn" title="Vollbild"><ha-icon icon="mdi:fullscreen"></ha-icon></div>'}
        ${laHtml}
        ${ttHtml}
      </ha-card>`;
    this._applyBg();
    this._applyLook();
    this._iconFix(this.shadowRoot);
    this._links.forEach((l) => {
      if (!l._ll) return;
      const p = this.shadowRoot.getElementById('l_' + l.id);
      const t = this.shadowRoot.getElementById('ll_' + l.id);
      if (p && t && p.getTotalLength) {
        try {
          const q = p.getPointAtLength(p.getTotalLength() * 0.5);
          t.setAttribute('x', q.x.toFixed(1));
          t.setAttribute('y', (q.y - 5).toFixed(1));
        } catch (er) { /* ohne Label-Position */ }
      }
    });
    this._spDirty = true;
    // Skalierung der Zahlen um den eigenen Mittelpunkt (Ursprung in Nutzereinheiten, funktioniert auch in Safari)
    this.shadowRoot.querySelectorAll('svg text.p').forEach((t) => {
      const x = t.getAttribute('x');
      const y = t.getAttribute('y');
      if (x !== null && y !== null) t.style.transformOrigin = x + 'px ' + y + 'px';
    });
    const sr0 = this.shadowRoot;
    sr0.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => {
      this._vi = Number(b.getAttribute('data-vi')) || 0;
      try { localStorage.setItem('flow-card-vaw-view:' + this._viewList().map((v) => v.name).join('|'), String(this._vi)); } catch (e) { /* ignorieren */ }
      if (this._z) { this._z.s = 1; this._z.x = 0; this._z.y = 0; }
      this._applyCfg();
    }));
    const taEl = sr0.querySelector('.lat');
    if (taEl) {
      taEl.focus();
      taEl.select();
    }
    if (!this._laInit) {
      this._laInit = true;
      const pt = (e) => {
        const svg = sr0.querySelector('svg');
        const m = svg && svg.getScreenCTM();
        if (!m) return null;
        const p = svg.createSVGPoint();
        p.x = e.clientX;
        p.y = e.clientY;
        const q = p.matrixTransform(m.inverse());
        return [q.x, q.y];
      };
      this._laMv = (e) => {
        const d = this._drag;
        if (!d) return;
        const p = pt(e);
        if (!p) return;
        const cl = (v) => Math.max(-2000, Math.min(2000, Math.round(v)));
        let nx = d.ox + p[0] - d.sx;
        let ny = d.oy + p[1] - d.sy;
        this._guides = [];
        if (d.bx !== null && d.bx !== undefined) {
          // Raster (10) und Einrasten an der Mitte anderer Kreise mit Hilfslinien
          let ax = d.bx + nx;
          let ay = d.by + ny;
          if (this._laGrid !== false) {
            ax = Math.round(ax / 10) * 10;
            ay = Math.round(ay / 10) * 10;
          }
          const others = Object.keys(this._abs || {}).filter((k) => k !== d.key).map((k) => this._abs[k]);
          let gx = null;
          let gy = null;
          others.forEach((o) => {
            if (Math.abs(ax - o.x) <= 6 && (gx === null || Math.abs(ax - o.x) < Math.abs(ax - gx.x))) gx = o;
            if (Math.abs(ay - o.y) <= 6 && (gy === null || Math.abs(ay - o.y) < Math.abs(ay - gy.y))) gy = o;
          });
          if (gx) ax = gx.x;
          if (gy) ay = gy.y;
          if (gx) this._guides.push([ax, Math.min(ay, gx.y) - 20, ax, Math.max(ay, gx.y) + 20]);
          if (gy) this._guides.push([Math.min(ax, gy.x) - 20, ay, Math.max(ax, gy.x) + 20, ay]);
          nx = ax - d.bx;
          ny = ay - d.by;
        }
        // Status-Kreise: nie ueber den oberen Rand hinaus (sonst abgeschnitten)
        const abD = this._abs && this._abs[d.key];
        if (abD && d.key.indexOf('st_') === 0 && d.by !== null && d.by !== undefined && d.by + ny < abD.r + 4) ny = abD.r + 4 - d.by;
        this._pos[d.key] = { x: cl(nx), y: cl(ny) };
        if (!this._laRaf) this._laRaf = requestAnimationFrame(() => { this._laRaf = 0; this._render(); });
      };
      this._laUp = () => {
        window.removeEventListener('pointermove', this._laMv);
        window.removeEventListener('pointerup', this._laUp);
        window.removeEventListener('pointercancel', this._laUp);
        this._drag = null;
        this._guides = [];
        this._posSave();
        this._render();
      };
      sr0.addEventListener('pointerdown', (e) => {
        if (!this._la) return;
        const g = e.target.closest ? e.target.closest('g.node, g.stc, g.kid') : null;
        if (!g || !g.id || (g.id.indexOf('g_') !== 0 && g.id.indexOf('stc_') !== 0 && g.id.indexOf('kg_') !== 0)) return;
        e.stopPropagation();
        e.preventDefault();
        const p = pt(e);
        if (!p) return;
        const key = g.id.indexOf('stc_') === 0 ? 'st_' + g.id.slice(4) : g.id.indexOf('kg_') === 0 ? g.id.slice(3) : g.id.slice(2);
        const cur = (this._pos && this._pos[key]) || {};
        this._pos = this._pos || {};
        const ab = (this._abs && this._abs[key]) || null;
        this._drag = { key, sx: p[0], sy: p[1], ox: Number(cur.x) || 0, oy: Number(cur.y) || 0, bx: ab ? ab.x - (Number(cur.x) || 0) : null, by: ab ? ab.y - (Number(cur.y) || 0) : null };
        window.addEventListener('pointermove', this._laMv);
        window.addEventListener('pointerup', this._laUp);
        window.addEventListener('pointercancel', this._laUp);
      }, true);
      sr0.addEventListener('input', (e) => {
        const t = e.target;
        if (!t || !t.classList || !t.classList.contains('tts')) return;
        const back = Math.max(0, Number(t.max) - Number(t.value));
        const lb = sr0.querySelector('.ttl');
        if (lb) lb.textContent = this._ttLabel(back);
        this._ttGo(back);
      });
      sr0.addEventListener('click', (e) => {
        const b = e.target.closest ? e.target.closest('[data-act]') : null;
        if (b) {
          e.stopPropagation();
          const a = b.getAttribute('data-act');
          if (a === 'la') {
            this._la = !this._la;
            this._laTxt = false;
          } else if (a === 'tt') {
            this._ttOn = !this._ttOn;
            this._ttMin = 0;
            this._ttSeq = (this._ttSeq || 0) + 1;
            if (!this._ttOn) {
              this._ttOver = null;
              if (this._realHass) this._hass = this._realHass;
            }
          } else if (a === 'ttnow') {
            this._ttMin = 0;
            this._ttSeq = (this._ttSeq || 0) + 1;
            this._ttOver = null;
            if (this._realHass) this._hass = this._realHass;
          } else if (a === 'ladone') {
            this._la = false;
            this._laTxt = false;
          } else if (a === 'lagrid') {
            this._laGrid = this._laGrid === false;
          } else if (a === 'laflip') {
            this._posCopyOther();
          } else if (a === 'lareset') {
            this._posSave(true);
            this._applyCfg();
          } else if (a === 'lacopy') {
            this._laTxt = true;
            try { navigator.clipboard.writeText(this._laYamlText()); } catch (er) { /* Textfeld zum Kopieren wird angezeigt */ }
          }
          this._render();
        } else if (this._la && e.target.closest && e.target.closest('g.node, g.stc, g.kid')) {
          e.stopPropagation();
        }
      }, true);
    }
    const fsb = this.shadowRoot.querySelector('.fsbtn');
    if (fsb) fsb.addEventListener('click', () => this._toggleFs());
    // Antippen: \u00f6ffnet den Verlauf (more-info) des passenden Sensors
    const svgEl = this.shadowRoot.querySelector('svg');
    if (svgEl) {
      svgEl.addEventListener('click', (e) => {
        const sw = e.target.closest ? e.target.closest('g.sw') : null;
        if (sw) {
          e.stopPropagation();
          this._toggleSw(sw.getAttribute('data-sw'));
          return;
        }
        const sg = e.target.closest ? e.target.closest('g.stc, g.stb') : null;
        if (sg) {
          e.stopPropagation();
          this._stClick(sg.getAttribute('data-st'));
          return;
        }
        if (!OPT.tap) return;
        const g = e.target.closest ? e.target.closest('g.node, g.kid') : null;
        if (!g) return;
        let ent = null;
        if (g.classList.contains('node')) {
          const idx = Array.prototype.indexOf.call(svgEl.querySelectorAll('g.node'), g);
          const nd = this._nodes[idx];
          if (nd) ent = this._tapEntity(nd.cfg);
        } else {
          const kid = (this._kids || []).find((k) => 'kg_' + k.id === g.id);
          if (kid) ent = this._tapEntity(kid.o);
        }
        if (ent) this._moreInfo(ent);
      });
    }
    const infoEl0 = this.shadowRoot.querySelector('.info');
    if (infoEl0) {
      infoEl0.addEventListener('click', (e) => {
        const sw0 = e.target.closest ? e.target.closest('[data-stsw]') : null;
        if (sw0) return this._stSwClick(sw0.getAttribute('data-stsw'));
        const st0 = e.target.closest ? e.target.closest('[data-st]') : null;
        if (st0) return this._stClick(st0.getAttribute('data-st'));
        const ch = e.target.closest ? e.target.closest('[data-e]') : null;
        if (ch && OPT.tap) this._moreInfo(ch.getAttribute('data-e'));
      });
    }
    const hsEl0 = this.shadowRoot.querySelector('.hs');
    if (hsEl0) {
      hsEl0.addEventListener('click', (e) => {
        const sw1 = e.target.closest ? e.target.closest('[data-stsw]') : null;
        if (sw1) return this._stSwClick(sw1.getAttribute('data-stsw'));
        const sp = e.target.closest ? e.target.closest('[data-st]') : null;
        if (sp) this._stClick(sp.getAttribute('data-st'));
      });
    }
    this._setupZoom(OPT);
    this._applyFs();
    if (this._hass) this._update();
  }

  // Zoomen und Verschieben (Mausrad mit Strg, Pinch, Ziehen, Kn\u00f6pfe)
  _setupZoom(OPT) {
    const sr = this.shadowRoot;
    const wrap = sr.querySelector('.wrap');
    const zi = sr.querySelector('.zi');
    const zb = sr.querySelector('.zbtns');
    if (!OPT.zoom || !wrap || !zi) return;
    const Z = this._z || (this._z = { s: 1, x: 0, y: 0 });
    const apply = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      Z.s = Math.max(1, Math.min(OPT.zmax, Z.s));
      Z.x = Math.max(w * (1 - Z.s), Math.min(0, Z.x));
      Z.y = Math.max(h * (1 - Z.s), Math.min(0, Z.y));
      if (Z.s <= 1.001) { Z.s = 1; Z.x = 0; Z.y = 0; }
      zi.style.transform = Z.s === 1 ? '' : `translate(${Z.x}px, ${Z.y}px) scale(${Z.s})`;
      wrap.classList.toggle('zoomed', Z.s > 1);
      if (zb) zb.classList.toggle('zoomed', Z.s > 1);
    };
    this._zApply = apply;
    // um einen Punkt (px, py relativ zum Rahmen) auf Faktor ns zoomen
    const zoomAt = (px, py, ns) => {
      ns = Math.max(1, Math.min(OPT.zmax, ns));
      const cx = (px - Z.x) / Z.s;
      const cy = (py - Z.y) / Z.s;
      Z.s = ns;
      Z.x = px - cx * ns;
      Z.y = py - cy * ns;
      apply();
    };
    const rel = (e) => {
      const r = wrap.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    wrap.addEventListener('wheel', (e) => {
      if (!(e.ctrlKey || e.metaKey || this._fs || Z.s > 1)) return;
      e.preventDefault();
      const [px, py] = rel(e);
      zoomAt(px, py, Z.s * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018)));
    }, { passive: false });
    // Zeiger: 1 Finger/Maus = verschieben (nur wenn gezoomt), 2 Finger = Pinch
    const P = new Map();
    let moved = false;
    let g = null;
    const mid = () => {
      const a = [...P.values()];
      return a.length > 1 ? [(a[0][0] + a[1][0]) / 2, (a[0][1] + a[1][1]) / 2, Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1])] : [a[0][0], a[0][1], 0];
    };
    wrap.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button > 0) return;
      const r = wrap.getBoundingClientRect();
      P.set(e.pointerId, [e.clientX - r.left, e.clientY - r.top]);
      const m = mid();
      g = { x0: m[0], y0: m[1], d0: m[2], s0: Z.s, ox: Z.x, oy: Z.y, n: P.size, start: [m[0], m[1]] };
      moved = false;
    });
    wrap.addEventListener('pointermove', (e) => {
      if (!P.has(e.pointerId) || !g) return;
      const r = wrap.getBoundingClientRect();
      P.set(e.pointerId, [e.clientX - r.left, e.clientY - r.top]);
      if (P.size !== g.n) {
        const m0 = mid();
        g = { x0: m0[0], y0: m0[1], d0: m0[2], s0: Z.s, ox: Z.x, oy: Z.y, n: P.size, start: g.start };
        return;
      }
      const m = mid();
      if (P.size >= 2 && g.d0 > 0) {
        moved = true;
        const ns = Math.max(1, Math.min(OPT.zmax, g.s0 * (m[2] / g.d0)));
        const cx = (g.x0 - g.ox) / g.s0;
        const cy = (g.y0 - g.oy) / g.s0;
        Z.s = ns;
        Z.x = m[0] - cx * ns;
        Z.y = m[1] - cy * ns;
        apply();
      } else if (Z.s > 1) {
        if (!moved && Math.hypot(m[0] - g.start[0], m[1] - g.start[1]) < 6) return;
        if (!moved) { moved = true; wrap.classList.add('drag'); try { wrap.setPointerCapture(e.pointerId); } catch (x) { /* egal */ } }
        Z.x = g.ox + (m[0] - g.x0);
        Z.y = g.oy + (m[1] - g.y0);
        apply();
      }
    });
    const end = (e) => {
      P.delete(e.pointerId);
      if (!P.size) {
        wrap.classList.remove('drag');
        if (moved) { this._zSup = performance.now(); }
        g = null;
      } else if (g) {
        const m = mid();
        g = { x0: m[0], y0: m[1], d0: m[2], s0: Z.s, ox: Z.x, oy: Z.y, n: P.size, start: g.start };
      }
    };
    wrap.addEventListener('pointerup', end);
    wrap.addEventListener('pointercancel', end);
    // nach einem Ziehen/Pinch den Klick (Verlauf \u00f6ffnen, Schalten) unterdr\u00fccken
    wrap.addEventListener('click', (e) => {
      if (this._zSup && performance.now() - this._zSup < 400) {
        e.stopPropagation();
        e.preventDefault();
        this._zSup = 0;
      }
    }, true);
    if (zb) {
      zb.addEventListener('click', (e) => {
        const b = e.target.closest ? e.target.closest('[data-z]') : null;
        if (!b) return;
        const k = b.getAttribute('data-z');
        const cx = wrap.clientWidth / 2;
        const cy = wrap.clientHeight / 2;
        if (k === 'r') { Z.s = 1; apply(); } else zoomAt(cx, cy, Z.s * (k === '+' ? 1.5 : 1 / 1.5));
      });
    }
    apply();
  }

  _num(entity, kind) {
    if (!entity || !this._hass) return null;
    const st = this._hass.states[entity];
    if (!st) return null;
    let v = parseFloat(st.state);
    if (isNaN(v)) return null;
    const u = st.attributes.unit_of_measurement;
    if (kind === 'p' && u === 'kW') v *= 1000;
    if (kind === 'i' && u === 'mA') v /= 1000;
    return v;
  }

  _fmtP(w) {
    if (w === null) return '\u2013';
    return Math.abs(w) >= 1000 ? (w / 1000).toFixed(2) + ' kW' : Math.round(w) + ' W';
  }

  // Geschwindigkeit der Punkte (Dauer einer Runde in Sekunden): logarithmisch, damit auch kleine
  // Unterschiede bei kleinen Leistungen sichtbar sind. 5 W = langsam (7 s), speed_max_w = schnell (1.2 s)
  _lx(w) {
    const hi = Math.max(50, Number(this._c.speed_max_w) || 3000);
    const lo = 5;
    return Math.min(1, Math.log(Math.max(w, lo) / lo) / Math.log(hi / lo));
  }

  _dur(w) {
    return 7 - this._lx(w) * (7 - 1.2);
  }

  // Z\u00e4hlerstand in kWh (Wh/MWh werden umgerechnet), mit Tausenderpunkt wie in \u00d6sterreich
  _meter(entity, name, decimals) {
    const st = entity && this._hass ? this._hass.states[entity] : null;
    const v0 = st ? parseFloat(st.state) : NaN;
    if (isNaN(v0)) return `${name} \u2013 kWh`;
    const u = st.attributes.unit_of_measurement;
    const v = u === 'Wh' ? v0 / 1000 : u === 'MWh' ? v0 * 1000 : v0;
    const d = decimals !== undefined ? Number(decimals) : 1;
    return `${name} ${v.toLocaleString('de-AT', { minimumFractionDigits: d, maximumFractionDigits: d })} kWh`;
  }

  _kw(w, unit) {
    if (w === null || w === undefined) return unit ? '\u2013 kW' : '\u2013';
    return (w / 1000).toFixed(2) + (unit ? ' kW' : '');
  }

  _extra(spec) {
    const o = typeof spec === 'string' ? { entity: spec } : spec || {};
    const st = o.entity && this._hass ? this._hass.states[o.entity] : null;
    const pre = o.name ? o.name + ' ' : '';
    if (!st) return pre + '\u2013';
    const num = Number(st.state);
    let val = st.state;
    if (st.state !== '' && !isNaN(num)) val = o.decimals !== undefined ? num.toFixed(o.decimals) : String(Math.round(num * 10) / 10);
    const unit = o.unit !== undefined ? o.unit : st.attributes.unit_of_measurement || '';
    return pre + val + (unit ? ' ' + unit : '');
  }

  _clock(entity, kind) {
    const st = entity && this._hass ? this._hass.states[entity] : null;
    if (!st) return '\u2013';
    const v = String(st.state);
    if (v === 'unavailable' || v === 'unknown' || v === '') return '\u2013';
    const lang = (this._hass.locale && this._hass.locale.language) || this._hass.language || 'de';
    try {
      if (kind === 'date') {
        const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        const d = m ? new Date(+m[1], +m[2] - 1, +m[3]) : /^\d{4}-\d{2}-\d{2}[T ]/.test(v) ? new Date(v) : null;
        if (d && !isNaN(d)) return d.toLocaleDateString(lang, { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
      } else {
        const sec = this._c.time_seconds === true;
        const m = v.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
        if (m) return m[1].padStart(2, '0') + ':' + m[2] + (sec && m[3] ? ':' + m[3] : '');
        if (/^\d{4}-\d{2}-\d{2}[T ]/.test(v)) {
          const d = new Date(v);
          if (!isNaN(d)) return d.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit', ...(sec ? { second: '2-digit' } : {}) });
        }
      }
    } catch (e) { /* Rohwert anzeigen */ }
    return v;
  }

  // Ruhemodus aktiv? (immer / Sensor an / Zeitfenster / Systemeinstellung "Animationen reduzieren")
  _calm() {
    const k = this._c.calm;
    if (!k || typeof k !== 'object') return false;
    if (k.always === true) return true;
    if (k.follow_system === true && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    if (k.entity && this._hass) {
      const st = this._hass.states[k.entity];
      if (st && ['on', 'below_horizon', 'night', 'true'].includes(String(st.state))) return true;
    }
    if (k.from && k.to) {
      const mins = (t) => {
        const m = String(t).match(/^(\d{1,2}):(\d{2})/);
        return m ? +m[1] * 60 + +m[2] : null;
      };
      const a = mins(k.from);
      const b = mins(k.to);
      if (a !== null && b !== null && a !== b) {
        const d = new Date();
        const now = d.getHours() * 60 + d.getMinutes();
        return a < b ? now >= a && now < b : now >= a || now < b;
      }
    }
    return false;
  }

  // Schalter am Kreis: schaltet den Verbraucher (switch, light, input_boolean, ...)
  _toggleSw(key) {
    const it = (this._sw || []).find((x) => x.key === key);
    if (it) this._swCall(it.entity, it.confirm, it.name);
  }

  // Entit\u00e4t schalten: Schalter/Licht/... umschalten, Tor \u00f6ffnen/schlie\u00dfen, Schloss auf-/zusperren, Taste dr\u00fccken
  _swCall(entity, confirm, name) {
    if (!entity || !this._hass) return;
    const st = this._hass.states[entity];
    if (!st || st.state === 'unavailable') return;
    const dom = entity.split('.')[0];
    const v = String(st.state);
    const q = dom === 'lock' ? (v === 'locked' ? 'aufsperren?' : 'zusperren?') : dom === 'cover' ? (v === 'closed' ? '\u00f6ffnen?' : 'schlie\u00dfen?') : v === 'on' ? 'ausschalten?' : 'einschalten?';
    if (confirm && !window.confirm((name || entity) + ' ' + q)) return;
    let svc = ['homeassistant', 'toggle'];
    if (dom === 'button' || dom === 'input_button') svc = [dom, 'press'];
    else if (dom === 'scene' || dom === 'script') svc = [dom, 'turn_on'];
    else if (dom === 'cover') svc = ['cover', 'toggle'];
    else if (dom === 'lock') svc = ['lock', v === 'locked' ? 'unlock' : 'lock'];
    this._hass.callService(svc[0], svc[1], { entity_id: entity });
  }

  // Schalter-Entit\u00e4t eines Status-Eintrags (switch: true = der Sensor selbst, oder eine andere Entit\u00e4t)
  _stSwEnt(o, j) {
    if (j >= 0 && o.ents[j] && typeof o.ents[j].switch === 'string') return o.ents[j].switch;
    if (typeof o.switch === 'string') return o.switch;
    if (o.switch === true) {
      if (j >= 0) return o.ents[j] ? o.ents[j].entity : null;
      return o.ents.length === 1 ? o.ents[0].entity : null;
    }
    return null;
  }

  _esc(t) {
    return vawEsc(t);
  }

  // ---- Status (Garagentor, Fenster, T\u00fcren) ----
  _stKind(o) {
    if (o.kind && ST_ICONS[o.kind]) return o.kind;
    const e = o.ents[0].entity;
    const st = this._hass && this._hass.states[e];
    const dc = st && st.attributes ? st.attributes.device_class : '';
    if (e.startsWith('lock.')) return 'lock';
    if (dc === 'garage_door' || dc === 'garage') return 'garage';
    if (dc === 'window') return 'window';
    if (dc === 'smoke') return 'smoke';
    if (dc === 'gas') return 'gas';
    if (dc === 'carbon_monoxide') return 'co';
    if (dc === 'moisture') return 'water';
    if (dc === 'problem' || dc === 'safety' || dc === 'tamper') return 'problem';
    if (dc === 'motion') return 'motion';
    if (dc === 'occupancy' || dc === 'presence') return 'presence';
    if (dc === 'temperature') return 'temperature';
    if (dc === 'humidity') return 'humidity';
    return 'door';
  }

  // Farben einer Status-Gruppe: [ok/normal, aktiv/offen/Warnung, Alarm]
  _stCols(o) {
    const M = ST_META[this._stKind(o)] || {};
    return { alert: o.alert_color || '#e53935', open: o.open_color || o.warn_color || (M.act ? '#fbc02d' : '#fb8c00'), closed: o.closed_color || (M.num ? '#29b6f6' : M.act ? '#9e9e9e' : '#43a047') };
  }

  _stEnt(o, ent) {
    const st = this._hass && this._hass.states[ent.entity];
    const dom = ent.entity.split('.')[0];
    const nm0 = ent.name || (st && st.attributes.friendly_name) || ent.entity;
    if (!st || st.state === 'unavailable' || st.state === 'unknown') return { known: false, open: false, alert: false, label: '\u2013', cls: 'unknown', col: '#888', name: nm0 };
    const v = String(st.state);
    const kind = this._stKind(o);
    const M = ST_META[kind] || null;
    const ic = ST_ICONS[kind] || ST_ICONS.door;
    const C = this._stCols(o);
    // Zustandstexte erkennen (englisch und deutsch, z. B. Template-/ESPHome-Sensoren: "Ge\u00f6ffnet", "\u00d6ffnet", "Schlie\u00dft", "Geschlossen")
    const vl = v.trim().toLowerCase();
    const lst = (a) => (Array.isArray(a) ? a : a ? [a] : []).map((x) => String(x).trim().toLowerCase());
    // Messwerte (Temperatur, Luftfeuchtigkeit, beliebiger Sensor): Wert anzeigen, Schwellen warn_*/alert_* je Sensor oder je Gruppe
    if (M && M.num) {
      const T = (k) => (ent[k] !== undefined ? ent[k] : o[k]);
      const has = (x) => x !== undefined && x !== null && x !== '' && !isNaN(Number(x));
      const n = Number(v.replace(',', '.'));
      const isNum = v.trim() !== '' && !isNaN(n);
      const at = st.attributes || {};
      const unit = at.unit_of_measurement !== undefined ? at.unit_of_measurement : M.u || '';
      let level = 0;
      let txt = v;
      if (isNum) {
        let dec = has(T('decimals')) ? Number(T('decimals')) : M.dec !== undefined ? M.dec : Number.isInteger(n) ? 0 : 1;
        dec = Math.max(0, Math.min(6, dec));
        txt = n.toFixed(dec);
        if ((has(T('alert_above')) && n > Number(T('alert_above'))) || (has(T('alert_below')) && n < Number(T('alert_below')))) level = 2;
        else if ((has(T('warn_above')) && n > Number(T('warn_above'))) || (has(T('warn_below')) && n < Number(T('warn_below')))) level = 1;
      } else if (lst(T('alert_states')).includes(vl0(v))) level = 2;
      else if (lst(T('warn_states')).includes(vl0(v))) level = 1;
      const short = txt + (isNum && unit ? unit : '');
      const label = isNum && unit ? txt + ' ' + unit : txt;
      const cls = level === 2 ? 'alert' : level === 1 ? 'open' : 'closed';
      const col = level === 2 ? C.alert : level === 1 ? C.open : C.closed;
      const icon = ent.icon || o.icon || (kind === 'sensor' && at.icon) || ic[0];
      return { known: true, open: level > 0, alert: level === 2, num: true, label, short, cls, col, name: nm0, icon };
    }
    const W_OPEN = ['on', 'open', 'opened', 'true', 'unlocked', 'tilted', 'offen', 'ge\u00f6ffnet', 'geoeffnet', 'aufgesperrt', 'entriegelt', 'gekippt', 'auf', 'detected', 'alarm', 'wet', 'nass', 'rauch', 'problem', 'triggered', 'ausgel\u00f6st', 'motion', 'bewegung', 'occupied', 'belegt', 'anwesend', 'home', 'an', 'ein'];
    const W_CLOSED = ['off', 'closed', 'false', 'locked', 'zu', 'geschlossen', 'zugesperrt', 'zugesperrt', 'abgesperrt', 'verriegelt', 'clear', 'ok', 'dry', 'trocken', 'normal', 'idle', 'not_home', 'away', 'abwesend', 'frei', 'ruhig', 'aus', 'kein alarm'];
    const W_OPENING = ['opening', '\u00f6ffnet', 'oeffnet', '\u00f6ffnen', 'wird ge\u00f6ffnet', '\u00f6ffnend', 'aufgehend'];
    const W_CLOSING = ['closing', 'schlie\u00dft', 'schliesst', 'schlie\u00dfen', 'wird geschlossen', 'schlie\u00dfend'];
    const oS = lst(o.open_states);
    const cS = lst(o.closed_states);
    let moving = '';
    let open;
    if (oS.includes(vl)) open = true;
    else if (cS.includes(vl)) open = false;
    else if (W_OPENING.includes(vl) || (dom === 'cover' && vl === 'opening')) { open = true; moving = '\u00f6ffnet'; }
    else if (W_CLOSING.includes(vl) || (dom === 'cover' && vl === 'closing')) { open = true; moving = 'schlie\u00dft'; }
    else if (W_OPEN.includes(vl)) open = true;
    else if (W_CLOSED.includes(vl)) open = false;
    else open = dom === 'cover' ? vl !== 'closed' : dom === 'lock' ? vl !== 'locked' : true; // unbekannter Text: lieber als "nicht zu" melden
    if (o.invert) open = !open;
    let label = M && M.w ? M.w[open ? 1 : 0] : open ? 'offen' : 'zu';
    if (moving) label = moving;
    if (dom === 'lock' && v === 'jammed') label = 'klemmt';
    if (open && o.open_text) label = o.open_text;
    if (!open && o.closed_text) label = o.closed_text;
    const secs = open && st.last_changed ? (Date.now() - new Date(st.last_changed).getTime()) / 1000 : 0;
    const mins = secs / 60;
    const alert = open && (o.warn_after !== undefined ? secs >= Number(o.warn_after) : !!(M && M.alarm));
    const cls = alert ? 'alert' : open ? 'open' : 'closed';
    const col = alert ? C.alert : open ? C.open : C.closed;
    const icon = ent.icon || (open ? o.icon_open || o.icon || ic[1] : o.icon || ic[0]);
    return { known: true, open, alert, label, mins, secs, cls, col, name: nm0, icon };
  }

  _stEval(o) {
    const ents = o.ents.map((e) => this._stEnt(o, e));
    const n = ents.length;
    const open = ents.filter((x) => x.open).length;
    const alert = ents.some((x) => x.alert);
    const known = ents.some((x) => x.known);
    const kind = this._stKind(o);
    const M = ST_META[kind] || null;
    const ic = ST_ICONS[kind] || ST_ICONS.door;
    const C = this._stCols(o);
    const cls = !known ? 'unknown' : alert ? 'alert' : open ? 'open' : 'closed';
    const col = cls === 'unknown' ? '#888' : alert ? C.alert : open ? C.open : C.closed;
    const icon = n === 1 && ents[0].icon ? ents[0].icon : M && M.num ? o.icon || ic[0] : open ? o.icon_open || o.icon || ic[1] : o.icon || ic[0];
    const nm = o.name || (n === 1 ? ents[0].name : '');
    let text;
    if (!known) text = nm + ' \u2013';
    else if (M && M.num) text = n === 1 ? nm + ' ' + ents[0].label : nm + ': ' + ents.map((x) => x.label).join(' / ');
    else if (n === 1) text = nm + ' ' + ents[0].label + (ents[0].open && ents[0].secs >= 1 && !(ents[0].label === '\u00f6ffnet' || ents[0].label === 'schlie\u00dft') ? ' \u00b7 ' + (ents[0].secs < 60 ? Math.floor(ents[0].secs) + ' s' : this._fmtDur(ents[0].secs / 3600)) : '');
    else if (M && M.w) text = open ? `${nm}: ${open} von ${n} ${M.w[1]}` : `${nm} ${M.w[0]}`;
    else text = open ? `${nm}: ${open} von ${n} offen` : `${nm} zu`;
    return { ents, n, open, alert, known, cls, col, icon, text };
  }

  _stSwClick(i) {
    const o = (this._st || [])[Number(i)];
    if (!o) return;
    this._swCall(this._stSwEnt(o, -1), o.switch_confirm === true, o.name);
  }

  _stClick(ref) {
    const [i, j] = String(ref).split(':').map(Number);
    const o = (this._st || [])[i];
    if (!o) return;
    const ev = this._stEval(o);
    let ent = j >= 0 ? o.ents[j] : o.ents[Math.max(0, ev.ents.findIndex((x) => x.open))];
    if (!ent) ent = o.ents[0];
    if (o.toggle === true) {
      const st = this._hass && this._hass.states[ent.entity];
      if (!st || st.state === 'unavailable') return;
      const dom = ent.entity.split('.')[0];
      const nm = o.name || ent.name || ent.entity;
      const q = dom === 'lock' ? (st.state === 'locked' ? 'aufsperren?' : 'zusperren?') : dom === 'cover' ? (st.state === 'closed' ? '\u00f6ffnen?' : 'schlie\u00dfen?') : 'umschalten?';
      if (o.confirm === true && !window.confirm(nm + ' ' + q)) return;
      const svc = dom === 'cover' ? ['cover', 'toggle'] : dom === 'lock' ? ['lock', st.state === 'locked' ? 'unlock' : 'lock'] : ['homeassistant', 'toggle'];
      this._hass.callService(svc[0], svc[1], { entity_id: ent.entity });
    } else if (this._o && this._o.tap) {
      this._moreInfo(ent.entity);
    }
  }

  _moreInfo(entityId) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true }));
  }

  // Sensor, dessen Verlauf beim Antippen eines Kreises ge\u00f6ffnet wird
  _tapEntity(cfg) {
    const f = (x) => (x && typeof x === 'object' ? x.entity : x);
    return cfg.tap_entity || cfg.power || cfg.import_power || cfg.discharge_power || cfg.export_power || cfg.charge_power || cfg.soc || cfg.live || cfg.max || cfg.current || cfg.voltage || f(cfg.temperature) || f(cfg.frequency) || null;
  }

  _freqNum(spec) {
    const o = typeof spec === 'string' ? { entity: spec } : spec || {};
    const st = o.entity && this._hass ? this._hass.states[o.entity] : null;
    if (!st) return null;
    let v = parseFloat(st.state);
    if (isNaN(v)) return null;
    if (st.attributes.unit_of_measurement === 'mHz') v /= 1000;
    return v;
  }

  // Grenzwerte: gibt zur\u00fcck, welche Werte au\u00dferhalb liegen
  _limits(v, i, f, imax) {
    const L = this._lim;
    const lim = imax !== undefined && imax !== null && !isNaN(Number(imax)) ? Number(imax) : L.imax;
    return {
      v: v !== null && v !== undefined && (v < L.vmin || v > L.vmax),
      i: i !== null && i !== undefined && lim !== null && Math.abs(i) > lim,
      f: f !== null && f !== undefined && (f < L.fmin || f > L.fmax),
    };
  }

  _socCol(s) {
    return s < 20 ? '#e53935' : s < 40 ? '#fbc02d' : '#43a047';
  }

  _fmtDur(h) {
    if (!isFinite(h) || h < 0) return '\u2013';
    if (h >= 100) return '> 99 h';
    const m = Math.round(h * 60);
    if (m < 60) return m + ' min';
    return Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0') + ' min';
  }

  _freq(spec) {
    const o = typeof spec === 'string' ? { entity: spec } : spec || {};
    const st = o.entity && this._hass ? this._hass.states[o.entity] : null;
    if (!st) return '\u2013 Hz';
    let v = parseFloat(st.state);
    if (isNaN(v)) return '\u2013 Hz';
    if (st.attributes.unit_of_measurement === 'mHz') v /= 1000;
    return v.toFixed(o.decimals !== undefined ? o.decimals : 2) + ' Hz';
  }

  _temp(spec) {
    const o = typeof spec === 'string' ? { entity: spec } : spec || {};
    const st = o.entity && this._hass ? this._hass.states[o.entity] : null;
    if (!st) return '\u2013 \u00b0C';
    let v = parseFloat(st.state);
    if (isNaN(v)) return '\u2013 \u00b0C';
    const u = st.attributes.unit_of_measurement;
    if (u === '\u00b0F') v = ((v - 32) * 5) / 9;
    else if (u === 'K') v -= 273.15;
    return v.toFixed(o.decimals !== undefined ? o.decimals : 1) + ' \u00b0C';
  }

  _fmtK(w) {
    if (w === null) return '\u2013';
    return Math.abs(w) >= 1000 ? (w / 1000).toFixed(1) + ' kW' : Math.round(w) + ' W';
  }

  _secText(list) {
    const arr = Array.isArray(list) ? list : [list];
    return arr
      .map((s) => {
        if (!s) return null;
        const o = typeof s === 'string' ? { entity: s } : s;
        const st = this._hass.states[o.entity];
        let val = '\u2013';
        let unit = '';
        if (st) {
          const num = Number(st.state);
          if (st.state !== '' && !isNaN(num)) {
            val = o.decimals !== undefined ? num.toFixed(o.decimals) : String(Math.round(num * 10) / 10);
          } else {
            val = st.state;
          }
          unit = o.unit !== undefined ? o.unit : st.attributes.unit_of_measurement || '';
        } else if (o.unit !== undefined) {
          unit = o.unit;
        }
        return `${o.name ? o.name + ' ' : ''}${val}${unit ? ' ' + unit : ''}`;
      })
      .filter(Boolean)
      .join(' \u00b7 ');
  }

  // Verlauf der letzten Stunden (Sparkline) aus der Home-Assistant-Historie holen, h\u00f6chstens alle 10 Minuten
  _sparkMaybe() {
    const h = this._hass;
    if (!h || typeof h.callWS !== 'function' || !this._nodes || this._spBusy) return;
    const ids = [...new Set(this._nodes.flatMap((n) => (n.spE || []).map((x) => x.e)))];
    if (!ids.length) return;
    const now = Date.now();
    const missing = ids.some((id) => !this._spark || !this._spark[id]);
    if (!missing && this._spT && now - this._spT < 600000) return;
    if (this._spT && now - this._spT < 60000) return;
    const hrs = this._sparkHours();
    this._spBusy = true;
    this._spT = now;
    const t0 = now - hrs * 3600000;
    h.callWS({ type: 'history/history_during_period', start_time: new Date(t0).toISOString(), end_time: new Date(now).toISOString(), entity_ids: ids, include_start_time_state: true, significant_changes_only: false, minimal_response: true, no_attributes: true })
      .then((res) => {
        const out = {};
        ids.forEach((id) => {
          const pts = [];
          ((res && res[id]) || []).forEach((it) => {
            const v = parseFloat(it.s !== undefined ? it.s : it.state);
            const ts = it.lu !== undefined ? it.lu * 1000 : it.lc !== undefined ? it.lc * 1000 : Date.parse(it.last_updated || it.last_changed || '');
            if (!isNaN(v)) pts.push([isNaN(ts) ? t0 : ts, v]);
          });
          out[id] = pts;
        });
        this._spark = out;
        this._spBusy = false;
        this._spT = Date.now();
        this._spDirty = true;
        this._drawSpark();
      })
      .catch(() => {
        this._spBusy = false;
      });
  }

  // Text setzen; bei gleicher Struktur (z. B. "3.20 kW" -> "3.45 kW") laufen die Zahlen sanft zum neuen Wert
  _setTxt(e, txt) {
    if (!e) return;
    const old = e.textContent;
    txt = String(txt);
    if (txt === old) return;
    const OPT = this._o || {};
    if (!OPT.numAnim || typeof requestAnimationFrame === 'undefined' || (this._c && this._c.calm && this.shadowRoot.querySelector('ha-card.calm')) || (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      e.textContent = txt;
      return;
    }
    const re = /-?\d+(?:[.,]\d+)?/g;
    const a = old.match(re);
    const b = txt.match(re);
    if (!a || !b || a.length !== b.length || old.replace(re, '#') !== txt.replace(re, '#')) {
      e.textContent = txt;
      return;
    }
    if (e._vt) cancelAnimationFrame(e._vt);
    const num = (x) => parseFloat(x.replace(',', '.'));
    const A = a.map(num);
    const B = b.map(num);
    const dec = b.map((x) => (x.split(/[.,]/)[1] || '').length);
    const comma = b.map((x) => x.indexOf(',') >= 0);
    const parts = txt.split(re);
    const t0 = performance.now();
    const dur = 600;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const k = 1 - Math.pow(1 - p, 3);
      let out = parts[0];
      for (let i = 0; i < B.length; i++) {
        let v = (A[i] + (B[i] - A[i]) * k).toFixed(dec[i]);
        if (comma[i]) v = v.replace('.', ',');
        out += v + parts[i + 1];
      }
      e.textContent = p >= 1 ? txt : out;
      e._vt = p >= 1 ? 0 : requestAnimationFrame(step);
    };
    e._vt = requestAnimationFrame(step);
    // falls der Tab im Hintergrund l\u00e4uft (keine Frames): Endwert sicher setzen
    setTimeout(() => {
      if (e.textContent !== txt && e.isConnected && e._vt) {
        cancelAnimationFrame(e._vt);
        e._vt = 0;
        e.textContent = txt;
      }
    }, dur + 900);
  }

  _sparkHours() {
    const v = Number(this._c && this._c.sparkline_hours);
    return !isNaN(v) && v >= 1 ? Math.min(48, v) : 6;
  }

  _drawSpark() {
    const sr = this.shadowRoot;
    if (!sr || !this._nodes || !this._spark) return;
    const N = 48;
    const t1 = Date.now();
    const t0 = t1 - this._sparkHours() * 3600000;
    for (const n of this._nodes) {
      if (!n.spE || !n.spG) continue;
      const a = sr.querySelector('#spk_' + n.key + ' .spa');
      const l = sr.querySelector('#spk_' + n.key + ' .spl');
      if (!a || !l) continue;
      const ser = new Array(N).fill(0);
      let any = false;
      n.spE.forEach((x) => {
        const pts = this._spark[x.e];
        if (!pts || !pts.length) return;
        any = true;
        const stt = this._hass && this._hass.states[x.e];
        const u = stt && stt.attributes ? String(stt.attributes.unit_of_measurement || '') : '';
        const k = (u === 'kW' ? 1000 : u === 'MW' ? 1000000 : 1) * x.s;
        let j = 0;
        for (let i = 0; i < N; i++) {
          const ti = t0 + ((t1 - t0) * i) / (N - 1);
          while (j + 1 < pts.length && pts[j + 1][0] <= ti) j++;
          ser[i] += k * pts[j][1];
        }
      });
      if (!any) {
        a.setAttribute('d', '');
        l.setAttribute('d', '');
        continue;
      }
      const G = n.spG;
      const mn = Math.min(...ser);
      const mx = Math.max(...ser);
      const rg = mx - mn;
      const pt = ser.map((v, i) => [G.x + (G.w * i) / (N - 1), rg < 1e-9 ? G.y + G.h / 2 : G.y + G.h - ((v - mn) / rg) * G.h]);
      const d = pt.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
      l.setAttribute('d', d);
      a.setAttribute('d', d + ' L' + (G.x + G.w).toFixed(1) + ',' + (G.y + G.h).toFixed(1) + ' L' + G.x.toFixed(1) + ',' + (G.y + G.h).toFixed(1) + ' Z');
    }
  }

  _update() {
    if (!this._nodes || !this.shadowRoot.querySelector('svg')) return;
    const sr = this.shadowRoot;
    if (this._isNight() !== this._bgNight || this._wxKey() !== this._wxShown || (this._rbOn && Date.now() > this._rbUntil)) this._applyBg();
    this._sparkMaybe();
    if (this._spDirty) {
      this._spDirty = false;
      this._drawSpark();
    }
    const hd = sr.querySelector('.hd');
    if (hd) hd.textContent = this._clock(this._c.date, 'date');
    const ht = sr.querySelector('.ht');
    if (ht) ht.textContent = this._clock(this._c.time, 'time');
    const texts = (n) => sr.querySelectorAll('g.node')[this._nodes.indexOf(n)].querySelectorAll('text');
    const by = {};
    const OPT = this._o || {};
    // Ruhemodus
    const calm = this._calm();
    const calmDots = calm ? (this._c.calm.dots === 'off' || this._c.calm.dots === 'normal' ? this._c.calm.dots : 'slow') : 'normal';
    const cardEl = sr.querySelector('ha-card');
    if (cardEl) cardEl.classList.toggle('calm', calm);
    // Status (Garagentor, Fenster, T\u00fcren): Kopfzeile, Kreise unten, Abzeichen
    const stEv = (this._st || []).map((o) => this._stEval(o));
    // sek\u00fcndlich neu zeichnen, solange eine Sekundenanzeige l\u00e4uft oder warn_after noch aussteht
    this._stLive = stEv.some((e, i) => e.ents.some((x) => x.open && x.secs !== undefined && (x.secs < 60 || (this._st[i].warn_after !== undefined && !x.alert))));
    const hs = sr.querySelector('.hs');
    if (hs) {
      const html = (this._st || [])
        .map((o, i) => (o.show.includes('header') ? `<span class="sp ${stEv[i].cls}" data-st="${i}:-1" style="--sc:${vawEsc(stEv[i].col)}"><ha-icon icon="${vawEsc(stEv[i].icon)}"></ha-icon>${this._esc(stEv[i].text)}${this._stSwEnt(o, -1) ? `<span class="spw" data-stsw="${i}" title="Schalten"><ha-icon icon="mdi:power"></ha-icon></span>` : ''}</span>` : ''))
        .join('');
      if (html !== this._hsHtml) {
        this._hsHtml = html;
        hs.innerHTML = html;
        this._iconFix(hs);
      }
    }
    (this._stCirc || []).forEach((q) => {
      const o = this._st[q.i];
      const ev = stEv[q.i];
      const x = ev.ents[q.j];
      const id = q.i + '_' + q.j;
      const ic = ST_ICONS[this._stKind(o)] || ST_ICONS.door;
      const g = sr.getElementById('stc_' + id);
      const k = sr.getElementById('stk_' + id);
      const t = sr.getElementById('stt_' + id);
      const nmE = sr.getElementById('stn_' + id);
      const iE = sr.getElementById('sti_' + id);
      if (!g || !x) return;
      g.classList.toggle('alert', x.cls === 'alert');
      k.setAttribute('stroke', x.col);
      k.setAttribute('stroke-opacity', x.cls === 'closed' ? '0.6' : '1');
      t.textContent = x.short || x.label;
      const tl = String(x.short || x.label).length;
      t.style.fontSize = (tl > 8 ? 7.5 : tl > 6 ? 8.5 : x.short ? 10 : 9) + 'px';
      t.style.fill = x.col;
      let nm = String(x.name);
      if (o.ents.length === 1 && o.name) nm = String(o.name);
      else if (o.name && nm.toLowerCase().startsWith(String(o.name).toLowerCase() + ' ')) nm = nm.slice(o.name.length + 1);
      nmE.textContent = nm.length > 14 ? nm.slice(0, 13) + '\u2026' : nm;
      const icon = x.icon || (x.open ? o.icon_open || o.icon || ic[1] : o.icon || ic[0]);
      if (iE) {
        if (iE.getAttribute('icon') !== icon) iE.setAttribute('icon', icon);
        iE.style.color = x.col;
      }
    });
    (this._stb || []).forEach((b) => {
      const o = this._st[b.i];
      const ev = stEv[b.i];
      const g = sr.getElementById('stb_' + b.i);
      const k = sr.getElementById('stbk_' + b.i);
      const iE = sr.getElementById('stbi_' + b.i);
      const cE = sr.getElementById('stbc_' + b.i);
      const nE = sr.getElementById('stbn_' + b.i);
      if (!g) return;
      const hide = o.hide_closed === true && !ev.open;
      g.setAttribute('visibility', hide ? 'hidden' : 'visible');
      g.classList.toggle('alert', ev.cls === 'alert');
      k.setAttribute('stroke', ev.col);
      if (iE) {
        iE.style.display = hide ? 'none' : '';
        if (iE.getAttribute('icon') !== ev.icon) iE.setAttribute('icon', ev.icon);
        iE.style.color = ev.col;
      }
      if (cE) cE.setAttribute('visibility', ev.n > 1 && ev.open > 0 ? 'visible' : 'hidden');
      if (nE) nE.textContent = String(ev.open);
    });
    // Schalter am Kreis: Zustand anzeigen
    (this._sw || []).forEach((it) => {
      const el = sr.getElementById('sw_' + it.key);
      const st = this._hass && this._hass.states[it.entity];
      if (!el) return;
      const un = !st || st.state === 'unavailable' || st.state === 'unknown';
      el.classList.toggle('un', un);
      el.classList.toggle('on', !un && ['on', 'open', 'unlocked', 'playing', 'heat', 'cool'].includes(String(st.state)));
    });
    const kidVals = (this._kids || []).map((k) => ({
      k,
      p: this._num(k.o.power, 'p'),
      s: this._num(k.o.soc, 'x'),
      i: this._num(k.o.current, 'i'),
      v: this._num(k.o.voltage, 'v'),
      t: k.o.temperature ? this._temp(k.o.temperature) : null,
    }));
    // Strompreis -> Farbe (gr\u00fcn = g\u00fcnstig, gelb = mittel, rot = teuer)
    const gcfg = this._c.grid || {};
    let price = null;
    let priceCol = null;
    if (gcfg.price) {
      price = this._num(gcfg.price, 'x');
      const lo = gcfg.price_low !== undefined ? Number(gcfg.price_low) : null;
      const hi = gcfg.price_high !== undefined ? Number(gcfg.price_high) : null;
      if (price !== null && (lo !== null || hi !== null)) {
        priceCol = lo !== null && price <= lo ? '#43a047' : hi !== null && price >= hi ? '#e53935' : '#fbc02d';
      }
    }
    // Ladestand der Batterie gesamt: eigener Sensor, sonst Mittelwert der einzelnen Batterien
    const bnode0 = this._nodes.find((n) => n.key === 'battery');
    let socAll = bnode0 ? this._num(bnode0.cfg.soc, 'x') : null;
    if (socAll === null) {
      const sv = kidVals.filter((x) => x.k.id.startsWith('bat_c') && x.s !== null).map((x) => x.s);
      if (sv.length) socAll = sv.reduce((a, b) => a + b, 0) / sv.length;
    }

    for (const n of this._nodes) {
      by[n.key] = n;
      const cfg = n.cfg;
      let p = this._num(cfg.power, 'p');

      if (n.key === 'grid' || n.key === 'battery') {
        const inKey = n.key === 'grid' ? 'import_power' : 'discharge_power'; // Richtung Haus
        const outKey = n.key === 'grid' ? 'export_power' : 'charge_power'; // weg vom Haus
        const a = this._num(cfg[inKey], 'p');
        const bb = this._num(cfg[outKey], 'p');
        if (a !== null || bb !== null) {
          p = (a || 0) - (bb || 0);
          n._in = a || 0;
          n._out = bb || 0;
        } else if (p !== null) {
          const q = n.key === 'battery' && cfg.invert ? -p : p;
          n._in = Math.max(q, 0);
          n._out = Math.max(-q, 0);
        } else if (n.key === 'grid' && kidVals.some((x) => x.k.id.startsWith('gph_') && x.p !== null)) {
          // kein Gesamtsensor: Summe der Phasen (positiv = Bezug)
          p = kidVals.filter((x) => x.k.id.startsWith('gph_') && x.p !== null).reduce((acc, x) => acc + x.p, 0);
          n._in = Math.max(p, 0);
          n._out = Math.max(-p, 0);
        } else {
          n._in = null;
          n._out = null;
        }
      }
      if (n.key === 'solar' && p === null) {
        const vals = kidVals.filter((x) => x.k.id.startsWith('solar_c') && x.p !== null);
        if (vals.length) p = vals.reduce((acc, x) => acc + x.p, 0); // Summe der Panels
      }
      n._p = p;
      n._i = this._num(cfg.current, 'i');
      n._v = this._num(cfg.voltage, 'v');
    }

    // Zonen ohne eigenen Sensor zeigen die Summe ihrer Ger\u00e4te
    for (const n of this._nodes) {
      if (n.phKids && n._p === null) {
        const pv = kidVals.filter((x) => n.phKids.includes(x.k.id) && x.p !== null);
        if (pv.length) n._p = pv.reduce((acc, x) => acc + x.p, 0);
      }
      if (n.devNodes && n._p === null) {
        const vals = n.devNodes.filter((d) => d._p !== null);
        if (vals.length) n._p = vals.reduce((acc, d) => acc + d._p, 0);
      }
    }

    // ---- Fl\u00fcsse berechnen ----
    const S = by.solar && by.solar._p !== null ? Math.abs(by.solar._p) : 0;
    const Gi = by.grid ? by.grid._in || 0 : 0;
    const Go = by.grid ? by.grid._out || 0 : 0;
    const Bo = by.battery ? by.battery._in || 0 : 0; // Entladen
    const Bi = by.battery ? by.battery._out || 0 : 0; // Laden
    const h = this._home;
    const balance = Math.max(0, S + Gi + Bo - Go - Bi);
    const H = h._p !== null && h._p !== undefined ? Math.max(0, h._p) : balance;
    if (h._p === null || h._p === undefined) {
      h._p = by.grid || by.solar || by.battery ? balance : null;
    }

    // Sammelkreis "Rest" = Hausverbrauch minus alles, was Zonen und Ger\u00e4te bereits zeigen
    {
      const rn = this._nodes.find((n) => n.cfg && n.cfg.rest === true && n.dev);
      if (rn) {
        const lnk = (n) => !(n.cfg && (n.cfg.no_link === true || n.cfg.connected === false));
        let sum = 0;
        this._nodes.forEach((n) => {
          if (n === rn || !n.dev || !lnk(n)) return;
          if (/^z\d+$/.test(n.key)) {
            const own = this._num(n.cfg.power, 'p');
            if (own !== null) sum += Math.max(0, own);
            else (n.devNodes || []).forEach((d) => { if (d !== rn && lnk(d) && d._p !== null && d._p !== undefined) sum += Math.max(0, d._p); });
          } else if (/^d\d+$/.test(n.key) && n._p !== null && n._p !== undefined) sum += Math.max(0, n._p);
        });
        rn._p = Math.max(0, H - sum);
        this._nodes.forEach((n) => {
          if (n.devNodes && n.devNodes.includes(rn) && this._num(n.cfg.power, 'p') === null) {
            const vals = n.devNodes.filter((d) => d._p !== null && d._p !== undefined);
            if (vals.length) n._p = vals.reduce((a, d) => a + d._p, 0);
          }
        });
      }
    }

    // Netzbezug geht immer zuerst (und nur) ins Haus
    let Hrem = H;
    const g2h = Math.min(Gi, Hrem); Hrem -= g2h;
    const GiRem = Gi - g2h;
    // Solar: Haus -> Batterie -> Netz
    let sRem = S;
    const s2h = Math.min(sRem, Hrem); sRem -= s2h; Hrem -= s2h;
    const s2b = Math.min(sRem, Bi); sRem -= s2b; const BiRem = Bi - s2b;
    const s2g = Math.min(sRem, Go); const GoRem = Go - s2g;
    // Batterie: Haus -> Netz
    const b2h = Math.min(Bo, Hrem); const BoRem = Bo - b2h; Hrem -= b2h;
    const b2g = Math.min(BoRem, GoRem);
    // Netz -> Batterie nur auf Wunsch (grid_to_battery: true)
    const g2b = this._c.grid_to_battery ? Math.min(GiRem, BiRem) : 0;

    const flow = {
      grid_home: g2h,
      solar_home: s2h,
      solar_grid: s2g,
      solar_battery: s2b,
      battery_home: b2h,
      battery_grid: b2g - g2b,
    };
    for (const n of this._nodes) if (n.dev) flow[n.key] = n._p === null ? null : n._p;

    // ---- Texte ----
    for (const n of this._nodes) {
      const t = texts(n);
      // Ger\u00e4te und Zonen ausgrauen, wenn sie (fast) nichts ziehen
      if (n.dev && this._c.dim_idle !== false) {
        const thr = this._c.idle_below !== undefined ? Number(this._c.idle_below) : 1;
        const idle = n._p !== null && n._p !== undefined && Math.abs(n._p) < thr;
        const op = idle ? String(this._c.idle_opacity !== undefined ? this._c.idle_opacity : 0.4) : '1';
        const ge = sr.getElementById('g_' + n.key);
        const ie = sr.getElementById('i_' + n.key);
        if (ge) ge.setAttribute('opacity', op);
        if (ie) ie.style.opacity = op;
      }
      if (n.key === 'grid' || n.key === 'battery') {
        const toHome = n.key === 'grid' ? n.cfg.import_color : n.cfg.discharge_color; // Bezug / Entladen
        const fromHome = n.key === 'grid' ? n.cfg.export_color : n.cfg.charge_color; // Einspeisen / Laden
        const o = n._out || 0;
        const i = n._in || 0;
        n._dc = o > i ? fromHome || null : i > 0 ? toHome || null : null;
        if (n.four && toHome) t[0].style.fill = toHome;
      }
      // Rand: Netzfarbe / Preisfarbe / Grenzwert-Warnfarbe
      const fNum = n.cfg.frequency ? this._freqNum(n.cfg.frequency) : null;
      const hit = OPT.lim ? this._limits(n._v, n._i, fNum, n.cfg.current_max) : { v: false, i: false, f: false };
      let stroke = n._dc || n.cfg.color;
      if (n.key === 'grid' && priceCol && gcfg.price_circle !== false && !((n._out || 0) > (n._in || 0))) stroke = priceCol;
      if (hit.v || hit.i || hit.f) stroke = this._lim.color;
      const circ = sr.getElementById('c_' + n.key);
      if (circ) {
        circ.setAttribute('stroke', stroke);
        circ.style.setProperty('--gc', stroke);
      }
      const gEl = sr.getElementById('g_' + n.key);
      if (gEl) {
        const act = n.four ? (n._in || 0) >= 1 || (n._out || 0) >= 1 : n._p !== null && n._p !== undefined && Math.abs(n._p) >= 1;
        gEl.classList.toggle('on', !!act);
        gEl.classList.toggle('pulse', !!(n.dev && OPT.pulse && OPT.pulseW > 0 && n._p !== null && n._p !== undefined && Math.abs(n._p) >= OPT.pulseW));
      }
      const aTxt = n._i === null ? '\u2013 A' : Math.abs(n._i) < 10 ? n._i.toFixed(2) + ' A' : n._i.toFixed(1) + ' A';
      const vTxt = n._v === null ? '\u2013 V' : n._v.toFixed(1) + ' V';
      (n.lines || []).forEach((k, i) => {
        const e = t[i];
        if (!e) return;
        this._setTxt(e,
          k === 'in' ? '\u2192 ' + this._fmtP(n._in)
          : k === 'out' ? '\u2190 ' + this._fmtP(n._out)
          : k === 'p' ? this._fmtP(n._p)
          : k === 'a' ? aTxt
          : k === 'v' ? vTxt
          : k === 't' ? this._temp(n.cfg.temperature)
          : k === 'f' ? this._freq(n.cfg.frequency)
          : this._extra(n.cfg.extra[Number(k.slice(1))]));
        if (k === 'a' || k === 'v' || k === 'f') e.classList.toggle('lim', !!(k === 'a' ? hit.i : k === 'v' ? hit.v : hit.f));
      });
      if (n.key === 'battery') {
        const soc = this._num(n.cfg.soc, 'x');
        const el = sr.getElementById('soc_battery');
        if (el) this._setTxt(el, soc === null ? '\u2013 %' : `${Math.round(soc)} %`);
        // Icon passend zum Ladestand
        const bi = sr.getElementById('i_battery');
        if (bi && n.cfg.soc_icon !== false && !(this._c.battery && this._c.battery.icon) && socAll !== null) {
          const q = Math.max(0, Math.min(100, Math.round(socAll / 10) * 10));
          const chg = (n._out || 0) > (n._in || 0);
          const base = chg ? 'mdi:battery-charging' : 'mdi:battery';
          const ic = q >= 100 ? (chg ? 'mdi:battery-charging-100' : 'mdi:battery') : q <= 0 ? base + '-outline' : base + '-' + q;
          if (bi.getAttribute('icon') !== ic) bi.setAttribute('icon', ic);
        }
      }
      // Ring: Ladestand (Batterie) bzw. Auslastung (Solar)
      const cg = sr.getElementById('cg_' + n.key);
      if (cg && n.ringC) {
        let frac = null;
        let rc = null;
        if (n.capRing === 'soc') {
          if (socAll !== null) frac = socAll / 100;
          rc = socAll !== null ? this._socCol(socAll) : null;
        } else {
          let mx = this._solMax;
          if (mx !== null && mx !== undefined && isNaN(Number(mx))) mx = this._num(mx, 'p');
          mx = Number(mx);
          if (n._p !== null && n._p !== undefined && mx > 0) frac = Math.abs(n._p) / mx;
        }
        if (frac === null) {
          cg.setAttribute('opacity', '0');
        } else {
          const f = Math.max(0, Math.min(frac, 1));
          cg.setAttribute('stroke-dasharray', `${(f * n.ringC).toFixed(1)} ${n.ringC.toFixed(1)}`);
          if (rc) cg.setAttribute('stroke', rc);
          cg.setAttribute('opacity', f < 0.005 ? '0' : '1');
        }
      }
      const fv = sr.getElementById('fv_' + n.key);
      if (fv) {
        let fr = null;
        if (n.key === 'battery') {
          if (socAll !== null) fr = socAll / 100;
        } else {
          let mx = this._solMax;
          if (mx !== null && mx !== undefined && isNaN(Number(mx))) mx = this._num(mx, 'p');
          mx = Number(mx);
          if (n._p !== null && n._p !== undefined && mx > 0) fr = Math.abs(n._p) / mx;
        }
        fv.style.transform = 'scaleY(' + (fr === null ? 0 : Math.max(0, Math.min(1, fr)).toFixed(3)) + ')';
        if (n.key === 'battery' && socAll !== null) fv.setAttribute('fill', this._socCol(socAll));
      }
      const sec = sr.getElementById('sec_' + n.key);
      if (sec) sec.textContent = n.cfg.secondary ? this._secText(n.cfg.secondary) : '';
    }

    kidVals.forEach((x) => {
      // Unterger\u00e4te ausgrauen, wenn sie (fast) nichts ziehen
      if (/^(z\d+)?d\d+c\d+$/.test(x.k.id) && this._c.dim_idle !== false) {
        const thr = this._c.idle_below !== undefined ? Number(this._c.idle_below) : 1;
        const idle = x.p !== null && Math.abs(x.p) < thr;
        const kg = sr.getElementById('kg_' + x.k.id);
        if (kg) kg.setAttribute('opacity', idle ? String(this._c.idle_opacity !== undefined ? this._c.idle_opacity : 0.4) : '1');
      }
      const put = (q, txt) => {
        const e = sr.getElementById('k' + q + '_' + x.k.id);
        if (e) this._setTxt(e, txt);
      };
      put('p', this._fmtK(x.p));
      put('s', x.s === null ? '\u2013 %' : Math.round(x.s) + ' %');
      put('a', x.i === null ? '\u2013 A' : x.i.toFixed(2) + ' A');
      put('v', x.v === null ? '\u2013 V' : x.v.toFixed(1) + ' V');
      put('t', x.t);
      // Grenzwerte (Strom/Spannung) und Ladestand-Ring der kleinen Kreise
      const kh = OPT.lim ? this._limits(x.v, x.i, null, x.k.o.current_max) : { v: false, i: false };
      const kc = sr.getElementById('kc_' + x.k.id);
      if (kc && x.k.id !== 'peak_c0') {
        if (kh.v || kh.i) {
          kc.setAttribute('stroke', this._lim.color);
          kc.setAttribute('stroke-opacity', '1');
        } else {
          kc.setAttribute('stroke', x.k.col);
          kc.setAttribute('stroke-opacity', x.k.socRing ? '0.3' : '1');
        }
      }
      const ea = sr.getElementById('ka_' + x.k.id);
      if (ea) ea.classList.toggle('lim', !!kh.i);
      const ev = sr.getElementById('kv_' + x.k.id);
      if (ev) ev.classList.toggle('lim', !!kh.v);
      const ks = sr.getElementById('kr_' + x.k.id);
      if (ks) {
        if (x.s === null) {
          ks.setAttribute('opacity', '0');
        } else {
          const f = Math.max(0, Math.min(x.s / 100, 1));
          ks.setAttribute('stroke-dasharray', `${(f * x.k.KC).toFixed(1)} ${x.k.KC.toFixed(1)}`);
          ks.setAttribute('stroke', this._socCol(x.s));
          ks.setAttribute('opacity', f < 0.005 ? '0' : '1');
        }
      }
      // Punkte: positiv = vom kleinen Kreis zum Haupt-Kreis (Panel liefert / Batterie entl\u00e4dt); invert: true dreht um
      flow[x.k.id] = x.p === null ? null : x.k.o.invert ? -x.p : x.p;
    });

    // ---- Haus-Ring: Anteil der Untergruppen am Hausverbrauch ----
    const hnode = by.home;
    if (hnode && hnode.groups) {
      const CC = hnode.ringC;
      const vals = hnode.groups.map((g) => Math.max(0, g._p || 0));
      const sum = vals.reduce((a, b) => a + b, 0);
      const denom = Math.max(hnode._p || 0, sum);
      let acc = 0;
      hnode.groups.forEach((g, i) => {
        const el = sr.getElementById('hs_' + g.key);
        const len = denom > 0 ? (vals[i] / denom) * CC : 0;
        const gap = len > 6 ? 2 : 0;
        if (el) {
          el.setAttribute('stroke-dasharray', `${Math.max(0, len - gap).toFixed(1)} ${CC.toFixed(1)}`);
          el.setAttribute('stroke-dashoffset', (-(acc + gap / 2)).toFixed(1));
          el.setAttribute('opacity', len < 0.5 ? '0' : '1');
        }
        acc += len;
      });
    }

    // ---- Z\u00e4hlerst\u00e4nde unter dem Netz-Kreis ----
    if (this._gridMeter) {
      const gm = this._gridMeter;
      const m0 = sr.getElementById('mt_0');
      const m1 = sr.getElementById('mt_1');
      if (m0) m0.textContent = this._meter(gm.import, gm.import_name || 'Bezug', gm.decimals);
      if (m1) m1.textContent = gm.export ? this._meter(gm.export, gm.export_name || 'Einspeisung', gm.decimals) : '';
    }

    // ---- 15-Minuten-Spitze: Ring, Warnfarbe, kleiner Kreis ----
    if (this._peakCfg) {
      const pc = this._peakCfg;
      const mx = this._num(pc.max, 'p');
      const lv = this._num(pc.live, 'p');
      const ls = this._num(pc.last, 'p');
      const fr = mx === null || lv === null ? 0 : mx > 0 ? lv / mx : lv > 0 ? 1 : 0;
      const warnAt = (pc.warn_at !== undefined ? Number(pc.warn_at) : 90) / 100;
      const st = fr >= 1 ? 'alert' : fr >= warnAt ? 'warn' : 'ok';
      const col = pc[st + '_color'] || { ok: '#43a047', warn: '#fbc02d', alert: '#e53935' }[st];
      const cls = st === 'alert' ? 'alert' : '';
      const gn = by.grid;
      const ring = sr.getElementById('rg_grid');
      if (ring && gn) {
        const f = Math.max(0, Math.min(fr, 1));
        ring.setAttribute('stroke-dasharray', `${(f * gn.ringC).toFixed(1)} ${gn.ringC.toFixed(1)}`);
        ring.setAttribute('stroke', col);
        ring.setAttribute('opacity', f < 0.005 ? '0' : '1');
        ring.setAttribute('class', cls);
      }
      const kc = sr.getElementById('kc_peak_c0');
      if (kc) {
        kc.setAttribute('stroke', col);
        kc.setAttribute('class', cls);
      }
      const put = (q, txt) => {
        const e = sr.getElementById('k' + q + '_peak_c0');
        if (e) this._setTxt(e, txt);
      };
      put('m', this._kw(mx, true));
      put('l', 'jetzt ' + this._kw(lv));
      put('z', 'zuletzt ' + this._kw(ls));
    }

    // ---- Punkte auf den Linien ----
    for (const l of this._links) {
      const f = flow[l.id];
      const path = sr.getElementById('l_' + l.id);
      if (l._ll) {
        const lt = sr.getElementById('ll_' + l.id);
        if (lt) {
          if (f === null || f === undefined || Math.abs(f) < 1) lt.setAttribute('visibility', 'hidden');
          else {
            lt.setAttribute('visibility', 'visible');
            const tx = this._kw(Math.abs(f), true);
            if (lt.textContent !== tx) lt.textContent = tx;
          }
        }
      }
      const D = [];
      for (let i = 0; i < OPT.ndot; i++) {
        const sf = i ? '_' + i : '';
        const d = sr.getElementById('dot_' + l.id + sf);
        if (d) D.push({ d, am: sr.getElementById('am_' + l.id + sf) });
      }
      if (!D.length || f === null || f === undefined || Math.abs(f) < 1) {
        D.forEach((x) => x.d.setAttribute('visibility', 'hidden'));
        if (path) {
          path.classList.remove('on', 'rev');
          path.setAttribute('stroke', l.ca);
          path.setAttribute('opacity', '0.3');
          path.setAttribute('stroke-width', '2');
        }
        continue;
      }
      const af = Math.abs(f);
      const cnt = OPT.dotsAuto ? (af < 300 ? 1 : af < 1500 ? 2 : 3) : OPT.ndot;
      const lw = OPT.lineW ? 2 + (OPT.lineMax - 2) * this._lx(af) : 0;
      if (OPT.lineW && path) path.setAttribute('stroke-width', lw.toFixed(1));
      const src = f >= 0 ? l.a : l.b;
      const dst = f >= 0 ? l.b : l.a;
      const cs = src._dc || (f >= 0 ? l.ca : l.cb);
      const cd = dst._dc || (f >= 0 ? l.cb : l.ca);
      const gs = src._dc || src.cfg.line_color || src.cfg.color || cs;
      const gd = dst._dc || dst.cfg.line_color || dst.cfg.color || cd;
      let col = cs;
      // Flie\u00dft etwas ins Netz (Einspeisung), hat die Linie die Netzfarbe
      if (dst.key === 'grid' && src.key !== 'grid') col = dst._dc || (f >= 0 ? l.cb : l.ca);
      const dur = (this._dur(af) * (calmDots === 'slow' ? 3 : 1)).toFixed(1) + 's';
      D.forEach((x, i) => {
        const show = i < cnt && calmDots !== 'off';
        x.d.setAttribute('visibility', show ? 'visible' : 'hidden');
        if (!show) return;
        if (OPT.lineW && l._mk !== 'spark' && l._mk !== 'drop') {
          if (l._mk === 'dot') x.d.setAttribute('r', (3 + lw * 0.75).toFixed(1));
          else x.d.setAttribute('d', vawMk(l._mk, 3.2 + lw * 0.8));
        }
        x.d.setAttribute('fill', col);
        x.am.setAttribute('dur', dur);
        const ph = i / cnt;
        const q = (1 - ph).toFixed(3);
        const kp = ph === 0 ? (f >= 0 ? '0;1' : '1;0') : f >= 0 ? `${ph.toFixed(3)};1;0;${ph.toFixed(3)}` : `${q};0;1;${q}`;
        const kt = ph === 0 ? '0;1' : `0;${q};${q};1`;
        if (x.am.getAttribute('keyPoints') !== kp) x.am.setAttribute('keyPoints', kp);
        if (x.am.getAttribute('keyTimes') !== kt) x.am.setAttribute('keyTimes', kt);
        if (l._mk !== 'dot') x.am.setAttribute('rotate', f >= 0 ? 'auto' : 'auto-reverse');
      });
      if (path) {
        if (OPT.lgrad) {
          const g0 = sr.getElementById('lgs0_' + l.id);
          const g1 = sr.getElementById('lgs1_' + l.id);
          if (g0 && g1) {
            g0.style.stopColor = f >= 0 ? gs : gd;
            g1.style.stopColor = f >= 0 ? gd : gs;
          }
          path.setAttribute('stroke', 'url(#lg_' + l.id + ')');
        } else path.setAttribute('stroke', col);
        path.setAttribute('opacity', '0.9');
        path.style.color = col;
        path.classList.add('on');
        path.classList.toggle('rev', f < 0);
      }
    }

    // ---- Infozeile unter der Karte ----
    const infoEl = sr.querySelector('.info');
    if (infoEl) {
      const I = this._c.info && typeof this._c.info === 'object' ? this._c.info : {};
      const esc = vawEsc;
      const pct = (x) => Math.round(Math.max(0, Math.min(100, x))) + ' %';
      const chips = [];
      if (I.autarky) chips.push({ ic: 'mdi:home-lightning-bolt', t: 'Autarkie ' + (H > 0 ? pct(100 * (1 - Gi / H)) : '\u2013') });
      if (I.self_consumption) chips.push({ ic: 'mdi:solar-power', t: 'Eigenverbrauch ' + (S > 1 ? pct(100 * (1 - Go / S)) : '\u2013') });
      if (I.battery_time) {
        const bcfg = this._c.battery || {};
        let cap = bcfg.capacity;
        if (cap !== undefined && isNaN(Number(cap))) {
          const cst = this._hass && this._hass.states[cap];
          cap = cst ? parseFloat(cst.state) / (cst.attributes.unit_of_measurement === 'Wh' ? 1000 : 1) : NaN;
        }
        cap = Number(cap);
        let t = 'Akku \u2013';
        if (socAll !== null && cap > 0) {
          if (Bo > 20) t = 'Akku reicht noch ' + this._fmtDur(((socAll / 100) * cap * 1000) / Bo);
          else if (Bi > 20) t = 'Akku voll in ' + this._fmtDur((((100 - socAll) / 100) * cap * 1000) / Bi);
          else t = 'Akku ' + Math.round(socAll) + ' % (Standby)';
        } else if (!(cap > 0)) {
          t = 'Akku: Kapazit\u00e4t fehlt';
        }
        chips.push({ ic: 'mdi:battery-clock', t });
      }
      const co2e = I.co2_entity || (typeof I.co2 === 'string' ? I.co2 : I.co2 && I.co2.entity);
      if (co2e) {
        const cst = this._hass && this._hass.states[co2e];
        const fac = Number(I.co2_factor !== undefined ? I.co2_factor : I.co2 && I.co2.factor !== undefined ? I.co2.factor : 0.2);
        let tx = '\u2013';
        if (cst && cst.state !== 'unknown' && cst.state !== 'unavailable' && !isNaN(parseFloat(cst.state))) {
          const u = String((cst.attributes && cst.attributes.unit_of_measurement) || 'kWh');
          const kwh = parseFloat(cst.state) * (u === 'Wh' ? 0.001 : u === 'MWh' ? 1000 : 1);
          const kg = kwh * (isNaN(fac) ? 0.2 : fac);
          const lang = (this._hass.locale && this._hass.locale.language) || undefined;
          tx = kg >= 1000 ? (kg / 1000).toLocaleString(lang, { maximumFractionDigits: 2 }) + ' t' : kg.toLocaleString(lang, { maximumFractionDigits: kg < 10 ? 1 : 0 }) + ' kg';
        }
        chips.push({ ic: 'mdi:leaf', e: co2e, t: (I.co2_name || 'CO\u2082 gespart') + ' ' + tx });
      }
      (this._st || []).forEach((o, i) => {
        if (o.show.includes('info')) chips.push({ dot: stEv[i].col, st: i + ':-1', t: stEv[i].text, sw: this._stSwEnt(o, -1) ? i : null });
      });
      if (gcfg.price) {
        const pst = this._hass && this._hass.states[gcfg.price];
        const u = pst && pst.attributes.unit_of_measurement ? ' ' + pst.attributes.unit_of_measurement : '';
        chips.push({ dot: priceCol, e: gcfg.price, t: 'Preis ' + (price === null ? '\u2013' : price.toFixed(Math.abs(price) < 1 ? 3 : 2)) + u });
      }
      (Array.isArray(I.items) ? I.items : []).slice(0, 8).forEach((it) => {
        const o = typeof it === 'string' ? { entity: it } : it;
        chips.push({ ic: o.icon, e: o.entity, t: this._extra(o) });
      });
      const html = chips
        .map((q) => `<span class="chip"${q.e ? ` data-e="${esc(q.e)}"` : ''}${q.st ? ` data-st="${q.st}" data-e="x"` : ''}>${q.dot ? `<span class="dot" style="background:${vawEsc(q.dot)}"></span>` : q.ic ? `<ha-icon icon="${esc(q.ic)}"></ha-icon>` : ''}${esc(q.t)}${q.sw !== null && q.sw !== undefined ? `<span class="spw" data-stsw="${q.sw}" title="Schalten"><ha-icon icon="mdi:power"></ha-icon></span>` : ''}</span>`)
        .join('');
      if (html !== this._infoHtml) {
        this._infoHtml = html;
        infoEl.innerHTML = html;
        this._iconFix(infoEl);
      }
    }
  }
}

/* ================= Visueller Editor ================= */
// Hilfsfunktionen f\u00fcr das ha-form-Schema
const vE = (name, label, helper) => ({ name, label, helper, selector: { entity: {} } });
const vT = (name, label, helper) => ({ name, label, helper, selector: { text: {} } });
const vI = (name, label) => ({ name, label, selector: { icon: {} } });
const vB = (name, label, helper) => ({ name, label, helper, selector: { boolean: {} } });
const vN = (name, label, helper, o) => ({ name, label, helper, selector: { number: { mode: 'box', ...(o || {}) } } });
const vG = (...schema) => ({ type: 'grid', name: '', schema });
const vX = (name, title, schema) => ({ type: 'expandable', name, title, schema });
const vF = (label, selector) => ({ label, selector });
const vText = { text: {} };
const vEnt = { entity: {} };
const vMeasure = () => [vG(vE('current', 'Strom (A)'), vE('voltage', 'Spannung (V)')), vG(vE('temperature', 'Temperatur (\u00b0C)'), vN('current_max', 'Strom-Grenze (A)', 'Rot ab hier')) ];
const vLook = () => [
  vG(vT('name', 'Name'), vI('icon', 'Icon')),
  { name: 'size', label: 'Durchmesser dieses Kreises (Schieber, Standard 1)', selector: { number: { mode: 'slider', min: 0.5, max: 1.6, step: 0.05 } } },
  { name: 'font_size', label: 'Schriftgr\u00f6\u00dfe dieses Kreises (Schieber, Standard 1 = automatisch)', selector: { number: { mode: 'slider', min: 0.5, max: 2.5, step: 0.05 } } },
  vB('line_label', 'Wert an der Linie zu diesem Kreis anzeigen'),
  vG(vT('color', 'Farbe', 'Farbcode, z. B. #ff9800'), vT('line_color', 'Linienfarbe'), vT('icon_color', 'Icon-Farbe'), vT('text_color', 'Zahlenfarbe')),
];
// Felder f\u00fcr Listeneintr\u00e4ge (Ger\u00e4te, Zonen, Phasen, Panels, Batterien)
const vChildFields = {
  size: vF('Durchmesser (Schieber, 0.5 bis 1.6, Standard 1)', { number: { mode: 'slider', min: 0.5, max: 1.6, step: 0.05 } }),
  font_size: vF('Schriftgr\u00f6\u00dfe (Schieber, 0.5 bis 2.5, Standard 1 = automatisch)', { number: { mode: 'slider', min: 0.5, max: 2.5, step: 0.05 } }),
  switch: vF('Schalter (Entit\u00e4t zum Ein-/Ausschalten, z. B. switch.herd)', vEnt),
  switch_confirm: vF('Vor dem Schalten nachfragen', { boolean: {} }),
  current_max: vF('Strom-Grenze (A)', { number: { mode: 'box', min: 0 } }),
  name: vF('Name', vText),
  power: vF('Leistung (W)', vEnt),
  current: vF('Strom (A)', vEnt),
  voltage: vF('Spannung (V)', vEnt),
  temperature: vF('Temperatur (\u00b0C)', vEnt),
  color: vF('Farbe (z. B. #ff9800, Standard: Farbe des Ger\u00e4ts)', vText),
};
const vDevFields = {
  switch: vF('Schalter (Entit\u00e4t zum Ein-/Ausschalten, z. B. switch.herd)', vEnt),
  switch_confirm: vF('Vor dem Schalten nachfragen', { boolean: {} }),
  current_max: vF('Strom-Grenze (A)', { number: { mode: 'box', min: 0 } }),
  name: vF('Name', vText),
  icon: vF('Icon (mdi:..., my:name oder Bild-URL)', { icon: {} }),
  size: vF('Durchmesser (Schieber, 0.5 bis 1.6, Standard 1)', { number: { mode: 'slider', min: 0.5, max: 1.6, step: 0.05 } }),
  font_size: vF('Schriftgr\u00f6\u00dfe (Schieber, 0.5 bis 2.5, Standard 1 = automatisch)', { number: { mode: 'slider', min: 0.5, max: 2.5, step: 0.05 } }),
  line_label: vF('Wert an der Linie anzeigen', { boolean: {} }),
  no_link: vF('Ohne Verbindungslinie (steht allein, keine Linie zum Haus bzw. zur Zone)', { boolean: {} }),
  power: vF('Leistung (W)', vEnt),
  current: vF('Strom (A)', vEnt),
  voltage: vF('Spannung (V)', vEnt),
  temperature: vF('Temperatur (\u00b0C)', vEnt),
  color: vF('Farbe (z. B. #ff9800)', vText),
  children: vF('Unterger\u00e4te (kleine Kreise unter dem Ger\u00e4t, bis 6)', { object: { multiple: true, label_field: 'name', fields: vChildFields } }),
};
const vPhaseFields = {
  size: vF('Durchmesser (Schieber, 0.5 bis 1.6, Standard 1)', { number: { mode: 'slider', min: 0.5, max: 1.6, step: 0.05 } }),
  font_size: vF('Schriftgr\u00f6\u00dfe (Schieber, 0.5 bis 2.5, Standard 1 = automatisch)', { number: { mode: 'slider', min: 0.5, max: 2.5, step: 0.05 } }),
  current_max: vF('Strom-Grenze (A)', { number: { mode: 'box', min: 0 } }),
  name: vF('Name (leer = L1, L2, \u2026)', vText),
  power: vF('Leistung (W)', vEnt),
  current: vF('Strom (A)', vEnt),
  voltage: vF('Spannung (V)', vEnt),
  color: vF('Farbe (z. B. #ff9800)', vText),
};
const vGridPhFields = {
  size: vF('Durchmesser (Schieber, 0.5 bis 1.6, Standard 1)', { number: { mode: 'slider', min: 0.5, max: 1.6, step: 0.05 } }),
  font_size: vF('Schriftgr\u00f6\u00dfe (Schieber, 0.5 bis 2.5, Standard 1 = automatisch)', { number: { mode: 'slider', min: 0.5, max: 2.5, step: 0.05 } }),
  current_max: vF('Strom-Grenze (A)', { number: { mode: 'box', min: 0 } }),
  name: vF('Name (leer = L1, L2, \u2026)', vText),
  power: vF('Leistung (W, positiv = Bezug)', vEnt),
  current: vF('Strom (A)', vEnt),
  voltage: vF('Spannung (V)', vEnt),
  color: vF('Farbe (z. B. #ff9800)', vText),
};
const vPanelFields = {
  name: vF('Name', vText),
  power: vF('Leistung (W)', vEnt),
  current: vF('Strom (A)', vEnt),
  voltage: vF('Spannung (V)', vEnt),
  color: vF('Farbe (z. B. #ff9800)', vText),
};
const vBatFields = {
  name: vF('Name', vText),
  soc: vF('Ladestand (%)', vEnt),
  power: vF('Leistung (W, positiv = Entladen)', vEnt),
  current: vF('Strom (A)', vEnt),
  voltage: vF('Spannung (V)', vEnt),
  temperature: vF('Temperatur (\u00b0C)', vEnt),
  color: vF('Farbe (z. B. #ff9800)', vText),
};
const vStatusFields = {
  size: vF('Durchmesser des Status-Kreises (Schieber, 0.5 bis 1.6, Standard 1)', { number: { mode: 'slider', min: 0.5, max: 1.6, step: 0.05 } }),
  font_size: vF('Schriftgr\u00f6\u00dfe (Schieber, 0.5 bis 2.5, Standard 1 = automatisch)', { number: { mode: 'slider', min: 0.5, max: 2.5, step: 0.05 } }),
  name: vF('Name (z. B. Garagentor, Fenster)', vText),
  entity: vF('Sensor / Entit\u00e4t (Tor, Fenster, Rauchmelder, Temperatur ...)', vEnt),
  entities: vF('Mehrere Sensoren (z. B. alle Fenster oder alle Rauchmelder)', { entity: { multiple: true } }),
  show: vF('Wo anzeigen (leer = Kopfzeile)', { select: { multiple: true, mode: 'list', options: [{ value: 'header', label: 'Kopfzeile' }, { value: 'info', label: 'Infozeile' }, { value: 'circles', label: 'Kreise unten (einer pro Sensor)' }] } }),
  at: vF('Abzeichen am Kreis mit diesem Namen (z. B. Garage / Keller)', vText),
  kind: vF('Art (leer = automatisch)', { select: { mode: 'dropdown', options: [{ value: 'garage', label: 'Garagentor' }, { value: 'window', label: 'Fenster' }, { value: 'door', label: 'T\u00fcr' }, { value: 'lock', label: 'Schloss' }, { value: 'smoke', label: 'Rauchmelder' }, { value: 'gas', label: 'Gasmelder' }, { value: 'co', label: 'CO-Melder' }, { value: 'water', label: 'Wassermelder' }, { value: 'problem', label: 'St\u00f6rung / Problem' }, { value: 'motion', label: 'Bewegung' }, { value: 'presence', label: 'Anwesenheit' }, { value: 'light', label: 'Licht' }, { value: 'switch', label: 'Schalter / Steckdose' }, { value: 'temperature', label: 'Temperatur' }, { value: 'humidity', label: 'Luftfeuchtigkeit' }, { value: 'sensor', label: 'Beliebiger Messwert oder Text' }] } }),
  icon: vF('Symbol (leer = passend zur Art)', { icon: {} }),
  icon_open: vF('Symbol im Zustand \u201eoffen/aktiv\u201c (optional)', { icon: {} }),
  open_text: vF('Text bei offen/aktiv (statt \u201eoffen\u201c, \u201eAlarm\u201c ...)', vText),
  closed_text: vF('Text bei zu/normal (statt \u201ezu\u201c, \u201eOK\u201c ...)', vText),
  decimals: vF('Nachkommastellen (Messwerte)', { number: { mode: 'box', min: 0, max: 6 } }),
  warn_above: vF('Messwert: Warnung (orange) \u00fcber', { number: { mode: 'box' } }),
  warn_below: vF('Messwert: Warnung (orange) unter', { number: { mode: 'box' } }),
  alert_above: vF('Messwert: Alarm (rot, blinkend) \u00fcber', { number: { mode: 'box' } }),
  alert_below: vF('Messwert: Alarm (rot, blinkend) unter', { number: { mode: 'box' } }),
  warn_states: vF('Text-Zust\u00e4nde mit Warnung (orange), mehrere m\u00f6glich', { text: { multiple: true } }),
  alert_states: vF('Text-Zust\u00e4nde mit Alarm (rot), mehrere m\u00f6glich', { text: { multiple: true } }),
  warn_after: vF('Rot und blinkend nach (Sekunden offen; bei Rauchmelder usw. sofort)', { number: { mode: 'box', min: 1 } }),
  hide_closed: vF('Abzeichen nur zeigen, wenn offen', { boolean: {} }),
  invert: vF('Sensor \u201ean\u201c bedeutet zu', { boolean: {} }),
  switch: vF('Schalter-Knopf (Entit\u00e4t, z. B. cover.garagentor; bei einem Sensor derselbe)', vEnt),
  switch_confirm: vF('Vor dem Schalten mit dem Knopf nachfragen', { boolean: {} }),
  toggle: vF('Antippen schaltet (Tor \u00f6ffnen/schlie\u00dfen, Schloss)', { boolean: {} }),
  confirm: vF('Vor dem Schalten nachfragen', { boolean: {} }),
};
const vList = (name, label, fields, labelField) => ({
  name,
  label,
  selector: { object: { multiple: true, label_field: labelField, fields } },
});
const vZoneFields = {
  ...vDevFields,
  frame: vF('Rahmen um Zone und Ger\u00e4te', { boolean: {} }),
  phases: vF('Phasen (kleine Kreise \u00fcber der Zone)', { object: { multiple: true, label_field: 'name', fields: vPhaseFields } }),
  devices: vF('Ger\u00e4te der Zone', { object: { multiple: true, label_field: 'name', fields: vDevFields } }),
};

const VAW_BG_OPTS = [
  ['default', 'Standard (Design von Home Assistant)'],
  ['transparent', 'Transparent'],
  ['dark', 'Dunkel'],
  ['black', 'Schwarz (OLED)'],
  ['light', 'Hell'],
  ['midnight', 'Mitternacht (Verlauf)'],
  ['aurora', 'Polarlicht (Verlauf)'],
  ['sunset', 'Abendrot (Verlauf)'],
  ['ocean', 'Ozean (Verlauf)'],
  ['forest', 'Wald (Verlauf)'],
  ['grid', 'Raster'],
  ['dots', 'Punkte'],
  ['color', 'Eigene Farbe'],
  ['gradient', 'Eigener Verlauf'],
  ['image', 'Eigenes Bild'],
];
const VAW_THEMES = {
  neon_night: { background: 'black', circle_style: 'neon', background_animation: 'stars' },
  glass_aurora: { background: 'aurora', circle_style: 'glass', background_animation: 'drift' },
  minimal_light: { background: 'light', circle_style: 'flat' },
  hex_tech: { background: 'midnight', circle_style: 'neon', background_animation: 'drift', node_shape: 'hexagon' },
  cozy_sunset: { background: 'sunset', circle_style: 'glass', node_shape: 'square' },
  ocean_calm: { background: 'ocean', circle_style: 'flat', background_animation: 'drift' },
  blueprint: { background: 'grid', circle_style: 'flat', node_shape: 'square' },
};
const VAW_THEME_OPTS = [['none', 'Keines'], ['neon_night', 'Neon-Nacht'], ['glass_aurora', 'Glas-Polarlicht'], ['minimal_light', 'Minimal hell'], ['hex_tech', 'Hex-Tech'], ['cozy_sunset', 'Gem\u00fctlich (Abendrot)'], ['ocean_calm', 'Ozean ruhig'], ['blueprint', 'Bauplan']];
// Sicherheit: Werte aus der Konfiguration landen in HTML, daher immer maskieren (auch Anf\u00fchrungszeichen f\u00fcr Attribute)
function vawEsc(t) {
  return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Farbwerte: nur harmlose Zeichen (Namen, #hex, rgb()/hsl()/var()/Verl\u00e4ufe); alles andere wird verworfen
function vawSafeCss(v) {
  return typeof v === 'string' && v.length <= 300 && /^[#\w(),.%\s/+-]+$/.test(v);
}

// Konfiguration vor der Verwendung s\u00e4ubern: unsichere Farben und Icon-Angaben entfernen
function vawClean(o, pk) {
  if (Array.isArray(o)) return o.map((x) => vawClean(x, pk));
  if (o && typeof o === 'object') {
    const r = {};
    Object.keys(o).forEach((k) => {
      const v = o[k];
      if (typeof v === 'string') {
        if (/colou?r|gradient|^(fill|stroke)$/i.test(k) || (k === 'background' && v.indexOf('(') >= 0)) {
          if (!vawSafeCss(v)) return;
        } else if (/icon/i.test(k) || pk === 'custom_icons' || k === 'url') {
          if (/["'<>`\\\s]/.test(v) || v.length > 500) return;
        }
      }
      r[k] = vawClean(v, k);
    });
    return r;
  }
  return o;
}

// Funken: leuchtender Kopf mit flimmerndem Schweif; Tropfen: Wassertropfen mit Glanzpunkt (Farbe kommt vom umgebenden Element)
function vawSpark(i) {
  const d = (0.7 + 0.35 * (i % 3)).toFixed(2);
  return '<circle r="8" opacity="0.2"><animate attributeName="r" values="6;9;6" dur="' + d + 's" repeatCount="indefinite"/></circle>'
    + '<circle r="3.6"/><circle cx="-6" cy="1.6" r="2.4" opacity="0.65"/><circle cx="-11" cy="-1.6" r="1.8" opacity="0.4"/>'
    + '<circle cx="-16" cy="1" r="1.2" opacity="0.22"><animate attributeName="opacity" values="0.1;0.35;0.1" dur="' + d + 's" repeatCount="indefinite"/></circle>'
    + '<circle cx="-3" cy="-4.6" r="1" opacity="0.5"><animate attributeName="opacity" values="0;0.8;0" dur="' + d + 's" repeatCount="indefinite"/></circle>';
}

function vawDrop() {
  return '<path d="M-9,0 C-4,-1.2 -1,-4.6 3,-4.6 C6.4,-4.6 8.4,-2.4 8.4,0 C8.4,2.4 6.4,4.6 3,4.6 C-1,4.6 -4,1.2 -9,0Z"/><circle cx="4.2" cy="-1.8" r="1.3" fill="#fff" opacity="0.55"/>';
}

function vawMk(kind, s) {
  if (kind === 'arrow') return `M${(-s * 1.2).toFixed(1)},${(-s * 0.95).toFixed(1)} L${(s * 1.4).toFixed(1)},0 L${(-s * 1.2).toFixed(1)},${(s * 0.95).toFixed(1)} L${(-s * 0.5).toFixed(1)},0 Z`;
  return `M0,${(-s * 1.15).toFixed(1)} L${(s * 1.15).toFixed(1)},0 L0,${(s * 1.15).toFixed(1)} L${(-s * 1.15).toFixed(1)},0 Z`;
}
function vawRnd(seed) {
  let x = seed;
  return () => {
    x = (x * 16807) % 2147483647;
    return x / 2147483647;
  };
}
function vawSparkEnts(n) {
  const cfg = n.cfg || {};
  const f = (x) => (x && typeof x === 'object' ? x.entity : x);
  const ik = n.key === 'grid' ? 'import_power' : n.key === 'battery' ? 'discharge_power' : null;
  const ok = n.key === 'grid' ? 'export_power' : n.key === 'battery' ? 'charge_power' : null;
  const a = ik && f(cfg[ik]);
  const b = ok && f(cfg[ok]);
  const out = [];
  if (a || b) {
    if (typeof a === 'string') out.push({ e: a, s: 1 });
    if (typeof b === 'string') out.push({ e: b, s: -1 });
  } else {
    const p = f(cfg.power);
    if (typeof p === 'string') out.push({ e: p, s: n.key === 'battery' && cfg.invert ? -1 : 1 });
  }
  return out;
}
// Formen: Kreis, abgerundetes Viereck, Sechseck. Ringe (Fortschritt) folgen derselben Form.
function vawShapeEl(shape, cx, cy, r, attrs) {
  if (shape === 'square') {
    const h = r * 0.92;
    return `<rect x="${(cx - h).toFixed(1)}" y="${(cy - h).toFixed(1)}" width="${(2 * h).toFixed(1)}" height="${(2 * h).toFixed(1)}" rx="${(r * 0.3).toFixed(1)}" ${attrs}/>`;
  }
  if (shape === 'hexagon') {
    const R = r * 1.04;
    const pts = [0, 60, 120, 180, 240, 300].map((a) => `${(cx + R * Math.cos((a * Math.PI) / 180)).toFixed(1)},${(cy + R * Math.sin((a * Math.PI) / 180)).toFixed(1)}`).join(' ');
    return `<polygon points="${pts}" stroke-linejoin="round" ${attrs}/>`;
  }
  return `<circle cx="${cx}" cy="${cy}" r="${r}" ${attrs}/>`;
}
function vawRingLen(shape, r, off) {
  if (shape === 'square') {
    const h = r * 0.92 + off;
    const rx = r * 0.3 + off;
    return 8 * (h - rx) + 2 * Math.PI * rx;
  }
  if (shape === 'hexagon') return 6 * (r * 1.04 + off / 0.866);
  return 2 * Math.PI * (r + off);
}
function vawRingEl(shape, cx, cy, r, off, attrs) {
  if (shape === 'square') {
    const h = r * 0.92 + off;
    const rx = r * 0.3 + off;
    const x0 = cx - h, x1 = cx + h, y0 = cy - h, y1 = cy + h;
    const d = `M${cx.toFixed(1)},${y0.toFixed(1)} H${(x1 - rx).toFixed(1)} A${rx.toFixed(1)},${rx.toFixed(1)} 0 0 1 ${x1.toFixed(1)},${(y0 + rx).toFixed(1)} V${(y1 - rx).toFixed(1)} A${rx.toFixed(1)},${rx.toFixed(1)} 0 0 1 ${(x1 - rx).toFixed(1)},${y1.toFixed(1)} H${(x0 + rx).toFixed(1)} A${rx.toFixed(1)},${rx.toFixed(1)} 0 0 1 ${x0.toFixed(1)},${(y1 - rx).toFixed(1)} V${(y0 + rx).toFixed(1)} A${rx.toFixed(1)},${rx.toFixed(1)} 0 0 1 ${(x0 + rx).toFixed(1)},${y0.toFixed(1)} Z`;
    return `<path d="${d}" ${attrs}/>`;
  }
  if (shape === 'hexagon') {
    const R = r * 1.04 + off / 0.866;
    const a = R * 0.866;
    const P = (dx, dy) => `${(cx + dx).toFixed(1)},${(cy + dy).toFixed(1)}`;
    const d = `M${P(0, -a)} L${P(R / 2, -a)} L${P(R, 0)} L${P(R / 2, a)} L${P(-R / 2, a)} L${P(-R, 0)} L${P(-R / 2, -a)} Z`;
    return `<path d="${d}" stroke-linejoin="round" ${attrs}/>`;
  }
  return `<circle cx="${cx}" cy="${cy}" r="${r + off}" ${attrs}${/stroke-dasharray/.test(attrs) ? ` transform="rotate(-90 ${cx} ${cy})"` : ''}/>`;
}
const VAW_LAY_OPTS = [{ value: 'horizontal', label: 'Waagrecht' }, { value: 'vertical', label: 'Senkrecht' }];
const VAW_LAY_VIEW_OPTS = VAW_LAY_OPTS.concat([{ value: 'orientation', label: 'Je nach Ausrichtung des Fensters' }]);
const VAW_SCHEMA = [
  vX('', 'Karte: Titel, Layout, Bedienung', [
    vT('title', 'Titel', 'Erscheint links oben in der Karte'),
    vG(vE('date', 'Datum-Sensor', 'z. B. sensor.date'), vE('time', 'Uhrzeit-Sensor', 'z. B. sensor.time')),
    vB('time_seconds', 'Uhrzeit mit Sekunden anzeigen'),
  vSel('layout', 'Layout', [['horizontal', 'Waagrecht'], ['vertical', 'Senkrecht (baut sich nach unten auf)'], ['orientation', 'Je nach Ausrichtung des Fensters']]),
    vG(vSel('layout_v', 'Fenster hochkant', [['horizontal', 'Waagrecht'], ['vertical', 'Senkrecht']]), vSel('layout_h', 'Fenster quer', [['horizontal', 'Waagrecht'], ['vertical', 'Senkrecht']])),
    vSel('compact', 'Kompakter Modus', [['off', 'Aus'], ['auto', 'Automatisch bei schmaler Karte'], ['on', 'Immer']]),
    vB('fullscreen_button', 'Vollbild-Knopf anzeigen'),
    vB('zoom', 'Zoomen und Verschieben (Strg + Mausrad, Pinch, Kn\u00f6pfe + / \u2212)'),
  ]),
  vX('', 'Ansichten (Tabs)', [
    vList('views', 'Ansichten (Tabs, ab 2 Eintr\u00e4gen sichtbar)', {
      name: vF('Name', vText),
      icon: vF('Icon', { icon: {} }),
      layout: vF('Layout dieser Ansicht (leer = wie die Karte)', { select: { mode: 'dropdown', options: VAW_LAY_VIEW_OPTS } }),
      layout_v: vF('… dabei Fenster hochkant', { select: { mode: 'dropdown', options: VAW_LAY_OPTS } }),
      layout_h: vF('… dabei Fenster quer', { select: { mode: 'dropdown', options: VAW_LAY_OPTS } }),
      show: vF('Nur zeigen (leer = alles): grid, solar, battery, devices, rest, status, status_circles, status_chips, zones oder ein Zonen-Name', { select: { multiple: true, custom_value: true, options: [{ value: 'grid', label: 'Netz' }, { value: 'solar', label: 'Solar' }, { value: 'battery', label: 'Batterie' }, { value: 'zones', label: 'Alle Zonen' }, { value: 'devices', label: 'Ger\u00e4te' }, { value: 'rest', label: 'Sammelkreis Rest' }, { value: 'status', label: 'Status: Kreise und Chips' }, { value: 'status_circles', label: 'Status: nur die Kreise unten' }, { value: 'status_chips', label: 'Status: nur die Chips oben' }] } }),
    }, 'name'),
    vT('default_view', 'Startansicht (Name; leer = erste)'),
  ]),
  vX('', 'Layout-Assistent und Zeitreise', [
    vB('layout_assistant', 'Layout-Assistent (Kreise per Ziehen verschieben, Knopf oben rechts)'),
    vB('time_travel', 'Zeitreise-Regler (Uhr-Knopf oben rechts)'),
    vN('time_travel_hours', 'Zeitreise: wie viele Stunden zur\u00fcck (1 \u2013 168, Standard 24)', undefined, { min: 1, max: 168, step: 1 }),
  ]),
  vX('grid', 'Netz', [
    vE('power', 'Leistung (ein Sensor)', 'Positiv = Bezug, negativ = Einspeisung. Alternativ unten getrennt eintragen.'),
    vG(vE('import_power', 'Bezug (W)'), vE('export_power', 'Einspeisung (W)')),
    ...vMeasure(),
    vE('frequency', 'Netzfrequenz (Hz)'),
    vE('price', 'Strompreis-Sensor', 'Erscheint als Chip in der Infozeile'),
    vG(vN('price_low', 'G\u00fcnstig bis (gr\u00fcn)'), vN('price_high', 'Teuer ab (rot)')),
    vB('price_circle', 'Rand des Netz-Kreises nach Preis f\u00e4rben'),
    ...vLook(),
    vG(vT('import_color', 'Farbe bei Bezug'), vT('export_color', 'Farbe bei Einspeisung')),
    vList('phases', 'Phasen L1/L2/L3 (kleine Kreise, bis 6)', vGridPhFields, 'name'),
    vX('peak', '15-Minuten-Spitze (Netzentgelte)', [
      vE('max', 'Monatsmaximum'),
      vE('live', 'Aktuelle Viertelstunde (live)'),
      vE('last', 'Letzte Viertelstunde'),
      vG(vN('warn_at', 'Warnung ab (%)', 'Standard 90', { min: 1, max: 100 }), vT('name', 'Beschriftung', 'Standard: Spitze 15 min')),
      vG(vT('ok_color', 'Farbe OK'), vT('warn_color', 'Farbe Warnung'), vT('alert_color', 'Farbe Alarm')),
    ]),
    vX('meter', 'Z\u00e4hlerst\u00e4nde (kWh)', [
      vE('import', 'Z\u00e4hlerstand Bezug'),
      vE('export', 'Z\u00e4hlerstand Einspeisung'),
      vG(vT('import_name', 'Beschriftung Bezug'), vT('export_name', 'Beschriftung Einspeisung')),
      vN('decimals', 'Nachkommastellen', 'Standard 1', { min: 0, max: 3 }),
    ]),
  ]),
  vX('solar', 'Solar', [
    vE('power', 'Leistung', 'Leer lassen: Summe der Panels'),
    vN('max_power', 'Installierte Leistung (W) f\u00fcr den Auslastungs-Ring', 'Leer = kein Ring', { min: 0, step: 100 }),
    ...vMeasure(),
    ...vLook(),
    vList('children', 'Einzelne Panels (bis 10, kleine Kreise)', vPanelFields, 'power'),
  ]),
  vX('battery', 'Batterie', [
    vE('power', 'Leistung (ein Sensor)', 'Positiv = Entladen'),
    vG(vE('discharge_power', 'Ausgangsleistung (Entladen)'), vE('charge_power', 'Eingangsleistung (Laden)')),
    vB('invert', 'Richtung des einzelnen Leistungssensors umkehren'),
    vE('soc', 'Ladestand (SOC)'),
    vB('soc_in_circle', 'Ladestand im Kreis statt als kleiner Kreis'),
    vB('soc_icon', 'Icon passt sich dem Ladestand an'),
    vB('soc_ring', 'Ring mit dem Ladestand um die Batterie'),
    vE('capacity', 'Kapazit\u00e4t (kWh)', 'Sensor, oder Zahl direkt in der YAML (z. B. 10)'),
    ...vMeasure(),
    ...vLook(),
    vG(vT('charge_color', 'Farbe beim Laden'), vT('discharge_color', 'Farbe beim Entladen')),
    vB('grid_to_battery', 'Netzbezug darf auch die Batterie laden (Punkte)'),
    vList('children', 'Einzelne Batterien (bis 10, kleine Kreise)', vBatFields, 'soc'),
  ]),
  vX('home', 'Haus', [
    vE('power', 'Leistung', 'Leer lassen: Summe aus Netz, Solar und Batterie'),
    ...vMeasure(),
    ...vLook(),
    vB('ring', 'Au\u00dfenring mit den Anteilen der Zonen/Ger\u00e4te'),
  ]),
  vX('', 'Zonen, Ger\u00e4te und Rest', [
  vList('zones', 'Zonen (z. B. Stockwerke, bis 6)', vZoneFields, 'name'),
    vB('zone_frames', 'Rahmen um jede Zone samt Ger\u00e4ten (einzeln pro Zone abschaltbar)'),
  vList('devices', 'Ger\u00e4te direkt am Haus', vDevFields, 'name'),
    vT('devices_name', 'Name der Zone f\u00fcr \u201eGer\u00e4te direkt am Haus\u201c', 'Nur wenn zus\u00e4tzlich Zonen existieren, Standard: Sonstige'),
    vB('rest', 'Sammelkreis "Rest" (Hausverbrauch minus alle Zonen und Ger\u00e4te)'),
  ]),
  vList('status', 'Status (Tore, Fenster, Rauchmelder, Sensoren, beliebige Entit\u00e4ten)', vStatusFields, 'name'),
  vX('info', 'Infozeile unter der Karte', [
    vB('autarky', 'Autarkie (live)'),
    vB('self_consumption', 'Eigenverbrauch (live)'),
    vB('battery_time', 'Akku: Restlaufzeit bzw. Zeit bis voll (braucht die Kapazit\u00e4t bei Batterie)'),
    vE('co2_entity', 'CO\u2082-Einsparung: Energiesensor (kWh, z. B. Solarertrag heute)'),
    vN('co2_factor', 'CO\u2082-Faktor in kg pro kWh', 'Standard 0.2', { min: 0, max: 2, step: 0.01 }),
    vList('items', 'Weitere Werte (z. B. Tageswerte in kWh)', {
      name: vF('Name', vText),
      entity: vF('Sensor', vEnt),
      icon: vF('Icon', { icon: {} }),
      decimals: vF('Nachkommastellen', { number: { mode: 'box', min: 0, max: 4 } }),
      unit: vF('Einheit (leer = vom Sensor)', vText),
    }, 'name'),
  ]),
  vX('', 'Aussehen: Design-Vorlage und Hintergrund', [
    vSel('theme', 'Design-Vorlage (setzt Hintergrund, Kreisstil, Animation, Form)', VAW_THEME_OPTS),
    vSel('background', 'Hintergrund (bei Tag)', VAW_BG_OPTS),
    vT('background_color', 'Eigene Farbe', 'Nur bei \u201eEigene Farbe\u201c, z. B. #1e293b oder rgb(30, 41, 59)'),
    vT('background_gradient', 'Eigener Verlauf (CSS)', 'Nur bei \u201eEigener Verlauf\u201c, z. B. linear-gradient(160deg, #0f172a, #334155)'),
    vT('background_image', 'Bildadresse', 'Nur bei \u201eEigenes Bild\u201c, z. B. /local/haus.jpg'),
    vG(vN('background_dim', 'Bild abdunkeln', '0 bis 0.9, Standard 0.35', { min: 0, max: 0.9, step: 0.05 }), vN('background_blur', 'Bild weichzeichnen (px)', '0 bis 30, Standard 0', { min: 0, max: 30 })),
    vSel('background_text', 'Schriftfarbe', [['auto', 'Automatisch'], ['light', 'Hell'], ['dark', 'Dunkel']]),
    vSel('background_animation', 'Animation', [['none', 'Keine'], ['drift', 'Wandernde Farbfl\u00e4chen'], ['stars', 'Funkelnde Sterne']]),
    vE('background_weather', 'Wetter-Entit\u00e4t (Regen, Schnee, Wolken \u2026 im Hintergrund)', 'z. B. weather.home; leer = kein Wetter-Effekt'),
    vSel('background_night', 'Nachts (Tag/Nacht-Automatik)', [['none', 'Aus (kein Wechsel)'], ...VAW_BG_OPTS.filter((o) => o[0] !== 'color' && o[0] !== 'gradient' && o[0] !== 'image')]),
    vE('background_night_entity', 'Sensor f\u00fcr Tag/Nacht', 'Standard sun.sun (Nacht = unter dem Horizont); bei anderen Entit\u00e4ten bedeutet \u201ean\u201c Nacht'),
  ]),
  vX('', 'Aussehen: Kreise (Form, Gr\u00f6\u00dfe, Stil, Icons)', [
    vSel('node_shape', 'Form der Kreise', [['circle', 'Kreis'], ['square', 'Viereck (abgerundet)'], ['hexagon', 'Sechseck']]),
    vN('node_size', 'Gr\u00f6\u00dfe aller Kreise (0.6 \u2013 1.4, Standard 1)', undefined, { min: 0.6, max: 1.4, step: 0.05 }),
    vB('font_follow_size', 'Schrift w\u00e4chst mit der Kreisgr\u00f6\u00dfe (pro Kreis \u00fcberschreibbar mit dem Schrift-Schieber)'),
    vSel('circle_style', 'Kreisstil', [['default', 'Standard'], ['flat', 'Flach (ohne Verlauf und Schatten)'], ['glass', 'Glas (halbtransparent)'], ['neon', 'Neon (d\u00fcnner Ring, starkes Leuchten)']]),
    vB('fill_level', 'F\u00fcllstand im Kreis (Batterie: Ladestand, Solar: Auslastung)'),
    vB('sparkline', 'Mini-Verlauf (Sparkline) in den Kreisen', 'Zeigt die letzten Stunden hinter dem Messwert'),
    vN('sparkline_hours', 'Zeitraum des Verlaufs in Stunden (1 \u2013 48)', undefined, { min: 1, max: 48, step: 1 }),
    vList('custom_icons', 'Eigene Icons und Bilder (verwenden als my:name im Icon-Feld)', {
      name: vF('Name', vText),
      url: vF('Bild-URL (z. B. /local/icons/wallbox.svg)', vText),
      tint: vF('Mit Icon-Farbe einf\u00e4rben (nur einfarbige Bilder)', { boolean: {} }),
    }, 'name'),
  ]),
  vX('', 'Aussehen: Linien und Punkte', [
    vSel('line_style', 'Linienstil', [['solid', 'Durchgezogen'], ['dashed', 'Gestrichelt'], ['dotted', 'Gepunktet'], ['flow', 'Fliegende Striche (animiert)'], ['neon', 'Neon (leuchtende Linien)']]),
    vSel('flow_marker', 'Marker auf den Linien', [['dot', 'Punkt'], ['arrow', 'Pfeil'], ['diamond', 'Raute'], ['spark', 'Funken (Partikel mit Schweif)'], ['drop', 'Tropfen'], ['particles', 'Partikel nach Quelle (Funken bei Solar/Batterie, Tropfen sonst)']]),
    vSel('flow_dots', 'Anzahl der Punkte pro Linie', [['1', 'Einer'], ['2', 'Zwei'], ['3', 'Drei'], ['auto', 'Automatisch (mehr bei mehr Leistung)']]),
    vSel('line_corners', 'Ecken der Linien', [['round', 'Abgerundet'], ['square', 'Eckig (rechte Winkel)']]),
    vB('line_gradient', 'Linien mit Farbverlauf (von Quelle zu Ziel)'),
    vB('line_labels', 'Schwebende Wert-Labels an allen Linien (einzeln pro Kreis per Schalter dort)'),
    vB('line_width', 'Linien werden mit der Leistung dicker'),
    vN('line_width_max', 'Maximale Linienst\u00e4rke', 'Standard 6', { min: 3, max: 12 }),
    vN('speed_max_w', 'Punkte am schnellsten bei (W)', 'Standard 3000', { min: 100, step: 100 }),
  ]),
  vX('', 'Aussehen: Leuchten, Zahlen, Antippen', [
    vB('glow', 'Aktive Kreise leuchten'),
    vB('pulse', 'Starke Verbraucher pulsieren'),
    vN('pulse_above_w', 'Pulsieren ab (W)', 'Standard 1000', { min: 0, step: 100 }),
    vB('gradient', 'Farbverlauf und Schatten in den Kreisen'),
    vN('number_scale', 'Gr\u00f6\u00dfe der Zahlen in den Kreisen', '1 = normal, 0.5 bis 1.6', { min: 0.5, max: 1.6, step: 0.1 }),
    vB('number_animation', 'Zahlen z\u00e4hlen sanft zum neuen Wert'),
    vB('tap_action', 'Antippen \u00f6ffnet den Verlauf des Sensors'),
    vB('dim_idle', 'Ger\u00e4te mit 0 W ausgrauen'),
    vG(vN('idle_below', 'Als \u201eaus\u201c gilt unter (W)', 'Standard 1', { min: 0 }), vN('idle_opacity', 'Deckkraft ausgegraut', '0 bis 1, Standard 0.4', { min: 0, max: 1, step: 0.1 })),
  ]),
  vX('calm', 'Ruhemodus (z. B. nachts)', [
    vB('always', 'Immer ruhig'),
    vE('entity', 'Sensor/Schalter: ruhig, solange \u201ean\u201c', 'z. B. input_boolean oder sun.sun (ruhig unter dem Horizont)'),
    vG({ name: 'from', label: 'Ruhig von', selector: { time: {} } }, { name: 'to', label: 'bis', selector: { time: {} } }),
    vSel('dots', 'Punkte im Ruhemodus', [['slow', 'Langsam (Standard)'], ['off', 'Aus'], ['normal', 'Normal']]),
    vN('dim', 'Helligkeit der Karte', '0.2 bis 1, Standard 0.75', { min: 0.2, max: 1, step: 0.05 }),
    vB('follow_system', 'Auch ruhig, wenn das Ger\u00e4t \u201eAnimationen reduzieren\u201c eingestellt hat'),
  ]),
  vX('', 'Grenzwerte (Warnfarbe)', [
    vB('limit_colors', 'Kreise und Werte rot f\u00e4rben, wenn ein Grenzwert verletzt wird'),
    vX('limits', 'Grenzwerte', [
      vG(vN('voltage_min', 'Spannung min. (V)', 'Standard 207'), vN('voltage_max', 'Spannung max. (V)', 'Standard 253')),
      vN('current_max', 'Strom max. (A)', 'Standard: keine Grenze'),
      vG(vN('frequency_min', 'Frequenz min. (Hz)', 'Standard 49.8', { step: 0.1 }), vN('frequency_max', 'Frequenz max. (Hz)', 'Standard 50.2', { step: 0.1 })),
      vT('color', 'Warnfarbe', 'Standard #e53935'),
    ]),
  ]),
];
function vSel(name, label, opts) {
  return { name, label, selector: { select: { mode: 'dropdown', options: opts.map(([value, l]) => ({ value, label: l })) } } };
}
// expandable ohne Namen = flach (gleiche Datenebene)
VAW_SCHEMA.forEach((s) => { if (s.type === 'expandable' && s.name === '') { s.flatten = true; delete s.name; } });

const VAW_MAIN = ['grid', 'solar', 'battery', 'home'];
const VAW_ON = ['line_width', 'glow', 'pulse', 'gradient', 'tap_action', 'limit_colors', 'zoom']; // Optionen, die standardm\u00e4\u00dfig an sind

// Layout je Fenster-Ausrichtung: layout: {v, h} <-> die drei Formularfelder
// layout, layout_v und layout_h. Gilt für die Karte und je Ansicht (Tab).
function vawLayPick(a) {
  for (let i = 0; i < a.length; i++) {
    const t = String(a[i] === undefined || a[i] === null ? '' : a[i]).trim().toLowerCase();
    if (t === 'vertical' || t === 'senkrecht' || t === 'v') return 'vertical';
    if (t === 'horizontal' || t === 'waagrecht' || t === 'h') return 'horizontal';
  }
  return null;
}
function vawLayToForm(o) {
  if (!o || typeof o !== 'object') return;
  const L = o.layout;
  if (L && typeof L === 'object') {
    o.layout_v = vawLayPick([L.v, L.portrait, L.hochkant]) || 'vertical';
    o.layout_h = vawLayPick([L.h, L.landscape, L.quer]) || 'horizontal';
    o.layout = 'orientation';
  }
  if (o.layout === 'orientation') {
    if (o.layout_v === undefined) o.layout_v = 'vertical';
    if (o.layout_h === undefined) o.layout_h = 'horizontal';
  }
}
function vawLayFromForm(o) {
  if (!o || typeof o !== 'object') return;
  if (o.layout === 'orientation') {
    o.layout = {
      v: o.layout_v === 'horizontal' ? 'horizontal' : 'vertical',
      h: o.layout_h === 'vertical' ? 'vertical' : 'horizontal',
    };
  }
  delete o.layout_v;
  delete o.layout_h;
}

// Konfiguration -> Formulardaten (Kurzformen in Listen werden zu Objekten, Standardwerte sichtbar gemacht)
function vawToForm(cfg) {
  const d = JSON.parse(JSON.stringify(cfg || {}));
  if (d.custom_icons && !Array.isArray(d.custom_icons) && typeof d.custom_icons === 'object') {
    d.custom_icons = Object.keys(d.custom_icons).map((k) => {
      const v = d.custom_icons[k];
      return typeof v === 'string' ? { name: k, url: v } : { name: k, url: v.url, tint: !!v.tint };
    });
  }
  const obj = (x, key) => (typeof x === 'string' ? { [key]: x } : x);
  const list = (arr, key) => (Array.isArray(arr) ? arr.map((x) => obj(x, key)) : arr);
  if (d.solar && d.solar.children) d.solar.children = list(d.solar.children, 'power');
  if (d.grid && d.grid.phases) d.grid.phases = list(d.grid.phases, 'power');
  if (d.battery && d.battery.children) d.battery.children = list(d.battery.children, 'soc');
  const dev = (x) => {
    const o = obj(x, 'power');
    if (o && o.children) o.children = list(o.children, 'power');
    return o;
  };
  if (d.devices) d.devices = d.devices.map(dev);
  if (d.status) d.status = list(d.status, 'entity').map((x) => (x.switch === true && x.entity && !(x.entities && x.entities.length) ? { ...x, switch: x.entity } : x));
  if (Array.isArray(d.zones)) {
    d.zones = d.zones.map((z) => {
      const zz = { ...z };
      if (zz.phases) zz.phases = list(zz.phases, 'power');
      if (zz.devices) zz.devices = zz.devices.map(dev);
      return zz;
    });
  }
  // temperature: {entity, decimals} -> Entit\u00e4t anzeigen, decimals merken
  const walk = (o) => {
    if (Array.isArray(o)) return o.forEach(walk);
    if (!o || typeof o !== 'object') return;
    if (o.temperature && typeof o.temperature === 'object') {
      const t = o.temperature;
      o.temperature = t.entity || '';
      if (t.decimals !== undefined) o._temp_decimals = t.decimals;
    }
    Object.values(o).forEach(walk);
  };
  walk(d);
  vawLayToForm(d);
  if (Array.isArray(d.views)) d.views.forEach(vawLayToForm);
  if (d.fullscreen_button === undefined) d.fullscreen_button = true;
  if (d.dim_idle === undefined) d.dim_idle = true;
  if (d.theme === undefined) d.theme = 'none';
  if (VAW_THEMES[d.theme]) Object.keys(VAW_THEMES[d.theme]).forEach((k) => { if (d[k] === undefined) d[k] = VAW_THEMES[d.theme][k]; });
  if (d.background === undefined) d.background = 'default';
  if (d.background_text === undefined) d.background_text = 'auto';
  if (d.background_animation === undefined) d.background_animation = 'none';
  if (d.background_night === undefined) d.background_night = 'none';
  if (d.circle_style === undefined) d.circle_style = 'default';
  if (d.node_shape === undefined) d.node_shape = 'circle';
  if (d.line_style === undefined) d.line_style = 'solid';
  d.flow_dots = d.flow_dots === undefined ? '1' : String(d.flow_dots);
  if (d.line_corners === undefined) d.line_corners = 'round';
  if (d.line_gradient === undefined) d.line_gradient = false;
  if (d.fill_level === undefined) d.fill_level = false;
  if (d.flow_marker === undefined) d.flow_marker = 'dot';
  if (d.number_animation === undefined) d.number_animation = false;
  if (d.sparkline === undefined) d.sparkline = false;
  if (d.sparkline_hours === undefined) d.sparkline_hours = 6;
  if (d.layout_assistant === undefined) d.layout_assistant = false;
  if (d.compact === undefined || d.compact === false) d.compact = 'off';
  else if (d.compact === true) d.compact = 'on';
  VAW_ON.forEach((k) => { if (d[k] === undefined) d[k] = true; });
  d.battery = { ...(d.battery || {}) };
  if (d.battery.soc_icon === undefined) d.battery.soc_icon = true;
  if (d.battery.soc_ring === undefined) d.battery.soc_ring = true;
  d.grid = { ...(d.grid || {}) };
  if (d.grid.price_circle === undefined) d.grid.price_circle = true;
  d.home = { ...(d.home || {}) };
  if (d.home.ring === undefined) d.home.ring = true;
  // Durchmesser-Schieber zeigen den Standardwert 1 (wird beim Speichern wieder entfernt)
  ['grid', 'solar', 'battery', 'home'].forEach((k) => { if (d[k] && typeof d[k] === 'object') { if (d[k].size === undefined) d[k].size = 1; if (d[k].font_size === undefined) d[k].font_size = 1; } });
  const sz1 = (a) => {
    if (!Array.isArray(a)) return;
    a.forEach((o) => {
      if (o && typeof o === 'object') {
        if (o.size === undefined) o.size = 1;
        if (o.font_size === undefined) o.font_size = 1;
        sz1(o.children);
        sz1(o.devices);
      }
    });
  };
  sz1(d.zones);
  sz1(d.devices);
  sz1(d.status);
  sz1(d.grid && d.grid.phases);
  sz1(d.solar && d.solar.children);
  sz1(d.battery && d.battery.children);
  return d;
}

// Formulardaten -> Konfiguration (leere Werte und Standardwerte entfernen)
function vawFromForm(data, prev) {
  const d = JSON.parse(JSON.stringify(data || {}));
  const walk = (o) => {
    if (Array.isArray(o)) return o.forEach(walk);
    if (!o || typeof o !== 'object') return;
    if (o._temp_decimals !== undefined) {
      if (o.temperature) o.temperature = { entity: o.temperature, decimals: o._temp_decimals };
      delete o._temp_decimals;
    }
    Object.values(o).forEach(walk);
  };
  walk(d);
  const keepT = {};
  if (VAW_THEMES[d.theme]) {
    Object.keys(VAW_THEMES[d.theme]).forEach((k) => {
      if (d[k] !== undefined && d[k] !== VAW_THEMES[d.theme][k]) keepT[k] = d[k];
      else delete d[k];
    });
  }
  if (d.theme === 'none') delete d.theme;
  vawLayFromForm(d);
  if (Array.isArray(d.views)) d.views.forEach(vawLayFromForm);
  if (d.fullscreen_button === true) delete d.fullscreen_button;
  if (d.dim_idle === true) delete d.dim_idle;
  if (d.background === 'default') delete d.background;
  if (d.background_text === 'auto') delete d.background_text;
  if (d.background_animation === 'none') delete d.background_animation;
  if (d.background_night === 'none') delete d.background_night;
  if (d.circle_style === 'default') delete d.circle_style;
  if (d.node_shape === 'circle') delete d.node_shape;
  if (d.node_size === '' || d.node_size === 1) delete d.node_size;
  if (d.compact === 'off') delete d.compact;
  if (d.layout_assistant === false) delete d.layout_assistant;
  if (d.rest === false) delete d.rest;
  ['zone_frames', 'time_travel', 'line_labels', 'font_follow_size'].forEach((k) => { if (d[k] === false) delete d[k]; });
  if (Array.isArray(d.custom_icons)) {
    const m = {};
    d.custom_icons.forEach((i) => { if (i && i.name && i.url) m[i.name] = i.tint ? { url: i.url, tint: true } : i.url; });
    if (Object.keys(m).length) d.custom_icons = m;
    else delete d.custom_icons;
  }
  {
    const strip1 = (o) => {
      if (Array.isArray(o)) o.forEach(strip1);
      else if (o && typeof o === 'object') {
        if (o.size === 1 || o.size === '') delete o.size;
        if (o.font_size === 1 || o.font_size === '') delete o.font_size;
        Object.keys(o).forEach((k) => strip1(o[k]));
      }
    };
    ['grid', 'solar', 'battery', 'home', 'zones', 'devices', 'status'].forEach((k) => strip1(d[k]));
  }
  if (d.sparkline === false) delete d.sparkline;
  if (d.line_style === 'solid') delete d.line_style;
  if (d.flow_dots === '1') delete d.flow_dots;
  else if (d.flow_dots !== undefined && d.flow_dots !== 'auto') d.flow_dots = Number(d.flow_dots);
  if (d.line_corners === 'round') delete d.line_corners;
  if (d.line_gradient === false) delete d.line_gradient;
  if (d.fill_level === false) delete d.fill_level;
  if (d.flow_marker === 'dot') delete d.flow_marker;
  if (d.number_animation === false) delete d.number_animation;
  if (d.sparkline_hours === 6) delete d.sparkline_hours;
  Object.keys(keepT).forEach((k) => { d[k] = keepT[k]; });
  VAW_ON.forEach((k) => { if (d[k] === true) delete d[k]; });
  if (d.battery) {
    if (d.battery.soc_icon === true) delete d.battery.soc_icon;
    if (d.battery.soc_ring === true) delete d.battery.soc_ring;
  }
  if (d.grid && d.grid.price_circle === true) delete d.grid.price_circle;
  ['autarky', 'self_consumption', 'battery_time'].forEach((k) => { if (d.info && d.info[k] === false) delete d.info[k]; });
  if (d.time_seconds === false) delete d.time_seconds;
  if (d.home && d.home.ring === true) delete d.home.ring;
  const clean = (o) => {
    if (Array.isArray(o)) {
      const a = o.map(clean).filter((x) => x !== undefined);
      return a.length ? a : undefined;
    }
    if (o && typeof o === 'object') {
      const r = {};
      Object.keys(o).forEach((k) => {
        const v = clean(o[k]);
        if (v !== undefined) r[k] = v;
      });
      return Object.keys(r).length ? r : undefined;
    }
    if (o === undefined || o === null || o === '' || (typeof o === 'number' && isNaN(o))) return undefined;
    return o;
  };
  const out = clean(d) || {};
  // Hauptkreise, die schon in der Konfiguration standen, bleiben auch ohne Inhalt erhalten (leer = Kreis ohne Sensor)
  VAW_MAIN.forEach((k) => {
    if (out[k] === undefined && prev && prev[k] !== undefined && k !== 'home') out[k] = {};
  });
  if (d.type) out.type = d.type;
  return out;
}

class FlowCardVAWEditor extends HTMLElement {
  setConfig(config) {
    this._config = config || {};
    this._ensure();
    this._form.data = vawToForm(this._config);
  }

  set hass(h) {
    this._hass = h;
    if (this._form) this._form.hass = h;
  }

  _ensure() {
    if (this._form) return;
    const note = document.createElement('div');
    note.style.cssText = 'font-size:12px;opacity:.7;margin:0 0 12px';
    note.textContent = 'Flow Card Testversion 1.2.3-dev \u00b7 Ansichten (views) und Positionen (positions) sowie Sonderf\u00e4lle (secondary, extra, Namen der Ringe usw.) bleiben erhalten und lassen sich im Code-Editor (\u201eYAML\u201c) erg\u00e4nzen.';
    const form = document.createElement('ha-form');
    form.schema = VAW_SCHEMA;
    form.hass = this._hass;
    form.computeLabel = (s) => s.label || s.name;
    form.computeHelper = (s) => s.helper || '';
    form.addEventListener('value-changed', (ev) => {
      ev.stopPropagation();
      const cfg = vawFromForm(ev.detail.value, this._config);
      this._config = cfg;
      this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: cfg }, bubbles: true, composed: true }));
    });
    this._form = form;
    this.appendChild(note);
    this.appendChild(form);
  }
}
if (!customElements.get('flow-card-vaw-dev-editor')) customElements.define('flow-card-vaw-dev-editor', FlowCardVAWEditor);

console.info('%c FLOW-CARD-VAW-DEV %c Version 1.2.3-dev ', 'background:#03a9f4;color:#fff', 'background:#333;color:#fff');
if (!customElements.get('flow-card-vaw-dev')) customElements.define('flow-card-vaw-dev', FlowCardVAW);
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c && c.type === 'flow-card-vaw-dev')) window.customCards.push({
  type: 'flow-card-vaw-dev',
  name: 'Flow Card (W / A / V) \u2013 Testversion',
  description: 'Energiefluss mit Leistung, Strom und Spannung (Testversion 1.2.3-dev)',
  preview: true,
  documentationURL: 'https://github.com/xFirefliesx/flow-card-vaw',
});
})();
