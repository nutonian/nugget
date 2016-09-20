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
        var scatterGraph;
        var dataSeries;

        var circleDataChecker;
        var errorBarDataChecker;

        beforeEach(function() {
            $svg = $( document.createElementNS('http://www.w3.org/2000/svg', 'svg') );
            $svg.attr('id', 'container').appendTo('body');

            dataSeries = new Nugget.NumericalDataSeries(data);
            chart = new Nugget.Chart({
                width: 400,
                height: 300
            });

            circleDataChecker = jasmine.createSpy('circleDataChecker');
            errorBarDataChecker = jasmine.createSpy('errorBarDataChecker');

            scatterGraph = new Nugget.ScatterGraph({
                dataSeries: dataSeries,
                color: 'orange',
                inserts: function(selection) {
                    selection.selectAll('circle').each(function(d) {
                        circleDataChecker(d);
                    });

                    selection.selectAll('g.error_bar').each(function(d) {
                        errorBarDataChecker(d);
                    });
                }
            });
            chart.add(scatterGraph);
            chart.appendTo('#container');
        });

        afterEach(function() {
            $svg.remove();
            chart = null;
        });

        it('should render the correct number of points', function() {
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

            var zoomX = chart.zoomX;
            var zoomY = chart.zoomY;

            expect(zoomX.scale()).toBe(1);
            expect(zoomY.scale()).toBe(1);

            zoomX.scale(1.5);
            zoomY.scale(1.5);

            zoomX.event(chart.d3Svg);
            zoomY.event(chart.d3Svg);

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

        it('should draw a y axis guide for given x', function() {
            var guideEl = chart.d3Svg.append('g').attr('class', 'guide_layer');

            scatterGraph.drawYGuide(4, guideEl, chart);

            Utils.validateGuide($('.y_guide'), {
                label: {
                    text: '19',
                    x: 93,
                    y: 143.5
                },
                bg: {
                    x: 76.5,
                    y: 131.8,
                    width: 19,
                    height: 15
                },
                line: {
                    x1: 100,
                    y1: 136.5,
                    x2: 192.8,
                    y2: 136.5
                }
            });
        });

        it('should animate if flag is true', function() {
            scatterGraph.shouldAnimate = true;

            spyOn(d3.selection.prototype, 'transition').and.callThrough();

            dataSeries.setData([
                {x_value: 0,   y_value: 0},
                {x_value: 100, y_value: 100},
                {x_value: 200, y_value: 0}
            ]);

            expect(d3.selection.prototype.transition).toHaveBeenCalled();
            expect(d3.selection.prototype.transition.calls.count()).toBe(1);

            // now draw without animation
            scatterGraph.drawElement(chart.d3Svg, chart.xRange, chart.yRange, chart.axisLabels, false);

            // transition should not have been called again, so call count should remain 1
            expect(d3.selection.prototype.transition.calls.count()).toBe(1);
        });

        it('should call inserts with the correct data', function() {

            scatterGraph.showErrorBars = true;

            circleDataChecker.calls.reset();
            errorBarDataChecker.calls.reset();

            var newData = [
                {x_value: 0,   y_value: 10, y_min: 5, y_max: 15},
                {x_value: 100, y_value: 20, y_min: 15, y_max: 25},
                {x_value: 200, y_value: 30, y_min: 25, y_max: 35}
            ];
            dataSeries.setData(newData);

            expect(circleDataChecker.calls.allArgs()).toEqual([[newData[0]], [newData[1]], [newData[2]]]);
            expect(errorBarDataChecker.calls.allArgs()).toEqual([[newData[0]], [newData[1]], [newData[2]]]);
        });
    });
});
