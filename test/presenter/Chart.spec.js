define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('Chart Tests', function () {
        var userAgent = window.navigator.userAgent;
        var isPhantom = userAgent.indexOf('PhantomJS') > -1;

        // Fixtures
        var lineGraphHtml;
        if (isPhantom) {
            lineGraphHtml = '<svg id="foo" width="900" height="500"><g class="x_axis" transform="translate(0,480)"><g class="tick" style="opacity: 1; " transform="translate(100,0)"><line y2="5" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="8" x="0">0</text></g><g class="tick" style="opacity: 1; " transform="translate(178,0)"><line y2="5" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="8" x="0">10</text></g><g class="tick" style="opacity: 1; " transform="translate(256,0)"><line y2="5" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="8" x="0">20</text></g><g class="tick" style="opacity: 1; " transform="translate(334,0)"><line y2="5" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="8" x="0">30</text></g><g class="tick" style="opacity: 1; " transform="translate(412,0)"><line y2="5" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="8" x="0">40</text></g><g class="tick" style="opacity: 1; " transform="translate(490,0)"><line y2="5" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="8" x="0">50</text></g><g class="tick" style="opacity: 1; " transform="translate(568,0)"><line y2="5" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="8" x="0">60</text></g><g class="tick" style="opacity: 1; " transform="translate(646,0)"><line y2="5" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="8" x="0">70</text></g><g class="tick" style="opacity: 1; " transform="translate(724,0)"><line y2="5" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="8" x="0">80</text></g><g class="tick" style="opacity: 1; " transform="translate(802,0)"><line y2="5" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="8" x="0">90</text></g><g class="tick" style="opacity: 1; " transform="translate(880,0)"><line y2="5" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="8" x="0">100</text></g><path class="domain" d="M100,5V0H880V5"></path></g><g class="y_axis" transform="translate(100, 0)"><g class="tick" style="opacity: 1; " transform="translate(0,480)"><line x2="-5" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-8" y="0">0</text></g><g class="tick" style="opacity: 1; " transform="translate(0,434)"><line x2="-5" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-8" y="0">10</text></g><g class="tick" style="opacity: 1; " transform="translate(0,388)"><line x2="-5" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-8" y="0">20</text></g><g class="tick" style="opacity: 1; " transform="translate(0,342)"><line x2="-5" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-8" y="0">30</text></g><g class="tick" style="opacity: 1; " transform="translate(0,296)"><line x2="-5" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-8" y="0">40</text></g><g class="tick" style="opacity: 1; " transform="translate(0,250)"><line x2="-5" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-8" y="0">50</text></g><g class="tick" style="opacity: 1; " transform="translate(0,204)"><line x2="-5" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-8" y="0">60</text></g><g class="tick" style="opacity: 1; " transform="translate(0,158.00000000000003)"><line x2="-5" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-8" y="0">70</text></g><g class="tick" style="opacity: 1; " transform="translate(0,111.99999999999997)"><line x2="-5" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-8" y="0">80</text></g><g class="tick" style="opacity: 1; " transform="translate(0,65.99999999999999)"><line x2="-5" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-8" y="0">90</text></g><g class="tick" style="opacity: 1; " transform="translate(0,20)"><line x2="-5" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-8" y="0">100</text></g><path class="domain" d="M-5,20H0V480H-5"></path></g><g><path id="graph_1" d="M100,480L490,250L100,20" stroke-width="2" fill="none" stroke="green"></path></g><g><path id="graph_2" d="M100,20L490,250L880,480" stroke-width="2" fill="none" stroke="#09e"></path></g></svg>';
        } else {
            lineGraphHtml = '<svg id="foo" width="900" height="500"><g class="x_axis" transform="translate(0,480)"><g class="tick" transform="translate(100,0)" style="opacity: 1;"><line y2="5" x2="0"></line><text dy=".71em" y="8" x="0" style="text-anchor: middle;">0</text></g><g class="tick" transform="translate(178,0)" style="opacity: 1;"><line y2="5" x2="0"></line><text dy=".71em" y="8" x="0" style="text-anchor: middle;">10</text></g><g class="tick" transform="translate(256,0)" style="opacity: 1;"><line y2="5" x2="0"></line><text dy=".71em" y="8" x="0" style="text-anchor: middle;">20</text></g><g class="tick" transform="translate(334,0)" style="opacity: 1;"><line y2="5" x2="0"></line><text dy=".71em" y="8" x="0" style="text-anchor: middle;">30</text></g><g class="tick" transform="translate(412,0)" style="opacity: 1;"><line y2="5" x2="0"></line><text dy=".71em" y="8" x="0" style="text-anchor: middle;">40</text></g><g class="tick" transform="translate(490,0)" style="opacity: 1;"><line y2="5" x2="0"></line><text dy=".71em" y="8" x="0" style="text-anchor: middle;">50</text></g><g class="tick" transform="translate(568,0)" style="opacity: 1;"><line y2="5" x2="0"></line><text dy=".71em" y="8" x="0" style="text-anchor: middle;">60</text></g><g class="tick" transform="translate(646,0)" style="opacity: 1;"><line y2="5" x2="0"></line><text dy=".71em" y="8" x="0" style="text-anchor: middle;">70</text></g><g class="tick" transform="translate(724,0)" style="opacity: 1;"><line y2="5" x2="0"></line><text dy=".71em" y="8" x="0" style="text-anchor: middle;">80</text></g><g class="tick" transform="translate(802,0)" style="opacity: 1;"><line y2="5" x2="0"></line><text dy=".71em" y="8" x="0" style="text-anchor: middle;">90</text></g><g class="tick" transform="translate(880,0)" style="opacity: 1;"><line y2="5" x2="0"></line><text dy=".71em" y="8" x="0" style="text-anchor: middle;">100</text></g><path class="domain" d="M100,5V0H880V5"></path></g><g class="y_axis" transform="translate(100, 0)"><g class="tick" transform="translate(0,480)" style="opacity: 1;"><line x2="-5" y2="0"></line><text dy=".32em" x="-8" y="0" style="text-anchor: end;">0</text></g><g class="tick" transform="translate(0,434)" style="opacity: 1;"><line x2="-5" y2="0"></line><text dy=".32em" x="-8" y="0" style="text-anchor: end;">10</text></g><g class="tick" transform="translate(0,388)" style="opacity: 1;"><line x2="-5" y2="0"></line><text dy=".32em" x="-8" y="0" style="text-anchor: end;">20</text></g><g class="tick" transform="translate(0,342)" style="opacity: 1;"><line x2="-5" y2="0"></line><text dy=".32em" x="-8" y="0" style="text-anchor: end;">30</text></g><g class="tick" transform="translate(0,296)" style="opacity: 1;"><line x2="-5" y2="0"></line><text dy=".32em" x="-8" y="0" style="text-anchor: end;">40</text></g><g class="tick" transform="translate(0,250)" style="opacity: 1;"><line x2="-5" y2="0"></line><text dy=".32em" x="-8" y="0" style="text-anchor: end;">50</text></g><g class="tick" transform="translate(0,204)" style="opacity: 1;"><line x2="-5" y2="0"></line><text dy=".32em" x="-8" y="0" style="text-anchor: end;">60</text></g><g class="tick" transform="translate(0,158.00000000000003)" style="opacity: 1;"><line x2="-5" y2="0"></line><text dy=".32em" x="-8" y="0" style="text-anchor: end;">70</text></g><g class="tick" transform="translate(0,111.99999999999997)" style="opacity: 1;"><line x2="-5" y2="0"></line><text dy=".32em" x="-8" y="0" style="text-anchor: end;">80</text></g><g class="tick" transform="translate(0,65.99999999999999)" style="opacity: 1;"><line x2="-5" y2="0"></line><text dy=".32em" x="-8" y="0" style="text-anchor: end;">90</text></g><g class="tick" transform="translate(0,20)" style="opacity: 1;"><line x2="-5" y2="0"></line><text dy=".32em" x="-8" y="0" style="text-anchor: end;">100</text></g><path class="domain" d="M-5,20H0V480H-5"></path></g><g><path id="graph_1" d="M100,480L490,250L100,20" stroke-width="2" fill="none" stroke="green"></path></g><g><path id="graph_2" d="M100,20L490,250L880,480" stroke-width="2" fill="none" stroke="#09e"></path></g></svg>';
        }
        var lineGraphData1 = [ { "x": 0, "y": 0 }  , { "x": 50, "y": 50 }, { "x": 0, "y": 100 } ];
        var lineGraphData2 = [ { "x": 0, "y": 100 }, { "x": 50, "y": 50 }, { "x": 100, "y": 0 } ];

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
