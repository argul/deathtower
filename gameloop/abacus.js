/**
 * Created by argulworm on 6/29/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.Abacus = dt.Class.extend({
        ctor: function (paramsPack) {
            this.config = {};
            this.config.mapConfig = paramsPack.mapConfig;
            this.config.maxLevel = paramsPack.maxLevel;

            this.ctx = new dt.Context(paramsPack.seed);
            var mapLevel = dt.mapgen.generateMapLevel(paramsPack.mapConfig, this.ctx);
            var stairs = dt.mapassemble.makeStairs(mapLevel, this.ctx);

            this.mapStat = {
                levelNum: 1,
                mapLevel: mapLevel,
                upstair: stairs.up,
                downstair: stairs.down
            };
            this.playerStat = {
                posX: stairs.down.x,
                posY: stairs.down.y
            };
            this.mapAI = new dt.PlayerMapAI(this);
            this.mapExecutor = new dt.PlayerMapExecutor(this);
            this.mapAI.reset();
        },

        tick: function () {

        }
    });
});
