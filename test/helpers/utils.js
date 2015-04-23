window.Utils = {
    trigger: function(el, eventName, x, y) {
        var e = document.createEvent('Event');
        e.initEvent(eventName, true, true);
        e.clientX = e.pageX = x || 0;
        e.clientY = e.pageY = y || 0;
        el.dispatchEvent(e);
    }
};
