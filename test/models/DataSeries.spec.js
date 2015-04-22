define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {

    describe('DataSeries', function() {

        var dataSeries;

        beforeEach(function() {
            dataSeries = new Nugget.DataSeries();
        });

        it('should set data', function(done) {
            var data = [{x: 1, y: 1}];
            dataSeries.on('change', function(e) {
                expect(dataSeries.data).toEqual(data);
                done();
            });
            expect(dataSeries.data).toEqual([]);
            dataSeries.setData(data);
        });

        it('should silently set data', function() {
            var callbacks = {
                'onChange': function(e) {}
            };
            spyOn(callbacks, 'onChange');
            dataSeries.setData([1, 2, 3], { silent: true });
            expect(callbacks.onChange).not.toHaveBeenCalled();
        });

        it('should get a copy of its data', function() {
            var data = [1, 2, 3];
            dataSeries.setData(data);
            var dataCopy = dataSeries.getDataCopy();
            expect(dataCopy).toEqual(data);
            expect(dataCopy).not.toBe(data);
        });

        function addCheck(NuggetModule, name) {
            describe(name, function() {
                it('should implement all required DataSeries methods and calls', function() {
                    var ctor = NuggetModule.prototype.constructor;
                    var scales = ctor.ComputeScales([]);
                    expect(scales.x).toBeDefined();
                    expect(scales.y).toBeDefined();

                    var rangeMethod = ctor.GetRangeMethod();
                    expect(typeof rangeMethod).toBe('string');
                });
            });
        }
        for (var name in Nugget) {
            var NuggetModule = Nugget[name];
            if (Nugget.DataSeries.isPrototypeOf(NuggetModule)) {
                addCheck(NuggetModule, name);
            }
        }

    });

});
