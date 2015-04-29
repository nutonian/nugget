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

        var bars = this.d3Svg.selectAll('rect.bar')
                    .data(data);

        bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .call(this._applyInserts.bind(this));

        bars.exit().remove();

        var indices = {};

        if (data[0] && data[0].x_value instanceof Array) {
            //this means the bar graph is going to be a grouped bar graph 2 levels deep. no more than that.
            var mappedData = data.map(point => point.x_value[1]);
            var setData = new Set(mappedData);
            var distinctSubRangeValues = Array.from(setData);

            var xSubRange = d3.scale.ordinal()
                                .domain(distinctSubRangeValues)
                                .rangeBands([0, this.xRange.rangeBand()], this.innerPadding, this.outerPadding);

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
    }
    height(d) {
        var yMin = this.yRange.domain()[0];
        var height = this.yRange(yMin) - this.yRange(d.y);
        return Math.max(height, 0);
    }
    drawLegend(container, width, height, options) {
        this.drawLegendBg(container);

        var barMap = {};
        var legendSwatches = [];
        this.d3Svg.selectAll('.bar')
            .each(function() {
                var bar = d3.select(this);
                var i = bar.attr('data-key');
                if (!barMap[i]) {
                    barMap[i] = true;
                    legendSwatches.push({
                        fill: window.getComputedStyle(this).fill,
                        key: bar.attr('data-key')
                    });
                }
            });

        var textMargin = 10;
        var textSize = 14;
        var swatchSize = 14;
        var currX = textMargin;
        var swatchY = (height - swatchSize) / 2;
        var textY = height / 2;

        var xLabel = options.axisLabels.x instanceof Array ? options.axisLabels.x[1] : options.axisLabels.x;

        legendSwatches.forEach(function(data, i) {
            var g = container.append('g');

            g.append('rect')
                .attr('x', currX)
                .attr('y', swatchY)
                .attr('width', swatchSize)
                .attr('height', swatchSize)
                .attr('fill', data.fill)
                .attr('class', 'legend_swatch');

            var text = g.append('text')
                .attr('x', currX + swatchSize + textMargin)
                .attr('y', textY)
                .text(`${xLabel} = ${data.key}`)
                .attr('font-size', textSize)
                .attr('dominant-baseline', 'middle');

            var textBBox = text.node().getBBox();
            currX = textBBox.x + textBBox.width + textMargin;
        });
    }
}

export default BarGraph;
