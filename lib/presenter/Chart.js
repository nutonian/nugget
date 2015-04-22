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
        this.legend        = options.legend || true;
        this.legendHeight  = options.legendHeight || 50;
        this.guides        = options.guides || false;
        this.guideColor    = options.guideColor || '#7C9EC9';
        this.guideFontSize = options.guideFontSize || 14;
        this.xGrid         = options.xGrid || false;
        this.yGrid         = options.yGrid || false;
    }

    appendTo(selectorOrEl) {
        var element = (typeof selectorOrEl === 'string') ?
            document.querySelectorAll(selectorOrEl)[0] : selectorOrEl;

        if (this._d3Svg) {
            return element.parentNode.replaceChild(this._d3Svg.node(), element);
        }

        var defaultDimensions = this._getDefaultDimensions(element);

        var width   = this.width || defaultDimensions.width;
        var height  = this.height || defaultDimensions.height;
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

        //just want to leave 5 px of space at the bottom so the min and max dont collide with axes
        this._padRange(yRange, paddingTop, paddingBottom);

        var clipPathID = this._createClipPath(d3Svg, width, height, margins);
        var drawingSurface = this._createDrawingSurface(d3Svg, clipPathID);

        this._setAxisLabels(d3Svg, this.axisLabels, width, height, margins);

        this._childElementMap.forEach(function(nuggetView) {
            nuggetView.drawElement(drawingSurface, xRange, yRange);
        }, this);

        var xAxis = this._drawXAxis(d3Svg, xRange, height, margins, this.xGrid);
        var yAxis = this._drawYAxis(d3Svg, yRange, width, margins, this.yGrid);

        aggregateDataRange.on('change', (e) => {
            d3Svg.select('.x_axis').call(xAxis);
            d3Svg.select('.y_axis').call(yAxis);
        });

        this._zoomInit({
            d3Svg: d3Svg,
            drawingSurface: drawingSurface,
            children: childElementMap,
            xRange: xRange,
            yRange: yRange,
            xAxis: xAxis,
            yAxis: yAxis,
            showXGrid: this.xGrid,
            showYGrid: this.yGrid
        });
        this._completeBoundingBox(d3Svg, width, height, margins);

        if (this.guides) {
            this._initGuides({
                container: d3Svg,
                width: width,
                height: height,
                margins: margins,
                guideColor: this.guideColor,
                guideFontSize: this.guideFontSize,
                xRange: xRange,
                yRange: yRange
            });
        }
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

        var tickSize = showGrid ? -width : -7;
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
        d3Svg.append('text')
            .attr('x', (width + margins.left) / 2)
            .attr('y', (height))
            .attr('class', 'axis_label')
            .style('text-anchor', 'middle')
            .text(axisLabels.x);

        d3Svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('class', 'axis_label')
            .attr('y', margins.left / 4)
            .attr('x', 0 - (height / 2))
            .text(axisLabels.y);
    }

    /*
    * interaction functions
    */
    _zoomInit(opts) {
        var dataSeries = this._aggregateDataRange.getFirstDataSeries();
        var dataSeriesType = dataSeries.xAxisType;

        var zoom = d3.behavior.zoom()
                .y(opts.yRange)
                .on('zoom', function() {
                    var xAxisEl = opts.d3Svg.select('.x_axis').call(opts.xAxis);
                    var yAxisEl = opts.d3Svg.select('.y_axis').call(opts.yAxis);

                    this._styleAxis(xAxisEl, opts.showXGrid);
                    this._styleAxis(yAxisEl, opts.showYGrid);

                    opts.children.forEach(function(view, id, map) {
                        view.drawElement(opts.drawingSurface, opts.xRange, opts.yRange);
                    }, this);
                }.bind(this));

        if (dataSeriesType !== 'ordinal') {
            zoom.x(opts.xRange);
        }

        opts.d3Svg.call(zoom);
    }

    _initGuides(opts) {
        var fontSize         = opts.guideFontSize;
        var labelPadding     = fontSize + 2;
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
                            .attr('height', fontSize)
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
                            .attr('height', fontSize)
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
                .attr('y', opts.height - xLabelYAdjust);

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
