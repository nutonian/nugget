/* global Utils: false */
define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('LineGraph', function () {

        var $svg;
        var chart;
        var line;
        var dataseries;

        beforeEach(function() {
            $svg = $( document.createElementNS('http://www.w3.org/2000/svg', 'svg') );
            $svg.attr('id', 'container').appendTo('body');
            chart = new Nugget.Chart({
                width: 500,
                height: 500
            });

            var data = [
                {x_value: 0,   y_value: 100, other_y: 200},
                {x_value: 100, y_value: 0,   other_y: 300},
                {x_value: 200, y_value: 100, other_y: 400}
            ];

            dataseries = new Nugget.NumericalDataSeries(data);

            line = new Nugget.LineGraph({
                dataSeries: dataseries,
                color: 'purple'
            });

            chart.add(line);
            chart.appendTo('#container');
        });

        afterEach(function() {
            $svg.remove();
            chart = null;
        });

        it('should render a line graph', function() {

            var $plotline = $('path.line');

            var expectedPoints = ['M109.51219512195122', 9, 440, 9];
            var actualPoints = $plotline.attr('d').split(',');

            expect($plotline.length).toBe(1);
            expect(expectedPoints[0]).toEqual(actualPoints[0]);
            expect(expectedPoints[1]).toBeCloseTo(parseInt(actualPoints[1]));
            expect(expectedPoints[2]).toBeCloseTo(parseInt(actualPoints[2]));
            expect(expectedPoints[3]).toBeCloseTo(parseInt(actualPoints[3]));
        });

        it('should draw a y axis guide for given x', function() {
            var guideEl = chart.d3Svg.append('g').attr('class', 'guide_layer');

            line.drawYGuide(100, guideEl, chart);

            Utils.validateGuide($('.y_guide'), {
                label: {
                    text: '0',
                    x: 93,
                    y: 447
                },
                bg: {
                    x: 83.5,
                    y: 435.7,
                    width: 12,
                    height: 15
                },
                line: {
                    x1: 100,
                    y1: 440,
                    x2: 295,
                    y2: 440
                }
            });
        });

        it('should animate if flag is true', function() {
            line.shouldAnimate = true;

            spyOn(d3.selection.prototype, 'transition').and.callThrough();

            dataseries.setData([
                {x_value: 0,   y_value: 0},
                {x_value: 100, y_value: 100},
                {x_value: 200, y_value: 0}
            ]);

            expect(d3.selection.prototype.transition).toHaveBeenCalled();
            expect(d3.selection.prototype.transition.calls.count()).toBe(1);

            // now draw without animation
            line.drawElement(chart.d3Svg, chart.xRange, chart.yRange, chart.axisLabels, false);

            // transition should not have been called again, so call count should remain 1
            expect(d3.selection.prototype.transition.calls.count()).toBe(1);
        });

        it('should allow custom y axis guide label property', function() {
            var guideEl = chart.d3Svg.append('g').attr('class', 'guide_layer');

            line.guideLabelProp = 'other_y';
            line.drawYGuide(100, guideEl, chart);

            Utils.validateGuide($('.y_guide'), {
                label: {
                    text: '300',
                    x: 93,
                    y: 447
                },
                bg: {
                    x: 69.5,
                    y: 435.7,
                    width: 26,
                    height: 15
                },
                line: {
                    x1: 100,
                    y1: 440,
                    x2: 295,
                    y2: 440
                }
            });

        });
    });
});
