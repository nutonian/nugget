define([
        'Nugget',
        '../../../dependencies/d3'
    ],
    function (
        Nugget,
        d3
    ) {
        describe('Graph', function () {
            function checkIfImplemented(fn, text) {
                return (fn.toString().indexOf(fn.name + '() must be implemented') === -1) ? true : false;
            }
            function checkContains(fn, text) {
                return (fn.toString().indexOf(text) > -1) ? true : false;
            }
            function addCheck(NuggetModule, name) {
                describe(name, function() {
                    it('should implement all required Graph methods and calls', function() {
                        var proto = NuggetModule.prototype;
                        expect(checkIfImplemented(proto.drawElement)).toBe(true);
                        expect(checkIfImplemented(proto.remove)).toBe(true);
                        expect(checkContains(proto.draw, '_applyInserts')).toBe(true);
                    });
                });
            }
            for (var name in Nugget) {
                var NuggetModule = Nugget[name];
                if (Nugget.Graph.isPrototypeOf(NuggetModule)) {
                    addCheck(NuggetModule, name);
                }
            }
        });
    });
