import Events from '../events/Events';

class AggregateDataRange extends Events {

    // In this context, dataSeries is plural: an array of DataSeries classes
    constructor(dataSeriesArray) {
        super();

        this._dataSeriesMap = new Map();

        if (!dataSeriesArray) { return; }

        dataSeriesArray.forEach(function(dataSeries) {
            this.addDataSeries(dataSeries, true);
        }, this);
    }

    addDataSeries(dataSeries, silent = false) {
        var existingDataSeries = this.getFirstDataSeries();
        if (existingDataSeries) {
            if (existingDataSeries.constructor !== dataSeries.constructor) {
                throw 'Invalid type. All types must be the same.';
            }
        }

        this._dataSeriesMap.set(dataSeries.id, dataSeries);

        // pseudo-bubbling for now
        dataSeries.on('change', (e) => {
            this.trigger('change', dataSeries);
        });

        if (!silent) {
            this.trigger('add', dataSeries);
        }
    }

    removeDataSeries(dataSeries, silent = false) {
        this._dataSeriesMap.delete(dataSeries.id);

        if (!silent) {
            this.trigger('remove', dataSeries);
        }
    }

    getData() {
        var data = [];
        this._dataSeriesMap.forEach(function(dataSeries) {
            data = data.concat(dataSeries.data);
        });
        return data;
    }

    getFirstDataSeries() {
        var key = this._dataSeriesMap.keys().next().value;
        var dataSeries = this._dataSeriesMap.get(key);
        return dataSeries;
    }

    getScales() {
        var data = this.getData();

        // Take the first item in the map and "statically" call ComputeScales with all of the aggregated data
        var dataSeries = this.getFirstDataSeries();
        var scales = dataSeries.constructor.ComputeScales(data);

        return scales;
    }
}

export default AggregateDataRange;
