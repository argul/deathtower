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

dt.mapAICode = {
    MOVE: 1,
    USE_ITEM: 2,
    GOTO_NEXT_MAP: 3
};

dt.registerClassInheritance('dt.AIInterface', function () {
    dt.MapAI = dt.AIInterface.extend({
        ctor: function (abacusRef) {
            this._abacusRef = abacusRef;
        },

        getAbacusRef: function () {
            return this._abacusRef;
        },

        makeDecision: function () {
            
            dt.assert(false);
        }
    });
});