import Graph from '../presenter/Graph';

class Histogram extends Graph {
    constructor(options) {
        super(options);
        this.color = options.color;
    }
    drawElement(d3Svg, xRange, yRange) {
        if (typeof xRange !== 'function' || typeof yRange !== 'function') {
            throw 'xRange and yRange are not correctly defined, must be a function';
        }
        var y = function(d) {
            return yRange(d.y);
        };
        var x = function(d) {
            return xRange(d.x_low);
        };
        var width = function(d) {
            return xRange(d.x_high) - xRange(d.x_low);
        };
        var height = function(d) {
            var yMin = yRange.domain()[0];
            return yRange(yMin) - yRange(d.y);
        };

        if (!this.bars) {
            this.bars = d3Svg.selectAll('.bars')
                            .data(this.dataSeries.data)
                        .enter().append('rect')
                            .attr('class', 'bar')
                            .attr('y', y)
                            .attr('x', x)
                            .attr('width', width)
                            .attr('height', height)
                            .attr('fill', this.color);

            this.dataSeries.on('change', function() {
                this.bars = d3Svg.selectAll('rect')
                                .data(this.dataSeries.data)
                            .exit().remove();
            });

        } else {
            this.applyTransition(this.bars)
                .attr('y', y)
                .attr('x', x)
                .attr('width', width)
                .attr('height', height);
        }
    }
    remove() {
        this.bars.exit().remove();
        delete this.bars;
    }
}

export default Histogram;