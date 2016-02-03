import Graph from '../views/Graph';

class TrendLine extends Graph {
    constructor(options) {
        super(options);

        this.color = options.color;
        this.slope = options.slope;
        this.origin = options.origin;
    }
    draw() {
        var points = this.getLineEndpoints();

        var lines = this.d3Svg.selectAll('line.slope')
                        .data([points]);

        // for new data points, append a line
        lines.enter()
            .append('line')
            .attr('class', 'slope');

        lines.call(this._applyInserts.bind(this));

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
        var xDomain = this.xRange.domain().sort(d3.ascending);
        var yDomain = this.yRange.domain().sort(d3.ascending);
        var x0 = this.origin.x;
        var y0 = this.origin.y;

        var diagonalSlope = (yDomain[1] - yDomain[0]) / (xDomain[1] - xDomain[0]);

        var xMin, yMin, xMax, yMax;
        if (this.slope > diagonalSlope) {
            // trend line will intersect top and bottom of chart
            yMin = yDomain[0];
            yMax = yDomain[1];
            xMin = x0 - ((y0 - yMin) / this.slope);
            xMax = x0 + ((yMax - y0) / this.slope);
        } else {
            // trend line will intersect left and right of chart
            xMin = xDomain[0];
            xMax = xDomain[1];
            yMin = y0 - (this.slope * (x0 - xMin));
            yMax = y0 + (this.slope * (xMax - x0));
        }

        return {
            xMin: xMin,
            xMax: xMax,
            yMin: yMin,
            yMax: yMax
        };
    }
}

export default TrendLine;
