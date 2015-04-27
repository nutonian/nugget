import Graph from '../presenter/Graph';

class BarGraph extends Graph {
    constructor(options) {
        super(options);

        this.color = options.color;
        this.innerPadding = options.innerPadding || 0.2;
        this.outerPadding = options.outerPadding || 0.1;
    }
    draw() {
        var interval = this.xRange.rangeExtent();

        this.xRange.rangeBands(interval, this.innerPadding, this.outerPadding);
        var data = this.dataSeries.data;

        var bars = this.d3Svg.selectAll('rect.bar')
                    .data(data);

        bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .call(this._applyInserts.bind(this));

        bars.exit().remove();

        if (data[0] && data[0].x_value instanceof Array) {
            //this means the bar graph is going to be a grouped bar graph 2 levels deep. no more than that.
            var mappedData = data.map(point => point.x_value[1]);
            var setData = new Set(mappedData);
            var distinctSubRangeValues = Array.from(setData);

            var xSubRange = d3.scale.ordinal().domain(distinctSubRangeValues).rangeBands([0, this.xRange.rangeBand()], this.innerPadding, this.outerPadding);

            bars
                .attr('x', d => this.xRange(d.x_value[0]) + xSubRange(d.x_value[1]))
                .attr('y', d => this.yRange(d.y))
                .attr('width', xSubRange.rangeBand())
                .attr('height', d => this.height(d));

        } else {
            //this is a standard bar graph
            bars
                .attr('x', d => this.xRange(d.x_value))
                .attr('y', d => this.yRange(d.y))
                .attr('width', this.xRange.rangeBand())
                .attr('height', this.height.bind(this));
        }
    }
    height(d) {
        var yMin = this.yRange.domain()[0];
        var height = this.yRange(yMin) - this.yRange(d.y);
        return Math.max(height, 0);
    }
}

export default BarGraph;
