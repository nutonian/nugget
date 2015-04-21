define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('Trend Line Tests', function () {
        var data = [{x:0, y:10},{x:1, y:16},{x:2, y:11},{x:3, y:12},{x:4, y:19},{x:5, y:20},{x:6, y:13},{x:7, y:15},{x:8, y:18},{x:9, y:25},{x:10, y:27},{x:11, y:26},{x:12, y:30},{x:13, y:25}];

        var svg = document.createElement('svg');
        svg.setAttribute('id', 'foo');

        beforeEach(function() {
            document.body.insertBefore(svg, document.body.firstChild);
        });

        afterEach(function() {
            svg.parentElement.removeChild(svg);
        });

        it('should render a trendline', function() {
            var dataSeries = new Nugget.NumericalDataSeries(data);

            var chart = new Nugget.Chart();

            var trendline = new Nugget.TrendLine({
                dataSeries: dataSeries,
                color: 'blue',
                slope: 0.87
            });

            chart.add(trendline);

            chart.appendTo('#foo');

            var renderedLine = document.querySelectorAll('.slope')[0];

            expect(renderedLine).toBeDefined();

            var x1 = renderedLine.getAttribute('x1');
            var x2 = renderedLine.getAttribute('x2');
            var y1 = renderedLine.getAttribute('y1');
            var y2 = renderedLine.getAttribute('y2');

            expect(parseInt(x1, 0)).toBeDefined();
            expect(parseInt(x2, 0)).toBeDefined();
            expect(parseInt(y1, 0)).toBeDefined();
            expect(parseInt(y2, 0)).toBeDefined();
        });
    });
});