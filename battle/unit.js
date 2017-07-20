/**
 * Created by argulworm on 7/18/17.
 */

dt.registerClassInheritance('dt.Cls', function () {
    dt.Unit = dt.Cls.extend({
        ctor: function () {
            this.dead = false;
        },

        isDead: function () {
            return this.dead;
        }
    });
});