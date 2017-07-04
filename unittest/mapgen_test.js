/**
 * Created by argulworm on 7/4/17.
 */

dt.mapgen_test = function () {
    var ctx = new dt.Context(0);
    var mapConfig = {
        width: 35,
        height: 35,
        minRoomNumber: 7,
        maxRoomNumber: 10,
        minRoomWidth: 7,
        maxRoomWidth: 11,
        minRoomHeight: 5,
        maxRoomHeight: 11,
        scatterRoomTrys: 30,
        doorNumProbability: [0.4, 0.4, 0.15, 0.05]
    };

    var mapLevel = dt.mapgen.generateMapLevel(mapConfig, ctx);
    dt.mapassemble.makeStairs(mapLevel, ctx);
    dt.debug.dumpAscIIMap(mapLevel);
};