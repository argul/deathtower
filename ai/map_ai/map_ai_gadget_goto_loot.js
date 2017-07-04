/**
 * Created by argulworm on 6/30/17.
 */

dt.registerClassInheritance('dt.AIGadget', function () {
    dt.MapAIGadgetGotoLoot = dt.AIGadget.extend({
        ctor: function (aiRef) {
            this.aiRef = aiRef;
        },

        getDecisions: function () {
            var player = this.aiRef.getAbacusRef().playerStat;
            var mapLevel = this.aiRef.getAbacusRef().mapStat.mapLevel;
            var loots = Object.keys(this.aiRef.getAbacusRef().mapStat.loots);
            dt.suger.shuffle(loots, this.aiRef.getAbacusRef().ctx);

            while (loots.length > 0) {
                var path = dt.astar.seekPath(mapLevel, player.posX, player.posY, loots[0].x, loots[0].y);
                if (!dt.isUndefined(path)) {
                    path.forEach(function (t) {
                        t.aicode = dt.mapAIDecisionCode.MOVE;
                    });
                    return path;
                }
                loots.shift();
            }

            return undefined;
        }
    });
});