import Events from '../events/Events';

class Model extends Events {
    constructor(data) {
        super();

        this.setData( (data || []), { silent: true });
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

export default Model;
