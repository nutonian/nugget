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
                'x_low': 10,
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
                'x_high': 60,
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
                height: 500
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
            $('#container').remove();
            chart = null;
        });

        it('should plot circles', function() {
            var expectedVals = [
                {'r': '5',  'cx': 136, 'cy': 418 },
                {'r': '17.5',  'cx': 495, 'cy': 244 },
                {'r': '30', 'cx': 853, 'cy': 69 }
            ];
            var actualVals = $svg.find('.bin_circle').map(function() {
                var $circle = $(this);
                var attrs = {
                    r: $circle.attr('r'),
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
            expect($svg.find('.legend_circle').attr('r')).toBe('10');
            expect($svg.find('.legend_label').text()).toBe('approx. 14 values');
        });

        describe('guides', function() {
            it('should show guides for a circle', function() {
                function validateGuide($el, opts) {
                    var $text = $el.find('.guide_label');
                    expect($text.text()).toBe(opts.label.text);
                    expect(Number($text.attr('x'))).toBeCloseTo(opts.label.x, 0);
                    expect(Number($text.attr('y'))).toBeCloseTo(opts.label.y, 0);

                    var $bg = $el.find('.guide_label_bg');
                    expect(Number($bg.attr('x'))).toBeCloseTo(opts.bg.x, 0);
                    expect(Number($bg.attr('y'))).toBeCloseTo(opts.bg.y, 0);
                    expect(Number($bg.attr('width'))).toBeCloseTo(opts.bg.width, 0);
                    expect(Number($bg.attr('height'))).toBeCloseTo(opts.bg.height, 0);
                }

                var el = $('.bin_circle:eq(1)')[0];
                Utils.trigger(el, 'mouseenter');

                validateGuide($('.binned_mean_x_range_guide'), {
                    label: {
                        text: 'From 30 to 40',
                        x: 495,
                        y: 467
                    },
                    bg: {
                        x: 453,
                        y: 454,
                        width: 85,
                        height: 15
                    }
                });

                validateGuide($('.binned_mean_y_guide'), {
                    label: {
                        text: '35',
                        x: 93,
                        y: 251
                    },
                    bg: {
                        x: 76.5,
                        y: 238,
                        width: 19,
                        height: 15
                    }
                });
            });

            it('should hide guides for a circle', function() {

            });

            it('should constrain x range guide to stay within xMin', function() {

            });

            it('should constrain x range guide to stay within xMax', function() {

            });

            it('should adjust guides on zoom', function() {

            });

        });
    });
});
