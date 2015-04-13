import Graph from '../presenter/Graph';

class ScatterGraph extends Graph {
    constructor(options) {
        super(options);

        this.radius = options.radius || 5;
        this.color = options.color;
    }
    drawElement(d3Svg, xRange, yRange) {
        if (typeof xRange !== 'function' || typeof yRange !== 'function') {
            throw 'xRange and yRange are not correctly defined, must be a function';
        }
        var x = function(d) { return xRange(d.x);};
        var y = function(d) { return yRange(d.y);};

        if (!this.circles) {
            this.circles = d3Svg.selectAll('.scatter')
                                .data(this.dataSeries.data)
                            .enter().append('circle')
                                .attr('class','point')
                                .attr('r', this.radius)
                                .attr('cx', x)
                                .attr('cy', y)
                                .style('fill', this.color);
        } else {
            this.applyTransition(this.circles)
                .attr('cx', x)
                .attr('cy', y);

            this.dataSeries.on('change', function() {
                this.circles = d3Svg.selectAll('circle')
                                    .data(this.dataSeries.data)
                                .exit().remove();
            });
        }
    }
    remove() {
        this.circles.remove();
        delete this.circles;
    }
}

export default ScatterGraph;