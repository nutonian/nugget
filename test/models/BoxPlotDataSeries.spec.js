define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('BoxPlotDataSeries', function() {

        describe('axes', function() {
            it('should default x axis type to ordinal', function() {
                var dataSeries = new Nugget.BoxPlotDataSeries();
                expect(dataSeries.xAxisType).toEqual(Nugget.Axes.AXIS_TYPES.ORDINAL);
            });

            it('should prevent overriding default x axis type', function() {
                var dataSeries = new Nugget.BoxPlotDataSeries([], {
                    xAxisType: Nugget.Axes.AXIS_TYPES.NUMERICAL
                });
                expect(dataSeries.xAxisType).toEqual(Nugget.Axes.AXIS_TYPES.ORDINAL);
            });

            it('should allow overriding default y axis type', function() {
                var dataSeries = new Nugget.BoxPlotDataSeries([], {
                    yAxisType: Nugget.Axes.AXIS_TYPES.DATETIME
                });
                expect(dataSeries.yAxisType).toEqual(Nugget.Axes.AXIS_TYPES.DATETIME);
            });
        });

        it('should validate data', function() {
            var dataSeries = new Nugget.BoxPlotDataSeries();

            expect(function() { dataSeries.setData([1, 2, 3]); }).toThrow();

            expect(function() {
                dataSeries.setData([{
                    x_value: 'A',
                    y_min: 2,
                    y_max: 4
                }]);
            }).not.toThrow();
        });
    });
});
