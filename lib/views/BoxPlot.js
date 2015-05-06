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

        // functions used to compute various parameters for drawing the box plot
        var halfRangeBand = d => (this.xRange(d.x_value) + (this.xRange.rangeBand() / 2));
        var lineX2 = d => this.xRange(d.x_value) + this.xRange.rangeBand();
        var initialX = d => this.xRange(d.x_value);
        var yMax = d => this.yRange(d.y_max);
        var yMin = d => this.yRange(d.y_min);
        var median = d => this.yRange(d.y_50pct);

        var boxes = this.d3Svg.selectAll('g.box_plot')
                    .data(this.dataSeries.data);

        // for new data points, create all the svg elements for a box plot
        var boxGroup = this.boxGroup = boxes.enter()
            .append('g')
            .attr('class', 'box_plot');

        if (this.guides) {
            boxGroup.classed('pointer', true);
        }

        boxGroup.append('line')
            .attr('class', 'range');

        boxGroup.append('line')
            .attr('class','max');

        boxGroup.append('line')
            .attr('class','min');

        boxGroup.append('rect')
            .attr('class','distribution')
            .call(this._applyInserts.bind(this));

        boxGroup.append('line')
            .attr('class','median');

        // for each data point (old and new), update the positions, widths etc.
        boxes.select('.range')
            .attr('x1', halfRangeBand)
            .attr('x2', halfRangeBand)
            .attr('y1', yMax)
            .attr('y2', yMin);

        boxes.select('.max')
            .attr('x1', initialX)
            .attr('x2', lineX2)
            .attr('y1', yMax)
            .attr('y2', yMax);

        boxes.select('.min')
            .attr('x1', initialX)
            .attr('x2', lineX2)
            .attr('y1', yMin)
            .attr('y2', yMin);

        boxes.select('.distribution')
            .attr('width', () => this.xRange.rangeBand())
            .attr('height', d => this.yRange(d.y_25pct) - this.yRange(d.y_75pct))
            .attr('y', d => this.yRange(d.y_75pct))
            .attr('x', d => this.xRange(d.x_value));

        boxes.select('.median')
            .attr('x1', initialX)
            .attr('x2', lineX2)
            .attr('y1', median)
            .attr('y2', median);

        // for removed data points, remove the elements
        boxes.exit().remove();
    }

    drawGuides(container, opts) {
        var guideKeys = ['y_min', 'y_25pct', 'y_50pct', 'y_75pct', 'y_max'];

        var fontSize = 14;
        var labelMargin = 2;
        var labelPadding = 5;
        var yRange = this.yRange;

        function getLabelBBox(node) {
            var parentNode = d3.select(node.parentNode);
            var textNode = parentNode.select('.guide_label');
            var bbox = textNode.node().getBBox();
            return bbox;
        }

        this.boxGroup.on('mouseenter', function(boxData, boxIdx) {
            var boxGroupEl = this;

            var data = [];
            guideKeys.forEach(key => data.push(boxData[key]));

            var guides = container.selectAll('.box_plot_guide').data(data);

            var g = guides.enter()
                .append('g')
                .attr('class', 'box_plot_guide');

            g.append('rect')
                .attr('class', 'guide_label_bg');

            g.append('text')
                .attr('class', 'guide_label')
                .attr('font-size', fontSize)
                .attr('height', fontSize)
                .attr('text-anchor', 'end');

            g.append('line')
                .attr('class', 'guide_line');

            guides.selectAll('.guide_label')
                .text(d => opts.yLabelFormat(d))
                .attr('x', () => opts.margins.left - labelMargin - labelPadding)
                .attr('y',  d => yRange(d) + (fontSize / 2));

            guides.selectAll('.guide_label_bg').each(function() {
                var labelBBox = getLabelBBox(this);
                d3.select(this)
                    .attr('x', labelBBox.x - (labelPadding / 2))
                    .attr('y', labelBBox.y)
                    .attr('width', labelBBox.width + labelPadding)
                    .attr('height', fontSize + 1); // tiny bump so text doesn't collide with border
            });

            guides.selectAll('.guide_line')
                .attr('x1', function(d) {
                    var bbox = getLabelBBox(this);
                    return bbox.x + bbox.width;
                })
                .attr('y1',  d => yRange(d))
                .attr('x2', () => boxGroupEl.getBBox().x)
                .attr('y2',  d => yRange(d));

        })
        .on('mouseleave', function() {
            var guides = container.selectAll('.box_plot_guide').data([]);
            guides.exit().remove();
        });
    }
}

export default BoxPlot;
