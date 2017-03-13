define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {

    describe('SparseNumericalDataSeries', function() {

        describe('axes', function() {
            it('should allow overriding default x axis type', function() {
                var dataSeries = new Nugget.SparseNumericalDataSeries([], {
                    xAxisType: Nugget.Axes.AXIS_TYPES.DATETIME
                });
                expect(dataSeries.xAxisType).toEqual(Nugget.Axes.AXIS_TYPES.DATETIME);
            });

            it('should allow overriding default y axis type', function() {
                var dataSeries = new Nugget.SparseNumericalDataSeries([], {
                    yAxisType: Nugget.Axes.AXIS_TYPES.DATETIME
                });
                expect(dataSeries.yAxisType).toEqual(Nugget.Axes.AXIS_TYPES.DATETIME);
            });
        });

        it('should validate data', function() {
            var dataSeries = new Nugget.SparseNumericalDataSeries();

            expect(function() { dataSeries.setData([1, 2, 3]); }).toThrow();
            expect(function() { dataSeries.setData([{ x_value: '1', y_value: '2' }]); }).toThrow();

            // positive cases
            expect(function() { dataSeries.setData([{ x_value: 1, y_value: 2 }]); }).not.toThrow();
            expect(function() { dataSeries.setData([
                { x_value: 1,    y_value: null },
                { x_value: null, y_value: 2 }
            ]); }).not.toThrow();
            expect(function() { dataSeries.setData([
                { x_value: 1, x_min: 0, x_max: 3, y_value: 2, y_min: 1, y_max: 3 },
                { x_value: 1, x_min: 1, x_max: 3, y_value: 2, y_min: 0, y_max: 3 }
            ]); }).not.toThrow();
        });
    });
});
