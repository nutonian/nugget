import Graph from '../views/Graph';

class ScatterGraph extends Graph {
    constructor(options) {
        super(options);

        var config = this.config.ScatterGraph;
        this.radius = options.radius || config.radius;
        this.color = options.color;
        this.showErrorBars = options.showErrorBars;
        this.guideClassName = 'y_guide-' + this.id;
        this.guideColor = options.guideColor || options.color;
        this.legendLabel = options.legendLabel || this.id;
    }

    draw(shouldAnimate) {

        var circles = this.circles = this.d3Svg.selectAll('circle')
                    .data(this.dataSeries.data);

        // for new points, add circles
        circles.enter()
            .append('circle')
            .attr('class','point')
            .attr('r', this.radius)
            .style('fill', this.color);

        circles.call(this._applyInserts.bind(this));

        // for all points (new and existing), update centers
        if (shouldAnimate) {
            circles.transition()
                .attr('cx', d => this.xRange(d.x_value))
                .attr('cy', d => this.yRange(d.y_value));
        } else {
            circles.attr('cx', d => this.xRange(d.x_value))
                .attr('cy', d => this.yRange(d.y_value));
        }

        // for deleted points, remove
        circles.exit().remove();

        if (this.showErrorBars) {
            var errorBars = this.errorBars = this.d3Svg.selectAll('.error_bar')
                .data(this.dataSeries.data);

            var errorBarEnterGroup = errorBars.enter()
                .append('g')
                .attr('class', 'error_bar')
                .attr('stroke', this.color)
                .attr('stroke-width', 1);

            errorBarEnterGroup.append('line')
                .attr('class', 'error_bar-line');

            errorBarEnterGroup.append('line')
                .attr('class', 'error_bar-top_cap');

            errorBarEnterGroup.append('line')
                .attr('class', 'error_bar-bottom_cap');

            errorBars.select('.error_bar-line')
                .attr('x1', d => this.xRange(d.x_value))
                .attr('x2', d => this.xRange(d.x_value))
                .attr('y1', d => this.yRange(d.y_min))
                .attr('y2', d => this.yRange(d.y_max));

            var capSize = 6;

            errorBars.select('.error_bar-top_cap')
                .attr('x1', d => this.xRange(d.x_value) - capSize)
                .attr('x2', d => this.xRange(d.x_value) + capSize) // + 2 to make line appear evenly centered
                .attr('y1', d => this.yRange(d.y_max))
                .attr('y2', d => this.yRange(d.y_max));

            errorBars.select('.error_bar-bottom_cap')
                .attr('x1', d => this.xRange(d.x_value) - capSize)
                .attr('x2', d => this.xRange(d.x_value) + capSize) // + 2 to make line appear evenly centered
                .attr('y1', d => this.yRange(d.y_min))
                .attr('y2', d => this.yRange(d.y_min));

            errorBars.exit().remove();

        }

        if (this.guides) {
            circles.classed('pointer', true);
        }

        this.legendData.setData(this._createLegendData());
    }

    drawGuides(container, chartOpts) {
        var circles = this.circles;
        var zoomX   = chartOpts.zoomX;
        var zoomY   = chartOpts.zoomY;

        function updateGuides(circleData, circleIdx) {
            var data = [circleData];

            var guides = container.selectAll('.scatter_plot_guides').data(data);

            var g = guides.enter()
                .append('g')
                .attr('class', 'scatter_plot_guides');

            var guideOpts = {
                xProp: 'x_value',
                yProp: 'y_value'
            };
            super.drawXLineGuide(guides, g, chartOpts, guideOpts);
            super.drawYLineGuide(guides, g, chartOpts, guideOpts);

            /*jshint validthis:true */
            var circleEl = this;
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

    // for a given x value, draws a guide line to the y axis (with y value in a box)
    drawYGuide(xValue, guideEl, chart) {

        if (!this.guides) {
            return;
        }

        var point = this.dataSeries.data.find(p => p.x_value === xValue);

        var yGuidesData = [];
        if (point) {
            yGuidesData.push({
                x: point.x_value,
                y: point.y_value
            });
        }

        // draw lines to the y axis

        // create unique class name to identify this graph's guides. This is
        // needed because the line + box are created outside this graph's d3Svg,
        // since the boxes appear outside the viewing area for this graph.

        var yGuidesSelection = guideEl.selectAll('.' + this.guideClassName).data(yGuidesData);

        var yGuidesEnterSelection = yGuidesSelection.enter()
            .append('g')
            .attr('class', 'axis_guide y_guide ' + this.guideClassName);

        super.drawYLineGuide(yGuidesSelection, yGuidesEnterSelection, chart, { color: this.guideColor });

        yGuidesSelection.exit().remove();
    }

    removeYLineGuide(guideEl) {
        var yGuidesSelection = guideEl.selectAll('.' + this.guideClassName).data([]);
        yGuidesSelection.exit().remove();
    }

    _createLegendData() {
        var data = [{
            color  : this.color || 'black',
            label  : this.legendLabel,
            shape  : 'circle',
            radius : 5
        }];
        return data;
    }
}

export default ScatterGraph;
