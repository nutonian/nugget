Object.defineProperty(SVGElement.prototype, 'outerHTML', {
    get: function () {
        var $node, $temp;
        $temp = document.createElement('div');
        $node = this.cloneNode(true);
        $temp.appendChild($node);
        return $temp.innerHTML;
    },
    enumerable: false,
    configurable: true
});
