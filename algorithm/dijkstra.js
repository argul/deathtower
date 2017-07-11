/**
 * Created by argulworm on 7/7/17.
 */

dt.dijkstra = {
    simpleSeekAll: function (mapLevel, posX, posY, judgeConnect) {
        if (!dt.isFunction(judgeConnect)) {
            judgeConnect = function (m, x, y) {
                return m.getTile(x, y) < dt.mapconst.TILE_NOPASS;
            };
        }
        var ret = dt.suger.genMatrix2D(mapLevel.width, mapLevel.height, -1);
        ret[posY][posX] = 0;
        var visitQueue = [{x: posX, y: posY}];
        var step = 0;
        var touch = function (x, y, step) {
            if (ret[y][x] == -1 && judgeConnect(mapLevel, x, y)) {
                ret[y][x] = step;
                return true;
            }
            else {
                return false;
            }
        };

        while (visitQueue.length > 0) {
            step += 1;
            var newadded = [];
            visitQueue.forEach(function (t) {
                if (touch(t.x + 1, t.y, step)) {
                    newadded.push({x: t.x + 1, y: t.y});
                }
                if (touch(t.x - 1, t.y, step)) {
                    newadded.push({x: t.x - 1, y: t.y});
                }
                if (touch(t.x, t.y + 1, step)) {
                    newadded.push({x: t.x, y: t.y + 1});
                }
                if (touch(t.x, t.y - 1, step)) {
                    newadded.push({x: t.x, y: t.y - 1});
                }
            });
            visitQueue = newadded;
        }
        return ret;
    }
};
