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
                dataSeries: dataSeries
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
    });
});
