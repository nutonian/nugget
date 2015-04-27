import Graph from '../presenter/Graph';

class ScatterGraph extends Graph {
    constructor(options) {
        super(options);

        this.radius = options.radius || 5;
        this.color = options.color;
    }

    draw() {
        var circles = this.d3Svg.selectAll('circle')
                    .data(this.dataSeries.data);

        // for new points, add circles
        circles.enter()
            .append('circle')
            .attr('class','point')
            .attr('r', this.radius)
            .call(this._applyInserts.bind(this))
            .style('fill', this.color);

        // for all points (new and existing), update centers
        circles
            .attr('cx', this.x.bind(this))
            .attr('cy', this.y.bind(this));

        // for deleted points, remove
        circles.exit().remove();
    }

    x(d) {
        return this.xRange(d.x_value);
    }

    y(d) {
        return this.yRange(d.y_value);
    }
}

export default ScatterGraph;
