/* global Utils: false */
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

        var labelY = (svgHeight / 2) + 5;

        function validateLabel($group, opts) {
            var $label = $group.find('text');

            expect(Number($label.attr('x'))).toBeCloseTo(opts.label.x, 0);
            expect(Number($label.attr('y'))).toBeCloseTo(opts.label.y, 0);
            expect($label.text()).toBe(opts.label.text);
        }

        function validateRectSwatch(idx, opts) {
            var $group = $('.legend_group').eq(idx);
            var $rect = $group.find('rect');

            expect(Number($rect.attr('x'))).toBeCloseTo(opts.swatch.x, 0);
            expect(Number($rect.attr('y'))).toBeCloseTo(opts.swatch.y, 0);
            expect(Number($rect.attr('width'))).toBeCloseTo(opts.swatch.width, 0);
            expect(Number($rect.attr('height'))).toBeCloseTo(opts.swatch.height, 0);
            expect($rect.attr('fill')).toBe(opts.swatch.fill);

            validateLabel($group, opts);
        }

        function validateCircleSwatch(idx, opts) {
            var $group = $('.legend_group').eq(idx);
            var $circle = $group.find('circle');

            expect(Number($circle.attr('cx'))).toBeCloseTo(opts.swatch.cx, 0);
            expect(Number($circle.attr('cy'))).toBeCloseTo(opts.swatch.cy, 0);
            expect(Number($circle.attr('r'))).toBeCloseTo(opts.swatch.radius, 0);
            expect($circle.attr('fill')).toBe(opts.swatch.fill);

            validateLabel($group, opts);
        }

        function validatePathSwatch(idx, opts) {
            var $group = $('.legend_group').eq(idx);
            var $path  = $group.find('path');

            var pathData = $path.attr('d');
            expect(Utils.getPointsFromPath(pathData)).toBeCloseToArray(Utils.getPointsFromPath(opts.swatch.data), 1);
            expect($path.attr('fill')).toEqual(opts.swatch.fill);

            validateLabel($group, opts);
        }

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
                    y: labelY,
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
                    y: labelY,
                    text: 'sizzurp'
                }
            });
        });

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
                    y: labelY,
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
                    y: labelY,
                    text: 'sizzurp'
                }
            });
        });

        it('should draw a legend with path swatches', function() {
            view.draw(d3El, [
                {color: 'orange', label: 'creamsicle', shape: 'path', points: [{x: 0,  y: 0}, {x: 10, y: 10}]},
                {color: 'purple', label: 'sizzurp',    shape: 'path', points: [{x: 10, y: 0}, {x: 0,  y: 10}]},
            ]);

            validatePathSwatch(0, {
                swatch: {
                    data: 'M10,0L20,10',
                    fill: 'orange'
                },
                label: {
                    x: 30,
                    y: labelY,
                    text: 'creamsicle'
                }
            });

            validatePathSwatch(1, {
                swatch: {
                    data: 'M109.859375,0L99.859375,10',
                    fill: 'purple'
                },
                label: {
                    x: 120,
                    y: labelY,
                    text: 'sizzurp'
                }
            });
        });

        it('should draw a legend with mixed swatches', function() {
            view.draw(d3El, [
                {color: 'orange', label: 'creamsicle', shape: 'rect'},
                {color: 'purple', label: 'sizzurp',    shape: 'circle'},
                {color: 'green',  label: 'dank',       shape: 'path', points: [{x: 0,  y: 0}, {x: 10, y: 10}]}
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
                    y: labelY,
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
                    y: labelY,
                    text: 'sizzurp'
                }
            });

            validatePathSwatch(2, {
                swatch: {
                    data: 'M178.296875,0L188.296875,10',
                    fill: 'green'
                },
                label: {
                    x: 198,
                    y: labelY,
                    text: 'dank'
                }
            });
        });

        it('should only add legend entries that have labels', function() {
            view.draw(d3El, [
                // This should be ignored
                { color: 'orange', label: null },
                // This should be rendered
                { color: 'purple', label: 'sizzurp' }
            ]);
            expect($('.legend_group').length).toBe(1);
        });

        it('should draw a legend with custom swatches', function() {
            view.draw(d3El, [
                {
                    color: 'orange',
                    label: 'creamsicle',
                    shape: 'custom',
                    drawFn: function(container, data, currX, containerHeight) {
                        var path = container.append('path')
                            .attr('d', 'M0,0L20,20')
                            .attr('fill', data.color);

                        return path;
                    }
                },
                {
                    color: 'purple',
                    label: 'sizzurp',
                    shape: 'custom',
                    drawFn: function(container, data, currX, containerHeight) {
                        var circle = container.append('circle')
                            .attr('cx', 100)
                            .attr('cy', 200)
                            .attr('r', 50)
                            .attr('fill', data.color);

                        return circle;
                    }
                }
            ]);

            validatePathSwatch(0, {
                swatch: {
                    data: 'M0,0L20,20',
                    fill: 'orange'
                },
                label: {
                    x: 30,
                    y: labelY,
                    text: 'creamsicle'
                }
            });

            validateCircleSwatch(1, {
                swatch: {
                    cx: 100,
                    cy: 200,
                    radius: 50,
                    fill: 'purple'
                },
                label: {
                    x: 160,
                    y: labelY,
                    text: 'sizzurp'
                }
            });
        });

    });

});
