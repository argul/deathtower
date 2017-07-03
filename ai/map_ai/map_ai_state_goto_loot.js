/**
 * Created by argulworm on 6/30/17.
 */

dt.registerClassInheritance('dt.AIStateInterface', function () {
    dt.MapAIStateGotoLoot = dt.AIStateInterface.extend({
        ctor : function (aiRef) {
            this.aiRef = aiRef;
        },

        getStateName: function () {
            return 'MapAIStateGotoLoot';
        },

        tick: function () {

        }
    });
});