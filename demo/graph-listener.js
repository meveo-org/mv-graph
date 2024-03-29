import { LitElement, html } from "lit";
import "/mv-graph.js";
import data from "./miserables.js";

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