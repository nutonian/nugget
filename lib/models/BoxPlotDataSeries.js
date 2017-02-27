import Axes from './Axes';
import DataSeries from './DataSeries';

// This is necessary for a Box plot, as computing all these is not entirely necessary

class BoxPlotDataSeries extends DataSeries {
    constructor(data, options) {
        super(data, options);

        this.xAxisType = Axes.AXIS_TYPES.ORDINAL;
    }
    static ComputeScales(data, xAxisType, yAxisType) {
        var yMin = d3.min(data, function(d) {
            return d.y_min;
        });
        var yMax = d3.max(data, function(d) {
            return d.y_max;
        });
        var yScale = Axes.getScaleForAxisType(yAxisType).domain([yMin, yMax]);
        var xDomain = data.map(point => point.x_value);

        var xScale = Axes.getScaleForAxisType(xAxisType).domain(xDomain);

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
            return typeof point.x_value === 'string' &&
                        typeof point.y_min === 'number' &&
                        typeof point.y_max === 'number';
        });

        return isValid;
    }
}

export default BoxPlotDataSeries;
