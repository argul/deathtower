/**
 * Created by argulworm on 6/30/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.AIInterface = dt.Class.extend({
        reset: function () {
            dt.assert(false);
        },

        makeDecision: function () {
            dt.assert(false);
        }
    });
});