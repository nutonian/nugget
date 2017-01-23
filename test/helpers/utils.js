window.Utils = {
    trigger: function(el, eventName, x, y) {
        var e = document.createEvent('Event');
        e.initEvent(eventName, true, true);
        e.clientX = e.pageX = x || 0;
        e.clientY = e.pageY = y || 0;
        el.dispatchEvent(e);
    },

    validateGuide: function($el, opts) {
        var idx = opts.idx || 0;

        if (opts.label) {
            var $text = $el.find('.guide_label').eq(idx);
            expect($text.text()).toBe(opts.label.text);
            expect(Number($text.attr('x'))).toBeCloseTo(opts.label.x, -1);
            expect(Number($text.attr('y'))).toBeCloseTo(opts.label.y, -1);
        }

        if (opts.bg) {
            var $bg = $el.find('.guide_label_bg').eq(idx);
            expect(Number($bg.attr('x'))).toBeCloseTo(opts.bg.x, -1);
            expect(Number($bg.attr('y'))).toBeCloseTo(opts.bg.y, -1);
            expect(Number($bg.attr('width'))).toBeCloseTo(opts.bg.width, -1);
            expect(Number($bg.attr('height'))).toBeCloseTo(opts.bg.height, -1);
        }

        if (opts.line) {
            var $line = $el.find('.guide_line').eq(idx);
            expect(Number($line.attr('x1'))).toBeCloseTo(opts.line.x1, -1);
            expect(Number($line.attr('y1'))).toBeCloseTo(opts.line.y1, -1);
            expect(Number($line.attr('x2'))).toBeCloseTo(opts.line.x2, -1);
            expect(Number($line.attr('y2'))).toBeCloseTo(opts.line.y2, -1);
        }
    },

    getPointsFromPath: function(pathData) {
        return pathData.split(/[,ML]/).map(Number);
    },

    zoomToRegion: function(chartEl, coords) {
        Utils.trigger(chartEl, 'mousedown', coords.x1, coords.y1);
        Utils.trigger(chartEl, 'mousemove', coords.x2, coords.y2);
        Utils.trigger(chartEl, 'mouseup');
    }
};

// add reporter to jasmine environment
jasmine.getEnv().addReporter(new jasmine.JSReporter2());

// Sauce labs chokes if the output of js report is too big (more than a few
// kb). So we strip out things like stack traces etc. to trim it down
(function () {
    var oldFunc = window.jasmine.getJSReport;
    window.jasmine.getJSReport = function () {
        var results = oldFunc();
        if (results) {
            return {
                durationSec: results.durationSec,
                suites: removeExtraFluff(results.suites),
                passed: results.passed
            };
        } else {
            return null;
        }
    };

    function removeExtraFluff(suites) {
        return $.map($.grep(suites, grepFailed), mapSuite);
    }

    function mapSuite(suite) {
        return $.extend({}, suite, {
            specs: $.map($.grep(suite.specs, grepFailed), removeTrace),
            suites: removeExtraFluff(suite.suites)
        });
    }

    function grepFailed(item) {
        return !item.passed;
    }

    function removeTrace(spec) {
        if (spec.failures) {
            $.each(spec.failures, function(i, failure) {
                delete failure.trace;
            })
        }
        return spec;
    }
})();
