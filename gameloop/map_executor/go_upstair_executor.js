/**
 * Created by argulworm on 7/13/17.
 */

dt.registerClassInheritance('dt.Cls', function () {
    dt.MapGoUpstairExecutor = dt.Cls.extend({
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