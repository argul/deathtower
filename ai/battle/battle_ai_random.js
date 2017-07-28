/**
 * Created by argulworm on 7/25/17.
 */

dt.registerClassInheritance('dt.BattleAI_Interface', function () {
    dt.BattleAI_PureRandom = dt.BattleAI_Interface.extend({
        _doChooseSkill: function (allskills) {
            var rnd = this._abacusRef.rnd;
            return rnd.randomChoice(allskills);
        }
    });
});