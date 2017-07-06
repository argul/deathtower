/**
 * Created by argulworm on 6/30/17.
 */

dt.registerClassInheritance('dt.AIGadget', function () {
    dt.MapAIGadgetGotoRoom = dt.AIGadget.extend({
        ctor: function (aiRef) {
            this.aiRef = aiRef;
        },

        getDecisions: function () {
            var self = this;
            var player = this.aiRef.getAbacusRef().playerStat;
            var mapLevel = this.aiRef.getAbacusRef().mapStat.mapLevel;
            var unvisitedRooms = this.aiRef.getAbacusRef().mapStat.unvisitedRooms;
            var curRoom = mapLevel.getRoomByTile(player.posX, player.posY);

            var roomIds = mapLevel.getRoomArr().map(function (x) {
                return x.roomId;
            });
            var todoList = [];
            roomIds.forEach(function (rid) {
                var isCurRoom = (!dt.isUndefined(curRoom) && rid === curRoom.roomId);
                var isUnvisited = (!dt.isUndefined(unvisitedRooms[rid]));
                if (isCurRoom) {
                    return;
                }
                if (isUnvisited) {
                    var valid = [];
                    mapLevel.foreachRoomTile(function (x, y, tile) {
                        if (tile < dt.mapconst.TILE_PASS) {
                            valid.push({x: x, y: y});
                        }
                    }, rid);
                    if (valid.length > 0) {
                        todoList.push(self.aiRef.getAbacusRef().getRandom().randomPick(valid));
                    }
                }
                else {
                    mapLevel.foreachRoomTile(function (x, y, tile) {
                        if (tile > dt.mapconst.TILE_START_LOOT && tile < dt.mapconst.TILE_END_LOOT) {
                            todoList.push({x: x, y: y});
                        }
                        else if (tile === dt.mapconst.TILE_MONSTER) {
                            todoList.push({x: x, y: y});
                        }
                    }, rid);
                }
            });
            while (todoList.length > 0) {
                var path = dt.astar.seekPath(mapLevel, player.posX, player.posY, todoList[0].x, todoList[0].y);
                if (!dt.isUndefined(path)) {
                    return this._buildDecision(path);
                }
            }

            return undefined;
        },

        _buildDecision: function (path) {
            var player = this.aiRef.getAbacusRef().playerStat;
            var mapLevel = this.aiRef.getAbacusRef().mapStat.mapLevel;
            var t1 = mapLevel.getRoomByTile(player.posX, player.posY);

            for (var i = 0; i < path.length; i++) {
                var t2 = mapLevel.getRoomByTile(path[i].x, path[i].y);
                if (!dt.isUndefined(t2) && t2 != t1) {
                    path.splice(i + 1);
                }
            }
            path.forEach(function (element) {
                element.aicode = dt.mapAIDecisionCode.MOVE;
            });
            return path;
        }
    });
});