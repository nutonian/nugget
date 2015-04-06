class Events {
    constructor() {
        this._events = new Map();
    }

    _getEventFns(eventName) {
        return this._events.get(eventName) || [];
    }

    _hasEvent(eventName, fn) {
        var eventFns = this._getEventFns(eventName);
        return eventFns.indexOf(fn) > -1;
    }

    on(eventName, fn) {
        if (!this._hasEvent(eventName, fn)) {
            if (!this._events.get(eventName)) {
                this._events.set(eventName, []);
            }
            this._events.get(eventName).push(fn);
        }
    }

    off(eventName, fn) {
        if (!eventName && !fn) {
            this._events.clear();
        } else if (eventName && !fn) {
            this._events.delete(eventName);
        } else if (eventName && fn) {
            var eventFns = this._getEventFns(eventName);
            var idx = eventFns.indexOf(fn);
            if (idx > -1) {
                eventFns.splice(idx, 1);
            }
        }
    }

    trigger(eventName, extraArgsArray) {
        extraArgsArray = extraArgsArray || [];

        var eventFns = this._getEventFns(eventName);
        var eventArgs = [{ target: this }].concat(extraArgsArray);
        eventFns.forEach((fn, i) => {
            fn.apply(this, eventArgs);
        });
    }
}

export default Events;
