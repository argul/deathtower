/**
 * Created by argulworm on 6/30/17.
 */

dt.registerClassInheritance('dt.AIGadget', function () {
    dt.MapAIGadgetGotoStair = dt.AIGadget.extend({
        ctor: function (aiRef) {
            this.aiRef = aiRef;
        },

        getDecisions: function () {
            var player = this.aiRef.getAbacusRef().playerStat;
            var mapLevel = this.aiRef.getAbacusRef().mapStat.mapLevel;
            var upstair = this.aiRef.getAbacusRef().mapStat.upstair;

            var path = dt.astar.seekPath(mapLevel, player.posX, player.posY, upstair.x, upstair.y);
            if (!dt.isUndefined(path)) {
                path.forEach(function (t) {
                    t.aicode = dt.mapAIDecisionCode.MOVE;
                });
                path.push({
                    aicode: dt.mapAIDecisionCode.LEAVE_MAP
                });
                return path;
            }
            else {
                var path = dt.astar.seekPath(mapLevel, player.posX, player.posY, upstair.x, upstair.y, function (tile) {
                    return tile != dt.mapconst.TILE_WALL;
                });
                dt.assert(!dt.isUndefined(path));
                path.forEach(function (t) {
                    t.aicode = dt.mapAIDecisionCode.MOVE;
                });
                return path;
            }
        }
    });
});