define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('OrdinalDataSeries', function() {
        var dataSeries;

        beforeEach(function() {
            dataSeries = new Nugget.OrdinalDataSeries();
        });

        it('should validate simple data', function() {
            expect(function() { dataSeries.setData([1, 2, 3]); }).toThrow();
            expect(function() {
                dataSeries.setData([{
                    x_value: 'A',
                    y: 2
                }]);
            }).not.toThrow();
        });
        it('should validate nested data', function() {
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