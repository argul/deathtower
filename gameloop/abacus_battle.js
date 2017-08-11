/**
 * Created by argulworm on 7/17/17.
 */

dt.registerClassInheritance('dt.Cls', function () {
    dt.AbacusBattle = dt.Cls.extend({
        ctor: function (abacusId, teamdata, monsterdata, rnd) {
            var self = this;
            this.abacusId = abacusId;
            this.rnd = rnd;
            this.battleground = new dt.Battleground(teamdata, monsterdata);

            var allunits = this.battleground.getAllUnits();
            this.aiMap = {};
            allunits.forEach(function (x) {
                self.aiMap[x.unitId()] = new dt.BattleAI_PureRandom(x, self);
            });
        },

        tickRound: function () {
            this._willStartOneRound();

            var allunits = this.battleground.getAllUnits();
            while (allunits.length > 0) {
                allunits.sort(function (lhr, rhr) {
                    return rhr.finalAttrs().speed - lhr.finalAttrs().speed;
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

            this._didFinishOneRound();
        },

        _tickUnit: function (unit) {
            if (!unit.canTakeAction())
                return;
            var ai = this.aiMap[unit.unitId()];
            var r = ai.makeDecision();
            var skill = r.skill;
            var target = r.target;
            for (var i = 0; i < skill.effects.length; i++) {
                if (dt.isArray(target)) {
                    for (var j = 0; j < target.length; j++) {
                        skill.effects[i].affectTarget(unit, target[j]);
                    }
                }
                else {
                    skill.effects[i].affectTarget(unit, target);
                }
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

        _willStartOneRound: function () {

        },

        _didFinishOneRound: function () {

        }
    });
});