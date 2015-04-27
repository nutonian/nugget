import Graph from '../presenter/Graph';

class LineGraph extends Graph {
    constructor(options) {
        super(options);
    }

    draw() {
        this.el = this.d3Svg
                    .append('g')
                    .append('path')
                    .attr('data-id', this.id)
                    .attr('d', this.getData())
                    .attr('stroke-width', 2)
                    .attr('class', 'line_path')
                    .attr('fill', 'none')
                    .attr('stroke', this.color)
                    .call(this._applyInserts.bind(this));
    }

    update() {
        this.el.attr('d', this.getData());
    }

    getData() {
        var xRange = this.xRange;
        var yRange = this.yRange;
        var lineFunction = d3.svg.line()
                               .x(function(d) { return xRange(d.x_value); })
                               .y(function(d) { return yRange(d.y_value); })
                               .interpolate('linear');
        var data = lineFunction(this.dataSeries.data);
        return data;
    }
}

export default LineGraph;
