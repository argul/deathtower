/**
 * Created by argulworm on 7/20/17.
 */

dt.registerClassInheritance('dt.AIInterface', function () {
    dt.BattleAI_Interface = dt.AIInterface.extend({
        ctor: function (myUnit, abacusRef) {
            this._myUnit = myUnit;
            this._abacusRef = abacusRef;
        },

        makeDecision: function () {
            var self = this;
            var allskills = this._myUnit.allSkills();
            allskills = allskills.filter(function (sk) {
                if (sk.isInCooldown())
                    return false;
                if (sk.canUse())
                    return false;
                return true;
            });
            allskills = allskills.map(function (sk) {
                var r = sk.calculateWeightAndTarget(self._myUnit, self._abacusRef);
                return {
                    skill: sk,
                    target: r[0],
                    weight: r[1]
                }
            });
            return this._doChooseSkill(allskills);
        },

        _doChooseSkill : function (allskills) {
            dt.assert(false);
        }
    });
});