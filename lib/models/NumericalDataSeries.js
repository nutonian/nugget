import DataSeries from './DataSeries';

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
         */
        super(data, options);
    }

    static ComputeScales(data) {
        var xMin   = d3.min(data, d => d3.min([d.x_min, d.x_value, d.x_max]));
        var xMax   = d3.max(data, d => d3.max([d.x_min, d.x_value, d.x_max]));
        var xScale = d3.scale.linear().domain([xMin, xMax]);

        var yMin   = d3.min(data, d => d3.min([d.y_min, d.y_value, d.y_max]));
        var yMax   = d3.max(data, d => d3.max([d.y_min, d.y_value, d.y_max]));
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
        var isValid = data.every(function(point) {
            // each point needs to be an object
            if (typeof point !== 'object') {
                return false;
            }
            // make sure the relevant axis keys are numeric
            var numericKeys = ['x_min', 'x_value', 'x_max', 'y_min', 'y_value', 'y_max'];
            var hasAllNumbers = numericKeys.every(key => {
                // make sure the key is either not present, or if present, is a number
                return (point[key] === undefined) || (typeof point[key] === 'number');
            });
            if (!hasAllNumbers) {
                return false;
            }
            // make sure all points have the same data structure
            for (let i=0; i < data.length - 1; i++) {
                let keys1 = Object.keys(data[i]);
                let keys2 = Object.keys(data[i+1]);
                let keys1Set = new Set(keys1);
                let keys2Set = new Set(keys2);

                if (!keys2.every(key => keys1Set.has(key)) ||
                    !keys1.every(key => keys2Set.has(key))) {
                    return false;
                }

            }
            return true;
        });
        return isValid;
    }
}

export default NumericalDataSeries;
