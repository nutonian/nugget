import AggregateDataRange from '../models/AggregateDataRange';
import Events from '../events/Events';
import Utils from '../utils/Utils';
import Graph from './Graph';

class Chart extends Events {
    constructor(options) {
        super();

        this._childElementMap = new Map();
        this._aggregateDataRange = new AggregateDataRange();
        this._d3Svg = null;
        this._xRange = null;
        this._yRange = null;

        this._defaultPadding = 10;

        options = options || {};

        this.width         = options.width;
        this.height        = options.height;
        this.margins       = options.margins || { top: 0, left: 100, bottom: 50, right: 10 };
        this.axisLabels    = options.axisLabels || { x: '', y: '' };
        this.legend        = (options.legend === false) ? false : true;
        this.legendHeight  = options.legendHeight || 50;
        this.guides        = options.guides || false;
        this.guideColor    = options.guideColor || '#7C9EC9';
        this.guideFontSize = options.guideFontSize || 14;
        this.xGrid         = options.xGrid || false;
        this.yGrid         = options.yGrid || false;
        this.boxZoom       = (options.boxZoom === false) ? false : true;
    }

    appendTo(selectorOrEl) {
        var element = (typeof selectorOrEl === 'string') ?
            document.querySelectorAll(selectorOrEl)[0] : selectorOrEl;

        if (this._d3Svg) {
            return element.parentNode.replaceChild(this._d3Svg.node(), element);
        }

        var defaultDimensions = this._getDefaultDimensions(element);

        var width   = this.width  = this.width  || defaultDimensions.width;
        var height  = this.height = this.height || defaultDimensions.height;
        var margins = this.margins;

        var d3Svg = this._d3Svg = d3.select(element)
            .attr('width', width)
            .attr('height', height);

        var aggregateDataRange = this._aggregateDataRange;
        var childElementMap = this._childElementMap;

        var xScreenRange = [margins.left, (width - margins.right)];
        var yScreenRange = [(height - margins.bottom), margins.top];
        var scales = aggregateDataRange.getScales(xScreenRange, yScreenRange);
        var xRange = this._xRange = scales.x;
        var yRange = this._yRange = scales.y;

        var paddingTop = this._defaultPadding;
        var paddingBottom = this._defaultPadding;

        if (this.legend) {
            paddingTop = this.legendHeight + this._defaultPadding;
        }

        this._padRange(yRange, paddingTop, paddingBottom);

        var xAxis = this._drawXAxis(d3Svg, xRange, height, margins, this.xGrid);
        var yAxis = this._drawYAxis(d3Svg, yRange, width, margins, this.yGrid);

        if (this.guides) {
            this._initGuides({
                container        : d3Svg,
                width            : width,
                height           : height,
                margins          : margins,
                guideColor       : this.guideColor,
                guideFontSize    : this.guideFontSize,
                xRange           : xRange,
                yRange           : yRange
            });
        }

        var clipPathID = this._createClipPath(d3Svg, width, height, margins);
        var drawingSurface = this._createDrawingSurface(d3Svg, clipPathID);

        this._setAxisLabels(d3Svg, this.axisLabels, width, height, margins);

        this._childElementMap.forEach(function(nuggetView) {
            nuggetView.drawElement(drawingSurface, xRange, yRange);
        }, this);

        aggregateDataRange.on('change', (e) => {
            d3Svg.select('.x_axis').call(xAxis);
            d3Svg.select('.y_axis').call(yAxis);
        });

        this._initZoom({
            d3Svg             : d3Svg,
            drawingSurface    : drawingSurface,
            children          : childElementMap,
            xRange            : xRange,
            yRange            : yRange,
            xAxis             : xAxis,
            yAxis             : yAxis,
            margins           : margins,
            width             : width,
            height            : height,
            showXGrid         : this.xGrid,
            showYGrid         : this.yGrid,
            boxZoom           : this.boxZoom
        });

        if (this.legend) {
            this._drawLegend();
        }

        this._completeBoundingBox(d3Svg, width, height, margins);
    }

    add(nuggetView) {
        if (!this._checkInstance(nuggetView)) {
            throw 'Must be a valid Nugget View type';
        }

        this._childElementMap.set(nuggetView.id, nuggetView);
        this._aggregateDataRange.addDataSeries(nuggetView.dataSeries);

        nuggetView.dataSeries.on('change', (e) => {
            nuggetView.drawElement(this._d3Svg, this._xRange, this._yRange);
        });
    }

    remove(nuggetView) {
        if (!this._checkInstance(nuggetView)) {
            throw 'Must be a valid Nugget View type';
        }

        var width = this.width;
        var height = this.height;
        var margins = this.margins;

        var xScreenRange = [margins.left, (width - margins.right)];
        var yScreenRange = [(height - margins.bottom), margins.top];

        var aggregateDataRange = this._aggregateDataRange;
        aggregateDataRange.removeDataSeries(nuggetView.dataSeries);

        this._childElementMap.delete(nuggetView.id);
        nuggetView.remove();

        var scales   = aggregateDataRange.getScales(xScreenRange, yScreenRange);
        this._xRange = scales.x;
        this._yRange = scales.y;
    }

    _checkInstance(nuggetView) {
        return nuggetView instanceof Graph;
    }

    /*
    * Drawing functions
    */

    _getDefaultDimensions(element) {
        var parent = element.parentNode;
        return parent.getBoundingClientRect();
    }

    _padRange(range, amountPxTop, amountPxBottom) {
        var domain = range.domain().concat().sort(d3.ascending);
        var domainMax = domain[1];
        var domainMin = domain[0];
        domain[0] = domainMin - (domainMax - range.invert(amountPxBottom));
        domain[1] = domainMax + (domainMax - range.invert(amountPxTop));
        range.domain(domain);
    }

    _createClipPath(d3Svg, width, height, margins) {
        var clipPathID = Utils.createUniqueId('clip');
        d3Svg.append('clipPath')
            .attr('id', clipPathID)
            .append('rect')
            .attr('x', margins.left)
            .attr('y', margins.top)
            .attr('width', (width - (margins.right + margins.left)))
            .attr('height', (height - (margins.bottom + margins.top)));
        return clipPathID;
    }

    _createDrawingSurface(d3Svg, clipPathID) {
        var drawingSurface = d3Svg.append('g')
            .attr('class', 'drawing_surface')
            .attr('clip-path', 'url(#' + clipPathID + ')');
        return drawingSurface;
    }

    _drawXAxis(d3Svg, xRange, height, margins, showGrid) {
        var xAxis = d3.svg.axis()
            .scale(xRange)
            .tickPadding(7)
            .tickSubdivide(true);

        var tickSize = showGrid ? -height : -7;
        xAxis.tickSize(tickSize, 0);

        var axis = d3Svg.append('svg:g')
            .attr('class', 'x_axis')
            .attr('transform', 'translate(0,' + (height - margins.bottom) + ')')
            .call(xAxis);

        this._styleAxis(axis, showGrid);

        return xAxis;
    }

    _drawYAxis(d3Svg, yRange, width, margins, showGrid) {
        var yAxis = d3.svg.axis()
            .scale(yRange)
            .orient('left')
            .tickPadding(7)
            .tickFormat(d3.format('.4s'))
            .tickSubdivide(true);

        var tickSize = showGrid ? (-(width - (margins.left + margins.right))) : -7;
        yAxis.tickSize(tickSize, 0);

        var axis = d3Svg.append('svg:g')
            .attr('class', 'y_axis')
            .attr('transform', 'translate(' + (margins.left) + ', 0)')
            .call(yAxis);

        this._styleAxis(axis, showGrid);

        return yAxis;
    }

    _styleAxis(axisEl, showGrid) {
        if (showGrid) {
            axisEl.selectAll('line').attr('stroke-dasharray', '1,2');
        }
        return axisEl;
    }


    _drawLegend() {
        var legendMargin = 10;
        var doubleLegendMargin = legendMargin * 2;
        var legendWidth = this.width - this.margins.left - this.margins.right - doubleLegendMargin;
        var legendHeight = this.legendHeight - doubleLegendMargin;

        var legend = this._d3Svg.append('svg')
                        .attr('class', 'legend')
                        .attr('x', this.margins.left + legendMargin)
                        .attr('y', this.margins.top + legendMargin)
                        .attr('width', legendWidth)
                        .attr('height', legendHeight);

        // Each child view can append whatever it wants to the legend container.
        // We can eventually make this more intelligent about its contents.
        this._childElementMap.forEach(function(nuggetView) {
            nuggetView.createLegend(legend, legendWidth, legendHeight, {
                axisLabels: this.axisLabels
            });
        }, this);
    }

    _completeBoundingBox(d3Svg, width, height, margins) {
        d3Svg.append('line')
            .attr('x1', margins.left)
            .attr('x2', (width - margins.right))
            .attr('y1', margins.top)
            .attr('y2', margins.top)
            .attr('class', 'bounding_box');
        d3Svg.append('line')
            .attr('x1', (width - margins.right))
            .attr('x2', (width - margins.right))
            .attr('y1', margins.top)
            .attr('y2', height - margins.bottom)
            .attr('class', 'bounding_box');
    }

    _setAxisLabels(d3Svg, axisLabels, width, height, margins) {
        var xLabel = axisLabels.x instanceof Array ? axisLabels.x[0] : axisLabels.x;

        d3Svg.append('text')
            .attr('x', (width + margins.left) / 2)
            .attr('y', (height - (margins.bottom / 4)))
            .attr('class', 'axis_label')
            .style('text-anchor', 'middle')
            .text(xLabel);

        d3Svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('class', 'axis_label')
            .attr('y', margins.left / 4)
            .attr('x', 0 - (height / 2))
            .style('text-anchor', 'middle')
            .text(axisLabels.y);
    }

    /*
    * interaction functions
    */

    _initZoom(opts) {
        var dataSeries = this._aggregateDataRange.getFirstDataSeries();
        var dataSeriesType = opts.dataSeriesType = dataSeries.xAxisType;

        opts.zoomFixtureX = opts.d3Svg.append('g')
            .attr('class', 'zoom_fixture_x');
        opts.zoomX = d3.behavior.zoom()
            .x(opts.xRange)
            .on('zoom', function() {
                this._zoom(opts);
            }.bind(this));
        opts.zoomFixtureX.call(opts.zoomX);

        opts.zoomFixtureY = opts.d3Svg.append('g')
            .attr('class', 'zoom_fixture_y');
        opts.zoomY = d3.behavior.zoom()
            .y(opts.yRange)
            .on('zoom', function() {
                this._zoom(opts);
            }.bind(this));
        opts.zoomFixtureY.call(opts.zoomY);

        // proxy through mouse zoom events to x and y axis zoom behaviors
        if (dataSeriesType !== 'ordinal') {
            opts.d3Svg.on('touchstart.zoom.x', opts.zoomFixtureX.on('touchstart.zoom'));
            opts.d3Svg.on('wheel.zoom.x', opts.zoomFixtureX.on('wheel.zoom'));
            opts.d3Svg.on('mousewheel.zoom.x', opts.zoomFixtureX.on('mousewheel.zoom'));
            opts.d3Svg.on('MozMousePixelScroll.zoom.x', opts.zoomFixtureX.on('MozMousePixelScroll.zoom'));
        }

        opts.d3Svg.on('touchstart.zoom.y', opts.zoomFixtureY.on('touchstart.zoom'));
        opts.d3Svg.on('wheel.zoom.y', opts.zoomFixtureY.on('wheel.zoom'));
        opts.d3Svg.on('mousewheel.zoom.y', opts.zoomFixtureY.on('mousewheel.zoom'));
        opts.d3Svg.on('MozMousePixelScroll.zoom.y', opts.zoomFixtureY.on('MozMousePixelScroll.zoom'));

        if (opts.boxZoom) {
            this._initBoxZoom(opts);
        }
    }

    _zoom(opts) {
        var xAxisEl = opts.d3Svg.select('.x_axis').call(opts.xAxis);
        var yAxisEl = opts.d3Svg.select('.y_axis').call(opts.yAxis);

        this._styleAxis(xAxisEl, opts.showXGrid);
        this._styleAxis(yAxisEl, opts.showYGrid);

        opts.children.forEach(function(view, id, map) {
            view.drawElement(opts.drawingSurface, opts.xRange, opts.yRange);
        }, this);
    }

    _initBoxZoom(opts) {
        var d3Svg = opts.d3Svg;

        // save original x and y ranges
        var origXRange = opts.xRange.copy();
        var origYRange = opts.yRange.copy();

        // Disable pan
        d3Svg.on('mousedown.zoom', null);

        d3Svg.on('mousedown', function() {
            var isOrdinal = opts.dataSeriesType === 'ordinal';
            var coords = d3.mouse(this);
            var startX = isOrdinal ? opts.margins.left : coords[0];
            var startY = coords[1];
            var endX = startX;
            var endY = startY;

            var zoomBox = d3Svg.append('rect')
                .attr('x', startX)
                .attr('y', startY)
                .attr('class', 'zoom_box');

            d3Svg.on('mousemove', function() {
                var coords = d3.mouse(this);
                endX = isOrdinal ? (opts.width - opts.margins.right) : coords[0];
                endY = coords[1];

                if (endX > startX) {
                    zoomBox.attr('width', endX - startX);
                } else {
                    zoomBox
                        .attr('x', endX)
                        .attr('width', startX - endX);
                }

                if (endY > startY) {
                    zoomBox.attr('height', endY - startY);
                } else {
                    zoomBox
                        .attr('y', endY)
                        .attr('height', startY - endY);
                }
            });

            d3Svg.on('mouseup', function() {
                zoomBox.remove();

                d3Svg.on('mousemove', null);
                d3Svg.on('mouseup', null);

                // Bail out if the user didn't move the mouse enough
                var thresholdPX = 5;
                if (Math.abs(startX - endX) <= thresholdPX ||
                    Math.abs(startY - endY) <= thresholdPX) {
                    return;
                }

                var boxLeft = Math.min(startX, endX);
                var boxRight = Math.max(startX, endX);
                var boxTop = Math.min(startY, endY);
                var boxBottom = Math.max(startY, endY);

                var screenLeft = opts.margins.left;
                var screenRight = opts.width - opts.margins.right;
                var screenTop = opts.margins.top;
                var screenBottom = opts.height - opts.margins.bottom;

                var dataXLow, dataXHigh, scaleX, translateX = 0;
                if (!isOrdinal) {
                    dataXLow = opts.xRange.invert(boxLeft);
                    dataXHigh = opts.xRange.invert(boxRight);
                    scaleX = (screenRight - screenLeft) / (origXRange(dataXHigh) - origXRange(dataXLow));
                    translateX = screenLeft - scaleX * origXRange(dataXLow);
                }
                var dataYLow = opts.yRange.invert(boxBottom);
                var dataYHigh = opts.yRange.invert(boxTop);
                var scaleY = (screenBottom - screenTop) / (origYRange(dataYLow) - origYRange(dataYHigh));
                var translateY = screenTop - scaleY * origYRange(dataYHigh);

                var translate = [translateX, translateY];

                if (!isOrdinal) {
                    opts.zoomX.translate(translate);
                    opts.zoomX.scale(scaleX);
                    opts.zoomX.event(opts.zoomFixtureX.transition().duration(250));
                }

                opts.zoomY.translate(translate);
                opts.zoomY.scale(scaleY);
                opts.zoomY.event(opts.zoomFixtureY.transition().duration(250));
            });
        });
    }

    _initGuides(opts) {
        var fontSize         = opts.guideFontSize;
        var labelPadding     = fontSize + 2;
        var adjustedHeight   = fontSize + 4;
        var halfLabelPadding = labelPadding / 2;

        var bgRect = opts.container.append('rect')
                    .attr('class', 'mouse_target')
                    .attr('fill', 'transparent')
                    .attr('width', opts.width)
                    .attr('height', opts.height)
                    .attr('x', opts.margins.left);

        var xGuide = opts.container.append('line')
                        .attr('class', 'x_axis_guide')
                        .attr('y2', opts.height - opts.margins.bottom)
                        .attr('stroke-width', 0.5);

        var xLabelBg = opts.container.append('rect')
                            .attr('height', adjustedHeight)
                            .attr('class', 'guide_label_bg');

        var xLabel = opts.container.append('text')
                        .attr('class', 'x_axis_guide_label')
                        .attr('text-anchor', 'middle')
                        .style('font-size', fontSize + 'px');

        var yGuide = opts.container.append('line')
                        .attr('class', 'y_axis_guide')
                        .attr('x1', opts.margins.left)
                        .attr('stroke-width', 0.5);

        var yLabelBg = opts.container.append('rect')
                            .attr('height', adjustedHeight)
                            .attr('class', 'guide_label_bg');

        var yLabel = opts.container.append('text')
                        .attr('class', 'y_axis_guide_label')
                        .attr('dominant-baseline', 'central')
                        .style('font-size', fontSize + 'px');

        var xTickFormat = opts.xRange.tickFormat();
        var yTickFormat = opts.yRange.tickFormat();

        bgRect.on('mousemove', function(e) {
            var coords = d3.mouse(this);
            var x = coords[0];
            var y = coords[1];

            /**
            * Guides
            **/

            xGuide
                .attr('x1', x)
                .attr('x2', x)
                .attr('y1', y)
                .attr('stroke', opts.guideColor);

            yGuide
                .attr('x2', x)
                .attr('y1', y)
                .attr('y2', y)
                .attr('stroke', opts.guideColor);

            /**
            * X Label
            **/

            var xVal = opts.xRange.invert(x);
            var xLabelYAdjust = 2;
            xLabel
                .text(xTickFormat(xVal))
                .attr('x', x + halfLabelPadding)
                .attr('y', opts.height - ((opts.margins.bottom / 4) * 3));

            var xBBox = xLabel.node().getBBox();
            xLabelBg
                .attr('x', x - (xBBox.width / 2))
                .attr('y', xBBox.y + (xLabelYAdjust / 2))
                .attr('width', xBBox.width + labelPadding);

            /**
            * Y Label
            **/

            var yVal = opts.yRange.invert(y);
            yLabel.text(yTickFormat(yVal));

            var yBBox = yLabel.node().getBBox();
            var yLabelDistanceFromAxis = 6;
            var yLabelX = opts.margins.left - yBBox.width - yLabelDistanceFromAxis;

            yLabel
                .attr('x', yLabelX - (labelPadding / 2))
                .attr('y', y);

            yLabelBg
                .attr('x', yLabelX - labelPadding)
                .attr('y', y - (yBBox.height / 2))
                .attr('width', yBBox.width + labelPadding);

        });
    }
}
export default Chart;
