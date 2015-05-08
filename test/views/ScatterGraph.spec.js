define([
    'Nugget',
    '../../../dependencies/d3'
],
function (
    Nugget,
    d3
) {
    describe('Scatter Plot Tests', function () {
        var data = [{x_value: 0, y_value: 10},{x_value: 1, y_value: 16},{x_value: 2, y_value: 11},{x_value: 3, y_value: 12},{x_value: 4, y_value: 19},{x_value: 5, y_value: 20},{x_value: 6, y_value: 13},{x_value: 7, y_value: 15},{x_value: 8, y_value: 18},{x_value: 9, y_value: 25},{x_value: 10, y_value: 27},{x_value: 11, y_value: 26},{x_value: 12, y_value: 30},{x_value: 13, y_value: 25}];

        var svg = document.createElement('svg');
        svg.setAttribute('id', 'foo');

        beforeEach(function() {
            document.body.insertBefore(svg, document.body.firstChild);
        });

        afterEach(function() {
            svg.parentElement.removeChild(svg);

        });

        it('should render a scatter graph', function() {
            var dataSeries = new Nugget.NumericalDataSeries(data);

            var chart = new Nugget.Chart();

            var circles = new Nugget.ScatterGraph({
                dataSeries: dataSeries,
                color: 'orange'
            });

            chart.add(circles);

            chart.appendTo('#foo');

            var renderedHtml = document.querySelectorAll('.point');

            expect(renderedHtml.length).toEqual(data.length);
        });

        it('should draw guides', function() {

        });
    });
});
