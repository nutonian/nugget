import Graph from '../views/Graph';

class ScatterGraph extends Graph {
    constructor(options) {
        super(options);

        var config = this.config.ScatterGraph;
        this.radius = options.radius || config.radius;
        this.color = options.color;
    }

    draw() {
        var circles = this.circles = this.d3Svg.selectAll('circle')
                    .data(this.dataSeries.data);

        // for new points, add circles
        circles.enter()
            .append('circle')
            .attr('class','point')
            .attr('r', this.radius)
            .style('fill', this.color);

        circles.call(this._applyInserts.bind(this));

        // for all points (new and existing), update centers
        circles
            .attr('cx', d => this.xRange(d.x_value))
            .attr('cy', d => this.yRange(d.y_value));

        // for deleted points, remove
        circles.exit().remove();

        if (this.guides) {
            circles.classed('pointer', true);
        }
    }

    drawGuides(container, chartOpts) {
        var circles = this.circles;
        var zoomX   = chartOpts.zoomX;
        var zoomY   = chartOpts.zoomY;

        function updateGuides(circleData, circleIdx) {
            var data = [circleData];

            var guides = container.selectAll('.scatter_plot_guides').data(data);

            var g = guides.enter()
                .append('g')
                .attr('class', 'scatter_plot_guides');

            var guideOpts = {
                xProp: 'x_value',
                yProp: 'y_value'
            };
            super.drawXLineGuide(guides, g, chartOpts, guideOpts);
            super.drawYLineGuide(guides, g, chartOpts, guideOpts);

            /*jshint validthis:true */
            var circleEl = this;
            zoomX.on('zoom.scatter_plot_guides', function() {
                updateGuides.call(circleEl, circleData, circleIdx);
            });
            zoomY.on('zoom.scatter_plot_guides', function() {
                updateGuides.call(circleEl, circleData, circleIdx);
            });
        }

        circles
            .on('mouseenter', updateGuides)
            .on('mouseleave', function() {
                var guides = container.selectAll('.scatter_plot_guides').data([]);
                guides.exit().remove();

                zoomX.on('zoom.scatter_plot_guides', null);
                zoomY.on('zoom.scatter_plot_guides', null);
            });

    }
}

export default ScatterGraph;
