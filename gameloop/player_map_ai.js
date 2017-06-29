/**
 * Created by argulworm on 6/29/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.PlayerMapAI = dt.Class.extend({
        ctor: function (abacusRef) {
            this._abacusRef = abacusRef;
        },

        getAbacusRef : function () {
            return this._abacusRef;
        },

        reset : function () {
            
        },

        tick: function () {

        }
    });
});