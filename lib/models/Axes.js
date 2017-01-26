const AXIS_TYPES = {
    DATETIME: Symbol('DATETIME'),
    NUMERICAL: Symbol('NUMERICAL'),
    ORDINAL: Symbol('ORDINAL')
};

const getScaleForAxisType = (axisType) => {
    switch (axisType) {
        case AXIS_TYPES.DATETIME:
            return d3.time.scale.utc();
        case AXIS_TYPES.NUMERICAL:
            return d3.scale.linear();
        case AXIS_TYPES.ORDINAL:
            return d3.scale.ordinal();
        default:
            throw Error(`Unknown axis type '${axisType}'`);
    }
};

export default {
    AXIS_TYPES,
    getScaleForAxisType
};
