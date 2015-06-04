define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {

    describe('LegendView', function() {
        var view;
        var $svg;
        var d3El;

        var svgWidth = 300;
        var svgHeight = 100;

        beforeEach(function() {
            view = new Nugget.LegendView();
            $svg = $( document.createElementNS('http://www.w3.org/2000/svg', 'svg') );
            $svg.attr({
                id: 'container',
                width: svgWidth,
                height: svgHeight
            }).appendTo('body');
            d3El = d3.select('#container');
        });

        afterEach(function() {
            $svg.remove();
        });

        function validateRectSwatch(idx, opts) {
            var $group = $('.legend_group').eq(idx);
            var $rect = $group.find('rect');
            var $label = $group.find('text');

            expect(Number($rect.attr('x'))).toBeCloseTo(opts.swatch.x, 0);
            expect(Number($rect.attr('y'))).toBeCloseTo(opts.swatch.y, 0);
            expect(Number($rect.attr('width'))).toBeCloseTo(opts.swatch.width, 0);
            expect(Number($rect.attr('height'))).toBeCloseTo(opts.swatch.height, 0);
            expect($rect.attr('fill')).toBe(opts.swatch.fill);

            expect(Number($label.attr('x'))).toBeCloseTo(opts.label.x, 0);
            expect(Number($label.attr('y'))).toBeCloseTo(opts.label.y, 0);
            expect($label.text()).toBe(opts.label.text);
        }

        it('should draw a legend with rectangular swatches', function() {
            var widthOverride = 10;
            var heightOverride = 20;

            view.draw(d3El, [
                {color: 'orange', label: 'creamsicle'},
                {color: 'purple', label: 'sizzurp', width: widthOverride, height: heightOverride}
            ]);

            validateRectSwatch(0, {
                swatch: {
                    x: 10,
                    y: (svgHeight - view.DEFAULT_RECT_SIZE) / 2,
                    width: view.DEFAULT_RECT_SIZE,
                    height: view.DEFAULT_RECT_SIZE,
                    fill: 'orange'
                },
                label: {
                    x: 34,
                    y: svgHeight / 2,
                    text: 'creamsicle'
                }
            });

            validateRectSwatch(1, {
                swatch: {
                    x: 104,
                    y: (svgHeight - heightOverride) / 2,
                    width: widthOverride,
                    height: heightOverride,
                    fill: 'purple'
                },
                label: {
                    x: 124,
                    y: svgHeight / 2,
                    text: 'sizzurp'
                }
            });
        });

        function validateCircleSwatch(idx, opts) {
            var $group = $('.legend_group').eq(idx);
            var $circle = $group.find('circle');
            var $label = $group.find('text');

            expect(Number($circle.attr('cx'))).toBeCloseTo(opts.swatch.cx, 0);
            expect(Number($circle.attr('cy'))).toBeCloseTo(opts.swatch.cy, 0);
            expect(Number($circle.attr('r'))).toBeCloseTo(opts.swatch.radius, 0);
            expect($circle.attr('fill')).toBe(opts.swatch.fill);

            expect(Number($label.attr('x'))).toBeCloseTo(opts.label.x, 0);
            expect(Number($label.attr('y'))).toBeCloseTo(opts.label.y, 0);
            expect($label.text()).toBe(opts.label.text);
        }

        it('should draw a legend with circular swatches', function() {
            var radiusOverride = 10;

            view.draw(d3El, [
                {color: 'orange', label: 'creamsicle', shape: 'circle'},
                {color: 'purple', label: 'sizzurp',    shape: 'circle', radius: radiusOverride}
            ]);

            validateCircleSwatch(0, {
                swatch: {
                    cx: 17,
                    cy: (svgHeight / 2),
                    radius: view.DEFAULT_CIRCLE_RADIUS,
                    fill: 'orange'
                },
                label: {
                    x: 34,
                    y: svgHeight / 2,
                    text: 'creamsicle'
                }
            });

            validateCircleSwatch(1, {
                swatch: {
                    cx: 114,
                    cy: (svgHeight / 2),
                    radius: radiusOverride,
                    fill: 'purple'
                },
                label: {
                    x: 134,
                    y: svgHeight / 2,
                    text: 'sizzurp'
                }
            });
        });

        it('should draw a legend with mixed swatches', function() {
            view.draw(d3El, [
                {color: 'orange', label: 'creamsicle', shape: 'rect'},
                {color: 'purple', label: 'sizzurp',    shape: 'circle'}
            ]);

            validateRectSwatch(0, {
                swatch: {
                    x: 10,
                    y: (svgHeight - view.DEFAULT_RECT_SIZE) / 2,
                    width: view.DEFAULT_RECT_SIZE,
                    height: view.DEFAULT_RECT_SIZE,
                    fill: 'orange'
                },
                label: {
                    x: 34,
                    y: svgHeight / 2,
                    text: 'creamsicle'
                }
            });

            validateCircleSwatch(1, {
                swatch: {
                    cx: 111,
                    cy: (svgHeight / 2),
                    radius: view.DEFAULT_CIRCLE_RADIUS,
                    fill: 'purple'
                },
                label: {
                    x: 128,
                    y: svgHeight / 2,
                    text: 'sizzurp'
                }
            });
        });
    });

});
