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
                x: '0',
                y_min: 1,
                y_25pct: 25,
                y_50pct: 50,
                y_75pct: 75,
                y_max: 99
            },
            {
                x: '1',
                y_min: 10,
                y_25pct: 30,
                y_50pct: 50,
                y_75pct: 70,
                y_max: 90
            }
        ];

        var svg = document.createElement('svg');
        svg.setAttribute('id', 'foo');

        beforeEach(function() {
            document.body.insertBefore(svg, document.body.firstChild);
        });

        afterEach(function() {
            svg.parentElement.removeChild(svg);

        });

        it('should render a box plot', function() {
            var dataSeries = new Nugget.BoxPlotDataSeries(data);

            var chart = new Nugget.Chart();

            var boxes = new Nugget.BoxPlot({
                dataSeries: dataSeries,
                color: '#09e'
            });

            chart.add(boxes);

            chart.appendTo('#foo');

            var renderedHtml = document.querySelectorAll('.box_plot');

            expect(renderedHtml.length).toBe(data.length);
        });
    });
});