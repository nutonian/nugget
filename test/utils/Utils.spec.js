define([
        'Nugget',
        '../../../dependencies/d3'
    ],
    function (
        Nugget,
        d3
    ) {
        describe('Utils', function () {

            describe('closest', function() {

                it('should find the closest number in an array of numbers', function() {
                    var nums = [1, 2, 2.5, 3];

                    expect(Nugget.Utils.closest(0,   nums)).toBe(1);
                    expect(Nugget.Utils.closest(2.1, nums)).toBe(2);
                    expect(Nugget.Utils.closest(2.4, nums)).toBe(2.5);
                    expect(Nugget.Utils.closest(2.5, nums)).toBe(2.5);
                    expect(Nugget.Utils.closest(2.6, nums)).toBe(2.5);
                    expect(Nugget.Utils.closest(2.9, nums)).toBe(3);
                    expect(Nugget.Utils.closest(4,   nums)).toBe(3);

                    expect(Nugget.Utils.closest(-12389327, nums)).toBe(1);
                    expect(Nugget.Utils.closest(1239321321, nums)).toBe(3);
                });

                it('should find the closest number in an array of objects', function() {
                    var arr = [{x: 1}, {x: 2}, {x: 3}];

                    expect(Nugget.Utils.closest(0,   arr, 'x')).toEqual({x: 1});
                    expect(Nugget.Utils.closest(1.9, arr, 'x')).toEqual({x: 2});
                    expect(Nugget.Utils.closest(2.1, arr, 'x')).toEqual({x: 2});
                    expect(Nugget.Utils.closest(10,  arr, 'x')).toEqual({x: 3});
                });

            });
        });
    });
