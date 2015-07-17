var config = {
    ScatterGraph: {
        radius: 5
    }
};

var configModule = {
    getConfig: function() {
        return config;
    },

    setConfig: function(opts) {
        Object.assign(config, opts);
    }
};

export default configModule;
