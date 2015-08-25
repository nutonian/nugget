/* global Utils: false */
define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('BinnedMeanGraph', function () {
        var data = [
            {
                'num_values': 10,
                'x_low': -10, // intentionally less than visible x range
                'x_high': 20,
                'x_mean': 15,
                'y_mean': 15
            },
            {
                'num_values': 20,
                'x_low': 30,
                'x_high': 40,
                'x_mean': 35,
                'y_mean': 35
            },
            {
                'num_values': 30,
                'x_low': 50,
                'x_high': 100, // intentionally more than visible x range
                'x_mean': 55,
                'y_mean': 55
            }
        ];

        var $svg;
        var chart;

        beforeEach(function() {
            $svg = $( document.createElementNS('http://www.w3.org/2000/svg', 'svg') );
            $svg.attr('id', 'container').appendTo('body');
            chart = new Nugget.Chart({
                width: 900,
                height: 500,
                legend: true
            });
            var dataSeries = new Nugget.BinnedMeanDataSeries(data);
            var binnedMeanGraph = new Nugget.BinnedMeanGraph({
                dataSeries: dataSeries,
                guides: true
            });
            chart.add(binnedMeanGraph);
            chart.appendTo('#container');
        });

        afterEach(function() {
            $svg.remove();
            chart = null;
        });

        it('should plot circles', function() {
            var expectedVals = [
                { r: 13, cx: 136, cy: 418 },
                { r: 21, cx: 495, cy: 244 },
                { r: 30, cx: 853, cy: 69  }
            ];
            var actualVals = $svg.find('.bin_circle').map(function() {
                var $circle = $(this);
                var attrs = {
                    r:  Math.floor( $circle.attr('r')  ),
                    cx: Math.floor( $circle.attr('cx') ),
                    cy: Math.floor( $circle.attr('cy') )
                };
                return attrs;
            }).toArray();
            actualVals.sort(function(a, b) {
                return parseInt(a.r) > parseInt(b.r);
            });

            expect(actualVals).toEqual(expectedVals);
        });

        it('should plot a line', function() {
            var expectedLineData = 'M136.32183908045977,418.9655172413793L495.0000000000001,244.39655172413794L853.6781609195402,69.82758620689654';
            var actualLineData = $svg.find('path.line').attr('d');
            expect(expectedLineData).toEqual(actualLineData);
        });

        it('should render a legend', function() {
            expect($svg.find('.legend_swatch').attr('r')).toBe('10');
            expect($svg.find('.legend_label').text()).toBe('approx. 6 values');
        });

        describe('guides', function() {


            it('should show guides for a circle', function() {
                var el = $('.bin_circle:eq(1)')[0];
                Utils.trigger(el, 'mouseenter');

                Utils.validateGuide($('.binned_mean_x_guide'), {
                    line: {
                        x1: 495,
                        y1: 244,
                        x2: 495,
                        y2: 450
                    },
                    label: {
                        text: 'From 30 to 40',
                        x: 495,
                        y: 466
                    },
                    bg: {
                        x: 453,
                        y: 454.5,
                        width: 85,
                        height: 15
                    }
                });

                Utils.validateGuide($('.binned_mean_x_range_guide'), {
                    line: {
                        x1: 405,
                        y1: 450,
                        x2: 585,
                        y2: 450
                    }
                });

                Utils.validateGuide($('.binned_mean_y_guide'), {
                    label: {
                        text: '35',
                        x: 93,
                        y: 251
                    },
                    bg: {
                        x: 76.5,
                        y: 240,
                        width: 19,
                        height: 15
                    },
                    line: {
                        x1: 100,
                        y1: 244,
                        x2: 495,
                        y2: 244
                    }
                });
            });

            it('should hide guides for a circle', function() {
                var el = $('.bin_circle:eq(1)')[0];
                Utils.trigger(el, 'mouseenter');
                expect($('g.binned_mean_guide').length).toBe(3);
                Utils.trigger(el, 'mouseleave');
                expect($('g.binned_mean_guide').length).toBe(0);
            });

            it('should constrain x range guide to stay within xMin', function() {
                var el = $('.bin_circle:eq(0)')[0];
                Utils.trigger(el, 'mouseenter');
                Utils.validateGuide($('.binned_mean_x_guide'), {
                    label: {
                        text: 'From -10 to 20',
                        x: 142,
                        y: 466
                    },
                    bg: {
                        x: 97.5,
                        y: 454.5,
                        width: 89,
                        height: 15
                    }
                });
                Utils.validateGuide($('.binned_mean_x_range_guide'), {
                    line: {
                        x1: 100,
                        y1: 450,
                        x2: 226,
                        y2: 450
                    }
                });
            });

            it('should constrain x range guide to stay within xMax', function() {
                var el = $('.bin_circle:eq(2)')[0];
                Utils.trigger(el, 'mouseenter');
                Utils.validateGuide($('.binned_mean_x_guide'), {
                    label: {
                        text: 'From 50 to 100',
                        x: 846.625,
                        y: 466
                    },
                    bg: {
                        x: 800.75,
                        y: 454.5,
                        width: 91.75,
                        height: 15
                    }
                });
                Utils.validateGuide($('.binned_mean_x_range_guide'), {
                    line: {
                        x1: 764,
                        y1: 450,
                        x2: 890,
                        y2: 450
                    }
                });
            });

            it('should adjust guides on zoom', function() {
                var el = $('.bin_circle:eq(1)')[0];
                Utils.trigger(el, 'mouseenter');

                var zoomX = chart.zoomX;
                var zoomY = chart.zoomY;

                expect(zoomX.scale()).toBe(1);
                expect(zoomY.scale()).toBe(1);

                zoomX.scale(1.5);
                zoomY.scale(1.5);

                zoomX.event(chart.d3Svg);
                zoomY.event(chart.d3Svg);

                Utils.validateGuide($('.binned_mean_x_guide'), {
                    label: {
                        text: 'From 30 to 40',
                        x: 742.5,
                        y: 466
                    },
                    bg: {
                        x: 700.125,
                        y: 454.5,
                        width: 85,
                        height: 15
                    }
                });
                Utils.validateGuide($('.binned_mean_x_range_guide'), {
                    line: {
                        x1: 608,
                        y1: 450,
                        x2: 877,
                        y2: 450
                    }
                });

                Utils.validateGuide($('.binned_mean_y_guide'), {
                    label: {
                        text: '35',
                        x: 93,
                        y: 374
                    },
                    bg: {
                        x: 76.5,
                        y: 362,
                        width: 19,
                        height: 15
                    },
                    line: {
                        x1: 100,
                        y1: 367,
                        x2: 742.5,
                        y2: 367
                    }
                });
            });

        });
    });
});
