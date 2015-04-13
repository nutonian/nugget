import DataSeries from './DataSeries';

class RangeSeries extends DataSeries {
    constructor(data) {
        super(data);
    }
    _createDataDomain(data) {
        this.xMin = d3.min(data, function(d) { return d.x_low; });
        this.xMax = d3.max(data, function(d) { return d.x_high; });
        //histograms always start at 0. No negative values here.
        this.yMin = 0;
        this.yMax = d3.max(data, function(d) { return d.y; });
    }
}

export default RangeSeries;
