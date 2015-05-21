import DataSeries from './DataSeries';

class NumericalDataSeries extends DataSeries {
    constructor(data, options) {
        /*
        *  Data is in the form of:
        *     [{x_value: 1, y_value: 2}, {x_value: 3, y_value: 4}, etc]
        */
        super(data, options);
    }

    static ComputeScales(data) {
        var xMin   = d3.min(data, function(d) { return d.x_value; });
        var xMax   = d3.max(data, function(d) { return d.x_value; });
        var xScale = d3.scale.linear().domain([xMin, xMax]);

        var yMin   = d3.min(data, function(d) { return d.y_value; });
        var yMax   = d3.max(data, function(d) { return d.y_value; });
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

    getRangeData() {
        var rangeData = this.data.map(d => {
            var point = {};
            if (!this.ignoreXRange) {
                point.x_value = d.x_value;
            }
            if (!this.ignoreYRange) {
                point.y_value = d.y_value;
            }
            return point;
        });
        return rangeData;
    }

    _validate(data) {
        var isValid = data.every(function(point) {
            return typeof point.x_value === 'number' &&
                   typeof point.y_value === 'number';
        });
        return isValid;
    }
}

export default NumericalDataSeries;
