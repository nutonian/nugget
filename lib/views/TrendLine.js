import Graph from '../presenter/Graph';

class TrendLine extends Graph {
    // TODO: Get Michael Schmidt to weigh in on these calculations
    constructor(options) {
        super(options);

        this.color = options.color;
        this.slope = options.slope;
    }
    draw() {
        var xRangeArray = this.xRange.range().sort();

        var xScreenMin = xRangeArray[0];
        var xScreenMax = xRangeArray[1];

        var xScreenWidth = xScreenMax - xScreenMin;

        var data = this.dataSeries.data;

        var ySum = 0;

        data.forEach(function(point) {
            ySum += point.y;
        });

        var yMax = this.yRange.domain().sort()[1];

        var yMid = ySum / data.length;

        var yScreenHeight = xScreenWidth * this.slope;

        var yDataHeight = yMax - this.yRange.invert(yScreenHeight);

        var y1 = yMid - (yDataHeight /2);
        var y2 = yMid + (yDataHeight / 2);

        this.el = this.d3Svg.append('line')
                            .attr('class', 'slope')
                            .attr('x1', xScreenMin)
                            .attr('x2', xScreenMax)
                            .attr('y1', this.yRange(y1))
                            .attr('y2', this.yRange(y2))
                            .call(this._applyInserts.bind(this));
    }
    update() {}
}

export default TrendLine;