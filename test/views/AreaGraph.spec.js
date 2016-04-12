define([
        'Nugget',
        '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('AreaGraph', function () {
        var data = [
            {x_value: 0,  y_min: 0, y_max: 3},
            {x_value: 1,  y_min: 7, y_max: 10},
            {x_value: 2,  y_min: 0, y_max: 3}
        ];

        var $svg;
        var chart;
        var areaGraph;
        var dataSeries;

        beforeEach(function() {
            $svg = $( document.createElementNS('http://www.w3.org/2000/svg', 'svg') );
            $svg.attr('id', 'container').appendTo('body');

            dataSeries = new Nugget.NumericalDataSeries(data);
            chart = new Nugget.Chart({
                width: 400,
                height: 300
            });
            areaGraph = new Nugget.AreaGraph({
                dataSeries: dataSeries,
                color: 'grey'
            });
            chart.add(areaGraph);
            chart.appendTo('#container');
        });

        afterEach(function() {
            $svg.remove();
            chart = null;
        });

        it('should render the path correctly', function() {
            var $areaPlot = $('path.area');

            var expectedPoints = ["M109.35483870967742", 171, 9, 171, 240, 78, 240];
            var actualPoints = $areaPlot.attr('d').split(',');

            expect($areaPlot.length).toBe(1);
            expect(expectedPoints[0]).toEqual(actualPoints[0]);
            expect(expectedPoints[1]).toBeCloseTo(parseInt(actualPoints[1]));
            expect(expectedPoints[2]).toBeCloseTo(parseInt(actualPoints[2]));
            expect(expectedPoints[3]).toBeCloseTo(parseInt(actualPoints[3]));
            expect(expectedPoints[4]).toBeCloseTo(parseInt(actualPoints[4]));
            expect(expectedPoints[5]).toBeCloseTo(parseInt(actualPoints[5]));
            expect(expectedPoints[6]).toBeCloseTo(parseInt(actualPoints[6]));
        });

        it('should animate if flag is true', function() {
            areaGraph.shouldAnimate = true;

            spyOn(d3.selection.prototype, 'transition').and.callThrough();

            dataSeries.setData([
                {x_value: 0,   y_min: 10, y_max: 13},
                {x_value: 100, y_min: 10, y_max: 13},
                {x_value: 200, y_min: 10, y_max: 13}
            ]);

            expect(d3.selection.prototype.transition).toHaveBeenCalled();
            expect(d3.selection.prototype.transition.calls.count()).toBe(1);

            // now draw without animation
            areaGraph.drawElement(chart.d3Svg, chart.xRange, chart.yRange, chart.axisLabels, false);

            // transition should not have been called again, so call count should remain 1
            expect(d3.selection.prototype.transition.calls.count()).toBe(1);

        });
    });
});
