/**
 * Created by argulworm on 6/14/17.
 */

var dt = dt || {};

dt.main = function () {
    dt.global.context = new dt.Context(0);
    var mapConfig = {
        width: 20,
        height: 20,
        minRoomNumber: 6,
        maxRoomNumber: 9,
        minRoomWidth: 3,
        maxRoomWidth: 6,
        minRoomHeight: 3,
        maxRoomHeight: 6,
        maxTryTimes: 10
    };
    var rooms = dt.mapgen.generateMapLevel(mapConfig, dt.global.context);
};

dt.main();