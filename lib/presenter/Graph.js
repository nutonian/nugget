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
        this.guides = (options.guides === false) ? false : true;
    }

    // sub-classes can override this for any additional padding they require
    static ExtraXPadding() {
        return 0;
    }

    static ExtraYPadding() {
        return 0;
    }

    drawElement(d3Svg, xRange, yRange) {
        this.xRange = xRange;
        this.yRange = yRange;

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

    // Implement an optional drawLegend menu for graphs to add entries to the main legend container
    createLegend(legendContainer, width, height, options) {
        if (!this.drawLegend) { return; }
        var el = legendContainer.append('g').attr('class', 'legend_group');
        this.drawLegend(el, width, height, options);
    }

    // Call this from drawLegend to add a standard background:
    drawLegendBg(container) {
        container.append('rect')
            .attr('class', 'legend_bg')
            .attr('width', '100%')
            .attr('height', '100%');
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
