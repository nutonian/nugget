define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('Bar Graph Plot Tests', function () {
        var $svg;
        var chart;

        var dataNoArray = [{x_value: 'A', y: 2}, {x_value: 'B', y: 15}, {x_value: 'C', y: 8}, {x_value: 'D', y: 6}, {x_value: 'E', y: 20}, {x_value: 'F', y: 16}];
        var dataArray = [{x_value: ['0', '0'], y: 3}, {x_value: ['0', '1'], y: 10}, {x_value: ['1', '0'], y: 6}, {x_value: ['1', '1'], y: 13}];

        beforeEach(function() {
            $svg = $( document.createElementNS('http://www.w3.org/2000/svg', 'svg') );
            $svg.attr('id', 'container').appendTo('body');

            chart = new Nugget.Chart();
        });

        afterEach(function() {
            $('#container').remove();
            chart = null;
        });

        it('should render bar graphs', function() {
            var dataSeries = new Nugget.OrdinalDataSeries(dataNoArray);

            var bars = new Nugget.BarGraph({
                dataSeries: dataSeries,
                color: '#09e'
            });

            chart.add(bars);
            chart.appendTo('#container');

            var renderedBars = document.querySelectorAll('.bar');

            expect(renderedBars.length).toBe(dataNoArray.length);
        });
        it('should render grouped bar graphs', function() {
            var dataSeries = new Nugget.OrdinalDataSeries(dataArray);

            var groupedBars = new Nugget.BarGraph({
                dataSeries: dataSeries
            });

            chart.add(groupedBars);
            chart.appendTo('#container');

            var renderedHtml = $('.grouped_bar rect');

            expect(renderedHtml.length).toBe(dataArray.length);
        });
    });
});