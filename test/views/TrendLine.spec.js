define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('TrendLine', function () {
        var $svg;
        var chart;
        var dataSeries;

        var data = [{x_value: 0, y_value: 10},{x_value: 1, y_value: 16},{x_value: 2, y_value: 11},{x_value: 3, y_value: 12},{x_value: 4, y_value: 19},{x_value: 5, y_value: 20},{x_value: 6, y_value: 13},{x_value: 7, y_value: 15},{x_value: 8, y_value: 18},{x_value: 9, y_value: 25},{x_value: 10, y_value: 27},{x_value: 11, y_value: 26},{x_value: 12, y_value: 30},{x_value: 13, y_value: 25}];



        beforeEach(function() {
            $svg = $(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
            $svg.attr('id', 'container').appendTo('body');

            chart = new Nugget.Chart({
                width: 300,
                height: 300
            });
            dataSeries = new Nugget.NumericalDataSeries(data);
        });

        afterEach(function() {
            $('#container').remove();
            chart = null;
        });

        it('should render a positive trendline', function() {

            var trendline = new Nugget.TrendLine({
                dataSeries: dataSeries,
                color: 'blue',
                slope: 1,
                origin: { x: 0, y: 0 }
            });

            chart.add(trendline);

            chart.appendTo('#container');

            var $renderedLine = $('.slope');

            expect($renderedLine).toBeDefined();

            var x1 = $renderedLine.attr('x1');
            var x2 = $renderedLine.attr('x2');
            var y1 = $renderedLine.attr('y1');
            var y2 = $renderedLine.attr('y2');

            expect(parseInt(x1, 0)).toBe(100);
            expect(parseInt(x2, 0)).toBe(290);
            expect(parseInt(y1, 0)).toBe(364);
            expect(parseInt(y2, 0)).toBe(198);
        });
        it('should render a flat trendline', function() {
            var trendline = new Nugget.TrendLine({
                dataSeries: dataSeries,
                color: 'purple',
                slope: 0,
                origin: { x: 0, y: 0 }
            });

            chart.add(trendline);
            chart.appendTo('#container');

            var $renderedLine = $('.slope');

            var x1 = $renderedLine.attr('x1');
            var x2 = $renderedLine.attr('x2');
            var y1 = $renderedLine.attr('y1');
            var y2 = $renderedLine.attr('y2');

            expect(parseInt(x1, 0)).toBe(100);
            expect(parseInt(x2, 0)).toBe(290);
            expect(parseInt(y1, 0)).toBe(356);
            expect(parseInt(y2, 0)).toBe(356);
        });
        it('should render a negative trendline', function() {
            var trendline = new Nugget.TrendLine({
                dataSeries: dataSeries,
                color: 'brown',
                slope: -1,
                origin: { x: 0, y: 0 }
            });

            chart.add(trendline);
            chart.appendTo('#container');

            var $renderedLine = $('.slope');

            var x1 = $renderedLine.attr('x1');
            var x2 = $renderedLine.attr('x2');
            var y1 = $renderedLine.attr('y1');
            var y2 = $renderedLine.attr('y2');

            expect(parseInt(x1, 0)).toBe(100);
            expect(parseInt(x2, 0)).toBe(290);
            expect(parseInt(y1, 0)).toBe(348);
            expect(parseInt(y2, 0)).toBe(514);
        });
    });
});
