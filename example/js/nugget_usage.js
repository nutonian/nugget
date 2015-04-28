require(['Nugget'], function (Nugget) {
    var firstLineData = [{x_value:0, y_value:109999757.8664778},{x_value:1, y_value:106779721.6388779},{x_value:2, y_value:111665995.9376359},{x_value:3, y_value:105996663.4320102},{x_value:4, y_value:115071455.2300099},{x_value:5, y_value:108397157.883242},{x_value:6, y_value:116433834.0624117},{x_value:7, y_value:136997208.985154},{x_value:8, y_value:138579707.5398667},{x_value:9, y_value:140475988.7333912},{x_value:10, y_value:156560060.3824675},{x_value:11, y_value:139632779.227497},{x_value:12, y_value:147546223.9289148},{x_value:13, y_value:153771873.9646711},{x_value:14, y_value:140709363.8559364},{x_value:15, y_value:144721252.4631877},{x_value:16, y_value:149301233.5944469},{x_value:17, y_value:150974108.0415197},{x_value:18, y_value:153802149.4993924},{x_value:19, y_value:171151539.1469471},{x_value:20, y_value:173502084.4766503},{x_value:21, y_value:172188776.5859639},{x_value:22, y_value:179149509.1486047},{x_value:23, y_value:186879430.7857467},{x_value:24, y_value:192187316.7797057},{x_value:25, y_value:185803694.0846438},{x_value:26, y_value:184480795.955287},{x_value:27, y_value:204584522.0997752},{x_value:28, y_value:206339583.2021945},{x_value:29, y_value:243572891.9825011},{x_value:30, y_value:197881630.1022548},{x_value:31, y_value:247851984.4294895},{x_value:32, y_value:214121152.9482067},{x_value:33, y_value:231633052.7234426},{x_value:34, y_value:206021196.4689243},{x_value:35, y_value:222553611.533971},{x_value:36, y_value:225103953.4755973},{x_value:37, y_value:233568495.283652},{x_value:38, y_value:246121887.8550515},{x_value:39, y_value:241033320.182694},{x_value:40, y_value:244486081.1254737},{x_value:41, y_value:231584570.0926241},{x_value:42, y_value:234060917.3259035},{x_value:43, y_value:248991372.6070648},{x_value:44, y_value:243621615.2239356},{x_value:45, y_value:258972455.6010689},{x_value:46, y_value:250017846.0657753},{x_value:47, y_value:261595923.7670837},{x_value:48, y_value:252031474.3269976},{x_value:49, y_value:276434335.4621446},{x_value:50, y_value:280925200.0913997},{x_value:51, y_value:274802570.3085809},{x_value:52, y_value:262295266.1490588},{x_value:53, y_value:284722282.7329178},{x_value:54, y_value:302165695.6766742}];
    var secondLineData = [{x_value:0, y_value:126412005.81},{x_value:1, y_value:124576628.2},{x_value:2, y_value:124355632.46},{x_value:3, y_value:119161109.51},{x_value:4, y_value:116220428.79},{x_value:5, y_value:114186327.07},{x_value:6, y_value:124303863.47},{x_value:7, y_value:134217518.47},{x_value:8, y_value:138580084.54},{x_value:9, y_value:149871362.93},{x_value:10, y_value:143025404.03},{x_value:11, y_value:134500546.44},{x_value:12, y_value:140895088.07},{x_value:13, y_value:131480362.7},{x_value:14, y_value:130423483.78},{x_value:15, y_value:136420620.54},{x_value:16, y_value:138996828.89},{x_value:17, y_value:142074940.3},{x_value:18, y_value:153795207.9},{x_value:19, y_value:158691278.4},{x_value:20, y_value:161405808.85},{x_value:21, y_value:181799365.4},{x_value:22, y_value:196331839.19},{x_value:23, y_value:210762987.98},{x_value:24, y_value:238296598.3},{x_value:25, y_value:254090344.55},{x_value:26, y_value:258279753.65},{x_value:27, y_value:267610498.27},{x_value:28, y_value:258813183.01},{x_value:29, y_value:255933999.39},{x_value:30, y_value:253573546.15},{x_value:31, y_value:247196208.49},{x_value:32, y_value:233635458.68},{x_value:33, y_value:229407021.82},{x_value:34, y_value:222519155.75},{x_value:35, y_value:219898744.17},{x_value:36, y_value:221014334.89},{x_value:37, y_value:236337186.66},{x_value:38, y_value:246489230.57},{x_value:39, y_value:249146539.17},{x_value:40, y_value:244444936.19},{x_value:41, y_value:236984470.13},{x_value:42, y_value:231318369.54},{x_value:43, y_value:231664187.1},{x_value:44, y_value:240881767.16},{x_value:45, y_value:251104030.69},{x_value:46, y_value:257983726.56},{x_value:47, y_value:262624132.29},{x_value:48, y_value:268552385.3},{x_value:49, y_value:273768168.53},{x_value:50, y_value:269105941.33},{x_value:51, y_value:272156831.68},{x_value:52, y_value:271325640.84},{x_value:53, y_value:279231898.28},{x_value:54, y_value:286906416.78}];

    var data1 = new Nugget.NumericalDataSeries(firstLineData);
    var data2 = new Nugget.NumericalDataSeries(secondLineData);

    var lineGraphData1 = [ { "x_value": 0, "y_value": 0 }  , { "x_value": 50, "y_value": 50 }, { "x_value": 0, "y_value": 100 } ];
    var lineGraphData2 = [ { "x_value": 0, "y_value": 100 }, { "x_value": 50, "y_value": 50 }, { "x_value": 100, "y_value": 0 } ];
    var dataSeries1 = new Nugget.NumericalDataSeries(lineGraphData1);
    var dataSeries2 = new Nugget.NumericalDataSeries(lineGraphData2);

    var chart = new Nugget.Chart({
        axisLabels: {
            x_value: 'row',
            y_value: 'value'
        }
    });

    var line1 = new Nugget.LineGraph({
        dataSeries: dataSeries1,
        color: 'green'
    });

    var line2 = new Nugget.LineGraph({
        dataSeries: dataSeries2,
        color: '#09e'
    });

    chart.add(line1);
    chart.add(line2);

    chart.appendTo('#line_graph_nugget');
});
