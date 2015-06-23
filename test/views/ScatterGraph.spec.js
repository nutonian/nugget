/* global Utils: false */
define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('ScatterGraph', function () {
        var data = [
            {x_value: 0,  y_value: 10},
            {x_value: 1,  y_value: 16},
            {x_value: 2,  y_value: 11},
            {x_value: 3,  y_value: 12},
            {x_value: 4,  y_value: 19},
            {x_value: 5,  y_value: 20},
            {x_value: 6,  y_value: 13},
            {x_value: 7,  y_value: 15},
            {x_value: 8,  y_value: 18},
            {x_value: 9,  y_value: 25},
            {x_value: 10, y_value: 27},
            {x_value: 11, y_value: 26},
            {x_value: 12, y_value: 30},
            {x_value: 13, y_value: 25}
        ];

        var $svg;
        var chart;

        beforeEach(function() {
            $svg = $( document.createElementNS('http://www.w3.org/2000/svg', 'svg') );
            $svg.attr('id', 'container').appendTo('body');

            var dataSeries = new Nugget.NumericalDataSeries(data);
            chart = new Nugget.Chart({
                width: 400,
                height: 300
            });
            var scatterGraph = new Nugget.ScatterGraph({
                dataSeries: dataSeries,
                color: 'orange'
            });
            chart.add(scatterGraph);
            chart.appendTo('#container');
        });

        afterEach(function() {
            $svg.remove();
            chart = null;
        });

        it('should render the correct amount of points', function() {
            var $points = $('.point');
            expect($points.length).toEqual(data.length);
        });

        it('should draw guides', function() {
            var point = data[data.length - 1];
            var $pointEl = $('.point:last');

            Utils.trigger($pointEl[0], 'mouseenter');

            // X Guide
            Utils.validateGuide($('.scatter_plot_guides'), {
                idx: 0,
                label: {
                    text: String(point.x_value),
                    x: 383,
                    y: 266
                },
                bg: {
                    x: 373.5,
                    y: 254.5,
                    width: 19,
                    height: 15
                },
                line: {
                    x1: 381,
                    y1: 67,
                    x2: 381,
                    y2: 250
                }
            });

            // Y Guide
            Utils.validateGuide($('.scatter_plot_guides'), {
                idx: 1,
                label: {
                    text: String(point.y_value),
                    x: 93,
                    y: 74
                },
                bg: {
                    x: 76.5,
                    y: 62.625,
                    width: 19,
                    height: 15
                },
                line: {
                    x1: 100,
                    y1: 67,
                    x2: 381,
                    y2: 67
                }
            });
        });

        it('should adjust guides on zoom', function() {
            var idx = 6;
            var point = data[idx];
            var pointEl = $('.point:eq('+ idx +')')[0];
            Utils.trigger(pointEl, 'mouseenter');

            var zooms = chart._zooms;
            var zoomX = zooms.zoomX;
            var zoomY = zooms.zoomY;

            expect(zoomX.scale()).toBe(1);
            expect(zoomY.scale()).toBe(1);

            zoomX.scale(1.5);
            zoomY.scale(1.5);

            zoomX.event(chart._d3Svg);
            zoomY.event(chart._d3Svg);

            // X Guide
            Utils.validateGuide($('.scatter_plot_guides'), {
                idx: 0,
                label: {
                    text: String(point.x_value),
                    x: 352,
                    y: 266
                },
                bg: {
                    x: 346,
                    y: 254.5,
                    width: 12,
                    height: 15
                },
                line: {
                    x1: 352,
                    y1: 250,
                    x2: 352,
                    y2: 250
                }
            });

            // Y Guide
            Utils.validateGuide($('.scatter_plot_guides'), {
                idx: 1,
                label: {
                    text: String(point.y_value),
                    x: 93,
                    y: 316
                },
                bg: {
                    x: 76.5,
                    y: 304.5,
                    width: 19,
                    height: 15
                },
                line: {
                    x1: 100,
                    y1: 250,
                    x2: 352,
                    y2: 250
                }
            });
        });

    });
});
