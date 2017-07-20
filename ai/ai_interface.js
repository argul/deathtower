/**
 * Created by argulworm on 6/30/17.
 */

dt.registerClassInheritance('dt.Cls', function () {
    dt.AIInterface = dt.Cls.inherit({
        reset: function () {
            dt.assert(false);
        },

        makeDecision: function () {
            dt.assert(false);
        }
    });
});