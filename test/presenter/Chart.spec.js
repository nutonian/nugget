/* global Utils: false */
define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('Chart tests', function() {
        var lineGraphData1 = [ { "x_value": 0, "y_value": 0 }  , { "x_value": 50, "y_value": 50 }, { "x_value": 0, "y_value": 100 } ];
        var lineGraphData2 = [ { "x_value": 0, "y_value": 100 }, { "x_value": 50, "y_value": 50 }, { "x_value": 100, "y_value": 0 } ];

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

        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('id', 'container');

        var isPhantom = window.navigator.userAgent.indexOf('PhantomJS') > -1;

        beforeEach(function() {
            Nugget.Utils.idCounter = 0;
            document.body.insertBefore(svg, document.body.firstChild);
        });

        afterEach(function() {
            svg.parentElement.removeChild(svg);
        });

        describe('PhantomJS Chart Tests', function () {
            if (!isPhantom) {
                return console.warn('Test currently only works in PhantomJS');
            }

            var lineGraphHtml = '<svg id="container" width="900" height="500"><g class="x_axis" transform="translate(0,480)"><g class="tick" style="opacity: 1; " transform="translate(109.75,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">0</text></g><g class="tick" style="opacity: 1; " transform="translate(185.8,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">10</text></g><g class="tick" style="opacity: 1; " transform="translate(261.85,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">20</text></g><g class="tick" style="opacity: 1; " transform="translate(337.9,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">30</text></g><g class="tick" style="opacity: 1; " transform="translate(413.95000000000005,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">40</text></g><g class="tick" style="opacity: 1; " transform="translate(490.0000000000001,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">50</text></g><g class="tick" style="opacity: 1; " transform="translate(566.0500000000001,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">60</text></g><g class="tick" style="opacity: 1; " transform="translate(642.1,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">70</text></g><g class="tick" style="opacity: 1; " transform="translate(718.1500000000001,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">80</text></g><g class="tick" style="opacity: 1; " transform="translate(794.2000000000002,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">90</text></g><g class="tick" style="opacity: 1; " transform="translate(870.2500000000001,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">100</text></g><path class="domain" d="M100,0V0H880V0"></path></g><g class="y_axis" transform="translate(100, 0)"><g class="tick" style="opacity: 1; " transform="translate(0,471.3207547169811)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">0</text></g><g class="tick" style="opacity: 1; " transform="translate(0,431.3962264150943)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">10</text></g><g class="tick" style="opacity: 1; " transform="translate(0,391.4716981132076)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">20</text></g><g class="tick" style="opacity: 1; " transform="translate(0,351.54716981132077)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">30</text></g><g class="tick" style="opacity: 1; " transform="translate(0,311.622641509434)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">40</text></g><g class="tick" style="opacity: 1; " transform="translate(0,271.69811320754724)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">50</text></g><g class="tick" style="opacity: 1; " transform="translate(0,231.77358490566036)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">60</text></g><g class="tick" style="opacity: 1; " transform="translate(0,191.84905660377356)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">70</text></g><g class="tick" style="opacity: 1; " transform="translate(0,151.92452830188677)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">80</text></g><g class="tick" style="opacity: 1; " transform="translate(0,111.99999999999997)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">90</text></g><g class="tick" style="opacity: 1; " transform="translate(0,72.0754716981132)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">100</text></g><g class="tick" style="opacity: 1; " transform="translate(0,32.15094339622641)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">110</text></g><path class="domain" d="M0,20H0V480H0"></path></g><clipPath id="clip1"><rect x="100" y="20" width="780" height="460"></rect></clipPath><g class="drawing_surface" clip-path="url(#clip1)"><g data-id="graph_3"><path stroke-width="2" class="line" fill="none" stroke="green" d="M109.75,471.3207547169811L490.0000000000001,271.69811320754724L109.75,72.0754716981132"></path></g><g data-id="graph_4"><path stroke-width="2" class="line" fill="none" stroke="#09e" d="M109.75,72.0754716981132L490.0000000000001,271.69811320754724L870.2500000000001,471.3207547169811"></path></g></g><text x="500" y="495" class="axis_label" style="text-anchor: middle; ">row</text><text transform="rotate(-90)" class="axis_label" y="25" x="-250" style="text-anchor: middle; ">value</text><g class="zoom_fixture_x"></g><g class="zoom_fixture_y"></g><svg class="legend" x="110" y="30" width="760" height="30"></svg><line x1="100" x2="880" y1="20" y2="20" class="bounding_box"></line><line x1="880" x2="880" y1="20" y2="480" class="bounding_box"></line></svg>';

            var lineGraphNoOptions = '<svg id="container" width="384" height="576"><g class="x_axis" transform="translate(0,480)"><g class="tick" style="opacity: 1; " transform="translate(109.75,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">0</text></g><g class="tick" style="opacity: 1; " transform="translate(185.8,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">10</text></g><g class="tick" style="opacity: 1; " transform="translate(261.85,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">20</text></g><g class="tick" style="opacity: 1; " transform="translate(337.9,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">30</text></g><g class="tick" style="opacity: 1; " transform="translate(413.95000000000005,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">40</text></g><g class="tick" style="opacity: 1; " transform="translate(490.0000000000001,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">50</text></g><g class="tick" style="opacity: 1; " transform="translate(566.0500000000001,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">60</text></g><g class="tick" style="opacity: 1; " transform="translate(642.1,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">70</text></g><g class="tick" style="opacity: 1; " transform="translate(718.1500000000001,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">80</text></g><g class="tick" style="opacity: 1; " transform="translate(794.2000000000002,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">90</text></g><g class="tick" style="opacity: 1; " transform="translate(870.2500000000001,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">100</text></g><path class="domain" d="M100,0V0H880V0"></path></g><g class="y_axis" transform="translate(100, 0)"><g class="tick" style="opacity: 1; " transform="translate(0,471.3207547169811)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">0</text></g><g class="tick" style="opacity: 1; " transform="translate(0,431.3962264150943)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">10</text></g><g class="tick" style="opacity: 1; " transform="translate(0,391.4716981132076)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">20</text></g><g class="tick" style="opacity: 1; " transform="translate(0,351.54716981132077)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">30</text></g><g class="tick" style="opacity: 1; " transform="translate(0,311.622641509434)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">40</text></g><g class="tick" style="opacity: 1; " transform="translate(0,271.69811320754724)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">50</text></g><g class="tick" style="opacity: 1; " transform="translate(0,231.77358490566036)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">60</text></g><g class="tick" style="opacity: 1; " transform="translate(0,191.84905660377356)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">70</text></g><g class="tick" style="opacity: 1; " transform="translate(0,151.92452830188677)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">80</text></g><g class="tick" style="opacity: 1; " transform="translate(0,111.99999999999997)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">90</text></g><g class="tick" style="opacity: 1; " transform="translate(0,72.0754716981132)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">100</text></g><g class="tick" style="opacity: 1; " transform="translate(0,32.15094339622641)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">110</text></g><path class="domain" d="M0,20H0V480H0"></path></g><clipPath id="clip1"><rect x="100" y="20" width="780" height="460"></rect></clipPath><g class="drawing_surface" clip-path="url(#clip1)"><g data-id="graph_3"><path stroke-width="2" class="line" fill="none" stroke="green" d="M109.75,471.3207547169811L490.0000000000001,271.69811320754724L109.75,72.0754716981132"></path></g><g data-id="graph_4"><path stroke-width="2" class="line" fill="none" stroke="#09e" d="M109.75,72.0754716981132L490.0000000000001,271.69811320754724L870.2500000000001,471.3207547169811"></path></g></g><text x="500" y="495" class="axis_label" style="text-anchor: middle; ">row</text><text transform="rotate(-90)" class="axis_label" y="25" x="-250" style="text-anchor: middle; ">value</text><g class="zoom_fixture_x"></g><g class="zoom_fixture_y"></g><svg class="legend" x="110" y="30" width="760" height="30"></svg><line x1="100" x2="880" y1="20" y2="20" class="bounding_box"></line><line x1="880" x2="880" y1="20" y2="480" class="bounding_box"></line><g class="x_axis" transform="translate(0,526)"><g class="tick" style="opacity: 1; " transform="translate(109.31972789115645,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">0</text></g><g class="tick" style="opacity: 1; " transform="translate(134.85578231292516,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">10</text></g><g class="tick" style="opacity: 1; " transform="translate(160.39183673469387,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">20</text></g><g class="tick" style="opacity: 1; " transform="translate(185.92789115646258,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">30</text></g><g class="tick" style="opacity: 1; " transform="translate(211.46394557823126,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">40</text></g><g class="tick" style="opacity: 1; " transform="translate(236.99999999999997,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">50</text></g><g class="tick" style="opacity: 1; " transform="translate(262.5360544217687,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">60</text></g><g class="tick" style="opacity: 1; " transform="translate(288.0721088435374,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">70</text></g><g class="tick" style="opacity: 1; " transform="translate(313.6081632653061,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">80</text></g><g class="tick" style="opacity: 1; " transform="translate(339.1442176870748,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">90</text></g><g class="tick" style="opacity: 1; " transform="translate(364.6802721088435,0)"><line y2="-7" x2="0"></line><text dy=".71em" style="text-anchor: middle; " y="7" x="0">100</text></g><path class="domain" d="M100,0V0H374V0"></path></g><g class="y_axis" transform="translate(100, 0)"><g class="tick" style="opacity: 1; " transform="translate(0,517.1744966442952)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">0</text></g><g class="tick" style="opacity: 1; " transform="translate(0,470.7523489932886)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">10</text></g><g class="tick" style="opacity: 1; " transform="translate(0,424.3302013422819)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">20</text></g><g class="tick" style="opacity: 1; " transform="translate(0,377.9080536912752)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">30</text></g><g class="tick" style="opacity: 1; " transform="translate(0,331.4859060402685)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">40</text></g><g class="tick" style="opacity: 1; " transform="translate(0,285.06375838926175)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">50</text></g><g class="tick" style="opacity: 1; " transform="translate(0,238.64161073825505)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">60</text></g><g class="tick" style="opacity: 1; " transform="translate(0,192.21946308724833)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">70</text></g><g class="tick" style="opacity: 1; " transform="translate(0,145.79731543624166)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">80</text></g><g class="tick" style="opacity: 1; " transform="translate(0,99.37516778523495)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">90</text></g><g class="tick" style="opacity: 1; " transform="translate(0,52.953020134228225)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">100</text></g><g class="tick" style="opacity: 1; " transform="translate(0,6.530872483221564)"><line x2="7" y2="0"></line><text dy=".32em" style="text-anchor: end; " x="-7" y="0">110</text></g><path class="domain" d="M0,0H0V526H0"></path></g><clipPath id="clip1"><rect x="100" y="0" width="274" height="526"></rect></clipPath><g class="drawing_surface" clip-path="url(#clip1)"><g data-id="graph_4"><path stroke-width="2" class="line" fill="none" stroke="#09e" d="M109.31972789115645,52.953020134228225L236.99999999999997,285.06375838926175L364.6802721088435,517.1744966442952"></path></g><g data-id="graph_3"><path stroke-width="2" class="line" fill="none" stroke="green" d="M109.31972789115645,517.1744966442952L236.99999999999997,285.06375838926175L109.31972789115645,52.953020134228225"></path></g></g><text x="242" y="563.5" class="axis_label" style="text-anchor: middle; ">number of beers</text><text transform="rotate(-90)" class="axis_label" y="25" x="-288" style="text-anchor: middle; ">how good i look</text><g class="zoom_fixture_x"></g><g class="zoom_fixture_y"></g><svg class="legend" x="110" y="10" width="254" height="30"></svg><line x1="100" x2="374" y1="0" y2="0" class="bounding_box"></line><line x1="374" x2="374" y1="0" y2="526" class="bounding_box"></line></svg>';

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

                chart.appendTo('#container');

                var svg = document.querySelectorAll('#container')[0];
                expect(svg.outerHTML).toBe(lineGraphHtml);
            });

            it('should render a lineGraph without options', function() {

                var chart = new Nugget.Chart({
                    axisLabels: {
                        x: 'number of beers',
                        y: 'how good i look'
                    }
                });

                chart.add(line2);
                chart.add(line);

                chart.appendTo('#container');

                var svg = document.querySelectorAll('#container')[0];
                expect(svg.outerHTML).toBe(lineGraphNoOptions);
            });

            it('should reuse it\'s d3Svg on subsequent appendTo calls', function() {
                var chart = new Nugget.Chart();
                chart.add(line);
                expect(chart._d3Svg).toBeFalsy();

                chart.appendTo('#container');
                var d3Svg = chart._d3Svg;

                chart.appendTo('#container');
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
                chart.appendTo('#container');

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

        describe('Non-Phantom Chart tests', function() {
            if (isPhantom) {
                return console.warn('Test currently only works in browser');
            }

            it('should draw dotted grid lines', function() {
                var width = 900;
                var height = 500;
                var chart = new Nugget.Chart({
                    width: width,
                    height: height,
                    xGrid: true,
                    yGrid: true
                });
                chart.add(line);
                chart.appendTo('#container');

                var xAxisTick = document.querySelectorAll('#container .x_axis .tick line')[0];
                var yAxisTick = document.querySelectorAll('#container .y_axis .tick line')[0];

                expect(xAxisTick.attributes['stroke-dasharray'].value).toBe('1,2');
                expect(xAxisTick.attributes['y2'].value).toBe(-height+'');

                expect(yAxisTick.attributes['stroke-dasharray'].value).toBe('1,2');
                expect(yAxisTick.attributes['x2'].value).toBe((width - (chart.margins.left + chart.margins.right)) +'');
            });

            it('should render x/y guides at the mouse position', function() {
                var chart = new Nugget.Chart({
                    width: 900,
                    height: 500,
                    guides: true
                });
                chart.add(line);
                chart.appendTo('#container');

                var mouseTargetEl = document.querySelectorAll('#container .mouse_target')[0];
                var event = document.createEvent('Event');
                event.initEvent('mousemove');
                event.clientX = event.pageX = 210;
                event.clientY = event.pageY = 200;
                mouseTargetEl.dispatchEvent(event);

                var xAxisGuide = document.querySelectorAll('#container .x_axis_guide')[0];
                expect(xAxisGuide.attributes.x1.value).toBeCloseTo(202, 1);
                expect(xAxisGuide.attributes.x2.value).toBeCloseTo(202, 1);
                expect(xAxisGuide.attributes.y1.value).toBeCloseTo(192, 1);

                var xAxisLabel = document.querySelectorAll('#container .x_axis_guide_label')[0];
                expect(xAxisLabel.innerHTML).toBe('6');

                var yAxisGuide = document.querySelectorAll('#container .y_axis_guide')[0];
                expect(yAxisGuide.attributes.x2.value).toBeCloseTo(202, 1);
                expect(yAxisGuide.attributes.y1.value).toBeCloseTo(192, 1);
                expect(yAxisGuide.attributes.y2.value).toBeCloseTo(192, 1);

                var yAxisLabel = document.querySelectorAll('#container .y_axis_guide_label')[0];
                expect(yAxisLabel.innerHTML).toBe('64');
            });
        });

        describe('All platform tests', function() {

            describe('Box zoom', function() {
                var chart;
                var container;
                var chartWidth = 900;
                var chartHeight = 500;

                beforeEach(function() {
                    chart = new Nugget.Chart({
                        width: chartWidth,
                        height: chartHeight
                    });
                    chart.add(line);
                    chart.appendTo('#container');
                    container = $('#container')[0];
                });

                afterEach(function() {
                    chart = null;
                    $('#container').empty();
                });

                function getDomains() {
                    var domains = {
                        x: chart._xRange.domain(),
                        y: chart._yRange.domain()
                    };
                    return domains;
                }

                it('should be on by default', function() {
                    expect(chart.boxZoom).toBe(true);
                });

                it('should correctly draw on drag and remove on mouseup', function() {
                    Utils.trigger(container, 'mousedown');
                    Utils.trigger(container, 'mousemove');

                    expect($('.zoom_box').length).toBe(1);

                    Utils.trigger(container, 'mouseup');

                    expect($('.zoom_box').length).toBe(0);
                });

                it('should zoom axes appropriately', function() {
                    var origDomains = getDomains();
                    expect(origDomains.x[0]).toBeCloseTo(-0.63, 2);
                    expect(origDomains.y[1]).toBeCloseTo(113.33, 2);

                    Utils.trigger(container, 'mousedown', 50, 50);
                    Utils.trigger(container, 'mousemove', 100, 100);
                    Utils.trigger(container, 'mouseup');

                    var newDomains = getDomains();
                    expect(newDomains.x[0]).toBeCloseTo(-0.63, 2);
                    expect(newDomains.x[1]).toBeCloseTo(50.63, 2);
                    expect(newDomains.y[0]).toBeCloseTo(-2.22, 2);
                    expect(newDomains.y[1]).toBeCloseTo(113.33, 2);
                });

                it('should reset zoom on doubleclick', function() {
                    var origDomains = getDomains();

                    Utils.trigger(container, 'mousedown', 50, 50);
                    Utils.trigger(container, 'mousemove', 200, 200);
                    Utils.trigger(container, 'mouseup');

                    expect(getDomains()).not.toEqual(origDomains);

                    // Two fast mousedowns = doubleclick. The previous "mousedown" counts as the first click
                    // which is fine for testing purposes.
                    Utils.trigger(container, 'mousedown');
                    expect(getDomains()).toEqual(origDomains);
                });

                describe('Dragging', function() {
                    function testDrag(opts) {
                        Utils.trigger(container, 'mousedown', opts.x1, opts.y1);
                        Utils.trigger(container, 'mousemove', opts.x2, opts.y2);

                        var bbox = d3.select('.zoom_box').node().getBBox();
                        expect(bbox.x).toBeCloseTo(opts.expectedX, 2);
                        expect(bbox.y).toBeCloseTo(opts.expectedY, 2);
                        expect(bbox.width).toBeCloseTo(opts.expectedWidth, 1);
                        expect(bbox.height).toBeCloseTo(opts.expectedHeight, 1);

                        Utils.trigger(container, 'mouseup');
                    }

                    var innerLeft   = 100;
                    var innerTop    = 0;
                    var innerWidth  = 790;
                    var innerHeight = 450;

                    // The first two tests intentionally start outside of the graph bounds to make
                    // sure the zoom box still renders within the bounds.
                    it('should size appropriately when dragging down-right', function() {
                        testDrag({
                            x1             : 0,
                            y1             : 0,
                            x2             : chartWidth + 100,
                            y2             : chartHeight + 100,
                            expectedX      : innerLeft,
                            expectedY      : innerTop,
                            expectedWidth  : innerWidth,
                            expectedHeight : innerHeight
                        });
                    });

                    it('should size appropriately when dragging up-left', function() {
                        testDrag({
                            x1             : chartWidth + 100,
                            y1             : chartHeight + 100,
                            x2             : 0,
                            y2             : 0,
                            expectedX      : innerLeft,
                            expectedY      : innerTop,
                            expectedWidth  : innerWidth,
                            expectedHeight : innerHeight
                        });
                    });

                    // These test dragging inside of the graph
                    it('should size appropriately when dragging up-right', function() {
                        testDrag({
                            x1             : 500,
                            y1             : 500,
                            x2             : 600,
                            y2             : 400,
                            expectedX      : 492,
                            expectedY      : 392,
                            expectedWidth  : 100,
                            expectedHeight : 58
                        });
                    });

                    it('should size appropriately when dragging down-left', function() {
                        testDrag({
                            x1             : 500,
                            y1             : 500,
                            x2             : 400,
                            y2             : 420,
                            expectedX      : 392,
                            expectedY      : 412,
                            expectedWidth  : 100,
                            expectedHeight : 38
                        });
                    });
                });
            });

            describe('Legend', function() {
                it('should pad yRange to acommodate the legend', function() {
                    var chart = new Nugget.Chart({
                        width: 900,
                        height: 500,
                        legend: false
                    });
                    chart.add(line);
                    chart.appendTo('#container');

                    var chartWithLegend = new Nugget.Chart({
                        width: 900,
                        height: 500,
                        legend: true
                    });
                    chartWithLegend.add(line);
                    chartWithLegend.appendTo('#container');

                    var noLegendYRangeMax = chart._yRange.domain()[1];
                    var legendYRangeMax = chartWithLegend._yRange.domain()[1];

                    expect(legendYRangeMax).toBeGreaterThan(noLegendYRangeMax);
                });
            });

            describe('Axis format', function() {

                it('should render labels without formatting', function() {
                    var chart = new Nugget.Chart();
                    chart.add(line);
                    chart.appendTo('#container');

                    var tick = $('.x_axis g.tick text').eq(0);

                    expect(tick[0].innerHTML).toBe('0');
                });

                it('should render labels with formatting', function() {
                    var chart = new Nugget.Chart({
                        xAxisLabel: '.4s'
                    });
                    chart.add(line);
                    chart.appendTo('#container');

                    var tick = $('.x_axis g.tick text').eq(1);

                    expect(tick[0].innerHTML).toBe('5');
                });
            });
        });

    });

});
