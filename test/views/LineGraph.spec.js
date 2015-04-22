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

        var isPhantom = window.navigator.userAgent.indexOf('PhantomJS') > -1;

        if (!isPhantom) {
            return console.warn('Test currently only works in PhantomJS');
        }

        var graphPoints = 'M100,40.14035087719298L121.07692307692308,35.04561403508772L142.15384615384616,39.291228070175436L163.23076923076923,38.44210526315789L184.30769230769232,32.498245614035085L205.38461538461542,31.649122807017545L226.46153846153845,37.59298245614035L247.53846153846155,35.89473684210526L268.61538461538464,33.347368421052636L289.6923076923077,27.403508771929822L310.76923076923083,25.705263157894738L331.8461538461538,26.55438596491228L352.9230769230769,23.157894736842103L374,27.403508771929822';

        var svg = document.createElement('svg');
        svg.setAttribute('id', 'foo');

        beforeEach(function() {
            document.body.insertBefore(svg, document.body.firstChild);
        });

        afterEach(function() {
            svg.parentElement.removeChild(svg);
        });
        it('should render a line graph', function() {
            var dataseries = new Nugget.NumericalDataSeries(data);

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
