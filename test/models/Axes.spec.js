define([
    'Nugget',
],
function (
    Nugget
) {
    describe('Axes', function() {

        var AXIS_TYPES = Nugget.Axes.AXIS_TYPES;
        var getScaleForAxisType = Nugget.Axes.getScaleForAxisType;

        describe('getScaleForAxisType', function() {

            // Method for identifying type of D3 scale from
            // http://stackoverflow.com/a/30750962

            it('should return a time scale for datetime axes', function() {
                var scale = getScaleForAxisType(AXIS_TYPES.DATETIME);
                expect(scale.domain([1, 2]).range([1, 2]).invert(1.5)).toEqual(jasmine.any(Date));
            });

            it('should return a linear scale for numerical axes', function() {
                var scale = getScaleForAxisType(AXIS_TYPES.NUMERICAL);
                expect(scale.domain([1, 2]).range([1, 2]).invert(1.5)).toEqual(1.5);
            });

            it('should return an ordinal scale for ordinal axes', function() {
                var scale = getScaleForAxisType(AXIS_TYPES.ORDINAL);
                expect(scale.domain([1, 2]).range([1, 2])(1.5)).toEqual(1);
            });

            it('should throw an error for unknown axes', function() {
                expect(getScaleForAxisType.bind(null, 'notarealaxistype')).toThrow();
            });

        });
    });

});
