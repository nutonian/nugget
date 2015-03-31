define(['Nugget'], function(Nugget) {
    describe('Modules', function () {
        it('should have a bunch of modules', function() {
            expect(Nugget.DataSeries).toBeDefined();
            expect(Nugget.Chart).toBeDefined();
            expect(Nugget.LineGraph).toBeDefined();
        });
    });
});
