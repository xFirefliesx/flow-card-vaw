#!/usr/bin/env python3
# Erzeugt flow-card-vaw-dev.js aus flow-card-vaw.js.
# Die Testversion meldet sich als custom:flow-card-vaw-dev an und laeuft damit
# neben der HACS-Version. Aenderungen immer in flow-card-vaw.js machen.
import io
import os
import re

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = io.open(os.path.join(root, 'flow-card-vaw.js'), encoding='utf-8').read()
ver = re.search(r"FLOW-CARD-VAW %c Version ([0-9.]+)", src).group(1)

d = src
d = d.replace("document.createElement('flow-card-vaw-editor')", "document.createElement('flow-card-vaw-dev-editor')")
# beim zweiten Laden derselben Datei nicht abstuerzen (Ressource doppelt eingetragen, Neuladen)
d = d.replace("customElements.define('flow-card-vaw-editor', FlowCardVAWEditor);",
              "if (!customElements.get('flow-card-vaw-dev-editor')) customElements.define('flow-card-vaw-dev-editor', FlowCardVAWEditor);")
d = d.replace("customElements.define('flow-card-vaw', FlowCardVAW);",
              "if (!customElements.get('flow-card-vaw-dev')) customElements.define('flow-card-vaw-dev', FlowCardVAW);")
d = d.replace("window.customCards.push({\n  type: 'flow-card-vaw',",
              "if (!window.customCards.some((c) => c && c.type === 'flow-card-vaw-dev')) window.customCards.push({\n  type: 'flow-card-vaw-dev',")
d = d.replace("  name: 'Flow Card (W / A / V)',", "  name: 'Flow Card (W / A / V) \\u2013 Testversion',")
d = d.replace("console.info('%c FLOW-CARD-VAW %c Version " + ver + " '", "console.info('%c FLOW-CARD-VAW-DEV %c Version " + ver + "-dev '")
d = d.replace("Spannung (Version " + ver + ")'", "Spannung (Testversion " + ver + "-dev)'")
d = d.replace("'Flow Card Version " + ver + " \\u00b7", "'Flow Card Testversion " + ver + "-dev \\u00b7")

for probe in ["flow-card-vaw-dev-editor", "customElements.get('flow-card-vaw-dev')", "type: 'flow-card-vaw-dev'", "FLOW-CARD-VAW-DEV"]:
    assert probe in d, 'nicht ersetzt: ' + probe

head = ("// Testversion der Flow Card - Kartentyp: custom:flow-card-vaw-dev\n"
        "// Diese Datei wird von tools/build-dev.py erzeugt, Aenderungen bitte in flow-card-vaw.js machen.\n"
        "(() => {\n")
io.open(os.path.join(root, 'flow-card-vaw-dev.js'), 'w', encoding='utf-8').write(head + d + "})();\n")
print('flow-card-vaw-dev.js aus Version ' + ver + ' erzeugt')
