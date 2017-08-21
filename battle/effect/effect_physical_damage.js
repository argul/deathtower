/**
 * Created by argulworm on 7/25/17.
 */

dt.registerClassInheritance('dt.EffectInterface', function () {
    dt.Effect_PhysicalDamage = dt.EffectInterface.extend({
        initWithData: function (effectdata) {
            this.powerfactor = effectdata.powerfactor;
        },

        affectTarget: function (performer, target) {
            //todo: block, critical, dodge
            var damage = dt.formula.physicalDamage(performer.getFinalAttrs(), target.getFinalAttrs());
            target.doTakeDamage(damage);
        }
    });
});