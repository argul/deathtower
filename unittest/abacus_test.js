/**
 * Created by argulworm on 7/4/17.
 */

dt.abacus_test = function () {
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

    var ins = new dt.Abacus({
        seed: 0,
        mapConfig: mapConfig,
        maxLevel: 20,
        playerData: {},
        userData: {}
    });

    var tmp = [];
    do {
        var b = ins.tick();
        tmp.push(b);
    } while (b.behaviorCode != dt.behaviorCode.LEAVE_MAP);
    dt.print(tmp.length);
};