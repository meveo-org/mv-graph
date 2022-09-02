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

    svgInfo(e) {
        //TODO local storage or serveur storage
        localStorage.setItem(
            "reloadInfo", e.detail
        )
        console.log(e.detail);
    }

    render() {
        return html`
            <mv-graph 
                .data=${data}
                @svg-info=${this.svgInfo}
            >
            </mv-graph>
        `;
    }
}

customElements.define("graph-listener", GraphListener);