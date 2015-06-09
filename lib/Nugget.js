import Events from './events/Events';
import Utils from './utils/Utils';

import AggregateDataRange from './models/AggregateDataRange';
import BinnedMeanDataSeries from './models/BinnedMeanDataSeries';
import BoxPlotDataSeries from './models/BoxPlotDataSeries';
import DataSeries from './models/DataSeries';
import NumericalDataSeries from './models/NumericalDataSeries';
import OrdinalDataSeries from './models/OrdinalDataSeries';
import RangeDataSeries from './models/RangeDataSeries';

import Chart from './presenter/Chart';

import Graph from './views/Graph';
import BarGraph from './views/BarGraph';
import BinnedMeanGraph from './views/BinnedMeanGraph';
import BoxPlot from './views/BoxPlot';
import Histogram from './views/Histogram';
import LegendView from './views/LegendView';
import LineGraph from './views/LineGraph';
import ScatterGraph from './views/ScatterGraph';
import TrendLine from './views/TrendLine';

export default {
    Events                : Events,
    Utils                 : Utils,

    AggregateDataRange    : AggregateDataRange,
    BinnedMeanDataSeries  : BinnedMeanDataSeries,
    BoxPlotDataSeries     : BoxPlotDataSeries,
    DataSeries            : DataSeries,
    NumericalDataSeries   : NumericalDataSeries,
    OrdinalDataSeries     : OrdinalDataSeries,
    RangeDataSeries       : RangeDataSeries,

    Chart                 : Chart,
    Graph                 : Graph,

    BarGraph              : BarGraph,
    BinnedMeanGraph       : BinnedMeanGraph,
    BoxPlot               : BoxPlot,
    Histogram             : Histogram,
    LegendView            : LegendView,
    LineGraph             : LineGraph,
    ScatterGraph          : ScatterGraph,
    TrendLine             : TrendLine
};
