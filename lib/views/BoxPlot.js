import Graph from '../presenter/Graph';

class BoxPlot extends Graph {
    constructor(options) {
        super(options);

        this.color = options.color;
        this.innerPadding = options.innerPadding || 0.5;
        this.outerPadding = options.outerPadding || 0.2;
    }
    draw() {
        var interval = this.xRange.rangeExtent();
        this.xRange.rangeBands(interval, this.innerPadding, this.outerPadding);

        // functions used to compute various parameters for drawing the box plot
        var halfRangeBand = d => (this.xRange(d.x_value) + (this.xRange.rangeBand() / 2));
        var lineX2 = d => this.xRange(d.x_value) + this.xRange.rangeBand();
        var initialX = d => this.xRange(d.x_value);
        var yMax = d => this.yRange(d.y_max);
        var yMin = d => this.yRange(d.y_min);
        var median = d => this.yRange(d.y_50pct);

        var boxes = this.d3Svg.selectAll('g.box_plot')
                    .data(this.dataSeries.data);

        // for new data points, create all the svg elements for a box plot
        var boxGroup = boxes.enter()
            .append('g')
            .attr('class', 'box_plot');

        boxGroup.append('line')
            .attr('class', 'range');

        boxGroup.append('line')
            .attr('class','max');

        boxGroup.append('line')
            .attr('class','min');

        boxGroup.append('rect')
            .attr('class','distribution')
            .call(this._applyInserts.bind(this));

        boxGroup.append('line')
            .attr('class','median');

        // for each data point (old and new), update the positions, widths etc.
        boxes.select('.range')
            .attr('x1', halfRangeBand)
            .attr('x2', halfRangeBand)
            .attr('y1', yMax)
            .attr('y2', yMin);

        boxes.select('.max')
            .attr('x1', initialX)
            .attr('x2', lineX2)
            .attr('y1', yMax)
            .attr('y2', yMax);

        boxes.select('.min')
            .attr('x1', initialX)
            .attr('x2', lineX2)
            .attr('y1', yMin)
            .attr('y2', yMin);

        boxes.select('.distribution')
            .attr('width', () => this.xRange.rangeBand())
            .attr('height', d => this.yRange(d.y_25pct) - this.yRange(d.y_75pct))
            .attr('y', d => this.yRange(d.y_75pct))
            .attr('x', d => this.xRange(d.x_value));

        boxes.select('.median')
            .attr('x1', initialX)
            .attr('x2', lineX2)
            .attr('y1', median)
            .attr('y2', median);

        // for removed data points, remove the elements
        boxes.exit().remove();
    }
}

export default BoxPlot;
