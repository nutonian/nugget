class LegendView {
    constructor() {
        this.shapeMap = {
            'rect'   : this.drawRect,
            'circle' : this.drawCircle
        };
        this.DEFAULT_RECT_SIZE = 14;
        this.DEFAULT_CIRCLE_RADIUS = 7;
    }

    draw(el, data) {
        el.html('');
        this.drawBg(el);
        this.drawContent(el, data);
    }

    drawBg(el) {
        el.append('rect')
            .attr('class', 'legend_bg')
            .attr('width', '100%')
            .attr('height', '100%');
    }

    drawContent(el, data) {
        var textMargin = 10;
        var textSize   = 14;

        var height = el.node().getBBox().height;
        var currX  = textMargin;
        var textY  = height / 2;

        data.forEach(function(d, i) {
            var g = el.append('g')
                        .attr('class', 'legend_group');

            var shape = d.shape || 'rect';
            var drawFn = this.shapeMap[shape];
            var swatch = drawFn.call(this, g, d, currX, height);
            swatch
                .attr('fill', d.color)
                .attr('class', 'legend_swatch');

            var swatchBBox = swatch.node().getBBox();
            currX = swatchBBox.x + swatchBBox.width + textMargin;

            var text = g.append('text')
                .attr('x', currX)
                .attr('y', textY)
                .attr('font-size', textSize)
                .attr('dominant-baseline', 'middle')
                .attr('class', 'legend_label')
                .text(d.label);

            var textBBox = text.node().getBBox();
            currX = textBBox.x + textBBox.width + textMargin;
        }, this);
    }

    // Use this to draw squares, rectangles, lines, etc
    drawRect(container, data, currX, containerHeight) {
        var width  = data.width  || this.DEFAULT_RECT_SIZE;
        var height = data.height || this.DEFAULT_RECT_SIZE;

        var rect = container.append('rect')
            .attr('x', currX)
            .attr('y', (containerHeight - height) / 2)
            .attr('width', width)
            .attr('height', height);

        return rect;
    }

    drawCircle(container, data, currX, containerHeight) {
        var radius = data.radius || this.DEFAULT_CIRCLE_RADIUS;

        var circle = container.append('circle')
            .attr('cx', currX + radius)
            .attr('cy', containerHeight / 2)
            .attr('r', radius);

        return circle;
    }
}

export default LegendView;
