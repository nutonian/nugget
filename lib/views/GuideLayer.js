import Events from '../events/Events';

class GuideLayer extends Events {
    constructor() {
        super();
    }

    getLabelBBox(node, selector) {
        selector = selector || '.guide_label';

        var parentNode = d3.select(node.parentNode);
        var textNode = parentNode.select(selector);
        var bbox = textNode.node().getBBox();
        return bbox;
    }

    drawXLineGuide(dataSelection, enterSelection, chartOpts, guideOpts) {
        var self = this;
        var opts = this._createCommonGuideOpts(dataSelection, enterSelection, chartOpts, guideOpts);
        guideOpts = guideOpts || {};

        opts.enterSelection.append('line')
            .attr('class', 'guide_line guide_line_x');

        opts.enterSelection.append('rect')
            .attr('class', 'guide_label_bg guide_label_x_bg');

        opts.enterSelection.append('text')
            .attr('class', 'guide_label guide_label_x')
            .attr('font-size', opts.fontSize)
            .attr('height', opts.fontSize)
            .attr('text-anchor', 'middle');

        var guideData = opts.dataSelection.data();
        var createXLabelText = opts.createLabelText || function(d) { return opts.xLabelFormat(d[opts.xProp]); };

        opts.dataSelection.selectAll('.guide_label_x')
            .text(createXLabelText)
            .data(function(d, i) { return [guideData[i]]; })
            .attr('x', function(d) {
                var x              = opts.xRange(d[opts.xProp]);
                var labelWidth     = this.getBBox().width;
                var halfLabelWidth = labelWidth / 2;
                var labelLeft      = x - halfLabelWidth;
                var labelRight     = x + halfLabelWidth;
                var xMax           = opts.width - halfLabelWidth - opts.margins.right;

                if (labelRight > xMax) {
                    x = xMax;
                } else if (labelLeft < opts.xMin) {
                    x = opts.xMin + halfLabelWidth;
                }

                return x;
            })
            .attr('y', function() {
                return guideOpts.labelY || opts.bottom + this.getBBox().height;
            });

        opts.dataSelection.selectAll('.guide_label_x_bg').each(function() {
            var labelBBox = self.getLabelBBox(this, '.guide_label_x');
            // + 1's are for centering
            d3.select(this)
                .attr('x', labelBBox.x - (opts.labelPadding / 2))
                .attr('y', labelBBox.y + 1)
                .attr('width', labelBBox.width + opts.labelPadding)
                .attr('height', opts.fontSize + 1);
        });

        var line = opts.dataSelection
                        .selectAll('.guide_line_x')
                        .data(function(d, i) { return [guideData[i]]; });

        if (opts.onLineEnter) {
            opts.onLineEnter(line);
        } else {
            line
                .attr('x1', opts.constrainX)
                .attr('y1', opts.constrainY)
                .attr('x2', opts.constrainX)
                .attr('y2', opts.bottom);
        }
    }

    drawYLineGuide(dataSelection, enterSelection, chartOpts, guideOpts) {
        var self = this;
        var opts = this._createCommonGuideOpts(dataSelection, enterSelection, chartOpts, guideOpts);

        opts.enterSelection.append('line')
            .attr('class', 'guide_line guide_line_y');

        opts.enterSelection.append('rect')
            .attr('class', 'guide_label_bg guide_label_y_bg');

        opts.enterSelection.append('text')
            .attr('class', 'guide_label guide_label_y')
            .attr('font-size', opts.fontSize)
            .attr('height', opts.fontSize)
            .attr('text-anchor', 'end');

        var guideData = opts.dataSelection.data();
        var createYLabelText = opts.createLabelText || function(d) { return opts.yLabelFormat(d[opts.yProp]); };

        opts.dataSelection.selectAll('.guide_label_y')
            .data(function(d, i) { return [guideData[i]]; })
            .text(createYLabelText)
            .attr('x', opts.margins.left - opts.labelMargin - opts.labelPadding)
            .attr('y', d => opts.yRange(d[opts.yProp]) + (opts.fontSize / 2));

        opts.dataSelection.selectAll('.guide_label_y_bg').each(function() {
            var labelBBox = self.getLabelBBox(this, '.guide_label_y');
            // + 1's are for centering
            d3.select(this)
                .attr('x', labelBBox.x - (opts.labelPadding / 2))
                .attr('y', labelBBox.y + 1)
                .attr('width', labelBBox.width + opts.labelPadding)
                .attr('height', opts.fontSize + 1);
        });

        var line = opts.dataSelection
                    .selectAll('.guide_line_y')
                    .data(function(d, i) { return [guideData[i]]; });

        if (opts.onLineEnter) {
            opts.onLineEnter(line);
        } else {
            line
                .attr('x1', opts.xMin)
                .attr('y1', opts.constrainY)
                .attr('x2', opts.constrainX)
                .attr('y2', opts.constrainY);
        }
    }

    getPathY(length, pathNode, accuracyPx, numTestChunks) {
        var pathLength = pathNode.getTotalLength();

        var y = 0;

        if (length <= 0) {
            y = pathNode.getPointAtLength(0).y;
            return y;
        }

        if (length >= pathLength) {
            y = pathNode.getPointAtLength(pathLength).y;
            return y;
        }

        var startLength = 0;

        // First, make some very broad checks to figure out which "chunk" to start searching from...
        // Here, we split the path into sections and test to see if the requested length is within
        // them. This gives us a decent starting point so we're not iterating over the entire path
        // unnecessarily.
        numTestChunks = numTestChunks || 8;
        var testChunkSize = pathLength / numTestChunks;

        for (var i = 1; i <= numTestChunks; i++){
            var testChunkStart = testChunkSize * i;
            if (pathNode.getPointAtLength(testChunkStart).x > length) {
                startLength = testChunkStart - testChunkSize;
                break;
            }
        }

        // Increment to crawl the path at. Smaller is more accurate, but more intensive. Usually 1 is
        // fine (and extremely accurate), but you might want to increase this if you notice performance issues.
        accuracyPx = accuracyPx || 1;

        for (var j = startLength; j < pathLength; j = j + accuracyPx) {
            var pos = pathNode.getPointAtLength(j);
            if (pos.x >= length) {
                y = pos.y;
                break;
            }
        }

        return y;
    }

    _createCommonGuideOpts(dataSelection, enterSelection, chartOpts, guideOpts) {
        guideOpts = guideOpts || {};

        var width   = chartOpts.width;
        var height  = chartOpts.height;
        var margins = chartOpts.margins;
        var bottom  = height - margins.bottom;

        var opts = {
            dataSelection   : dataSelection,
            enterSelection  : enterSelection,
            xRange          : chartOpts.xRange,
            yRange          : chartOpts.yRange,
            fontSize        : 14,
            labelMargin     : 2,
            labelPadding    : 5,
            width           : width,
            height          : height,
            margins         : margins,
            bottom          : bottom,
            xMin            : margins.left,
            xMax            : width - margins.right,
            yMin            : margins.top,
            yMax            : bottom,
            xLabelFormat    : chartOpts.xLabelFormat,
            yLabelFormat    : chartOpts.yLabelFormat,
            xProp           : guideOpts.xProp || 'x',
            yProp           : guideOpts.yProp || 'y',
            createLabelText : guideOpts.createLabelText,
            onLineEnter     : guideOpts.onLineEnter
        };

        opts.constrainX = function(d) {
            var x = opts.xRange(d[opts.xProp]);
            if (x > opts.xMax) {
                x = opts.xMax;
            } else if (x < opts.xMin) {
                x = opts.xMin;
            }
            return x;
        };

        opts.constrainY = function(d) {
            var y = opts.yRange(d[opts.yProp]);
            if (y > opts.yMax) {
                y = opts.yMax;
            } else if (y < opts.yMin) {
                y = opts.yMin;
            }
            return y;
        };

        return opts;
    }
}

export default GuideLayer;
