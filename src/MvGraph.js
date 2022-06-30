import { html, css, LitElement } from 'lit';

import D3Graph from './D3Graph.js';

export class MvGraph extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--mv-graph-text-color, #000);
      }

      .links line {
        stroke: #787878;
      }
  
      .nodes circle {
        pointer-events: all;
        stroke : #787878;
      }

      svg {
        border-style: solid;
      }
    `;
  }

  static get properties() {
    return {
      id: { type: String , arttribute: true},
      data: { type: Object },
    };
  }

  constructor() {
    super();
  }

  firstUpdated() {
    const svg = this.shadowRoot.querySelector("svg");
    this.graph = new D3Graph(svg, this.data, 1500, 900);
    this.graph.dispatch = (e) => this.dispatchEvent(e);
    this.graph.displaySvg();
  }

  // _tryFocus(e) {
  //   if (e) {
  //     const detail = e.explicitOriginalTarget;
  //     const event = new CustomEvent('focus', {
  //       detail,
  //       bubbles: true
  //     });
  //     this.dispatchEvent(event);
  //   }
  // }

  render() {
    return html`
      <svg width="1500px" height="900px"></svg>
    `;
  }
}
