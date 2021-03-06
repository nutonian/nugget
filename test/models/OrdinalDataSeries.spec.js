define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('OrdinalDataSeries', function() {

        describe('axes', function() {
            it('should default x axis type to ordinal', function() {
                var dataSeries = new Nugget.OrdinalDataSeries();
                expect(dataSeries.xAxisType).toEqual(Nugget.Axes.AXIS_TYPES.ORDINAL);
            });

            it('should prevent overriding default x axis type', function() {
                var dataSeries = new Nugget.OrdinalDataSeries([], {
                    xAxisType: Nugget.Axes.AXIS_TYPES.NUMERICAL
                });
                expect(dataSeries.xAxisType).toEqual(Nugget.Axes.AXIS_TYPES.ORDINAL);
            });

            it('should allow overriding default y axis type', function() {
                var dataSeries = new Nugget.OrdinalDataSeries([], {
                    yAxisType: Nugget.Axes.AXIS_TYPES.DATETIME
                });
                expect(dataSeries.yAxisType).toEqual(Nugget.Axes.AXIS_TYPES.DATETIME);
            });
        });

        it('should validate simple data', function() {
            var dataSeries = new Nugget.OrdinalDataSeries();
            expect(function() { dataSeries.setData([1, 2, 3]); }).toThrow();
            expect(function() {
                dataSeries.setData([{
                    x_value: 'A',
                    y: 2
                }]);
            }).not.toThrow();
        });

        it('should validate nested data', function() {
            var dataSeries = new Nugget.OrdinalDataSeries();
            expect(function() {
                dataSeries.setData([{
                    x_value: [0, 1],
                    y: 2
                }]);
            }).toThrow();
            expect(function() {
                dataSeries.setData([{
                    x_value: ['0', '1'],
                    y: 2
                }]);
            }).not.toThrow();
        });
    });
});
