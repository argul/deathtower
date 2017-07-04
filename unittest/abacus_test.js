/**
 * Created by argulworm on 7/4/17.
 */

dt.abacus_test = function () {
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
        t.push(b);
    } while (b.behaviorCode != dt.behaviorCode.DIE && b.behaviorCode != dt.behaviorCode.GOTO_NEXT_MAP);
    dt.print(tmp);
};