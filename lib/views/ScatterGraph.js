import Graph from '../presenter/Graph';

class ScatterGraph extends Graph {
    constructor(options) {
        super(options);

        this.radius = options.radius || 5;
        this.color = options.color;
    }

    draw() {
        this.element = this.d3Svg.selectAll('circle')
                            .data(this.dataSeries.data)
                        .enter()
                            .append('circle')
                            .attr('class','point')
                            .attr('r', this.radius)
                            .attr('cx', this.x.bind(this))
                            .attr('cy', this.y.bind(this))
                            .call(this._applyInserts.bind(this))
                            .style('fill', this.color);
    }

    update() {
        this.element
            .attr('cx', this.x.bind(this))
            .attr('cy', this.y.bind(this));
    }

    x(d) {
        return this.xRange(d.x);
    }

    y(d) {
        return this.yRange(d.y);
    }
}

export default ScatterGraph;
