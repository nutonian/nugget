import Graph from '../views/Graph';

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

        this.radiusScale = this.createRadiusScale(circleData);

        var circles = this.circles = this.d3Svg.selectAll('.bin_circle')
            .data(circleData);

        circles.enter()
            .append('circle')
            .attr('class', 'bin_circle');

        circles.call(this._applyInserts.bind(this));

        circles
            .attr('cx', d => this.xRange(d.x_mean))
            .attr('cy', d => this.yRange(d.y_mean))
            .attr('r', d => this.radiusScale(d.num_values));

        circles.exit().remove();

        if (this.guides) {
            circles.classed('pointer', true);
        }

        if (this.dataSeries.data.length) {
            this.legendData.setData(this._createLegendData());
        }
    }

    createRadiusScale(data) {
        var numValsMin = 0;
        var numValsMax = d3.max(data, function(d) {
            return d.num_values;
        });
        var radiusScale = d3.scale.linear()
            .domain([numValsMin, numValsMax])
            .range(this.constructor.GetCircleRadii());
        return radiusScale;
    }

    drawGuides(container, chartOpts) {
        var circles = this.circles;
        var xRange = this.xRange;
        var zoomX = chartOpts.zoomX;
        var zoomY = chartOpts.zoomY;
        var width = chartOpts.width;
        var height = chartOpts.height;
        var margins = chartOpts.margins;
        var bottom = height - margins.bottom;
        var xMin = margins.left;
        var xMax = width - margins.right;
        var xLabelFormat = chartOpts.xGuideLabelFormat ? chartOpts.xGuideLabelFormat : chartOpts.xLabelFormat;

        const updateGuides = (circleData, circleIdx) => {
            var data = [circleData];

            /**
             * X Guide
             **/

            var xGuide = container.selectAll('.binned_mean_x_guide').data(data);

            var xG = xGuide.enter()
                .append('g')
                .attr('class', 'binned_mean_guide binned_mean_x_guide');

            super.drawXLineGuide(xGuide, xG, chartOpts, {
                xProp          : 'x_mean',
                yProp          : 'y_mean',
                createLabelText: function(d) {
                    return 'From ' + xLabelFormat(d.x_low) + ' to ' + xLabelFormat(d.x_high);
                }
            });

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

            /**
             * Y Guide
             **/

            var yGuide = container.selectAll('.binned_mean_y_guide').data(data);

            var yG = yGuide.enter()
                .append('g')
                .attr('class', 'binned_mean_guide binned_mean_y_guide');

            super.drawYLineGuide(yGuide, yG, chartOpts, {
                xProp: 'x_mean',
                yProp: 'y_mean'
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
        };

        circles
            .on('mouseenter', updateGuides)
            .on('mouseleave', function() {
                var guides = container.selectAll('.binned_mean_guide').data([]);
                guides.exit().remove();

                zoomX.on('zoom.binned_mean_guides', null);
                zoomY.on('zoom.binned_mean_guides', null);
            });

    }

    _createLegendData() {
        var radius = 10;
        var data = [{
            color : this.color,
            label : 'approx. ' + Math.round(this.radiusScale.invert(radius)) + ' values',
            shape : 'circle',
            radius: radius
        }];
        return data;
    }
}

export default BinnedMeanGraph;
