import * as d3 from "d3";

/**
 * Force properties of the graph
 */
const forceProperties = {
    center: {
        x: .5,
        y: .5
    },
    charge: {
        enabled: true,
        strength: -50,
        distanceMin: 20,
        distanceMax: 200
    },
    collide: {
        enabled: true,
        strength: 1,
        iterations: 1,
        radius: 10
    },
    forceX: {
        enabled: false,
        strength: .1,
        x: .5
    },
    forceY: {
        enabled: false,
        strength: .1,
        y: .5
    },
    link: {
        enabled: true,
        distance: 50,
        iterations: 1
    }
};

/**
 * Graph class generator
 */
export default class D3Graph {

    constructor(svg, data, width, height) {
        this.data = data;

        this.svg = d3.select(svg);
        this.width = +this.svg.node().getBoundingClientRect().width;
        this.height = +this.svg.node().getBoundingClientRect().height;

        // svg objects
        this.link = null;
        this.node = null;
        // the data - an object with nodes and links
        this.graph = data;

        //graph dimension
        this.widthR = width;
        this.heightR = height;

        this.simulation = d3.forceSimulation();
    }

    dispatch(event) {
        console.log("Implement me !", event);
    }

    initializeSimulation() {
        this.simulation.nodes(this.graph.nodes);
        this.initializeForces();
        this.simulation.on("tick", this.ticked);
    }

    initializeDisplay() {
        // set the data and properties of link lines
        this.link = this.svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.graph.links)
            .enter().append("line")
            //Click on link event
            .on("click", (link) => {
                const event = new CustomEvent("link-click", {
                    detail: link,
                    bubbles: true
                });
                this.dispatch(event);
            })
            //Double click on link
            .on("dblclick", (link) => {
                const event = new CustomEvent("link-dblclick", {
                    detail: link,
                    bubbles: true
                });
                this.dispatch(event);
            })
            //Right Click on link event
            .on("contextmenu", (link) => {
                link.preventDefault();
                const event = new CustomEvent("link-rclick", {
                    detail: link,
                    bubbles: true
                });
                this.dispatch(event);
            })
            //Mouseover on link event
            .on("mouseover", (link) => {
                const event = new CustomEvent("link-mouseover", {
                    detail: link,
                    bubbles: true
                });
                this.dispatch(event);
            })

        // set the data and properties of node circles
        this.node = this.svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(this.graph.nodes)
            .enter().append("circle")
            //Click on node event
            .on("click", (node) => {
                const event = new CustomEvent("node-click", {
                    detail: node,
                    bubbles: true
                });
                this.dispatch(event);
            })
            //Double click on node
            .on("dblclick", (node) => {
                const event = new CustomEvent("node-dblclick", {
                    detail: node,
                    bubbles: true
                });
                this.dispatch(event);
            })
            //Right Click on node event
            .on("contextmenu", (node) => {
                node.preventDefault();
                const event = new CustomEvent("node-rclick", {
                    detail: node,
                    bubbles: true
                });
                this.dispatch(event);
            })
            //Mouseover on node event
            .on("mouseover", (node) => {
                const event = new CustomEvent("node-mouseover", {
                    detail: node,
                    bubbles: true
                });
                this.dispatch(event);
            })
            .call(d3.drag()
                .on("start", this.dragstarted)
                .on("drag", this.dragged)
                .on("end", this.dragended));

        // node tooltip
        this.node.append("title")
            .text(function (d) { return d.id; });
        // visualize the graph
        this.updateDisplay();
    }

    updateDisplay() {
        this.node.attr("r", forceProperties.collide.radius)
            .attr("stroke", forceProperties.charge.strength > 0 ? "blue" : "red")
            .attr("stroke-width", forceProperties.charge.enabled == false ? 0 : Math.abs(forceProperties.charge.strength) / 15);

        this.link.attr("stroke-width", forceProperties.link.enabled ? 3 : .5)
            .attr("opacity", forceProperties.link.enabled ? 1 : 0);
    }

    displaySvg() {
        this.initializeDisplay();
        this.initializeSimulation();
    }

    ticked = () => {
        let widthNb = this.widthR;
        let heightNb = this.heightR;
        if (this.link && this.node) {
            this.link
                .attr("x1", function (d) { return d.source.x = Math.max(forceProperties.collide.radius, Math.min(widthNb - forceProperties.collide.radius, d.source.x)); })
                .attr("y1", function (d) { return d.source.y = Math.max(forceProperties.collide.radius, Math.min(heightNb - forceProperties.collide.radius, d.source.y)); })
                .attr("x2", function (d) { return d.target.x = Math.max(forceProperties.collide.radius, Math.min(widthNb - forceProperties.collide.radius, d.target.x)); })
                .attr("y2", function (d) { return d.target.y = Math.max(forceProperties.collide.radius, Math.min(heightNb - forceProperties.collide.radius, d.target.y)); });

            this.node
                .attr("cx", function (d) { return d.x = Math.max(forceProperties.collide.radius, Math.min(widthNb - forceProperties.collide.radius, d.x)); })
                .attr("cy", function(d) { return d.y = Math.max(forceProperties.collide.radius, Math.min(heightNb - forceProperties.collide.radius, d.y)); });
            d3.select('#alpha_value').style('flex-basis', (this.simulation.alpha() * 100) + '%');
        }
    }

    initializeForces() {
        // add forces and associate each with a name
        this.simulation
            .force("link", d3.forceLink())
            .force("charge", d3.forceManyBody())
            .force("collide", d3.forceCollide())
            .force("center", d3.forceCenter())
            .force("forceX", d3.forceX())
            .force("forceY", d3.forceY());
        // apply properties to each of the forces
        this.updateForces();
    }

    updateForces() {
        // get each force by name and update the properties
        this.simulation.force("center")
            .x(this.width * forceProperties.center.x)
            .y(this.height * forceProperties.center.y);
        this.simulation.force("charge")
            .strength(forceProperties.charge.strength * forceProperties.charge.enabled)
            .distanceMin(forceProperties.charge.distanceMin)
            .distanceMax(forceProperties.charge.distanceMax);
        this.simulation.force("collide")
            .strength(forceProperties.collide.strength * forceProperties.collide.enabled)
            .radius(forceProperties.collide.radius)
            .iterations(forceProperties.collide.iterations);
        this.simulation.force("forceX")
            .strength(forceProperties.forceX.strength * forceProperties.forceX.enabled)
            .x(this.width * forceProperties.forceX.x);
        this.simulation.force("forceY")
            .strength(forceProperties.forceY.strength * forceProperties.forceY.enabled)
            .y(this.height * forceProperties.forceY.y);
        this.simulation.force("link")
            .id(function (d) { return d.id; })
            .distance(forceProperties.link.distance)
            .iterations(forceProperties.link.iterations)
            .links(forceProperties.link.enabled ? this.graph.links : []);

        // updates ignored until this is run
        // restarts the simulation (important if simulation has already slowed down)
        this.simulation.alpha(1).restart();
    }

    dragstarted = (event, d) => {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    dragged = (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
    }

    dragended = (event, d) => {
        if (!event.active) this.simulation.alphaTarget(0.0001);
        d.fx = null;
        d.fy = null;
    }
}


