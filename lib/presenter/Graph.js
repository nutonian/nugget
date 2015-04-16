import Events from '../events/Events';
import Utils from '../utils/Utils';

class Graph extends Events {
    constructor(options) {
        super();

        this.el = null;
        this.xRange = null;
        this.yRange = null;
        this.id = Utils.createUniqueId('graph_');
        this.dataSeries = options.dataSeries;
        this.color = options.color || '#000';
        this.inserts = options.inserts || null;
    }

    drawElement(d3Svg, xRange, yRange) {
        this.d3Svg  = d3Svg;
        this.xRange = xRange;
        this.yRange = yRange;

        if (!this.el) {
            this.draw();
        } else {
            this.update();
        }
    }

    remove() {
        this.el.remove();
        delete this.el;
    }

    draw() {
        throw 'draw() must be implemented';
    }

    update() {
        throw 'update() must be implemented';
    }

    _applyInserts(selection) {
        if (this.inserts) {
            return this.inserts(selection);
        }
        return selection;
    }
}

export default Graph;
