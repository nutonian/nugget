import Graph from '../presenter/Graph';

class BinnedMeanGraph extends Graph {
    constructor(options) {
        super(options);
    }

    // a binned mean plot needs to allow extra space for the
    // max circle radius (which is 30)
    static extraXPadding() {
        return 30;
    }

    static extraYPadding() {
        return 30;
    }

    draw() {
        var line = this.d3Svg.selectAll('path.line')
                    .data([this.dataSeries.data]);

        var lineFunction = d3.svg.line()
            .x(d => this.xRange(d.x_mean))
            .y(d => this.yRange(d.y_mean))
            .interpolate('linear');

        line.enter()
            .append('path')
            .attr('class', 'line')
            .attr('fill', 'none');

        line.attr('d', lineFunction);

        line.exit().remove();


        // Append circles in order of num_values to help with display list overlap
        var circleData = this.dataSeries.getDataCopy();
        circleData.sort(d3.descending);

        var radiusScale = this.createRadiusScale(circleData);

        var circles = this.d3Svg.selectAll('.bin_circle')
            .data(circleData);

        circles.enter()
            .append('circle')
            .attr('class', 'bin_circle')
            .attr('r', d => radiusScale(d.num_values))
            .call(this._applyInserts.bind(this));

        circles
            .attr('cx', d => this.xRange(d.x_mean))
            .attr('cy', d => this.yRange(d.y_mean));

        circles.exit().remove();
    }

    createRadiusScale(data) {
        var numValsMin  = d3.min(data, function(d) { return d.num_values; });
        var numValsMax  = d3.max(data, function(d) { return d.num_values; });
        var radiusScale = d3.scale.linear()
                            .domain([numValsMin, numValsMax])
                            .range([5, 30]);
        return radiusScale;
    }

    drawLegend(container, width, height) {
        var radiusScale = this.createRadiusScale(this.dataSeries.data);

        var radius = 10;
        var x = radius + radius;
        var y = height / 2;

        var legendCircle = container.selectAll('circle.legend_circle')
            .data([{ x: x, y: y}]);

        legendCircle.enter()
            .append('circle')
            .attr('class', 'legend_circle')
            .attr('r', radius);

        legendCircle
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        legendCircle.exit().remove();

        var textXPadding = radius + 4;
        var legendText = container.selectAll('text.legend_label')
            .data([{ x: x + textXPadding, y: y}]);

        legendText.enter()
            .append('text')
            .text('approx. ' + Math.round( radiusScale.invert(radius) ) + ' values')
            .attr('class', 'legend_label')
            .attr('dominant-baseline', 'middle');

        legendText
            .attr('x', d => d.x)
            .attr('y', d => d.y);

        legendText.exit().remove();
    }
}

export default BinnedMeanGraph;
