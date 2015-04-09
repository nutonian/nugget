import Events from '../events/Events';

class DataSeries extends Events {
    constructor(data) {
        super();

        /*
        *  Data is in the form of:
        *     [{x: 1, y: 2}, {x: 3, y: 4}, etc]
        */
        this.setData( (data || []), { silent: true });
    }

    _createDataDomain(data) {
        this.xMin = d3.min(data, function(d) { return d.x; });
        this.xMax = d3.max(data, function(d) { return d.x; });
        this.yMin = d3.min(data, function(d) { return d.y; });
        this.yMax = d3.max(data, function(d) { return d.y; });
    }

    getData() {
        // Returns a copy of the data
        return this.data.concat();
    }

    setData(data, opts = { silent: false }) {
        this.data = data;
        this._createDataDomain(data);

        if (!opts.silent) {
            this.trigger('change');
        }
    }
}

export default DataSeries;
