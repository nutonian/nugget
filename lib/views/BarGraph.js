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

        this.el = this.d3Svg.selectAll('.bars')
                        .data(data)
                    .enter().append('rect')
                        .attr('class', 'bar')
                        .attr('x', this.x.bind(this))
                        .attr('y', this.y.bind(this))
                        .attr('width', this.width.bind(this))
                        .attr('height', this.height.bind(this))
                        .style('fill', this.color)
                        .call(this._applyInserts.bind(this));
    }
    update() {
        this.el.attr('x', this.x.bind(this))
                .attr('y', this.y.bind(this))
                .attr('width', this.width.bind(this))
                .attr('height', this.height.bind(this));
    }
    x(d) {
        return this.xRange(d.x);
    }
    y(d) {
        return this.yRange(d.y);
    }
    width() {
        return this.xRange.rangeBand();
    }
    height(d) {
        var yMin = this.yRange.domain()[0];
        return this.yRange(yMin) - this.yRange(d.y);
    }
}

export default BarGraph;