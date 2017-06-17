/**
 * Created by argulworm on 6/15/17.
 */

dt.mapgen = {
    generateMapLevel: function (mapConfig, ctx) {
        var roomNumber = ctx.random.randomInt(mapConfig.minRoomNumber, mapConfig.maxRoomNumber);
        var rooms = [];
        for (var i = 0; i < roomNumber; i++) {
            rooms.push({
                x: 0,
                y: 0,
                width: ctx.random.randomInt(mapConfig.minRoomWidth, mapConfig.maxRoomWidth),
                height: ctx.random.randomInt(mapConfig.minRoomHeight, mapConfig.maxRoomHeight),
                offsets: []
            });
        }

        for (var i = 0; i < roomNumber; i++) {
            rooms[i].x = ctx.random.randomInt(0, mapConfig.width - rooms[i].width);
            rooms[i].y = ctx.random.randomInt(0, mapConfig.height - rooms[i].height);
        }

        var roomsOk = false;
        for (var i = 0; i < mapConfig.maxTryTimes; i++) {
            dt.debug.dumpAscIIMap(mapConfig, rooms);
            if (this._scatterRooms(mapConfig, rooms)) {
                roomsOk = true;
            }
        }

        dt.suger.print(roomsOk);
        if (!roomsOk){
            return undefined;
        }

        //todo
    },

    _scatterRooms: function (mapConfig, rooms) {
        var isStable = true;
        dt.suger.shuffle(rooms);
        var len = rooms.length;
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < len; j++) {
                if (j <= i) {
                    continue;
                }
                var r = this._arbitrateRoomIntersect(mapConfig, rooms[i], rooms[j]);
                if (!dt.suger.isUndefined(r)) {
                    isStable = false;
                    rooms[i].offsets.push({
                        x: r[0],
                        y: r[1]
                    });
                    rooms[j].offsets.push({
                        x: -r[0],
                        y: -r[1]
                    });
                }
            }
        }
        for (var i = 0; i < len; i++) {
            if (rooms[i].offsets.length == 0){
                continue;
            }
            var offset = {x: 0, y: 0};
            for (var j = 0; j < rooms[i].offsets.length; j++) {
                offset.x += rooms[i].offsets[j].x;
                offset.y += rooms[i].offsets[j].y;
                offset.x = this._phaseStep(offset.x, 0);
                offset.y = this._phaseStep(offset.y, 0);
            }
            this._moveRoom(mapConfig, rooms[i], offset);
            rooms[i].offsets = [];
        }
        return isStable;
    },

    _moveRoom: function (mapConfig, room, offset) {
        if (offset.x > 0) {
            room.x += Math.min(offset.x, mapConfig.width - room.x - room.width);
        }
        else if (offset.x < 0) {
            room.x += Math.max(offset.x, -room.x);
        }
        if (offset.y > 0) {
            room.y += Math.min(offset.y, mapConfig.height - room.y - room.height);
        }
        else if (offset.y < 0) {
            room.y += Math.max(offset.y, -room.y);
        }
    },

    _arbitrateRoomIntersect: function (mapConfig, srcRoom, dstRoom) {
        if (srcRoom.x > (dstRoom.x + dstRoom.width)) {
            return undefined;
        }
        else if (dstRoom.x > (srcRoom.x + srcRoom.width)) {
            return undefined;
        }
        else if (srcRoom.y > (dstRoom.y + dstRoom.height)) {
            return undefined;
        }
        else if (dstRoom.y > (srcRoom.y + srcRoom.height)) {
            return undefined;
        }
        var srcCenterX = srcRoom.x + srcRoom.width / 2;
        var srcCenterY = srcRoom.y + srcRoom.height / 2;
        var dstCenterX = dstRoom.x + dstRoom.width / 2;
        var dstCenterY = dstRoom.y + dstRoom.height / 2;
        if ((srcCenterX == dstCenterX) && (srcCenterY == dstCenterY)) {
            var canvasCenterX = mapConfig.width / 2;
            var canvasCenterY = mapConfig.height / 2;
            if ((canvasCenterX == srcCenterX) && (canvasCenterY == srcCenterY)) {
                return [-1, -1];
            }
            else {
                return [
                    this._phaseStep(srcCenterX, canvasCenterX),
                    this._phaseStep(srcCenterY, canvasCenterY)
                ];
            }
        }
        else {
            return [
                this._phaseStep(srcCenterX, dstCenterX),
                this._phaseStep(srcCenterY, dstCenterY)
            ];
        }
    },

    _phaseStep: function (x, y) {
        if (x < y) {
            return -1;
        }
        else if (x > y) {
            return 1;
        }
        else {
            return 0;
        }
    }
};