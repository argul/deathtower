/**
 * Created by argulworm on 6/17/17.
 */

dt.assert = function (c) {
    if (!c) {
        throw 'assert failure!';
    }
};

dt.unixtime = function () {
    return new Date().getTime();
};

dt.debug = {
    isStrict: function () {
        return true;
    },
    _VERBOSE: true,
    verbose: function () {
        if (!this._VERBOSE) {
            return;
        }
        if (1 == arguments.length) {
            dt.print(arguments[0]);
        }
        else {
            var t = [];
            for (var i = 0; i < arguments.length; i++) {
                if (dt.isArray(arguments[i]) || dt.isObject(arguments[i])) {
                    t.push(JSON.stringify(arguments[i], null, 2));
                }
                else {
                    t.push(arguments[i]);
                }
            }
            dt.print(t.join('  '));
        }
    },

    dumpPref: function (token, f) {
        var stub = dt.unixtime();
        f();
        dt.print('[dumpPref][' + token + ']:' + (dt.unixtime() - stub));
    },

    dumpAscIIMap: function (mapLevel) {
        var asciiMap = dt.suger.shallowCopy(mapLevel.tiles);
        asciiMap.reverse();

        dt.print('==========================================');
        asciiMap.forEach(function (line) {
            line = line.map(function (x) {
                switch (x) {
                    case dt.tileconst.TILE_WALL:
                        return '*';
                    case dt.tileconst.TILE_CORRIDOR:
                        return ' ';
                    case dt.tileconst.TILE_ROOMFLOOR:
                        return '#';
                    case dt.tileconst.TILE_STAIR_UPWARD:
                        return '↑';
                    case dt.tileconst.TILE_STAIR_DOWNWARD:
                        return '↓';
                    default:
                        return x;
                }
            });
            dt.print(line.join(''));
        });
        dt.print('==========================================');
    },

    dumpDijkstraResult: function (result) {
        var asciiMap = dt.suger.shallowCopy(result);
        asciiMap.reverse();

        dt.print('==========================================');
        asciiMap.forEach(function (line) {
            line = line.map(function (x) {
                if (x < 0) {
                    return '####'
                }
                else {
                    x = x.toString();
                    if (x.length == 1) {
                        return '  ' + x + ' ';
                    }
                    else if (x.length == 2) {
                        return ' ' + x + ' ';
                    }
                    else {
                        return x + ' '
                    }
                }
            });
            dt.print(line.join(''));
        });
        dt.print('==========================================');
    }
};
