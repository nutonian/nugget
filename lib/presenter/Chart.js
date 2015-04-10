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

        options = options || {};

        this.width        = options.width;
        this.height       = options.height;
        this.margins      = options.margins || { top: 0, left: 100, bottom: 50, right: 10 };
        this.axisLabels   = options.axisLabels || { x: '', y: '' };
        this.legend       = options.legend || true;
        this.legendHeight = options.legendHeight || 50;
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

        var scales = aggregateDataRange.getScales();
        var xRange = this._xRange = scales.x.range([margins.left, (width - margins.right)]);
        var yRange = this._yRange = scales.y.range([(height - margins.bottom), margins.top]);

        if (this.legend) {
            this._padRange(yRange, this.legendHeight);
        }

        var clipPathID = this._createClipPath(d3Svg, width, height, margins);
        var drawingSurface = this._createDrawingSurface(d3Svg, clipPathID);

        this._setAxisLabels(d3Svg, this.axisLabels, width, height, margins);

        this._childElementMap.forEach(function(nuggetView) {
            nuggetView.drawElement(drawingSurface, xRange, yRange);
        }, this);

        var xAxis = this._drawXAxis(d3Svg, xRange, height, margins);
        var yAxis = this._drawYAxis(d3Svg, yRange, margins);

        aggregateDataRange.on('change', (e) => {
            d3Svg.select('.x_axis').call(xAxis);
            d3Svg.select('.y_axis').call(yAxis);
        });

        this._zoomInit(d3Svg, drawingSurface, childElementMap, xRange, yRange, xAxis, yAxis);
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

        var aggregateDataRange = this._aggregateDataRange;
        aggregateDataRange.removeDataSeries(nuggetView.dataSeries);

        this._childElementMap.delete(nuggetView.id);
        nuggetView.remove();

        var scales   = aggregateDataRange.getScales();
        var margins  = this.margins;
        var width    = this.width;
        var height   = this.height;
        this._xRange = scales.x.range([margins.left, (width - margins.right)]);
        this._yRange = scales.y.range([(height - margins.bottom), margins.top]);
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

    _padRange(range, amountPx) {
        var domain = range.domain().concat().sort();
        var domainMax = domain[1];
        domain[1] = domainMax + (domainMax - range.invert(amountPx));
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

    _drawXAxis(d3Svg, xRange, height, margins) {
        var xAxis = d3.svg.axis()
            .scale(xRange)
            .tickSize(-7, 0)
            .tickPadding(7)
            .tickSubdivide(true);

        d3Svg.append('svg:g')
            .attr('class', 'x_axis')
            .attr('transform', 'translate(0,' + (height - margins.bottom) + ')')
            .call(xAxis);

        return xAxis;
    }

    _drawYAxis(d3Svg, yRange, margins) {
        var yAxis = d3.svg.axis()
            .scale(yRange)
            .orient('left')
            .tickSize(-7, 0)
            .tickPadding(7)
            .tickFormat(d3.format('.4s'))
            .tickSubdivide(true);

        d3Svg.append('svg:g')
            .attr('class', 'y_axis')
            .attr('transform', 'translate(' + (margins.left) + ', 0)')
            .call(yAxis);

        return yAxis;
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
    _zoomInit(d3Svg, drawingSurface, children, xRange, yRange, xAxis, yAxis) {
        var zoom = d3.behavior.zoom()
            .x(xRange)
            .y(yRange)
            .on('zoom', function() {
                d3Svg.select('.x_axis').call(xAxis);
                d3Svg.select('.y_axis').call(yAxis);

                children.forEach(function(view, id, map) {
                    view.drawElement(drawingSurface, xRange, yRange);
                }, this);
            });

        d3Svg.call(zoom);
    }
}
export default Chart;
