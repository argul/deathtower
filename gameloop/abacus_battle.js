/**
 * Created by argulworm on 7/17/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.AbacusBattle = dt.Class.extend({
        ctor: function (teamdata) {
            this.battleground = new dt.Battleground(teamdata);
        },

        tickOneRound: function () {
            var allunits = this.battleground.getAllUnits();
            while (allunits.length > 0) {
                allunits.sort();

                allunits = this.removeDeadUnits(allunits);
            }
        },

        removeDeadUnits: function (arr) {
            var b = arr.any(function (x) {
                return x.isDead;
            });
            if (b) {
                return arr.filter(function (x) {
                    return !x.isDead;
                });
            }
            else {
                return arr;
            }
        }
    });
});