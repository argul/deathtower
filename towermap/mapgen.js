/**
 * Created by argulworm on 6/28/17.
 */

dt.mapgen = {
    _VERBOSE: false,
    generateMapLevel: function (mapConfig, ctx) {
        var self = this;
        var mapLevel = new dt.MapLevel(mapConfig.width, mapConfig.height);
        for (var i = 1; i <= mapConfig.width - 2; i += 2) {
            for (var j = 1; j <= mapConfig.height - 2; j += 2) {
                mapLevel.setTile(i, j, dt.tileconst.TILE_CORRIDOR);
            }
        }

        var rooms = this._genRooms(mapConfig, ctx);
        rooms.forEach(function (r) {
            mapLevel.addRoom(r);
        });

        if (this._VERBOSE) {
            dt.debug.verbose('only rooms');
            dt.debug.dumpAscIIMap(mapLevel);
        }

        var paramPack = {
            mapLevel: mapLevel,
            mapConfig: mapConfig,
            ctx: ctx
        };
        this._carveMaze(paramPack);
        if (this._VERBOSE) {
            dt.debug.verbose('rooms & maze');
            dt.debug.dumpAscIIMap(mapLevel);
        }

        this._openDoors(paramPack);
        if (this._VERBOSE) {
            dt.debug.verbose('rooms & maze & doors');
            dt.debug.dumpAscIIMap(mapLevel);
        }

        this._sealDeadend(paramPack);
        if (this._VERBOSE) {
            dt.debug.verbose('final');
            dt.debug.dumpAscIIMap(mapLevel);
        }

        return mapLevel;
    },

    _genRooms: function (mapConfig, ctx) {
        var roomNumber = ctx.random.randomInt(mapConfig.minRoomNumber, mapConfig.maxRoomNumber);
        var rooms = [];

        var roomOk = false;
        while (!roomOk) {
            for (var i = 0; i < mapConfig.scatterRoomTrys; i++) {
                if (rooms.length >= roomNumber) {
                    roomOk = true;
                    break;
                }
                else {
                    var r = {
                        roomId: i,
                        x: 0,
                        y: 0,
                        width: ctx.random.randomOdd(mapConfig.minRoomWidth, mapConfig.maxRoomWidth),
                        height: ctx.random.randomOdd(mapConfig.minRoomHeight, mapConfig.maxRoomHeight),
                    };
                    r.x = ctx.random.randomEven(0, mapConfig.width - r.width);
                    r.y = ctx.random.randomEven(0, mapConfig.height - r.height);
                    if (this._tryScatterRoom(r, rooms)) {
                        rooms.push(r);
                    }
                }
            }
        }
        return rooms;
    },

    _tryScatterRoom: function (roomX, fixrooms) {
        for (var i = 0; i < fixrooms.length; i++) {
            if (this._checkRoomIntersect(roomX, fixrooms[i])) {
                return false;
            }
        }
        return true;
    },

    _checkRoomIntersect: function (roomX, roomY) {
        if (roomX.x > (roomY.x + roomY.width)) return false;
        else if (roomY.x > (roomX.x + roomX.width)) return false;
        else if (roomX.y > (roomY.y + roomY.height)) return false;
        else if (roomY.y > (roomX.y + roomX.height)) return false;
        else return true;
    },

    _carveMaze: function (paramPack) {
        var todos = this._getMeshSlots(paramPack.mapConfig, paramPack.mapLevel.getRoomArr());
        var mazeStack = [];
        var visited = {};
        var tkeys = dt.suger.getKeys(todos);
        mazeStack.unshift({
            x: Math.floor(tkeys[0] / 10000),
            y: tkeys[0] % 10000
        });

        var checkCanMoveTo = function (x, y) {
            if (x < 1 || x > paramPack.mapConfig.width - 2) {
                return false;
            }
            else if (y < 1 || y > paramPack.mapConfig.height - 2) {
                return false;
            }
            else if (!dt.isUndefined(visited[x * 10000 + y])) {
                return false;
            }
            else {
                return !dt.isUndefined(todos[x * 10000 + y]);
            }
        };
        while (mazeStack.length > 0) {
            var pos = mazeStack[0];
            visited[pos.x * 10000 + pos.y] = true;
            delete todos[pos.x * 10000 + pos.y];
            var t = [];
            if (checkCanMoveTo(pos.x + 2, pos.y)) t.push([pos.x + 2, pos.y, 1, 0]);
            if (checkCanMoveTo(pos.x - 2, pos.y)) t.push([pos.x - 2, pos.y, -1, 0]);
            if (checkCanMoveTo(pos.x, pos.y + 2)) t.push([pos.x, pos.y + 2, 0, 1]);
            if (checkCanMoveTo(pos.x, pos.y - 2)) t.push([pos.x, pos.y - 2, 0, -1]);
            if (t.length <= 0) {
                mazeStack.shift();
            }
            else {
                var choice = paramPack.ctx.random.randomPick(t);
                mazeStack.unshift({
                    x: choice[0],
                    y: choice[1]
                });
                var breakWallX = pos.x + choice[2];
                var breakWallY = pos.y + choice[3];
                paramPack.mapLevel.setTile(breakWallX, breakWallY, dt.tileconst.TILE_CORRIDOR);
            }
        }
        dt.assert(dt.suger.getKeys(todos).length <= 0);
    },

    _getMeshSlots: function (mapConfig, rooms) {
        var ret = {};
        for (var i = 1; i <= mapConfig.width - 2; i += 2) {
            for (var j = 1; j <= mapConfig.height - 2; j += 2) {
                ret[i * 10000 + j] = true;
            }
        }
        rooms.forEach(function (r) {
            for (var i = 1; i <= r.width - 2; i += 2) {
                for (var j = 1; j <= r.height - 2; j += 2) {
                    delete ret[(r.x + i) * 10000 + (r.y + j)];
                }
            }
        });
        return ret;
    },

    _openDoors: function (paramPack) {
        var self = this;
        paramPack.mapLevel.getRoomArr().forEach(function (r) {
            var canBeDoors = [];
            if (r.y > 0) { //bottom walls
                for (var i = 1; i < r.width - 1; i++) {
                    if (paramPack.mapLevel.getTile(r.x + i, r.y - 1) == dt.tileconst.TILE_CORRIDOR) {
                        canBeDoors.push({x: r.x + i, y: r.y});
                    }
                }
            }
            if ((r.y + r.height) < paramPack.mapConfig.height) { //top walls
                for (var i = 1; i < r.width - 1; i++) {
                    if (paramPack.mapLevel.getTile(r.x + i, r.y + r.height) == dt.tileconst.TILE_CORRIDOR) {
                        canBeDoors.push({x: r.x + i, y: r.y + r.height - 1});
                    }
                }
            }
            if (r.x > 0) { //left walls
                for (var i = 1; i < r.height - 1; i++) {
                    if (paramPack.mapLevel.getTile(r.x - 1, r.y + i) == dt.tileconst.TILE_CORRIDOR) {
                        canBeDoors.push({x: r.x, y: r.y + i});
                    }
                }
            }
            if ((r.x + r.width) < paramPack.mapConfig.width) { //right walls
                for (var i = 1; i < r.height - 1; i++) {
                    if (paramPack.mapLevel.getTile(r.x + r.width, r.y + i) == dt.tileconst.TILE_CORRIDOR) {
                        canBeDoors.push({x: r.x + r.width - 1, y: r.y + i});
                    }
                }
            }
            canBeDoors = dt.suger.shuffle(canBeDoors, paramPack.ctx);
            var doorNum = self._getDoorNumber(paramPack.mapConfig, paramPack.ctx);
            for (var i = 0; i < doorNum && i < canBeDoors.length; i++) {
                var doorX = canBeDoors[i].x;
                var doorY = canBeDoors[i].y;
                paramPack.mapLevel.setTile(doorX, doorY, dt.tileconst.TILE_CORRIDOR);
            }
        });
    },

    _getDoorNumber: function (mapConfig, ctx) {
        var total = 0;
        mapConfig.doorNumProbability.forEach(function (x) {
            total += x;
        });
        dt.assert(Math.abs(total - 1.0) < 0.0001);
        var f = ctx.random.random01();
        for (var i = 0; i < mapConfig.doorNumProbability.length; i++) {
            f -= mapConfig.doorNumProbability[i];
            if (f <= 0) {
                return i + 1;
            }
        }
        return mapConfig.doorNumProbability.length;
    },

    _sealDeadend: function (paramPack) {
        var self = this;
        var todos = {};
        paramPack.mapLevel.foreachTile(function (x, y, tile) {
            if (tile == dt.tileconst.TILE_CORRIDOR) {
                todos[x * 10000 + y] = {x: x, y: y};
            }
        });
        var checkDeadend = function (t) {
            var c = 0;
            if ((t.x < paramPack.mapConfig.width - 2)
                && (paramPack.mapLevel.getTile(t.x + 1, t.y) != dt.tileconst.TILE_WALL)) {
                c += 1;
            }
            if ((t.x > 1)
                && (paramPack.mapLevel.getTile(t.x - 1, t.y) != dt.tileconst.TILE_WALL)) {
                c += 1;
            }
            if ((t.y < paramPack.mapConfig.height - 2)
                && (paramPack.mapLevel.getTile(t.x, t.y + 1) != dt.tileconst.TILE_WALL)) {
                c += 1;
            }
            if ((t.y > 1)
                && paramPack.mapLevel.getTile(t.x, t.y - 1) != dt.tileconst.TILE_WALL) {
                c += 1;
            }
            dt.assert(c >= 1);
            return c == 1;
        };
        var deadendList = [];
        do {
            deadendList = [];
            for (var key in todos) {
                if (!todos.hasOwnProperty(key)) {
                    continue;
                }
                if (checkDeadend(todos[key])) {
                    deadendList.push(todos[key]);
                }
            }
            deadendList.forEach(function (element) {
                paramPack.mapLevel.setTile(element.x, element.y, dt.tileconst.TILE_WALL);
                delete todos[element.x * 10000 + element.y];
            });
        }
        while (deadendList.length > 0);
    }
};