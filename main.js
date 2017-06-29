/**
 * Created by argulworm on 6/14/17.
 */

var dt = dt || {};

dt.test = function () {
    dt.global.context = new dt.Context(0);
    var mapConfig = {
        width: 31,
        height: 31,
        minRoomNumber: 7,
        maxRoomNumber: 10,
        minRoomWidth: 5,
        maxRoomWidth: 11,
        minRoomHeight: 5,
        maxRoomHeight: 11,
        scatterRoomTrys: 30,
        doorNumProbability: [0.4, 0.4, 0.15, 0.05]
    };

    var map = dt.mapgen.generateMapLevel(mapConfig, dt.global.context);
    var stairs = dt.mapassemble.makeStairs(map.mapLevel, map.rooms, dt.global.context);
    dt.debug.dumpAscIIMap(map.mapLevel);
};

dt.test();