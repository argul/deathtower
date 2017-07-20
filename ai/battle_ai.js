/**
 * Created by argulworm on 7/20/17.
 */

dt.battleAICode = {
    PERFORM_SKILL: 0
};

dt.registerClassInheritance('dt.AIInterface', function () {
    dt.BattleAI = dt.AIInterface.inherit({
        _VERBOSE: false,
        ctor: function (myUnit, abacusRef) {
            this.myUnit = myUnit;
            this._abacusRef = abacusRef;
        },

        getAbacusRef: function () {
            return this._abacusRef;
        },

        makeDecision: function () {
            if (!this.myUnit.canTakeAction())
                return [];

            
        }
    });
});