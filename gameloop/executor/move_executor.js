/**
 * Created by argulworm on 6/29/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.MapMoveExecutor = dt.Class.extend({
        ctor: function (abacusRef) {
            this._abacusRef = abacusRef;
            this._decision = undefined;
            this._moveFuncs = {};
            this._moveFuncs[dt.mapconst.TILE_CORRIDOR] = this._moveToSpace;
            this._moveFuncs[dt.mapconst.TILE_ROOMFLOOR] = this._moveToSpace;
            this._moveFuncs[dt.mapconst.TILE_STAIR_UPWARD] = this._moveToSpace;
            this._moveFuncs[dt.mapconst.TILE_STAIR_DOWNWARD] = this._moveToSpace;
            this._moveFuncs[dt.mapconst.TILE_EQUIPMENT] = this._moveToLoot;
            this._moveFuncs[dt.mapconst.TILE_POTION] = this._moveToLoot;
            this._moveFuncs[dt.mapconst.TILE_SCROLL] = this._moveToLoot;
            this._moveFuncs[dt.mapconst.TILE_TREASURE] = this._moveToTreasure;
            this._moveFuncs[dt.mapconst.TILE_MONSTER] = this._moveToMonster;
            this._moveFuncs[dt.mapconst.TILE_TRAP] = this._moveToTrap;
            this._moveFuncs[dt.mapconst.TILE_MONSTER_AVOID] = this._moveToMonster2;
            this._moveFuncs[dt.mapconst.TILE_TRAP_AVOID] = this._moveToTrap2;
            this._reset();
        },

        getAbacusRef: function () {
            return this._abacusRef;
        },

        init: function (decision) {
            var map = this.getAbacusRef().map;
            this._reset();
            this.system32.decision = decision;
            this.system32.dstX = decision.x;
            this.system32.dstY = decision.y;
            this.system32.path = dt.astar.seekPath(map.mapLevel, map.teamX, map.teamY, decision.x, decision.y);
            dt.assert(this.system32.path);
            dt.assert(this.system32.path.length > 0);
        },

        _reset: function () {
            this.system32 = {
                done: false
            };
        },

        isDoneExecution: function () {
            return this.system32.done;
        },

        tickExecute: function () {
            var map = this.getAbacusRef().map;
            var next = this.system32.path.shift();
            var tileContent = map.mapLevel.getContent(next.x, next.y);
            var mutex = false;
            if (tileContent.trap) {
                dt.assert(!mutex);
                mutex = true;
            }
            if (tileContent.monster) {
                dt.assert(!mutex);
                mutex = true;
            }
            if (tileContent.treasure) {
                dt.assert(!mutex);
                mutex = true;
            }
            if (tileContent.equipment) {
                dt.assert(!mutex);
                mutex = true;
            }
            if (tileContent.item) {
                dt.assert(!mutex);
                mutex = true;
            }
            else {
                if (dt.debug.isStrict()) {
                    dt.assert(map.mapLevel.getTile(next.x, next.y) < dt.mapconst.TILE_NOPASS);
                }
            }


            if (this.system32.path <= 0) {
                this.system32.done = true;
            }
        },

        _executeMove: function (moveToX, moveToY) {
            var mapStat = this.getAbacusRef().mapStat;
            var playerStat = this.getAbacusRef().playerStat;
            var mapLevel = mapStat.mapLevel;
            if (dt.debug.isStrict()) {
                this._checkMove(moveToX, moveToY)
            }

            var t = mapLevel.getRoomByTile(moveToX, moveToY);
            if (t && mapStat.unvisitedRooms[t.roomId]) {
                delete mapStat.unvisitedRooms[t.roomId];
            }

            var tile = this.getAbacusRef().mapStat.mapLevel.getTile(moveToX, moveToY);
            var handler = this._moveFuncs[tile];
            dt.assert(handler);
            return handler(mapStat, playerStat, moveToX, moveToY);
        },

        _executeGotoNextMap: function () {
            return {
                interrupt: false,
                behaviors: [{
                    behaviorCode: dt.behaviorCode.LEAVE_MAP
                }]
            };
        },

        _checkMove: function (moveToX, moveToY) {
            var tx = Math.abs(moveToX - this.getAbacusRef().playerStat.posX);
            var ty = Math.abs(moveToY - this.getAbacusRef().playerStat.posY);
            dt.assert(1 == (tx + ty));
            dt.assert(dt.mapconst.TILE_PASS > this.getAbacusRef().mapStat.mapLevel.getTile(moveToX, moveToY));
        },

        _moveToSpace: function (mapStat, playerStat, moveToX, moveToY) {
            var ret = {
                interrupt: false,
                behaviors: []
            };

            playerStat.posX = moveToX;
            playerStat.posY = moveToY;
            ret.behaviors.push({
                behaviorCode: dt.behaviorCode.MOVE,
                x: moveToX,
                y: moveToY
            });

            return ret;
        },

        _moveToLoot: function (mapStat, playerStat, moveToX, moveToY) {
            var ret = {
                interrupt: false,
                behaviors: []
            };

            playerStat.posX = moveToX;
            playerStat.posY = moveToY;
            ret.behaviors.push({
                behaviorCode: dt.behaviorCode.MOVE,
                x: moveToX,
                y: moveToY
            });

            ret.behaviors.push({
                behaviorCode: dt.behaviorCode.LOOT,
                loot: mapStat.loots[moveToX * 10000 + moveToY]
            });
            delete mapStat.loots[moveToX * 10000 + moveToY];

            ret.behaviors.push({
                behaviorCode: dt.behaviorCode.CHANGE_TILE_TYPE,
                x: moveToX,
                y: moveToY,
                fromType: mapStat.mapLevel.getTile(moveToX, moveToY),
                toType: this._isTileInRoom(mapStat.mapLevel, moveToX, moveToY) ? dt.mapconst.TILE_CORRIDOR : dt.mapconst.TILE_ROOMFLOOR
            });

            return ret;
        },

        _isTileInRoom: function (mapLevel, x, y) {
            return !dt.isUndefined(mapLevel.getRoomByTile(x, y));
        },

        _moveToTreasure: function (mapStat, playerStat, moveToX, moveToY) {
            var ret = {
                interrupt: false,
                behaviors: []
            };

            playerStat.posX = moveToX;
            playerStat.posY = moveToY;
            ret.behaviors.push({
                behaviorCode: dt.behaviorCode.MOVE,
                x: moveToX,
                y: moveToY
            });

            ret.behaviors.push({
                behaviorCode: dt.behaviorCode.OPEN_TREASURE,
                treasure: mapStat.treasure[moveToX * 10000 + moveToY]
            });
            delete mapStat.treasure[moveToX * 10000 + moveToY];

            ret.behaviors.push({
                behaviorCode: dt.behaviorCode.CHANGE_TILE_TYPE,
                x: moveToX,
                y: moveToY,
                fromType: dt.mapconst.TILE_TREASURE,
                toType: this._isTileInRoom(mapStat.mapLevel, moveToX, moveToY) ? dt.mapconst.TILE_CORRIDOR : dt.mapconst.TILE_ROOMFLOOR
            });

            return ret;
        },

        _moveToMonster: function (mapStat, playerStat, moveToX, moveToY) {
            var ret = {
                interrupt: false,
                behaviors: []
            };
            var monster = mapStat.monsters[moveToX * 10000 + moveToY];
            var result = this.getAbacusRef().decideRaidMonster(monster);
            if (result == dt.Abacus.RAID_MONSTER_DIRECT) {
                playerStat.posX = moveToX;
                playerStat.posY = moveToY;
                ret.behaviors.push({
                    behaviorCode: dt.behaviorCode.MOVE,
                    x: moveToX,
                    y: moveToY
                });

                ret.behaviors.push({
                    behaviorCode: dt.behaviorCode.RAID_MONSTER,
                    x: moveToX,
                    y: moveToY,
                    monster: monster
                });

                ret.behaviors.push({
                    behaviorCode: dt.behaviorCode.ENTER_BATTLE
                });
            }
            else if (result == dt.Abacus.RAID_MONSTER_AFTER_HESITATE) {
                playerStat.posX = moveToX;
                playerStat.posY = moveToY;
                ret.behaviors.push({
                    behaviorCode: dt.behaviorCode.HESITATE
                });

                ret.behaviors.push({
                    behaviorCode: dt.behaviorCode.MOVE,
                    x: moveToX,
                    y: moveToY
                });

                ret.behaviors.push({
                    behaviorCode: dt.behaviorCode.RAID_MONSTER,
                    x: moveToX,
                    y: moveToY,
                    monster: monster
                });

                ret.behaviors.push({
                    behaviorCode: dt.behaviorCode.ENTER_BATTLE
                });
            }
            else if (result == dt.Abacus.FLEE_FROM_MONSTER) {
                mapStat.mapLevel.setTile(moveToX, moveToY, dt.mapconst.TILE_MONSTER_AVOID);
                ret.interrupt = true;
                ret.map2battle = true;
            }
            return ret;
        },

        _moveToMonster2: function (mapStat, playerStat, moveToX, moveToY) {
            var ret = {
                interrupt: false,
                behaviors: []
            };
            var monster = mapStat.monsters[moveToX * 10000 + moveToY];
            playerStat.posX = moveToX;
            playerStat.posY = moveToY;
            ret.behaviors.push({
                behaviorCode: dt.behaviorCode.MOVE,
                x: moveToX,
                y: moveToY
            });

            ret.behaviors.push({
                behaviorCode: dt.behaviorCode.RAID_MONSTER,
                x: moveToX,
                y: moveToY,
                monster: monster
            });

            ret.behaviors.push({
                behaviorCode: dt.behaviorCode.ENTER_BATTLE
            });
            return ret;
        },

        _moveToTrap: function (mapStat, playerStat, moveToX, moveToY) {
            var ret = {
                interrupt: false,
                behaviors: []
            };
            var trap = mapStat.traps[moveToX * 10000 + moveToY];
            ret.behaviors.push({
                behaviorCode: dt.behaviorCode.DISARM_TRAP,
                x: moveToX,
                y: moveToY
            });
            if (trap.disarm(playerStat.teamData)) {
                ret.behaviors.push({
                    behaviorCode: dt.behaviorCode.DISARM_TRAP_SUCCESS
                });
                ret.behaviors.push({
                    behaviorCode: dt.behaviorCode.CHANGE_TILE_TYPE,
                    x: moveToX,
                    y: moveToY,
                    fromType: dt.mapconst.TILE_TRAP,
                    toType: this._isTileInRoom(mapStat.mapLevel, moveToX, moveToY) ? dt.mapconst.TILE_CORRIDOR : dt.mapconst.TILE_ROOMFLOOR
                });

                playerStat.posX = moveToX;
                playerStat.posY = moveToY;
                ret.behaviors.push({
                    behaviorCode: dt.behaviorCode.MOVE,
                    x: moveToX,
                    y: moveToY
                });
            }
            else {
                var result = this.getAbacusRef().decideTreadoverTrap();
                if (result == dt.Abacus.TREAD_TRAP_DIRECT) {
                    playerStat.posX = moveToX;
                    playerStat.posY = moveToY;
                    ret.behaviors.push({
                        behaviorCode: dt.behaviorCode.MOVE,
                        x: moveToX,
                        y: moveToY
                    });

                    ret.behaviors.push({
                        behaviorCode: dt.behaviorCode.TRAP_ACTIVATE,
                        x: moveToX,
                        y: moveToY,
                        trap: trap
                    });
                }
                else if (result == dt.Abacus.RAID_MONSTER_AFTER_HESITATE) {
                    ret.behaviors.push({
                        behaviorCode: dt.behaviorCode.HESITATE
                    });

                    playerStat.posX = moveToX;
                    playerStat.posY = moveToY;
                    ret.behaviors.push({
                        behaviorCode: dt.behaviorCode.MOVE,
                        x: moveToX,
                        y: moveToY
                    });

                    ret.behaviors.push({
                        behaviorCode: dt.behaviorCode.TRAP_ACTIVATE,
                        x: moveToX,
                        y: moveToY,
                        trap: trap
                    });
                }
                else if (result == dt.Abacus.FLEE_FROM_MONSTER) {
                    mapStat.mapLevel.setTile(moveToX, moveToY, dt.mapconst.TILE_TRAP_AVOID);
                    ret.interrupt = true;
                }
            }
            return ret;
        },

        _moveToTrap2: function (mapStat, playerStat, moveToX, moveToY) {
            var ret = {
                interrupt: false,
                behaviors: []
            };
            var trap = mapStat.traps[moveToX * 10000 + moveToY];

            playerStat.posX = moveToX;
            playerStat.posY = moveToY;
            ret.behaviors.push({
                behaviorCode: dt.behaviorCode.MOVE,
                x: moveToX,
                y: moveToY
            });

            ret.behaviors.push({
                behaviorCode: dt.behaviorCode.TRAP_ACTIVATE,
                x: moveToX,
                y: moveToY,
                trap: trap
            });
            return ret;
        }
    });
});