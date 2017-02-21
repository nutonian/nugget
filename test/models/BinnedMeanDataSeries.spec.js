define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {

    describe('BinnedMeanDataSeries', function() {

        describe('axes', function() {
            it('should allow overriding default x axis type', function() {
                var dataSeries = new Nugget.BinnedMeanDataSeries([], {
                    xAxisType: Nugget.Axes.AXIS_TYPES.DATETIME
                });
                expect(dataSeries.xAxisType).toEqual(Nugget.Axes.AXIS_TYPES.DATETIME);
            });

            it('should allow overriding default y axis type', function() {
                var dataSeries = new Nugget.BinnedMeanDataSeries([], {
                    yAxisType: Nugget.Axes.AXIS_TYPES.DATETIME
                });
                expect(dataSeries.yAxisType).toEqual(Nugget.Axes.AXIS_TYPES.DATETIME);
            });
        });

        it('should validate data', function() {
            var dataSeries = new Nugget.BinnedMeanDataSeries();

            expect(function() { dataSeries.setData([1, 2, 3]); }).toThrow();
            expect(function() { dataSeries.setData([{
                x_high: 1,
                x_low: 2,
                x_mean: 10,
                y_mean: 10,
                num_values: 5
            }]); }).not.toThrow();
        });

    });

});
