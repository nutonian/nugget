import Utils from '../utils/Utils';
import LegendData from '../models/LegendData';
import GuideLayer from './GuideLayer';
import Config from '../config/Config';

class Graph extends GuideLayer {
    constructor(options) {
        super();

        this.id = Utils.createUniqueId('graph_');

        this.dataSeries = options.dataSeries;
        this.color      = options.color || '#000';
        this.inserts    = options.inserts || null;
        this.guides     = (options.guides === false) ? false : true;
        this.legendData = new LegendData();
        this.shouldAnimate = options.shouldAnimate || false;

        this.config = Config.getConfig();

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

    drawElement(d3Svg, xRange, yRange, axisLabels, shouldAnimate = true) {
        this.xRange = xRange;
        this.yRange = yRange;
        this.axisLabels = axisLabels;

        var selector = `g[data-id="${this.id}"]`;
        this.d3Svg = d3Svg.selectAll(selector).data([this.id]);

        this.d3Svg.enter().append('g').attr('data-id', this.id);
        this.d3Svg.exit().remove();

        // By default animation is enabled. Users can disable it
        // either by a constructor option or function argument when drawing
        shouldAnimate = shouldAnimate && this.shouldAnimate;
        this.draw(shouldAnimate);
    }

    remove() {
        this.d3Svg.remove();
        delete this.d3Svg;
    }

    draw() {
        throw 'draw() must be implemented';
    }

    setConfig(config) {
        this.config = config;
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
