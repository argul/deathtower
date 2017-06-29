/**
 * Created by argulworm on 6/28/17.
 */

dt.mapgen = {
    _DEBUG_DETAIL: false,
    generateMapLevel: function (mapConfig, ctx) {
        var self = this;
        var mapLevel = new dt.MapLevel(mapConfig.width, mapConfig.height);
        for (var i = 1; i <= mapConfig.width - 2; i += 2) {
            for (var j = 1; j <= mapConfig.height - 2; j += 2) {
                mapLevel.setTile(i, j, dt.mapconst.TILE_CORRIDOR);
            }
        }

        var rooms = this._genRooms(mapConfig, ctx);
        dt.functional.foreach(function (r) {
            mapLevel.addRoom(r);
        }, rooms);

        if (this._DEBUG_DETAIL) {
            dt.debug.verbose('only rooms');
            dt.debug.dumpAscIIMap(mapLevel);
        }

        var paramPack = {
            mapLevel: mapLevel,
            mapConfig: mapConfig,
            ctx: ctx
        };
        this._carveMaze(paramPack);
        if (this._DEBUG_DETAIL) {
            dt.debug.verbose('rooms & maze');
            dt.debug.dumpAscIIMap(mapLevel);
        }

        this._openDoors(paramPack);
        if (this._DEBUG_DETAIL) {
            dt.debug.verbose('rooms & maze & doors');
            dt.debug.dumpAscIIMap(mapLevel);
        }

        this._sealDeadend(paramPack);
        if (this._DEBUG_DETAIL) {
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
                        idx: i,
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

    _checkPointInRoom: function (x, y, room) {
        return x >= room.x
            && x <= room.x + room.width
            && y >= room.y
            && y <= room.y + room.height;
    },

    _carveMaze: function (paramPack) {
        var todos = this._getMeshSlots(paramPack.mapConfig, paramPack.mapLevel.getRooms());
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
            else if (!dt.suger.isUndefined(visited[x * 10000 + y])) {
                return false;
            }
            else {
                return !dt.suger.isUndefined(todos[x * 10000 + y]);
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
                paramPack.mapLevel.setTile(breakWallX, breakWallY, dt.mapconst.TILE_CORRIDOR);
            }
        }
        dt.debug.assert(dt.suger.getKeys(todos).length <= 0);
    },

    _getMeshSlots: function (mapConfig, rooms) {
        var ret = {};
        for (var i = 1; i <= mapConfig.width - 2; i += 2) {
            for (var j = 1; j <= mapConfig.height - 2; j += 2) {
                ret[i * 10000 + j] = true;
            }
        }
        dt.functional.foreach(function (r) {
            for (var i = 1; i <= r.width - 2; i += 2) {
                for (var j = 1; j <= r.height - 2; j += 2) {
                    delete ret[(r.x + i) * 10000 + (r.y + j)];
                }
            }
        }, rooms);
        return ret;
    },

    _openDoors: function (paramPack) {
        var self = this;
        dt.functional.foreach(function (r) {
            var canBeDoors = [];
            if (r.y > 0) { //bottom walls
                for (var i = 1; i < r.width - 1; i++) {
                    if (paramPack.mapLevel.getTile(r.x + i, r.y - 1) == dt.mapconst.TILE_CORRIDOR) {
                        canBeDoors.push({x: r.x + i, y: r.y});
                    }
                }
            }
            if ((r.y + r.height) < paramPack.mapConfig.height) { //top walls
                for (var i = 1; i < r.width - 1; i++) {
                    if (paramPack.mapLevel.getTile(r.x + i, r.y + r.height) == dt.mapconst.TILE_CORRIDOR) {
                        canBeDoors.push({x: r.x + i, y: r.y + r.height - 1});
                    }
                }
            }
            if (r.x > 0) { //left walls
                for (var i = 1; i < r.height - 1; i++) {
                    if (paramPack.mapLevel.getTile(r.x - 1, r.y + i) == dt.mapconst.TILE_CORRIDOR) {
                        canBeDoors.push({x: r.x, y: r.y + i});
                    }
                }
            }
            if ((r.x + r.width) < paramPack.mapConfig.width) { //right walls
                for (var i = 1; i < r.height - 1; i++) {
                    if (paramPack.mapLevel.getTile(r.x + r.width, r.y + i) == dt.mapconst.TILE_CORRIDOR) {
                        canBeDoors.push({x: r.x + r.width - 1, y: r.y + i});
                    }
                }
            }
            canBeDoors = dt.suger.shuffle(canBeDoors, paramPack.ctx);
            var doorNum = self._getDoorNumber(paramPack.mapConfig, paramPack.ctx);
            for (var i = 0; i < doorNum && i < canBeDoors.length; i++) {
                var doorX = canBeDoors[i].x;
                var doorY = canBeDoors[i].y;
                paramPack.mapLevel.setTile(doorX, doorY, dt.mapconst.TILE_CORRIDOR);
            }
        }, paramPack.mapLevel.getRooms());
    },

    _getDoorNumber: function (mapConfig, ctx) {
        var total = 0;
        dt.functional.foreach(function (x) {
            total += x;
        }, mapConfig.doorNumProbability);
        dt.debug.assert(Math.abs(total - 1.0) < 0.0001);
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
            if (tile == dt.mapconst.TILE_CORRIDOR) {
                todos[x * 10000 + y] = {x: x, y: y};
            }
        });
        var checkDeadend = function (t) {
            var c = 0;
            if ((t.x < paramPack.mapConfig.width - 2)
                && (paramPack.mapLevel.getTile(t.x + 1, t.y) != dt.mapconst.TILE_WALL)) {
                c += 1;
            }
            if ((t.x > 1)
                && (paramPack.mapLevel.getTile(t.x - 1, t.y) != dt.mapconst.TILE_WALL)) {
                c += 1;
            }
            if ((t.y < paramPack.mapConfig.height - 2)
                && (paramPack.mapLevel.getTile(t.x, t.y + 1) != dt.mapconst.TILE_WALL)) {
                c += 1;
            }
            if ((t.y > 1)
                && paramPack.mapLevel.getTile(t.x, t.y - 1) != dt.mapconst.TILE_WALL) {
                c += 1;
            }
            dt.debug.assert(c >= 1);
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
            dt.functional.foreach(function (element) {
                paramPack.mapLevel.setTile(element.x, element.y, dt.mapconst.TILE_WALL);
                delete todos[element.x * 10000 + element.y];
            }, deadendList);
        }
        while (deadendList.length > 0);
    }
};