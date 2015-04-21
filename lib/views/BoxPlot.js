import Graph from '../presenter/Graph';

class BoxPlot extends Graph {
    constructor(options) {
        super(options);

        this.color = options.color;
        this.innerPadding = options.innerPadding || 0.5;
        this.outerPadding = options.outerPadding || 0.2;
    }
    draw() {
        var interval = this.xRange.rangeExtent();
        this.xRange.rangeBands(interval, this.innerPadding, this.outerPadding);

        var self = this;
        this.el = this.d3Svg.selectAll('.box')
                        .data(this.dataSeries.data)
                    .enter()
                    .append('g')
                    .attr('class', 'box_plot')
                    .each(function(d, i) {
                        var selection = d3.select(this);

                        var halfRangeBand = (self.xRange(d.x_value) + (self.xRange.rangeBand() / 2));
                        var lineX2 = self.xRange(d.x_value) + self.xRange.rangeBand();
                        var initialX = self.xRange(d.x_value);
                        var yMax = self.yRange(d.y_max);
                        var yMin = self.yRange(d.y_min);
                        var median = self.yRange(d.y_50pct);

                        selection.append('line')
                            .attr('class', 'range')
                            .attr('x1', halfRangeBand)
                            .attr('x2', halfRangeBand)
                            .attr('y1', yMax)
                            .attr('y2', yMin);

                        selection.append('line')
                            .attr('class','max')
                            .attr('x1', initialX)
                            .attr('x2', lineX2)
                            .attr('y1', yMax)
                            .attr('y2', yMax);

                        selection.append('line')
                            .attr('class','min')
                            .attr('x1', initialX)
                            .attr('x2', lineX2)
                            .attr('y1', yMin)
                            .attr('y2', yMin);

                        selection.append('rect')
                            .attr('class','distribution')
                            .attr('width', self.xRange.rangeBand())
                            .attr('height', self.yRange(d.y_25pct) - self.yRange(d.y_75pct))
                            .attr('y', self.yRange(d.y_75pct))
                            .attr('x', initialX);

                        selection.append('line')
                            .attr('class','median')
                            .attr('x1', initialX)
                            .attr('x2', lineX2)
                            .attr('y1', median)
                            .attr('y2', median);
                    })
                    .call(self._applyInserts.bind(this));
    }
    update() {
        this.el.select('.range')
            .attr('x1', d => (this.xRange(d.x_value) + (this.xRange.rangeBand() / 2)))
            .attr('x2', d => (this.xRange(d.x_value) + (this.xRange.rangeBand() / 2)))
            .attr('y1', d => this.yRange(d.y_max))
            .attr('y2', d => this.yRange(d.y_min));

        this.el.select('.max')
            .attr('x1', d => this.xRange(d.x_value))
            .attr('x2', d => this.xRange(d.x_value) + this.xRange.rangeBand())
            .attr('y1', d => this.yRange(d.y_max))
            .attr('y2', d => this.yRange(d.y_max));

        this.el.select('.min')
            .attr('x1', d => this.xRange(d.x_value))
            .attr('x2', d => this.xRange(d.x_value) + this.xRange.rangeBand())
            .attr('y1', d => this.yRange(d.y_min))
            .attr('y2', d => this.yRange(d.y_min));

        this.el.select('.distribution')
            .attr('width', this.xRange.rangeBand())
            .attr('height', d => this.yRange(d.y_25pct) - this.yRange(d.y_75pct))
            .attr('y', d => this.yRange(d.y_75pct))
            .attr('x', d => this.xRange(d.x_value));

        this.el.select('.median')
            .attr('x1', d => this.xRange(d.x_value))
            .attr('x2', d => this.xRange(d.x_value) + this.xRange.rangeBand())
            .attr('y1', d => this.yRange(d.y_50pct))
            .attr('y2', d => this.yRange(d.y_50pct));
    }
}

export default BoxPlot;