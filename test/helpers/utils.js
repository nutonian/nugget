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
            expect(Number($text.attr('x'))).toBeCloseTo(opts.label.x, 0);
            expect(Number($text.attr('y'))).toBeCloseTo(opts.label.y, 0);
        }

        if (opts.bg) {
            var $bg = $el.find('.guide_label_bg').eq(idx);
            expect(Number($bg.attr('x'))).toBeCloseTo(opts.bg.x, 0);
            expect(Number($bg.attr('y'))).toBeCloseTo(opts.bg.y, 0);
            expect(Number($bg.attr('width'))).toBeCloseTo(opts.bg.width, 0);
            expect(Number($bg.attr('height'))).toBeCloseTo(opts.bg.height, 0);
        }

        if (opts.line) {
            var $line = $el.find('.guide_line').eq(idx);
            expect(Number($line.attr('x1'))).toBeCloseTo(opts.line.x1, 0);
            expect(Number($line.attr('y1'))).toBeCloseTo(opts.line.y1, 0);
            expect(Number($line.attr('x2'))).toBeCloseTo(opts.line.x2, 0);
            expect(Number($line.attr('y2'))).toBeCloseTo(opts.line.y2, 0);
        }
    }
};
