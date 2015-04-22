import Graph from '../presenter/Graph';

class BarGraph extends Graph {
    constructor(options) {
        super(options);

        this.color = options.color;
        this.innerPadding = options.innerPadding || 0.2;
        this.outerPadding = options.outerPadding || 0.1;
    }
    draw() {
        var interval = this.xRange.rangeExtent();

        this.xRange.rangeBands(interval, this.innerPadding, this.outerPadding);
        var data = this.dataSeries.data;
        var self = this;
        if (data[0] && data[0].x_value instanceof Array) {
            //this means the bar graph is going to be a grouped bar graph 2 levels deep. no more than that.
            var mappedData = data.map(point => point.x_value[1]);
            var setData = new Set(mappedData);
            var distinctSubRangeValues = Array.from(setData);

            var xSubRange = d3.scale.ordinal().domain(distinctSubRangeValues).rangeBands([0, this.xRange.rangeBand()], this.innerPadding, this.outerPadding);

            this.el = this.d3Svg.selectAll('.bars')
                        .data(data)
                        .enter()
                        .append('g')
                        .attr('class', 'grouped_bar')
                        .each(function(d, i) {
                            var selection = d3.select(this);

                            var x = self.xRange(d.x_value[0]) + xSubRange(d.x_value[1]);
                            selection.append('rect')
                                    .attr('x', x)
                                    .attr('y', self.yRange(d.y))
                                    .attr('width', xSubRange.rangeBand())
                                    .attr('height', self.height(d))
                                    .call(self._applyInserts.bind(self));
                        });
        } else {
            //this is a standard bar graph
            this.el = this.d3Svg.selectAll('.bars')
                        .data(data)
                    .enter().append('rect')
                        .attr('class', 'bar')
                        .attr('x', this.x.bind(this))
                        .attr('y', this.y.bind(this))
                        .attr('width', this.width.bind(this))
                        .attr('height', this.height.bind(this))
                        .call(this._applyInserts.bind(this));
        }
    }
    update() {
        this.el.attr('x', this.x.bind(this))
                .attr('y', this.y.bind(this))
                .attr('width', this.width.bind(this))
                .attr('height', this.height.bind(this));
    }
    x(d) {
        return this.xRange(d.x_value);
    }
    y(d) {
        return this.yRange(d.y);
    }
    width() {
        return this.xRange.rangeBand();
    }
    height(d) {
        var yMin = this.yRange.domain()[0];
        return this.yRange(yMin) - this.yRange(d.y);
    }
}

export default BarGraph;