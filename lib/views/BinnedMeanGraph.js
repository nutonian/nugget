import Graph from '../presenter/Graph';

class BinnedMeanGraph extends Graph {
    constructor(options) {
        super(options);
    }

    // the min and max radii for the binned mean circles
    static GetCircleRadii() {
        return [5, 30];
    }

    // a binned mean plot needs to allow extra space for the
    // max circle radius (which is 30)
    static ExtraXPadding() {
        return BinnedMeanGraph.GetCircleRadii()[1];
    }

    static ExtraYPadding() {
        return BinnedMeanGraph.GetCircleRadii()[1];
    }

    draw() {
        var line = this.d3Svg.selectAll('path.line')
                    .data([this.dataSeries.data]);

        var lineFunction = d3.svg.line()
            .x(d => this.xRange(d.x_mean))
            .y(d => this.yRange(d.y_mean))
            .interpolate('linear');

        line.enter()
            .append('path')
            .attr('class', 'line')
            .attr('fill', 'none');

        line.attr('d', lineFunction);

        line.exit().remove();

        // Append circles in order of num_values to help with display list overlap
        var circleData = this.dataSeries.getDataCopy();
        circleData.sort(d3.descending);

        var radiusScale = this.createRadiusScale(circleData);

        var circles = this.circles = this.d3Svg.selectAll('.bin_circle')
            .data(circleData);

        circles.enter()
            .append('circle')
            .attr('class', 'bin_circle')
            .attr('r', d => radiusScale(d.num_values));

        circles.call(this._applyInserts.bind(this));

        circles
            .attr('cx', d => this.xRange(d.x_mean))
            .attr('cy', d => this.yRange(d.y_mean));

        circles.exit().remove();

        if (this.guides) {
            circles.classed('pointer', true);
        }

    }

    createRadiusScale(data) {
        var numValsMin  = 0;
        var numValsMax  = d3.max(data, function(d) { return d.num_values; });
        var radiusScale = d3.scale.linear()
                            .domain([numValsMin, numValsMax])
                            .range(this.constructor.GetCircleRadii());
        return radiusScale;
    }

    drawLegend(container, width, height) {
        var radiusScale = this.createRadiusScale(this.dataSeries.data);

        var radius = 10;
        var x = radius + radius;
        var y = height / 2;

        var legendCircle = container.selectAll('circle.legend_circle')
            .data([{ x: x, y: y}]);

        legendCircle.enter()
            .append('circle')
            .attr('class', 'legend_circle')
            .attr('r', radius);

        legendCircle
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        legendCircle.exit().remove();

        var textXPadding = radius + 4;
        var legendText = container.selectAll('text.legend_label')
            .data([{ x: x + textXPadding, y: y}]);

        legendText.enter()
            .append('text')
            .text('approx. ' + Math.round( radiusScale.invert(radius) ) + ' values')
            .attr('class', 'legend_label')
            .attr('dominant-baseline', 'middle');

        legendText
            .attr('x', d => d.x)
            .attr('y', d => d.y);

        legendText.exit().remove();
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
        var xLabelFormat = opts.xLabelFormat;
        var yLabelFormat = opts.yLabelFormat;

        function getLabelBBox(node) {
            var parentNode = d3.select(node.parentNode);
            var textNode = parentNode.select('.guide_label');
            var bbox = textNode.node().getBBox();
            return bbox;
        }

        function updateGuides(circleData, circleIdx) {
            var data = [circleData];

            /**
            * X Guide
            **/

            var xGuide = container.selectAll('.binned_mean_x_guide').data(data);

            var xG = xGuide.enter()
                .append('g')
                .attr('class', 'binned_mean_guide binned_mean_x_guide');

            xG.append('line')
                .attr('class', 'guide_line binned_mean_guide')
                .attr('y2', bottom);

            xGuide.selectAll('.binned_mean_x_guide .binned_mean_guide')
                .attr('x1', d => xRange(d.x_mean))
                .attr('y1', d => yRange(d.y_mean))
                .attr('x2', d => xRange(d.x_mean));

            /**
            * X Range
            **/

            var xRangeGuide = container.selectAll('.binned_mean_x_range_guide').data(data);

            var xRangeG = xRangeGuide.enter()
                .append('g')
                .attr('class', 'binned_mean_guide binned_mean_x_range_guide');

            xRangeG.append('line')
                .attr('class', 'guide_line binned_mean_guide');

            xRangeGuide.selectAll('.binned_mean_x_range_guide .binned_mean_guide')
                .attr('x1', d => {
                    var x = xRange(d.x_low);
                    return x < xMin ? xMin : x;
                })
                .attr('y1', bottom)
                .attr('x2', d => {
                    var x = xRange(d.x_high);
                    return x > xMax ? xMax : x;
                })
                .attr('y2', bottom);

            xRangeG.append('rect')
                .attr('class', 'guide_label_bg');

            xRangeG.append('text')
                .attr('class', 'guide_label')
                .attr('font-size', fontSize)
                .attr('height', fontSize)
                .attr('text-anchor', 'middle');

            xRangeGuide.selectAll('.binned_mean_x_range_guide .guide_label')
                .text(d => 'From ' + xLabelFormat(d.x_low) + ' to ' + xLabelFormat(d.x_high))
                .attr('x', function(d) {
                    var x              = xRange(d.x_mean);
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

            xRangeGuide.selectAll('.binned_mean_x_range_guide .guide_label_bg').each(function() {
                var labelBBox = getLabelBBox(this);
                d3.select(this)
                    .attr('x', labelBBox.x - (labelPadding / 2))
                    .attr('y', labelBBox.y)
                    .attr('width', labelBBox.width + labelPadding)
                    .attr('height', fontSize + 1);
            });

            /**
            * Y Guide
            **/

            var yGuide = container.selectAll('.binned_mean_y_guide').data(data);

            var yG = yGuide.enter()
                .append('g')
                .attr('class', 'binned_mean_guide binned_mean_y_guide');

            yG.append('line')
                .attr('class', 'guide_line binned_mean_guide');

            yG.append('rect')
                .attr('class', 'guide_label_bg');

            yG.append('text')
                .attr('class', 'guide_label')
                .attr('font-size', fontSize)
                .attr('height', fontSize)
                .attr('text-anchor', 'end');

            yGuide.selectAll('.binned_mean_y_guide .binned_mean_guide')
                .attr('x1', margins.left)
                .attr('y1', d => yRange(d.y_mean))
                .attr('x2', d => xRange(d.x_mean))
                .attr('y2', d => yRange(d.y_mean));

            yGuide.selectAll('.binned_mean_y_guide .guide_label')
                .text(d => yLabelFormat(d.y_mean))
                .attr('x', margins.left - labelMargin - labelPadding)
                .attr('y', d => yRange(d.y_mean) + (fontSize / 2));

            yGuide.selectAll('.binned_mean_y_guide .guide_label_bg').each(function() {
                var labelBBox = getLabelBBox(this);
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
            zoomX.on('zoom.binned_mean_guides', function() {
                updateGuides.call(circleEl, circleData, circleIdx);
            });

            zoomY.on('zoom.binned_mean_guides', function() {
                updateGuides.call(circleEl, circleData, circleIdx);
            });

        }

        circles
            .on('mouseenter', updateGuides)
            .on('mouseleave', function() {
                var guides = container.selectAll('.binned_mean_guide').data([]);
                guides.exit().remove();

                zoomX.on('zoom.binned_mean_guides', null);
                zoomY.on('zoom.binned_mean_guides', null);
            });

    }
}

export default BinnedMeanGraph;
