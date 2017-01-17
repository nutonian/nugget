import Graph from '../views/Graph';

class AreaGraph extends Graph {
    constructor(options) {
        super(options);

        this.interpolate = options.interpolate || 'linear';
        this.legendLabel = options.legendLabel || this.id;

        this.guides = false; // area graphs don't support guides
    }

    draw(shouldAnimate) {

        var areaFunction = d3.svg.area()
            .x(d => this.xRange(d.x_value))
            .y0(d => this.yRange(d.y_min))
            .y1(d => this.yRange(d.y_max))
            .interpolate(this.interpolate);

        var area = this.d3Svg.selectAll('path.area')
                    .data([this.dataSeries.data]);

        area.enter().append('path')
                    .attr('stroke-width', 1)
                    .attr('class', 'area')
                    .attr('fill', this.color)
                    .attr('stroke', this.color);

        area.call(this._applyInserts.bind(this));

        if (shouldAnimate) {
            area.transition()
                .attr('d', areaFunction);
        } else {
            area.attr('d', areaFunction);
        }

        area.exit().remove();

        this.legendData.setData(this._createLegendData());
    }

    _createLegendData() {
        var data = [{
            color  : this.color || 'black',
            label  : this.legendLabel,
            shape: 'rect',
            width: 12,
            height: 12
        }];
        return data;
    }
}

export default AreaGraph;
