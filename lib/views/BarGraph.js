import Graph from '../presenter/Graph';

class BarGraph extends Graph {
    constructor(options) {
        super(options);

        this.color = options.color;
        this.outerGroupInteriorPadding = options.outerGroupInteriorPadding || 0.4;
        this.outerGroupExteriorPadding = options.outerGroupExteriorPadding || 0.125;
        this.innerGroupInteriorPadding = options.innerGroupInteriorPadding || 0.1;
        this.innerGroupExteriorPadding = options.innerGroupExteriorPadding || 0;
    }

    draw() {
        var interval = this.xRange.rangeExtent();

        this.xRange.rangeBands(interval, this.outerGroupInteriorPadding, this.outerGroupExteriorPadding);
        var data = this.dataSeries.data;

        var bars = this.d3Svg.selectAll('rect.bar')
                    .data(data);

        bars.enter()
            .append('rect')
            .attr('class', 'bar');

        bars.call(this._applyInserts.bind(this));

        bars.exit().remove();

        var indices = {};

        if (data[0] && data[0].x_value instanceof Array) {
            //this means the bar graph is going to be a grouped bar graph 2 levels deep. no more than that.
            var mappedData = data.map(point => point.x_value[1]);
            var setData = new Set(mappedData);
            var distinctSubRangeValues = Array.from(setData);

            var xSubRange = d3.scale.ordinal()
                                .domain(distinctSubRangeValues)
                                .rangeBands([0, this.xRange.rangeBand()], this.innerGroupInteriorPadding, this.innerGroupExteriorPadding);

            bars
                .attr('x', d => this.xRange(d.x_value[0]) + xSubRange(d.x_value[1]))
                .attr('y', d => this.yRange(d.y))
                .attr('width', xSubRange.rangeBand())
                .attr('height', d => this.height(d))
                .attr('class', 'bar bar--grouped')
                .attr('data-group', d => d.x_value[0])
                .attr('data-key', d => d.x_value[1])
                .attr('data-group_index', (d, i) => {
                    var val = d.x_value[0];
                    if (indices[val] === undefined) {
                        indices[val] = 0;
                    } else {
                        indices[val]++;
                    }
                    return indices[val];
                });
        } else {
            //this is a standard bar graph
            bars
                .attr('x', d => this.xRange(d.x_value))
                .attr('y', d => this.yRange(d.y))
                .attr('width', this.xRange.rangeBand())
                .attr('height', this.height.bind(this))
                .attr('data-group', d => d.x_value)
                .attr('data-key', d => d.x_value)
                .attr('data-group_index', 1);
        }

        this.legendData.setData( this._createLegendData() );
    }

    height(d) {
        var yMin = Math.max(this.yRange.domain()[0], 0);
        var height = this.yRange(yMin) - this.yRange(d.y);
        return Math.max(height, 0);
    }

    _createLegendData() {
        var xLabel = this.axisLabels.x instanceof Array ? this.axisLabels.x[1] : this.axisLabels.x;

        var barMap = {};
        var legendData = [];
        this.d3Svg.selectAll('.bar')
            .each(function() {
                var bar = d3.select(this);
                var i = bar.attr('data-key');
                if (!barMap[i]) {
                    barMap[i] = true;
                    legendData.push({
                        color: window.getComputedStyle(this).fill,
                        label: `${xLabel} = ${bar.attr('data-key')}`
                    });
                }
            });

        return legendData;
    }
}

export default BarGraph;
