import Events from '../events/Events';
import Utils from '../utils/Utils';

class Graph extends Events {
    constructor(options) {
        super();

        this.xRange = null;
        this.yRange = null;
        this.id = Utils.createUniqueId('graph_');
        this.dataSeries = options.dataSeries;
        this.color = options.color || '#000';
        this.inserts = options.inserts || null;
    }

    drawElement(d3Svg, xRange, yRange) {
        this.xRange = xRange;
        this.yRange = yRange;

        var selector = `g[data-id="${this.id}"]`;
        this.d3Svg  = d3Svg.selectAll(selector).data([this.id]);

        this.d3Svg.enter().append('g').attr('data-id', this.id);
        this.d3Svg.exit().remove();
        this.draw();
    }

    remove() {
        this.d3Svg.remove();
        delete this.d3Svg;
    }

    draw() {
        throw 'draw() must be implemented';
    }

    _applyInserts(selection) {
        if (this.inserts) {
            return this.inserts(selection);
        }
        return selection;
    }
}

export default Graph;
