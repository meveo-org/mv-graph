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

    _clickNode(e) {
        console.clear();
        console.log("click on a node : ", e.detail);
    }

    _clickLink(e) {
        console.clear();
        console.log("click on a link : ", e.detail);
    }

    _dblclickNode(e) {
        console.clear();
        console.log("Double click on this node : ", e);
    }

    _dblclickLink(e) {
        console.clear();
        console.log("Double click on this link : ", e);
    }

    _mouseOverNode(e) {
        console.log("Mouse over this node : ", e);
    }

    _mouseOverLink(e) {
        console.log("Mouse over this link : ", e);
    }

    render() {
        return html`
            <mv-graph .data=${data} 
                @data-updated=${this.dataUpdated} 
                @node-click=${this._clickNode}
                @node-dblclick=${this._dblclickNode}
                @node-mouseover=${this._mouseOverNode}
                @link-click=${this._clickLink}
                @link-dblclick=${this._dblclickLink}
                @link-mouseover=${this._mouseOverLink}
            ></mv-graph>
        `;
    }
}

customElements.define("graph-listener", GraphListener);