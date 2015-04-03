import Events from '../events/Events';
class DataSeries extends Events {
    constructor(data) {
        this.data = data;

        if (!this.data) {
            throw 'Data must be supplied in a dataSeries';
        }
        this.getDataRange();
    }
    getDataRange() {

        var xMin = d3.min(this.data, function(d) { return d.x; });
        var xMax = d3.max(this.data, function(d) { return d.x; });
        var yMin = d3.min(this.data, function(d) { return d.y; });
        var yMax = d3.max(this.data, function(d) { return d.y; });
        this.domain = {
            xMin: xMin,
            xMax: xMax,
            yMin: yMin,
            yMax: yMax
        };
    }
}
export default DataSeries;
