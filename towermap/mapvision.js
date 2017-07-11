/**
 * Created by argulworm on 7/6/17.
 */

dt.mapvision = {
    ferret: function (mapLevel, posX, posY, range) {
        var ret = [];
        var canvas = dt.suger.genMatrix2D(range * 2 + 1, range * 2 + 1, undefined);
        var canvas2mapX = function (x) {
            return posX - range + x;
        };
        var canvas2mapY = function (y) {
            return posY - range + y;
        };

        for (var i = 0; i < range * 2 + 1; i++) {
            for (var j = 0; j < range * 2 + 1; j++) {
                var mapX = canvas2mapX(i);
                var mapY = canvas2mapY(j);
                if (mapX < 0 || mapX >= mapLevel.width || mapY < 0 || mapY >= mapLevel.height) {
                    canvas[j][i] = dt.mapconst.TILE_WALL;
                }
                else {
                    canvas[j][i] = mapLevel.getTile(i, j);
                }
            }

        }

        var checkVisionFunc = function (canvasX, canvasY) {
            if (canvasX == posX) {
                if (Math.abs(canvasY - posY) > 2) {
                    for (var i = Math.min(posY, canvasY) + 1; i <= Math.max(posY, canvasY) - 1; i++) {
                        if (canvas[i][canvasX] > dt.mapconst.TILE_NOVISION) {
                            return false;
                        }
                    }
                }
            }
            else if (canvasY == posY) {
                if (Math.abs(canvasX - posX) > 2) {
                    for (var i = Math.min(posX, canvasX) + 1; i <= Math.max(posX, canvasX) - 1; i++) {
                        if (canvas[canvasY][i] > dt.mapconst.TILE_NOVISION) {
                            return false;
                        }
                    }
                }
            }
            else {
                var b = range + 0.5;
                var a = (canvasY - range) / (canvasX - range);
                var needCheck = {};

                var minX = (canvasX > posX) ? posX : canvasX;
                var maxX = (canvasX > posX) ? canvasX : posX;
                for (var i = minX + 1; i <= maxX; i++) {
                    var mathy = a * i + b;
                    var delta = mathy - Math.floor(mathy);
                    if (delta >= 0.0001 && (1 - delta) >= 0.0001) {
                        needCheck[(i - 1) * 10000 + Math.floor(mathy)] = true;
                        needCheck[i * 10000 + Math.floor(mathy)] = true;
                    }
                }

                var minY = (canvasY > posY) ? posY : canvasY;
                var maxY = (canvasY > posY) ? canvasY : posY;
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
                    if (canvas[needCheck[i] % 10000][Math.floor(needCheck[i] / 10000)] > dt.mapconst.TILE_NOVISION) {
                        return false;
                    }
                }
            }
            return true;
        };

        var spread = {}; //{ posXY : true }
        var spreadFunc = function (x, y, depth) {
            if (!spread[x * 10000 + y]) {
                if (canvas[y][x] < dt.mapconst.TILE_NOVISION) {
                    spread[x * 10000 + y] = true;
                    if (depth >= 1) {
                        spreadFunc(x + 1, y, depth - 1);
                        spreadFunc(x - 1, y, depth - 1);
                        spreadFunc(x, y + 1, depth - 1);
                        spreadFunc(x, y - 1, depth - 1);
                    }
                }
                else if (canvas[y][x] == dt.mapconst.TILE_DOOR) {
                    spread[x * 10000 + y] = true;
                }
            }
        };
        spreadFunc(range, range, range + 1);

        Object.keys(spread).forEach(function (posXY) {
            var canvasX = Math.floor(posXY / 10000);
            var canvasY = posXY % 10000;
            if (checkVisionFunc(canvasX, canvasY)) {
                var mapX = canvas2mapX(canvasX);
                var mapY = canvas2mapY(canvasY);

                if (mapLevel.isFog(mapX, mapY)) {
                    ret.push({x: mapX, y: mapY});
                    if (mapLevel.getTile(mapX + 1, mapY) == dt.mapconst.TILE_WALL) {
                        ret.push({x: mapX + 1, y: mapY});
                    }
                    if (mapLevel.getTile(mapX - 1, mapY) == dt.mapconst.TILE_WALL) {
                        ret.push({x: mapX - 1, y: mapY});
                    }
                    if (mapLevel.getTile(mapX, mapY + 1) == dt.mapconst.TILE_WALL) {
                        ret.push({x: mapX, y: mapY + 1});
                    }
                    if (mapLevel.getTile(mapX, mapY - 1) == dt.mapconst.TILE_WALL) {
                        ret.push({x: mapX, y: mapY - 1});
                    }
                }
            }
        });

        return ret;
    }
};