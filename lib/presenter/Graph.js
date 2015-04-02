import Events from '../events/Events';
import Utils from '../utils/Utils';

class Graph extends Events {
    constructor() {
        this.id = Utils.createUniqueId('graph_');
    }
    drawElement(svg) {
        throw 'You must implement me';
    }
}

export default Graph;