import Events from '../events/Events';
import Utils from '../utils/Utils';

class DataSeries extends Events {
    constructor(data) {
        super();

        this.id = Utils.createUniqueId('data_series_');

        this.setData( (data || []), { silent: true });

        this.xAxisType = 'numerical';
    }

    static ComputeScales() {
        throw 'Implement in subclass';
    }

    getDataCopy() {
        return this.data.concat();
    }

    setData(data, opts = { silent: false }) {
        if (this._validate(data)) {
            this.data = data;
        } else {
            throw 'Invalid data';
        }

        if (!opts.silent) {
            this.trigger('change');
        }
    }

    // _validate can be implemented in subclasses if you'd like to add data validation
    _validate(data) {
        return true;
    }
}

export default DataSeries;
