import Graph from '../views/Graph';

class LineGraph extends Graph {
    constructor(options) {
        super(options);

        // create unique dynamic class name to identify this line's guides. This is
        // needed because the line + box are created outside this graph's d3Svg,
        // in a special guide layer, since the boxes appear outside the clipping
        // mask used for this graph. Without this distinguishing class name, d3
        // cannot distinguish between guides rendered for different line graphs
        // (since they're all in the guide layer)
        this.guideClassName = 'y_guide-' + this.id;
        this.guideColor = options.guideColor || this.color;
        this.interpolate = options.interpolate || 'linear';
    }

    draw(shouldAnimate) {

        var lineFunction = d3.svg.line()
            .x(d => this.xRange(d.x_value))
            .y(d => this.yRange(d.y_value))
            .interpolate(this.interpolate);

        var line = this.d3Svg.selectAll('path.line')
                    .data([this.dataSeries.data]);

        line.enter().append('path')
                    .attr('stroke-width', 2)
                    .attr('class', 'line')
                    .attr('fill', 'none')
                    .attr('stroke', this.color);

        line.call(this._applyInserts.bind(this));

        if (shouldAnimate) {
            line.transition()
                .attr('d', lineFunction);
        } else {
            line.attr('d', lineFunction);
        }

        line.exit().remove();

    }

    // for a given x value, draws a guide line to the y axis (with y value in a box)
    drawYGuide(xValue, guideEl, chart) {

        var point = this.dataSeries.data.find(p => p.x_value === xValue);

        var circleData = [];
        if (point) {
            circleData.push(point);
        }

        // draw circles at data points
        var pointCircleSelection  = this.d3Svg.selectAll('.circle_guide').data(circleData);

        pointCircleSelection.enter()
            .append('circle')
            .attr('class', 'circle_guide')
            .attr('fill', this.guideColor)
            .attr('r', 3);

        pointCircleSelection
            .attr('cx', d => this.xRange(d.x_value))
            .attr('cy', d => this.yRange(d.y_value));

        pointCircleSelection.exit().remove();

        // draw lines to the y axis

        // create unique class name to identify this line's guides. This is
        // needed because the line + box are created outside this graph's d3Svg,
        // since the boxes appear outside the viewing area for this graph.

        var yGuidesSelection = guideEl.selectAll('.' + this.guideClassName).data(circleData);

        var yGuidesEnterSelection = yGuidesSelection.enter()
            .append('g')
            .attr('class', 'axis_guide y_guide ' + this.guideClassName);

        super.drawYLineGuide(yGuidesSelection, yGuidesEnterSelection, chart, {
            color: this.guideColor,
            xProp: 'x_value',
            yProp: 'y_value'
        });

        yGuidesSelection.exit().remove();
    }

    removeYLineGuide(guideEl) {
        var pointCircleSelection  = this.d3Svg.selectAll('.circle_guide').data([]);
        var yGuidesSelection = guideEl.selectAll('.' + this.guideClassName).data([]);
        pointCircleSelection.exit().remove();
        yGuidesSelection.exit().remove();
    }
}

export default LineGraph;
