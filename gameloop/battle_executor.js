/**
 * Created by argulworm on 6/30/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.BattleExecutor = dt.Class.extend({
        ctor: function (abacusRef) {
            this._abacusRef = abacusRef;
        },

        getAbacusRef : function () {
            return this._abacusRef;
        },
    });
});