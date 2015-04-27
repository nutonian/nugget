import Graph from '../presenter/Graph';

class LineGraph extends Graph {
    constructor(options) {
        super(options);
    }

    draw() {
        var lineFunction = d3.svg.line()
            .x(d => this.xRange(d.x_value))
            .y(d => this.yRange(d.y_value))
            .interpolate('linear');
        var line = this.d3Svg.selectAll('path.line')
                    .data([this.dataSeries.data]);

        line.enter().append('path')
                    .attr('stroke-width', 2)
                    .attr('class', 'line')
                    .attr('fill', 'none')
                    .attr('stroke', this.color)
                    .call(this._applyInserts.bind(this));

        line.attr('d', lineFunction);

        line.exit().remove();

    }
}

export default LineGraph;
