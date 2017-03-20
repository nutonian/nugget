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
        var opts = this._createCommonGuideOpts(chartOpts, guideOpts);
        guideOpts = guideOpts || {};

        enterSelection.append('line')
            .attr('class', 'guide_line guide_line_x');

        enterSelection.append('rect')
            .attr('class', 'guide_label_bg guide_label_x_bg');

        enterSelection.append('text')
            .attr('class', 'guide_label guide_label_x')
            .attr('font-size', opts.fontSize)
            .attr('height', opts.fontSize)
            .attr('text-anchor', 'middle');

        var guideData = dataSelection.data();
        var createXLabelText;
        if (opts.createLabelText) {
            createXLabelText = opts.createLabelText;
        } else if (opts.xGuideLabelFormat) {
            createXLabelText = function(d) { return opts.xGuideLabelFormat(d[opts.xProp]); };
        } else {
            createXLabelText = function(d) { return opts.xLabelFormat(d[opts.xProp]); };
        }

        dataSelection.selectAll('.guide_label_x')
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

        dataSelection.selectAll('.guide_label_x_bg').each(function() {
            var labelBBox = self.getLabelBBox(this, '.guide_label_x');
            // + 1's are for centering
            d3.select(this)
                .attr('x', labelBBox.x - (opts.labelPadding / 2))
                .attr('y', labelBBox.y + 1)
                .attr('width', labelBBox.width + opts.labelPadding)
                .attr('height', opts.fontSize + 1);
        });

        var line = dataSelection
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
        var opts = this._createCommonGuideOpts(chartOpts, guideOpts);

        enterSelection.append('line')
            .attr('class', 'guide_line guide_line_y');

        enterSelection.append('rect')
            .attr('class', 'guide_label_bg guide_label_y_bg')
            .attr('stroke', guideOpts.color);

        enterSelection.append('text')
            .attr('class', 'guide_label guide_label_y')
            .attr('font-size', opts.fontSize)
            .attr('height', opts.fontSize)
            .attr('text-anchor', 'end');

        var guideData = dataSelection.data();
        var createYLabelText;
        if (opts.createLabelText) {
            createYLabelText = opts.createLabelText;
        } else if (opts.yGuideLabelFormat) {
            createYLabelText = function(d) { return opts.yGuideLabelFormat(d[opts.yProp]); };
        } else {
            createYLabelText = function(d) { return opts.yLabelFormat(d[opts.yProp]); };
        }

        dataSelection.selectAll('.guide_label_y')
            .data(function(d, i) { return [guideData[i]]; })
            .text(createYLabelText)
            .attr('x', opts.margins.left - opts.labelMargin - opts.labelPadding)
            .attr('y', d => opts.yRange(d[opts.yProp]) + (opts.fontSize / 2));

        dataSelection.selectAll('.guide_label_y_bg').each(function() {
            var labelBBox = self.getLabelBBox(this, '.guide_label_y');
            // + 1's are for centering
            d3.select(this)
                .attr('x', labelBBox.x - (opts.labelPadding / 2))
                .attr('y', labelBBox.y + 1)
                .attr('width', labelBBox.width + opts.labelPadding)
                .attr('height', opts.fontSize + 1);
        });

        var line = dataSelection
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

    _createCommonGuideOpts(chartOpts, guideOpts) {
        guideOpts = guideOpts || {};

        var width   = chartOpts.width;
        var height  = chartOpts.height;
        var margins = chartOpts.margins;
        var bottom  = height - margins.bottom;

        var opts = {
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
            xGuideLabelFormat: chartOpts.xGuideLabelFormat,
            xLabelFormat    : chartOpts.xLabelFormat,
            yGuideLabelFormat: chartOpts.yGuideLabelFormat,
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
