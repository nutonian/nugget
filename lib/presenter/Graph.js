import Events from '../events/Events';
import Utils from '../utils/Utils';

class Graph extends Events {
    constructor(options) {
        this.id = Utils.createUniqueId('graph_');
        this.dataSeries = options.dataSeries;
        this.color = options.color || '#000';
    }
    drawElement(svg) {
        throw 'You must implement me';
    }
}

export default Graph;