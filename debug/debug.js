/**
 * Created by argulworm on 6/17/17.
 */

dt.debug = {
    _VERBOSE: true,
    verbose: function () {
        if (!this._VERBOSE) {
            return;
        }
        if (1 == arguments.length) {
            dt.suger.print(arguments[0]);
        }
        else {
            var t = [];
            for (var i = 0; i < arguments.length; i++) {
                if (dt.suger.isArray(arguments[i]) || dt.suger.isObject(arguments[i])) {
                    t.push(JSON.stringify(arguments[i], null, 2));
                }
                else {
                    t.push(arguments[i]);
                }
            }
            dt.suger.print(t.join('  '));
        }
    },

    assert: function (c) {
        if (!c) {
            throw 'assert failure!';
        }
    },

    dumpAscIIMap: function (mapLevel) {
        var asciiMap = dt.suger.shallowCopy(mapLevel);
        asciiMap.reverse();

        dt.suger.print('==========================================');
        dt.functional.foreach(function (line) {
            line = dt.functional.map(function (x) {
                switch (x) {
                    case dt.mapconst.TILE_WALL:
                        return '*';
                    case dt.mapconst.TILE_CORRIDOR:
                        return ' ';
                    case dt.mapconst.TILE_ROOMFLOOR:
                        return '#';
                    case dt.mapconst.TILE_STAIR_UPWARD:
                        return '↑';
                    case dt.mapconst.TILE_STAIR_DOWNWARD:
                        return '↓';
                    default:
                        return x;
                }
            }, line);
            dt.suger.print(line.join(''));
        }, asciiMap);
        dt.suger.print('==========================================');
    }
};
