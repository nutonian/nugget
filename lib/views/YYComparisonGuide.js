import Utils from '../utils/Utils';
//import LineGraph from './LineGraph';
import GuideLayer from './GuideLayer';

class YYComparisonGuide extends GuideLayer {
    init(guideEl, chart) {
        var mainEl  = chart.d3Svg;
        var margins = chart.margins;
        var padding = chart.padding;
        var zoomX   = chart.zoomX;
        var zoomY   = chart.zoomY;
        var height  = chart.height;

        var guideLayer = this;

        function updateGuides() {
            /*jshint validthis:true */
            var mouse = d3.mouse(this);

            // Snap to the point with the closest x_value
            var mouseX = mouse[0];
            var currX = Math.round( chart.xRange.invert(mouseX) );

            var allData = chart._aggregateDataRange.getData();
            var allXValues = allData.map(d => d.x_value);
            var snappedX = Utils.closest(currX, allXValues);

            if (snappedX == null) {
                return guideLayer.removeGuides(guideEl);
            }

            chart._childElementMap.forEach(nuggetView => {
                nuggetView.drawYGuide(snappedX, guideEl, chart);
            });

            /**
             * X Guide
             **/

            var xGuideData = [{x: snappedX, y: chart.yRange.invert(margins.top)}];

            var xGuideSelection = guideEl.selectAll('.x_guide--full_length').data(xGuideData);

            var xGuideEnterSelection = xGuideSelection.enter()
                .append('g')
                .attr('class', 'axis_guide x_guide--full_length');

            var yLabelMargin = 4;
            guideLayer.drawXLineGuide(xGuideSelection, xGuideEnterSelection, chart, {
                labelY: height - margins.bottom - yLabelMargin
            });

            /**
             * Zoom
             **/

            zoomX.on('zoom.projection_guides', () => updateGuides.call(this));
            zoomY.on('zoom.projection_guides', () => updateGuides.call(this));

            /**
             * Constraints
             **/

            var xMin = margins.left + padding;
            var xMax = chart.width - margins.right - padding;

            if (mouseX < xMin || mouseX > xMax) {
                guideLayer.removeGuides(guideEl, chart);
            }
        }

        mainEl.on('mousemove.projection_guides', updateGuides);
        mainEl.on('mouseleave.projection_guides', function() {
            guideLayer.removeGuides(guideEl, chart);
        });

    }

    removeGuides(guideEl, chart) {

        chart._childElementMap.forEach(nuggetView => {
            nuggetView.removeYLineGuide(guideEl);
        });

        var axisGuides = guideEl.selectAll('.x_guide--full_length').data([]);
        axisGuides.exit().remove();
    }

}

export default YYComparisonGuide;
