define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('Scatter Plot Tests', function () {
        var data = [{x:0, y:10},{x:1, y:16},{x:2, y:11},{x:3, y:12},{x:4, y:19},{x:5, y:20},{x:6, y:13},{x:7, y:15},{x:8, y:18},{x:9, y:25},{x:10, y:27},{x:11, y:26},{x:12, y:30},{x:13, y:25}];

        var svg = document.createElement('svg');
        svg.setAttribute('id', 'foo');

        beforeEach(function() {
            document.body.insertBefore(svg, document.body.firstChild);
        });

        afterEach(function() {
            svg.parentElement.removeChild(svg);

        });

        it('should render a scatter graph', function() {
            var dataSeries = new Nugget.DataSeries(data);

            var chart = new Nugget.Chart();

            var circles = new Nugget.ScatterGraph({
                dataSeries: dataSeries,
                color: 'orange'
            });

            chart.add(circles);

            chart.appendTo('#foo');

            var renderedHtml = document.querySelectorAll('.point');

            expect(renderedHtml.length).toEqual(data.length);
        });
    });
});