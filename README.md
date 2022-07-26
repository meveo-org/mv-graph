# [mv-graph](https://meveo-org.github.io/mv-graph/)

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
Node position is stored in localStorage browser

## Events
### Left click
#### Svg
Do nothing / unselect selection
#### Node
Toggle node clicked
#### Link
Do nothing

---
### Drag
#### Node
Move the node  
If multiple node are selected, all node are moving

---
### Ctrl + click drag
Select multiple node on the graph.  
If ctrl is keep down selected node are keep in memory  
