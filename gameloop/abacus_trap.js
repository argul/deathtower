/**
 * Created by argulworm on 7/6/17.
 */

dt.AbacusTrap = {
    TREAD_TRAP_DIRECT: 0,
    TREAD_TRAP_AFTER_HESITATE: 1,
    FLEE_FROM_TRAP: 2,
    decideTreadoverTrap: function (strategy) {
        switch (strategy) {
            case dt.mapAIStrategy.FULL_AGGRESIVE:
                return this.TREAD_TRAP_DIRECT;
            case dt.mapAIStrategy.MEDIUM_AGGRESIVE:
                return this._doCoreCalculate_Monster(0.75) ? this.TREAD_TRAP_AFTER_HESITATE : this.FLEE_FROM_TRAP;
            case dt.mapAIStrategy.NORMAL:
                return this._doCoreCalculate_Monster(0.5) ? this.TREAD_TRAP_AFTER_HESITATE : this.FLEE_FROM_TRAP;
            case dt.mapAIStrategy.MEDIUM_COWARD:
                return this._doCoreCalculate_Monster(0.25) ? this.TREAD_TRAP_AFTER_HESITATE : this.FLEE_FROM_TRAP;
            case dt.mapAIStrategy.FULL_COWARD:
                return this.FLEE_FROM_TRAP;
            default:
                dt.assert(false);
        }
    },

    _doCoreCalculate_Trap: function (p) {
        //todo
        return true;
    }
};