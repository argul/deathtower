/**
 * Created by argulworm on 7/20/17.
 */

dt.registerClassInheritance('dt.Cls', function () {
    dt.BaseSkill = dt.Cls.extend({
        ctor: function (skilldata) {
            this.skilldata = skilldata;
            this.targetcode = skilldata.targetcode;
            this.hasCooldown = skilldata.cooldown.hasCooldown;
            this.cooldownRounds = skilldata.cooldown.cooldownRounds;
            this.cooldownLeft = skilldata.cooldown.initialCooldown;
            this._buildupEffects(skilldata.effects);
        },

        getTargetCode: function () {
            return this.targetcode;
        },

        isInCooldown: function () {
            if (!this.hasCooldown)
                return false;
            if (this.cooldownLeft > 0)
                return false;
            return true;
        },

        canUse: function () {
            switch (this.targetcode) {
                default:
                    return true;
            }
        },

        calculateWeight: function (unit, abacusRef, target) {
            return this.skilldata.weight;
        },

        _buildupEffects: function (effectdatas) {
            var effects = [];
            effectdatas.forEach(function (ed) {
                var effectCls = dt.effectClsMap.getCls(ed.effectcode);
                var eftIns = new effectCls();
                eftIns.initWithData(ed);
                effects.push(eftIns);
            });
            this.effects = effects;
        }
    });
});