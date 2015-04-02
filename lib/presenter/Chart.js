import Events from '../events/Events';
import Graph from './Graph';

class Chart extends Events {
    constructor(options) {
        //initialize internal options
        this._childElementMap = {};
        this._dataRange = null;
        this._svg = null;
        this._d3Svg = null;
        this._xRange = null;
        this._yRange = null;

        //create in memory svg and d3 instantiate it
        this._constructElement();

        // set width, height margins etc.
        this.width = options.width;
        this.height = options.height;
        this.margins = options.margins;
    }
    _constructElement() {
        //this is an in memory svg, so we can render in one go
        this._svg = document.createElement('svg');
        this._svg.setAttribute('width', this.width);
        this._svg.setAttribute('height', this.height);
        this._d3Svg = d3.select(this._svg);
    }
    appendTo(selector) {
        var select = selector || this.el;
        var element = document.querySelectorAll(select)[0];
        var elementName = element.nodeName;
        if (elementName != null) {
            if (elementName.toLowerCase() !== 'svg') {
                element.appendChild(this._svg);
            } else if (elementName.toLowerCase() === 'svg') {
                element.innerHTML = this.getHtml();
            }
        }
    }
    getHtml() {
        return this._svg.innerHTML;
    }
    add(nuggetView) {
        if (this._checkInstance(nuggetView)) {
            // internal map of child elements for cleanup and rendering purposes.
            this._childElementMap[nuggetView.id] = nuggetView;
            this._determineFullDataRange(nuggetView.dataSeries.domain);
            this._determineXandYRange();
            this.drawAxes();
            nuggetView.drawElement(this._d3Svg, this._xRange, this._yRange);
        } else {
            throw 'Must be a valid Nugget View type';
        }
    }
    _checkInstance(nuggetView) {
        return nuggetView instanceof Graph;
    }
    _determineFullDataRange(dataSeries) {
        // first, set up the initial dataRange to be the first one. if it isnt null, then we already have an element.
        if (this._dataRange === null) {
            this._dataRange = dataSeries;
            return;
        }

        //flag to trigger a change event from
        var changed = false;

        //iterate over the child element map and create a new global data range, but only if the new
        if (dataSeries.xMin <= this._dataRange.xMin) {
            this._dataRange.xMin = dataSeries.xMin;

            changed = true;
        } else if (dataSeries.xMax >= this._dataRange.xMax) {
            this._dataRange.xMax = dataSeries.xMax;
            changed = true;
        } else if (dataSeries.yMin <= this._dataRange.yMin) {
            this._dataRange.yMin = dataSeries.yMin;
            changed = true;
        } else if (dataSeries.yMax >= this._dataRange.yMax) {
            this._dataRange.yMax = dataSeries.yMax;
            changed = true;
        }
    }
    _determineXandYRange() {
        this._xRange = d3.scale.linear()
                        .range([this.margins.left, (this.width - this.margins.right)])
                        .domain([this._dataRange.xMin, this._dataRange.xMax]);
        this._yRange = d3.scale.linear()
                        .range([(this.height - this.margins.bottom), this.margins.top])
                        .domain([this._dataRange.yMin, this._dataRange.yMax]);
    }
    drawAxes() {
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
