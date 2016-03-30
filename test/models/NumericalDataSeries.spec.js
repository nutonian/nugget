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

        it('validate data', function() {
            expect(function() { dataSeries.setData([1, 2, 3]); }).toThrow();
            expect(function() { dataSeries.setData([{x_value: '1', y_value: '2'}]); }).toThrow();
            expect(function() { dataSeries.setData([{x_value: 1, y_value: 2}]); }).not.toThrow();
            expect(function() { dataSeries.setData([
                {x_value: 1, y_value: 2},
                {y_value: 1, x_value: 2}
            ]); }).not.toThrow();
            expect(function() { dataSeries.setData([
                {x_value: 1, y_value: 2},
                {y_value: 1, x_value: 2, z: 3}
            ]); }).toThrow();
            expect(function() { dataSeries.setData([
                {y_value: 1, x_value: 2, z: 3},
                {x_value: 1, y_value: 2}
            ]); }).toThrow();
        });

    });

});
