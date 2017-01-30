import Axes from './Axes';
import Model from './Model';
import Utils from '../utils/Utils';

class DataSeries extends Model {
    constructor(data, options = {}) {
        super(data);

        this.id = Utils.createUniqueId('data_series_');

        this.xAxisType = options.xAxisType || Axes.AXIS_TYPES.NUMERICAL;
        this.yAxisType = options.yAxisType || Axes.AXIS_TYPES.NUMERICAL;

        this.ignoreXRange = options.ignoreXRange || false;
        this.ignoreYRange = options.ignoreYRange || false;
    }

    static ComputeScales(data, xAxisType, yAxisType) {
        throw 'Implement in subclass';
    }

    getRangeData() {
        return this.getDataCopy();
    }
}

export default DataSeries;
