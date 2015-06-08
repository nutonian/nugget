import Model from './Model';
import Utils from '../utils/Utils';

class DataSeries extends Model {
    constructor(data, options = {}) {
        super(data);

        this.id = Utils.createUniqueId('data_series_');
        this.xAxisType = 'numerical';

        this.ignoreXRange = options.ignoreXRange || false;
        this.ignoreYRange = options.ignoreYRange || false;
    }

    static ComputeScales() {
        throw 'Implement in subclass';
    }

    getRangeData() {
        return this.getDataCopy();
    }
}

export default DataSeries;
