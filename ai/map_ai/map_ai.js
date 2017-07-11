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
    MOVE_TO_LOOT: 1,
    MOVE_TO_MONSTER: 2,
    MOVE_TO_TREASURE: 3,
    MOVE_TO_TRAP: 4,
    MOVE_TO_DOOR: 5,
    MOVE_TO_FOG: 6,
    MOVE_TO_STAIR: 7,
    USE_ITEM: 100
};

dt.registerClassInheritance('dt.AIInterface', function () {
    dt.MapAI = dt.AIInterface.extend({
        ctor: function (abacusRef) {
            this._abacusRef = abacusRef;
        },

        getAbacusRef: function () {
            return this._abacusRef;
        },

        makeDecision: function () {
            var ret = undefined;
            var map = this.getAbacusRef().map;
            var feeder = this.getAbacusRef().aifeeder;
            var team = this.getAbacusRef().teamData;
            var connectivity = dt.dijkstra.simpleSeekAll(map.mapLevel, map.teamX, map.teamY, this._makeConnectJudge(false, false));

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

            ret = this._tryExploreFog(connectivity);
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
                if (tile >= dt.mapconst.TILE_NOPASS)
                    return false;

                if (noFog && m.isFog(x, y))
                    return false;

                var content = m.getContent(x, y);
                if (!content)
                    return false;

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

                return true;
            };
        },

        _sortLoots: function (loots, connectivity) {
            return loots;
        },

        _sortMonsters: function (monsters, connectivity) {
            return monsters;
        },

        _sortTreasures: function (treasures, connectivity) {
            return treasures;
        },

        _sortDoors: function (doors, connectivity) {
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
                    aicode: dt.mapAICode.MOVE_TO_LOOT,
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
                ret = [{
                    aicode: dt.mapAICode.MOVE_TO_MONSTER,
                    path: path
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
                ret = [{
                    aicode: dt.mapAICode.MOVE_TO_TREASURE,
                    path: path
                }];
            }
            return ret;
        },

        _tryDoor: function (door, connectivity) {
            var team = this.getAbacusRef().teamData;
            if (!team.hasDoorKey(door))
                return;

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
                ret = [{
                    aicode: dt.mapAICode.MOVE_TO_TREASURE,
                    path: path
                }];
            }

            return ret;
        },

        _tryExploreFog: function (connectivity) {
            var fogs = [];
            var map = this.getAbacusRef().map;
            map.mapLevel.foreachTile(function (x, y, tile) {
                if (tile != dt.mapconst.TILE_WALL
                    && map.mapLevel.isFog(x, y)
                    && connectivity[y][x] >= 0) {
                    fogs.push({x: x, y: y, distance: connectivity[y][x]});
                }
            });
            fogs.sort(function (lhr, rhr) {
                return lhr.distance - rhr.distance;
            });

            if (fogs.length <= 0)
                return;
            v
            var path = dt.astar.seekPath(map.mapLevel, map.teamX, map.teamY, fogs[0].x, fogs[0].y, this._makeConnectJudge(true, false));
            dt.assert(path);

            var ret = this._pathBlazer(path);
            if (!ret) {
                ret = [{
                    aicode: dt.mapAICode.MOVE_TO_FOG,
                    path: path
                }];
            }

            return ret;
        },

        _gotoNextLevel: function (connectivity) {
            var ret = undefined;
            var map = this.getAbacusRef().map;
            var stairX = map.upstair.x;
            var stairY = map.upstair.y;

            if (connectivity[stairY][stairX] >= 0) {
                var path = dt.astar.seekPath(map.mapLevel, map.teamX, map.teamY, stairX, stairY, this._makeConnectJudge(true, false));
                dt.assert(path);
                ret = this._pathBlazer(path);
                if (!ret) {
                    ret = [{
                        aicode: dt.mapAICode.MOVE_TO_STAIR,
                        path: path
                    }];
                }
            }
            else {
                var path = dt.astar.seekPath(map.mapLevel, map.teamX, map.teamY, stairX, stairY, function (m, x, y) {
                    return m.getTile(x, y) < dt.mapconst.TILE_NOPASS;
                });
                dt.assert(path);

                for (var i = 0; i < path.length; i++) {
                    var x = path[i].x;
                    var y = path[i].y;
                    var content = map.mapLevel.getContent(x, y);
                    if (!content)
                        continue;

                    if (asserter) {
                        asserter(content);
                    }

                    if (content.monster) {
                        return [{
                            aicode: dt.mapAICode.MOVE_TO_MONSTER,
                            path: path.splice(0, i + 1)
                        }];
                    }

                    if (content.trap) {
                        return [{
                            aicode: dt.mapAICode.MOVE_TO_TRAP,
                            path: path.splice(0, i + 1)
                        }];
                    }
                }
            }

            return ret;
        },

        _pathBlazer: function (path, asserter) {
            var map = this.getAbacusRef().map;
            for (var i = 0; i < path.length; i++) {
                var x = path[i].x;
                var y = path[i].y;
                if (dt.debug.isStrict()) {
                    dt.assert(map.mapLevel.getTile(x, y) < dt.mapconst.TILE_NOPASS);
                    dt.assert(!map.mapLevel.isFog(x, y));
                }
                var content = map.mapLevel.getContent(x, y);
                if (!content)
                    continue;

                if (asserter) {
                    asserter(content);
                }

                if (content.monster) {
                    return [{
                        aicode: dt.mapAICode.MOVE_TO_MONSTER,
                        path: path.splice(0, i + 1)
                    }];
                }

                if (content.trap) {
                    return [{
                        aicode: dt.mapAICode.MOVE_TO_TRAP,
                        path: path.splice(0, i + 1)
                    }];
                }
            }
        },
    });
});