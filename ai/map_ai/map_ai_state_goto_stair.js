/**
 * Created by argulworm on 6/30/17.
 */

dt.registerClassInheritance('dt.AIStateInterface', function () {
    dt.MapAIStateGotoStair = dt.AIStateInterface.extend({
        ctor : function (aiRef) {
            this.aiRef = aiRef;
        },

        getStateName: function () {
            return 'MapAIStateGotoStair';
        },

        tick: function () {

        }
    });
});