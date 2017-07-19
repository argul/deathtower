/**
 * Created by argulworm on 7/17/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.AbacusBattle = dt.Class.extend({
        ctor: function (teamdata) {
            this.battleground = new dt.Battleground(teamdata);
        },

        tickRound: function () {
            var allunits = this.battleground.getAllUnits();
            while (allunits.length > 0) {
                allunits.sort(function (lhr, rhr) {
                    return rhr.finalAttrs.speed - lhr.finalAttrs.speed;
                });
                var u = allunits.shift();
                while (u.isDead() && allunits.length > 0) {
                    u = allunits.shift();
                }

                if (u.isDead()) {
                    break;
                }

                

                allunits = this.removeDeadUnits(allunits);
            }
        },

        removeDeadUnits: function (arr) {
            var b = arr.any(function (x) {
                return x.isDead();
            });
            if (b) {
                return arr.filter(function (x) {
                    return !x.isDead();
                });
            }
            else {
                return arr;
            }
        }
    });
});