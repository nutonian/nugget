/* global Utils: false */
define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('Box Plot Tests', function () {
        var data = [
            {
                x_value: '0',
                y_min: 1,
                y_25pct: 25,
                y_50pct: 50,
                y_75pct: 75,
                y_max: 99
            },
            {
                x_value: '1',
                y_min: 10,
                y_25pct: 30,
                y_50pct: 50,
                y_75pct: 70,
                y_max: 90
            }
        ];

        var $svg;
        var chart;

        beforeEach(function() {
            $svg = $( document.createElementNS('http://www.w3.org/2000/svg', 'svg') );
            $svg.attr('id', 'container').appendTo('body');

            var dataSeries = new Nugget.BoxPlotDataSeries(data);
            chart = new Nugget.Chart({
                width: 900,
                height: 500
            });
            var boxes = new Nugget.BoxPlot({
                dataSeries: dataSeries,
                color: '#09e',
                guides: true
            });
            chart.add(boxes);
            chart.appendTo('#container');
        });

        afterEach(function() {
            $svg.remove();
            chart = null;
        });

        it('should render the correct amount of boxes', function() {
            var renderedHtml = document.querySelectorAll('.box_plot');
            expect(renderedHtml.length).toBe(data.length);
        });

        it('should show and hide guides', function() {
            var el = $('.box_plot:first')[0];
            Utils.trigger(el, 'mouseenter');
            expect($('.box_plot_guide').length).toBe(5);

            Utils.trigger(el, 'mouseleave');
            expect($('.box_plot_guide').length).toBe(0);
        });

        describe('guides', function() {
            var el;

            beforeEach(function() {
                el = $('.box_plot:first')[0];
                Utils.trigger(el, 'mouseenter');
            });

            afterEach(function() {
                el = null;
            });

            it('should draw guide boxes', function() {
                var bgData = $('.box_plot_guide').map(function() {
                    var $guide = $(this);
                    var $bg = $guide.find('.guide_label_bg');
                    return {
                        x: $bg.attr('x'),
                        y: $bg.attr('y'),
                        width: $bg.attr('width'),
                        height: $bg.attr('height')
                    };
                }).toArray();

                expect(bgData).toEqual([
                    {'x': '83.5', 'y': '435.34375', 'width': '12', 'height': '15'},
                    {'x': '76.5', 'y': '339.96875', 'width': '19', 'height': '15'},
                    {'x': '76.5', 'y': '240.625',   'width': '19', 'height': '15'},
                    {'x': '76.5', 'y': '141.28125', 'width': '19', 'height': '15'},
                    {'x': '76.5', 'y': '45.921875', 'width': '19', 'height': '15'}
                ]);
            });

            it('should draw guide lines', function() {
                var lineData = $('.box_plot_guide').map(function() {
                    var $guide = $(this);
                    var $line = $guide.find('.guide_line');
                    return {
                        x1: $line.attr('x1'),
                        y1: $line.attr('x1'),
                        x2: $line.attr('x2'),
                        y2: $line.attr('x2'),
                    };
                }).toArray();

                expect(lineData).toEqual([
                    {'x1': '93', 'y1': '93', 'x2': '183.15789794921875', 'y2': '183.15789794921875'},
                    {'x1': '93', 'y1': '93', 'x2': '183.15789794921875', 'y2': '183.15789794921875'},
                    {'x1': '93', 'y1': '93', 'x2': '183.15789794921875', 'y2': '183.15789794921875'},
                    {'x1': '93', 'y1': '93', 'x2': '183.15789794921875', 'y2': '183.15789794921875'},
                    {'x1': '93', 'y1': '93', 'x2': '183.15789794921875', 'y2': '183.15789794921875'}
                ]);
            });

            it('should draw guide labels', function() {
                var labelData = $('.box_plot_guide').map(function() {
                    var $guide = $(this);
                    var $label = $guide.find('.guide_label');
                    return $label.text();
                }).toArray();

                var d = data[0];
                expect(labelData).toEqual([
                    String(d.y_min),
                    String(d.y_25pct),
                    String(d.y_50pct),
                    String(d.y_75pct),
                    String(d.y_max)
                ]);
            });

            it('should only render guides that are within the yRange on zoom', function() {
                var zoomY = chart._zooms.zoomY;
                zoomY.scale(1.5);
                zoomY.event(chart._d3Svg);
                expect($('.guide_label').length).toBe(3);

                zoomY.scale(10);
                zoomY.event(chart._d3Svg);
                expect($('.guide_label').length).toBe(0);

                zoomY.scale(1);
                zoomY.event(chart._d3Svg);
                expect($('.guide_label').length).toBe(5);
            });
        });
    });
});
