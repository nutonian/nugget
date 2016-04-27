import Model from './Model';

class LegendData extends Model {
    constructor(data) {
        super(data);
    }

    _validate(data) {
        var isValid = data.every(function(entry) {
            if (entry.label && entry.color) {
                return (typeof entry.label === 'string') &&
                       (typeof entry.color === 'string');
            }
            return true;
        });
        return isValid;
    }
}

export default LegendData;
