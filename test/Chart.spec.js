define([
    'Nugget',
    '../../dependencies/d3',
    './helpers/jquery.min.js'
],
function (
    Nugget,
    d3
) {
    describe('Chart Tests', function () {
        var lineGraphHtml;
        var lineGraphData1;
        var lineGraphData2;

        beforeEach(function(done) {
            $.when(
                $.ajax('/test/fixtures/LineGraph.html'),
                $.ajax('/test/fixtures/LineGraphData1.json'),
                $.ajax('/test/fixtures/LineGraphData2.json')
            ).done(function(graph, data1, data2) {
                lineGraphHtml  = graph[0].trim();
                lineGraphData1 = data1[0];
                lineGraphData2 = data2[0];
                done();
            });
        });

        it('should render a LineGraph', function () {
            var svg = document.createElement('svg');
            svg.setAttribute('id', 'foo');
            svg.setAttribute('width', 900);
            svg.setAttribute('height', 500);

            document.body.insertBefore(svg, document.body.firstChild);

            var dataSeries1 = new Nugget.DataSeries(lineGraphData1);
            var dataSeries2 = new Nugget.DataSeries(lineGraphData2);

            var chart = new Nugget.Chart({
                width: 900,
                height: 500,
                margins: {
                    top: 20,
                    bottom: 20,
                    left: 100,
                    right: 20
                }
            });

            var line = new Nugget.LineGraph({
                dataSeries: dataSeries1,
                color: 'green'
            });

            var line2 = new Nugget.LineGraph({
                dataSeries: dataSeries2,
                color: '#09e'
            });

            chart.add(line);
            chart.add(line2);

            chart.appendTo('#foo');

            var renderedHtml = document.querySelectorAll('#foo')[0];
            expect(renderedHtml.outerHTML).toBe(lineGraphHtml);

            svg.parentElement.removeChild(svg);
        });

    });
});
