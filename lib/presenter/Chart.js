import Events from '../events/Events';
import Graph from './Graph';

class Chart extends Events {
    constructor(options) {
        this._childElementMap = {};

        this._constructElement();
    }
    _constructElement() {
        //this is an in memory svg, so we can render in one go
        this._svg = document.createElement('svg');
    }
    appendTo(selector) {
        var select = selector || this.el;
        var element = document.querySelectorAll(select)[0];
        var elementName = element.nodeName;
        if (elementName != null) {
            if (elementName.toLowerCase() !== 'svg') {
                element.appendChild(this._svg);
            } else if (elementName.toLowerCase() === 'svg') {
                element.appendChild(this.getHtml());
            }
        }
    }
    getHtml() {
        return this._svg.innerHTML;
    }
    add(nuggetView) {
        if (this.checkInstance(nuggetView)) {
            // internal map of child elements for cleanup and rendering purposes.
            this._childElementMap[nuggetView.id] = nuggetView;
            nuggetView.drawElement(this._svg);
        } else {
            throw 'Must be a valid Nugget View type';
        }
    }
    checkInstance(nuggetView) {
        return nuggetView instanceof Graph;
    }
}
export default Chart;
