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
        this.el = this.d3Svg.append('line')
                            .attr('class', 'slope')
                            .attr('x1', this.xRange(points.xMin))
                            .attr('x2', this.xRange(points.xMax))
                            .attr('y1', this.yRange(points.yMin))
                            .attr('y2', this.yRange(points.yMax))
                            .call(this._applyInserts.bind(this));
    }
    update() {
        var points = this.getLineEndpoints();
        this.el.attr('x1', this.xRange(points.xMin))
                    .attr('x2', this.xRange(points.xMax))
                    .attr('y1', this.yRange(points.yMin))
                    .attr('y2', this.yRange(points.yMax));
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