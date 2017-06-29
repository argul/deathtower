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
            var map = dt.mapgen.generateMapLevel(paramsPack.mapConfig, this.ctx);
            var stairs = dt.mapassemble.makeStairs(map.mapLevel, map.rooms, this.ctx);

            this.mapStat = {
                level: 1,
                curMap: map,
                upstair: stairs.up,
                downstair: stairs.down
            };
            this.playerStat = {
                posX: stairs.down.x,
                posY: stairs.down.y
            };
        },

        tick: function () {

        }
    });
});
