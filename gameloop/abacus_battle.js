/**
 * Created by argulworm on 7/17/17.
 */

dt.registerClassInheritance('dt.Cls', function () {
    dt.AbacusBattle = dt.Cls.extend({
        ctor: function (teamdata) {
            var self = this;
            this.battleground = new dt.Battleground(teamdata);

            var allunits = this.battleground.getAllUnits();
            this.aiMap = {};
            allunits.forEach(function (x) {
                self.aiMap[x.unitId()] = new dt.BattleAI(x, self);
            });
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

                this._tickUnit(u);

                allunits = this._removeDeadUnits(allunits);
            }
        },

        _tickUnit: function (unit) {
            if (unit.canTakeAction()) {
                var ai = this.aiMap[unit.unitId()];
                var decisions = ai.makeDecision();
            }
        },

        _removeDeadUnits: function (arr) {
            var b = dt.array_any(arr, function (x) {
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
        },

        _onWillStartOneRound: function () {

        },

        _onDidFinishOneRound: function () {

        }
    });
});