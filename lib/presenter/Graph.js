import Events from '../events/Events';
import Utils from '../utils/Utils';

class Graph extends Events {
    constructor(options) {
        super();

        this.id = Utils.createUniqueId('graph_');
        this.dataSeries = options.dataSeries;
        this.color = options.color || '#000';

        this._transition = null;

        this.setTransition(options.transition);
    }
    drawElement(svg) {
        throw 'drawElement() must be implemented';
    }
    setTransition(blocks) {
        /*
        *   Blocks: [[functionName, arg1, arg2, ...], ...]
        *
        *   Ex:
        *   [
        *       ['ease', 'back'],
        *       ['duration', function() { return 500; }]
        *   ]
        *
        */
        this._transition = blocks;
    }
    applyTransition(d3El) {
        if (!this._transition) {
            return d3El;
        }

        var trans = d3El.transition();
        this._transition.forEach(function(vals) {
            var fn = vals[0];
            var args = vals.slice(1);
            trans[fn].apply(trans, args);
        });
        return trans;
    }
    remove() {
        throw 'remove() must be implemented';
    }
}

export default Graph;
