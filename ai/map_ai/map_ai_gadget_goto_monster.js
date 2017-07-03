/**
 * Created by argulworm on 6/30/17.
 */

dt.registerClassInheritance('dt.AIGadget', function () {
    dt.MapAIGadgetGotoMonster = dt.AIGadget.extend({
        ctor : function (aiRef) {
            this.aiRef = aiRef;
        }
    });
});