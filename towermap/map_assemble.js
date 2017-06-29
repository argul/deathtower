/**
 * Created by argulworm on 6/29/17.
 */

dt.mapassemble = {
    makeStairs: function (mapLevel, rooms, ctx) {
        var availList = [];
        dt.functional.for2DMatrix(function (idx0, idx1, tile) {
            if (tile == dt.mapconst.TILE_CORRIDOR) {
                availList.push(idx1 * 10000 + idx0);
            }
        }, mapLevel);
        dt.functional.foreach(function (r) {
            for (var i = r.x + 1; i <= r.x + r.width - 2; i++) {
                availList.push(i * 10000 + r.y + 1);
                availList.push(i * 10000 + r.y + r.height - 2);
            }
            for (var i = r.y + 2; i <= r.y + r.height - 3; i++) {
                availList.push((r.x + 1) * 10000 + i);
                availList.push((r.x + r.width - 2) * 10000 + i);
            }
        }, rooms);
        dt.debug.assert(availList.length >= 2);
        dt.suger.shuffle(availList, ctx);
        var up = {
            x: Math.floor(availList[0] / 10000),
            y: availList[0] % 10000
        };
        var down = {
            x: Math.floor(availList[1] / 10000),
            y: availList[1] % 10000
        };
        mapLevel[up.y][up.x] = dt.mapconst.TILE_STAIR_UPWARD;
        mapLevel[down.y][down.x] = dt.mapconst.TILE_STAIR_DOWNWARD;
        return {
            up: up,
            down: down
        }
    },

    makeTreasures: function () {

    },

    makeTraps: function () {

    },

    makeMonsters: function () {

    }
};
