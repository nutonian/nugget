import Events from '../events/Events';
import DataSeries from './DataSeries';
import NumericalDataSeries from './NumericalDataSeries';
import Utils from '../utils/Utils';

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
            if (existingDataSeries.xAxisType !== dataSeries.xAxisType) {
                throw 'All data series in aggregate must have same x axis type';
            }
            if (existingDataSeries.yAxisType !== dataSeries.yAxisType) {
                throw 'All data series in aggregate must have same y axis type';
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

    getDataSeriesType() {
        // If no data series have been added yet, use NumericalDataSeries to generate empty data
        var dataSeries = this.getFirstDataSeries();
        return (dataSeries) ? dataSeries.constructor : NumericalDataSeries;
    }

    getScales(xInterval, yInterval) {
        var data = this.getData();

        var seriesType  = this.getDataSeriesType();
        var scales      = seriesType.ComputeScales(data, this.getXAxisType(), this.getYAxisType());
        var rangeMethod = seriesType.GetRangeMethod();

        scales.x[rangeMethod](xInterval);
        scales.y.range(yInterval);

        scales.x._cid = Utils.createUniqueId('scale');
        scales.y._cid = Utils.createUniqueId('scale');

        return scales;
    }

    getXAxisType() {
        var dataSeries = this.getFirstDataSeries() || new DataSeries();
        return dataSeries.xAxisType;
    }

    getYAxisType() {
        var dataSeries = this.getFirstDataSeries() || new DataSeries();
        return dataSeries.yAxisType;
    }

    size() {
        return this._dataSeriesMap.size;
    }
}

export default AggregateDataRange;
