define(['../../test/helpers/text'], function(text) {
    define([
        'Nugget',
        '../../dependencies/d3',
        'text!../fixtures/LineGraph.html',
        'text!../fixtures/LineGraphData1.json',
        'text!../fixtures/LineGraphData2.json'
    ], function (Nugget,
                 d3,
                 lineGraphHtml,
                 lineGraphData1,
                 lineGraphData2) {
        describe('Chart Tests', function () {
            it('should render a LineGraph', function () {
                var svg = document.createElement('svg');
                svg.setAttribute('id', 'foo');
                svg.setAttribute('width', 900);
                svg.setAttribute('height', 500);

                document.body.insertBefore(svg, document.body.firstChild);

                var lineData1 = JSON.parse(lineGraphData1);
                var lineData2 = JSON.parse(lineGraphData2);

                var dataSeries1 = new Nugget.DataSeries(lineData1);
                var dataSeries2 = new Nugget.DataSeries(lineData2);

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
});
