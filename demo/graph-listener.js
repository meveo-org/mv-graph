import { LitElement, html } from "lit";
import "../src/MvGraph";
import data from "./miserables.js";

export default class GraphListener extends LitElement {
    constructor() {
        super();
    }

    dataUpdated(newData) {
      console.log(newData);
    }

    _focusNode(e) {
      console.clear();
      console.log(e.detail);
  }
  
    render() {
        return html`
            <mv-graph .data=${data} @data-updated=${this.dataUpdated} @node-click=${this._focusNode}></mv-graph>
        `;
    }
}

customElements.define("graph-listener", GraphListener);