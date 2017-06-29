/**
 * Created by argulworm on 6/29/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.PlayerMapExecutor = dt.Class.extend({
        ctor: function (abacusRef) {
            this._abacusRef = abacusRef;
        },

        getAbacusRef : function () {
            return this._abacusRef;
        },
    });
});