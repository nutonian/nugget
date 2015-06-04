import Model from './Model';

class LegendData extends Model {
    constructor(data) {
        super(data);
    }

    _validate(data) {
        var isValid = data.every(function(entry) {
            return typeof entry.color === 'string' &&
                   typeof entry.label === 'string';
        });
        return isValid;
    }
}

export default LegendData;
