define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('Line Graph Tests', function () {
        var data = [{x_value: 0, y_value: 10},{x_value: 1, y_value: 16},{x_value: 2, y_value: 11},{x_value: 3, y_value: 12},{x_value: 4, y_value: 19},{x_value: 5, y_value: 20},{x_value: 6, y_value: 13},{x_value: 7, y_value: 15},{x_value: 8, y_value: 18},{x_value: 9, y_value: 25},{x_value: 10, y_value: 27},{x_value: 11, y_value: 26},{x_value: 12, y_value: 30},{x_value: 13, y_value: 25}];

        var isPhantom = window.navigator.userAgent.indexOf('PhantomJS') > -1;

        if (!isPhantom) {
            return console.warn('Test currently only works in PhantomJS');
        }

        var graphPoints = 'M100,331.7073170731707L121.07692307692308,247.1219512195122L142.15384615384616,317.60975609756093L163.23076923076923,303.5121951219512L184.30769230769232,204.8292682926829L205.38461538461542,190.7317073170732L226.46153846153845,289.4146341463415L247.53846153846155,261.219512195122L268.61538461538464,218.92682926829266L289.6923076923077,120.24390243902438L310.76923076923083,92.04878048780489L331.8461538461538,106.14634146341466L352.9230769230769,49.75609756097562L374,120.24390243902438';

        var $svg;
        var chart;

        beforeEach(function() {
            $svg = $( document.createElementNS('http://www.w3.org/2000/svg', 'svg') );
            $svg.attr('id', 'container').appendTo('body');

            chart = new Nugget.Chart();
        });

        afterEach(function() {
            $('.container').remove();
            chart = null;
        });
        it('should render a line graph', function() {
            var dataseries = new Nugget.NumericalDataSeries(data);

            var line = new Nugget.LineGraph({
                dataSeries: dataseries,
                color: 'purple'
            });

            chart.add(line);

            chart.appendTo('#container');

            var $plotline = $('path.line');

            expect($plotline.length).toBe(1);

            expect($plotline.attr('d')).toBe(graphPoints);
        });
    });
});
