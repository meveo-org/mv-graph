import { LitElement, html } from "lit";
import "../src/MvGraph.js";
import data from "./miserables.js";
import * as d3 from "d3";

export default class GraphListener extends LitElement {
    constructor() {
        super();
    }

    dataUpdated(newData) {
        console.log(newData);
    }

    render() {
        return html`
            <mv-graph .data=${data} 
            ></mv-graph>
        `;
    }
}

customElements.define("graph-listener", GraphListener);