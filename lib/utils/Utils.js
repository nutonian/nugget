var Utils = {
    idCounter: 0,
    createUniqueId: function(prefix) {
        var id = ++this.idCounter + '';
        return prefix ? prefix + id : id;
    }
};

export default Utils;