import DataSeries from './DataSeries';

class NumericalDataSeries extends DataSeries {
    constructor(data) {
        /*
        *  Data is in the form of:
        *     [{x: 1, y: 2}, {x: 3, y: 4}, etc]
        */
        super(data);
    }

    static ComputeScales(data) {
        var xMin   = d3.min(data, function(d) { return d.x; });
        var xMax   = d3.max(data, function(d) { return d.x; });
        var xScale = d3.scale.linear().domain([xMin, xMax]);

        var yMin   = d3.min(data, function(d) { return d.y; });
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
            return typeof point.x === 'number' &&
                   typeof point.y === 'number';
        });
        return isValid;
    }
}

export default NumericalDataSeries;
