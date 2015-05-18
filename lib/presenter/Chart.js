import AggregateDataRange from '../models/AggregateDataRange';
import Events from '../events/Events';
import Utils from '../utils/Utils';
import Graph from './Graph';

class Chart extends Events {
    constructor(options) {
        super();

        this._childElementMap = new Map();
        this._aggregateDataRange = new AggregateDataRange();
        this._d3Svg  = null;
        this._xRange = null;
        this._yRange = null;
        this._zooms  = null;

        this._defaultPadding = 10;

        options = options || {};

        this.width         = options.width;
        this.height        = options.height;
        this.margins       = Object.assign(
            {top: 0, left: 100, bottom: 50, right: 10 },
            (options.margins || {})
        );
        this.axisLabels    = options.axisLabels || { x: '', y: '' };
        this.legend        = (options.legend === false) ? false : true;
        this.legendHeight  = options.legendHeight || 50;
        this.guides        = options.guides || false;
        this.guideColor    = options.guideColor || '#7C9EC9';
        this.guideFontSize = options.guideFontSize || 14;
        this.xGrid         = options.xGrid || false;
        this.yGrid         = options.yGrid || false;
        this.boxZoom       = (options.boxZoom === false) ? false : true;
        this.xLabelFormat  = options.xLabelFormat;
        this.yLabelFormat  = options.yLabelFormat;

        // Origin ticks are always rendered, so subtract 1 from specified value
        this.numXTicks     = (typeof options.numXTicks === 'number') ? (options.numXTicks - 1) : null;
        this.numYTicks     = (typeof options.numYTicks === 'number') ? (options.numYTicks - 1) : null;
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

        var xScreenRange = this._xScreenRange = [margins.left, (width - margins.right)];
        var yScreenRange = this._yScreenRange = [(height - margins.bottom), margins.top];
        var scales = aggregateDataRange.getScales(xScreenRange, yScreenRange);
        var xRange = this._xRange = scales.x;
        var yRange = this._yRange = scales.y;


        // Set default formats
        function identityFn(val, format) { return val; }

        if (this.xLabelFormat) {
            this.xLabelFormat = (typeof this.xLabelFormat === 'string') ?
                                    d3.format(this.xLabelFormat) : this.xLabelFormat;
        } else {
            this.xLabelFormat = xRange.tickFormat ? xRange.tickFormat() : identityFn;
        }

        if (this.yLabelFormat) {
            this.yLabelFormat = (typeof this.yLabelFormat === 'string') ?
                                    d3.format(this.yLabelFormat) : this.yLabelFormat;
        } else {
            this.yLabelFormat = yRange.tickFormat ? yRange.tickFormat() : identityFn;
        }


        // add padding
        this._padAxes(xRange, yRange);

        var xAxis = this._xAxis = this._drawXAxis();
        var yAxis = this._yAxis = this._drawYAxis();

        // These are just general "live" x/y guides. Some plots might implement their own guides
        // in which case you probably don't want to enable this.
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
        var drawingSurface = this._drawingSurface = this._createDrawingSurface(d3Svg, clipPathID);

        this._setAxisLabels(d3Svg, this.axisLabels, width, height, margins);

        var zooms = this._zooms = this._initZoom({
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

        this._childElementMap.forEach(function(nuggetView) {
            nuggetView.drawElement(drawingSurface, xRange, yRange);
            nuggetView.initGuides(d3Svg, {
                width         : width,
                height        : height,
                margins       : margins,
                xLabelFormat  : this.xLabelFormat,
                yLabelFormat  : this.yLabelFormat,
                zooms         : zooms
            });
        }, this);
        d3Svg.select('.x_axis').call(xAxis);
        d3Svg.select('.y_axis').call(yAxis);

        aggregateDataRange.on('add',    (e) => this._updateDataRanges(e));
        aggregateDataRange.on('change', (e) => this._updateDataRanges(e));

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
            nuggetView.drawElement(this._drawingSurface, this._xRange, this._yRange);
        });

        // If main svg element has already been created, draw the added view immediately using existing ranges
        if (this._d3Svg) {
            nuggetView.drawElement(this._drawingSurface, this._xRange, this._yRange);
        }
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

    _updateDataRanges(e) {
        var newScales = this._aggregateDataRange.getScales(this._xScreenRange, this._yScreenRange);
        this._xRange = newScales.x;
        this._yRange = newScales.y;
        this._padAxes(this._xRange, this._yRange);
        this._d3Svg.select('.x_axis').call(this._xAxis);
        this._d3Svg.select('.y_axis').call(this._yAxis);
    }

    _checkInstance(nuggetView) {
        return nuggetView instanceof Graph;
    }

    /*
    * Drawing functions
    */

    _padAxes(xRange, yRange) {
        var paddingTop = this._defaultPadding;
        var paddingBottom = this._defaultPadding;
        var paddingLeft = this._defaultPadding;
        var paddingRight = this._defaultPadding;

        // extra padding for legend, if this chart has one
        if (this.legend) {
            paddingTop = this.legendHeight + this._defaultPadding;
        }

        // add any additional padding required by graphs in this chart
        var extraXPadding = 0;
        var extraYPadding = 0;
        this._childElementMap.forEach(function(nuggetView) {
            extraXPadding = Math.max(extraXPadding, nuggetView.constructor.ExtraXPadding());
            extraYPadding = Math.max(extraYPadding, nuggetView.constructor.ExtraYPadding());
        }, this);

        paddingTop    += extraYPadding;
        paddingBottom += extraYPadding;
        paddingLeft   += extraXPadding;
        paddingRight  += extraXPadding;

        this._padRange(yRange, paddingBottom, -paddingTop);

        // pad the x range (but only if its not ordinal)
        var dataSeries = this._aggregateDataRange.getFirstDataSeries();
        var dataSeriesType = dataSeries.xAxisType;

        if (dataSeriesType !== 'ordinal') {
            this._padRange(xRange, -paddingLeft, paddingRight);
        }
    }

    _getDefaultDimensions(element) {
        var parent = element.parentNode;
        return parent.getBoundingClientRect();
    }

    _padRange(range, amountPxLow, amountPxHigh) {
        var screenRange = range.range();
        var newScreenRange = [ screenRange[0] + amountPxLow, screenRange[1] + amountPxHigh];
        var domain = newScreenRange.map(range.invert);
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

    _drawXAxis() {
        var xAxis = d3.svg.axis()
            .scale(this._xRange)
            .tickPadding(7)
            .tickSubdivide(true)
            .tickFormat(this.xLabelFormat);

        if (this.numXTicks) {
            xAxis.ticks(this.numXTicks);
        }

        var tickSize = this.xGrid ? - this.height : -7;
        xAxis.tickSize(tickSize, 0);

        var axis = this._d3Svg.append('svg:g')
            .attr('class', 'x_axis')
            .attr('transform', 'translate(0,' + (this.height - this.margins.bottom) + ')')
            .call(xAxis);

        this._styleAxis(axis, this.xGrid);

        return xAxis;
    }

    _drawYAxis() {
        var yAxis = d3.svg.axis()
            .scale(this._yRange)
            .orient('left')
            .tickPadding(7)
            .tickSubdivide(true)
            .tickFormat(this.yLabelFormat);

        if (this.numYTicks) {
            yAxis.ticks(this.numYTicks);
        }

        var tickSize = this.yGrid ? (-(this.width - (this.margins.left + this.margins.right))) : -7;
        yAxis.tickSize(tickSize, 0);

        var axis = this._d3Svg.append('svg:g')
            .attr('class', 'y_axis')
            .attr('transform', 'translate(' + (this.margins.left) + ', 0)')
            .call(yAxis);

        this._styleAxis(axis, this.yGrid);

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
        var scaleExtent = [0.1, 5000000];

        opts.zoomFixtureX = opts.d3Svg.append('g')
            .attr('class', 'zoom_fixture_x');
        opts.zoomX = d3.behavior.zoom()
            .x(opts.xRange)
            .scaleExtent(scaleExtent)
            .on('zoom', function() {
                this._zoom(opts);
            }.bind(this));
        opts.zoomFixtureX.call(opts.zoomX);

        opts.zoomFixtureY = opts.d3Svg.append('g')
            .attr('class', 'zoom_fixture_y');
        opts.zoomY = d3.behavior.zoom()
            .y(opts.yRange)
            .scaleExtent(scaleExtent)
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

        this._initZoomReset(opts);

        var zooms = {
            zoomX: opts.zoomX,
            zoomY: opts.zoomY
        };

        return zooms;
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

    _initZoomReset(opts) {
        const DOUBLE_CLICK_MS = 300;

        // standard "dblclick" event doesn't work when boxZoom is enabled so we simulate with "mousedown"
        var lastClickTime = 0;
        opts.d3Svg.on('mousedown.zoom', function() {
            var clickTime = new Date().getTime();
            if (clickTime - lastClickTime < DOUBLE_CLICK_MS) {
                var translate = [0, 0];
                var scale = 1;
                var duration = 250;

                if (opts.dataSeriesType !== 'ordinal') {
                    opts.zoomX.translate(translate);
                    opts.zoomX.scale(scale);
                    opts.zoomX.event(opts.zoomFixtureX.transition().duration(duration));
                }

                opts.zoomY.translate(translate);
                opts.zoomY.scale(scale);
                opts.zoomY.event(opts.zoomFixtureY.transition().duration(duration));
            }
            lastClickTime = clickTime;
        });
    }

    _initBoxZoom(opts) {
        var d3Svg = opts.d3Svg;

        // save original x and y ranges
        var origXRange = opts.xRange.copy();
        var origYRange = opts.yRange.copy();

        // Disable pan
        d3Svg.on('mousedown.zoom', null);

        d3Svg.on('mousedown.box_zoom', function() {
            var isOrdinal = opts.dataSeriesType === 'ordinal';
            var coords = d3.mouse(this);
            var startX = coords[0];
            var startY = coords[1];

            var bounds = {
                left   : opts.margins.left,
                right  : opts.width - opts.margins.right,
                top    : opts.margins.top,
                bottom : opts.height - opts.margins.bottom
            };

            // Keep starting position within graph bounds
            if (startX < bounds.left || isOrdinal) {
                startX = bounds.left;
            } else if (startX > bounds.right) {
                startX = bounds.right;
            }
            if (startY < bounds.top) {
                startY = bounds.top;
            } else if (startY > bounds.bottom) {
                startY = bounds.bottom;
            }

            var endX = startX;
            var endY = startY;

            var zoomBox = d3Svg.append('rect')
                .attr('x', startX)
                .attr('y', startY)
                .attr('class', 'zoom_box');

            d3Svg.on('mousemove.box_zoom', function() {
                var coords = d3.mouse(this);
                endX = coords[0];
                endY = coords[1];

                // Keep ending position within graph bounds
                if (endX < bounds.left) {
                    endX = bounds.left;
                } else if (endX > bounds.right || isOrdinal) {
                    endX = bounds.right;
                }
                if (endY < bounds.top) {
                    endY = bounds.top;
                } else if (endY > bounds.bottom) {
                    endY = bounds.bottom;
                }

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

            var body = d3.select('body');
            body.on('mouseup.box_zoom', function() {
                zoomBox.remove();

                d3Svg.on('mousemove.box_zoom', null);
                body.on('mouseup.box_zoom', null);

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
