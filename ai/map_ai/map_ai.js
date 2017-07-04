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
            this._AIGadgetPriorityList = [
                new dt.MapAIGadgetExploreRoom(this),
                new dt.MapAIGadgetGotoRoom(this),
                new dt.MapAIGadgetGotoLoot(this),
                new dt.MapAIGadgetGotoMonster(this),
                new dt.MapAIGadgetGotoStair(this)
            ];
            var unvisitedRooms = {};
            abacusRef.mapStat.mapLevel.getRooms().forEach(function (x) {
                unvisitedRooms[x.roomId] = x;
            });
            this.unvisitedRooms = unvisitedRooms;
        },

        getStrategy: function () {
            return this._strategy;
        },

        tick: function () {
            for (var i = 0; i < this._AIGadgetPriorityList.length; i++) {
                var decisions = this._AIGadgetPriorityList[i].getDecisions();
                if (!dt.isUndefined(decisions)){
                    return decisions;
                }
            }
            dt.assert(false);
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
                        dt.assert(false);
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
                    dt.assert(false);
            }
        }
    });
});