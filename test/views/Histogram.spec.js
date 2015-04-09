define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('Histogram Plot Tests', function () {
        var data = [{x_low: 1, x_high: 3, y: 20}, {x_low: 3, x_high: 4, y: 10}, {x_low: 4, x_high: 9, y: 30}];

        var svg = document.createElement('svg');
        svg.setAttribute('id', 'foo');

        beforeEach(function() {
            document.body.insertBefore(svg, document.body.firstChild);
        });

        afterEach(function() {
            svg.parentElement.removeChild(svg);

        });
        it('should render a histogram', function() {
            var dataseries = new Nugget.RangeSeries(data);

            var chart = new Nugget.Chart();
            var bars = new Nugget.Histogram({
                dataSeries: dataseries,
                color: 'green'
            });

            chart.add(bars);

            chart.appendTo('#foo');

            var renderedHtml = document.querySelectorAll('.bar');

            expect(renderedHtml.length).toBe(data.length);
        });
    });
});