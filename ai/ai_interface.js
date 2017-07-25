/**
 * Created by argulworm on 6/30/17.
 */

dt.registerClassInheritance('dt.Cls', function () {
    dt.AIInterface = dt.Cls.extend({
        makeDecision: function () {
            dt.assert(false);
        }
    });
});