/**
 * Created by argulworm on 6/30/17.
 */

dt.registerClassInheritance('dt.AIStateInterface', function () {
    dt.MapAIStateExploreRoom = dt.AIStateInterface.extend({
        ctor: function (aiRef) {
            this.aiRef = aiRef;
            this._reset();
        },

        _reset: function () {
            this._targetX = undefined;
            this._targetY = undefined;
            this._path = undefined;
            this._loots = {};
            this._monsters = {};
            this._treasures = {};
        },

        getStateName: function () {
            return 'MapAIStateExploreRoom';
        },

        enter: function () {
            var self = this;
            var player = this.aiRef.getAbacusRef().playerStat;
            var mapLevel = this.aiRef.getAbacusRef().mapStat.mapLevel;
            if (mapLevel.getTile(player.posX, player.posY) != dt.mapconst.TILE_ROOMFLOOR) {
                return false;
            }

            var room = mapLevel.getRoomByTile(player.posX, player.posY);
            mapLevel.foreachRoomTile(function (x, y, tile) {
                if (tile == dt.mapconst.TILE_EQUIPMENT
                    || tile == dt.mapconst.TILE_POTION
                    || tile == dt.mapconst.TILE_SCROLL) {
                    self._loots.push({x: x, y: y});
                }
            }, room.roomId);

            mapLevel.foreachRoomTile(function (x, y, tile) {
                if (tile == dt.mapconst.TILE_MONSTER) {
                    self._monsters.push({x: x, y: y});
                }
            }, room.roomId);

            mapLevel.foreachRoomTile(function (x, y, tile) {
                if (tile == dt.mapconst.TILE_TREASURE) {
                    self._treasures.push({x: x, y: y});
                }
            }, room.roomId);
            if (this._loots.length > 0) {
                this._loots.sort(function (lhr, rhr) {
                    var lhrDis = Math.abs(lhr.x - player.posX) + Math.abs(lhr.y - player.posY);
                    var rhrDis = Math.abs(rhr.x - player.posX) + Math.abs(rhr.y - player.posY);
                    return lhrDis - rhrDis;
                });
                do {
                    var path = dt.astar.seekPath(mapLevel, player.posX, player.posY, this._loots[0].x, this._loots[0].y);
                    if (dt.suger.isUndefined(path)) {
                        this._loots.shift();
                    }
                    else {
                        this._path = path;
                        this._targetX = this._loots[0].x;
                        this._targetY = this._loots[0].y;
                        return true;
                    }
                } while (this._loots.length > 0);
            }

            if (this._monsters.length > 0) {
                this._monsters.sort(function (lhr, rhr) {
                    var lhrDis = Math.abs(lhr.x - player.posX) + Math.abs(lhr.y - player.posY);
                    var rhrDis = Math.abs(rhr.x - player.posX) + Math.abs(rhr.y - player.posY);
                    return lhrDis - rhrDis;
                });
                do {
                    var path = dt.astar.seekPath(mapLevel, player.posX, player.posY, this._monsters[0].x, this._monsters[0].y);
                    if (dt.suger.isUndefined(path)) {
                        this._monsters.shift();
                    }
                    else {
                        this._path = path;
                        this._targetX = this._monsters[0].x;
                        this._targetY = this._monsters[0].y;
                        return true;
                    }
                } while (this._monsters.length > 0);
            }

            if (this._treasures.length > 0) {
                this._treasures.sort(function (lhr, rhr) {
                    var lhrDis = Math.abs(lhr.x - player.posX) + Math.abs(lhr.y - player.posY);
                    var rhrDis = Math.abs(rhr.x - player.posX) + Math.abs(rhr.y - player.posY);
                    return lhrDis - rhrDis;
                });
                do {
                    var path = dt.astar.seekPath(mapLevel, player.posX, player.posY, this._treasures[0].x, this._treasures[0].y);
                    if (dt.suger.isUndefined(path)) {
                        this._treasures.shift();
                    }
                    else {
                        this._path = path;
                        this._targetX = this._treasures[0].x;
                        this._targetY = this._treasures[0].y;
                        return true;
                    }
                } while (this._treasures.length > 0);
            }

            return false;
        },

        exit: function () {
            this._reset();
        },

        tick: function () {
            var ret = undefined;
            var path = this.aiRef.getAbacusRef()._curPath;
            if (dt.suger.isUndefined(path)) {
                do {
                    var posX = this.aiRef.getAbacusRef().playerStat.posX;
                    var posY = this.aiRef.getAbacusRef().playerStat.posY;
                    var mapLevel = this.aiRef.getMapLevel();
                    var room = this.aiRef.getAbacusRef()._curRoom;

                    var loots = [];
                    mapLevel.foreachRoomTile(function (x, y, tile) {
                        if (tile == dt.mapconst.TILE_EQUIPMENT
                            || tile == dt.mapconst.TILE_POTION
                            || tile == dt.mapconst.TILE_SCROLL) {
                            loots.push({x: x, y: y});
                        }
                    }, room.roomId);
                    if (loots.length > 0) {
                        var l = this.aiRef.getAbacusRef().getRandom().randomPick(loots);
                        path = dt.astar.seekPath(mapLevel, posX, posY, l.x, l.y, function (tile) {
                            return tile < dt.mapconst.TILE_PASS
                                && tile != dt.mapconst.TILE_MONSTER
                        });
                        dt.debug.assert(path);
                        this.aiRef.getAbacusRef()._curPath = path;
                        break;
                    }

                    var monsters = [];
                    mapLevel.foreachRoomTile(function (x, y, tile) {
                        if (tile == dt.mapconst.TILE_MONSTER) {
                            monsters.push({x: x, y: y});
                        }
                    }, room.roomId);
                    if (monsters.length > 0) {

                    }

                } while (false);
            }

            var next = path.shift();
            ret = [{
                aicode: dt.mapAIDecisionCode.MOVE,
                moveToX: next.x,
                moveToY: next.y
            }];
            if (path.length <= 0) {
                this.markAsDone();
            }
            return ret;
        }
    });
});