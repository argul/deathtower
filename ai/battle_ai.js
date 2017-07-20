/**
 * Created by argulworm on 7/20/17.
 */

dt.battleAICode = {
    PERFORM_SKILL: 0
};

dt.registerClassInheritance('dt.AIInterface', function () {
    dt.BattleAI = dt.AIInterface.extend({
        _VERBOSE: false,
        ctor: function (myUnit, abacusRef) {
            this._myUnit = myUnit;
            this._abacusRef = abacusRef;
            this._initBHTree();
        },

        _initBHTree: function () {
            var tree = new dt.BHTree("bhtree" + this._myUnit.unitId());
            var allskills = this._myUnit.allSkills();
            dt.assert(allskills.length > 0);
            allskills.forEach(function (sk) {
                tree.appendNode(sk.buildBHNode());
            });
            this._bhtree = tree;
        },

        getAbacusRef: function () {
            return this._abacusRef;
        },

        makeDecision: function () {
            return this._bhtree.propagate();
        }
    });
});