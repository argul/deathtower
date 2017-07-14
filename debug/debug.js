/**
 * Created by argulworm on 6/17/17.
 */

dt.assert = function (c) {
    if (!c) {
        dt.print('assert failure!');
        undefined.a = 0;
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

    dumpAscIIMap: function (mapLevel, customizer) {
        var asciiMap = dt.suger.shallowCopy(mapLevel.tiles);
        asciiMap.reverse();

        dt.print('==========================================');
        dt.print("'e'=EQUIP 'i'=ITEM 'm'=MONSTER 't'=TRAP 'd'=DOOR 'X'=PLAYER");
        asciiMap.forEach(function (line, idx0) {
            line = line.map(function (tile, idx1) {
                var x = idx1;
                var y = mapLevel.height - 1 - idx0;
                if (dt.isFunction(customizer)) {
                    var c = customizer(x, y);
                    if (dt.isString(c)) {
                        return c;
                    }
                }
                switch (tile) {
                    case dt.tileconst.TILE_WALL:
                        return '*';
                    case dt.tileconst.TILE_CORRIDOR:
                        return mapLevel.isFog(x, y) ? ' ' : '☼';
                    case dt.tileconst.TILE_ROOMFLOOR:
                        return mapLevel.isFog(x, y) ? ' ' : '☼';
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
