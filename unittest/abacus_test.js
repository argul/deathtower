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

    var ins = new dt.AbacusGameloop({
        abacusId: 'test',
        seed: 0,
        mapConfig: mapConfig,
        maxLevel: 1,
        visRange: 5,
        teamEnterData: new dt.TeamEnterData(),
        customized: {
            strategy: dt.mapAIStrategy.NORMAL
        }
    });

    var tmp = [];
    var step = 0;
    var endloop = function (x) {
        if (step > 20) return true;
        if (x.behaviorCode == dt.behaviorCode.DEFEATED) return true;
        if (x.behaviorCode == dt.behaviorCode.LEAVE_TOWER) return true;
        return false;
    };
    do {
        var b = ins.tick();
        tmp.push(b);
        step += 1;
    } while (!endloop(b));
};