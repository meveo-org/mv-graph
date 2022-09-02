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

const localStorageItemsNode = JSON.parse(localStorage.getItem("fixedNodes"));
const localStorageItemsZoom = JSON.parse(localStorage.getItem("zoomed"));

/**
 * Graph class generator
 */
export default class D3Graph {

    constructor(svg, data) {
        this.data = data;

        this.svg = d3.select(svg);
        this.width = +this.svg.node().getBoundingClientRect().width;
        this.height = +this.svg.node().getBoundingClientRect().height;

        // svg objects
        this.link = null;
        this.node = null;
        // the data - an object with nodes and links
        this.graph = data;

        this.updateSimu = true;

        this.transform = [{
            k: 1,
            x: 0,
            y: 0
        }];

        this.simulation = d3.forceSimulation();

        this.storage = {
            "nodesPosition": {},
            "zoom": {} 
        };
        
    }

    /**
     * Display svg
     */
    displaySvg() {
        this.initializeDisplay();
        this.initializeSimulation();
        // if (localStorageItemsNode && localStorageItemsNode.length > 0) {
        //     this.restoreNodePosition();
        // }
        // if (localStorageItemsZoom && localStorageItemsZoom.length > 0) {
        //     this.restoreZoom();
        // }
    }
    
    /**
     * Initialize display of the svg
     */
    initializeDisplay() {
        this.svg
            .on("click", (d3event) => {
                if (d3event.explicitOriginalTarget.nodeName == "svg" && !d3event.ctrlKey) {
                    this.deselectAll();
                } 
                if (d3event.shiftKey) {
                    console.log("shift key pressed");
                    this.updateSimu = false;
                // Alt click
                } else if (d3event.altKey) {
                    this.updateSimu = true;
                    console.log("alt key pressed");
                }
            }).on("mousedown", (d3event) => {
                if (d3event.ctrlKey) {
                    this.createRectangle(d3event);
                }
            }).on("mousemove", (mouseMove) => {
                if (!this.svg.select("rect").empty()) {
                    this.drawRectangle(mouseMove);
                    this.selectNode(this.svg.select("rect").node(), this);
                }
            }).on("mouseup", () => {
                this.removeRectangle(this.svg.selectAll("rect"));
                this.svg.selectAll('circle.ci-node-element.selection').classed("selection", false);
            })
            .call(d3.zoom().on("zoom", (event) => {
                // console.log(event.sourceEvent.movementX, event.sourceEvent.movementX);
                this.svg.selectAll("g").attr('transform', "translate(" + event.transform.x + "," + event.transform.y + ") scale(" + event.transform.k + ")");
                this.transform[0].x = event.transform.x; 
                this.transform[0].y = event.transform.y;
                this.transform[0].k = event.transform.k;
                localStorage.setItem(
                    "zoomed",
                    JSON.stringify(
                        [
                            this.transform
                            .map((d) => ({k: d.k, x: d.x, y:d.y}))
                        ]
                    )
                )
                this.storage.zoom = {
                    k: event.transform.k,
                    x: event.transform.x,
                    y: event.transform.y
                }
                const svgInfoEvent = new CustomEvent("svg-info", {
                    detail: this.storage,
                    bubble: true
                });
                this.dispatch(svgInfoEvent);
            }));

        // set the data and properties of link lines
        this.link = this.svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.graph.links)
            .enter().append("line")
            .attr("class", "link ci-link-element")
            //Click on link event
            .on("click", () => {
                //TODO
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
            .on("click", (d3event, object) => {
                if (!d3event.ctrlKey) {
                    this.deselectAll(object);
                }
                this.toggleNode(object, d3event);
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
            })
            .on("mouseout", () => {
                //TODO
            }).call(d3.drag()
                .on("start", this.dragstarted)
                .on("drag", this.dragged)
                .on("end", this.dragended));

        // visualize the graph
        this.updateDisplay();
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
     * Restore node position if localStorage exist
     */
    restoreNodePosition() {
        this.svg.selectAll("circle").each((node) => {
            localStorageItemsNode[0].forEach(item => {
                if (item.id == node.id) {
                    node.x = item.cx;
                    node.y = item.cy;
                }
            });
        })
        if (localStorageItemsNode[1] == false) {
            this.updateSimu = false;
        }
    }

    /**
     * Restore zoom if localStorage exist
     */
    restoreZoom() {
        this.transform[0] = localStorageItemsZoom[0][0];
        this.svg.selectAll("g").attr("transform", "translate(" + this.transform[0].x + "," + this.transform[0].y + ") scale(" + this.transform[0].k + ")");
        d3.zoomIdentity.translate(this.transform[0].x, this.transform[0].y).scale(this.transform[0].k);
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
     * Dispatch a customEvent
     * @param {event} event 
     */
    dispatch(event) {
        console.log("Implement me !", event);
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

        this.link
            .attr("x1", function (d) { return d.source.x })
            .attr("y1", function (d) { return d.source.y })
            .attr("x2", function (d) { return d.target.x })
            .attr("y2", function (d) { return d.target.y });

        this.node
            .attr("cx", function (d) { return d.x })
            .attr("cy", function(d) { return d.y });
        d3.select('#alpha_value').style('flex-basis', (this.simulation.alpha()*100) + '%');
        localStorage.setItem(
            "fixedNodes",
            JSON.stringify(
                [this.simulation
                    .nodes()
                    .map((d) => ({id: d.id, cx: d.x, cy: d.y})),
                this.updateSimu]
            )
        );
        this.storage.nodesPosition = {
            node: [
                this.simulation.nodes().map((d) => ({id: d.id, cx: d.x, cy: d.y}))
            ]
        }
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
            .x(forceProperties.forceX.x);
        this.simulation.force("forceY")
            .strength(forceProperties.forceY.strength * forceProperties.forceY.enabled)
            .y(forceProperties.forceY.y);
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
     * @param {event} event drag event
     * @param {object} d the node object dragged
     */
    dragstarted = (event, d) => {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    /**
     * Drag a node or all selected node
     * @param {event} event drag event
     * @param {object} d node object dragged
     */
    dragged = (event, d) => {
        let selectedNode = this.svg.selectAll("circle.node.ci-node-element.selectedNode");
        if (!selectedNode.empty()) {
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
        } else if (selectedNode.empty()) {
            d.fx = event.x;
            d.fy = event.y;
        }
    }

    /**
     * End drag a node
     * @param {event} event drag event
     * @param {object} d node object dragged
     */
    dragended = (event, object) => {
        if (!event.active) this.simulation.alphaTarget(0);
        object.fx = null;
        object.fy = null;
    }

        /**
     * toggle node clicked
     * @param {object} node node clicked
     */
    toggleNode(node, eventClick) {
        let d3Selection = this.svg.select("#"+node.id);
        d3Selection.classed("selectedNode", d3Selection.classed("selectedNode") ? false : true);
        if (d3Selection.classed("selectedNode")) {
            console.log("Selected node : ", d3Selection.attr("cx"), d3Selection.attr("cy"));
            console.log("Clicked coord : ", eventClick.clientX, eventClick.clientY);
        }
    }
    
        /**
         * Unselect all node
         * @param {object} nodeClicked don't unselect NodeClicked toggleNode(node) do it
         */
        deselectAll(nodeClicked){
            if (nodeClicked) {
                this.svg.selectAll("circle.selectedNode").each((node) => {
                    if (nodeClicked.id != node.id) {
                        this.svg.select("#"+node.id).classed("selectedNode", false);
                    }
                })
            } else {
                this.svg.selectAll("circle.selectedNode").classed("selectedNode", false);
            }
        }
    
        /**
         * create rectangle for multi-selection
         * @param {d3event} d3event click event
         */
        createRectangle(d3event) {
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
        }
    
        /**
         * draw rectangle in relation to the cursor
         * @param {mouseMove} mouseMove 
         */
        drawRectangle(mouseMove) {
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
        }
    
        /**
         * Select node in relation to the rectangle
         * @param {d3rectangle} rect 
         */
        selectNode(rect, that) {
            this.svg.selectAll("circle.ci-node-element").each(function () {
                let coordTransform = {
                    x: parseInt(rect.getAttribute("x") / that.transform[0].k) - parseInt(that.transform[0].x / that.transform[0].k),
                    y: parseInt(rect.getAttribute("y") / that.transform[0].k) - parseInt(that.transform[0].y / that.transform[0].k),
                }
                let leftUpAno = [
                    coordTransform.x, 
                    coordTransform.y
                ];
                let rightUpAno = [
                    coordTransform.x, 
                    coordTransform.y + parseInt(rect.getAttribute("height") / that.transform[0].k)
                ];
                let leftBottomAno = [
                    coordTransform.x + parseInt(rect.getAttribute("width") / that.transform[0].k),
                    coordTransform.y
                ];
                let rightBottomAno = [
                    coordTransform.x + parseInt(rect.getAttribute("width") / that.transform[0].k), 
                    coordTransform.y + parseInt(rect.getAttribute("height") / that.transform[0].k)
                ];
                if (
                    !d3.select(this).classed("selectedNode") &&
                    leftUpAno[0] < parseInt(this.getAttribute("cx")) &&
                    leftUpAno[1] < parseInt(this.getAttribute("cy")) &&
    
                    rightUpAno[0] < parseInt(this.getAttribute("cx")) &&
                    rightUpAno[1] > parseInt(this.getAttribute("cy")) &&
    
                    leftBottomAno[0] > parseInt(this.getAttribute("cx")) &&
                    leftBottomAno[1] < parseInt(this.getAttribute("cy")) &&
    
                    rightBottomAno[0] > parseInt(this.getAttribute("cx")) &&
                    rightBottomAno[1] > parseInt(this.getAttribute("cy"))
                ) {
                    d3.select(this)
                        .classed( "selection", true)
                        .classed( "selectedNode", true);
                }
            });
        }
    
        /**
         * 
         * @param {d3rectangle} rect 
         */
        removeRectangle(rect) {
            rect.remove();
        }
    
        /**
         * Update Display of the svg
         */
        updateDisplay() {
            this.node.each(function(node) {
                let radius = node.radius || forceProperties.collide.radius;
                d3.select(this.parentNode.parentNode).selectAll("line.link.ci-link-element").each((link) => {
                    if ((node.id == link.source) || (node.id == link.target)) {
                        radius += 1.5;
                    }
                });
                d3.select(this).attr("r", radius);
    
                if (node.grp) {
                    d3.select(this)
                        .attr("fill", node.color || colourPalette[node.grp]);
                }

                if (node.html || node.text) {
                    const text = d3.select(this.parentNode)
                        .append("text")
                        .attr("dx", -20)
                        .attr("style", node.labelStyle)
                        .attr("class", node.labelClass);

                    if (node.html) {
                        text.html(node.html);
                    } else {
                        text.text(node.text);
                    }
                }
    
                d3.select(this).attr("id", node.id);
            });
    
            this.link.attr("stroke-width", forceProperties.link.enabled ? 3 : .5)
                .attr("opacity", forceProperties.link.enabled ? 1 : 0);
        }
}


