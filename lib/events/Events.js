class Events {
    constructor() {
        this._events = {};
    }

    _getEventFns(eventName) {
        return this._events[eventName] || [];
    }

    _hasEvent(eventName, fn) {
        var eventFns = this._getEventFns(eventName);
        return eventFns.indexOf(fn) > -1;
    }

    on(eventName, fn) {
        if (!this._hasEvent(eventName, fn)) {
            if (!this._events[eventName]) {
                this._events[eventName] = [];
            }
            this._events[eventName].push(fn);
        }
    }

    off(eventName, fn) {
        if (!eventName && !fn) {
            for (var e in this._events) {
                delete this._events[e];
            }
        } else if (eventName && !fn) {
            delete this._events[eventName];
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
