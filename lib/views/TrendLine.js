import Graph from '../presenter/Graph';

class TrendLine extends Graph {
    // TODO: Get Michael Schmidt to weigh in on these calculations
    constructor(options) {
        super(options);

        this.color = options.color;
        this.slope = options.slope;
        this.offset = options.offset;
    }
    draw() {
        var points = this.getLineEndpoints();

        var lines = this.d3Svg.selectAll('line.slope')
                        .data([points]);

        // for new data points, append a line
        lines.enter()
            .append('line')
            .attr('class', 'slope')
            .call(this._applyInserts.bind(this));

        // for all points, update position
        lines
            .attr('x1', d => this.xRange(d.xMin))
            .attr('x2', d => this.xRange(d.xMax))
            .attr('y1', d => this.yRange(d.yMin))
            .attr('y2', d => this.yRange(d.yMax));

        // remove elements for departing data points
        lines.exit().remove();
    }
    getLineEndpoints() {
        var xDomainArray = this.xRange.domain().sort(d3.ascending);

        var xMin = xDomainArray[0];
        var xMax = xDomainArray[1];

        var yMin = (this.slope * xMin) + this.offset;

        var yMax = (this.slope * xMax) + this.offset;

        return {
            xMin: xMin,
            xMax: xMax,
            yMin: yMin,
            yMax: yMax
        };
    }
}

export default TrendLine;