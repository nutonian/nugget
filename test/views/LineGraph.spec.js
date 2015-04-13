define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('Line Graph Tests', function () {
        var data = [{x:0, y:10},{x:1, y:16},{x:2, y:11},{x:3, y:12},{x:4, y:19},{x:5, y:20},{x:6, y:13},{x:7, y:15},{x:8, y:18},{x:9, y:25},{x:10, y:27},{x:11, y:26},{x:12, y:30},{x:13, y:25}];

        var graphPoints = 'M100,30L121.07692307692308,26.625L142.15384615384616,29.4375L163.23076923076923,28.875L184.30769230769232,24.9375L205.38461538461542,24.375L226.46153846153845,28.3125L247.53846153846155,27.1875L268.61538461538464,25.5L289.6923076923077,21.5625L310.76923076923083,20.4375L331.8461538461538,21L352.9230769230769,18.75L374,21.5625';
        var svg = document.createElement('svg');
        svg.setAttribute('id', 'foo');

        beforeEach(function() {
            document.body.insertBefore(svg, document.body.firstChild);
        });

        afterEach(function() {
            svg.parentElement.removeChild(svg);
        });
        it('should render a line graph', function() {
            var dataseries = new Nugget.DataSeries(data);

            var chart = new Nugget.Chart();

            var line = new Nugget.LineGraph({
                dataSeries: dataseries,
                color: 'purple'
            });

            chart.add(line);

            chart.appendTo('#foo');

            var renderedHtml = document.querySelectorAll('.line_path');

            var path = renderedHtml[0];

            var points = path.getAttribute('d');

            expect(renderedHtml.length).toBe(1);

            expect(points).toBe(graphPoints);
        });
    });
});