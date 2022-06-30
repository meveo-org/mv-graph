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
        console.log("click on a node : ", e.detail);
    }

    _dblclickNode(e) {
        console.log("Double click on this node : ", e.detail);
    }

    _rClickNode(e) {
        console.log("Right click on this node : ", e.detail);
    }

    _mouseOverNode(e) {
        console.log("Mouse over this node : ", e.detail);
    }


    _clickLink(e) {
        console.log("click on a link : ", e.detail);
    }

    _dblclickLink(e) {
        console.log("Double click on this link : ", e.detail);
    }

    _rClickLink(e) {
        console.log("Right click on this link : ", e.detail);
    }

    _mouseOverLink(e) {
        console.log("Mouse over this link : ", e.detail);
    }

    _svgClick(e) {
        console.clear();
        console.log("Reset console by not clicking a node or link : ", e.detail);
    }

    render() {
        return html`
            <mv-graph .data=${data} 
                @data-updated=${this.dataUpdated} 
                @node-click=${this._clickNode}
                @node-dblclick=${this._dblclickNode}
                @node-rclick=${this._rClickNode}
                @node-mouseover=${this._mouseOverNode}
                @link-click=${this._clickLink}
                @link-dblclick=${this._dblclickLink}
                @link-rclick=${this._rClickLink}
                @link-mouseover=${this._mouseOverLink}
                @svg-click=${this._svgClick}
            ></mv-graph>
        `;
    }
}

customElements.define("graph-listener", GraphListener);