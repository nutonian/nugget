define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {

    describe('BinnedMeanDataSeries', function() {

        var dataSeries;

        beforeEach(function() {
            dataSeries = new Nugget.BinnedMeanDataSeries();
        });

        it('validate data', function() {
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
