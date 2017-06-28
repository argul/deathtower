/**
 * Created by argulworm on 6/14/17.
 */

var dt = dt || {};

dt.main = function () {
    dt.global.context = new dt.Context(5);
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

    dt.mapgen.generateMapLevel(mapConfig, dt.global.context);
};

dt.main();