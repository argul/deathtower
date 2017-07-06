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
        var map2canvasX = function (x) {
            return x + range - posX;
        };
        var map2canvasY = function (y) {
            return y + range - posY;
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
        var visited = {}; //{ posXY : true }
        var visitFunc = function (x, y, depth) {
            if (!visited[x * 10000 + y]) {
                if (canvas[y][x] < dt.mapconst.TILE_NOVISION) {
                    visited[x * 10000 + y] = true;
                    if (depth >= 1) {
                        visitFunc(x + 1, y, depth - 1);
                        visitFunc(x - 1, y, depth - 1);
                        visitFunc(x, y + 1, depth - 1);
                        visitFunc(x, y - 1, depth - 1);
                    }
                }
            }
        };
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

        visitFunc(range, range, range + 1);
        Object.keys(visited).forEach(function (posXY) {
            var canvasX = Math.floor(posXY / 10000);
            var canvasY = posXY % 10000;
            if (checkVisionFunc(canvasX, canvasY)) {
                var mapX = canvas2mapX(canvasX);
                var mapY = canvas2mapY(canvasY);

                if (mapLevel.fogs[mapY][mapX]) {
                    ret.push({
                        x: mapX,
                        y: mapY
                    })
                }
            }
        });

        return ret;
    }
};