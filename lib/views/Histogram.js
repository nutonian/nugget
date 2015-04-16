import Graph from '../presenter/Graph';

class Histogram extends Graph {
    constructor(options) {
        super(options);
        this.color = options.color;
    }

    draw() {
        this.el = this.d3Svg.selectAll('.bars')
                        .data(this.dataSeries.data)
                    .enter().append('rect')
                        .attr('class', 'bar')
                        .attr('y', this.y.bind(this))
                        .attr('x', this.x.bind(this))
                        .attr('width', this.width.bind(this))
                        .attr('height', this.height.bind(this))
                        .attr('fill', this.color)
                        .call(this._applyInserts.bind(this));
    }

    update() {
        this.el
            .attr('y', this.y.bind(this))
            .attr('x', this.x.bind(this))
            .attr('width', this.width.bind(this))
            .attr('height', this.height.bind(this));
    }

    x(d) {
        return this.xRange(d.x_low);
    }

    y(d) {
        return this.yRange(d.y);
    }

    width(d) {
        return this.xRange(d.x_high) - this.xRange(d.x_low);
    }

    height(d) {
        var yMin = this.yRange.domain()[0];
        return this.yRange(yMin) - this.yRange(d.y);
    }
}

export default Histogram;
