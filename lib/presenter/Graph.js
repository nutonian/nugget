import Events from '../events/Events';
import Utils from '../utils/Utils';
import LegendData from '../models/LegendData';

class Graph extends Events {
    constructor(options) {
        super();

        this.id = Utils.createUniqueId('graph_');

        this.dataSeries = options.dataSeries;
        this.color      = options.color || '#000';
        this.inserts    = options.inserts || null;
        this.guides     = (options.guides === false) ? false : true;
        this.legendData = new LegendData();

        this.xRange = null;
        this.yRange = null;
    }

    // sub-classes can override this for any additional padding they require
    static ExtraXPadding() {
        return 0;
    }

    static ExtraYPadding() {
        return 0;
    }

    drawElement(d3Svg, xRange, yRange, axisLabels) {
        this.xRange = xRange;
        this.yRange = yRange;
        this.axisLabels = axisLabels;

        var selector = `g[data-id="${this.id}"]`;
        this.d3Svg = d3Svg.selectAll(selector).data([this.id]);

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

    initGuides(container, opts) {
        if (this.guides) {
            this.drawGuides(container, opts);
        }
    }

    drawGuides(container, opts) {
        // optional
    }

    _applyInserts(selection) {
        if (this.inserts) {
            return this.inserts(selection);
        }
        return selection;
    }
}

export default Graph;
