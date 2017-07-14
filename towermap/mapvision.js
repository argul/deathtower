/**
 * Created by argulworm on 7/6/17.
 */

dt.mapvision = {
    _VERBOSE: false,
    ferret: function (mapLevel, posX, posY, range) {
        var ret = [];
        var self = this;
        var canvasPosX = range;
        var canvasPosY = range;
        var canvas = dt.suger.genMatrix2D(range * 2 + 1, range * 2 + 1, undefined);
        var canvas2mapX = function (x) {
            return posX - canvasPosX + x;
        };
        var canvas2mapY = function (y) {
            return posY - canvasPosY + y;
        };

        for (var x = 0; x < range * 2 + 1; x++) {
            for (var y = 0; y < range * 2 + 1; y++) {
                var mapX = canvas2mapX(x);
                var mapY = canvas2mapY(y);
                if (mapX < 0 || mapX >= mapLevel.width || mapY < 0 || mapY >= mapLevel.height) {
                    canvas[y][x] = dt.tileconst.TILE_WALL;
                }
                else {
                    canvas[y][x] = mapLevel.getTile(mapX, mapY);
                }
            }
        }

        if (this._VERBOSE) {
            dt.debug.dumpAscIIMap(mapLevel);
            this.dumpCanvas(canvas);
        }

        var checkVisionFunc = function (canvasX, canvasY) {
            if (self._VERBOSE) {
                dt.print('checkVisionFunc ' + canvasX + ':' + canvasY);
            }
            if (canvasX == canvasPosX && canvasY == canvasPosY) {
                return true;
            }
            else if (canvasX == canvasPosX) {
                if (Math.abs(canvasY - canvasPosY) > 2) {
                    for (var i = Math.min(canvasPosY, canvasY) + 1; i <= Math.max(canvasPosY, canvasY) - 1; i++) {
                        if (canvas[i][canvasX] > dt.tileconst.TILE_NOVISION) {
                            return false;
                        }
                    }
                }
            }
            else if (canvasY == canvasPosY) {
                if (Math.abs(canvasX - canvasPosX) > 2) {
                    for (var i = Math.min(canvasPosX, canvasX) + 1; i <= Math.max(canvasPosX, canvasX) - 1; i++) {
                        if (canvas[canvasY][i] > dt.tileconst.TILE_NOVISION) {
                            return false;
                        }
                    }
                }
            }
            else if (Math.abs(canvasY - canvasPosY) == Math.abs(canvasX - canvasPosX)) {
                var stepX = canvasX < canvasPosX ? 1 : -1;
                var stepY = canvasY < canvasPosY ? 1 : -1;
                for (var i = 1; i < Math.abs(canvasY - canvasPosY); i++) {
                    if (canvas[canvasY + stepY * i][canvasX + stepX * i] > dt.tileconst.TILE_NOVISION) {
                        return false;
                    }
                }
            }
            else {
                var a = (canvasY - canvasPosY) / (canvasX - canvasPosX);
                var b = canvasPosY + 0.5 - a * (canvasPosX + 0.5);
                var needCheck = {};

                var minX = (canvasX > canvasPosX) ? canvasPosX : canvasX;
                var maxX = (canvasX > canvasPosY) ? canvasX : canvasPosY;
                for (var i = minX + 1; i <= maxX; i++) {
                    var mathy = a * i + b;
                    var delta = mathy - Math.floor(mathy);
                    if (delta >= 0.0001 && (1 - delta) >= 0.0001) {
                        needCheck[(i - 1) * 10000 + Math.floor(mathy)] = true;
                        needCheck[i * 10000 + Math.floor(mathy)] = true;
                    }
                }

                var minY = (canvasY > canvasPosY) ? canvasPosY : canvasY;
                var maxY = (canvasY > canvasPosY) ? canvasY : canvasPosY;
                for (var i = minY + 1; i <= maxY; i++) {
                    var mathx = (i - b) / a;
                    var delta = mathx - Math.floor(mathx);
                    if (delta >= 0.0001 && (1 - delta) >= 0.0001) {
                        needCheck[Math.floor(mathx) * 10000 + i - 1] = true;
                        needCheck[Math.floor(mathx) * 10000 + i] = true;
                    }
                }

                needCheck = Object.keys(needCheck);
                for (var i = 0; i < needCheck.length; i++) {
                    var canvasCheckX = Math.floor(needCheck[i] / 10000);
                    var canvasCheckY = needCheck[i] % 10000;
                    if (self._VERBOSE) {
                        dt.print('canvasCheck ' + canvasCheckX + ':' + canvasCheckY);
                    }
                    if (canvas[canvasCheckY][canvasCheckX] > dt.tileconst.TILE_NOVISION) {
                        return false;
                    }
                }
            }
            return true;
        };

        var spread = {}; //{ posXY : true }
        var spreadFunc = function (x, y, depth) {
            if (!spread[x * 10000 + y]) {
                if (canvas[y][x] < dt.tileconst.TILE_NOVISION) {
                    spread[x * 10000 + y] = true;
                    if (depth >= 1) {
                        spreadFunc(x + 1, y, depth - 1);
                        spreadFunc(x - 1, y, depth - 1);
                        spreadFunc(x, y + 1, depth - 1);
                        spreadFunc(x, y - 1, depth - 1);
                    }
                }
                else if (canvas[y][x] == dt.tileconst.TILE_DOOR) {
                    spread[x * 10000 + y] = true;
                }
            }
        };
        spreadFunc(range, range, range);
        if (this._VERBOSE) {
            Object.keys(spread).forEach(function (posXY) {
                var canvasX = Math.floor(posXY / 10000);
                var canvasY = posXY % 10000;
                canvas[canvasY][canvasX] = '☼';
            });
            this.dumpCanvas(canvas);
        }

        var walls = {};
        Object.keys(spread).forEach(function (posXY) {
            var canvasX = Math.floor(posXY / 10000);
            var canvasY = posXY % 10000;
            var visible = checkVisionFunc(canvasX, canvasY);
            if (self._VERBOSE) {
                dt.print('checkVisionFunc result=' + visible);
            }
            if (visible) {
                var mapX = canvas2mapX(canvasX);
                var mapY = canvas2mapY(canvasY);

                if (mapLevel.isFog(mapX, mapY)) {
                    ret.push({x: mapX, y: mapY});

                    var xhelper = function (x, y) {
                        if (x < 0 || y < 0 || x >= mapLevel.width || y >= mapLevel.height)
                            return;
                        if (mapLevel.getTile(x, y) == dt.tileconst.TILE_WALL) {
                            walls[x * 10000 + y] = true;
                        }
                    };
                    xhelper(mapX + 1, mapY);
                    xhelper(mapX - 1, mapY);
                    xhelper(mapX, mapY + 1);
                    xhelper(mapX, mapY - 1);
                }
            }
        });
        Object.keys(walls).forEach(function (posXY) {
            var mapX = Math.floor(posXY / 10000);
            var mapY = posXY % 10000;
            if (mapLevel.isFog(mapX, mapY)) {
                ret.push({x: mapX, y: mapY});
            }
        });
        if (this._VERBOSE){
            dt.print("mapvision:ferret ret = ");
            dt.print(ret);
        }

        return ret;
    },

    dumpCanvas: function (canvas) {
        var asciiMap = dt.suger.shallowCopy(canvas);
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
    }
};