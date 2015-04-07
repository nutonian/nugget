define([
        'Nugget',
        '../../../dependencies/d3'
    ],
    function (
        Nugget
    ) {
        describe('Graph Tests', function () {

            var dataSeries;
            var graph;

            beforeEach(function() {
                dataSeries = new Nugget.DataSeries([
                    {x: 0, y: 1},
                    {x: 1, y: 2},
                    {x: 2, y: 3}
                ]);
                graph = new Nugget.Graph({
                    dataSeries: dataSeries
                });
            });

            afterEach(function() {
                graph = null;
            });

            it('should optionally add transitions', function () {
                // No transition by default
                var el = document.createElement('div');
                var d3El = d3.select(el);
                expect(graph.applyTransition(d3El)).toEqual(d3El);

                // Set some transition items
                var delay = 1;
                function getDelay() { return delay; }

                var duration = 5;
                function getDuration() { return duration; }

                graph.setTransition([
                    ['delay', getDelay],
                    ['duration', getDuration]
                ]);

                var res = graph.applyTransition(d3El);
                expect(res.delay()).toBe(delay);
                expect(res.duration()).toBe(duration);

                // Remove transitions
                graph.setTransition(null);
                res = graph.applyTransition(d3El);
                expect(res.delay).toBeUndefined();
                expect(res.duration).toBeUndefined();
            });

        });
    });
