/**
 * Created by argulworm on 7/18/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.Unit = dt.Class.extend({
        ctor: function () {
            this.isDead = false;
        },

        isDead: function () {
            return this.isDead;
        }
    });
});