define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {

    describe('NumericalDataSeries', function() {

        var dataSeries;

        beforeEach(function() {
            dataSeries = new Nugget.NumericalDataSeries();
        });

        it('should validate data', function() {
            expect(function() { dataSeries.setData([1, 2, 3]); }).toThrow();
            expect(function() { dataSeries.setData([{x_value: '1', y_value: '2'}]); }).toThrow();

            // positive cases
            expect(function() { dataSeries.setData([{x_value: 1, y_value: 2}]); }).not.toThrow();
            expect(function() { dataSeries.setData([
                {x_value: 1, y_value: 2},
                {y_value: 1, x_value: 2}
            ]); }).not.toThrow();
            expect(function() { dataSeries.setData([
                {x_value: 1, x_min: 0, x_max: 3, y_value: 2, y_min: 1, y_max: 3},
                {y_value: 1, y_min: 1, y_max: 3, x_value: 2, x_min: 0, x_max: 3}
            ]); }).not.toThrow();

            // all points should have same structure
            expect(function() { dataSeries.setData([
                {x_value: 1, y_value: 2},
                {y_value: 1, x_value: 2, y_min: 3}
            ]); }).toThrow();
            expect(function() { dataSeries.setData([
                {y_value: 1, x_value: 2, y_min: 3},
                {x_value: 1, y_value: 2}
            ]); }).toThrow();
        });

    });

});
