var Utils = {
    idCounter: 0,

    createUniqueId: function(prefix) {
        var id = ++this.idCounter + '';
        return prefix ? prefix + id : id;
    },

    // throttle adapted from underscore.js http://underscorejs.org/
    throttle: function(func, wait, options = {}) {
        var context, args, result;
        var timeout = null;
        var previous = 0;

        var later = function() {
            previous = options.leading === false ? 0 : Date.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) {
                context = args = null;
            }
        };
        return function() {
            var now = Date.now();
            if (!previous && options.leading === false) {
                previous = now;
            }
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) {
                    context = args = null;
                }
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    },

    // innerHTML = '' doesn't work in IE (and isn't the most efficient way of emptying)
    emptyNode: function(node) {
        while (node.lastChild) {
            node.removeChild(node.lastChild);
        }
    },

    // Gets the number closest to "num" in array "arr"
    // Yanked from: http://stackoverflow.com/a/8584940 and modified to support objects
    closest: function closest(num, arr, key) {
        var currentClosestElement = arr[0];
        var diff = Math.abs(num - (key ? currentClosestElement[key] : currentClosestElement));

        // loop through array and find element with minimum diff from num
        // (in other words, the closest element)
        for (let i = 0; i < arr.length; i++) {
            var val = key ? arr[i][key] : arr[i];
            var newdiff = Math.abs(num - val);
            if (newdiff < diff) {
                diff = newdiff;
                currentClosestElement = arr[i];
            }
        }
        return currentClosestElement;
    }

};

export default Utils;
