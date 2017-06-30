/**
 * Created by argulworm on 6/30/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.AIInterface = dt.Class.extend({
        reset: function () {
            dt.debug.assert(false);
        },

        tick: function () {
            dt.debug.assert(false);
        }
    });
});