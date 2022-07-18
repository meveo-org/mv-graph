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

    /**
     * Dispatch a customEvent
     * @param {event} event 
     */
    dispatch(event) {
        console.log("Implement me !", event);
    }

    /**
     * Initialize simulation with node, link and force update
     */
    initializeSimulation() {
        this.simulation.nodes(this.graph.nodes);
        this.initializeForces();
        this.simulation.on("tick", this.ticked);
    }

    /**
     * Initialize display of the svg
     */
    initializeDisplay() {
        this.svg
            .on("click", (d3event, svg) => {
                if (d3event.explicitOriginalTarget.nodeName == "svg") {
                    this.differentClick(d3event, svg);
                }
            })

        // set the data and properties of link lines
        this.link = this.svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.graph.links)
            .enter().append("line")
            //Click on link event
            .on("click", (d3event, link) => {
                this.differentClick(d3event, link);
            })
            //Double click on link
            .on("dblclick", (d3event, link) => {
                //TODO
            })
            //Right Click on link event
            .on("contextmenu", (d3event, link) => {
                d3event.preventDefault();
                //TODO
            })
            //Mouseover on link event
            .on("mouseover", (d3event, link) => {
                //TODO
            })

        // set the data and properties of node circles
        this.node = this.svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(this.graph.nodes)
            .enter().append("circle")
            //Click on node event
            .on("click", (d3event, node) => {
                this.differentClick(d3event, node);
            })
            //Double click on node
            .on("dblclick", (d3event, node) => {
                //TODO
            })
            //Right Click on node event
            .on("contextmenu", (d3event, node) => {
                d3event.preventDefault();
                //TODO
            })
            //Mouseover on node event
            .on("mouseover", (d3event, node) => {
                //TODO
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

    /**
     * Update Display of the svg
     */
    updateDisplay() {
        this.node.attr("r", forceProperties.collide.radius)
            .attr("stroke", forceProperties.charge.strength > 0 ? "blue" : "red")
            .attr("stroke-width", forceProperties.charge.enabled == false ? 0 : Math.abs(forceProperties.charge.strength) / 15);

        this.link.attr("stroke-width", forceProperties.link.enabled ? 3 : .5)
            .attr("opacity", forceProperties.link.enabled ? 1 : 0);
    }

    /**
     * Display svg
     */
    displaySvg() {
        this.initializeDisplay();
        this.initializeSimulation();
    }

    /**
     * Update graph position and force
     */
    ticked = () => {
        let widthNb = this.widthR;
        let heightNb = this.heightR;
        if (this.link && this.node) {
            this.link
                .attr("x1", function (d) { return d.source.x = Math.round(Math.max(forceProperties.collide.radius, Math.min(widthNb - forceProperties.collide.radius, d.source.x))); })
                .attr("y1", function (d) { return d.source.y = Math.round(Math.max(forceProperties.collide.radius, Math.min(heightNb - forceProperties.collide.radius, d.source.y))); })
                .attr("x2", function (d) { return d.target.x = Math.round(Math.max(forceProperties.collide.radius, Math.min(widthNb - forceProperties.collide.radius, d.target.x))); })
                .attr("y2", function (d) { return d.target.y = Math.round(Math.max(forceProperties.collide.radius, Math.min(heightNb - forceProperties.collide.radius, d.target.y))); });

            this.node
                .attr("cx", function (d) { return d.x = Math.round(Math.max(forceProperties.collide.radius, Math.min(widthNb - forceProperties.collide.radius, d.x))); })
                .attr("cy", function(d) { return d.y = Math.round(Math.max(forceProperties.collide.radius, Math.min(heightNb - forceProperties.collide.radius, d.y))); })
                .attr("class", "node ci-node-element");
            d3.select('#alpha_value').style('flex-basis', (this.simulation.alpha() * 100) + '%');
        }
    }

    /**
     * Initialize force
     */
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

    /**
     * 
     */
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

    /**
     * Start drag a node
     * @param {event} event 
     * @param {coords} d 
     */
    dragstarted = (event, d) => {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    /**
     * Drag a node
     * @param {event} event 
     * @param {coords} d 
     */
    dragged = (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
    }

    /**
     * End drag a node
     * @param {event} event 
     * @param {coords} d 
     */
    dragended = (event, d) => {
        if (!event.active) this.simulation.alphaTarget(0.0001);
        d.fx = null;
        d.fy = null;
    }

    /**
     * Redirect according to the click
     * @param {click} d3event 
     * @param {objectClicked} object 
     */
    differentClick = (d3event, object) => {

        if (!d3event.ctrlKey) {
            this.isSelectionning = false;
            this.svg.selectAll("circle.selectedNode").classed("selectedNode", false);
        }

        // Ctrl click
        if (d3event.ctrlKey) {
            this.svg.on("mousedown", (d3event) => {
                this.isSelectionning = true;
                this.leftUp = [d3event.clientX, d3event.clientY];
                this.svg.append("rect")
                    .attr("class", "rectangleSelection")
                    .attr("x", this.leftUp[0] )
                    .attr("y", this.leftUp[1] )
                    .attr("width", 0)
                    .attr("height", 0)
                    .attr('stroke', 'black')
                    .attr('stroke-dasharray', '10px')
                    .attr('stroke-opacity','1')
                    .attr('fill','transparent');
            }).on("mousemove", (mouseMove) => {
                if (mouseMove.ctrlKey && this.isSelectionning) {
                    if (mouseMove.clientX - this.leftUp[0] > 1) {
                        this.svg.select("rect")
                            .attr("width", mouseMove.clientX - this.leftUp[0]);
                    } else {
                        this.svg.select("rect")
                            .attr("width", Math.abs(mouseMove.clientX - this.leftUp[0]))
                            .attr("x", (this.leftUp[0] - Math.abs(mouseMove.clientX - this.leftUp[0]) ))
                    }
            
                    if (mouseMove.clientY - this.leftUp[1] > 1) {
                        this.svg.select("rect")
                            .attr("height", mouseMove.clientY - this.leftUp[1]);
                    } else {
                        this.svg.select("rect")
                            .attr("height", Math.abs(mouseMove.clientY - this.leftUp[1]))
                            .attr("y", (this.leftUp[1] - Math.abs(mouseMove.clientY - this.leftUp[1]) ));
                    }
                    this.svg.selectAll("circle.ci-node-element").each(function (/* data, index */) {
                        if (d3.select(this.parentNode.parentNode).select("rect")._groups[0][0]) {
                            let rectangle = d3.select(this.parentNode.parentNode).select("rect")._groups[0][0];
                            let leftUpAno = [
                                parseInt(rectangle.getAttribute("x")), 
                                parseInt(rectangle.getAttribute("y"))
                            ];
                            let rightUpAno = [
                                parseInt(rectangle.getAttribute("x")), 
                                parseInt(rectangle.getAttribute("y")) + parseInt(rectangle.getAttribute("height"))
                            ];
                            let leftBottomAno = [
                                parseInt(rectangle.getAttribute("x")) + parseInt(rectangle.getAttribute("width")),
                                parseInt(rectangle.getAttribute("y"))
                            ];
                            let rightBottomAno = [
                                parseInt(rectangle.getAttribute("x")) + parseInt(rectangle.getAttribute("width")), 
                                parseInt(rectangle.getAttribute("y")) + parseInt(rectangle.getAttribute("height"))
                            ];
                            if (
                                !d3.select(this).classed("selectedNode") &&
                                leftUpAno[0] < this.getAttribute("cx") &&
                                leftUpAno[1] < this.getAttribute("cy") &&

                                rightUpAno[0] < this.getAttribute("cx") &&
                                rightUpAno[1] > this.getAttribute("cy") &&

                                leftBottomAno[0] > this.getAttribute("cx") &&
                                leftBottomAno[1] < this.getAttribute("cy") &&

                                rightBottomAno[0] > this.getAttribute("cx") &&
                                rightBottomAno[1] > this.getAttribute("cy")
                            ) {
                                d3.select(this)
                                    .classed( "selection", true)
                                    .classed( "selectedNode", true);
                            }
                        }
                    })
                }
            }).on("mouseup", () => {
                this.svg.selectAll("rect").remove();
                this.svg.selectAll('circle.ci-node-element.selection').classed( "selection", false);
            });

        // Shift click
        } else if (d3event.shiftKey) {
            console.log("shift key pressed");

        // Alt click
        } else if (d3event.altKey) {
            console.log("alt key pressed");

        // Simple click
        } else {
            console.log("simple click");
            console.log("Element on click => ", object);
        }
    }
}


