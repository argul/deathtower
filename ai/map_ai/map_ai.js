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

dt.mapAIDecisionCode = {
    IDLE: 0,
    MOVE: 1,
    HESITATE: 2,
    RAID_MONSTER: 3,
    EVADE_MONSTER: 4,
    DISARM_TRAP: 5,
    TREAD_TRAP: 6,
    EVADE_TRAP: 7
};

dt.monsterRelativeDangerLevel = {
    VERY_EASY: 0,
    EASY: 1,
    NORMAL: 2,
    HARD: 3,
    VERY_HARD: 4,
    TREMONDOUS_RISKY: 5
};

dt.registerClassInheritance('dt.AIInterface', function () {
    dt.MapAI = dt.AIInterface.extend({
        ctor: function (abacusRef, strategy) {
            this._abacusRef = abacusRef;
            this._strategy = strategy;
            this._AIState = undefined;
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
                this._AIState = new dt.MapAIStateExploreRoom(this);
            }
            else {
                this._AIState = new dt.MapAIStateGotoRoom(this);
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
            dt.debug.assert(this._AIState);
            if (this._AIState.isDone()) {
                this._AIState = this._getNextAIState();
            }
            return this._AIState.tick();
        },

        _getNextAIState: function () {

        },

        decideRaidMonster: function (monster) {
            var riskLevel = this.calculateMonsterRiskLevel(this.getAbacusRef().playerStat.teamData, monster);
            if (riskLevel <= dt.monsterRelativeDangerLevel.EASY) {
                return [dt.mapAIDecisionCode.RAID_MONSTER];
            }
            else {
                switch (this._strategy) {
                    case dt.mapAIStrategy.FULL_AGGRESIVE:
                        return 0;
                    case dt.mapAIStrategy.MEDIUM_AGGRESIVE:
                        return this._doCoreCalculate_Monster(0.75, riskLevel) ? 1 : 2;
                    case dt.mapAIStrategy.NORMAL:
                        return this._doCoreCalculate_Monster(0.5, riskLevel) ? 1 : 2;
                    case dt.mapAIStrategy.MEDIUM_COWARD:
                        return this._doCoreCalculate_Monster(0.25, riskLevel) ? 1 : 2;
                    case dt.mapAIStrategy.FULL_COWARD:
                        return 2;
                    default:
                        dt.debug.assert(false);
                }
            }
        },

        _doCoreCalculate_Monster: function (p, riskLevel) {
            //todo
            return true;
        },

        _doCoreCalculate_Trap: function (p) {
            //todo
            return true;
        },

        calculateMonsterRiskLevel: function (teamData, monster) {
            //todo
            return dt.monsterRelativeDangerLevel.NORMAL;
        },

        decideTreadoverTrap: function () {
            switch (this._strategy) {
                case dt.mapAIStrategy.FULL_AGGRESIVE:
                    return 0;
                case dt.mapAIStrategy.MEDIUM_AGGRESIVE:
                    return this._doCoreCalculate_Monster(0.75) ? 1 : 2;
                case dt.mapAIStrategy.NORMAL:
                    return this._doCoreCalculate_Monster(0.5) ? 1 : 2;
                case dt.mapAIStrategy.MEDIUM_COWARD:
                    return this._doCoreCalculate_Monster(0.25) ? 1 : 2;
                case dt.mapAIStrategy.FULL_COWARD:
                    return 2;
                default:
                    dt.debug.assert(false);
            }
        }
    });
});