import DataSeries from './DataSeries';

class RangeDataSeries extends DataSeries {
    constructor(data) {
        super(data);
    }

    static ComputeScales(data) {
        var xMin   = d3.min(data, function(d) { return d.x_low; });
        var xMax   = d3.max(data, function(d) { return d.x_high; });
        var xScale = d3.scale.linear().domain([xMin, xMax]);

        var yMin   = 0;
        var yMax   = d3.max(data, function(d) { return d.y; });
        var yScale = d3.scale.linear().domain([yMin, yMax]);

        var scales = {
            x: xScale,
            y: yScale
        };
        return scales;
    }
    static GetRangeMethod() {
        return 'range';
    }
    _validate(data) {
        var isValid = data.every(function(point) {
            return typeof point.x_high === 'number' &&
                   typeof point.x_low  === 'number' &&
                   typeof point.y      === 'number';
        });
        return isValid;
    }
}

export default RangeDataSeries;
