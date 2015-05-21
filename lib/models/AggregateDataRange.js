import Events from '../events/Events';
import DataSeries from './DataSeries';
import NumericalDataSeries from './NumericalDataSeries';

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
            data = data.concat(dataSeries.getRangeData());
        });
        return data;
    }

    getFirstDataSeries() {
        var key = this._dataSeriesMap.keys().next().value;
        var dataSeries = this._dataSeriesMap.get(key);
        return dataSeries;
    }

    getScales(xInterval, yInterval) {
        var data = this.getData();

        var dataSeries  = this.getFirstDataSeries();

        // If no data series have been added yet, use NumericalDataSeries to generate empty data
        var ctor        = dataSeries ? dataSeries.constructor : NumericalDataSeries;
        var scales      = ctor.ComputeScales(data);
        var rangeMethod = ctor.GetRangeMethod();

        scales.x[rangeMethod](xInterval);
        scales.y.range(yInterval);

        return scales;
    }

    getXAxisType() {
        var dataSeries = this.getFirstDataSeries() || new DataSeries();
        return dataSeries.xAxisType;
    }

    size() {
        return this._dataSeriesMap.size;
    }
}

export default AggregateDataRange;
