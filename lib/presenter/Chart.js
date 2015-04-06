import DataSeries from '../models/DataSeries';
import Events from '../events/Events';
import Utils from '../utils/Utils';
import Graph from './Graph';

class Chart extends Events {
    constructor(options) {
        super();

        // initialize internal options
        this._childElementMap = new Map();
        this._dataRange = new DataSeries();
        this._svg = null;
        this._d3Svg = null;
        this._xRange = null;
        this._yRange = null;
        this._xAxis = null;
        this._yAxis = null;
        this._clipPath = null;

        // set width, height margins etc.
        this.width = options.width;
        this.height = options.height;
        this.margins = options.margins;
    }
    appendTo(selector) {
        this._d3Svg = d3.select(selector)
            .attr('width', this.width)
            .attr('height', this.height);

        this._determineFullDataRange();
        this._determineXandYRange();
        this._zoomInit();
        this._createClipPath();
        this._createDrawingSurface();

        this._childElementMap.forEach(function(nuggetView) {
            nuggetView.drawElement(this._drawingSurface, this._xRange, this._yRange);
        }, this);
        this._drawAxes();
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
    _checkInstance(nuggetView) {
        return nuggetView instanceof Graph;
    }
    _determineFullDataRange() {
        var data = [];
        this._childElementMap.forEach(function(view, id, map) {
            var ds = view.dataSeries;
            data = data.concat([
                {x: ds.xMin, y: ds.yMin},
                {x: ds.xMax, y: ds.yMax}
            ]);
        }, this);

        this._dataRange.setData(data);
    }
    _determineXandYRange() {
        this._xRange = d3.scale.linear()
            .range([this.margins.left, (this.width - this.margins.right)])
            .domain([this._dataRange.xMin, this._dataRange.xMax]);
        this._yRange = d3.scale.linear()
            .range([(this.height - this.margins.bottom), this.margins.top])
            .domain([this._dataRange.yMin, this._dataRange.yMax]);
    }
    _drawAxes() {
        this._xAxis = d3.svg.axis()
            .scale(this._xRange)
            .tickSize(-7, 0)
            .tickPadding(7)
            .tickSubdivide(true);

        this._yAxis = d3.svg.axis()
            .scale(this._yRange)
            .orient('left')
            .tickSize(-7, 0)
            .tickPadding(7)
            .tickFormat(d3.format('.4s'))
            .tickSubdivide(true);

        this._d3Svg.append('svg:g')
            .attr('class', 'x_axis')
            .attr('transform', 'translate(0,' + (this.height - this.margins.bottom) + ')')
            .call(this._xAxis);

        this._d3Svg.append('svg:g')
            .attr('class', 'y_axis')
            .attr('transform', 'translate(' + (this.margins.left) + ', 0)')
            .call(this._yAxis);
    }
    _zoomInit() {
        var zoom = d3.behavior.zoom()
                    .x(this._xRange)
                    .y(this._yRange)
                    .on('zoom', () => {this._onZoom();});

        this._d3Svg.call(zoom);
    }
    _createClipPath() {
        this._clipPathID = Utils.createUniqueId('clip');
        this._clipPath = this._d3Svg.append("clipPath")
            .attr('id', this._clipPathID)
            .append('rect')
            .attr('x', this.margins.left)
            .attr('y', this.margins.top)
            .attr('width', (this.width - (this.margins.right + this.margins.left)))
            .attr('height', (this.height - (this.margins.bottom + this.margins.top)));

    }
    _createDrawingSurface() {

        this._drawingSurface = this._d3Svg.append('g')
                                    .attr('class', 'drawing_surface')
                                    .attr('clip-path', 'url(#' + this._clipPathID + ')');
    }
    _onZoom() {
        this._d3Svg.select('.x_axis').call(this._xAxis);
        this._d3Svg.select('.y_axis').call(this._yAxis);

        this._childElementMap.forEach(function(view, id, map) {
            view.drawElement(this._drawingSurface, this._xRange, this._yRange);
        }, this);
    }
}
export default Chart;
