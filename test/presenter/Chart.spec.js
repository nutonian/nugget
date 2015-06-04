/* global Utils: false */
define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('Chart', function() {
        var $svg;

        var lineGraphData1 = [{x_value: 0, y_value: 0},   {x_value: 50, y_value: 50}, {x_value: 0, y_value: 100}];
        var lineGraphData2 = [{x_value: 0, y_value: 100}, {x_value: 50, y_value: 50}, {x_value: 100, y_value: 0}];

        var dataSeries1 = new Nugget.NumericalDataSeries(lineGraphData1);
        var dataSeries2 = new Nugget.NumericalDataSeries(lineGraphData2);

        var line = new Nugget.LineGraph({dataSeries: dataSeries1, color: 'green'});
        var line2 = new Nugget.LineGraph({dataSeries: dataSeries2, color: '#09e'});

        beforeEach(function() {
            Nugget.Utils.idCounter = 0;
            $svg = $( document.createElementNS('http://www.w3.org/2000/svg', 'svg') );
            $svg.attr('id', 'container').appendTo('body');
        });

        afterEach(function() {
            $svg.remove();
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

        it('should appendTo without any Graphs added', function() {
            var chart = new Nugget.Chart();
            expect(function() { chart.appendTo('#container'); }).not.toThrow();
        });

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

        it('should update ranges when data changes', function() {
            var chart = new Nugget.Chart({
                width: 500,
                height: 500
            });
            var dataSeries = new Nugget.NumericalDataSeries(lineGraphData1);
            var lineGraph = new Nugget.LineGraph({
                dataSeries: dataSeries
            });

            chart.add(lineGraph);

            chart.appendTo('#container');

            var currentXDomain = chart._xRange.domain();
            var currentYDomain = chart._yRange.domain();

            expect(currentXDomain).toEqual([ -1.282051282051282, 51.28205128205128 ]);
            expect(currentYDomain).toEqual([ -2.2222222222222223, 113.33333333333333 ]);

            var newdata = [{x_value: 3, y_value:12}, {x_value: 4, y_value: 20}];

            dataSeries.setData(newdata);

            var newXDomain = chart._xRange.domain();
            var newYDomain = chart._yRange.domain();

            expect(newXDomain).toEqual([ 2.974358974358974, 4.0256410256410255 ]);
            expect(newYDomain).toEqual([ 11.822222222222221, 21.066666666666663 ]);
        });



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
                        expectedY      : 327,
                        expectedWidth  : 100,
                        expectedHeight : 100
                   });
                });

                it('should size appropriately when dragging down-left', function() {
                    testDrag({
                        x1             : 500,
                        y1             : 500,
                        x2             : 400,
                        y2             : 420,
                        expectedX      : 392,
                        expectedY      : 347,
                        expectedWidth  : 100,
                        expectedHeight : 80
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

            it('should update the legend when data changes', function() {
                var chart = new Nugget.Chart({
                    throttleUpdate: false
                });
                var dataSeries = new Nugget.BinnedMeanDataSeries();
                var graph = new Nugget.BinnedMeanGraph({
                    dataSeries: dataSeries
                });
                chart.add(graph);
                chart.appendTo('#container');
                expect($('.legend_label').text()).toBe('');

                dataSeries.setData([{
                    num_values: 10,
                    x_high: 200,
                    x_low: 100,
                    x_mean: 150,
                    y_mean: 150
                }]);
                expect($('.legend_label').text()).toBe('approx. 2 values');

                dataSeries.setData([{
                    num_values: 5,
                    x_high: 200,
                    x_low: 100,
                    x_mean: 150,
                    y_mean: 150
                }]);
                expect($('.legend_label').text()).toBe('approx. 1 values');
            });
        });




        describe('Axis formatters', function() {
            it('should use an identity function if tickFormat doesn\'t exist on range', function() {
                var chart = new Nugget.Chart();

                // Ranges made from OrdinalDataSeries don't have tickFormat
                var dataSeries = new Nugget.OrdinalDataSeries([{x_value: 'foo', y: 10}]);
                var graph = new Nugget.BarGraph({ dataSeries: dataSeries});
                chart.add(graph);
                chart.appendTo('#container');

                expect(chart.xLabelFormat('foo')).toBe('foo');
                expect(chart.yLabelFormat(10)).toBe('10');
            });

            it('should create a formatter based on the range\'s tickFormat', function() {
                var chart = new Nugget.Chart();

                var dataSeries = new Nugget.NumericalDataSeries([{x_value: 1, y_value: 2}]);
                var graph = new Nugget.LineGraph({ dataSeries: dataSeries});
                chart.add(graph);
                chart.appendTo('#container');

                expect(chart.xLabelFormat(5.00)).toBe('5');
                expect(chart.yLabelFormat(10.00)).toBe('10');
            });

            it('should create a formatter based on optional format strings', function() {
                var chart = new Nugget.Chart({
                    xLabelFormat: '.5f', // floating point with 5 decimal places
                    yLabelFormat: 'b'    // binary
               });

                var dataSeries = new Nugget.NumericalDataSeries([{x_value: 1, y_value: 2}]);
                var graph = new Nugget.LineGraph({ dataSeries: dataSeries});
                chart.add(graph);
                chart.appendTo('#container');

                expect(chart.xLabelFormat(1)).toBe('1.00000');
                expect(chart.yLabelFormat(64)).toBe('1000000');
            });


            it('should render tick labels with formatting', function() {
                var chart = new Nugget.Chart({
                    yLabelFormat: '.6s',
                    width: 500,
                    height: 400
                });
                chart.add(line);
                chart.appendTo('#container');

                var xTicks = $('.x_axis g.tick text').map(function() {
                    return $(this).text();
                }).toArray();

                var yTicks = $('.y_axis g.tick text').map(function() {
                    return $(this).text();
                }).toArray();

                expect(xTicks).toEqual(['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50']);
                expect(yTicks).toEqual(['0.00000', '10.0000', '20.0000', '30.0000', '40.0000', '50.0000', '60.0000', '70.0000', '80.0000', '90.0000', '100.000', '110.000']);
            });

            it('should render tick labels without formatting', function() {
                var chart = new Nugget.Chart({
                    width: 400,
                    height: 400
                });

                chart.add(line);
                chart.appendTo('#container');

                var xTicks = $('.x_axis g.tick text').map(function() {
                    return $(this).text();
                }).toArray();

                var yTicks = $('.y_axis g.tick text').map(function() {
                    return $(this).text();
                }).toArray();

                expect(xTicks).toEqual([ '0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50' ]);
                expect(yTicks).toEqual([ '0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '110' ]);
            });

            it('should render the specified number of ticks', function() {
                var chart = new Nugget.Chart({
                    width: 400,
                    height: 400,
                    numXTicks: 0,
                    numYTicks: 2
                });

                chart.add(line);
                chart.appendTo('#container');

                expect($('.x_axis .tick').length).toBe(0);
                expect($('.y_axis .tick').length).toBe(2);
            }) ;
       });


        describe('HTML smoke tests', function() {
            var lineGraphHtml = '<svg id="container" width="900" height="500"><clipPath id="clip1"><rect x="100" y="20" width="780" height="460"></rect></clipPath><g class="drawing_surface" clip-path="url(#clip1)"><g data-id="graph_3"><path stroke-width="2" class="line" fill="none" stroke="green" d="M109.75,471.3207547169811L490.0000000000001,271.69811320754724L109.75,72.0754716981132"></path></g><g data-id="graph_4"><path stroke-width="2" class="line" fill="none" stroke="#09e" d="M109.75,72.0754716981132L490.0000000000001,271.69811320754724L870.2500000000001,471.3207547169811"></path></g></g><text x="500" y="495" class="axis_label" style="text-anchor: middle;">row</text><text transform="rotate(-90)" class="axis_label" y="25" x="-250" style="text-anchor: middle;">value</text><svg class="legend" x="110" y="30" width="760" height="30"><rect class="legend_bg" width="100%" height="100%"></rect></svg><g class="x_axis" transform="translate(0,480)"><g class="tick" transform="translate(109.75,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">0</text></g><g class="tick" transform="translate(185.8,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">10</text></g><g class="tick" transform="translate(261.85,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">20</text></g><g class="tick" transform="translate(337.9,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">30</text></g><g class="tick" transform="translate(413.95000000000005,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">40</text></g><g class="tick" transform="translate(490.0000000000001,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">50</text></g><g class="tick" transform="translate(566.0500000000001,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">60</text></g><g class="tick" transform="translate(642.1,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">70</text></g><g class="tick" transform="translate(718.1500000000001,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">80</text></g><g class="tick" transform="translate(794.2000000000002,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">90</text></g><g class="tick" transform="translate(870.2500000000001,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">100</text></g><path class="domain" d="M100,0V0H880V0"></path></g><g class="y_axis" transform="translate(100, 0)"><g class="tick" transform="translate(0,471.3207547169811)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">0</text></g><g class="tick" transform="translate(0,431.3962264150943)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">10</text></g><g class="tick" transform="translate(0,391.4716981132076)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">20</text></g><g class="tick" transform="translate(0,351.54716981132077)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">30</text></g><g class="tick" transform="translate(0,311.622641509434)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">40</text></g><g class="tick" transform="translate(0,271.69811320754724)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">50</text></g><g class="tick" transform="translate(0,231.77358490566036)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">60</text></g><g class="tick" transform="translate(0,191.84905660377356)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">70</text></g><g class="tick" transform="translate(0,151.92452830188677)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">80</text></g><g class="tick" transform="translate(0,111.99999999999997)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">90</text></g><g class="tick" transform="translate(0,72.0754716981132)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">100</text></g><g class="tick" transform="translate(0,32.15094339622641)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">110</text></g><path class="domain" d="M0,20H0V480H0"></path></g><g class="zoom_fixture_x"></g><g class="zoom_fixture_y"></g><line x1="100" x2="880" y1="20" y2="20" class="bounding_box"></line><line x1="880" x2="880" y1="20" y2="480" class="bounding_box"></line></svg>';

            var lineGraphNoOptionsHtml = '<svg id="container" width="900" height="500"><clipPath id="clip1"><rect x="100" y="0" width="790" height="450"></rect></clipPath><g class="drawing_surface" clip-path="url(#clip1)"><g data-id="graph_4"><path stroke-width="2" class="line" fill="none" stroke="#09e" d="M109.75308641975309,51.92307692307689L495,246.63461538461542L880.2469135802469,441.3461538461538"></path></g><g data-id="graph_3"><path stroke-width="2" class="line" fill="none" stroke="green" d="M109.75308641975309,441.3461538461538L495,246.63461538461542L109.75308641975309,51.92307692307689"></path></g></g><text x="500" y="487.5" class="axis_label" style="text-anchor: middle;">number of beers</text><text transform="rotate(-90)" class="axis_label" y="25" x="-250" style="text-anchor: middle;">how good i look</text><svg class="legend" x="110" y="10" width="770" height="30"><rect class="legend_bg" width="100%" height="100%"></rect></svg><g class="x_axis" transform="translate(0,450)"><g class="tick" transform="translate(109.75308641975309,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">0</text></g><g class="tick" transform="translate(186.80246913580248,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">10</text></g><g class="tick" transform="translate(263.85185185185185,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">20</text></g><g class="tick" transform="translate(340.9012345679012,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">30</text></g><g class="tick" transform="translate(417.9506172839506,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">40</text></g><g class="tick" transform="translate(495,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">50</text></g><g class="tick" transform="translate(572.0493827160493,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">60</text></g><g class="tick" transform="translate(649.0987654320988,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">70</text></g><g class="tick" transform="translate(726.1481481481482,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">80</text></g><g class="tick" transform="translate(803.1975308641976,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">90</text></g><g class="tick" transform="translate(880.2469135802469,0)" style="opacity: 1;"><line y2="-7" x2="0"></line><text dy=".71em" y="7" x="0" style="text-anchor: middle;">100</text></g><path class="domain" d="M100,0V0H890V0"></path></g><g class="y_axis" transform="translate(100, 0)"><g class="tick" transform="translate(0,441.3461538461538)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">0</text></g><g class="tick" transform="translate(0,402.4038461538462)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">10</text></g><g class="tick" transform="translate(0,363.46153846153845)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">20</text></g><g class="tick" transform="translate(0,324.5192307692308)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">30</text></g><g class="tick" transform="translate(0,285.57692307692304)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">40</text></g><g class="tick" transform="translate(0,246.63461538461542)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">50</text></g><g class="tick" transform="translate(0,207.6923076923077)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">60</text></g><g class="tick" transform="translate(0,168.75)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">70</text></g><g class="tick" transform="translate(0,129.8076923076923)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">80</text></g><g class="tick" transform="translate(0,90.8653846153846)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">90</text></g><g class="tick" transform="translate(0,51.92307692307689)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">100</text></g><g class="tick" transform="translate(0,12.980769230769235)" style="opacity: 1;"><line x2="7" y2="0"></line><text dy=".32em" x="-7" y="0" style="text-anchor: end;">110</text></g><path class="domain" d="M0,0H0V450H0"></path></g><g class="zoom_fixture_x"></g><g class="zoom_fixture_y"></g><line x1="100" x2="890" y1="0" y2="0" class="bounding_box"></line><line x1="890" x2="890" y1="0" y2="450" class="bounding_box"></line></svg>';

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

                expect($svg[0].outerHTML).toBe(lineGraphHtml);
            });

            it('should render a lineGraph without options', function() {
                var chart = new Nugget.Chart({
                    width: 900,
                    height: 500,
                    axisLabels: {
                        x: 'number of beers',
                        y: 'how good i look'
                    }
                });

                chart.add(line2);
                chart.add(line);

                chart.appendTo('#container');

                expect($svg[0].outerHTML).toBe(lineGraphNoOptionsHtml);
            });
       });

   });

});
