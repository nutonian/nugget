import DataSeries from '../models/DataSeries';
import Events from '../events/Events';
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
        this._drawAxes();

        this._childElementMap.forEach(function(nuggetView) {
            nuggetView.drawElement(this._d3Svg, this._xRange, this._yRange);
        }, this);
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
        var xAxis = d3.svg.axis()
            .scale(this._xRange)
            .tickSize(5)
            .tickSubdivide(true);

        var yAxis = d3.svg.axis()
            .scale(this._yRange)
            .orient('left')
            .tickSize(5)
            .tickSubdivide(true);

        this._d3Svg.append('svg:g')
            .attr('class', 'x_axis')
            .attr('transform', 'translate(0,' + (this.height - this.margins.bottom) + ')')
            .call(xAxis);

        this._d3Svg.append('svg:g')
            .attr('class', 'y_axis')
            .attr('transform', 'translate(' + (this.margins.left) + ', 0)')
            .call(yAxis);
    }
}
export default Chart;
