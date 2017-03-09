import NumericalDataSeries from './NumericalDataSeries';

const NUMERIC_KEYS = ['x_min', 'x_value', 'x_max', 'y_min', 'y_value', 'y_max'];

// Numerical data series with potentially missing values.
class SparseNumericalDataSeries extends NumericalDataSeries {

    _validate(data) {
        return data.every(point => (
            // all points must be objects
            (typeof point === 'object') &&

            // relevant keys must be numeric if defined and not null
            NUMERIC_KEYS.every(key => ((point[key] == null) || (typeof point[key] === 'number')))
        ));
    }
}

export default SparseNumericalDataSeries;
