/**
 * Created by argulworm on 6/17/17.
 */

dt.debug = {
    dumpAscIIMap: function (mapConfig, rooms) {
        var asciiMap = dt.suger.genMatrix2D(mapConfig.width + 2, mapConfig.height + 2, '*');
        dt.functional.foreach(function (r) {
            for (var i = 0; i <= r.width - 1; i++) {
                for (var j = 0; j <= r.height - 1; j++) {
                    asciiMap[r.y + 1 + j][r.x + 1 + i] = ' ';
                }
            }
        }, rooms);

        asciiMap.reverse();
        dt.suger.print('==========================================');
        dt.functional.foreach(function (line) {
            dt.suger.print(line.join(''));
        }, asciiMap);
        dt.suger.print('==========================================');
    }
};
