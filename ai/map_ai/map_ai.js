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
            this._AIStatePriorityList = [
                new dt.MapAIStateExploreRoom(this),
                new dt.MapAIStateGotoRoom(this),
                new dt.MapAIStateGotoLoot(this),
                new dt.MapAIStateGotoMonster(this),
                new dt.MapAIStateGotoStair(this)
            ];
            this._AIState = undefined;
            this._remainRooms = {};
            var self = this;
            abacusRef.mapStat.mapLevel.getRooms().forEach(function (x) {
                self._remainRooms[x.roomId] = x;
            });
        },

        getStrategy: function () {
            return this._strategy;
        },

        tick: function () {
            if (dt.suger.isUndefined(this._AIState)) {
                this._AIState = this._getNextAIState();
            }
            else {
                if (this._AIState.isDone()) {
                    this._AIState.exit();
                    this._AIState = this._getNextAIState();
                }
            }
            dt.debug.assert(this._AIState);
            return this._AIState.tick();
        },

        _getNextAIState: function () {
            for (var i = 0; i < this._AIStatePriorityList.length; i++) {
                if (this._AIStatePriorityList[i].enter()) {
                    return this._AIStatePriorityList[i];
                }
            }
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