import DataSeries from './DataSeries';

class OrdinalDataSeries extends DataSeries {
    constructor(data) {
        super(data);
    }

    static ComputeScales() {
        throw 'Implement scales';
    }
}

export default OrdinalDataSeries;
