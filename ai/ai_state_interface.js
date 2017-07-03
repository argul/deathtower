/**
 * Created by argulworm on 6/30/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.AIStateInterface = dt.Class.extend({
        ctor: function () {
        },

        enter: function () {
        },

        exit: function () {
        },

        getStateName: function () {
            dt.debug.assert(false);
        },

        tick: function () {
            dt.debug.assert(false);
        },

        isDone: function () {
            dt.debug.assert(false);
        }
    });
});