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
    GOTO_NEXT_MAP: 2
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
        },

        getAbacusRef: function () {
            return this._abacusRef;
        },

        getStrategy: function () {
            return this._strategy;
        },

        tick: function () {
            for (var i = 0; i < this._AIGadgetPriorityList.length; i++) {
                var decisions = this._AIGadgetPriorityList[i].getDecisions();
                if (!dt.isUndefined(decisions)) {
                    return decisions;
                }
            }
            dt.assert(false);
        }
    });
});