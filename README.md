# mv-graph

[Demo of mv-graph](https://meveo-org.github.io/mv-graph/demo-shim/index.html)  

---

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation

```bash
npm i mv-graph
```

## Usage

```html
<script type="module">
  import 'mv-graph/mv-graph.js';
</script>

<mv-graph></mv-graph>
```



## Tooling configs

For most of the tools, the configuration is in the `package.json` to minimize the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`  

## Storage
Node position are stored in localStorage browser

## Events
### Left click
#### -Svg-
Do nothing / unselect selection
#### -Node-
Toggle node clicked
#### -Link-
Do nothing

---
### Drag
#### -Node-
Move the node  
If multiple node are selected, all nodes are moving
#### -Svg-
Move the svg

---
### Ctrl + click drag
#### -Svg-
Select multiple node on the graph.  
If ctrl is keep down selected node are keep in memory  

---
### Mousewheel
#### -Svg-
Zoom and unzoom

---
### Double Click
#### -Svg-
Zoom
