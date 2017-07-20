/**
 * Created by argulworm on 7/17/17.
 */

dt.registerClassInheritance('dt.Cls', function () {
    dt.Battleground = dt.Cls.extend({
        ctor: function (teamdata, monster) {
            this.leftUnits = [];
            this.rightUnits = [];
            this.globalEffects = [];
        },

        getAllUnits: function () {
            return this.leftUnits.concat(this.rightUnits);
        }
    });
});