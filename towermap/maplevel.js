/**
 * Created by argulworm on 6/29/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.MapLevel = dt.Class.extend({
        ctor: function (width, height) {
            this.width = width;
            this.height = height;
            this.tiles = dt.suger.genMatrix2D(width, height, dt.mapconst.TILE_WALL);
            this.fogs = dt.suger.genMatrix2D(width, height, true);
            this.contents = dt.suger.genMatrix2D(width, height, undefined);
            this.rooms = [];
            this.roomDict = {};
            this._tile2room = {};
        },

        getWidth: function () {
            return this.width;
        },

        getHeight: function () {
            return this.height;
        },

        addRoom: function (r) {
            this.rooms.push(r);
            this.roomDict[r.roomId] = r;
            for (var i = 1; i < r.width - 1; i++) {
                for (var j = 1; j < r.height - 1; j++) {
                    this.setTile(r.x + i, r.y + j, dt.mapconst.TILE_ROOMFLOOR);
                    this._tile2room[(r.x + i) * 10000 + r.y + j] = r;
                }
            }
        },

        getRoomArr: function () {
            return this.rooms;
        },

        getRoomDict: function () {
            return this.roomDict;
        },

        getRoomByTile: function (x, y) {
            return this._tile2room[x * 10000 + y];
        },

        getTile: function (x, y) {
            return this.tiles[y][x];
        },

        setTile: function (x, y, tile) {
            this.tiles[y][x] = tile;
        },

        foreachTile: function (f) {
            dt.functional.for2DMatrix(function (idx0, idx1, tile) {
                f(idx1, idx0, tile);
            }, this.tiles);
        },

        foreachRoomTile: function (f, roomId) {
            var r = this.roomDict[roomId];
            for (var i = 1; i < r.width - 1; i++) {
                for (var j = 1; j < r.height - 1; j++) {
                    f(r.x + i, r.y + j, this.getTile(r.x + i, r.y + j));
                }
            }
        },

        getContent: function (x, y) {
            return this.contents[y][x];
        },

        isEmptyTile: function (x, y) {
            return dt.isUndefined(this.getContent(x, y));
        }
    });
});