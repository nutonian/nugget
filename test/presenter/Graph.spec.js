/* global Utils: false */
define([
        'Nugget',
        '../../../dependencies/d3'
    ],
    function (
        Nugget,
        d3
    ) {
        describe('Graph', function () {

            describe('Required methods and calls', function() {
                function checkIfImplemented(fn, text) {
                    return (fn.toString().indexOf(fn.name + '() must be implemented') === -1) ? true : false;
                }
                function checkContains(fn, text) {
                    return (fn.toString().indexOf(text) > -1) ? true : false;
                }
                function addCheck(NuggetModule, name) {
                    describe(name, function() {
                        it('should implement all required Graph methods and calls', function() {
                            var proto = NuggetModule.prototype;
                            expect(checkIfImplemented(proto.drawElement)).toBe(true);
                            expect(checkIfImplemented(proto.remove)).toBe(true);
                            expect(checkContains(proto.draw, '_applyInserts')).toBe(true);
                        });
                    });
                }
                for (var name in Nugget) {
                    var NuggetModule = Nugget[name];
                    if (Nugget.Graph.isPrototypeOf(NuggetModule)) {
                        addCheck(NuggetModule, name);
                    }
                }
            });

            describe('Guides', function() {

                var $svg;
                var chart;
                var graph;
                var dataSeries;

                var min = 0;
                var max = 100;
                var mean = 50;

                beforeEach(function() {
                    $svg = $( document.createElementNS('http://www.w3.org/2000/svg', 'svg') );
                    $svg.appendTo('body');

                    chart = new Nugget.Chart({
                        width: 900,
                        height: 500
                    });
                    dataSeries = new Nugget.NumericalDataSeries([
                        {x_value: min, y_value: min},
                        {x_value: max, y_value: max}
                    ]);

                    // Using an instance of LineGraph (subclass of Graph) so that required methods
                    // are available. Nothing specific to LineGraph should be tested here.
                    graph = new Nugget.LineGraph({
                        dataSeries: dataSeries,
                        guides: true
                    });

                    chart.appendTo( $svg[0] );
                });

                afterEach(function() {
                    $svg.remove();
                });

                it('should draw an X guide with a custom xProp', function(done) {
                    graph.drawGuides = function(container, chartOpts) {
                        var data = [{x_value: mean, y_value: mean}];
                        var dataSelection = container
                                                .selectAll('.x_guide_container')
                                                .data(data);
                        var enterSelection = dataSelection
                                                .enter()
                                                .append('g')
                                                .attr('class', 'x_guide_container');
                        graph.drawXLineGuide(dataSelection, enterSelection, chartOpts, {
                            xProp: 'x_value',
                            yProp: 'y_value'
                        });

                        Utils.validateGuide($('.x_guide_container'), {
                            label: {
                                text: '50',
                                x: 495,
                                y: 467
                            },
                            bg: {
                                x: 485.5,
                                y: 454,
                                width: 19,
                                height: 15
                            },
                            line: {
                                x1: 495,
                                y1: 225,
                                x2: 495,
                                y2: 450
                            }
                        });

                        done();
                    };
                    chart.add(graph);
                });

                it('should draw a Y guide with a custom yProp', function(done) {
                    graph.drawGuides = function(container, chartOpts) {
                        var data = [{x_value: mean, y_value: mean}];
                        var dataSelection = container
                                                .selectAll('.y_guide_container')
                                                .data(data);
                        var enterSelection = dataSelection
                                                .enter()
                                                .append('g')
                                                .attr('class', 'y_guide_container');
                        graph.drawYLineGuide(dataSelection, enterSelection, chartOpts, {
                            xProp: 'x_value',
                            yProp: 'y_value'
                        });

                        Utils.validateGuide($('.y_guide_container'), {
                            label: {
                                text: '50',
                                x: 93,
                                y: 232
                            },
                            bg: {
                                x: 76.5,
                                y: 219,
                                width: 19,
                                height: 15
                            },
                            line: {
                                x1: 100,
                                y1: 225,
                                x2: 495,
                                y2: 225
                            }
                        });

                        done();
                    };
                    chart.add(graph);
                });

                it('should keep x label above xMin', function(done) {
                    graph.drawGuides = function(container, chartOpts) {
                        var xLow = min - 10;
                        var data = [{x_value: xLow, y_value: mean}];
                        var dataSelection = container
                                                .selectAll('.x_guide_container')
                                                .data(data);
                        var enterSelection = dataSelection
                                                .enter()
                                                .append('g')
                                                .attr('class', 'x_guide_container');
                        graph.drawXLineGuide(dataSelection, enterSelection, chartOpts, {
                            xProp: 'x_value',
                            yProp: 'y_value'
                        });

                        Utils.validateGuide($('.x_guide_container'), {
                            label: {
                                text: xLow + '',
                                x: 109,
                                y: 467
                            },
                            bg: {
                                x: 97.5,
                                y: 454,
                                width: 24,
                                height: 15
                            },
                            line: {
                                x1: 100,
                                y1: 225,
                                x2: 100,
                                y2: 450
                            }
                        });

                        done();
                    };
                    chart.add(graph);
                });

                it('should keep x label below xMax', function(done) {
                    graph.drawGuides = function(container, chartOpts) {
                        var xHigh = max + 10;
                        var data = [{x_value: xHigh, y_value: mean}];
                        var dataSelection = container
                                                .selectAll('.x_guide_container')
                                                .data(data);
                        var enterSelection = dataSelection
                                                .enter()
                                                .append('g')
                                                .attr('class', 'x_guide_container');
                        graph.drawXLineGuide(dataSelection, enterSelection, chartOpts, {
                            xProp: 'x_value',
                            yProp: 'y_value'
                        });

                        Utils.validateGuide($('.x_guide_container'), {
                            label: {
                                text: xHigh + '',
                                x: 879.5,
                                y: 467
                            },
                            bg: {
                                x: 866.5,
                                y: 454,
                                width: 26,
                                height: 15
                            },
                            line: {
                                x1: 890,
                                y1: 225,
                                x2: 890,
                                y2: 450
                            }
                        });

                        done();
                    };
                    chart.add(graph);
                });

                it('should accept optional line enter functions for x guides', function(done) {
                    graph.drawGuides = function(container, chartOpts) {
                        var data = [{x_value: mean, y_value: mean}];
                        var dataSelection = container
                                                .selectAll('.x_guide_container')
                                                .data(data);
                        var enterSelection = dataSelection
                                                .enter()
                                                .append('g')
                                                .attr('class', 'x_guide_container');
                        graph.drawXLineGuide(dataSelection, enterSelection, chartOpts, {
                            xProp: 'x_value',
                            yProp: 'y_value',
                            onLineEnter: function(selection) {
                                selection
                                    .attr('x1', 0)
                                    .attr('y1', 1)
                                    .attr('x2', 2)
                                    .attr('y2', 3);
                            }
                        });

                        Utils.validateGuide($('.x_guide_container'), {
                            line: {
                                x1: 0,
                                y1: 1,
                                x2: 2,
                                y2: 3
                            }
                        });

                        done();
                    };
                    chart.add(graph);
                });

                it('should accept optional line enter functions for y guides', function(done) {
                    graph.drawGuides = function(container, chartOpts) {
                        var data = [{x_value: mean, y_value: mean}];
                        var dataSelection = container
                                                .selectAll('.y_guide_container')
                                                .data(data);
                        var enterSelection = dataSelection
                                                .enter()
                                                .append('g')
                                                .attr('class', 'y_guide_container');
                        graph.drawYLineGuide(dataSelection, enterSelection, chartOpts, {
                            xProp: 'x_value',
                            yProp: 'y_value',
                            onLineEnter: function(selection) {
                                selection
                                    .attr('x1', 0)
                                    .attr('y1', 1)
                                    .attr('x2', 2)
                                    .attr('y2', 3);
                            }
                        });

                        Utils.validateGuide($('.y_guide_container'), {
                            line: {
                                x1: 0,
                                y1: 1,
                                x2: 2,
                                y2: 3
                            }
                        });

                        done();
                    };
                    chart.add(graph);
                });

            });

        });
    });
