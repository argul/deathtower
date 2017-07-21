/**
 * Created by argulworm on 7/20/17.
 */

dt.registerClassInheritance('dt.Cls', function () {
    dt.BaseSkill = dt.Cls.extend({
        ctor: function (skilldata) {
            this.hasCooldown = skilldata.cooldown.hasCooldown;
            this.cooldownRounds = skilldata.cooldown.cooldownRounds;
            this.cooldownLeft = skilldata.cooldown.initialCooldown;
            this.level = skilldata.level;
            this.effects = skilldata.effects;
        },

        skillLevel: function () {
            return this.level;
        },

        canPerform: function () {
            if (!this.hasCooldown)
                return false;
            if (this.cooldownLeft > 0)
                return false;
            return true;
        },

        buildBHNode: function () {
            var self = this;
            var node = new dt.BHNodeCondAll("skill");
            node.appendJudger(function () {
                return self.canPerform();
            });
            this._buildJudgers().forEach(function (x) {
                node.appendJudger(x);
            });
            node.setTrueClauseNode(this._buildActionNode())
            node.setFalseClauseNode(dt.sharedBHNodes.voidAction);
            return node;
        },

        _buildJudgers: function () {
            return [];
        },

        _buildActionNode: function () {
            dt.assert(false);
        }
    });
});