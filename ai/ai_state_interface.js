/**
 * Created by argulworm on 6/30/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.AIStateInterface = dt.Class.extend({
        ctor: function () {
            this._isDone = false;
        },

        getStateName: function () {
            dt.debug.assert(false);
        },

        tick: function () {
            dt.debug.assert(false);
        },

        isDone: function () {
            return this._isDone;
        },

        markAsDone: function () {
            this._isDone = true;
        }
    });
});