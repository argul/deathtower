/**
 * Created by argulworm on 6/30/17.
 */

dt.registerClassInheritance('dt.AIGadget', function () {
    dt.MapAIGadgetExploreRoom = dt.AIGadget.extend({
        ctor: function (aiRef) {
            this.aiRef = aiRef;
        },

        getDecisions: function () {
            var self = this;
            var player = this.aiRef.getAbacusRef().playerStat;
            var mapLevel = this.aiRef.getAbacusRef().mapStat.mapLevel;
            if (mapLevel.getTile(player.posX, player.posY) != dt.mapconst.TILE_ROOMFLOOR) {
                return undefined;
            }

            var sortFunc = function (lhr, rhr) {
                var lhrDis = Math.abs(lhr.x - player.posX) + Math.abs(lhr.y - player.posY);
                var rhrDis = Math.abs(rhr.x - player.posX) + Math.abs(rhr.y - player.posY);
                return lhrDis - rhrDis;
            };

            var room = mapLevel.getRoomByTile(player.posX, player.posY);
            var loots = [];
            mapLevel.foreachRoomTile(function (x, y, tile) {
                if (tile == dt.mapconst.TILE_EQUIPMENT
                    || tile == dt.mapconst.TILE_POTION
                    || tile == dt.mapconst.TILE_SCROLL) {
                    loots.push({x: x, y: y});
                }
            }, room.roomId);
            loots.sort(sortFunc);

            while (loots.length > 0) {
                var path = this._checkReachable(mapLevel, room, player.posX, player.posY, loots[0].x, loots[0].y);
                if (dt.suger.isUndefined(path)) {
                    loots.shift();
                }
                else {
                    return this._buildDecision(path);
                }
            }

            var monsters = [];
            mapLevel.foreachRoomTile(function (x, y, tile) {
                if (tile == dt.mapconst.TILE_MONSTER) {
                    monsters.push({x: x, y: y});
                }
            }, room.roomId);
            monsters.sort(sortFunc);

            while (monsters.length > 0) {
                var path = this._checkReachable(mapLevel, room, player.posX, player.posY, monsters[0].x, monsters[0].y);
                if (dt.suger.isUndefined(path)) {
                    monsters.shift();
                }
                else {
                    return this._buildDecision(path);
                }
            }

            var treasures = [];
            mapLevel.foreachRoomTile(function (x, y, tile) {
                if (tile == dt.mapconst.TILE_TREASURE) {
                    treasures.push({x: x, y: y});
                }
            }, room.roomId);
            treasures.sort(sortFunc);

            while (treasures.length > 0) {
                var path = this._checkReachable(mapLevel, room, player.posX, player.posY, treasures[0].x, treasures[0].y);
                if (dt.suger.isUndefined(path)) {
                    treasures.shift();
                }
                else {
                    return this._buildDecision(path);
                }
            }

            return undefined;
        },

        _buildDecision: function (path) {
            return path.map(function (element) {
                return {
                    aicode: dt.mapAIDecisionCode.MOVE,
                    x: element.x,
                    y: element.y
                }
            });
        },

        _checkReachable: function (mapLevel, room, posX, posY, targetX, targetY) {
            var path = dt.astar.seekPath(mapLevel, posX, posY, targetX, targetY);
            if (dt.suger.isUndefined(path)) {
                return undefined;
            }
            else {
                for (var i = 0; i < path.length; i++) {
                    var tr = mapLevel.getRoomByTile(path[i].x, path[i].y);
                    if (dt.suger.isUndefined(tr) || tr.roomId != room.roomId) {
                        return undefined;
                    }
                }
                return path;
            }
        }
    });
});