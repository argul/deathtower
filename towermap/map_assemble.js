/**
 * Created by argulworm on 6/29/17.
 */

dt.mapassemble = {
    makeStairs: function (mapLevel, rnd) {
        var availList = [];
        mapLevel.foreachTile(function (x, y, tile) {
            if (tile == dt.tileconst.TILE_CORRIDOR) {
                availList.push(x * 10000 + y);
            }
        });
        mapLevel.getRoomArr().forEach(function (r) {
            for (var i = r.x + 1; i <= r.x + r.width - 2; i++) {
                availList.push(i * 10000 + r.y + 1);
                availList.push(i * 10000 + r.y + r.height - 2);
            }
            for (var i = r.y + 2; i <= r.y + r.height - 3; i++) {
                availList.push((r.x + 1) * 10000 + i);
                availList.push((r.x + r.width - 2) * 10000 + i);
            }
        });
        dt.assert(availList.length >= 2);
        dt.suger.shuffle(availList, rnd);
        var up = {
            x: Math.floor(availList[0] / 10000),
            y: availList[0] % 10000
        };
        var down = {
            x: Math.floor(availList[1] / 10000),
            y: availList[1] % 10000
        };
        mapLevel.setTile(up.x, up.y, dt.tileconst.TILE_STAIR_UPWARD);
        mapLevel.setTile(down.x, down.y, dt.tileconst.TILE_STAIR_DOWNWARD);
        return {
            up: up,
            down: down
        }
    },

    makeStairs_BossLevel: function () {

    },

    makeTreasures: function () {

    },

    makeTraps: function () {

    },

    makeMonsters: function () {

    },
    
    makeMonsters_BossLevel: function () {
        
    }
};
