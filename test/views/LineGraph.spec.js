define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('Line Graph Tests', function () {

        var $svg;
        var chart;

        beforeEach(function() {
            $svg = $( document.createElementNS('http://www.w3.org/2000/svg', 'svg') );
            $svg.attr('id', 'container').appendTo('body');
            chart = new Nugget.Chart({
                width: 500,
                height: 500
            });
        });

        afterEach(function() {
            $svg.remove();
            chart = null;
        });

        it('should render a line graph', function() {
            var data = [
                {x_value: 0,   y_value: 100},
                {x_value: 100, y_value: 0},
                {x_value: 200, y_value: 100}
            ];

            var dataseries = new Nugget.NumericalDataSeries(data);

            var line = new Nugget.LineGraph({
                dataSeries: dataseries,
                color: 'purple'
            });

            chart.add(line);
            chart.appendTo('#container');

            var $plotline = $('path.line');

            var expectedPoints = ['M109.51219512195122', 51, 441, 51];
            var actualPoints = $plotline.attr('d').split(',');

            expect($plotline.length).toBe(1);
            expect(expectedPoints[0]).toEqual(actualPoints[0]);
            expect(expectedPoints[1]).toBeCloseTo(parseInt(actualPoints[1]));
            expect(expectedPoints[2]).toBeCloseTo(parseInt(actualPoints[2]));
            expect(expectedPoints[3]).toBeCloseTo(parseInt(actualPoints[3]));
        });
    });
});
