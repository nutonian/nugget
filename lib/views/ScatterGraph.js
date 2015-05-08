import Graph from '../presenter/Graph';

class ScatterGraph extends Graph {
    constructor(options) {
        super(options);

        this.radius = options.radius || 5;
        this.color = options.color;
    }

    draw() {
        var circles = this.circles = this.d3Svg.selectAll('circle')
                    .data(this.dataSeries.data);

        // for new points, add circles
        circles.enter()
            .append('circle')
            .attr('class','point')
            .attr('r', this.radius)
            .call(this._applyInserts.bind(this))
            .style('fill', this.color);

        // for all points (new and existing), update centers
        circles
            .attr('cx', d => this.xRange(d.x_value))
            .attr('cy', d => this.yRange(d.y_value));

        // for deleted points, remove
        circles.exit().remove();

        if (this.guides) {
            circles.classed('pointer', true);
        }
    }

    drawGuides(container, opts) {
        var circles      = this.circles;
        var xRange       = this.xRange;
        var yRange       = this.yRange;
        var zoomX        = opts.zooms.zoomX;
        var zoomY        = opts.zooms.zoomY;
        var fontSize     = 14;
        var labelMargin  = 2;
        var labelPadding = 5;
        var width        = opts.width;
        var height       = opts.height;
        var margins      = opts.margins;
        var bottom       = height - margins.bottom;
        var xMin         = margins.left;
        var xMax         = width - margins.right;
        var yMin         = margins.top;
        var yMax         = bottom;
        var xLabelFormat = opts.xLabelFormat;
        var yLabelFormat = opts.yLabelFormat;

        function getLabelBBox(node, selector) {
            var parentNode = d3.select(node.parentNode);
            var textNode = parentNode.select(selector);
            var bbox = textNode.node().getBBox();
            return bbox;
        }

        function constrainX(d) {
            var x = xRange(d.x_value);
            if (x > xMax) {
                x = xMax;
            } else if (x < xMin) {
                x = xMin;
            }
            return x;
        }

        function constrainY(d) {
            var y = yRange(d.y_value);
            if (y > yMax) {
                y = yMax;
            } else if (y < yMin) {
                y = yMin;
            }
            return y;
        }

        function updateGuides(circleData, circleIdx) {
            var data = [circleData];

            var guides = container.selectAll('.scatter_plot_guides').data(data);

            var g = guides.enter()
                .append('g')
                .attr('class', 'scatter_plot_guides');

            /**
            * X guide
            **/



            g.append('line')
                .attr('class', 'guide_line scatter_plot_x_guide')
                .attr('y2', bottom);

            guides.selectAll('.scatter_plot_guides .scatter_plot_x_guide')
                .attr('x1', constrainX)
                .attr('y1', constrainY)
                .attr('x2', constrainX);

            g.append('rect')
                .attr('class', 'guide_label_bg scatter_plot_x_label_bg');

            g.append('text')
                .attr('class', 'guide_label scatter_plot_x_label')
                .attr('font-size', fontSize)
                .attr('height', fontSize)
                .attr('text-anchor', 'middle');

            guides.selectAll('.scatter_plot_x_label')
                .text(d => xLabelFormat(d.x_value))
                .attr('x', function(d) {
                    var x              = xRange(d.x_value);
                    var labelWidth     = this.getBBox().width;
                    var halfLabelWidth = labelWidth / 2;
                    var labelLeft      = x - halfLabelWidth;
                    var labelRight     = x + halfLabelWidth;
                    var xMax           = width - halfLabelWidth - margins.right;

                    if (labelRight > xMax) {
                        x = xMax;
                    } else if (labelLeft < xMin) {
                        x = xMin + halfLabelWidth;
                    }

                    return x;
                })
                .attr('y', function() {
                    return bottom + this.getBBox().height;
                });

            guides.selectAll('.scatter_plot_guides .scatter_plot_x_label_bg').each(function() {
                var labelBBox = getLabelBBox(this, '.scatter_plot_x_label');
                d3.select(this)
                    .attr('x', labelBBox.x - (labelPadding / 2))
                    .attr('y', labelBBox.y)
                    .attr('width', labelBBox.width + labelPadding)
                    .attr('height', fontSize + 1);
            });

            /**
            * Y guide
            **/

            g.append('line')
                .attr('class', 'guide_line scatter_plot_y_guide')
                .attr('x1', xMin);

            guides.selectAll('.scatter_plot_guides .scatter_plot_y_guide')
                .attr('y1', constrainY)
                .attr('x2', constrainX)
                .attr('y2', constrainY);

            g.append('rect')
                .attr('class', 'guide_label_bg scatter_plot_y_label_bg');

            g.append('text')
                .attr('class', 'guide_label scatter_plot_y_label')
                .attr('font-size', fontSize)
                .attr('height', fontSize)
                .attr('text-anchor', 'end');

            guides.selectAll('.scatter_plot_y_label')
                .text(d => yLabelFormat(d.y_value))
                .attr('x', margins.left - labelMargin - labelPadding)
                .attr('y', d => yRange(d.y_value) + (fontSize / 2));

            guides.selectAll('.scatter_plot_guides .scatter_plot_y_label_bg').each(function() {
                var labelBBox = getLabelBBox(this, '.scatter_plot_y_label');
                d3.select(this)
                    .attr('x', labelBBox.x - (labelPadding / 2))
                    .attr('y', labelBBox.y)
                    .attr('width', labelBBox.width + labelPadding)
                    .attr('height', fontSize + 1);
            });

            /**
            * Zoom handlers
            **/

            /*jshint validthis:true */
            var circleEl = this;

            // The initial drawing of the guides happens on mouseenter. It will continue to
            // update each time a zoom event is triggered until mouseleave.
            zoomX.on('zoom.scatter_plot_guides', function() {
                updateGuides.call(circleEl, circleData, circleIdx);
            });

            zoomY.on('zoom.scatter_plot_guides', function() {
                updateGuides.call(circleEl, circleData, circleIdx);
            });
        }

        circles
            .on('mouseenter', updateGuides)
            .on('mouseleave', function() {
                var guides = container.selectAll('.scatter_plot_guides').data([]);
                guides.exit().remove();

                zoomX.on('zoom.scatter_plot_guides', null);
                zoomY.on('zoom.scatter_plot_guides', null);
            });

    }
}

export default ScatterGraph;
