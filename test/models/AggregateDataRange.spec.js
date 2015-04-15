define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {

    describe('AggregateDataRange', function() {

        var aggregateDataRange;
        var numericalDataSeries;

        beforeEach(function() {
            aggregateDataRange = new Nugget.AggregateDataRange();
            numericalDataSeries = new Nugget.NumericalDataSeries([{x: 1, y: 2}]);
        });

        it('should add a DataSeries', function(done) {
            aggregateDataRange.on('add', function(e, addedDataSeries) {
                expect(addedDataSeries).toBe(numericalDataSeries);
                expect(aggregateDataRange.size()).toBe(1);
                done();
            });
            aggregateDataRange.addDataSeries(numericalDataSeries);
        });

        it('should remove a DataSeries', function(done) {
            aggregateDataRange.addDataSeries(numericalDataSeries);
            expect(aggregateDataRange.size()).toBe(1);
            aggregateDataRange.on('remove', function(e, removedDataSeries) {
                expect(removedDataSeries).toBe(numericalDataSeries);
                expect(aggregateDataRange.size()).toBe(0);
                done();
            });
            aggregateDataRange.removeDataSeries(numericalDataSeries);
        });

        it('should trigger a "change" event when a child DataSeries changes', function(done) {
            aggregateDataRange.addDataSeries(numericalDataSeries);
            aggregateDataRange.on('change', function(e, dataSeries) {
                expect(dataSeries).toBe(numericalDataSeries);
                done();
            });
            numericalDataSeries.setData([{x: 50, y: 50}]);
        });

        it('should combine all child DataSeries data', function() {
            var allData = [{x: 1, y: 2}, {x: 3, y: 4}];
            aggregateDataRange.addDataSeries( new Nugget.NumericalDataSeries([allData[0]]) );
            aggregateDataRange.addDataSeries( new Nugget.NumericalDataSeries([allData[1]]) );
            expect(aggregateDataRange.getData()).toEqual(allData);
        });

        it('should return x/y scales based on all child DataSeries', function() {
            var xMin = 0;
            var xMax = 200;
            var yMin = 1;
            var yMax = 300;

            aggregateDataRange.addDataSeries( new Nugget.NumericalDataSeries([{ x: xMin, y: yMin }]) );
            aggregateDataRange.addDataSeries( new Nugget.NumericalDataSeries([{ x: 10,   y: 20   }]) );
            aggregateDataRange.addDataSeries( new Nugget.NumericalDataSeries([{ x: 30,   y: 40   }]) );
            aggregateDataRange.addDataSeries( new Nugget.NumericalDataSeries([{ x: xMax, y: yMax }]) );

            var scales = aggregateDataRange.getScales();
            expect(scales.x.domain()).toEqual([xMin, xMax]);
            expect(scales.y.domain()).toEqual([yMin, yMax]);
        });

    });

});
