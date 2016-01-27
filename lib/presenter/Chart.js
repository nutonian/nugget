import AggregateDataRange from '../models/AggregateDataRange';
import Events from '../events/Events';
import Utils from '../utils/Utils';
import Graph from '../views/Graph';
import GuideLayer from '../views/GuideLayer';
import YYComparisonGuide from '../views/YYComparisonGuide';
import LegendView from '../views/LegendView';
import Config from '../config/Config';

class Chart extends Events {
    constructor(options) {
        super();

        options = options || {};

        if (options.config) {
            Config.setConfig(options.config);
        }

        this.d3Svg      = null;
        this.legendEl   = null;
        this.xRange     = null;
        this.yRange     = null;
        this.zoomX      = null;
        this.zoomY      = null;
        this.guideLayer = null;

        this._childElementMap = new Map();
        this._aggregateDataRange = new AggregateDataRange();

        this.width         = options.width;
        this.height        = options.height;
        this.margins       = Object.assign(
            {top: 0, left: 100, bottom: 50, right: 10 },
            (options.margins || {})
        );
        this.padding       = Object.assign(
            {top: 10, bottom: 10, left: 10, right: 10},
            (options.padding || {})
        );
        this.axisLabels    = options.axisLabels || { x: '', y: '' };
        this.legend        = options.legend || false;
        this.legendHeight  = options.legendHeight || 50;
        this.legendView    = options.legendView;
        this.xGrid         = options.xGrid || false;
        this.yGrid         = options.yGrid || false;
        this.boxZoom       = (options.boxZoom === false) ? false : true;
        this.scrollZoom    = (options.scrollZoom === false) ? false : true;
        this.xLabelFormat  = options.xLabelFormat;
        this.yLabelFormat  = options.yLabelFormat;

        // If you enable resizing: Make sure to call the "cleanup" method when removing a Chart
        // from the DOM to unbind the window resize event
        this.resizeWidth   = options.resizeWidth  || false;
        this.resizeHeight  = options.resizeHeight || false;

        // Use to throttle calls to update. This is useful when many data series are updated
        // in rapid succession (you generally don't need to update each time -- just the head + tail calls)
        this.throttleUpdate  = (options.throttleUpdate === false) ? false : true;
        this.throttledUpdate = this.throttleUpdate ? Utils.throttle(this.update, 5) : this.update;

        // Origin ticks are always rendered, so subtract 1 from specified value
        this.numXTicks     = (typeof options.numXTicks === 'number') ? (options.numXTicks - 1) : null;
        this.numYTicks     = (typeof options.numYTicks === 'number') ? (options.numYTicks - 1) : null;
    }

    appendTo(selectorOrEl) {
        var element = (typeof selectorOrEl === 'string') ?
            document.querySelectorAll(selectorOrEl)[0] : selectorOrEl;

        if (this.d3Svg) {
            return element.parentNode.replaceChild(this.d3Svg.node(), element);
        }

        var defaultDimensions = this._getDefaultDimensions(element);
        this.width  = this.width  || defaultDimensions.width;
        this.height = this.height || defaultDimensions.height;

        this.d3Svg = d3.select(element)
            .attr('width', this.width)
            .attr('height', this.height);

        this._updateRanges();
        this._initLabelFormats();

        var clipPathID = this._createClipPath();
        this._drawingSurface = this._createDrawingSurface(clipPathID);
        this._setAxisLabels();
        if (this.legend) {
            this._initLegend();
        }

        this.update(true);

        this._completeBoundingBox();

        this._aggregateDataRange.on('add',    (e) => this.throttledUpdate());
        this._aggregateDataRange.on('change', (e) => this.throttledUpdate());

        if (this.resizeWidth || this.resizeHeight) {
            if (this.resizeEventID) {
                d3.select(window).on(this.resizeEventID, null);
            } else {
                this.resizeEventID = Utils.createUniqueId('resize.chart');
            }
            this.throttledResize = this.throttledResize || Utils.throttle(this.onWindowResize, 100);
            d3.select(window).on(this.resizeEventID, () => {
                this.throttledResize(selectorOrEl);
            });
        }
    }

    add(nuggetView) {
        if (!this._checkInstance(nuggetView)) {
            throw 'Must be a valid Nugget View type';
        }

        this._childElementMap.set(nuggetView.id, nuggetView);
        this._aggregateDataRange.addDataSeries(nuggetView.dataSeries);
    }

    addGuideLayer(opts) {
        if (this.guideLayer) { return; }

        if (!opts || !opts.init) {
            throw 'Guide layer requires an "init" method';
        }

        this.guideLayer = new GuideLayer();
        Object.assign(this.guideLayer, opts);

        return this.guideLayer;
    }

    // adds the specified type of axis guides - the only valid values
    // are YYComparison and XYComparison
    addGuide(GuideClass) {

        if (!GuideClass) {
            throw 'Invalid guide type specified. The only valid types are ' + Object.keys(Chart.GuideTypes);
        }

        this.guideLayer = new GuideClass();

        return this.guideLayer;
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

        var scales  = aggregateDataRange.getScales(xScreenRange, yScreenRange);
        this.xRange = scales.x;
        this.yRange = scales.y;
    }

    update(isInitUpdate) {
        this._updateRanges();
        this._drawAxes();

        if (isInitUpdate) {
            this._initZoom();
        } else {
            this.zoomX.x(this.xRange);
            this.zoomY.y(this.yRange);
        }

        this._childElementMap.forEach(function(nuggetView) {
            nuggetView.drawElement(this._drawingSurface, this.xRange, this.yRange, this.axisLabels);
            nuggetView.initGuides(this.d3Svg, this);
        }, this);

        if (this.guideLayer) {
            if (!this._guideLayerEl) {
                this._guideLayerEl = this.d3Svg.append('g').attr('class', 'guide_layer');
            }
            this.guideLayer.init(this._guideLayerEl, this);
        }

        if (this.legend) {
            this._updateLegend();
        }

        this.d3Svg.select('.x_axis').call(this._xAxis);
        this.d3Svg.select('.y_axis').call(this._yAxis);
    }

    onWindowResize(selectorOrEl) {
        Utils.emptyNode( this.d3Svg.node() );

        if (this.resizeWidth)  { delete this.width;  }
        if (this.resizeHeight) { delete this.height; }

        delete this.d3Svg;
        delete this.xRange;
        delete this.yRange;
        delete this.zoomX;
        delete this.zoomY;
        delete this._guideLayerEl;

        this.appendTo(selectorOrEl);

        this.trigger('afterResize');
    }

    cleanup() {
        if (this.resizeEventID) {
            d3.select(window).on(this.resizeEventID, null);
        }
    }

    createLegendData() {
        var aggregateLegendData = [];
        this._childElementMap.forEach(function(nuggetView) {
            aggregateLegendData = aggregateLegendData.concat(nuggetView.legendData.getDataCopy());
        });
        return aggregateLegendData;
    }

    // Override createScales if you'd like to compute your own ranges and not use the
    // generated aggregateDataRange
    createScales(xScreenRange, yScreenRange) {
        var scales = this._aggregateDataRange.getScales(xScreenRange, yScreenRange);

        // by default, pad axes to account for margins. If this method is overriden,
        // typically, we don't want padding, but this allows the implementer to choose
        // the desired behavior
        this.shouldPadAxes = true;
        return scales;
    }

    _updateLegend() {
        this.legendView.draw(this.legendEl, this.createLegendData());
    }

    _updateRanges() {
        var xScreenRange = [this.margins.left, (this.width - this.margins.right)];
        var yScreenRange = [(this.height - this.margins.bottom), this.margins.top];
        var scales = this.createScales(xScreenRange, yScreenRange);

        this.xRange = scales.x;
        this.yRange = scales.y;
    }

    _checkInstance(nuggetView) {
        return nuggetView instanceof Graph;
    }

    _initLabelFormats() {
        function identityFn(val, format) { return val; }

        if (this.xLabelFormat) {
            this.xLabelFormat = (typeof this.xLabelFormat === 'string') ?
                                    d3.format(this.xLabelFormat) : this.xLabelFormat;
        } else {
            this.xLabelFormat = this.xRange.tickFormat ? this.xRange.tickFormat() : identityFn;
        }

        if (this.yLabelFormat) {
            this.yLabelFormat = (typeof this.yLabelFormat === 'string') ?
                                    d3.format(this.yLabelFormat) : this.yLabelFormat;
        } else {
            this.yLabelFormat = this.yRange.tickFormat ? this.yRange.tickFormat() : identityFn;
        }
    }

    /*
    * Drawing functions
    */

    _drawAxes() {
        if (this.shouldPadAxes) {
            this._padAxes(this.xRange, this.yRange);
        }
        this._xAxis = this._drawXAxis();
        this._yAxis = this._drawYAxis();
    }

    _padAxes(xRange, yRange) {
        var paddingTop    = this.padding.top;
        var paddingBottom = this.padding.bottom;
        var paddingLeft   = this.padding.left;
        var paddingRight  = this.padding.right;

        // extra padding for legend, if this chart has one
        if (this.legend) {
            paddingTop = this.legendHeight + this.padding.top;
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

        var xAxisType = this._aggregateDataRange.getXAxisType();
        if (xAxisType !== 'ordinal') {
            this._padRange(xRange, -paddingLeft, paddingRight);
        }

        this._padRange(yRange, paddingBottom, -paddingTop);
    }

    _padRange(range, amountPxLow, amountPxHigh) {
        var screenRange = range.range();
        var newScreenRange = [ screenRange[0] + amountPxLow, screenRange[1] + amountPxHigh];
        var domain = newScreenRange.map(range.invert);
        range.domain(domain);
    }

    _drawXAxis() {
        this.d3Svg.select('.x_axis').remove();

        var xAxis = d3.svg.axis()
            .scale(this.xRange)
            .tickPadding(7)
            .tickSubdivide(true)
            .tickFormat(this.xLabelFormat);

        if (this.numXTicks) {
            xAxis.ticks(this.numXTicks);
        }

        var tickSize = this.xGrid ? - this.height : -7;
        xAxis.tickSize(tickSize, 0);

        var axis = this.d3Svg.append('svg:g')
            .attr('class', 'x_axis')
            .attr('transform', 'translate(0,' + (this.height - this.margins.bottom) + ')')
            .call(xAxis);

        this._styleAxis(axis, this.xGrid);

        return xAxis;
    }

    _drawYAxis() {
        this.d3Svg.select('.y_axis').remove();

        var yAxis = d3.svg.axis()
            .scale(this.yRange)
            .orient('left')
            .tickPadding(7)
            .tickSubdivide(true)
            .tickFormat(this.yLabelFormat);

        if (this.numYTicks) {
            yAxis.ticks(this.numYTicks);
        }

        var tickSize = this.yGrid ? (-(this.width - (this.margins.left + this.margins.right))) : -7;
        yAxis.tickSize(tickSize, 0);

        var axis = this.d3Svg.append('svg:g')
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

    _getDefaultDimensions(element) {
        var parent = element.parentNode;
        return parent.getBoundingClientRect();
    }

    _createClipPath() {
        var clipPathID = Utils.createUniqueId('clip');

        var clipPathWidth  = this.width - (this.margins.right + this.margins.left);
        clipPathWidth  = (clipPathWidth  >= 0) ? clipPathWidth  : 0;

        var clipPathHeight = this.height - (this.margins.bottom + this.margins.top);
        clipPathHeight = (clipPathHeight >= 0) ? clipPathHeight : 0;

        this.d3Svg.append('clipPath')
            .attr('id', clipPathID)
            .append('rect')
            .attr('x', this.margins.left)
            .attr('y', this.margins.top)
            .attr('width', clipPathWidth)
            .attr('height', clipPathHeight);

        return clipPathID;
    }

    _createDrawingSurface(clipPathID) {
        var drawingSurface = this.d3Svg.append('g')
            .attr('class', 'drawing_surface')
            .attr('clip-path', 'url(#' + clipPathID + ')');
        return drawingSurface;
    }

    _initLegend() {
        this.legendView = this.legendView || new LegendView();

        var legendMargin = 10;
        var doubleLegendMargin = legendMargin * 2;
        var legendWidth = this.width - this.margins.left - this.margins.right - doubleLegendMargin;
        var legendHeight = this.legendHeight - doubleLegendMargin;

        // Clamp width/height at 0 to avoid SVG errors
        legendWidth = (legendWidth < 0) ? 0 : legendWidth;
        legendHeight = (legendHeight < 0) ? 0 : legendHeight;

        this.legendEl = this.d3Svg.append('svg')
                            .attr('class', 'legend')
                            .attr('x', this.margins.left + legendMargin)
                            .attr('y', this.margins.top + legendMargin)
                            .attr('width', legendWidth)
                            .attr('height', legendHeight);
    }

    _completeBoundingBox() {
        this.d3Svg.append('line')
            .attr('x1', this.margins.left)
            .attr('x2', (this.width - this.margins.right))
            .attr('y1', this.margins.top)
            .attr('y2', this.margins.top)
            .attr('class', 'bounding_box');
        this.d3Svg.append('line')
            .attr('x1', (this.width - this.margins.right))
            .attr('x2', (this.width - this.margins.right))
            .attr('y1', this.margins.top)
            .attr('y2', this.height - this.margins.bottom)
            .attr('class', 'bounding_box');
    }

    _setAxisLabels() {
        var xLabel = this.axisLabels.x instanceof Array ?
                        this.axisLabels.x[0] : this.axisLabels.x;

        var axisWidth = this.width - (this.margins.left + this.margins.right);
        this.d3Svg.append('text')
            .attr('x', this.margins.left + (axisWidth / 2))
            .attr('y', (this.height - (this.margins.bottom / 2)) + 5) // +5 because dominant-baseline doesn't work in IE
            .attr('class', 'axis_label')
            .style('text-anchor', 'middle')
            .text(xLabel);

        var axisHeight = this.height - (this.margins.top + this.margins.bottom);
        this.d3Svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('class', 'axis_label')
            .attr('y', this.margins.left / 4)
            .attr('x', 0 - (this.margins.top + (axisHeight / 2)))
            .style('text-anchor', 'middle')
            .text(this.axisLabels.y);
    }

    /*
    * interaction functions
    */

    _initZoom() {
        var opts = {
            d3Svg             : this.d3Svg,
            drawingSurface    : this._drawingSurface,
            children          : this._childElementMap,
            xRange            : this.xRange,
            yRange            : this.yRange,
            xAxis             : this._xAxis,
            yAxis             : this._yAxis,
            margins           : this.margins,
            width             : this.width,
            height            : this.height,
            showXGrid         : this.xGrid,
            showYGrid         : this.yGrid,
            dataSeriesType    : this._aggregateDataRange.getXAxisType()
        };
        var scaleExtent = [0.1, 5000000];

        opts.zoomFixtureX = opts.d3Svg.append('g')
            .attr('class', 'zoom_fixture_x');
        this.zoomX = d3.behavior.zoom()
            .x(this.xRange)
            .scaleExtent(scaleExtent)
            .on('zoom', function() {
                this._zoom(opts);
            }.bind(this));
        opts.zoomFixtureX.call(this.zoomX);

        opts.zoomFixtureY = opts.d3Svg.append('g')
            .attr('class', 'zoom_fixture_y');
        this.zoomY = d3.behavior.zoom()
            .y(this.yRange)
            .scaleExtent(scaleExtent)
            .on('zoom', function() {
                this._zoom(opts);
            }.bind(this));
        opts.zoomFixtureY.call(this.zoomY);

        this._listenForClicksOutsideOfChart(opts);
        this._waitForClickToEnableZooming(opts);

        this._initBoxZoom(opts);

        this._initZoomReset(opts);
    }

    _listenForClicksOutsideOfChart(opts) {
        // Zooming is disabled if the user clicks outside of the Chart. We use native javascript
        // event methods here because we need to stop propagation when the Chart is clicked.
        var d3SvgNode = opts.d3Svg.node();
        d3SvgNode.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        var bodyNode = d3.select('body').node();
        bodyNode.addEventListener('click', function(e) {
            this._disableZooming(opts);
            this._waitForClickToEnableZooming(opts);
        }.bind(this));
    }

    _waitForClickToEnableZooming(opts) {
        // if scroll zoom is not enabled, don't register this
        // listener
        if (!this.scrollZoom) {
            return;
        }

            // Wait for a mouse click before enabling zooming
        opts.d3Svg.on('mouseup.enable_zooming', () => {
            this._enableZooming(opts);
            opts.d3Svg.on('mouseup.enable_zooming', null);
        });
    }

    _enableZooming(opts) {
        var dataSeriesType = opts.dataSeriesType;

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
    }

    _disableZooming(opts) {
        var zoomEvents = [
            'touchstart.zoom.x', 'wheel.zoom.x', 'mousewheel.zoom.x', 'MozMousePixelScroll.zoom.x',
            'touchstart.zoom.y', 'wheel.zoom.y', 'mousewheel.zoom.y', 'MozMousePixelScroll.zoom.y'
        ];
        zoomEvents.forEach(function(evt) {
            opts.d3Svg.on(evt, null);
        }, this);
    }

    _zoom(opts) {
        var xAxisEl = opts.d3Svg.select('.x_axis').call(this._xAxis);
        var yAxisEl = opts.d3Svg.select('.y_axis').call(this._yAxis);

        this._styleAxis(xAxisEl, opts.showXGrid);
        this._styleAxis(yAxisEl, opts.showYGrid);

        opts.children.forEach(function(view, id, map) {
            // don't animate on regular zoom, since zoom already animates
            view.drawElement(opts.drawingSurface, this.xRange, this.yRange, this.axisLabels, false);
        }, this);
    }

    _initZoomReset(opts) {
        const DOUBLE_CLICK_MS = 300;

        // standard "dblclick" event doesn't work when boxZoom is enabled so we simulate with "mousedown"
        var lastClickTime = 0;
        var self = this;
        opts.d3Svg.on('mousedown.zoom', function() {
            var clickTime = new Date().getTime();
            if (clickTime - lastClickTime < DOUBLE_CLICK_MS) {
                var translate = [0, 0];
                var scale = 1;
                var duration = 250;

                if (opts.dataSeriesType !== 'ordinal') {
                    self.zoomX.translate(translate);
                    self.zoomX.scale(scale);
                    self.zoomX.event(opts.zoomFixtureX.transition().duration(duration));
                }

                self.zoomY.translate(translate);
                self.zoomY.scale(scale);
                self.zoomY.event(opts.zoomFixtureY.transition().duration(duration));

                // Disable zoom on double click
                opts.d3Svg.on('mouseup.waitForDblClickToFinish', function() {
                    opts.d3Svg.on('mouseup.waitForDblClickToFinish', null);
                    this._disableZooming(opts);
                    this._waitForClickToEnableZooming(opts);
                }.bind(this));

                // trigger event on chart to indicate that zoom has been reset
                self.trigger('zoomreset');
            }
            lastClickTime = clickTime;
        }.bind(this));
    }

    _initBoxZoom(opts) {
        if (!this.boxZoom) {
            return;
        }
        var d3Svg = opts.d3Svg;

        // save original x and y ranges
        var origXRange = this.xRange.copy();
        var origYRange = this.yRange.copy();

        // Disable pan
        d3Svg.on('mousedown.zoom', null);

        var self = this;

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
                    self.zoomX.translate(translate);
                    self.zoomX.scale(scaleX);
                    self.zoomX.event(opts.zoomFixtureX.transition().duration(250));
                }

                self.zoomY.translate(translate);
                self.zoomY.scale(scaleY);
                self.zoomY.event(opts.zoomFixtureY.transition().duration(250));
            });
        });
    }
}

// Static constants
Chart.GuideTypes = {
    YYComparison: YYComparisonGuide
    // other guide types will get added here
};

export default Chart;
