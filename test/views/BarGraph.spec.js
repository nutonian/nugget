define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('Bar Graph Plot Tests', function () {

        var data = [{x: 'A', y: 2}, {x: 'B', y: 15}, {x: 'C', y: 8}, {x: 'D', y: 6}, {x: 'E', y: 20}, {x: 'F', y: 16}];

        var svg = document.createElement('svg');
        svg.setAttribute('id', 'foo');

        beforeEach(function() {
            document.body.insertBefore(svg, document.body.firstChild);
        });

        afterEach(function() {
            svg.parentElement.removeChild(svg);

        });

        it('should render bar graphs', function() {
            var dataSeries = new Nugget.OrdinalDataSeries(data);

            var chart = new Nugget.Chart();

            var bars = new Nugget.BarGraph({
                dataSeries: dataSeries,
                color: '#09e'
            });

            chart.add(bars);
            chart.appendTo('#foo');

            var renderedBars = document.querySelectorAll('.bar');

            expect(renderedBars.length).toBe(data.length);
        });
    });
});