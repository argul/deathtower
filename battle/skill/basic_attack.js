/**
 * Created by argulworm on 7/20/17.
 */

dt.registerClassInheritance('dt.BaseSkill', function () {
    dt.SkillBasicAttack = dt.BaseSkill.extend({
        _buildJudgers: function () {
            return [];
        },

        _buildActionNode: function () {

        }
    });
});