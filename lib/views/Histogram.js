import Graph from '../presenter/Graph';

class Histogram extends Graph {
    constructor(options) {
        super(options);
        this.color = options.color;
    }

    draw() {
        var bars = this.d3Svg.selectAll('rect.bar')
                        .data(this.dataSeries.data);

        bars.enter().append('rect')
            .attr('class', 'bar')
            .attr('fill', this.color)
            .call(this._applyInserts.bind(this));

        bars.attr('y', d => this.yRange(d.y))
            .attr('x', d => this.xRange(d.x_low))
            .attr('width', d => this.xRange(d.x_high) - this.xRange(d.x_low))
            .attr('height', d => {
                var yMin = this.yRange.domain()[0];
                return this.yRange(yMin) - this.yRange(d.y);
            });

        bars.exit().remove();
    }
}

export default Histogram;
