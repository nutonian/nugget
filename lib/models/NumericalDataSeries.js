import Axes from './Axes';
import DataSeries from './DataSeries';

const NUMERIC_KEYS = ['x_min', 'x_value', 'x_max', 'y_min', 'y_value', 'y_max'];

class NumericalDataSeries extends DataSeries {
    constructor(data, options) {
        /*
         *  Data is in the form of:
         *     [{
         *         x_value : 1,
         *         x_min   : 0,
         *         x_max   : 2,
         *         y_value : 2,
         *         y_min   : 1,
         *         y_max   : 3
         *     }, {
         *         x_value : 3,
         *         x_min   : 1,
         *         x_max   : 4,
         *         y_value : 4,
         *         y_min   : 3,
         *         y_max   : 5
         *     }, etc]
         *
         *  Some common combination of fields are:
         *      1. Range for X, Single value for Y - x_min, x_max, y_value (e.g., for a binned mean plot)
         *      2. Single value for X, Range for Y - x_value, y_min, y_max (e.g., for an area plot)
         *      3. Single value for X, Range + value for Y - x_value, y_min, y_max, y_value (e.g., for points with error bars)
         */
        super(data, options);
    }

    static ComputeScales(data, xAxisType, yAxisType) {
        var xMin   = d3.min(data, d => d3.min([d.x_min, d.x_value, d.x_max]));
        var xMax   = d3.max(data, d => d3.max([d.x_min, d.x_value, d.x_max]));
        var xScale = Axes.getScaleForAxisType(xAxisType).domain([xMin, xMax]);

        var yMin   = d3.min(data, d => d3.min([d.y_min, d.y_value, d.y_max]));
        var yMax   = d3.max(data, d => d3.max([d.y_min, d.y_value, d.y_max]));
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

    getRangeData() {
        var rangeData = this.data.map(d => {
            var point = {};
            if (!this.ignoreXRange) {
                point.x_value = d.x_value;
                point.x_min = d.x_min;
                point.x_max = d.x_max;
            }
            if (!this.ignoreYRange) {
                point.y_value = d.y_value;
                point.y_min = d.y_min;
                point.y_max = d.y_max;
            }

            // stringify and parse to delete undefined properties
            point = JSON.parse(JSON.stringify(point));

            return point;
        });
        return rangeData;
    }

    _validate(data) {
        return data.every(point => (
            // each point needs to be an object
            (typeof point === 'object') &&
            // make sure the relevant axis keys are numeric if present
            NUMERIC_KEYS.every(key => ((point[key] === undefined) || (typeof point[key] === 'number')))
        ));
    }
}

export default NumericalDataSeries;
