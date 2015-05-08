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

        var dataNoArray = [{x_value: 'A', y: 2}, {x_value: 'B', y: 15}, {x_value: 'C', y: 8}, {x_value: 'D', y: 6}, {x_value: 'E', y: 20}, {x_value: 'F', y: 16}];
        var dataArray = [{x_value: ['0', '0'], y: 3}, {x_value: ['0', '1'], y: 10}, {x_value: ['1', '0'], y: 6}, {x_value: ['1', '1'], y: 13}];

        beforeEach(function() {
            $svg = $( document.createElementNS('http://www.w3.org/2000/svg', 'svg') );
            $svg.attr('id', 'container').appendTo('body');
        });

        afterEach(function() {
            $('#container').remove();
        });

        describe('Simple bar graph', function() {
            var chart;

            beforeEach(function() {
                chart = new Nugget.Chart({
                    width: 900,
                    height: 500
                });
            });

            afterEach(function() {
                chart = null;
            });

            it('should render a bar graph', function() {
                var dataSeries = new Nugget.OrdinalDataSeries(dataNoArray);

                var bars = new Nugget.BarGraph({
                    dataSeries: dataSeries
                });

                chart.add(bars);
                chart.appendTo('#container');

                var renderedBars = document.querySelectorAll('.bar');

                expect(renderedBars.length).toBe(dataNoArray.length);
            });
        });

        describe('Grouped bar graph', function() {
            it('should render a grouped bar graph', function() {
                var chart = new Nugget.Chart({
                    width: 900,
                    height: 500
                });

                var dataSeries = new Nugget.OrdinalDataSeries(dataArray);

                var groupedBars = new Nugget.BarGraph({
                    dataSeries: dataSeries
                });

                chart.add(groupedBars);
                chart.appendTo('#container');

                expect($('rect[data-group="0"]').length).toBe(2);
                expect($('rect[data-group="1"]').length).toBe(2);
            });

            it('should render axis ticks correctly', function() {
                var chart = new Nugget.Chart({
                    width: 900,
                    height: 500
                });

                var dataSeries = new Nugget.OrdinalDataSeries(dataNoArray);

                var groupedBars = new Nugget.BarGraph({
                    dataSeries: dataSeries
                });

                chart.add(groupedBars);
                chart.appendTo('#container');

                var xAxisTicks = $('.x_axis .tick text').map(function() {
                    return $(this).text();
                }).toArray();

                var yAxisTicks = $('.y_axis .tick text').map(function() {
                    return $(this).text();
                }).toArray();

                expect(xAxisTicks).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
                expect(yAxisTicks).toEqual(['2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22']);
            });

            it('should render a legend', function() {
                var css = '';
                css += '[data-group_index="0"] { fill: orange; }';
                css += '[data-group_index="1"] { fill: blue; }';

                var $style = $('<style>').attr('type', 'text/css');
                $style.text(css);
                $('head').append($style);

                var chart = new Nugget.Chart({
                    width: 900,
                    height: 500,
                    axisLabels: {
                        x: ['foo', 'bar'],
                        y: 'baz'
                    }
                });

                var dataSeries = new Nugget.OrdinalDataSeries(dataArray);

                var groupedBars = new Nugget.BarGraph({
                    dataSeries: dataSeries
                });

                chart.add(groupedBars);
                chart.appendTo('#container');

                expect($('.legend_swatch:eq(0)').attr('fill')).toBe('rgb(255, 165, 0)');
                expect($('.legend_swatch:eq(1)').attr('fill')).toBe('rgb(0, 0, 255)');

                expect($('.legend_group g:eq(0) text').text()).toBe('bar = 0');
                expect($('.legend_group g:eq(1) text').text()).toBe('bar = 1');

                $style.remove();
            });
        });
    });
});
