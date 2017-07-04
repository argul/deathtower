/**
 * Created by argulworm on 6/30/17.
 */

dt.registerClassInheritance('dt.AIGadget', function () {
    dt.MapAIGadgetGotoMonster = dt.AIGadget.extend({
        ctor : function (aiRef) {
            this.aiRef = aiRef;
        },

        getDecisions: function () {
            var player = this.aiRef.getAbacusRef().playerStat;
            var mapLevel = this.aiRef.getAbacusRef().mapStat.mapLevel;
            var monsters = Object.keys(this.aiRef.getAbacusRef().mapStat.monsters);
            dt.suger.shuffle(monsters, this.aiRef.getAbacusRef().ctx);

            while (monsters.length > 0) {
                var path = dt.astar.seekPath(mapLevel, player.posX, player.posY, monsters[0].x, monsters[0].y);
                if (!dt.isUndefined(path)) {
                    path.forEach(function (t) {
                        t.aicode = dt.mapAIDecisionCode.MOVE;
                    });
                    return path;
                }
                monsters.shift();
            }

            return undefined;
        }
    });
});