/**
 * Created by argulworm on 6/29/17.
 */

dt.mapAIStrategy = {
    FULL_AGGRESIVE: 0,
    MEDIUM_AGGRESIVE: 1,
    NORMAL: 2,
    MEDIUM_COWARD: 3,
    FULL_COWARD: 4
};

dt.mapAICode = {
    MOVE: 1,
    RAID_MONSTER: 2,
    OPEN_TREASURE: 3,
    DISARM_TRAP: 4,
    TREAD_TRAP: 5,
    OPEN_DOOR: 6,
    GO_UPSTAIR: 7,
    USE_ITEM: 100
};

dt.registerClassInheritance('dt.AIInterface', function () {
    dt.MapAI = dt.AIInterface.extend({
        _VERBOSE: false,
        ctor: function (abacusRef) {
            this._abacusRef = abacusRef;
        },

        getAbacusRef: function () {
            return this._abacusRef;
        },

        makeDecision: function () {
            var ret = undefined;
            var map = this.getAbacusRef().map;
            var feeder = this.getAbacusRef().aiFeeder;
            var team = this.getAbacusRef().teamData;
            var connectivity = dt.dijkstra.BFS(map.mapLevel, map.teamX, map.teamY, this._makeConnectJudge(false, false));

            if (!feeder.visibleTreasures.isEmpty()) {
                var treasures = feeder.visibleTreasures.values();
                treasures = this._sortTreasures(treasures, connectivity);
                for (var i = 0; i < treasures.length; i++) {
                    ret = this._tryTreasure(treasures[i], connectivity);
                    if (ret) return ret;
                }
            }

            if (!feeder.visibleLoots.isEmpty()) {
                var loots = feeder.visibleLoots.values();
                loots = this._sortLoots(loots, connectivity);
                for (var i = 0; i < loots.length; i++) {
                    ret = this._tryLoot(loots[i], connectivity);
                    if (ret) return ret;
                }
            }

            if (!feeder.visibleMonsters.isEmpty()) {
                var monsters = feeder.visibleMonsters.values();
                monsters = this._sortMonsters(monsters, connectivity);
                for (var i = 0; i < monsters.length; i++) {
                    ret = this._tryMonster(monsters[i], connectivity);
                    if (ret) return ret;
                }
            }

            ret = this._tryExploreFog();
            if (ret) return ret;

            if (!feeder.visibleDoors.isEmpty()) {
                var doors = feeder.visibleDoors.values();
                doors = this._sortDoors(doors, connectivity);
                for (var i = 0; i < doors.length; i++) {
                    ret = this._tryDoor(doors[i], connectivity);
                    if (ret) return ret;
                }
            }

            return this._gotoNextLevel(connectivity);
        },

        _makeConnectJudge: function (noFog, noMonster) {
            return function (m, x, y) {
                var tile = m.getTile(x, y);
                if (tile >= dt.tileconst.TILE_NOPASS)
                    return false;

                if (noFog && m.isFog(x, y))
                    return false;

                var content = m.getContent(x, y);
                if (content) {
                    if (noMonster) {
                        if (content.monster)
                            return false;
                    }
                    else {
                        if (content.monster && content.monster.isAvoid)
                            return false;
                    }

                    if (content.trap && content.trap.isAvoid)
                        return false;

                    if (content.door)
                        return false;
                }

                return true;
            };
        },

        _sortLoots: function (loots, connectivity) {
            loots = loots.filter(function (t) {
                return connectivity[t.y][t.x] >= 0;
            });
            loots.sort(function (lhr, rhr) {
                return connectivity[lhr.y][lhr.x] - connectivity[rhr.y][rhr.x];
            });
            return loots;
        },

        _sortMonsters: function (monsters, connectivity) {
            monsters = monsters.filter(function (t) {
                if (connectivity[t.y][t.x] < 0)
                    return false;
                if (t.isAvoid)
                    return false;
                return true;
            });
            monsters.sort(function (lhr, rhr) {
                return connectivity[lhr.y][lhr.x] - connectivity[rhr.y][rhr.x];
            });
            return monsters;
        },

        _sortTreasures: function (treasures, connectivity) {
            treasures = treasures.filter(function (t) {
                return connectivity[t.y][t.x] >= 0;
            });
            treasures.sort(function (lhr, rhr) {
                return connectivity[lhr.y][lhr.x] - connectivity[rhr.y][rhr.x];
            });
            return treasures;
        },

        _sortDoors: function (doors, connectivity) {
            doors = doors.filter(function (t) {
                return connectivity[t.y][t.x] >= 0;
            });
            doors.sort(function (lhr, rhr) {
                return connectivity[lhr.y][lhr.x] - connectivity[rhr.y][rhr.x];
            });
            return doors;
        },

        _tryLoot: function (loot, connectivity) {
            if (connectivity[loot.y][loot.x] < 0)
                return;

            var map = this.getAbacusRef().map;
            var path = dt.astar.seekPath(map.mapLevel, map.teamX, map.teamY, loot.x, loot.y, this._makeConnectJudge(true, true));
            if (!path)
                path = dt.astar.seekPath(map.mapLevel, map.teamX, map.teamY, loot.x, loot.y, this._makeConnectJudge(true, false));

            if (!path)
                return;

            var ret = this._pathBlazer(path, function (content) {
                dt.assert(!content.equipment && !content.item);
                if (content.monster)
                    dt.assert(!content.monster.isAvoid);
                if (content.trap)
                    dt.assert(!content.trap.isAvoid);
            });

            if (!ret) {
                ret = [{
                    aicode: dt.mapAICode.MOVE,
                    path: path
                }];
            }
            return ret;
        },


        _tryMonster: function (monster, connectivity) {
            dt.assert(!monster.isAvoid);
            if (connectivity[monster.y][monster.x] < 0)
                return;

            var map = this.getAbacusRef().map;
            var path = dt.astar.seekPath(map.mapLevel, map.teamX, map.teamY, monster.x, monster.y, this._makeConnectJudge(true, false));

            if (!path)
                return;

            var ret = this._pathBlazer(path, function (content) {
                dt.assert(!content.equipment && !content.item);
                if (content.monster)
                    dt.assert(!content.monster.isAvoid);
                if (content.trap)
                    dt.assert(!content.trap.isAvoid);
            });

            if (!ret) {
                path.pop();
                ret = [{
                    aicode: dt.mapAICode.MOVE,
                    path: path
                }, {
                    aicode: dt.mapAICode.RAID_MONSTER,
                    monster: monster
                }];
            }
            return ret;
        },

        _tryTreasure: function (treasure, connectivity) {
            if (treasure.guardMonsters.length > 0)
                return;

            var map = this.getAbacusRef().map;
            var entries = [];
            var f = function (x, y) {
                if (connectivity[y][x] >= 0 && !map.mapLevel.isFog(x, y)) {
                    entries.push({x: x, y: y, distance: connectivity[y][x]});
                }
            };
            f(treasure.x + 1, treasure.y);
            f(treasure.x - 1, treasure.y);
            f(treasure.x, treasure.y + 1);
            f(treasure.x, treasure.y - 1);
            entries.sort(function (lhr, rhr) {
                return lhr.distance - rhr.distance;
            });

            dt.assert(entries.length > 0);
            if (entries[0].distance == 0) {
                return [{
                    aicode: dt.mapAICode.OPEN_TREASURE,
                    path: [],
                    tresure: treasure
                }];
            }

            var path = dt.astar.seekPath(map.mapLevel, map.teamX, map.teamY, entries[0].x, entries[0].y, this._makeConnectJudge(true, false));
            if (!path)
                return;

            var ret = this._pathBlazer(path, function (content) {
                dt.assert(!content.equipment && !content.item);
                if (content.monster)
                    dt.assert(!content.monster.isAvoid);
                if (content.trap)
                    dt.assert(!content.trap.isAvoid);
            });

            if (!ret) {
                path.pop();
                ret = [{
                    aicode: dt.mapAICode.MOVE,
                    path: path
                }, {
                    aicode: dt.mapAICode.OPEN_TREASURE,
                    treasure: treasure
                }];
            }
            return ret;
        },

        _tryDoor: function (door, connectivity) {
            var map = this.getAbacusRef().map;
            var entries = [];
            var f = function (x, y) {
                if (connectivity[y][x] >= 0 && !map.mapLevel.isFog(x, y)) {
                    entries.push({x: x, y: y, distance: connectivity[y][x]});
                }
            };
            f(door.x + 1, door.y);
            f(door.x - 1, door.y);
            f(door.x, door.y + 1);
            f(door.x, door.y - 1);
            entries.sort(function (lhr, rhr) {
                return lhr.distance - rhr.distance;
            });
            dt.assert(entries.length == 1);
            if (entries[0].distance == 0) {
                return [{
                    aicode: dt.mapAICode.OPEN_DOOR,
                    door: door
                }];
            }

            var path = dt.astar.seekPath(map.mapLevel, map.teamX, map.teamY, entries[0].x, entries[0].y, this._makeConnectJudge(true, false));
            if (!path)
                return;

            var ret = this._pathBlazer(path, function (content) {
                dt.assert(!content.equipment && !content.item);
                if (content.monster)
                    dt.assert(!content.monster.isAvoid);
                if (content.trap)
                    dt.assert(!content.trap.isAvoid);
            });

            if (!ret) {
                path.pop();
                ret = [{
                    aicode: dt.mapAICode.MOVE,
                    path: path
                }, {
                    aicode: dt.mapAICode.OPEN_DOOR,
                    door: door
                }];
            }

            return ret;
        },

        _tryExploreFog: function () {
            var self = this;
            var fogs = [];
            var map = this.getAbacusRef().map;

            var bfsResult = dt.dijkstra.BFS(map.mapLevel, map.teamX, map.teamY, function (m, x, y) {
                return m.getTile(x, y) < dt.tileconst.TILE_NOPASS;
            }, function (m, x, y) {
                return m.isFog(x, y);
            });

            map.mapLevel.foreachTile(function (x, y, tile) {
                if (tile != dt.tileconst.TILE_WALL
                    && map.mapLevel.isFog(x, y)
                    && bfsResult[y][x] >= 0) {
                    fogs.push({x: x, y: y, distance: bfsResult[y][x]});
                }
            });

            fogs.sort(function (lhr, rhr) {
                var a = dt.isUndefined(map.mapLevel.getRoomByTile(lhr.x, lhr.y)) ? 1 : -1;
                var b = dt.isUndefined(map.mapLevel.getRoomByTile(rhr.x, rhr.y)) ? 1 : -1;
                if (a != b)
                    return a - b;
                return lhr.distance - rhr.distance;
            });

            if (fogs.length <= 0)
                return;
            if (this._VERBOSE) {
                dt.print("MapAI:_tryExploreFog fogX=" + fogs[0].x + " fogY=" + fogs[0].y);
            }

            var targetFogX = fogs[0].x, targetFogY = fogs[0].y;
            var path = dt.astar.seekPath(map.mapLevel, map.teamX, map.teamY, targetFogX, targetFogY, function (m, x, y) {
                if (x == targetFogX && y == targetFogY) { // only destination is fog
                    return true;
                }
                else {
                    return self._makeConnectJudge(true, false)(m, x, y);
                }
            });
            dt.assert(path);

            var ret = this._pathBlazer(path);
            if (!ret) {
                map.mapLevel.getDebugData(targetFogX, targetFogY).destination = {
                    x: targetFogX,
                    y: targetFogY
                };
                ret = [{
                    aicode: dt.mapAICode.MOVE,
                    path: path,
                    terminator: function () {
                        return !map.mapLevel.isFog(targetFogX, targetFogY);
                    }
                }];
            }

            return ret;
        },

        _gotoNextLevel: function (connectivity) {
            var ret = undefined;
            var map = this.getAbacusRef().map;
            var stairX = map.upstair.x;
            var stairY = map.upstair.y;
            if (connectivity[stairY][stairX] == 0) {
                return [{
                    aicode: dt.mapAICode.GO_UPSTAIR,
                    stair: map.upstair
                }];
            }
            else if (connectivity[stairY][stairX] > 0) {
                var path = dt.astar.seekPath(map.mapLevel, map.teamX, map.teamY, stairX, stairY, this._makeConnectJudge(true, false));
                dt.assert(path);
                ret = this._pathBlazer(path);
                if (!ret) {
                    ret = [{
                        aicode: dt.mapAICode.MOVE,
                        path: path
                    }, {
                        aicode: dt.mapAICode.GO_UPSTAIR,
                        stair: map.upstair
                    }];
                }
            }
            else {
                var path = dt.astar.seekPath(map.mapLevel, map.teamX, map.teamY, stairX, stairY, function (m, x, y) {
                    return m.getTile(x, y) < dt.tileconst.TILE_NOPASS;
                });
                dt.assert(path);

                for (var i = 0; i < path.length; i++) {
                    var x = path[i].x;
                    var y = path[i].y;
                    var content = map.mapLevel.getContent(x, y);
                    if (!content)
                        continue;

                    if (content.monster) {
                        ret = [{
                            aicode: dt.mapAICode.MOVE,
                            path: path.splice(0, i)
                        }, {
                            aicode: dt.mapAICode.RAID_MONSTER,
                            monster: content.monster,
                            aggresive: true
                        }];
                        break;
                    }

                    if (content.trap) {
                        if (trap.isAvoid) {
                            ret = [{
                                aicode: dt.mapAICode.MOVE,
                                path: path.splice(0, i)
                            }, {
                                aicode: dt.mapAICode.TREAD_TRAP,
                                trap: content.trap
                            }];
                        }
                        else {
                            ret = [{
                                aicode: dt.mapAICode.MOVE,
                                path: path.splice(0, i)
                            }, {
                                aicode: dt.mapAICode.DISARM_TRAP,
                                trap: content.trap,
                                aggresive: true
                            }];
                        }
                        break;
                    }
                }
                dt.assert(ret);
            }

            return ret;
        },

        _pathBlazer: function (path, asserter) {
            var map = this.getAbacusRef().map;
            for (var i = 0; i < path.length; i++) {
                var x = path[i].x;
                var y = path[i].y;

                if (this._VERBOSE) {
                    dt.print('_pathBlazer x=' + x + '|y=' + y);
                }

                if (dt.debug.isStrict()) {
                    dt.assert(map.mapLevel.getTile(x, y) < dt.tileconst.TILE_NOPASS);
                    if (i < path.length - 1) {
                        dt.assert(!map.mapLevel.isFog(x, y));
                    }
                }
                var content = map.mapLevel.getContent(x, y);
                if (!content)
                    continue;

                if (asserter) {
                    asserter(content);
                }

                if (content.monster) {
                    if (i == 0) {
                        return [{
                            aicode: dt.mapAICode.RAID_MONSTER,
                            monster: content.monster
                        }];
                    }
                    else {
                        return [{
                            aicode: dt.mapAICode.MOVE,
                            path: path.splice(0, i)
                        }, {
                            aicode: dt.mapAICode.RAID_MONSTER,
                            monster: content.monster
                        }];
                    }
                }

                if (content.trap) {
                    if (i == 0) {
                        return [{
                            aicode: dt.mapAICode.DISARM_TRAP,
                            trap: content.trap
                        }];
                    }
                    else {
                        return [{
                            aicode: dt.mapAICode.MOVE,
                            path: path.splice(0, i)
                        }, {
                            aicode: dt.mapAICode.DISARM_TRAP,
                            trap: content.trap
                        }];
                    }
                }
            }
            return undefined;
        }
    });
});