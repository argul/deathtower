/**
 * Created by argulworm on 7/6/17.
 */

dt.monsterRiskLevel = {
    VERY_EASY: 0,
    EASY: 1,
    NORMAL: 2,
    HARD: 3,
    VERY_HARD: 4,
    TREMONDOUS_RISKY: 5
};

dt.AbacusMonster = {
    RAID_MONSTER_DIRECT: 0,
    RAID_MONSTER_AFTER_HESITATE: 1,
    FLEE_FROM_MONSTER: 2,
    decideRaidMonster: function (teamData, strategy, monster) {
        var riskLevel = this.calculateMonsterRiskLevel(teamData, monster);
        if (riskLevel <= dt.monsterRiskLevel.EASY) {
            return this.RAID_MONSTER_DIRECT;
        }
        else {
            switch (strategy) {
                case dt.mapAIStrategy.FULL_AGGRESIVE:
                    return this.RAID_MONSTER_DIRECT;
                case dt.mapAIStrategy.MEDIUM_AGGRESIVE:
                    return this._doCoreCalculate_Monster(0.75, riskLevel) ? this.RAID_MONSTER_AFTER_HESITATE : this.FLEE_FROM_MONSTER;
                case dt.mapAIStrategy.NORMAL:
                    return this._doCoreCalculate_Monster(0.5, riskLevel) ? this.RAID_MONSTER_AFTER_HESITATE : this.FLEE_FROM_MONSTER;
                case dt.mapAIStrategy.MEDIUM_COWARD:
                    return this._doCoreCalculate_Monster(0.25, riskLevel) ? this.RAID_MONSTER_AFTER_HESITATE : this.FLEE_FROM_MONSTER;
                case dt.mapAIStrategy.FULL_COWARD:
                    return this.FLEE_FROM_MONSTER;
                default:
                    dt.assert(false);
            }
        }
    },

    _doCoreCalculate_Monster: function (p, riskLevel) {
        //todo
        return true;
    },

    calculateMonsterRiskLevel: function (teamData, monster) {
        //todo
        return dt.monsterRiskLevel.NORMAL;
    }
};