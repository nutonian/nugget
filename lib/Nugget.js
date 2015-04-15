import Chart from './presenter/Chart';
import NumericalDataSeries from './models/NumericalDataSeries';
import OrdinalDataSeries from './models/OrdinalDataSeries';
import RangeDataSeries from './models/RangeDataSeries';
import Events from './events/Events';
import Graph from './presenter/Graph';
import LineGraph from './views/LineGraph';
import ScatterGraph from './views/ScatterGraph';
import Histogram from './views/Histogram';

export default {
    Chart                 : Chart,
    NumericalDataSeries   : NumericalDataSeries,
    OrdinalDataSeries     : OrdinalDataSeries,
    RangeDataSeries       : RangeDataSeries,
    Events                : Events,
    Graph                 : Graph,
    LineGraph             : LineGraph,
    ScatterGraph          : ScatterGraph,
    Histogram             : Histogram
};
