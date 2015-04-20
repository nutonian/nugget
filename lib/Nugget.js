import Chart from './presenter/Chart';
import AggregateDataRange from './models/AggregateDataRange';
import DataSeries from './models/DataSeries';
import NumericalDataSeries from './models/NumericalDataSeries';
import OrdinalDataSeries from './models/OrdinalDataSeries';
import RangeDataSeries from './models/RangeDataSeries';
import BoxPlotDataSeries from './models/BoxPlotDataSeries';
import Events from './events/Events';
import Graph from './presenter/Graph';
import LineGraph from './views/LineGraph';
import ScatterGraph from './views/ScatterGraph';
import Histogram from './views/Histogram';
import Utils from './utils/Utils';
import BoxPlot from './views/BoxPlot';
import TrendLine from './views/TrendLine';
import BarGraph from './views/BarGraph';

export default {
    Chart                 : Chart,
    AggregateDataRange    : AggregateDataRange,
    DataSeries            : DataSeries,
    NumericalDataSeries   : NumericalDataSeries,
    OrdinalDataSeries     : OrdinalDataSeries,
    RangeDataSeries       : RangeDataSeries,
    BoxPlotDataSeries     : BoxPlotDataSeries,
    Events                : Events,
    Graph                 : Graph,
    LineGraph             : LineGraph,
    ScatterGraph          : ScatterGraph,
    Histogram             : Histogram,
    Utils                 : Utils,
    BoxPlot               : BoxPlot,
    TrendLine             : TrendLine,
    BarGraph              : BarGraph
};
