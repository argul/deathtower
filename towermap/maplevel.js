/**
 * Created by argulworm on 6/29/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.MapLevel = dt.Class.extend({
        ctor: function (width, height) {
            this.width = width;
            this.height = height;
            this.tiles = dt.suger.genMatrix2D(width, height, dt.mapconst.TILE_WALL);
            this.rooms = [];
            this.roomDict = {};
            this.tile2room = {};
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
                    this.tile2room[(r.x + i) * 10000 + r.y + j] = r;
                }
            }
        },

        getRooms: function () {
            return this.rooms;
        },

        getRoomByTile: function (x, y) {
            return this.tile2room[x * 10000 + y];
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
    });
});