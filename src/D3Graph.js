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
        strength: -80,
        distanceMin: 1,
        distanceMax: 200
    },
    collide: {
        enabled: true,
        strength: 0.7,
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
        distance: 30,
        iterations: 1
    }
};

const colourPalette = [
    "#fbefcc", 
    "#f9ccac", 
    "#f4a688", 
    "#e0876a", 
    "#fff2df", 
    "#d9ad7c", 
    "#a2836e", 
    "#674d3c", 
    "#f9d5e5", 
    "#5b9aa0", 
    "#d6d4e0", 
    "#b8a9c9", 
    "#622569", 
    "#c83349", 
    "#96ceb4",
    "#1d9964"
];

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

        this.updateSimu = true;

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
            });
            // .call(d3.zoom().on("zoom", (event) => {
            //     this.svg.selectAll("line.link").attr('transform', event.transform);
            //     this.svg.selectAll("circle.node").attr("transform", event.transform);
            // }));

        // set the data and properties of link lines
        this.link = this.svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.graph.links)
            .enter().append("line")
            .attr("class", "link ci-link-element")
            //Click on link event
            .on("click", (d3event, link) => {
                this.differentClick(d3event, link);
            })
            //Double click on link
            .on("dblclick", () => {
                //TODO
            })
            //Right Click on link event
            .on("contextmenu", (d3event) => {
                d3event.preventDefault();
                //TODO
            })
            //Mouseover on link event
            .on("mouseover", () => {
                //TODO
            })

        // set the data and properties of node circles
        this.node = this.svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(this.graph.nodes)
            .enter().append("circle")
            .attr("class", "node ci-node-element")
            //Click on node event
            .on("click", (d3event, node) => {
                this.differentClick(d3event, node);
            })
            //Double click on node
            .on("dblclick", () => {
                //TODO
            })
            //Right Click on node event
            .on("contextmenu", (d3event) => {
                d3event.preventDefault();
                //TODO
            })
            //Mouseover on node event
            .on("mouseover", () => {
                //TODO
            }).call(d3.drag()
                .on("start", this.dragstarted)
                .on("drag", this.dragged)
                .on("end", this.dragended));

        // visualize the graph
        this.updateDisplay();
    }

    /**
     * Update Display of the svg
     */
    updateDisplay() {
        this.node.each(function(node) {
            let radius = 5;
            d3.select(this.parentNode.parentNode).selectAll("line.link.ci-link-element").each((link) => {
                if ((node.id == link.source) || (node.id == link.target)) {
                    radius += .5;
                }
            });
            d3.select(this).attr("r", radius);
        });

        this.node.each(function(datum) {
            if (datum.grp) {
                d3.select(this)
                    .attr("fill", colourPalette[datum.grp]);
            }
        });

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
        if (this.updateSimu && (this.updateSimu == null || this.updateSimu == true)) {
            this.initializeForces();
            this.updateSimu = null;
        } else if (!this.updateSimu && this.updateSimu != null) {
            this.removeForces();
        }
        let widthNb = this.widthR;
        let heightNb = this.heightR;
        this.link
            .attr("x1", function (d) { return d.source.x = Math.max(forceProperties.collide.radius, Math.min(widthNb - forceProperties.collide.radius, d.source.x)); })
            .attr("y1", function (d) { return d.source.y = Math.max(forceProperties.collide.radius, Math.min(heightNb - forceProperties.collide.radius, d.source.y)); })
            .attr("x2", function (d) { return d.target.x = Math.max(forceProperties.collide.radius, Math.min(widthNb - forceProperties.collide.radius, d.target.x)); })
            .attr("y2", function (d) { return d.target.y = Math.max(forceProperties.collide.radius, Math.min(heightNb - forceProperties.collide.radius, d.target.y)); });

        this.node
            .attr("cx", function (d) { return d.x = Math.max(forceProperties.collide.radius, Math.min(widthNb - forceProperties.collide.radius, d.x)); })
            .attr("cy", function(d) { return d.y = Math.max(forceProperties.collide.radius, Math.min(heightNb - forceProperties.collide.radius, d.y)); });
        d3.select('#alpha_value').style('flex-basis', (this.simulation.alpha()*100) + '%');
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
     * RemoveForces from graph to freeze node position
     */
    removeForces() {
        this.simulation
            .force("link", null)
            .force("charge", null)
            .force("collide", null)
            .force("center", null)
            .force("forceX", null)
            .force("forceY", null);
    }

    /**
     * Update forces of the graph
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
     * @param {object} d 
     */
    dragstarted = (event, d) => {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    /**
     * Drag a node or all selected node
     * @param {event} event 
     * @param {object} d 
     */
    dragged = (event, d) => {
        let selectedNode = this.svg.selectAll("circle.node.ci-node-element.selectedNode");
        if (selectedNode._groups[0].length > 0) {
            let DragSelectedNode = false;
            this.svg.selectAll("circle.node.ci-node-element.selectedNode").each((object) => {
                if (object == d) {
                    DragSelectedNode = true;
                }
            });
            if (DragSelectedNode) {
                this.svg.selectAll("circle.node.ci-node-element.selectedNode").each((object) => {
                    let OldPoint = [d.x, d.y];
                    if (object == d) {
                        d.fx = event.x;
                        d.fy = event.y;
                    } else {
                        let translation = [
                            event.x - OldPoint[0],
                            event.y - OldPoint[1]
                        ];
                        object.x += translation[0];
                        object.y += translation[1];
                    }
                })
            }
        } else if (selectedNode._groups[0].length == 0) {
            d.fx = event.x;
            d.fy = event.y;
        }
    }

    /**
     * End drag a node
     * @param {event} event 
     * @param {object} d 
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
                    .attr('stroke', 'white')
                    .attr('stroke-opacity','1')
                    .attr('fill','white')
                    .attr('fill-opacity', '.25')
                    .attr("rx", 5)
                    .attr("ry", 5);
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
                            } else if (
                                !d3.select(this).classed("selectedNode") ||
                                !(leftUpAno[0] < this.getAttribute("cx")) ||
                                !(leftUpAno[1] < this.getAttribute("cy")) ||

                                !(rightUpAno[0] < this.getAttribute("cx")) ||
                                !(rightUpAno[1] > this.getAttribute("cy")) ||

                                !(leftBottomAno[0] > this.getAttribute("cx")) ||
                                !(leftBottomAno[1] < this.getAttribute("cy")) ||

                                !(rightBottomAno[0] > this.getAttribute("cx")) ||
                                !(rightBottomAno[1] > this.getAttribute("cy"))
                            ) {
                                d3.select(this)
                                    .classed( "selection", false)
                                    .classed( "selectedNode", false);
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
            this.updateSimu = false;
        // Alt click
        } else if (d3event.altKey) {
            this.updateSimu = true;
            console.log("alt key pressed");

        // Simple click
        } else {
            console.log("simple click here : ", d3event.clientX, d3event.clientY);
            console.log("Element on click => ", object);
        }
    }
}


