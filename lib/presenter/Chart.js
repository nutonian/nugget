import DataSeries from '../models/DataSeries';
import Events from '../events/Events';
import Utils from '../utils/Utils';
import Graph from './Graph';

class Chart extends Events {
    constructor(options) {
        super();

        this._childElementMap = new Map();
        this._dataRange = new DataSeries();
        this._d3Svg = null;
        this._xRange = null;
        this._yRange = null;

        options = options || {};

        this.width      = options.width;
        this.height     = options.height;
        this.margins    = options.margins || { top: 0, left: 100, bottom: 50, right: 10 };
        this.axisLabels = options.axisLabels || { x: '', y: '' };
        this.legend     = options.legend || true;
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

        var dataRange = this._dataRange;
        var childElementMap = this._childElementMap;
        var fullDataRange = this._determineFullDataRange(childElementMap);
        dataRange.setData(fullDataRange);

        if (this.legend) {
            dataRange = this._padDataRange(dataRange, height, margins);
        }

        var xRange = this._xRange = this._determineXRange(dataRange, width, margins);
        var yRange = this._yRange = this._determineYRange(dataRange, height, margins);

        var clipPathID = this._createClipPath(d3Svg, width, height, margins);
        var drawingSurface = this._createDrawingSurface(d3Svg, clipPathID);

        this._setAxisLabels(d3Svg, this.axisLabels, width, height, margins);

        this._childElementMap.forEach(function(nuggetView) {
            nuggetView.drawElement(drawingSurface, xRange, yRange);
        }, this);

        var xAxis = this._drawXAxis(d3Svg, xRange, height, margins);
        var yAxis = this._drawYAxis(d3Svg, yRange, margins);

        dataRange.on('change', (e) => {
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

        nuggetView.dataSeries.on('change', (e) => {
            nuggetView.drawElement(this._d3Svg, this._xRange, this._yRange);
        });
    }
    remove(nuggetView) {
        if (!this._checkInstance(nuggetView)) {
            throw 'Must be a valid Nugget View type';
        }

        this._childElementMap.delete(nuggetView.id);
        nuggetView.remove();
        var dataRange = this._dataRange;

        var newDataRange = this._determineFullDataRange(this._childElementMap);

        dataRange.setData(newDataRange);

    }
    _checkInstance(nuggetView) {
        return nuggetView instanceof Graph;
    }

    /*
    * Data functions
    */

    _determineFullDataRange(children) {
        var data = [];

        children.forEach(function(view, id, map) {
            var ds = view.dataSeries;
            data = data.concat([
                {x: ds.xMin, y: ds.yMin},
                {x: ds.xMax, y: ds.yMax}
            ]);
        }, this);

        return data;
    }
    _padDataRange(dataRange, height, margins) {
        var yRange = dataRange.yMax - dataRange.yMin;
        var keyFraction =  50 / (height - (margins.top + margins.bottom));
        var dataYPadding = yRange * keyFraction;

        dataRange.yMax += dataYPadding;

        return dataRange;
    }
    _determineXRange(dataRange, width, margins) {
        var xRange = d3.scale.linear()
            .range([margins.left, (width - margins.right)])
            .domain([dataRange.xMin, dataRange.xMax]);
        return xRange;
    }
    _determineYRange(dataRange, height, margins) {
        var yRange = d3.scale.linear()
            .range([(height - margins.bottom), margins.top])
            .domain([dataRange.yMin, dataRange.yMax]);
        return yRange;
    }

    /*
    * Drawing functions
    */

    _getDefaultDimensions(element) {
        var parent = element.parentNode;
        return parent.getBoundingClientRect();
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
