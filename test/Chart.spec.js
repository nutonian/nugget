define(['Nugget'], function(Nugget) {
    describe('Chart Tests', function() {

        /*
        var chart;
        beforeEach(function() {
            chart = new Nugget.Chart({
                el: '.foo'
            });
        });
        afterEach(function() {
            chart = null;
        });
        it('should be defined', function() {
            expect(Nugget.Chart).toBeDefined();
        });
        it('should have things set on instantiation', function() {
            expect(chart.el).toBe('.foo');
        });
        it('should create an in memory svg on instantiation', function() {
            var svg = chart._svg;

            expect(svg.nodeName).toBe('SVG');
        });
        it('should append an svg to a non svg element', function() {
            var element = document.createElement('div');
            element.setAttribute('class', 'foo');
            document.body.insertBefore(element, document.body.firstChild);
            chart.appendTo('.foo');
            var newElement = document.querySelectorAll('.foo')[0];

            expect(newElement.innerHTML).toBe('<svg></svg>');
        });
        it('should not append an svg to an svg', function() {
            var element = document.createElement('svg');
            element.setAttribute('class', 'foo');
            document.body.insertBefore(element, document.body.firstChild);
            chart.appendTo('.foo');
            var newElement = document.querySelectorAll('.foo')[0];

            expect(newElement.innerHTML).toBe('<svg class="foo"></svg>');
        });
        it('should return the inner html of an svg in the getHtml function', function() {
            var html = chart.getHtml();
            expect(html).toBe('');
        });
        it('should add in a child view to its internal child map', function() {
            var line = new Nugget.LineGraph({
                dataSeries: {}
            });
            chart.add(line);

            expect(chart._childElementMap[0].id).toBeDefined();
            expect(chart._childElementMap[0].obj).toEqual(line);
        });
        it('should call the childs drawElement function', function() {
            var line = new Nugget.LineGraph({
                dataSeries: {}
            });
            spyOn(line, '_drawElement');

            chart.add(line);

            expect(line._drawElement).toHaveBeenCalled();
        });
        */

    });
});
