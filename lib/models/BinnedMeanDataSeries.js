import Axes from './Axes';
import DataSeries from './DataSeries';

class BinnedMeanDataSeries extends DataSeries {
    constructor(data) {
        super(data);
    }
    static ComputeScales(data, xAxisType, yAxisType) {
        var xMin = d3.min(data, function(d) { return d.x_mean; });
        var xMax = d3.max(data, function(d) { return d.x_mean; });
        var xScale = Axes.getScaleForAxisType(xAxisType).domain([xMin, xMax]);

        var yMin = d3.min(data, function(d) { return d.y_mean; });
        var yMax = d3.max(data, function(d) { return d.y_mean; });
        var yScale = Axes.getScaleForAxisType(yAxisType).domain([yMin, yMax]);

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
        var isValid = data.every(function(point){
            return  typeof point.num_values === 'number' &&
                    typeof point.x_high     === 'number' &&
                    typeof point.x_low      === 'number' &&
                    typeof point.x_mean     === 'number' &&
                    typeof point.y_mean     === 'number';
        });

        return isValid;
    }
}

export default BinnedMeanDataSeries;
