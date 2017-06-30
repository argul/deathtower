/**
 * Created by argulworm on 6/29/17.
 */

dt.mapAICode = {
    IDLE: 0,
    MOVE: 1

};

dt.registerClassInheritance('dt.Class', function () {
    dt.PlayerMapAI = dt.Class.extend({
        DECISION_EXPLORE_ROOM: 'DECISION_EXPLORE_ROOM',
        DECISION_GOTO_ROOM: 'DECISION_GOTO_ROOM',
        DECISION_GOTO_TREASURE: 'DECISION_GOTO_TREASURE',
        DECISION_GOTO_MONSTER: 'DECISION_GOTO_MONSTER',
        ctor: function (abacusRef, strategy) {
            this._abacusRef = abacusRef;
            this._strategy = strategy;
            this._curDecision = undefined;
            this._remainRooms = {};
            this._remainLoots = {};
            var self = this;
            abacusRef.mapStat.mapLevel.getRooms().forEach(function (x) {
                self._remainRooms[x.roomId] = x;
            });
            abacusRef.mapStat.mapLevel.foreachTile(function (x, y, tile) {
                if (tile == dt.mapconst.TILE_EQUIPMENT
                    || tile == dt.mapconst.TILE_POTION
                    || tile == dt.mapconst.TILE_SCROLL) {
                    self._remainLoots[x * 10000 + y] = true;
                }
            });
            this._roomInfo = this._getDummyRoomInfo();
            this._pathInfo = this._getDummyPathInfo();
        },

        getAbacusRef: function () {
            return this._abacusRef;
        },

        getRandom: function () {
            return this.getAbacusRef().ctx.random;
        },

        getMapLevel: function () {
            return this.getAbacusRef().mapStat.mapLevel;
        },

        getStrategy: function () {
            return this._strategy;
        },

        reset: function () {
            var abacus = this.getAbacusRef();
            var x = abacus.playerStat.posX;
            var y = abacus.playerStat.posY;
            var mapLevel = abacus.mapStat.mapLevel;
            if (mapLevel.getTile(x, y) == dt.mapconst.TILE_ROOMFLOOR) {
                this._roomInfo.curRoom = mapLevel.getRoomByTile(x, y);
                delete this._remainRooms[this._roomInfo.curRoom.roomId];
                this._curDecision = this.DECISION_EXPLORE_ROOM;
            }
            else {
                this._curDecision = this.DECISION_GOTO_ROOM;
                this._seekNextRoom();
            }
        },

        _getDummyRoomInfo: function () {
            return {
                curRoom: undefined,
                dstRoom: undefined,
                loots: undefined,
                treasures: undefined,
                monsters: undefined
            };
        },

        _getDummyPathInfo: function () {
            return {
                curPath: undefined
            };
        },

        _seekNextRoom: function () {
            var rndRoom = this.getRandom().randomPick(this._remainRooms);
            var posX = this.getAbacusRef().playerStat.posX;
            var posY = this.getAbacusRef().playerStat.posY;
            dt.debug.assert(!this._isRoomfloor(posX, posY));
            var centerX = rndRoom.x + Math.floor(rndRoom.width / 2) + 1;
            var centerY = rndRoom.y + Math.floor(rndRoom.height / 2) + 1;
            var path = dt.astar.seekPath(this.getMapLevel(), posX, posY, centerX, centerY);
            for (var i = 0; i < path.length; i++) {
                if (this._isRoomfloor(path[i].x, path[i].y)) {
                    path.splice(i + 1);
                }
            }
            this._pathInfo.curPath = path;
        },

        _isRoomfloor: function (x, y) {
            return this.getMapLevel().getTile(x, y) === dt.mapconst.TILE_ROOMFLOOR;
        },

        tick: function () {

        }
    });
});