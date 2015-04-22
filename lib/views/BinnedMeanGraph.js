import Graph from '../presenter/Graph';

class BinnedMeanGraph extends Graph {
    constructor(options) {
        super(options);
    }

    draw() {
        this.el = this.d3Svg.append('g');

        this.el.append('path')
                .attr('class', 'line_path')
                .attr('fill', 'none')
                .call(this._drawLine.bind(this));

        // Append circles in order of num_values to help with display list overlap
        var circleData = this.dataSeries.getDataCopy();
        circleData.sort(function(a, b) {
            return b.num_values > a.num_values;
        });

        var radiusScale = this.createRadiusScale(circleData);

        this.el.selectAll('.bin_circle')
            .data(circleData)
        .enter()
            .append('circle')
            .attr('class', 'bin_circle')
            .attr('r', function(d) { return radiusScale(d.num_values); })
            .call(this._drawCircles.bind(this))
            .call(this._applyInserts.bind(this));

        this._drawLegend(radiusScale);
    }

    update() {
        this.el.select('path').call(this._drawLine.bind(this));
        this.el.selectAll('.bin_circle').call(this._drawCircles.bind(this));
    }

    createRadiusScale(data) {
        var numValsMin  = d3.min(data, function(d) { return d.num_values; });
        var numValsMax  = d3.max(data, function(d) { return d.num_values; });
        var radiusScale = d3.scale.linear()
                            .domain([numValsMin, numValsMax])
                            .range([5, 30]);
        return radiusScale;
    }

    _drawLegend(radiusScale) {
        var radius = 10;
        var x = this.xRange(0) + (radius * 2);
        var y = radius * 2;

        this.el
            .append('circle')
            .attr('class', 'legend_circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', radius);

        var textXPadding = 4;
        this.el
            .append('text')
            .text('approx. ' + Math.round( radiusScale.invert(radius) ) + ' values')
            .attr('class', 'legend_label')
            .attr('dominant-baseline', 'middle')
            .attr('x', x + textXPadding)
            .attr('y', y);
    }

    _drawLine(line) {
        var lineFunction = d3.svg.line()
                               .x((d) => { return this.xRange(d.x_mean); })
                               .y((d) => { return this.yRange(d.y_mean); })
                               .interpolate('linear');
        var data = lineFunction(this.dataSeries.data);
        line.attr('d', data);
    }

    _drawCircles(circles) {
        circles
            .attr('cx', (d) => { return this.xRange(d.x_mean); })
            .attr('cy', (d) => { return this.yRange(d.y_mean); });
    }
}

export default BinnedMeanGraph;
