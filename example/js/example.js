require(['Nugget'], function (Nugget) {
    window.Nugget = Nugget;

    // data for the line, best candidates for dataseries
    var lineData = [{x:0, y:126412005.81},{x:1, y:124576628.2},{x:2, y:124355632.46},{x:3, y:119161109.51},{x:4, y:116220428.79},{x:5, y:114186327.07},{x:6, y:124303863.47},{x:7, y:134217518.47},{x:8, y:138580084.54},{x:9, y:149871362.93},{x:10, y:143025404.03},{x:11, y:134500546.44},{x:12, y:140895088.07},{x:13, y:131480362.7},{x:14, y:130423483.78},{x:15, y:136420620.54},{x:16, y:138996828.89},{x:17, y:142074940.3},{x:18, y:153795207.9},{x:19, y:158691278.4},{x:20, y:161405808.85},{x:21, y:181799365.4},{x:22, y:196331839.19},{x:23, y:210762987.98},{x:24, y:238296598.3},{x:25, y:254090344.55},{x:26, y:258279753.65},{x:27, y:267610498.27},{x:28, y:258813183.01},{x:29, y:255933999.39},{x:30, y:253573546.15},{x:31, y:247196208.49},{x:32, y:233635458.68},{x:33, y:229407021.82},{x:34, y:222519155.75},{x:35, y:219898744.17},{x:36, y:221014334.89},{x:37, y:236337186.66},{x:38, y:246489230.57},{x:39, y:249146539.17},{x:40, y:244444936.19},{x:41, y:236984470.13},{x:42, y:231318369.54},{x:43, y:231664187.1},{x:44, y:240881767.16},{x:45, y:251104030.69},{x:46, y:257983726.56},{x:47, y:262624132.29},{x:48, y:268552385.3},{x:49, y:273768168.53},{x:50, y:269105941.33},{x:51, y:272156831.68},{x:52, y:271325640.84},{x:53, y:279231898.28},{x:54, y:286906416.78}];
    var secondLineData = [{x:0, y:109999757.8664778},{x:1, y:106779721.6388779},{x:2, y:111665995.9376359},{x:3, y:105996663.4320102},{x:4, y:115071455.2300099},{x:5, y:108397157.883242},{x:6, y:116433834.0624117},{x:7, y:136997208.985154},{x:8, y:138579707.5398667},{x:9, y:140475988.7333912},{x:10, y:156560060.3824675},{x:11, y:139632779.227497},{x:12, y:147546223.9289148},{x:13, y:153771873.9646711},{x:14, y:140709363.8559364},{x:15, y:144721252.4631877},{x:16, y:149301233.5944469},{x:17, y:150974108.0415197},{x:18, y:153802149.4993924},{x:19, y:171151539.1469471},{x:20, y:173502084.4766503},{x:21, y:172188776.5859639},{x:22, y:179149509.1486047},{x:23, y:186879430.7857467},{x:24, y:192187316.7797057},{x:25, y:185803694.0846438},{x:26, y:184480795.955287},{x:27, y:204584522.0997752},{x:28, y:206339583.2021945},{x:29, y:243572891.9825011},{x:30, y:197881630.1022548},{x:31, y:247851984.4294895},{x:32, y:214121152.9482067},{x:33, y:231633052.7234426},{x:34, y:206021196.4689243},{x:35, y:222553611.533971},{x:36, y:225103953.4755973},{x:37, y:233568495.283652},{x:38, y:246121887.8550515},{x:39, y:241033320.182694},{x:40, y:244486081.1254737},{x:41, y:231584570.0926241},{x:42, y:234060917.3259035},{x:43, y:248991372.6070648},{x:44, y:243621615.2239356},{x:45, y:258972455.6010689},{x:46, y:250017846.0657753},{x:47, y:261595923.7670837},{x:48, y:252031474.3269976},{x:49, y:276434335.4621446},{x:50, y:280925200.0913997},{x:51, y:274802570.3085809},{x:52, y:262295266.1490588},{x:53, y:284722282.7329178},{x:54, y:302165695.6766742}];

    // information about the graph
    var graph = d3.select('#line_graph');

    var width = 900;
    var height = 500;
    var margins = {
        top: 20,
        bottom: 20,
        right: 20,
        left: 100
    };

    // range functions
    var xRange = d3.scale.linear().range([margins.left, width - margins.right])
                .domain([d3.min(secondLineData, function(d) {
                    return d.x;
                }), d3.max(secondLineData, function(d) {
                    return d.x;
                })]);
    var yRange = d3.scale.linear().range([height - margins.top, margins.bottom])
                .domain([d3.min(secondLineData, function(d) {
                    return d.y
                }), d3.max(secondLineData, function(d) {
                    return d.y
                })]);

    // axis rendering pieces
    var xAxis = d3.svg.axis()
                .scale(xRange)
                .tickSize(5)
                .tickSubdivide(true);
    var yAxis = d3.svg.axis()
                .scale(yRange)
                .orient('left')
                .tickSize(5)
                .tickSubdivide(true);
    graph.append('svg:g')
         .attr('class', 'x_axis')
         .attr('transform', 'translate(0,' + (height - margins.bottom) + ')')
         .call(xAxis);

    graph.append('svg:g')
         .attr('class', 'y_axis')
         .attr('transform', 'translate(' + (margins.left) + ', 0)')
         .call(yAxis);

    // line charting pieces, the line function is what interpolates the points into the screen pieces
    var lineFunc = d3.svg.line()
                   .x(function(d) {
                    return xRange(d.x);
                   })
                   .y(function(d) {
                    return yRange(d.y);
                   })
                   .interpolate('linear');

    graph.append('svg:path')
         .attr('d', lineFunc(lineData))
         .attr('stroke', '#09e')
         .attr('stroke-width', 2)
         .attr('fill', 'transparent');

    graph.append('svg:path')
         .attr('d', lineFunc(secondLineData))
         .attr('stroke', 'green')
         .attr('stroke-width', 2)
         .attr('fill', 'transparent');
});