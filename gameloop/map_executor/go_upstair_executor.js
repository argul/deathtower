/**
 * Created by argulworm on 7/13/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.MapGoUpstairExecutor = dt.Class.extend({
        ctor: function (abacusRef) {
            this._abacusRef = abacusRef;
        },

        executeDecision: function (decision) {
            return [{
                behavior: dt.behaviorCode.LEAVE_MAP
            }];
        }
    });
});