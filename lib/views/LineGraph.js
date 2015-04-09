import Graph from '../presenter/Graph';

class LineGraph extends Graph {
    constructor(options) {
        super(options);
    }
    drawElement(d3Svg, xRange, yRange) {
        if (typeof xRange !== 'function' || typeof yRange !== 'function') {
            throw 'xRange and yRange are not correctly defined, must be a function';
        }
        var lineFunction = d3.svg.line()
                           .x(function(d) {
                                return xRange(d.x);
                            })
                           .y(function(d) {
                                return yRange(d.y);
                           })
                           .interpolate('linear');

        var d = lineFunction(this.dataSeries.data);

        if (!this.path) {
            this.path = d3Svg
                .append('g')
                .append('path')
                .attr('data-id', this.id)
                .attr('d', d)
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .attr('stroke', this.color);
        } else {
            this.applyTransition(this.path)
                .attr('d', d);
        }

    }
}

export default LineGraph;
