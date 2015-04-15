define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('Chart Tests', function () {
        var isPhantom = window.navigator.userAgent.indexOf('PhantomJS') > -1;
        if (!isPhantom) {
            throw 'Test currently only works in PhantomJS';
        }

        var lineGraphHtml = '<svg id="foo" width="900" height="500"><clipPath id="clip1"><rect x="100" y="20" width="780" height="460"></rect></clipPath><g class="drawing_surface" clip-path="url(#clip1)"><g><path data-id="graph_3" d="M100,480L490,264.0816326530612L100,48.163265306122426" stroke-width="2" class="line_path" fill="none" stroke="green"></path></g><g><path data-id="graph_4" d="M100,48.163265306122426L490,264.0816326530612L880,480" stroke-width="2" class="line_path" fill="none" stroke="#09e"></path></g></g><text x="500" y="500" class="axis_label" style="text-anchor: middle; ">row</text><text transform="rotate(-90)" class="axis_label" y="25" x="-250">value</text><g class="x_axis" transform="translate(0,480)"><g class="tick" style="opacity: 1; " transform="translate(100,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">0</text></g><g class="tick" style="opacity: 1; " transform="translate(178,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">10</text></g><g class="tick" style="opacity: 1; " transform="translate(256,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">20</text></g><g class="tick" style="opacity: 1; " transform="translate(334,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">30</text></g><g class="tick" style="opacity: 1; " transform="translate(412,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">40</text></g><g class="tick" style="opacity: 1; " transform="translate(490,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">50</text></g><g class="tick" style="opacity: 1; " transform="translate(568,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">60</text></g><g class="tick" style="opacity: 1; " transform="translate(646,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">70</text></g><g class="tick" style="opacity: 1; " transform="translate(724,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">80</text></g><g class="tick" style="opacity: 1; " transform="translate(802,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">90</text></g><g class="tick" style="opacity: 1; " transform="translate(880,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">100</text></g><path class="domain" d="M100,0V0H880V0"></path></g><g class="y_axis" transform="translate(100, 0)"><g class="tick" style="opacity: 1; " transform="translate(0,480)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">0.000</text></g><g class="tick" style="opacity: 1; " transform="translate(0,436.8163265306123)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">10.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,393.63265306122446)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">20.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,350.44897959183675)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">30.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,307.2653061224489)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">40.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,264.0816326530612)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">50.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,220.89795918367346)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">60.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,177.71428571428572)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">70.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,134.53061224489795)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">80.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,91.34693877551018)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">90.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,48.163265306122426)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">100.0</text></g><path class="domain" d="M0,20H0V480H0"></path></g><line x1="100" x2="880" y1="20" y2="20" class="bounding_box"></line><line x1="880" x2="880" y1="20" y2="480" class="bounding_box"></line></svg>';

        var lineGraphNoOptions = '<svg id="foo" width="384" height="90"><clipPath id="clip1"><rect x="100" y="20" width="780" height="460"></rect></clipPath><g class="drawing_surface" clip-path="url(#clip1)"><g><path data-id="graph_3" d="M100,40L237,31.11111111111111L100,22.22222222222222" stroke-width="2" class="line_path" fill="none" stroke="green"></path></g><g><path data-id="graph_4" d="M100,22.22222222222222L237,31.11111111111111L374,40" stroke-width="2" class="line_path" fill="none" stroke="#09e"></path></g></g><text x="500" y="500" class="axis_label" style="text-anchor: middle; ">row</text><text transform="rotate(-90)" class="axis_label" y="25" x="-250">value</text><g class="x_axis" transform="translate(0,480)"><g class="tick" style="opacity: 1; " transform="translate(100,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">0</text></g><g class="tick" style="opacity: 1; " transform="translate(178,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">10</text></g><g class="tick" style="opacity: 1; " transform="translate(256,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">20</text></g><g class="tick" style="opacity: 1; " transform="translate(334,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">30</text></g><g class="tick" style="opacity: 1; " transform="translate(412,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">40</text></g><g class="tick" style="opacity: 1; " transform="translate(490,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">50</text></g><g class="tick" style="opacity: 1; " transform="translate(568,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">60</text></g><g class="tick" style="opacity: 1; " transform="translate(646,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">70</text></g><g class="tick" style="opacity: 1; " transform="translate(724,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">80</text></g><g class="tick" style="opacity: 1; " transform="translate(802,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">90</text></g><g class="tick" style="opacity: 1; " transform="translate(880,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">100</text></g><path class="domain" d="M100,0V0H880V0"></path></g><g class="y_axis" transform="translate(100, 0)"><g class="tick" style="opacity: 1; " transform="translate(0,480)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">0.000</text></g><g class="tick" style="opacity: 1; " transform="translate(0,436.8163265306123)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">10.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,393.63265306122446)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">20.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,350.44897959183675)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">30.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,307.2653061224489)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">40.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,264.0816326530612)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">50.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,220.89795918367346)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">60.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,177.71428571428572)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">70.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,134.53061224489795)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">80.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,91.34693877551018)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">90.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,48.163265306122426)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">100.0</text></g><path class="domain" d="M0,20H0V480H0"></path></g><line x1="100" x2="880" y1="20" y2="20" class="bounding_box"></line><line x1="880" x2="880" y1="20" y2="480" class="bounding_box"></line><clipPath id="clip1"><rect x="100" y="0" width="274" height="40"></rect></clipPath><g class="drawing_surface" clip-path="url(#clip1)"></g><text x="242" y="90" class="axis_label" style="text-anchor: middle; ">number of beers</text><text transform="rotate(-90)" class="axis_label" y="25" x="-45">how good i look</text><g class="x_axis" transform="translate(0,40)"><g class="tick" style="opacity: 1; " transform="translate(100,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">0</text></g><g class="tick" style="opacity: 1; " transform="translate(127.4,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">10</text></g><g class="tick" style="opacity: 1; " transform="translate(154.8,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">20</text></g><g class="tick" style="opacity: 1; " transform="translate(182.2,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">30</text></g><g class="tick" style="opacity: 1; " transform="translate(209.6,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">40</text></g><g class="tick" style="opacity: 1; " transform="translate(237,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">50</text></g><g class="tick" style="opacity: 1; " transform="translate(264.4,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">60</text></g><g class="tick" style="opacity: 1; " transform="translate(291.8,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">70</text></g><g class="tick" style="opacity: 1; " transform="translate(319.2,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">80</text></g><g class="tick" style="opacity: 1; " transform="translate(346.6,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">90</text></g><g class="tick" style="opacity: 1; " transform="translate(374,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">100</text></g><path class="domain" d="M100,0V0H374V0"></path></g><g class="y_axis" transform="translate(100, 0)"><g class="tick" style="opacity: 1; " transform="translate(0,40)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">0.000</text></g><g class="tick" style="opacity: 1; " transform="translate(0,36.44444444444444)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">20.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,32.888888888888886)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">40.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,29.333333333333336)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">60.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,25.777777777777775)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">80.00</text></g><g class="tick" style="opacity: 1; " transform="translate(0,22.22222222222222)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">100.0</text></g><g class="tick" style="opacity: 1; " transform="translate(0,18.666666666666668)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">120.0</text></g><g class="tick" style="opacity: 1; " transform="translate(0,15.11111111111111)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">140.0</text></g><g class="tick" style="opacity: 1; " transform="translate(0,11.555555555555554)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">160.0</text></g><g class="tick" style="opacity: 1; " transform="translate(0,7.999999999999998)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">180.0</text></g><g class="tick" style="opacity: 1; " transform="translate(0,4.444444444444446)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">200.0</text></g><g class="tick" style="opacity: 1; " transform="translate(0,0.8888888888888902)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">220.0</text></g><path class="domain" d="M0,0H0V40H0"></path></g><line x1="100" x2="374" y1="0" y2="0" class="bounding_box"></line><line x1="374" x2="374" y1="0" y2="40" class="bounding_box"></line></svg>';

        var lineGraphData1 = [ { "x": 0, "y": 0 }  , { "x": 50, "y": 50 }, { "x": 0, "y": 100 } ];
        var lineGraphData2 = [ { "x": 0, "y": 100 }, { "x": 50, "y": 50 }, { "x": 100, "y": 0 } ];

        var dataSeries1 = new Nugget.NumericalDataSeries(lineGraphData1);
        var dataSeries2 = new Nugget.NumericalDataSeries(lineGraphData2);

        var line = new Nugget.LineGraph({
            dataSeries: dataSeries1,
            color: 'green'
        });

        var line2 = new Nugget.LineGraph({
            dataSeries: dataSeries2,
            color: '#09e'
        });

        var svg = document.createElement('svg');
        svg.setAttribute('id', 'foo');

        beforeEach(function() {
            Nugget.Utils.idCounter = 0;
            document.body.insertBefore(svg, document.body.firstChild);
        });

        afterEach(function() {
            svg.parentElement.removeChild(svg);

        });

        it('should render a LineGraph with options', function () {

            var chart = new Nugget.Chart({
                width: 900,
                height: 500,
                margins: {
                    top: 20,
                    bottom: 20,
                    left: 100,
                    right: 20
                },
                axisLabels: {
                    x: 'row',
                    y: 'value'
                }
            });

            chart.add(line);
            chart.add(line2);

            chart.appendTo('#foo');

            var renderedHtml = document.querySelectorAll('#foo')[0];
            expect(renderedHtml.outerHTML).toBe(lineGraphHtml);
        });

        it('should render a lineGraph without options', function() {

            var chart = new Nugget.Chart({
                axisLabels: {
                    x: 'number of beers',
                    y: 'how good i look'
                }
            });

            chart.add(line);
            chart.add(line2);

            chart.appendTo('#foo');
            var renderedHtml = document.querySelectorAll('#foo')[0];

            expect(renderedHtml.outerHTML).toBe(lineGraphNoOptions);
        });

        it('should reuse it\'s d3Svg on subsequent appendTo calls', function() {
            var chart = new Nugget.Chart();
            chart.add(line);
            expect(chart._d3Svg).toBeFalsy();

            chart.appendTo('#foo');
            var d3Svg = chart._d3Svg;

            chart.appendTo('#foo');
            expect(d3Svg).toBe(chart._d3Svg);
        });

        it('should remove a child element and then reset itself', function() {
            var chart = new Nugget.Chart({
                width: 900,
                height: 500,
                margins: {
                    top: 20,
                    bottom: 20,
                    left: 100,
                    right: 20
                },
                axisLabels: {
                    x: 'row',
                    y: 'value'
                }
            });

            var line1 = new Nugget.LineGraph({
                dataSeries: dataSeries1,
                color: 'green'
            });
            var line2 = new Nugget.LineGraph({
                dataSeries: dataSeries2,
                color: '#09e'
            });
            chart.add(line1);
            chart.add(line2);

            chart.appendTo('#foo');

            var renderedHtml = document.querySelectorAll('.drawing_surface')[0];

            var paths = renderedHtml.getElementsByTagName('path');

            var elementMap = chart._childElementMap.size;
            expect(elementMap).toBe(2);

            expect(paths.length).toBe(2);

            chart.remove(line1);

            var newMap = chart._childElementMap.size;

            expect(newMap).toBe(1);

            expect(line1.path).toBeUndefined();

        });
    });
});
