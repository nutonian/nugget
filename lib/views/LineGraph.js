import Graph from '../presenter/Graph';
class LineGraph extends Graph {
    constructor(options) {
        super(options);
    }
    drawElement(d3_svg, xRange, yRange) {
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
        d3_svg.append('svg:path')
              .attr('d', lineFunction(this.dataSeries.data))
              .attr('stroke-width', 2)
              .attr('fill', 'none')
              .attr('stroke', this.color);
    }

}
export default LineGraph;
