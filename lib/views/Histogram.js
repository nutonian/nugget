import Graph from '../views/Graph';

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
            .attr('fill', this.color);

        bars.call(this._applyInserts.bind(this));

        bars.attr('y', d => this.yRange(d.y))
            .attr('x', d => this.xRange(d.x_low))
            .attr('width', d => {
                var width = this.xRange(d.x_high) - this.xRange(d.x_low);
                return Math.max(width, 0);
            })
            .attr('height', d => {
                var yMin = Math.max(this.yRange.domain()[0], 0);
                var height =  this.yRange(yMin) - this.yRange(d.y);
                return Math.max(height, 0);
            });

        bars.exit().remove();
    }
}

export default Histogram;
