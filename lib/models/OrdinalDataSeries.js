import DataSeries from './DataSeries';

class OrdinalDataSeries extends DataSeries {
    constructor(data) {
        super(data);

        this.xAxisType = 'ordinal';
    }

    static ComputeScales(data) {
        var yMin = 0;
        var yMax = d3.max(data, function(d) {
            return d.y;
        });
        var yScale = d3.scale.linear().domain([yMin, yMax]);

        var xDomain = data.map((point) => {
            if (point.x_value instanceof Array) {
                return point.x_value[0];
            } else {
                return point.x_value;
            }
        });

        var xScale = d3.scale.ordinal().domain(xDomain);

        var scales = {
            x: xScale,
            y: yScale
        };

        return scales;
    }
    static GetRangeMethod() {
        return 'rangeBands';
    }
    _validate(data) {
        var isValid = data.every(function(point){
            return (typeof point.x_value === 'string'  || (point.x_value instanceof Array && typeof point.x_value[0] === 'string'))  &&
                        typeof point.y === 'number';
        });

        return isValid;
    }
}

export default OrdinalDataSeries;
